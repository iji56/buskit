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
import I18n from '../../Config/I18n';
import Moment from 'moment';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';
import HTML from 'react-native-render-html';
import Fonts from '../../Res/Fonts';

const Home = props => {
  const [blogs, setBlogs] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    BlogListApi();
  }, []);

  //******************** Hit BlogList Api *******************
  const BlogListApi = async () => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.blogList);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.blogList, {
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
            setBlogs(data);
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

  const rowItem = (item, pos) => {
    return (
      <>
        <TouchableOpacity
          style={styles.rowContainer}
          activeOpacity={0.8}
          onPress={() => {
            props.navigation.navigate('BlogDetail', {item: item});
          }}>
          <View style={styles.detailViewStyle}>
            <Text
              style={styles.nameTextStyle}
              numberOfLines={2}
              ellipsizeMode={'tail'}>
              {item.title}
            </Text>
            {/* <Text
              style={styles.descTextStyle}
              numberOfLines={2}
              ellipsizeMode={'tail'}>
              {item.description}
            </Text> */}
            {/* <HTML
              containerStyle={{
                marginVertical: 5,
              }}
              html={item.description}
            /> */}
            <Text style={styles.detailTextStyle}>
              {Moment(item.updated_at).format('lll')}
            </Text>
          </View>
          <View style={styles.rowImageView}>
            <Image
              style={styles.rowImageView}
              resizeMode={'cover'}
              source={require('../../Assets/Images/thumbImage.png')}
            />
            <Image
              style={[styles.rowImageView, {position: 'absolute'}]}
              resizeMode={'cover'}
              source={item.banner != null ? {uri: item.banner} : ''}
            />
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const FlatListItemSeparator = () => {
    return <View style={styles.dividerViewStyle} />;
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
        <TouchableOpacity style={styles.backImageBack} onPress={() => {}}>
          {/* <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/ic_search.png')}
          /> */}
        </TouchableOpacity>
      </View>
      <View style={styles.viewStyle}>
        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode={'never'}
          style={{alignSelf: 'center'}}
          data={blogs}
          renderItem={({item, pos}) => rowItem(item, pos)}
          keyExtractor={item => item.keyExtractor}
          ItemSeparatorComponent={FlatListItemSeparator}
        />
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
