/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import 'react-native-gesture-handler';
import {LogBox, Platform, PermissionsAndroid, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
LogBox.ignoreAllLogs();
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';

import Splash from './src/Screens/Splash';
import Home from './src/Screens/Home';
import SignIn from './src/Screens/SignIn';
import SignUp from './src/Screens/SignUp';
import ForgotPassword from './src/Screens/ForgotPassword';
import ResetPassword from './src/Screens/ResetPassword';
import OTPVerify from './src/Screens/OTPVerify';
import ThankYou from './src/Screens/ThankYou';
import AvailBuskers from './src/Screens/AvailableBuskers';
import BuskerDetail from './src/Screens/BuskerDetail';
import FavBuskers from './src/Screens/FavoriteBuskers';
import Tips from './src/Screens/Tips';
import TipsMade from './src/Screens/TipsMade';
import BuskerEvents from './src/Screens/BuskerEvents';
import BuskerMyEvents from './src/Screens/BuskerMyEvents';
import UserMyEvents from './src/Screens/UserMyEvents';
import UserEventDetail from './src/Screens/UserEventDetail';
import UserAccount from './src/Screens/UserAccount';
import BuskerAccount from './src/Screens/BuskerAccount';
import BuskerProfile from './src/Screens/BuskerProfile';
import BuskerSign from './src/Screens/BuskerSign';
import ChangePassword from './src/Screens/ChangePassword';
import FindBusker from './src/Screens/FindBusker';
import EditUserProfile from './src/Screens/EditUserProfile';
import EditBuskerProfile from './src/Screens/EditBuskerProfile';
import GetLocation from './src/Screens/GetLocation';
import ForgotOTP from './src/Screens/ForgotOTP';
import Notifications from './src/Screens/Notifications';
import HireRequests from './src/Screens/HireRequests';
import TipSuccess from './src/Screens/TipSuccess';
import TipThanks from './src/Screens/TipThanks';
import TipBusker from './src/Screens/TipBusker';
import TipPayment from './src/Screens/TipPayment';
import NewEvent from './src/Screens/NewEvent';
import UserHome from './src/Screens/UserHome';
import ChatBox from './src/Screens/ChatBox';
import BuskerSchedule from './src/Screens/BuskerSchedule';
import BuskerFans from './src/Screens/BuskerFans';
import BuskerGallery from './src/Screens/BuskerGallery';
import EventDetail from './src/Screens/EventDetails';
import SearchBusker from './src/Screens/SearchBusker';
import VideoPlayer from './src/Screens/VideoPlayer';
import FullImage from './src/Screens/FullImage';
import BankDetails from './src/Screens/BankDetails';
import ChatScreen from './src/Screens/ChatScreen';

import About from './src/Screens/About';
import Contact from './src/Screens/Contact';
import TermsCondition from './src/Screens/TermsCondition';
import Blogs from './src/Screens/Blogs';
import BlogDetail from './src/Screens/BlogDetail';

import UserTab from './src/Components/BottomTabUser';
import BuskerTab from './src/Components/BottomTabBusker';
import GooglePlaces from './src/Components/GooglePlaces';
import GooglePointer from './src/Components/GooglePointer';
import PaypalLogin from './src/Components/PaypalLogin';
import PaypalPayout from './src/Components/PaypalCheckout';
import StripePayout from './src/Components/StripeCheckout';
import PrivacyPolicy from './src/Screens/Policy/PrivacyPolicy';

import PayoutHistory from './src/Screens/PayoutHistory';
import PayoutDetail from './src/Screens/PayoutDetail';

import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
// iOS notification
import messaging, {AuthorizationStatus} from '@react-native-firebase/messaging';
import iid from '@react-native-firebase/iid';

const RootStack = createStackNavigator();

const requestUserPermission = async () => {
  const authorizationStatus = await messaging().requestPermission();

  if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    console.log('User has notification permissions enabled.');
  } else if (
    authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
  ) {
    console.log('User has provisional notification permissions.');
  } else {
    console.log('User has notification permissions disabled');
  }
};

const getToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log('token from storage', fcmToken);
  if (!fcmToken) {
    fcmToken = await iid().getToken();
    console.log('token get', JSON.stringify(fcmToken));
    if (fcmToken) {
      await AsyncStorage.setItem('fcmToken', JSON.stringify(fcmToken));
    }
  }
};

const showFlashMessageInForeground = (title, message) => {
  showMessage({
    message: title,
    description: message,
    type: 'default',
    backgroundColor: 'white', // background color
    color: 'black', // text color
    autoHide: true,
    duration: 5000,
  });
};

export async function requestLocationPermission() {
  try {
    const title = 'Busk It';
    const message =
      'Bust It collects location data to show nearby street performers even when the app is closed or not in use.';

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title,
        message,
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    await AsyncStorage.setItem('locationPermission', granted);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the location');
    } else if (granted === 'denied') {
      Alert.alert(title, message, [
        {
          text: 'DENY',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'ALLOW', onPress: () => requestLocationPermission()},
      ]);
    } else if (granted === 'never_ask_again') {
    }
  } catch (err) {
    console.warn(err);
  }
}

const App = props => {
  useEffect(() => {
    //Hide the splash Screen
    SplashScreen.hide();
    if (Platform.OS === 'ios') {
      requestUserPermission();
      getToken();

      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage,
        );
        // navigation.navigate(remoteMessage.data.type);
      });

      // Check whether an initial notification is available
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log(
              'Notification caused app to open from quit state:',
              remoteMessage,
            );
            // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
          }
        });

      messaging().onMessage(async remoteMessage => {
        console.log(
          'Notification caused notification to handle from foreground state:',
          remoteMessage.data,
        );
        console.log(
          'Notification caused notification to handle from foreground state:',
          remoteMessage.data.body,
        );
        showFlashMessageInForeground('Busk It', remoteMessage.data.body);
      });
    }
    Platform.OS === 'android' && requestLocationPermission();
  }, []);

  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName={'Splash'}
        screenOptions={{headerShown: false, gestureEnabled: false}}>
        <RootStack.Screen name="Splash" component={Splash} />
        <RootStack.Screen name="SignIn" component={SignIn} />
        <RootStack.Screen name="SignUp" component={SignUp} />
        <RootStack.Screen name="ForgotPassword" component={ForgotPassword} />
        <RootStack.Screen name="ResetPassword" component={ResetPassword} />
        <RootStack.Screen name="OTPVerify" component={OTPVerify} />
        <RootStack.Screen name="ThankYou" component={ThankYou} />
        <RootStack.Screen name="Home" component={Home} />
        <RootStack.Screen name="UserAccount" component={UserAccount} />
        <RootStack.Screen name="BuskerAccount" component={BuskerAccount} />
        <RootStack.Screen name="BuskerProfile" component={BuskerProfile} />
        <RootStack.Screen name="BuskerSign" component={BuskerSign} />
        <RootStack.Screen name="ChangePassword" component={ChangePassword} />
        <RootStack.Screen name="AvailBuskers" component={AvailBuskers} />
        <RootStack.Screen name="BuskerDetail" component={BuskerDetail} />
        <RootStack.Screen name="FavBuskers" component={FavBuskers} />
        <RootStack.Screen name="Tips" component={Tips} />
        <RootStack.Screen name="TipsMade" component={TipsMade} />
        <RootStack.Screen name="NewEvent" component={NewEvent} />
        <RootStack.Screen name="BuskerEvents" component={BuskerEvents} />
        <RootStack.Screen name="BuskerMyEvents" component={BuskerMyEvents} />
        <RootStack.Screen name="UserMyEvents" component={UserMyEvents} />
        <RootStack.Screen name="UserEventDetail" component={UserEventDetail} />
        <RootStack.Screen name="FindBusker" component={FindBusker} />
        <RootStack.Screen name="GetLocation" component={GetLocation} />
        <RootStack.Screen name="EditUserProfile" component={EditUserProfile} />
        <RootStack.Screen
          name="EditBuskerProfile"
          component={EditBuskerProfile}
        />
        <RootStack.Screen name="BuskerFans" component={BuskerFans} />
        <RootStack.Screen name="BuskerGallery" component={BuskerGallery} />
        <RootStack.Screen name="ForgotOTP" component={ForgotOTP} />
        <RootStack.Screen name="Notifications" component={Notifications} />
        <RootStack.Screen name="HireRequests" component={HireRequests} />
        <RootStack.Screen name="TipSuccess" component={TipSuccess} />
        <RootStack.Screen name="TipThanks" component={TipThanks} />
        <RootStack.Screen name="TipBusker" component={TipBusker} />
        <RootStack.Screen name="TipPayment" component={TipPayment} />
        <RootStack.Screen name="UserHome" component={UserHome} />
        <RootStack.Screen name="ChatBox" component={ChatBox} />
        <RootStack.Screen name="BuskerSchedule" component={BuskerSchedule} />
        <RootStack.Screen name="UserTab" component={UserTab} />
        <RootStack.Screen name="BuskerTab" component={BuskerTab} />
        <RootStack.Screen name="About" component={About} />
        <RootStack.Screen name="Contact" component={Contact} />
        <RootStack.Screen name="TermsCondition" component={TermsCondition} />
        <RootStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <RootStack.Screen name="Blogs" component={Blogs} />
        <RootStack.Screen name="BlogDetail" component={BlogDetail} />
        <RootStack.Screen name="EventDetail" component={EventDetail} />
        <RootStack.Screen name="SearchBusker" component={SearchBusker} />
        <RootStack.Screen name="VideoPlayer" component={VideoPlayer} />
        <RootStack.Screen name="FullImage" component={FullImage} />
        <RootStack.Screen name="GooglePlaces" component={GooglePlaces} />
        <RootStack.Screen name="GooglePointer" component={GooglePointer} />
        <RootStack.Screen name="BankDetails" component={BankDetails} />
        <RootStack.Screen name="PaypalLogin" component={PaypalLogin} />
        <RootStack.Screen name="PaypalPayout" component={PaypalPayout} />
        <RootStack.Screen name="StripePayout" component={StripePayout} />
        <RootStack.Screen name="ChatScreen" component={ChatScreen} />
        <RootStack.Screen name="PayoutHistory" component={PayoutHistory} />
        <RootStack.Screen name="PayoutDetail" component={PayoutDetail} />
      </RootStack.Navigator>
      <FlashMessage position="top" autoHide={false} />
    </NavigationContainer>
  );
};

export default App;
