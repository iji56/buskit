import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import WebView from 'react-native-webview';

import styles from './styles';
import I18n from '../../Config/I18n';
import Colors from '../../Res/Colors';
import commonStyles from '../../Res/Styles';
import constants from '../../Config/Constants';
import CustomStatusBar from '../../Components/CustomStatusBar';
import {timeout, processResponse} from '../../Config/CommonFunctions';

const Home = props => {
  const [name, setName] = useState(I18n.t('cmsPage.about'));
  const [desc, setDesc] = useState('');

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);
  const ref = useRef(null);

  useEffect(() => {
    // AboutUsApi();
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
        <Text style={styles.titleText}>{name}</Text>
        <TouchableOpacity style={styles.backImageBack} />
      </View>

      <WebView
        // Webview Refernce
        ref={ref}
        // Webview Style
        style={commonStyles.WebViewStyle}
        //Loading URL
        source={{uri: 'https://busk-it.com/about-02/'}}
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
