import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  AsyncStorage,
  SafeAreaView,
} from 'react-native';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';
import I18n from '../../Config/I18n';
import HTML from 'react-native-render-html';

const Home = props => {
  const [name, setName] = useState(I18n.t('cmsPage.about'));
  const [desc, setDesc] = useState('');

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    AboutUsApi();
  }, []);

  //******************** Hit AboutUs Api *******************
  const AboutUsApi = async () => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.cmsPage);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.cmsPage + '?page_id=1', {
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
            setName(data.name);
            setDesc(data.description);
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

  return (
    <SafeAreaView style={styles.viewcontainer}>
      <CustomStatusBar color={Colors.theme} />
      <View style={styles.headerRowStyle}>
        <TouchableOpacity
          style={styles.backImageBack}
          activeOpacity={0.8}
          onPress={() => {
            props.navigation.goBack();
          }}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.titleText}>{name}</Text>
        <TouchableOpacity style={styles.backImageBack} />
      </View>
      <View style={styles.viewStyle}>
        <ScrollView
          style={[styles.scrollContainer,{paddingHorizontal:15}]}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps={'handled'}
          overScrollMode="never">
          <Text style={styles.headText}>{'Our Story'}</Text>
          <HTML style={styles.descText} html={desc} />
          {/* <Text style={styles.descText}>{desc}</Text> */}
        </ScrollView>
      </View>
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
