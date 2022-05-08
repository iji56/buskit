import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  AsyncStorage,
  Modal,
  Alert,
  SafeAreaView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import Fonts from '../../Res/Fonts';
import {Switch} from 'react-native-switch';
import {googleSignInwebClientId} from '../../Components/GoogleSignDetails';
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
import I18n from '../../Config/I18n';
import OpenAppSettings from 'react-native-app-settings';
import {stat} from 'react-native-fs';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import DeviceInfo from 'react-native-device-info';
import {GoogleSignin} from 'react-native-google-signin';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';

import {useSelector, useDispatch} from 'react-redux';
import {deleteUser, deleteFirebase} from '../../Redux/Actions';

const Home = props => {
  const [deviceToken, setDeviceToken] = useState('');
  const [user, setUser] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pic, setPic] = useState(null);
  const [allowPush, setAllowPush] = useState(true);
  const [allowPushFan, setAllowPushFan] = useState(true);
  const [allowPushHire, setAllowPushHire] = useState(true);
  const [allowPushTip, setAllowPushTip] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [accountActive, setAccountActive] = useState(true);
  const [notifyActive, setNotifyActive] = useState(false);
  const [paymentActive, setPaymentActive] = useState(false);

  const [paypalActive, setPaypalActive] = useState(false);
  const [stripeActive, setStripeActive] = useState(false);
  const [paypalAccount, setPaypalAccount] = useState('');
  const [stripeAccount, setStripeAccount] = useState('');

  const [videos, setVideos] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  const userData = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    //Configure Google SignIn Credentials
    GoogleSignin.configure({
      webClientId: googleSignInwebClientId, // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: false, // true if you wish to access user APIs on behalf of the user from your own server
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Preload data using AsyncStorage
      AsyncStorage.getItem('UserDetails', (err, result) => {
        if (err === null) {
          let res = JSON.parse(result);
          setUser(res);
          setAccessToken(res.access_token);
          setName(res.name);
          setEmail(res.email);
          BukserDetailApi(res);
          getDeviceToken(res);
          //BuskerGalleryApi(res, 'image');
          BuskerGalleryApi(res, 'video');
          PaymentDetailApi(res);
        }
      });
    }, []),
  );

  const callback = () => {};

  const getDeviceToken = data => {
    if (Platform.OS == 'ios') {
      AsyncStorage.getItem('fcmToken', (err, result) => {
        if (err === null) {
          let token = JSON.parse(result);
          console.log('token', token);
          setDeviceToken(token);
          CheckDeviceTokenApi(data);
        }
      });
    } else {
      AsyncStorage.getItem('deviceToken', (err, result) => {
        if (err === null) {
          let token = JSON.parse(result);
          console.log('token', token);
          setDeviceToken(token);
          CheckDeviceTokenApi(data);
        }
      });
    }
  };

  const selectChooseType = async () => {
    let options = {
      title: 'Choose Image or Video',
      customButtons: [
        {name: 'image', title: 'Choose a Photo'},
        {name: 'video', title: 'Choose a Video'},
      ],
      chooseFromLibraryButtonTitle: null,
      takePhotoButtonTitle: null,
    };
    launchImageLibrary(options, response => {
      console.log(
        '🚀 ~ file: index.js ~ line 141 ~ selectChooseType ~ response',
        response,
      );
      if (response.didCancel) {
        console.log('User Cancelled Picker');
      } else if (response.error) {
        console.log('Picker Type Error: ', response.error);
        showAlert();
      } else if (response.customButton) {
        console.log('User Tapped Custom Button: ', response.customButton);
        if (response.customButton == 'image') selectTapped('image');
        else selectTapped('video');
      }
    });
  };

  //Select Photo or Video Function
  const selectTapped = async type => {
    let options = {
      quality: 1.0,
      storageOptions: {
        skipBackup: true,
        path: type,
      },
      mediaType: type,
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
        //console.log('filepath ', response.path);
        getFileSize(response, type);
      }
    });
  };

  const getFileSize = async (response, type) => {
    let statResult = await stat(response.assets[0].uri);
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

  // Row Component for Gallery
  const galleryItem = (item, index) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.rowImageContainer}
          activeOpacity={0.8}
          onPress={() => {
            if (item.post_type == 'video')
              props.navigation.navigate('VideoPlayer', {videoURL: item.videos});
            else {
              let imageData = [];
              videos.forEach(element => {
                if (element.post_type != 'video')
                  imageData.push(element.videos);
              });
              props.navigation.navigate('FullImage', {
                imageURLs: imageData,
                pos: imageData.findIndex(images => images == item.videos),
              });
              //props.navigation.navigate('FullImage', {imageURL: item.videos});
            }
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
                uri:
                  item.post_type == 'video'
                    ? item.thumbnail_image
                    : item.videos,
              }}
            />
            {item.post_type == 'video' && (
              <Image
                style={styles.rowPlayImage}
                resizeMode={'contain'}
                source={require('../../Assets/Images/play_button.png')}
              />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
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
        </TouchableOpacity>
      </View>
    );
  };

  //******************** Hit BuskerDetail Api *******************
  const BukserDetailApi = async data => {
    setLoading(true);
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.getBusker + data.id,
    );
    timeout(
      10000,
      fetch(
        constants.baseUrl + constants.api.getBusker + '?busker_id=' + data.id,
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
            AsyncStorage.mergeItem('UserDetails', JSON.stringify(data));
            setUser(data);
            setName(data.name);
            setEmail(data.email);
            if (data.profile_img != null) setPic(data.profile_img);
            if (data.busker_new_msg_notify == '1') setAllowPush(true);
            else setAllowPush(false);
            if (data.new_fan_start_following_me == '1') setAllowPushFan(true);
            else setAllowPushFan(false);
            if (data.new_hire_request_notify == '1') setAllowPushHire(true);
            else setAllowPushHire(false);
            if (data.new_tip_recived_notify == '1') setAllowPushTip(true);
            else setAllowPushTip(false);
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

  //******************** Hit CheckDeviceToken Api *******************
  const CheckDeviceTokenApi = async userData => {
    console.log(
      'ApiCall',
      constants.baseUrl +
        constants.api.checkDeviceToken +
        '?user_id=' +
        userData.id +
        '&device_id=' +
        DeviceInfo.getUniqueId(),
    );
    timeout(
      10000,
      fetch(
        constants.baseUrl +
          constants.api.checkDeviceToken +
          '?user_id=' +
          userData.id +
          '&device_id=' +
          DeviceInfo.getUniqueId(),
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
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
        if (responseCode === 200) {
          if (responseJson.success == 'true') {
            var data = responseJson.data;
          } else {
            UpadateDeviceTokenApi(userData);
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

  //******************** Hit UpdateDeviceToken Api *******************
  const UpadateDeviceTokenApi = async userData => {
    let body = {
      user_id: userData.id,
      device_id: DeviceInfo.getUniqueId(),
      token: deviceToken,
    };
    console.log('ApiCall', constants.baseUrl + constants.api.updateDeviceToken);
    console.log('data', JSON.stringify(body));
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.updateDeviceToken, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }),
    )
      .then(processResponse)
      .then(res => {
        const {responseCode, responseJson} = res;
        console.log(
          'response',
          responseCode + '' + JSON.stringify(responseJson),
        );
        if (responseCode === 200) {
          if (responseJson.success == 'true') {
            var data = responseJson.data;
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

  //******************** Hit Update Notify Api ***********************
  const UpdateNotifyApi = async (type, status) => {
    let apiName = '';
    if (type == 'Fan') apiName = constants.api.buskerNewFan;
    else if (type == 'Hire') apiName = constants.api.buskerNewHire;
    else if (type == 'Tip') apiName = constants.api.buskerNewTip;
    else apiName = constants.api.buskerNewMsg;
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + apiName);
    console.log('Status', status);
    console.log('Token', userData.access_token);
    timeout(
      10000,
      fetch(constants.baseUrl + apiName + '?status=' + status, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.access_token}`,
        },
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
            if (type == 'Fan') {
              if (status == 1) {
                setAllowPushFan(true);
              } else setAllowPushFan(false);
            } else if (type == 'Hire') {
              if (status == 1) {
                setAllowPushHire(true);
              } else setAllowPushHire(false);
            } else if (type == 'Tip') {
              if (status == 1) {
                setAllowPushTip(true);
              } else setAllowPushTip(false);
            } else {
              if (status == 0) {
                setAllowPush(false);
              } else setAllowPush(true);
            }
          } else {
            toast.current.show(responseJson.message, 2000, () => {});
            setErrorSwitch(type);
          }
        } else {
          setErrorSwitch(type);
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

  const setErrorSwitch = type => {
    if (type == 'Fan') {
      setAllowPushFan(!allowPushFan);
    } else if (type == 'Hire') {
      setAllowPushHire(!allowPushHire);
    } else if (type == 'Tip') {
      setAllowPushTip(!allowPushTip);
    } else {
      setAllowPush(!allowPush);
    }
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
            setVideos(data.data);
            //if (type == 'image') setImages(data.data);
            //else setVideos(data.data);
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
      60 * 10000,
      fetch(constants.baseUrl + constants.api.buskerUpload, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
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
            BuskerGalleryApi(user, 'video');
            // if (type === 'image') BuskerGalleryApi(user, 'image');
            // else BuskerGalleryApi(user, 'video');
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

  //******************** Hit PaymentDetail Api *******************
  const PaymentDetailApi = async user => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.paymentDetails);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.paymentDetails, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.access_token}`,
        },
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
          if (responseJson.success) {
            var data = responseJson.data;
            if (data.hasOwnProperty('busker_stripe_account')) {
              setStripeActive(true);
              setStripeAccount(data.busker_stripe_account.stripe_account_id);
            }
            if (data.hasOwnProperty('busker_paypal_account')) {
              setPaypalActive(true);
              setPaypalAccount(data.busker_paypal_account.email);
            }
          } else {
            // toast.current.show(
            //   'You have not set up your tipping account',
            //   2000,
            //   () => {},
            // );
            //toast.current.show(responseJson.message, 2000, () => {});
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
    let dataBuskers = videos;
    let index = dataBuskers.indexOf(item);
    console.log('pos', index);
    if (index !== -1) {
      if (index == 0 && videos.length == 1) {
        setVideos([]);
      } else {
        // dataBuskers.splice(index, 1); //to remove a single item starting at index
        // setVideos(dataBuskers);
        BuskerGalleryApi(user, 'video');
      }
    }
    // if (item.post_type == 'image') {
    //   let dataBuskers = images;
    //   let index = dataBuskers.indexOf(item);
    //   console.log('pos', index);
    //   if (index !== -1) {
    //     if (index == 0 && images.length == 1) {
    //       setImages([]);
    //     } else {
    //       // dataBuskers.splice(index, 1); //to remove a single item starting at index
    //       // setImages(dataBuskers);
    //       BuskerGalleryApi(user, 'image');
    //     }
    //   }
    // } else {
    //   let dataBuskers = videos;
    //   let index = dataBuskers.indexOf(item);
    //   console.log('pos', index);
    //   if (index !== -1) {
    //     if (index == 0 && videos.length == 1) {
    //       setVideos([]);
    //     } else {
    //       // dataBuskers.splice(index, 1); //to remove a single item starting at index
    //       // setVideos(dataBuskers);
    //       BuskerGalleryApi(user, 'video');
    //     }
    //   }
    // }
  };

  const logoutTapped = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          //resetHome();
          LogoutApi();
        },
        style: 'default',
      },
    ]);
  };

  //******************** Hit Logout Api *******************
  const LogoutApi = async () => {
    let body = {
      user_id: user.id,
      device_id: DeviceInfo.getUniqueId(),
    };
    console.log('ApiCall', constants.baseUrl + constants.api.logout);
    console.log('Data', JSON.stringify(body));
    setLoading(true);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.logout, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
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
            resetHome();
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

  // Function to Reset Home
  const resetHome = () => {
    AsyncStorage.removeItem('UserDetails');
    dispatch(deleteUser());
    AsyncStorage.removeItem('FirebaseUser');
    dispatch(deleteFirebase());
    props.navigation.reset({
      index: 0,
      routes: [{name: 'SignIn'}],
    });
  };

  // Functions for Check Social
  const checkSocial = async () => {
    let isSignIn = await GoogleSignin.getCurrentUser();
    if (isSignIn !== null) signOut();
    let access = await AccessToken.getCurrentAccessToken();
    if (access !== null) fbLogout();
    resetHome();
  };

  // Function for Google Logout
  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('GOOGLE ERROR', error.message);
      toast.current.show(error.message, 2000, () => {});
    }
  };

  // Function for Facebook Logout
  const fbLogout = async () => {
    try {
      let data = await AccessToken.getCurrentAccessToken();
      if (data !== null) {
        const current_access_token = data.accessToken.toString();
        const logout = new GraphRequest(
          'me/permissions/',
          {
            accessToken: current_access_token,
            httpMethod: 'DELETE',
          },
          (error, result) => {
            if (error) {
              console.log('Error fetching data: ' + error.toString());
            } else {
              LoginManager.logOut();
            }
          },
        );
        new GraphRequestManager().addRequest(logout).start();
      }
    } catch (error) {
      console.error('FB ERROR', error.message);
      toast.current.show(error.message, 2000, () => {});
    }
  };

  return (
    <SafeAreaView style={styles.viewcontainer}>
      <CustomStatusBar color={Colors.theme} />
      <View style={styles.headerRowStyle}>
        <TouchableOpacity
          style={styles.backImageBack}
          activeOpacity={1}
          onPress={() => {
            selectChooseType();
            //if (index == 0) selectTapped('image');
            //else selectTapped('video');
          }}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/ic_add_gallery.png')}
          />
        </TouchableOpacity>
        <Text style={styles.titleText}>{I18n.t('account.my_account')}</Text>
        <TouchableOpacity
          style={styles.backImageBack}
          activeOpacity={1}
          onPress={() => props.navigation.navigate('Notifications')}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/ic_notification.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.viewStyle}>
        {/* Profile Detail Container */}
        <View style={styles.profileContainer}>
          <View>
            <Image
              style={styles.profileImageStyle}
              resizeMode={'cover'}
              source={require('../../Assets/Images/profileImage.png')}
            />
            {pic != null && (
              <Image
                style={[styles.profileImageStyle, {position: 'absolute'}]}
                resizeMode={'cover'}
                source={{uri: pic}}
              />
            )}
          </View>
          <TouchableOpacity
            style={styles.detailContainer}
            activeOpacity={0.7}
            onPress={() =>
              props.navigation.navigate('BuskerProfile', {user: user})
            }>
            <View style={styles.detailRowStyle}>
              <Text style={styles.nameTxtStyle}>{name}</Text>
              <Image
                style={styles.detailIconStyle}
                resizeMode={'cover'}
                source={require('../../Assets/Images/ic_change.png')}
              />
            </View>
            <Text style={styles.emailTxtStyle}>{email}</Text>
          </TouchableOpacity>
          <View style={styles.bottomRowStyle}>
            <TouchableOpacity
              style={styles.bottomViewStyle}
              onPress={() => {
                props.navigation.navigate('ChangePassword');
              }}>
              <Image
                style={styles.btnImageStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_edit.png')}
              />
              <Text style={styles.btnTextStyle}>
                {I18n.t('profile.change_password')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottomViewStyle}
              onPress={() => {
                logoutTapped();
              }}>
              <Image
                style={styles.btnImageStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_exit.png')}
              />
              <Text style={styles.btnTextStyle}>
                {I18n.t('profile.logout')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps={'handled'}
          overScrollMode="never">
          {/* Card View Container */}
          <View style={{height: 200}}>
            {/* <Text
              style={{
                alignSelf: 'flex-start',
                color: Colors.black,
                fontFamily: Fonts.PoppinsSemiBold,
                fontSize: 16,
                marginStart: 15,
                marginTop: 10,
              }}>
              {'Gallery'}
            </Text> */}
            {/* 'Gallery' + '(' + videos.length + ')' */}
            {videos.length == 0 && (
              <View style={styles.emptyView}>
                <Image
                  style={styles.ImageStyle}
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/app_logo.png')}
                />
                <Text style={styles.EmptyText}>{'No Gallery'}</Text>
              </View>
            )}
            {videos.length != 0 && (
              <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                bounces={false}
                overScrollMode={'never'}
                contentContainerStyle={{paddingVertical: 10, paddingEnd: 10}}
                data={videos}
                horizontal={true}
                renderItem={({item, pos}) => galleryItem(item, pos)}
                keyExtractor={item => item.keyExtractor}
              />
            )}
          </View>

          {/* Busk It Page Containers */}
          {/* <Text style={styles.rowHeadTxtStyle}>
            {I18n.t('account.account_settings')}
          </Text> */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={
              accountActive ? styles.rowOpenContainer : styles.rowTopContainer
            }
            onPress={() => setAccountActive(!accountActive)}>
            <Text style={styles.rowSubTxtStyle}>
              {I18n.t('account.account_settings')}
            </Text>
            <Image
              style={accountActive ? styles.rowIconRotate : styles.rowIconStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_drop_down.png')}
            />
          </TouchableOpacity>
          {accountActive && (
            <View style={styles.rowContainer}>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.rowViewStyle}
                onPress={() =>
                  props.navigation.navigate('BuskerSchedule', {
                    buskerId: user.id,
                    buskerName: user.name,
                  })
                }>
                <Image
                  style={styles.rowImageStyle}
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/ic_schedule.png')}
                />
                <Text style={styles.rowSubTxtStyle}>
                  {I18n.t('account.my_schedule')}
                </Text>
              </TouchableOpacity>
              <View style={styles.rowDivider} />
              <TouchableOpacity
                activeOpacity={1}
                style={styles.rowViewStyle}
                onPress={() =>
                  props.navigation.navigate('BuskerFans', {
                    callback: callback,
                  })
                }>
                <Image
                  style={styles.rowImageStyle}
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/ic_fans.png')}
                />
                <Text style={styles.rowSubTxtStyle}>
                  {I18n.t('account.my_fans')}
                </Text>
              </TouchableOpacity>
              <View style={styles.rowDivider} />
              {/* <TouchableOpacity
                activeOpacity={0.7}
                style={styles.rowViewStyle}
                onPress={() => props.navigation.navigate('BuskerGallery')}>
                <Image
                  style={styles.rowImageStyle}
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/ic_gallery.png')}
                />
                <Text style={styles.rowSubTxtStyle}>
                  {I18n.t('account.my_gallery')}
                </Text>
              </TouchableOpacity>
              <View style={styles.rowDivider} />
               */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.rowViewStyle}
                onPress={() => props.navigation.navigate('BuskerSign')}>
                <Image
                  style={styles.rowImageStyle}
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/ic_barcode.png')}
                />
                <Text style={styles.rowSubTxtStyle}>
                  {I18n.t('account.my_sign')}
                </Text>
              </TouchableOpacity>
              <View style={styles.rowDivider} />

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.rowViewStyle}
                onPress={() => props.navigation.navigate('PayoutHistory')}>
                <Image
                  style={styles.rowImageStyle}
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/payout_history.png')}
                />
                <Text style={styles.rowSubTxtStyle}>
                  {I18n.t('tips.payoutHistory')}
                </Text>
              </TouchableOpacity>
              <View style={styles.rowDivider} />

              {/* Payment Container */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.rowViewStyle}
                onPress={() => setPaymentActive(!paymentActive)}>
                <Text style={styles.rowSubTxtStyle}>
                  {I18n.t('account.payment_settings')}
                </Text>
                <Image
                  style={
                    paymentActive ? styles.rowIconRotate : styles.rowIconStyle
                  }
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/ic_drop_down.png')}
                />
              </TouchableOpacity>
              <View style={styles.rowDivider} />
              {paymentActive && (
                <>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.rowViewStyle}
                    onPress={() => {
                      if (!paypalActive)
                        props.navigation.navigate('PaypalLogin');
                      else
                        toast.current.show(
                          'Paypal Account: ' + paypalAccount,
                          2000,
                          () => {},
                        );
                    }}>
                    <Image
                      style={styles.rowPayStyle}
                      resizeMode={'contain'}
                      source={require('../../Assets/Images/paypal_logo.png')}
                    />
                    <Text style={styles.rowSubTxtStyle}>
                      {I18n.t('artist.paypal_account')}
                    </Text>
                  </TouchableOpacity>
                  {/* <View style={styles.rowDivider} />

                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.rowViewStyle}
                    onPress={() => {
                      props.navigation.navigate('BankDetails', {
                        type: stripeActive ? 2 : 1,
                      });
                    }}>
                    <Image
                      style={styles.rowPayStyle}
                      resizeMode={'contain'}
                      source={require('../../Assets/Images/stripe_logo.png')}
                    />
                    <Text style={styles.rowSubTxtStyle}>
                      {I18n.t('artist.stripe_account')}
                    </Text>
                  </TouchableOpacity> */}
                  <View style={styles.rowDivider} />
                </>
              )}

              {/* Push Notification */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.rowViewStyle}
                onPress={() => setNotifyActive(!notifyActive)}>
                <Text style={styles.rowSubTxtStyle}>
                  {I18n.t('account.push_notify')}
                </Text>
                <Image
                  style={
                    notifyActive ? styles.rowIconRotate : styles.rowIconStyle
                  }
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/ic_drop_down.png')}
                />
              </TouchableOpacity>
              <View style={styles.rowDivider} />
              {notifyActive && (
                <>
                  <View style={styles.rowViewStyle}>
                    <Text style={styles.rowSubTxtStyle}>
                      {I18n.t('account.push_first')}
                    </Text>
                    <Switch
                      value={allowPushFan}
                      onValueChange={() => {
                        setAllowPushFan(!allowPushFan);
                        UpdateNotifyApi('Fan', allowPushFan ? 0 : 1);
                      }}
                      circleSize={20}
                      barHeight={10}
                      circleBorderWidth={20}
                      renderActiveText={false}
                      renderInActiveText={false}
                      backgroundActive={Colors.theme}
                      backgroundInactive={Colors.offgrey}
                      circleActiveColor={Colors.white}
                      circleInActiveColor={Colors.white}
                      changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                      innerCircleStyle={
                        allowPushFan
                          ? styles.switchInnerColor
                          : styles.switchInnerGrey
                      }
                      outerCircleStyle={styles.switchOuterCircle}
                      switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                      switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                      switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
                      switchBorderRadius={20} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                    />
                  </View>
                  <View style={styles.rowDivider} />

                  <View style={styles.rowViewStyle}>
                    <Text style={styles.rowSubTxtStyle}>
                      {I18n.t('account.push_second')}
                    </Text>
                    <Switch
                      value={allowPushHire}
                      onValueChange={() => {
                        setAllowPushHire(!allowPushHire);
                        UpdateNotifyApi('Hire', allowPushHire ? 0 : 1);
                      }}
                      circleSize={20}
                      barHeight={10}
                      circleBorderWidth={20}
                      renderActiveText={false}
                      renderInActiveText={false}
                      backgroundActive={Colors.theme}
                      backgroundInactive={Colors.offgrey}
                      circleActiveColor={Colors.white}
                      circleInActiveColor={Colors.white}
                      changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                      innerCircleStyle={
                        allowPushHire
                          ? styles.switchInnerColor
                          : styles.switchInnerGrey
                      }
                      outerCircleStyle={styles.switchOuterCircle}
                      switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                      switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                      switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
                      switchBorderRadius={20} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                    />
                  </View>
                  <View style={styles.rowDivider} />

                  <View style={styles.rowViewStyle}>
                    <Text style={styles.rowSubTxtStyle}>
                      {I18n.t('account.push_third')}
                    </Text>
                    <Switch
                      value={allowPushTip}
                      onValueChange={() => {
                        setAllowPushTip(!allowPushTip);
                        UpdateNotifyApi('Tip', allowPushTip ? 0 : 1);
                      }}
                      circleSize={20}
                      barHeight={10}
                      circleBorderWidth={20}
                      renderActiveText={false}
                      renderInActiveText={false}
                      backgroundActive={Colors.theme}
                      backgroundInactive={Colors.offgrey}
                      circleActiveColor={Colors.white}
                      circleInActiveColor={Colors.white}
                      changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                      innerCircleStyle={
                        allowPushTip
                          ? styles.switchInnerColor
                          : styles.switchInnerGrey
                      }
                      outerCircleStyle={styles.switchOuterCircle}
                      switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                      switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                      switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
                      switchBorderRadius={20} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                    />
                  </View>
                  <View style={styles.rowDivider} />

                  <View style={styles.rowViewStyle}>
                    <Text style={styles.rowSubTxtStyle}>
                      {I18n.t('account.push_fourth')}
                    </Text>
                    <Switch
                      value={allowPush}
                      onValueChange={() => {
                        setAllowPush(!allowPush);
                        UpdateNotifyApi('Msg', allowPush ? 0 : 1);
                        // if (allowPush) {
                        //   setAllowPushFan(false);
                        //   setAllowPushHire(false);
                        //   setAllowPushTip(false);
                        // }
                      }}
                      circleSize={20}
                      barHeight={10}
                      circleBorderWidth={20}
                      renderActiveText={false}
                      renderInActiveText={false}
                      backgroundActive={Colors.theme}
                      backgroundInactive={Colors.offgrey}
                      circleActiveColor={Colors.white}
                      circleInActiveColor={Colors.white}
                      changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                      innerCircleStyle={
                        allowPush
                          ? styles.switchInnerColor
                          : styles.switchInnerGrey
                      }
                      outerCircleStyle={styles.switchOuterCircle}
                      switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                      switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                      switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
                      switchBorderRadius={20} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                    />
                  </View>
                  <View style={styles.rowDivider} />
                </>
              )}

              {/* Cms Pages */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.rowViewStyle}
                onPress={() => props.navigation.navigate('About')}>
                <Text style={styles.rowSubTxtStyle}>
                  {I18n.t('account.about_us')}
                </Text>
              </TouchableOpacity>
              <View style={styles.rowDivider} />
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.rowViewStyle}
                onPress={() => {
                  props.navigation.navigate('TermsCondition', {
                    action: 'term',
                    title: 'Term & condition',
                  });
                  // props.navigation.navigate('TermsCondition')
                }}>
                <Text style={styles.rowSubTxtStyle}>
                  {I18n.t('account.terms_condition')}
                </Text>
              </TouchableOpacity>
              <View style={styles.rowDivider} />
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.rowViewStyle}
                onPress={() => props.navigation.navigate('Contact')}>
                <Text style={styles.rowSubTxtStyle}>
                  {I18n.t('account.contact_us')}
                </Text>
              </TouchableOpacity>
              <View style={styles.rowDivider} />
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.rowViewStyle}
                onPress={() => props.navigation.navigate('Blogs')}>
                <Text style={styles.rowSubTxtStyle}>
                  {I18n.t('account.blogs')}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Push Notification Switches */}
          {/* <Text style={styles.rowHeadTxtStyle}>
            {I18n.t('account.push_notify')}
          </Text> */}
          {/* <TouchableOpacity
            activeOpacity={0.7}
            style={
              notifyActive ? styles.rowOpenContainer : styles.rowTopContainer
            }
            onPress={() => setNotifyActive(!notifyActive)}>
            <Text style={styles.rowSubTxtStyle}>
              {I18n.t('account.push_notify')}
            </Text>
            <Image
              style={notifyActive ? styles.rowIconRotate : styles.rowIconStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_drop_down.png')}
            />
          </TouchableOpacity>
          {notifyActive && (
            <View style={styles.rowContainer}>
              <View style={styles.rowViewStyle}>
                <Text style={styles.rowSubTxtStyle}>
                  {I18n.t('account.push_first')}
                </Text>
                <Switch
                  value={allowPushFan}
                  onValueChange={() => {
                    UpdateNotifyApi('Fan', allowPushFan ? 0 : 1);
                    //setAllowPushFan(!allowPushFan);
                  }}
                  circleSize={20}
                  barHeight={10}
                  circleBorderWidth={20}
                  renderActiveText={false}
                  renderInActiveText={false}
                  backgroundActive={Colors.theme}
                  backgroundInactive={Colors.offgrey}
                  circleActiveColor={Colors.white}
                  circleInActiveColor={Colors.white}
                  changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                  innerCircleStyle={
                    allowPushFan
                      ? styles.switchInnerColor
                      : styles.switchInnerGrey
                  }
                  outerCircleStyle={styles.switchOuterCircle}
                  switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                  switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                  switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
                  switchBorderRadius={20} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                />
              </View>
              <View style={styles.rowViewStyle}>
                <Text style={styles.rowSubTxtStyle}>
                  {I18n.t('account.push_second')}
                </Text>
                <Switch
                  value={allowPushHire}
                  onValueChange={() => {
                    UpdateNotifyApi('Hire', allowPushHire ? 0 : 1);
                    //setAllowPushHire(!allowPushHire);
                  }}
                  circleSize={20}
                  barHeight={10}
                  circleBorderWidth={20}
                  renderActiveText={false}
                  renderInActiveText={false}
                  backgroundActive={Colors.theme}
                  backgroundInactive={Colors.offgrey}
                  circleActiveColor={Colors.white}
                  circleInActiveColor={Colors.white}
                  changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                  innerCircleStyle={
                    allowPushHire
                      ? styles.switchInnerColor
                      : styles.switchInnerGrey
                  }
                  outerCircleStyle={styles.switchOuterCircle}
                  switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                  switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                  switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
                  switchBorderRadius={20} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                />
              </View>
              <View style={styles.rowViewStyle}>
                <Text style={styles.rowSubTxtStyle}>
                  {I18n.t('account.push_third')}
                </Text>
                <Switch
                  value={allowPushTip}
                  onValueChange={() => {
                    UpdateNotifyApi('Tip', allowPushTip ? 0 : 1);
                    //setAllowPushTip(!allowPushTip);
                  }}
                  circleSize={20}
                  barHeight={10}
                  circleBorderWidth={20}
                  renderActiveText={false}
                  renderInActiveText={false}
                  backgroundActive={Colors.theme}
                  backgroundInactive={Colors.offgrey}
                  circleActiveColor={Colors.white}
                  circleInActiveColor={Colors.white}
                  changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                  innerCircleStyle={
                    allowPushTip
                      ? styles.switchInnerColor
                      : styles.switchInnerGrey
                  }
                  outerCircleStyle={styles.switchOuterCircle}
                  switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                  switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                  switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
                  switchBorderRadius={20} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                />
              </View>
              <View style={styles.rowViewStyle}>
                <Text style={styles.rowSubTxtStyle}>
                  {I18n.t('account.push_fourth')}
                </Text>
                <Switch
                  value={allowPush}
                  onValueChange={() => {
                    UpdateNotifyApi('Msg', allowPush ? 0 : 1);
                    // setAllowPush(!allowPush);
                    // if (allowPush) {
                    //   setAllowPushFan(false);
                    //   setAllowPushHire(false);
                    //   setAllowPushTip(false);
                    // }
                  }}
                  circleSize={20}
                  barHeight={10}
                  circleBorderWidth={20}
                  renderActiveText={false}
                  renderInActiveText={false}
                  backgroundActive={Colors.theme}
                  backgroundInactive={Colors.offgrey}
                  circleActiveColor={Colors.white}
                  circleInActiveColor={Colors.white}
                  changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                  innerCircleStyle={
                    allowPush ? styles.switchInnerColor : styles.switchInnerGrey
                  }
                  outerCircleStyle={styles.switchOuterCircle}
                  switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                  switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                  switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
                  switchBorderRadius={20} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                />
              </View>
            </View>
          )} */}
          {/* CMS Pages Containers */}
          {/* <Text style={styles.rowHeadTxtStyle}>
            {I18n.t('profile.cms_page')}
          </Text> */}
          {/* <View style={styles.cmsRowContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.cmsRowViewStyle}
              onPress={() => props.navigation.navigate('About')}>
              <Text style={styles.cmsRowTxtStyle}>
                {I18n.t('profile.about_us')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.cmsRowViewStyle}
              onPress={() => props.navigation.navigate('TermsCondition')}>
              <Text style={styles.cmsRowTxtStyle}>
                {I18n.t('profile.terms_condition')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cmsRowContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.cmsRowViewStyle}
              onPress={() => props.navigation.navigate('Contact')}>
              <Text style={styles.cmsRowTxtStyle}>
                {I18n.t('profile.contact_us')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.cmsRowViewStyle}
              onPress={() => props.navigation.navigate('Blogs')}>
              <Text style={styles.cmsRowTxtStyle}>
                {I18n.t('profile.blogs')}
              </Text>
            </TouchableOpacity>
          </View>
         */}
        </ScrollView>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.dialogModal}>
            <TouchableOpacity
              style={styles.modalImageBack}
              activeOpacity={1}
              onPress={() => setModalVisible(false)}>
              <Image
                style={styles.modalImageStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/loading_image.png')}
              />
            </TouchableOpacity>
            <Text style={styles.modalHeadText}>
              {I18n.t('account.processing')}
            </Text>
            <Text style={styles.modalMsgText}>
              {I18n.t('account.loading_msg')}
            </Text>
          </View>
        </View>
      </Modal>

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
