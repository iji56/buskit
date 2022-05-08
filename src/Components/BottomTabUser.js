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

import UserHome from '../Screens/UserHome';
import UserAccount from '../Screens/UserAccount';
import BuskerEvents from '../Screens/BuskerEvents';
import TipBusker from '../Screens/TipBusker';
import FindBusker from '../Screens/FindBusker';

const IS_ANDROID = Platform.OS === 'android';
const {height, width} = Dimensions.get('window');

const Tab = createBottomTabNavigator();

UserTab = props => {
  const {route} = props.route.params;

  useEffect(() => {
    console.log('route', route);
    if (route == 'event')
      props.navigation.dispatch(TabActions.jumpTo('Events'));
    else props.navigation.dispatch(TabActions.jumpTo('Location Tracker'));
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Location Tracker"
      tabBarOptions={{
        activeTintColor: Colors.theme,
        inactiveTintColor: Colors.grey,
        style: {height: IS_ANDROID ? 65 : height >= 812 ? 90 : 65},
      }}
      backBehavior={'initialRoute'}>
      <Tab.Screen
        name="Location Tracker"
        component={UserHome}
        options={{
          tabBarLabel: ({color, focused}) => (
            <Text style={{fontSize: focused ? 12 : 10, color: color}}>
              {'Location'}
            </Text>
          ),
          tabBarIcon: ({color, size, focused}) => (
            <Image
              style={{
                height: 28,
                width: 28,
                tintColor: color,
              }}
              source={require('../Assets/Images/menu_location.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Events"
        component={BuskerEvents}
        options={{
          tabBarLabel: ({color, focused}) => (
            <Text style={{fontSize: focused ? 12 : 10, color: color}}>
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
        name="Payments"
        component={TipBusker}
        options={{
          tabBarLabel: ({color, focused}) => (
            <Text style={{fontSize: focused ? 12 : 10, color: color}}>
              {'Payments'}
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
        name="Hire Busker"
        component={FindBusker}
        options={{
          tabBarLabel: ({color, focused}) => (
            <Text style={{fontSize: focused ? 12 : 10, color: color}}>
              {'Hire'}
            </Text>
          ),
          tabBarIcon: ({color, size, focused}) => (
            <Image
              style={{
                height: 29,
                width: 20,
                tintColor: color,
              }}
              source={require('../Assets/Images/menu_hire.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={UserAccount}
        options={{
          tabBarLabel: ({color, focused}) => (
            <Text style={{fontSize: focused ? 12 : 10, color: color}}>
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
