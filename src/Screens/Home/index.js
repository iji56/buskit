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
import {setData, getData} from '../../Config/CommonFunctions';
import CustomStatusBar from '../../Components/CustomStatusBar';

const Home = props => {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    setAuthToken(getData('AccessToken'));
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
        <Text style={styles.titleText}>HOME</Text>
      </View>
      <View style={styles.viewStyle} />
    </SafeAreaView>
  );
};

export default Home;
