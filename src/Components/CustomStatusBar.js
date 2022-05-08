import React, {Component} from 'react';
import {Platform, StatusBar, View, Dimensions} from 'react-native';

const STATUS_BAR_HEIGHT =
  Platform.OS === 'ios'
    ? Dimensions.get('window').height >= 812
      ? 44
      : 20
    : StatusBar.currentHeight;

function StatusBarPlaceHolder(prop) {
  return (
    <View
      style={{
        height: STATUS_BAR_HEIGHT,
        backgroundColor: prop.color,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
      }}>
      <StatusBar barStyle={prop.barStyle} backgroundColor={prop.color} />
    </View>
  );
}

export default StatusBarPlaceHolder;
