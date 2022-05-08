import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  AsyncStorage,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import WebView from 'react-native-webview';

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

const Home = props => {
  const [name, setName] = useState(I18n.t('cmsPage.terms'));
  const [desc, setDesc] = useState('');
  const {action} = props.route.params;
  const {title} = props.route.params;

  const [isLoading, setLoading] = useState(false);
  const ref = useRef(null);
  const toast = useRef(null);

  useEffect(() => {
    // TermsApi();
  }, []);

  //******************** Hit TermsApi Api *******************
  const TermsApi = async () => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.cmsPage);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.cmsPage + '?page_id=' + action, {
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

  const ActivityIndicatorLoadingView = () => {
    //making a view to show to while loading the webpage
    return (
      <View style={{...commonStyles.WebViewStyle, paddingBottom: 150}}>
        <ActivityIndicator size="large" color={Colors.theme} />
        <Text style={{...commonStyles.LoadingTextStyle, color: 'white'}}>
          Loading...
        </Text>
      </View>
    );
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
        <Text style={styles.titleText}>{title}</Text>
        <TouchableOpacity style={styles.backImageBack} />
      </View>

      <WebView
        // Webview Refernce
        ref={ref}
        // Webview Style
        style={commonStyles.WebViewStyle}
        //Loading URL
        source={{uri: 'https://busk-it.com/policy/'}}
        //Navigation Change Interface
        // onNavigationStateChange={_onNavigationStateChange.bind(this)}
        //Enable Javascript support
        javaScriptEnabled
        //For the Cache
        domStorageEnabled
        //View to show while loading the webpage
        renderLoading={ActivityIndicatorLoadingView}
        //Want to show the view or not
        startInLoadingState
      />
    </SafeAreaView>
  );
};

export default Home;
