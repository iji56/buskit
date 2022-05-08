import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
  SafeAreaView,
} from 'react-native';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import Moment from 'moment';
import I18n from '../../Config/I18n';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';

const Home = props => {
  const [user, setUser] = useState('');
  const [notifications, setNotifications] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [onLoad, setOnLoad] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const toast = useRef(null);

  useEffect(() => {
    // Preload data using AsyncStorage
    AsyncStorage.getItem('UserDetails', (err, result) => {
      if (err === null) {
        let res = JSON.parse(result);
        setUser(res);
        setPage(1);
        setNotifications([]);
        NotificationApi(res);
      }
    });
  }, []);

  //******************** Hit Tips Api *******************
  const NotificationApi = async data => {
    if (page == 1) setLoading(true);
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.notificationList + '?page=' + page,
    );
    timeout(
      10000,
      fetch(
        constants.baseUrl + constants.api.notificationList + '?page=' + page,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.access_token}`,
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
            setNotifications(data);
            //var data = responseJson.data.data;
            // if (data.length === 0) {
            //   setOnLoad(false);
            //   setFetching(false);
            // } else {
            //   setOnLoad(true);
            //   setFetching(true);
            //   setTotalPage(responseJson.data.last_page);
            //   setPage(page + 1);
            //   setNotifications([...notifications, ...data]);
            // }
            // if (
            //   responseJson.data.last_page === responseJson.data.current_page
            // ) {
            //   setOnLoad(false);
            //   setFetching(false);
            // }
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

  const checkForItemClick = item => {
    console.log('redirect: ', item.message.notification_type);
    console.log('user: ', user);
    if (user.user_type == 1) {
      if (item.message.notification_type == 'Busker Event') {
        props.navigation.reset({
          index: 0,
          routes: [{name: 'UserTab', params: {route: 'event'}}],
        });
      } else if (item.message.notification_type == 'Upload Data') {
        props.navigation.navigate('FavBuskers', {type: 'fav'});
      } else if (item.message.notification_type == 'New Message') {
        props.navigation.navigate('ChatBox', {type: 'user'});
      } else if (
        item.message.notification_type == 'Event Accepted or Rejected'
      ) {
        props.navigation.navigate('UserMyEvents');
      }
    } else {
      if (item.message.notification_type == 'Hire Request') {
        props.navigation.reset({
          index: 0,
          routes: [{name: 'BuskerTab', params: {route: 'request'}}],
        });
      } else if (item.message.notification_type == 'Tip') {
        props.navigation.reset({
          index: 0,
          routes: [{name: 'BuskerTab', params: {route: 'tip'}}],
        });
      } else if (item.message.notification_type == 'New Message') {
        props.navigation.reset({
          index: 0,
          routes: [{name: 'BuskerTab', params: {route: 'chat'}}],
        });
      } else if (item.message.notification_type == 'Fan') {
        props.navigation.navigate('BuskerFans');
      }
    }
  };

  // Notification Item View
  const rowItem = (item, pos) => {
    //let data = JSON.stringify(item.data);
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.rowContainer}
          onPress={() => {
            if (item.message.hasOwnProperty('notification_type'))
              checkForItemClick(item);
            else
              toast.current.show('Notification Type Missing', 2000, () => {});
          }}>
          <Text style={styles.nameTextStyle}>{item.message.title}</Text>
          <Text style={styles.typeTextStyle}>{item.message.body}</Text>
        </TouchableOpacity>
        <Text style={styles.detailTextStyle}>
          {Moment(item.created_at).format('lll')}
        </Text>
      </>
    );
  };
  // Bottom List Item
  const BottomView = () => {
    return (
      <View>
        {fetching ? (
          <ActivityIndicator
            size="small"
            color={Colors.theme}
            style={{marginLeft: 6}}
          />
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.viewcontainer}>
      <CustomStatusBar color={Colors.theme} />
      <View style={styles.headerRowStyle}>
        <TouchableOpacity
          style={styles.backImageBack}
          onPress={() => {
            props.navigation.goBack();
          }}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.titleText}>
          {I18n.t('notifications.my_notify')}
        </Text>
        <TouchableOpacity style={styles.backImageBack} onPress={() => {}}>
          {/* <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/ic_search.png')}
          /> */}
        </TouchableOpacity>
      </View>
      <View style={styles.viewStyle}>
        {notifications.length == 0 && (
          <View style={commonStyles.emptyViewFull}>
            <Image
              style={commonStyles.ImageStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/app_logo.png')}
            />
            <Text style={commonStyles.EmptyText}>{'No Notifications'}</Text>
          </View>
        )}
        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode={'never'}
          style={{alignSelf: 'center'}}
          data={notifications}
          renderItem={({item, pos}) => rowItem(item, pos)}
          keyExtractor={item => item.keyExtractor}
          // onScrollEndDrag={() => console.log(' *********end')}
          // onScrollBeginDrag={() => console.log(' *******start')}
          // initialNumToRender={10}
          // maxToRenderPerBatch={10}
          // onEndReachedThreshold={0.5}
          // onEndReached={({distanceFromEnd}) => {
          //   console.log(' ***************** ' + distanceFromEnd);
          //   if (page <= totalPage && onLoad) {
          //     NotificationApi(user);
          //   }
          // }}
          // ListFooterComponent={BottomView}
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
