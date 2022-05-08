import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  AsyncStorage,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import Moment from 'moment';
import I18n from '../../Config/I18n';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';

const ResetPassword = props => {
  const {event, type, action} = props.route.params;
  const [user, setUser] = useState(null);
  const [item, setItem] = useState(null);
  const [images, setImages] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  //const user = useSelector(state => state.user);

  useEffect(() => {}, []);

  useFocusEffect(
    React.useCallback(() => {
      // Preload data using AsyncStorage
      AsyncStorage.getItem('UserDetails', (err, result) => {
        if (err === null) {
          let res = JSON.parse(result);
          setUser(res);
          EventDetailApi(res);
        }
      });
    }, []),
  );

  const checkEvent = () => {
    if (item != '') {
      props.navigation.navigate('NewEvent', {eventItem: item});
      // let nowDate = new Date(Date.now()).getTime();
      // let eventDate = new Date(item.event_date).getTime();
      // console.log('dates:', nowDate + ',' + eventDate);
      // if (nowDate < eventDate)
      //   props.navigation.navigate('NewEvent', {eventItem: item});
      // else toast.current.show("Event Can't be edited.", 2000, () => {});
    }
  };

  //******************** Hit EventDetail Api *******************
  const EventDetailApi = async user => {
    setLoading(true);
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.buskerEventDetails + event.id,
    );
    timeout(
      10000,
      fetch(
        constants.baseUrl +
          constants.api.buskerEventDetails +
          '?event_id=' +
          event.id,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.access_token}`,
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
            setItem(data);
            setImages(data.event_gallery);
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

  // Row Component for Gallery
  const galleryItem = (item, pos) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.rowImageContainer}
          activeOpacity={0.8}
          onPress={() => {
            let imageData = [];
            images.forEach(element => {
              imageData.push(element.gallery);
            });
            props.navigation.navigate('FullImage', {
              imageURLs: imageData,
              pos: imageData.findIndex(images => images == item.gallery),
            });
            //props.navigation.navigate('FullImage', {imageURL: item.gallery});
          }}>
          <View style={styles.rowImageView}>
            <Image
              style={styles.rowImageView}
              resizeMode={'cover'}
              source={require('../../Assets/Images/thumbImage.png')}
            />
            <Image
              style={[styles.rowImageView, {position: 'absolute'}]}
              resizeMode={'cover'}
              source={{
                uri: item.gallery,
              }}
            />
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.rowCloseBack}
          activeOpacity={0.8}
          onPress={() => {
            GalleryDeleteApi(item);
          }}>
          <Image
            style={styles.rowCloseImage}
            resizeMode={'contain'}
            source={require('../../Assets/Images/ic_close.png')}
          />
        </TouchableOpacity> */}
      </View>
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
        <Text style={styles.titleText}>{I18n.t('events.event_details')}</Text>
        {type == 'user' && <View style={styles.backImageBack} />}
        {type == 'busker' && action == 'new' && (
          <TouchableOpacity
            style={styles.backImageBack}
            onPress={() => {
              checkEvent();
            }}>
            <Image
              style={styles.backImageStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_edit_btn.png')}
            />
          </TouchableOpacity>
        )}
        {type == 'busker' && action == 'past' && (
          <View style={styles.backImageBack} />
        )}
      </View>
      <View style={styles.viewStyle}>
        <View style={styles.eventContainer}>
          <TouchableOpacity
            style={styles.bannerConatiner}
            activeOpacity={0.8}
            onPress={() => {
              if (item != null && item.banner_image != '') {
                props.navigation.navigate('FullImage', {
                  imageURLs: [item.banner_image],
                  pos: 0,
                });
              }
              // props.navigation.navigate('FullImage', {
              //   imageURL: item.banner_image,
              // });
            }}>
            <Image
              style={styles.bannerStyle}
              resizeMode={'cover'}
              source={require('../../Assets/Images/thumbImage.png')}
            />
            <Image
              style={[styles.bannerStyle, {position: 'absolute'}]}
              resizeMode={'cover'}
              source={{
                uri: item != null ? item.banner_image : 'image',
              }}
            />
          </TouchableOpacity>

          <ScrollView
            style={styles.viewStyle}
            showsVerticalScrollIndicator={false}
            bounces={false}
            keyboardShouldPersistTaps={'handled'}
            overScrollMode="never">
            <View style={styles.detailViewStyle}>
              <Text style={styles.eventTextStyle}>
                {item != null ? item.event_name : 'Event Name'}
              </Text>
              <Text style={styles.descTextStyle}>
                {item != null ? item.description : 'Event Description'}
              </Text>
            </View>

            <View style={styles.dividerViewStyle} />

            {images.length != 0 && (
              <>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  bounces={false}
                  overScrollMode={'never'}
                  contentContainerStyle={{
                    paddingEnd: 5,
                    paddingTop: 5,
                    paddingStart: 5,
                  }}
                  data={images}
                  horizontal={true}
                  renderItem={({item, pos}) => galleryItem(item, pos)}
                  keyExtractor={item => item.keyExtractor}
                />
                <View style={styles.dividerViewStyle} />
              </>
            )}

            {/* <View style={styles.rowViewStyle} /> */}
            <View style={styles.dateViewStyle}>
              <Image
                style={styles.rowIconStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_calendar.png')}
              />
              {item == null && (
                <Text style={styles.detailTextStyle}>{'Event Date'}</Text>
              )}
              {item != null && (
                <>
                  <Text style={styles.detailTextStyle}>
                    {item.event_date != null
                      ? Moment(item.event_date).format('ll')
                      : 'start-date'}
                  </Text>
                  <Text style={[styles.detailTextStyle, {marginHorizontal: 0}]}>
                    {item.event_end_date != null
                      ? Moment(item.event_date).format('ll') !=
                        Moment(item.event_end_date).format('ll')
                        ? 'to'
                        : ''
                      : ''}
                  </Text>
                  <Text style={styles.detailTextStyle}>
                    {item.event_end_date != null &&
                    Moment(item.event_date).format('ll') !=
                      Moment(item.event_end_date).format('ll')
                      ? Moment(item.event_end_date).format('ll')
                      : ''}
                  </Text>
                </>
              )}
            </View>
            <View style={styles.timeViewStyle}>
              <Image
                style={styles.rowIconStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_watch.png')}
              />
              <Text style={styles.detailTextStyle}>
                {item != null
                  ? Moment(item.start_time, ['hh:mm:ss']).format('LT') +
                    ' to ' +
                    Moment(item.end_time, ['hh:mm:ss']).format('LT')
                  : 'Event Time'}
              </Text>
            </View>
            <View style={styles.infoViewStyle}>
              <Image
                style={styles.rowIconStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_location.png')}
              />
              <Text style={styles.detailTextStyle}>
                {item != null ? item.address : 'Event Location'}
              </Text>
            </View>

            {type == 'user' && (
              <>
                <View style={styles.dividerViewStyle} />
                <TouchableOpacity
                  style={styles.rowViewStyle}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (item.buskerdata != null)
                      props.navigation.navigate('BuskerDetail', {
                        item: item.buskerdata,
                        type: 'normal',
                      });
                  }}>
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
                          item != null
                            ? item.buskerdata != null
                              ? item.buskerdata.profile_img
                              : 'image'
                            : 'image',
                      }}
                    />
                  </View>
                  <View style={styles.detailRowStyle}>
                    <Text style={styles.nameTextStyle}>
                      {item != null
                        ? item.buskerdata != null
                          ? item.buskerdata.name
                          : 'Busker Name'
                        : 'Busker Name'}
                    </Text>
                    <Text style={styles.typeTextStyle}>
                      {item != null
                        ? item.buskerdata != null
                          ? item.buskerdata.other_cat_name != null
                            ? item.buskerdata.other_cat_name
                            : item.buskerdata.categorydata != null
                            ? item.buskerdata.categorydata.category
                            : 'Artist'
                          : 'Artist'
                        : 'Artist'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>

          {type == 'user' && (
            <TouchableOpacity
              style={styles.tipContainer}
              activeOpacity={0.7}
              onPress={() => {
                if (item.buskerdata != null)
                  props.navigation.navigate('TipPayment', {
                    id: item.buskerdata.id,
                    name: item.buskerdata.name,
                  });
              }}>
              <Text style={styles.tipText}>{I18n.t('events.tip_busker')}</Text>
            </TouchableOpacity>
          )}
        </View>
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

export default ResetPassword;
