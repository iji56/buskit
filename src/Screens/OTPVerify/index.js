import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  StatusBar,
  AsyncStorage,
  SafeAreaView,
} from 'react-native';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import I18n from '../../Config/I18n';
import CustomStatusBar from '../../Components/CustomStatusBar';

const Home = props => {
  useEffect(() => {
    // Preload data using AsyncStorage
    AsyncStorage.getItem('AccessToken', (err, result) => {
      if (err === null) {
        let res = JSON.parse(result);
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.viewcontainer}>
      <CustomStatusBar color={Colors.theme} />
      <View style={styles.headerRowStyle}>
        <TouchableOpacity style={styles.backImageBack} onPress={() => {}}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/menu.png')}
          />
        </TouchableOpacity>
        <Text style={styles.titleText}>{I18n.t('home.header_txt')}</Text>
      </View>
      <View style={styles.viewStyle} />
    </SafeAreaView>
  );
};

export default Home;
