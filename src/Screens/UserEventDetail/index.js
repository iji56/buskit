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
import {useFocusEffect} from '@react-navigation/native';
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

const UserMyEvents = props => {
  const {eventId} = props.route.params;
  const [user, setUser] = useState(null);
  const [item, setItem] = useState(null);
  const [buskers, setBuskers] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    let data = {
      id: 12,
      user_id: 39,
      description: 'Event Description',
      address: 'Event Address',
      guest_size: '0',
      hourly_rate: '0',
      event_date: '2000-01-01 00:00:00',
      start_time: '12:00:00',
      end_time: '12:00:00',
      eventname: {
        id: 3,
        eventname: 'Event Name',
      },
      hierlist: [],
    };
    setItem(data);
    setBuskers(data.hierlist);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Preload data using AsyncStorage
      AsyncStorage.getItem('UserDetails', (err, result) => {
        if (err === null) {
          let res = JSON.parse(result);
          setUser(res);
          UserEventDetailApi(res);
        }
      });
    }, []),
  );

  //******************** Hit User Events Api *******************
  const UserEventDetailApi = async data => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.userEventDetails);
    timeout(
      10000,
      fetch(
        constants.baseUrl +
          constants.api.userEventDetails +
          '?event_id=' +
          eventId,
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
            setItem(data);
            setBuskers(data.hierlist);
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
    let status = '';
    let textColor = '';
    if (item.event_status == 'assign') {
      status = 'Pending';
      textColor = Colors.mustard;
    } else if (item.event_status == 'reject') {
      status = 'Not Interested';
      textColor = Colors.red;
    } else {
      status = 'Interested';
      textColor = Colors.darkgreen;
    }
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.rowItemContainer}
        onPress={() => {
          if (item.buskerdata != null)
            props.navigation.navigate('BuskerDetail', {
              item: item.buskerdata,
              type: 'normal',
            });
        }}>
        <View style={styles.rowImageView}>
          <Image
            style={styles.rowImageView}
            resizeMode={'cover'}
            source={require('../../Assets/Images/profileImage.png')}
          />
          <Image
            style={[styles.rowImageView, {position: 'absolute'}]}
            resizeMode={'cover'}
            source={{
              uri:
                item.buskerdata != null
                  ? item.buskerdata.profile_img != null
                    ? item.buskerdata.profile_img
                    : 'image'
                  : 'image',
            }}
          />
        </View>
        <View style={styles.detailItemStyle}>
          <Text style={styles.nameItemStyle}>
            {item.buskerdata != null ? item.buskerdata.name : 'Artist Name'}
          </Text>
          {(status==="Interested" &&  item.buskerdata.phone && 
          <Text style={styles.mobItemStyle}>
            {item.buskerdata.phone}
          </Text>
          )}
          <View style={{flexDirection: 'row', marginTop: 3}}>
            <Text style={styles.descItemStyle}>
              {item.buskerdata != null
                ? item.buskerdata.other_cat_name != null
                  ? item.buskerdata.other_cat_name
                  : item.buskerdata.categorydata != null
                  ? item.buskerdata.categorydata.category
                  : 'Category'
                : 'Category'}
            </Text>
            <Text style={[styles.statusItemStyle, {color: textColor}]}>
              {status}
            </Text>
          </View>
         
        </View>
      </TouchableOpacity>
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
        <Text style={styles.titleText}>{I18n.t('events.event_detail')}</Text>
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
      <ScrollView style={styles.viewStyle}>
        <View style={styles.rowContainer}>
          <View style={styles.detailViewStyle}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.eventTextStyle}>
                {item != null ? item.eventname.eventname : ''}
              </Text>
              <Text style={styles.eventPriceStyle}>
                {item != null
                  ? I18n.t('common.currency') +
                    item.hourly_rate +
                    I18n.t('common.hour_basis')
                  : '$0/hr'}
              </Text>
            </View>
            <Text style={styles.descTextStyle}>
              {item != null ? item.description : ''}
            </Text>
          </View>

          <View style={styles.dividerViewStyle} />

          <View style={styles.rowViewStyle}>
            <View style={styles.infoViewStyle}>
              <Image
                style={styles.rowIconStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_calendar.png')}
              />
              {item == null && (
                <Text style={styles.detailTextStyle}>
                  {'start-date to end-date'}
                </Text>
              )}
              {item != null && (
                <>
                  <Text style={styles.detailTextStyle}>
                    {item.event_date != null
                      ? Moment(item.event_date).format('ll')
                      : 'start-date'}
                  </Text>
                  <Text style={[styles.detailTextStyle, {marginHorizontal: 0}]}>
                    {item.event_end_date != null
                      ? Moment(item.event_date).format('ll') !=
                        Moment(item.event_end_date).format('ll')
                        ? 'to'
                        : ''
                      : ''}
                  </Text>
                  <Text style={styles.detailTextStyle}>
                    {item.event_end_date != null &&
                    Moment(item.event_date).format('ll') !=
                      Moment(item.event_end_date).format('ll')
                      ? Moment(item.event_end_date).format('ll')
                      : ''}
                  </Text>
                </>
              )}
              {/* <Text style={styles.detailTextStyle}>
                {item != null
                  ? Moment(item.event_date).format('ll') +
                    ' to ' +
                    Moment(item.event_end_date).format('ll') //format('MMM DD YYYY')
                  : ''}
              </Text> */}
            </View>
            <View style={styles.infoViewStyle}>
              <Image
                style={styles.rowIconStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_watch.png')}
              />
              <Text style={styles.detailTextStyle}>
                {item != null
                  ? Moment(item.start_time, ['hh:mm:ss']).format('LT') +
                    ' - ' +
                    Moment(item.end_time, ['hh:mm:ss']).format('LT') //format('hh:mm A')
                  : ''}
              </Text>
            </View>
            <View style={styles.infoViewStyle}>
              <Image
                style={styles.rowIconStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_location.png')}
              />
              <Text style={styles.detailTextStyle}>
                {item != null ? item.address : ''}
              </Text>
            </View>
          </View>
        </View>

        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode={'never'}
          contentContainerStyle={{paddingVertical: 10}}
          style={{alignSelf: 'center'}}
          data={buskers}
          renderItem={({item, pos}) => rowItem(item, pos)}
          keyExtractor={item => item.keyExtractor}
        />
      </ScrollView>
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

export default UserMyEvents;
