import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Platform,
  Dimensions,
} from 'react-native';

import {TabActions} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Colors from '../Res/Colors';

import HireRequests from '../Screens/HireRequests';
import BuskerAccount from '../Screens/BuskerAccount';
import BuskerMyEvents from '../Screens/BuskerMyEvents';
import Tips from '../Screens/Tips';
import ChatBox from '../Screens/ChatBox';

const IS_ANDROID = Platform.OS === 'android';
const {height, width} = Dimensions.get('window');

const Tab = createBottomTabNavigator();

UserTab = props => {
  const {route} = props.route.params;

  useEffect(() => {
    console.log('route', route);
    if (route == 'request')
      props.navigation.dispatch(TabActions.jumpTo('Hire Requests'));
    else if (route == 'tip')
      props.navigation.dispatch(TabActions.jumpTo('Tips'));
    else if (route == 'chat')
      props.navigation.dispatch(TabActions.jumpTo('ChatBox'));
    else props.navigation.dispatch(TabActions.jumpTo('Hire Requests'));
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Hire Requests"
      tabBarOptions={{
        activeTintColor: Colors.theme,
        inactiveTintColor: Colors.grey,
        style: {height: IS_ANDROID ? 65 : height >= 812 ? 90 : 65},
      }}
      backBehavior={'initialRoute'}>
      <Tab.Screen
        name="Hire Requests"
        component={HireRequests}
        options={{
          tabBarLabel: ({color, focused}) => (
            <Text
              style={{fontSize: focused ? 12 : 10, color: color, bottom: 5}}>
              {'Requests'}
            </Text>
          ),
          tabBarIcon: ({color, size, focused}) => (
            <Image
              style={{
                height: 28,
                width: 28,
                tintColor: color,
              }}
              source={require('../Assets/Images/menu_requests.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Events"
        component={BuskerMyEvents}
        options={{
          tabBarLabel: ({color, focused}) => (
            <Text
              style={{fontSize: focused ? 12 : 10, color: color, bottom: 5}}>
              {'Events'}
            </Text>
          ),
          tabBarIcon: ({color, size, focused}) => (
            <Image
              style={{
                height: 27,
                width: 27,
                tintColor: color,
              }}
              source={require('../Assets/Images/menu_events.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Tips"
        component={Tips}
        options={{
          tabBarLabel: ({color, focused}) => (
            <Text
              style={{fontSize: focused ? 12 : 10, color: color, bottom: 5}}>
              {'Tips'}
            </Text>
          ),
          tabBarIcon: ({color, size, focused}) => (
            <Image
              style={{
                height: 20,
                width: 30,
                tintColor: color,
              }}
              source={require('../Assets/Images/menu_payments.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ChatBox"
        component={ChatBox}
        initialParams={{type: 'Busker'}}
        options={{
          tabBarLabel: ({color, focused}) => (
            <Text
              style={{fontSize: focused ? 12 : 10, color: color, bottom: 5}}>
              {'Chats'}
            </Text>
          ),
          tabBarIcon: ({color, size, focused}) => (
            <Image
              style={{
                height: 30,
                width: 30,
                tintColor: color,
              }}
              source={require('../Assets/Images/menu_chatbox.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={BuskerAccount}
        options={{
          tabBarLabel: ({color, focused}) => (
            <Text
              style={{fontSize: focused ? 12 : 10, color: color, bottom: 5}}>
              {'Account'}
            </Text>
          ),
          tabBarIcon: ({color, size, focused}) => (
            <Image
              style={{
                height: 28,
                width: 28,
                tintColor: color,
              }}
              source={require('../Assets/Images/menu_profile.png')}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default UserTab;
