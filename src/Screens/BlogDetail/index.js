import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  AsyncStorage,
  SafeAreaView,
} from 'react-native';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import I18n from '../../Config/I18n';
import Moment from 'moment';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';
import HTML from 'react-native-render-html';

const Blog = props => {
  const {item} = props.route.params;
  const [banner, setBanner] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [datetime, setDateTime] = useState('');

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    setTitle(item.title);
    setDesc(item.description);
    setDateTime(item.updated_at);
    if (item.banner != null) setBanner(item.banner);
    BlogDetailApi();
  }, []);

  //******************** Hit BLogDetail Api *******************
  const BlogDetailApi = async () => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.blogDetails);
    console.log('blog_id', item.id);
    timeout(
      10000,
      fetch(
        constants.baseUrl + constants.api.blogDetails + '?blog_id=' + item.id,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
          },
        },
      ),
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
            setTitle(data.title);
            setDesc(data.description);
            setDateTime(data.updated_at);
            if (data.banner != null) setBanner(data.banner);
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
        <Text style={styles.titleText}>{I18n.t('cmsPage.blogs')}</Text>
        <TouchableOpacity style={styles.backImageBack} />
      </View>
      <View style={styles.viewStyle}>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{padding: 15}}
          keyboardShouldPersistTaps={'handled'}
          overScrollMode="never">
          <View style={styles.imageView}>
            <Image
              style={styles.imageView}
              resizeMode={'cover'}
              source={require('../../Assets/Images/thumbImage.png')}
            />
            <Image
              style={[styles.imageView, {position: 'absolute'}]}
              resizeMode={'cover'}
              source={{uri: banner}}
            />
          </View>
          <Text style={styles.dateText}>
            {Moment(datetime).format('lll')}
          </Text>
          <Text style={styles.headText}>{title}</Text>
          <HTML style={styles.descText} html={desc} />
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

export default Blog;
