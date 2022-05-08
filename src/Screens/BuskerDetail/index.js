import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
  AsyncStorage,
  SafeAreaView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import I18n from '../../Config/I18n';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';

import {useSelector, useDispatch} from 'react-redux';
import {addEventId} from '../../Redux/Actions';
import firebaseSvc from '../../Components/FirebaseSvc';

const Home = props => {
  const {item, type} = props.route.params;
  const [chatUser, setChatUser] = useState('');
  const [user, setUser] = useState('');
  const [busker, setBusker] = useState(null);
  const [images, setImages] = useState([]);
  const [eventId, setEventId] = useState('');

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  const event = useSelector(state => state.event);
  const eventID = useSelector(state => state.eventId);
  const firebaseUser = useSelector(state => state.firebase);
  const dispatch = useDispatch();

  useEffect(() => {
    // Setting initail event Id
    setEventId(eventID);
    console.log('Firebase', firebaseUser);
    // Preload data using AsyncStorage
    AsyncStorage.getItem('FirebaseUser', (err, result) => {
      if (err === null) {
        let res = JSON.parse(result);
        console.log('Firebase User', res);
        setChatUser(res);
      }
    });
    // Preload data using AsyncStorage
    AsyncStorage.getItem('UserDetails', (err, result) => {
      if (err === null) {
        let res = JSON.parse(result);
        setUser(res);
        if (item.id != 0) {
          BuskerDetailApi(res.id);
          BuskerGalleryApi();
        }
      }
    });
  }, []);

  // Function to open chat
  const openChatRoom = () => {
    let room = firebaseSvc.setChatRoom(user.id, item.id);
    console.log('Room Ref:' + room);
    props.navigation.navigate('ChatScreen', {
      user: chatUser,
      chatRoom: user.id + '-' + item.id,
      senderId: user.id,
      receiverId: item.id,
      receiverName: item.name,
    });
  };

  // Function to open link
  const OpenURLButton = async url => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
    // useCallback(async () => {}, [url]);
    // return <Button title={children} onPress={handlePress} />;
  };

  //******************** Hit BuskerDetail Api *******************
  const BuskerDetailApi = async userId => {
    setLoading(true);
    console.log(
      'ApiCall',
      constants.baseUrl +
        constants.api.getBuskerDetail +
        '?busker_id=' +
        item.id +
        '&user_id=' +
        userId,
    );
    timeout(
      10000,
      fetch(
        constants.baseUrl +
          constants.api.getBuskerDetail +
          '?busker_id=' +
          item.id +
          '&user_id=' +
          userId,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
          },
        },
      ),
    )
      .then(processResponse)
      .then(res => {
        const {responseCode, responseJson} = res;
        console.log(
          'response',
          responseCode + '' + JSON.stringify(responseJson),
        );
        setLoading(false);
        if (responseCode === 200) {
          if (responseJson.success == 'true') {
            var data = responseJson.data;
            setBusker(data);
          } else {
            toast.current.show(responseJson.message, 2000, () => {});
          }
        } else {
          if (responseJson.hasOwnProperty('message')) {
            toast.current.show(responseJson.message, 2000, () => {});
          } else {
            var key;
            var secondKey;
            for (var k in responseJson) {
              key = k;
              break;
            }
            for (var k in responseJson[key]) {
              secondKey = k;
              break;
            }
            toast.current.show(responseJson[key][secondKey][0], 2000, () => {});
          }
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        toast.current.show(err.message, 2000, () => {});
      });
  };

  //******************** Hit BuskerGallery Api *******************
  const BuskerGalleryApi = async () => {
    setLoading(true);
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.buskerGalleryDetail + item.id,
    );
    timeout(
      10000,
      fetch(
        constants.baseUrl +
          constants.api.buskerGalleryDetail +
          '?busker_id=' +
          item.id,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
          },
        },
      ),
    )
      .then(processResponse)
      .then(res => {
        const {responseCode, responseJson} = res;
        console.log(
          'response',
          responseCode + '' + JSON.stringify(responseJson),
        );
        setLoading(false);
        if (responseCode === 200) {
          if (responseJson.success == 'true') {
            var data = responseJson.data.data;
            setImages(data);
          } else {
            toast.current.show(responseJson.message, 2000, () => {});
          }
        } else {
          if (responseJson.hasOwnProperty('message')) {
            toast.current.show(responseJson.message, 2000, () => {});
          } else {
            var key;
            var secondKey;
            for (var k in responseJson) {
              key = k;
              break;
            }
            for (var k in responseJson[key]) {
              secondKey = k;
              break;
            }
            toast.current.show(responseJson[key][secondKey][0], 2000, () => {});
          }
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        toast.current.show(err.message, 2000, () => {});
      });
  };

  // Function to check Event
  const checkEventForHire = () => {
    if (eventId == 0 || eventId == undefined) {
      CreateEventApi(event);
    } else {
      HireBuskerApi(eventId);
    }
  };

  //******************** Hit create event Api *******************
  const CreateEventApi = async data => {
    let IdList = data.busker_type;
    let formdata = new FormData();
    formdata.append('event_type', data.event_type);
    formdata.append('description', data.description);
    formdata.append('event_location', data.event_location);
    formdata.append('latitude', data.latitude);
    formdata.append('longitude', data.longitude);
    formdata.append('event_date', data.event_date);
    formdata.append('event_end_date', data.event_end_date);
    formdata.append('start_time', data.start_time);
    formdata.append('end_time', data.end_time);
    formdata.append('guest_size', data.guest_size);
    formdata.append('hourly_rate', data.hourly_rate);
    IdList.forEach(element => {
      formdata.append('busker_type[]', element);
    });
    setLoading(true);
    console.log('data', JSON.stringify(formdata));
    console.log('ApiCall', constants.baseUrl + constants.api.createUserEvent);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.createUserEvent, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.access_token}`,
        },
        //body: JSON.stringify(data),
        body: formdata,
      }),
    )
      .then(processResponse)
      .then(res => {
        const {responseCode, responseJson} = res;
        console.log(
          'response',
          responseCode + '' + JSON.stringify(responseJson),
        );
        setLoading(false);
        if (responseCode === 200) {
          if (responseJson.success == 'true') {
            var data = responseJson.data;
            dispatch(addEventId(data.event_id));
            setEventId(data.event_id);
            HireBuskerApi(data.event_id);
          } else {
            toast.current.show(responseJson.message, 2000, () => {});
          }
        } else {
          if (responseJson.hasOwnProperty('message')) {
            toast.current.show(responseJson.message, 2000, () => {});
          } else {
            var key;
            var secondKey;
            for (var k in responseJson) {
              key = k;
              break;
            }
            for (var k in responseJson[key]) {
              secondKey = k;
              break;
            }
            toast.current.show(responseJson[key][secondKey][0], 2000, () => {});
          }
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        toast.current.show(err.message, 2000, () => {});
      });
  };

  //******************** Hit Hire Busker Api *******************
  const HireBuskerApi = async eventId => {
    let data = {
      event_id: eventId,
      busker_id: busker.id,
    };
    setLoading(true);
    console.log('data', data);
    console.log('ApiCall', constants.baseUrl + constants.api.buskerHireRequest);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.buskerHireRequest, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify(data),
      }),
    )
      .then(processResponse)
      .then(res => {
        const {responseCode, responseJson} = res;
        console.log(
          'response',
          responseCode + '' + JSON.stringify(responseJson),
        );
        setLoading(false);
        if (responseCode === 200) {
          if (responseJson.success == 'true') {
            var data = responseJson.data;
            toast.current.show(responseJson.message, 2000, () => {});
            setTimeout(() => {
              props.navigation.goBack(null);
            }, 1000);
          } else {
            toast.current.show(responseJson.message, 2000, () => {});
          }
        } else {
          if (responseJson.hasOwnProperty('message')) {
            toast.current.show(responseJson.message, 2000, () => {});
          } else {
            var key;
            var secondKey;
            for (var k in responseJson) {
              key = k;
              break;
            }
            for (var k in responseJson[key]) {
              secondKey = k;
              break;
            }
            toast.current.show(responseJson[key][secondKey][0], 2000, () => {});
          }
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        toast.current.show(err.message, 2000, () => {});
      });
  };

  //******************** Hit Favorite Api ***********************
  const FavoriteApi = async status => {
    let data = {
      user_id: user.id,
      busker_id: item.id,
      favorite_status: status,
    };
    setLoading(true);
    console.log('data', data);
    console.log('ApiCall', constants.baseUrl + constants.api.addFavorite);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.addFavorite, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify(data),
      }),
    )
      .then(processResponse)
      .then(res => {
        const {responseCode, responseJson} = res;
        console.log(
          'response',
          responseCode + '' + JSON.stringify(responseJson),
        );
        setLoading(false);
        if (responseCode === 200) {
          if (responseJson.success == 'true') {
            var data = responseJson.data;
            //toast.current.show(responseJson.message, 2000, () => {});
            BuskerDetailApi(user.id);
          } else {
            toast.current.show(responseJson.message, 2000, () => {});
          }
        } else {
          if (responseJson.hasOwnProperty('message')) {
            toast.current.show(responseJson.message, 2000, () => {});
          } else {
            var key;
            var secondKey;
            for (var k in responseJson) {
              key = k;
              break;
            }
            for (var k in responseJson[key]) {
              secondKey = k;
              break;
            }
            toast.current.show(responseJson[key][secondKey][0], 2000, () => {});
          }
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        toast.current.show(err.message, 2000, () => {});
      });
  };

  // Handle Like Post
  const handleLikePost = status => {
    item.favorite = status === 1 ? '1' : '0';
    busker.total_fans =
      status == 1 ? busker.total_fans + 1 : busker.total_fans - 1;
    setBusker(busker);
  };

  // Busker Gallery Row Item
  const rowItem = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.galleryContainer}
        activeOpacity={0.6}
        onPress={() => {
          if (item.post_type == 'video') {
            props.navigation.navigate('VideoPlayer', {
              videoURL: item.post_data,
            });
          } else {
            let imageData = [];
            images.forEach(element => {
              if (element.post_type != 'video')
                imageData.push(element.post_data);
            });
            props.navigation.navigate('FullImage', {
              imageURLs: imageData,
              pos: imageData.findIndex(images => images == item.post_data),
            });
            //props.navigation.navigate('FullImage', {imageURL: item.post_data});
          }
        }}>
        <Image
          style={styles.galleryImageStyle}
          resizeMode={'cover'}
          source={require('../../Assets/Images/thumbImage.png')}
        />
        <Image
          style={[styles.galleryImageStyle, {position: 'absolute'}]}
          resizeMode={'cover'}
          source={{
            uri:
              item.post_type == 'image' ? item.post_data : item.thumbnail_image,
          }}
        />
        {item.post_type == 'video' && (
          <Image
            style={styles.galleryPlayImage}
            resizeMode={'contain'}
            source={require('../../Assets/Images/play_button.png')}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.viewcontainer}>
      <CustomStatusBar color={Colors.theme} />
      <View style={styles.headerRowStyle}>
        <TouchableOpacity
          style={styles.backImageBack}
          onPress={() => {
            props.navigation.goBack();
          }}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.titleText}>
          {busker != null ? busker.name : 'Busker Name'}
        </Text>
        <TouchableOpacity
          style={styles.heartImageBack}
          onPress={() => {
            if (busker.favorite == null) FavoriteApi(1);
            else {
              if (busker.favorite == '1') FavoriteApi(0);
              else FavoriteApi(1);
            }
          }}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={
              busker != null
                ? busker.favorite != null
                  ? busker.favorite == '1'
                    ? require('../../Assets/Images/heart_filled.png')
                    : require('../../Assets/Images/heart_empty.png')
                  : require('../../Assets/Images/heart_empty.png')
                : require('../../Assets/Images/heart_empty.png')
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backImageBack}
          onPress={() => {
            openChatRoom();
          }}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/message_icon.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.viewStyle}>
        {/* Detail Conatiner */}
        <View style={styles.rowContainer}>
          <View style={styles.rowImageStyle}>
            <Image
              style={styles.rowImageStyle}
              resizeMode={'cover'}
              source={require('../../Assets/Images/profileImage.png')}
            />
            <Image
              style={[styles.rowImageStyle, {position: 'absolute'}]}
              resizeMode={'cover'}
              source={{
                uri:
                  busker != null
                    ? busker.profile_img != null
                      ? busker.profile_img
                      : 'image'
                    : 'image',
              }}
            />
          </View>
          <View style={styles.detailViewStyle}>
            <Text style={styles.nameTextStyle}>
              {busker != null ? busker.stagename : 'stagename'}
            </Text>
            <Text style={styles.typeTextStyle}>
              {busker != null
                ? busker.other_cat_name != null
                  ? busker.other_cat_name
                  : busker.genersdata.name
                : 'artist'}
            </Text>
            <View style={styles.rowViewStyle}>
              <Image
                style={styles.rowIconStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_location.png')}
              />
              <Text
                style={styles.boldTextStyle}
                numberOfLines={1}
                ellipsizeMode={'tail'}>
                {busker != null ? busker.address : 'address'}
              </Text>
            </View>

            <View style={styles.rowViewStyle}>
              <Image
                style={styles.rowIconStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_camera.png')}
              />
              <Text style={styles.lightTextStyle}>
                {busker != null ? busker.total_posts + ' Posts' : '0 Posts'}
              </Text>
            </View>

            <View style={styles.rowViewStyle}>
              <Image
                style={styles.rowIconStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/heart_empty.png')}
              />
              <Text style={styles.lightTextStyle}>
                {busker != null ? busker.total_fans + ' Fans' : '0 Fans'}
              </Text>
            </View>
            <View style={styles.rowViewStyle}>
              <Text style={styles.priceTextStyle}>
                {busker != null
                  ? I18n.t('common.currency') +
                    busker.hourly_rate +
                    I18n.t('common.hour_basis')
                  : '$0'}
              </Text>
              {/* <Text style={styles.lightTextStyle}>
                {busker != null
                  ? Math.round(busker.distance * 100) / 100
                  : '0' + ' ' + I18n.t('common.distance')}
              </Text> */}
            </View>
          </View>
        </View>
        <ScrollView>
          <Text
            style={styles.descTextStyle}
            numberOfLines={4}
            ellipsizeMode={'tail'}>
            {busker != null
              ? busker.busker_bio != null && busker.busker_bio != ''
                ? busker.busker_bio
                : 'Bio Yet Not Added!'
              : 'Bio Yet Not Added!'}
          </Text>
          {/* Social Container */}
          <View style={styles.socialViewStyle}>
            <TouchableOpacity
              style={styles.socialConatiner}
              activeOpacity={0.8}
              onPress={() => {
                if (busker.instagram_url != null && busker.instagram_url != '')
                  OpenURLButton(busker.instagram_url);
              }}>
              <Image
                style={styles.socialImageStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/instagram_logo.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialConatiner}
              activeOpacity={0.8}
              onPress={() => {
                if (busker.twitter_url != null && busker.twitter_url != '')
                  OpenURLButton(busker.twitter_url);
              }}>
              <Image
                style={styles.socialImageStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/twitter_logo.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialConatiner}
              activeOpacity={0.8}
              onPress={() => {
                if (busker.youtube_url != '' && busker.youtube_url != '')
                  OpenURLButton(busker.youtube_url);
              }}>
              <Image
                style={styles.socialImageStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/youtube_logo.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialConatiner}
              activeOpacity={0.8}
              onPress={() => {
                if (busker.facebook_url != null && busker.facebook_url != '')
                  OpenURLButton(busker.facebook_url);
              }}>
              <Image
                style={styles.socialImageStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/facebook_logo.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialConatiner}
              activeOpacity={0.8}
              onPress={() => {
                if (
                  busker.soundcloud_url != null &&
                  busker.soundcloud_url != ''
                )
                  OpenURLButton(busker.soundcloud_url);
              }}>
              <Image
                style={styles.socialImageStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/soundcloud_logo.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialConatiner}
              activeOpacity={0.8}
              onPress={() => {
                if (
                  busker.appleMusic_url != null &&
                  busker.appleMusic_url != ''
                )
                  OpenURLButton(busker.appleMusic_url);
              }}>
              <Image
                style={styles.socialImageStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/music_logo.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialConatiner}
              activeOpacity={0.8}
              onPress={() => {
                if (busker.spotify_url != null && busker.spotify_url != '')
                  OpenURLButton(busker.spotify_url);
              }}>
              <Image
                style={styles.socialImageStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/spotify_logo.png')}
              />
            </TouchableOpacity>
          </View>
          {/* Button Conatiner */}
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.tipContainer}
              activeOpacity={0.7}
              onPress={() => {
                props.navigation.navigate('TipPayment', {
                  id: item.id,
                  name: item.name,
                });
              }}>
              <Text style={styles.tipText}>{I18n.t('busker.tip_me')}</Text>
            </TouchableOpacity>
            {type == 'hire' && (
              <TouchableOpacity
                style={styles.hireContainer}
                activeOpacity={0.7}
                onPress={() => {
                  checkEventForHire();
                }}>
                <Text style={styles.hireText}>{I18n.t('busker.hire_me')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.scheduleContainer}
              activeOpacity={0.7}
              onPress={() => {
                props.navigation.navigate('BuskerSchedule', {
                  buskerId: busker.id,
                  buskerName: busker.name,
                });
              }}>
              <Text style={styles.scheduleText}>
                {I18n.t('busker.view_schedule')}
              </Text>
            </TouchableOpacity>
          </View>
          {/* Gallery Container */}
          <View
            style={styles.galleryViewStyle}
            showsVerticalScrollIndicator={false}
            bounces={false}
            overScrollMode="never">
            <Text style={styles.galleryTextStyle}>Gallery</Text>
            {images.length == 0 && (
              <Text style={styles.emptyGalleryText}>No Post Found</Text>
            )}
            {images.length != 0 && (
              <FlatList
                showsVerticalScrollIndicator={false}
                bounces={false}
                overScrollMode={'never'}
                contentContainerStyle={{paddingBottom: 5}}
                style={{alignSelf: 'center'}}
                data={images}
                numColumns={3}
                renderItem={({item, pos}) => rowItem(item, pos)}
                keyExtractor={item => item.keyExtractor}
              />
            )}
          </View>
        </ScrollView>
      </View>
      <Toast
        ref={toast}
        style={commonStyles.toastStyle}
        textStyle={commonStyles.toastTextStyle}
      />
      {isLoading && (
        <View style={commonStyles.loaderStyle}>
          <DotIndicator color={Colors.theme} size={15} count={4} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Home;
