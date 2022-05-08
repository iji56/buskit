import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  StatusBar,
  AsyncStorage,
  Modal,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import {Switch} from 'react-native-switch';
import {googleSignInwebClientId} from '../../Components/GoogleSignDetails';
import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';
import I18n from '../../Config/I18n';

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
import {
  LocalNotification,
  ScheduledLocalNotification,
} from '../../Res/LocalPushController';

const Home = props => {
  const [deviceToken, setDeviceToken] = useState('');
  const [user, setUser] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pic, setPic] = useState(null);
  const [allowPush, setAllowPush] = useState(true);
  const [allowPushPost, setAllowPushPost] = useState(true);
  const [allowPushEvent, setAllowPushEvent] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [accountActive, setAccountActive] = useState(true);
  const [notifyActive, setNotifyActive] = useState(false);

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
      AsyncStorage.getItem('UserDetails', (err, result) => {
        if (err === null) {
          let res = JSON.parse(result);
          setUser(res);
          setAccessToken(res.access_token);
          setName(res.name);
          setEmail(res.email);
          UserDetailApi(res);
          getDeviceToken(res);
        }
      });
    }, []),
  );

  const callback = () => {
    // Preload data using AsyncStorage
    AsyncStorage.getItem('UserDetails', (err, result) => {
      if (err === null) {
        let res = JSON.parse(result);
        setUser(res);
        setName(res.name);
        setEmail(res.email);
        UserDetailApi(res);
      }
    });
  };

  const getDeviceToken = userData => {
    if (Platform.OS == 'ios') {
      AsyncStorage.getItem('fcmToken', (err, result) => {
        if (err === null) {
          let token = JSON.parse(result);
          console.log('token', token);
          setDeviceToken(token);
          CheckDeviceTokenApi(userData);
        }
      });
    } else {
      AsyncStorage.getItem('deviceToken', (err, result) => {
        if (err === null) {
          let token = JSON.parse(result);
          console.log('token', token);
          setDeviceToken(token);
          CheckDeviceTokenApi(userData);
        }
      });
    }
  };

  //******************** Hit UserDetail Api *******************
  const UserDetailApi = async data => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.getUser + data.id);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.getUser + '?user_id=' + data.id, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
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
            AsyncStorage.mergeItem('UserDetails', JSON.stringify(data));
            setUser(data);
            setName(data.name);
            setEmail(data.email);
            if (data.profile_img != null) setPic(data.profile_img);
            if (data.user_new_msg_notify == '1') setAllowPush(true);
            else setAllowPush(false);
            if (data.busker_post_new_image == '1') setAllowPushPost(true);
            else setAllowPushPost(false);
            if (data.busker_add_new_event_notify == '1')
              setAllowPushEvent(true);
            else setAllowPushEvent(false);
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
    if (type == 'Post') apiName = constants.api.userNewPost;
    else if (type == 'Event') apiName = constants.api.userNewEvent;
    else apiName = constants.api.userNewMsg;
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + apiName);
    console.log('Status', status);
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
            if (type == 'Post') {
              if (status == 1) {
                setAllowPushPost(true);
              } else setAllowPushPost(false);
            } else if (type == 'Event') {
              if (status == 1) {
                setAllowPushEvent(true);
              } else setAllowPushEvent(false);
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
    if (type == 'Post') {
      setAllowPushPost(!allowPushPost);
    } else if (type == 'Event') {
      setAllowPushEvent(!allowPushEvent);
    } else {
      setAllowPush(!allowPush);
    }
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
          // ScheduledLocalNotification();
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
    console.log('isSignIn', isSignIn);
    if (isSignIn !== null) signOut();
    let access = await AccessToken.getCurrentAccessToken();
    console.log('isSignIn access fb', access);
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
          onPress={() => {}}>
          {/* <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/back.png')}
          /> */}
        </TouchableOpacity>
        <Text style={styles.titleText}>{I18n.t('profile.my_account')}</Text>
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
              props.navigation.navigate('EditUserProfile', {
                data: user,
                callback: callback,
              })
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
        {/* Card View Container */}
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps={'handled'}
          overScrollMode="never">
          {/* Busk It Page Containers */}
          {/* <Text style={styles.rowHeadTxtStyle}>
            {I18n.t('profile.buskit_text')}
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
                activeOpacity={0.7}
                style={styles.rowViewStyle}
                onPress={() =>
                  props.navigation.navigate('FavBuskers', {type: 'fav'})
                }>
                <Image
                  style={styles.rowImageStyle}
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/ic_heart.png')}
                />
                <Text style={styles.rowSubTxtStyle}>
                  {I18n.t('profile.my_favorite')}
                </Text>
              </TouchableOpacity>
              <View style={styles.rowDivider} />
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.rowViewStyle}
                onPress={() =>
                  props.navigation.navigate('ChatBox', {type: 'user'})
                }>
                <Image
                  style={styles.rowImageStyle}
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/ic_chatbox.png')}
                />
                <Text style={styles.rowSubTxtStyle}>
                  {I18n.t('profile.my_chatbox')}
                </Text>
              </TouchableOpacity>
              <View style={styles.rowDivider} />
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.rowViewStyle}
                onPress={() => props.navigation.navigate('TipsMade')}>
                <Image
                  style={styles.rowImageStyle}
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/ic_tips.png')}
                />
                <Text style={styles.rowSubTxtStyle}>
                  {I18n.t('profile.tips_made')}
                </Text>
              </TouchableOpacity>
              <View style={styles.rowDivider} />
              {/* <TouchableOpacity
                activeOpacity={0.7}
                style={styles.rowViewStyle}
                onPress={() => props.navigation.navigate('UserMyEvents')}>
                <Image
                  style={styles.rowImageStyle}
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/ic_events.png')}
                />
                <Text style={styles.rowSubTxtStyle}>
                  {I18n.t('profile.my_events')}
                </Text>
              </TouchableOpacity>
              <View style={styles.rowDivider} /> */}

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
                      {I18n.t('profile.push_first')}
                    </Text>
                    <Switch
                      value={allowPushPost}
                      onValueChange={() => {
                        setAllowPushPost(!allowPushPost);
                        UpdateNotifyApi('Post', allowPushPost ? 0 : 1);
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
                        allowPushPost
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
                      {I18n.t('profile.push_second')}
                    </Text>
                    <Switch
                      value={allowPushEvent}
                      onValueChange={() => {
                        setAllowPushEvent(!allowPushEvent);
                        UpdateNotifyApi('Event', allowPushEvent ? 0 : 1);
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
                        allowPushEvent
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
                      {I18n.t('profile.push_third')}
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
                  {I18n.t('profile.about_us')}
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
                  {I18n.t('profile.terms_condition')}
                </Text>
              </TouchableOpacity>
              <View style={styles.rowDivider} />
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.rowViewStyle}
                onPress={() => props.navigation.navigate('Contact')}>
                <Text style={styles.rowSubTxtStyle}>
                  {I18n.t('profile.contact_us')}
                </Text>
              </TouchableOpacity>
              <View style={styles.rowDivider} />
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.rowViewStyle}
                onPress={() => props.navigation.navigate('Blogs')}>
                <Text style={styles.rowSubTxtStyle}>
                  {I18n.t('profile.blogs')}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.rowContainer, {marginTop: 15}]}
            onPress={() =>
              props.navigation.navigate('FavBuskers', {type: 'fav'})
            }>
            <Image
              style={styles.rowImageStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_heart.png')}
            />
            <Text style={styles.rowSubTxtStyle}>
              {I18n.t('profile.my_favorite')}
            </Text>
            <Image
              style={styles.rowIconStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_arrow.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.rowContainer}
            onPress={() =>
              props.navigation.navigate('ChatBox', {type: 'user'})
            }>
            <Image
              style={styles.rowImageStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_chatbox.png')}
            />
            <Text style={styles.rowSubTxtStyle}>
              {I18n.t('profile.my_chatbox')}
            </Text>
            <Image
              style={styles.rowIconStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_arrow.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.rowContainer}
            onPress={() => props.navigation.navigate('TipsMade')}>
            <Image
              style={styles.rowImageStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_tips.png')}
            />
            <Text style={styles.rowSubTxtStyle}>
              {I18n.t('profile.tips_made')}
            </Text>
            <Image
              style={styles.rowIconStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_arrow.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.rowContainer}
            onPress={() => props.navigation.navigate('UserMyEvents')}>
            <Image
              style={styles.rowImageStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_events.png')}
            />
            <Text style={styles.rowSubTxtStyle}>
              {I18n.t('profile.my_events')}
            </Text>
            <Image
              style={styles.rowIconStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_arrow.png')}
            />
          </TouchableOpacity>
           */}
          {/* Push Notification Switches */}
          {/* <Text style={styles.rowHeadTxtStyle}>
            {I18n.t('profile.push_notify')}
          </Text>
          <View style={styles.rowContainer}>
            <Text style={styles.rowSubTxtStyle}>
              {I18n.t('profile.push_first')}
            </Text>
            <Switch
              value={allowPushPost}
              onValueChange={() => {
                UpdateNotifyApi('Post', allowPushPost ? 0 : 1);
                //setAllowPushPost(!allowPushPost);
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
                allowPushPost ? styles.switchInnerColor : styles.switchInnerGrey
              }
              outerCircleStyle={styles.switchOuterCircle}
              switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
              switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
              switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
              switchBorderRadius={20} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
            />
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.rowSubTxtStyle}>
              {I18n.t('profile.push_second')}
            </Text>
            <Switch
              value={allowPushEvent}
              onValueChange={() => {
                UpdateNotifyApi('Event', allowPushEvent ? 0 : 1);
                //setAllowPushEvent(!allowPushEvent);
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
                allowPushEvent
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
          <View style={styles.rowContainer}>
            <Text style={styles.rowSubTxtStyle}>
              {I18n.t('profile.push_third')}
            </Text>
            <Switch
              value={allowPush}
              onValueChange={() => {
                UpdateNotifyApi('Msg', allowPush ? 0 : 1);
                // setAllowPush(!allowPush);
                // if (allowPush) {
                //   setAllowPushImage(false);
                //   setAllowPushPost(false);
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
           */}
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
          </View> */}
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
              {I18n.t('profile.processing')}
            </Text>
            <Text style={styles.modalMsgText}>
              {I18n.t('profile.loading_msg')}
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
