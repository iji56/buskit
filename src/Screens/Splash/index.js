import React, {useState, useEffect} from 'react';
import {View, AsyncStorage, Image, SafeAreaView} from 'react-native';
import Colors from '../../Res/Colors';
import styles from './styles';
import CustomStatusBar from '../../Components/CustomStatusBar';
import SplashScreen from 'react-native-splash-screen';
import PushNotification from 'react-native-push-notification';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';

import {useSelector, useDispatch} from 'react-redux';
import {addUser, addFirebase} from '../../Redux/Actions';

const Splash = props => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    //Hide the splash Screen
    SplashScreen.hide();
    //Configure Push Notification
    if (Platform.OS === 'android') {
      configurePush();
    }
    // Preload data using AsyncStorage
    AsyncStorage.getItem('UserDetails', (err, result) => {
      if (result === null) {
        setTimeout(() => {
          moveToNextScreen(1, null);
        }, 300);
      } else {
        let res = JSON.parse(result);
        dispatch(addUser(res));
        getFirebaseUser();
        setTimeout(() => {
          moveToNextScreen(0, res.user_type);
        }, 300);
      }
    });
  }, []);

  const getFirebaseUser = () => {
    // Preload data using AsyncStorage
    AsyncStorage.getItem('FirebaseUser', (err, result) => {
      if (result != null) {
        let res = JSON.parse(result);
        dispatch(addFirebase(res));
      }
    });
  };

 

  const moveToNextScreen = (index, type) => {
    if (index === 0) {
      if (type == 1) {
        props.navigation.reset({
          index: 0,
          routes: [{name: 'UserTab', params: {route: 'initial'}}],
        });
      } else {
        props.navigation.reset({
          index: 0,
          routes: [{name: 'BuskerTab', params: {route: 'initial'}}],
        });
      }
    } else {
      props.navigation.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      });
    }
  };

  const showFlashMessageInForeground = (navigate, title, message) => {
    showMessage({
      message: title,
      description: message,
      type: 'default',
      backgroundColor: 'white', // background color
      color: 'black', // text color
      autoHide: true,
      duration: 5000,
      onPress: () => {
        hideMessage();
        navigate('Notifications');
      },
      hideOnPress: true,
    });
  };

  const configurePush = async () => {
    const {navigate} = props.navigation;
    var refreshToken = null;
    console.log('TOKEN:--------------------');
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        refreshToken = token.token;
        AsyncStorage.setItem('deviceToken', JSON.stringify(refreshToken));
        console.log('TOKEN:', refreshToken);
      },
      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        console.log('NOTIFICATION:', notification);
        showFlashMessageInForeground(navigate, 'Busk It', notification.message);

        // let myData = JSON.parse(notification.data);
        // console.log('@@@@@@@', 'myData==> ' + JSON.stringify(myData));
        if (notification.userInteraction) {
          navigate('Notifications');
        }

        // required on iOS only
        if (Platform.OS === 'ios')
          notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // Android only
      senderID: '236710716695',
      // iOS only
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    PushNotification.popInitialNotification(notification => {
      if (notification) {
        console.log('NOTIFICATION INACTIVE:', notification);
        // let myData = JSON.parse(notification.data);
        // console.log('@@@@@@@', 'myData==> ' + JSON.stringify(myData));
      }
    });
  };

  return (
    <SafeAreaView style={styles.viewStyles}>
      <CustomStatusBar color={Colors.white} />
      <View style={styles.viewStyles}>
        <Image
          style={styles.splash}
          resizeMode={'contain'}
          source={require('../../Assets/Images/splash_logo.png')}
        />
      </View>
    </SafeAreaView>
  );
};

export default Splash;
