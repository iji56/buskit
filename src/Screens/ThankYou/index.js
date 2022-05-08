import React, {useState, useEffect} from 'react';
import {ScrollView, Text, Image, View, StatusBar, SafeAreaView} from 'react-native';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import CustomStatusBar from '../../Components/CustomStatusBar';
import I18n from '../../Config/I18n';

const ThankYou = props => {
  return (
    <SafeAreaView style={styles.viewcontainer}>
      <CustomStatusBar color={Colors.white} />
      <View style={styles.viewStyle}>
        <Image
          style={styles.imageStyle}
          resizeMode={'contain'}
          source={require('../../Assets/Images/mail_folder.png')}
        />
        <Text style={styles.titleText}>{I18n.t('thankYou.header_txt')}</Text>
        <Text style={styles.msgText}>
          <Text>{I18n.t('thankYou.message_txt')}</Text>
          <Text style={{fontWeight: 'bold', color: Colors.black}}>
            {I18n.t('thankYou.maker_name')}
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ThankYou;
