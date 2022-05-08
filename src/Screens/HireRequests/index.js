import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
  SafeAreaView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {TextField} from 'react-native-material-textfield';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import Fonts from '../../Res/Fonts';
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
  const [requests, setRequests] = useState([]);
  const [arrayholder, setHolder] = useState([]);
  const [text, setText] = useState('');

  const [isLoading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [onLoad, setOnLoad] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const toast = useRef(null);

  useEffect(() => {
    let data = [
      {
        busker_id: 43,
        user_id: 39,
        event_id: 10,
        event_status: 'assign',
        userdata: {
          id: 43,
          name: 'Tom Henry Jr',
          profile_img:
            'https://projects.webbycentral.xyz/WC716/public/images/profile_image/16014066054image.png',
        },
        eventdata: {
          id: 10,
          eventid: '3',
          description: 'event desc',
          address:
            'Mukta Opticals, Sector 1, Vasundhara, Ghaziabad, Uttar Pradesh, India',
          latitude: '28.6667954',
          longitude: '77.3867294',
          guest_size: '50',
          start_time: '12:37:20',
          end_time: '02:37:24',
          event_date: '2020-10-07 00:00:00',
          hourly_rate: '60',
          eventname: {
            id: 3,
            eventname: 'adaddsfsfsf',
          },
        },
      },
    ];
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Preload data using AsyncStorage
      AsyncStorage.getItem('UserDetails', (err, result) => {
        if (err === null) {
          let res = JSON.parse(result);
          setUser(res);
          setPage(1);
          setRequests([]);
          HireRequestApi(res);
        }
      });
    }, []),
  );

  //******************** Hit Tips Api *******************
  const HireRequestApi = async data => {
    if (page == 1) setLoading(true);
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.buskerHireList + '?page=' + page,
    );
    console.log(
      'ApiCall data',
      data,
    );
    timeout(
      10000,
      fetch(
        constants.baseUrl + constants.api.buskerHireList + '?page=' + page,
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
            var data = responseJson.data.data;
            if (data.length === 0) {
              setOnLoad(false);
              setFetching(false);
            } else {
              setOnLoad(true);
              setFetching(true);
              setTotalPage(responseJson.data.last_page);
              setPage(page + 1);
              setRequests([...requests, ...data]);
              setHolder([...requests, ...data]);
            }
            if (
              responseJson.data.last_page === responseJson.data.current_page
            ) {
              setOnLoad(false);
              setFetching(false);
            }
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

  //******************** Hit Tips Api *******************
  const HireActionApi = async (item, status) => {
    let data = {
      event_id: item.event_id,
      event_status: status,
    };
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.buskerHireAction);
    console.log('data', data);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.buskerHireAction, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify(data),
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
            toast.current.show(responseJson.message, 2000, () => {});
            handleRemoveItem(item);
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

  // handle Remove Fans from list
  const handleRemoveItem = item => {
    let datalist = requests;
    let index = datalist.indexOf(item);
    console.log('pos', index);
    if (index !== -1) {
      if (index == 0 && datalist.length == 1) {
        setRequests([]);
      } else {
        datalist.splice(index, 1); //to remove a single item starting at index
        setRequests([...datalist]);
      }
    }
  };

  //Search filter of the list
  const SearchFilterFunction = text => {
    //passing the inserted text in textinput
    const newData = arrayholder.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.user_data.name
        ? item.user_data.name.toUpperCase()
        : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    //setting the filtered newData on datasource
    //After setting the data it will automatically re-render the view
    setRequests(newData);
  };

  // Request List Item
  const rowItem = (item, pos) => {
    return (
      <TouchableOpacity
        style={styles.rowContainer}
        activeOpacity={1.0}
        onPress={() => {}}>
        <View style={styles.rowViewStyle}>
          <View style={styles.rowImageStyle}>
            <Image
              style={styles.rowImageStyle}
              resizeMode={'cover'}
              source={require('../../Assets/Images/profileImage.png')}
            />
            <Image
              style={[styles.rowImageStyle, {position: 'absolute'}]}
              resizeMode={'cover'}
              source={{
                uri:
                  item.user_data.profile_img != null
                    ? item.user_data.profile_img
                    : 'image',
              }}
            />
          </View>
          <View style={styles.detailViewStyle}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.nameTextStyle}>{item.user_data.name}</Text>

              <Text style={styles.priceTextStyle}>
                {I18n.t('common.currency') + item.eventdata.hourly_rate}
              </Text>
            </View>
            <Text style={styles.emailTextStyle}>{item.user_data.email}</Text>
            <Text style={styles.emailTextStyle}>{item.user_data.phone}</Text>
          </View>
        </View>

        <View style={styles.dividerViewStyle} />

        <View style={styles.detailViewStyle}>
          <View style={styles.detailRowView}>
            <Text style={styles.eventTextStyle}>
              {I18n.t('hireRequest.event_type')}
            </Text>
            <Text style={styles.eventSubTextStyle}>
              {item.eventdata.eventname.eventname}
            </Text>
          </View>
          <View style={styles.detailRowView}>
            <Text style={styles.eventTextStyle}>
              {I18n.t('hireRequest.no_of_guest')}
            </Text>
            <Text style={styles.eventSubTextStyle}>
              {item.eventdata.guest_size}
            </Text>
          </View>
          <View style={styles.detailRowView}>
            <Text style={styles.eventTextStyle}>
              {I18n.t('hireRequest.event_location')}
            </Text>
            <Text
              style={styles.eventSubTextStyle}
              numberOfLines={2}
              ellipsizeMode={'tail'}>
              {item.eventdata.address}
            </Text>
          </View>

          <View style={styles.detailRowView}>
            <Text style={styles.eventTextStyle}>
              {I18n.t('hireRequest.event_date')}
            </Text>
            <Text style={styles.eventDateTextStyle}>
              {item.eventdata.event_date != null
                ? Moment(item.eventdata.event_date).format('ll')
                : 'start-date'}
            </Text>
            <Text style={styles.eventDateTextStyle}>
              {item.eventdata.event_end_date != null
                ? Moment(item.eventdata.event_date).format('ll') !=
                  Moment(item.eventdata.event_end_date).format('ll')
                  ? ' to '
                  : ''
                : ''}
            </Text>
            <Text style={styles.eventDateTextStyle}>
              {item.eventdata.event_end_date != null &&
              Moment(item.eventdata.event_date).format('ll') !=
                Moment(item.eventdata.event_end_date).format('ll')
                ? Moment(item.eventdata.event_end_date).format('ll')
                : ''}
            </Text>
            {/* <Text style={styles.eventSubTextStyle}>
              {Moment(item.eventdata.event_date).format('ll') +
                ' to ' +
                Moment(item.eventdata.event_end_date).format('ll')}
            </Text> */}
          </View>
          <View style={styles.detailRowView}>
            <Text style={styles.eventTextStyle}>
              {I18n.t('hireRequest.event_time')}
            </Text>
            <Text style={styles.eventSubTextStyle}>
              {Moment(item.eventdata.start_time, ['hh:mm:ss']).format('LT') +
                ' - ' +
                Moment(item.eventdata.end_time, ['hh:mm:ss']).format('LT')}
            </Text>
          </View>
          <Text
            style={styles.descTextStyle}
            numberOfLines={2}
            ellipsizeMode={'tail'}>
            {item.eventdata.description}
          </Text>
        </View>

        <View style={styles.btnViewContainer}>
          <TouchableOpacity
            style={styles.rejectContainer}
            activeOpacity={0.7}
            onPress={() => {
              HireActionApi(item, 'reject');
            }}>
            <Text style={styles.rejectText}>
              {I18n.t('hireRequest.not_interested')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acceptContainer}
            activeOpacity={0.7}
            onPress={() => {
              HireActionApi(item, 'accept');
            }}>
            <Text style={styles.acceptText}>
              {I18n.t('hireRequest.interested')}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
        <TouchableOpacity style={styles.backImageBack} onPress={() => {}}>
          {/* <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/back.png')}
          /> */}
        </TouchableOpacity>
        <Text style={styles.titleText}>
          {I18n.t('hireRequest.hire_request')}
        </Text>
        <TouchableOpacity
          style={styles.backImageBack}
          onPress={() => {
            //props.navigation.navigate('Notifications');
          }}>
          {/* <Image
                style={styles.backImageStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_notification.png')}
              /> */}
        </TouchableOpacity>
      </View>
      <View style={styles.viewStyle}>
        {/* <View style={styles.editContainer}>
           <TextField
              selectionColor={Colors.theme}
            placeholder={I18n.t('common.search')}
            inputContainerStyle={styles.inputContainer}
            tintColor={Colors.theme}
            lineWidth={0}
            activeLineWidth={0}
            labelFontSize={0}
            fontSize={15}
            style={{
              fontFamily: Fonts.MontserratRegular,
              color: Colors.black,
            }}
            keyboardType={'default'}
            autoCapitalize={'none'}
            clearButtonMode={'always'}
            returnKeyLabel={'Done'}
            returnKeyType={'done'}
            onChangeText={text => SearchFilterFunction(text)}
            value={text}
          />
          <Image
            style={styles.searchIcon}
            resizeMode={'contain'}
            source={require('../../Assets/Images/ic_find.png')}
          />
        </View>
         */}
        {requests.length == 0 && (
          <View style={commonStyles.emptyView}>
            <Image
              style={commonStyles.ImageStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/app_logo.png')}
            />
            <Text style={commonStyles.EmptyText}>{'No Requests'}</Text>
          </View>
        )}
        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode={'never'}
          contentContainerStyle={{paddingVertical: 10}}
          style={{alignSelf: 'center'}}
          data={requests}
          renderItem={({item, pos}) => rowItem(item, pos)}
          keyExtractor={item => item.keyExtractor}
          onScrollEndDrag={() => console.log(' *********end')}
          onScrollBeginDrag={() => console.log(' *******start')}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          onEndReachedThreshold={0.5}
          onEndReached={({distanceFromEnd}) => {
            console.log(' ***************** ' + distanceFromEnd);
            if (page <= totalPage && onLoad) {
              HireRequestApi(user);
            }
          }}
          ListFooterComponent={BottomView}
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
