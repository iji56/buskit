import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  SafeAreaView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {TabView, TabBar} from 'react-native-tab-view';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import styles from './styles';
import Colors from '../../Res/Colors';
import Fonts from '../../Res/Fonts';
import Strings from '../../Res/String';
import I18n from '../../Config/I18n';
import OpenAppSettings from 'react-native-app-settings';
import {stat} from 'react-native-fs';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {
  timeout,
  processResponse,
  formatBytes,
} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';

const routes = [
  {key: 'Images', title: 'Images'},
  {key: 'Videos', title: 'Videos'},
];

const Home = props => {
  const [user, setUser] = useState('');
  const [index, setIndex] = useState(0);
  const tabRef = useRef(null);

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Preload data using AsyncStorage
    AsyncStorage.getItem('UserDetails', (err, result) => {
      if (err === null) {
        let res = JSON.parse(result);
        setUser(res);
        BuskerGalleryApi(res, 'image');
        BuskerGalleryApi(res, 'video');
      }
    });
  }, []);

  useFocusEffect(React.useCallback(() => {}, []));

  //Select Photo or Video Function
  const selectTapped = async type => {
    let options = {
      quality: 1.0,
      storageOptions: {
        skipBackup: true,
        path: type == 'image' ? 'image' : 'video',
      },
      mediaType: type == 'image' ? 'image' : 'video',
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User Cancelled Picker');
      } else if (response.error) {
        console.log('Picker Error: ', response.error);
        showAlert();
      } else if (response.customButton) {
        console.log('User Tapped Custom Button: ', response.customButton);
      } else {
        console.log('response', response.assets[0].uri);
        console.log('filepath ', response.path);
        getFileSize(response, type);
      }
    });
  };

  const getFileSize = async (response, type) => {
    let statResult = await stat(response.path);
    console.log('file size: ' + statResult.size);
    let fileSize = formatBytes(statResult.size);
    console.log('File Actual: ' + fileSize);
    if (statResult.size <= 52428800) {
      if (type == 'image') {
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        //modify the object however you want to here
        let formdata = new FormData();
        if (response.assets[0].uri != '') {
          formdata.append('post_type', 'image');
          formdata.append('thumbnail', 'image');
          formdata.append('image', {
            uri: response.assets[0].uri,
            name: 'image.png',
            type: 'image/png',
          });
        }
        UploadApi(formdata, 'image');
      } else {
        //modify the object however you want to here
        let formdata = new FormData();
        if (response.assets[0].uri != '') {
          formdata.append('post_type', 'video');
          formdata.append('thumbnail', 'video');
          formdata.append('image', {
            uri: response.assets[0].uri,
            name: 'video.mp4',
            type: 'video/mp4',
          });
        }
        UploadApi(formdata, 'video');
      }
    } else {
      toast.current.show(
        'Please select file less or equal to 5MB',
        2000,
        () => {},
      );
    }
  };

  const showAlert = () => {
    Alert.alert(
      I18n.t('storage.storage_alert'),
      I18n.t('storage.generic_permission'),
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: I18n.t('storage.open_settings'),
          onPress: () => OpenAppSettings.open(),
        },
      ],
    );
  };

  //******************** Hit Fav Buskers Api *******************
  const BuskerGalleryApi = async (data, type) => {
    setLoading(true);
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.buskerGallery + data.id,
    );
    timeout(
      10000,
      fetch(
        constants.baseUrl +
          constants.api.buskerGallery +
          '?busker_id=' +
          data.id +
          '&post_type=' +
          type,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.access_token}`,
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
            if (type == 'image') setImages(data.data);
            else setVideos(data.data);
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

  //******************** Hit Fav Buskers Api *******************
  const UploadApi = async (data, type) => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.buskerUpload);
    console.log('Data', JSON.stringify(data));
    timeout(
      30 * 10000,
      fetch(constants.baseUrl + constants.api.buskerUpload, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.access_token}`,
        },
        body: data,
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
            if (type === 'image') BuskerGalleryApi(user, 'image');
            else BuskerGalleryApi(user, 'video');
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

  //******************** Hit Delete Gallery Api ***********************
  const GalleryDeleteApi = async item => {
    let data = {
      gallery_id: item.id,
    };
    setLoading(true);
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.buskerGalleryDelete,
    );
    console.log('galleryId', data);
    timeout(
      10000,
      fetch(
        constants.baseUrl +
          constants.api.buskerGalleryDelete +
          '?gallery_id=' +
          item.id,
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
            handleRemovePost(item);
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

  const handleRemovePost = item => {
    if (item.post_type == 'image') {
      let dataBuskers = images;
      let index = dataBuskers.indexOf(item);
      console.log('pos', index);
      if (index !== -1) {
        if (index == 0 && images.length == 1) {
          setImages([]);
        } else {
          dataBuskers.splice(index, 1); //to remove a single item starting at index
          setImages(dataBuskers);
        }
      }
    } else {
      let dataBuskers = videos;
      let index = dataBuskers.indexOf(item);
      console.log('pos', index);
      if (index !== -1) {
        if (index == 0 && videos.length == 1) {
          setVideos([]);
        } else {
          dataBuskers.splice(index, 1); //to remove a single item starting at index
          setVideos(dataBuskers);
        }
      }
    }
  };

  // TabBar Routes Scenes and Custom Functions
  const renderScene = ({route, jumpTo}) => {
    switch (route.key) {
      case 'Images':
        return <ImagesRoute navigation={props.navigation} />;
      case 'Videos':
        return <VideosRoute navigation={props.navigation} />;
    }
  };

  const renderTabBar = props => {
    return (
      <>
        <TabBar
          {...props}
          indicatorStyle={{backgroundColor: Colors.white}}
          activeColor={Colors.white}
          inactiveColor={Colors.lightgrey}
          style={{
            backgroundColor: Colors.theme,
            height: 45,
            alignContent: 'flex-start',
          }}
          renderLabel={renderLabel()}
        />
        <View
          style={{borderBottomColor: Colors.blacklight, borderBottomWidth: 1}}
        />
      </>
    );
  };

  const renderLabel = props => {
    return ({route, focused, color}) => (
      <Text
        {...props}
        style={{
          alignSelf: 'flex-start',
          color: color,
          fontFamily: Fonts.PoppinsSemiBold,
          fontSize: 16,
        }}>
        {route.title == 'Images'
          ? route.title + '(' + images.length + ')'
          : route.title + '(' + videos.length + ')'}
      </Text>
    );
  };

  // Image Route UI Component
  const ImagesRoute = props => {
    return (
      <>
        {images.length == 0 && (
          <View style={commonStyles.emptyView}>
            <Image
              style={commonStyles.ImageStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/app_logo.png')}
            />
            <Text style={commonStyles.EmptyText}>{'No Images'}</Text>
          </View>
        )}
        {images.length != 0 && (
          <FlatList
            showsVerticalScrollIndicator={false}
            bounces={false}
            overScrollMode={'never'}
            contentContainerStyle={{paddingVertical: 10}}
            //style={{alignSelf: 'center', flex: 1}}
            data={images}
            numColumns={2}
            renderItem={({item, pos}) => imageItem(item, pos)}
            keyExtractor={item => item.keyExtractor}
          />
        )}
      </>
    );
  };
  // Video Route UI Component
  const VideosRoute = props => {
    return (
      <>
        {videos.length == 0 && (
          <View style={commonStyles.emptyView}>
            <Image
              style={commonStyles.ImageStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/app_logo.png')}
            />
            <Text style={commonStyles.EmptyText}>{'No Vidoes'}</Text>
          </View>
        )}
        {videos.length != 0 && (
          <FlatList
            showsVerticalScrollIndicator={false}
            bounces={false}
            overScrollMode={'never'}
            contentContainerStyle={{paddingVertical: 10}}
            //style={{alignSelf: 'center'}}
            data={videos}
            numColumns={2}
            renderItem={({item, pos}) => videoItem(item, pos)}
            keyExtractor={item => item.keyExtractor}
          />
        )}
      </>
    );
  };

  // Row Component for Images
  const imageItem = (item, pos) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.rowContainer}
          activeOpacity={0.8}
          onPress={() => {
            props.navigation.navigate('FullImage', {
              imageURLs: images,
              pos: 0,
            });
            //props.navigation.navigate('FullImage', {imageURL: item.images});
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
              source={{uri: item.images}}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rowIconBack}
          activeOpacity={0.8}
          onPress={() => {
            GalleryDeleteApi(item);
          }}>
          <Image
            style={styles.rowIconStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/ic_close.png')}
          />
        </TouchableOpacity>
      </View>
    );
  };
  // Row Component for Videos
  const videoItem = (item, pos) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.rowContainer}
          activeOpacity={0.8}
          onPress={() => {
            props.navigation.navigate('VideoPlayer', {videoURL: item.videos});
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
              source={{uri: item.thumbnail_image}}
            />
            <Image
              style={styles.rowPlayImage}
              resizeMode={'contain'}
              source={require('../../Assets/Images/play_button.png')}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rowIconBack}
          activeOpacity={0.8}
          onPress={() => {
            GalleryDeleteApi(item);
          }}>
          <Image
            style={styles.rowIconStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/ic_close.png')}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.viewcontainer}>
      <CustomStatusBar color={Colors.theme} />
      <View style={styles.headerRowStyle}>
        <TouchableOpacity
          style={styles.backImageBack}
          activeOpacity={0.8}
          onPress={() => props.navigation.goBack()}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.titleText}>{I18n.t('account.my_gallery')}</Text>
        <TouchableOpacity
          style={styles.menuImageBack}
          onPress={() => {
            if (index == 0) selectTapped('image');
            else selectTapped('video');
          }}>
          <Text style={styles.menuText}>{'Add'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.viewStyle}>
        <TabView
          ref={tabRef}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={renderTabBar}
          swipeEnabled={false}
        />
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
