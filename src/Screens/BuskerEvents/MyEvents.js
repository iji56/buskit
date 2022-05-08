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

import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';

const Home = props => {
  const [user, setUser] = useState('');
  const [userEvents, setUserEvents] = useState([]);
  const [eventholder, setEventHolder] = useState([]);
  const [eventText, setEventText] = useState('');

  //const toast = useRef(null);
  const [isLoading, setLoading] = useState(false);

  const [eventfetching, setEventFetching] = useState(false);
  const [onEventLoad, setOnEventLoad] = useState(false);
  const [totalEventPage, setTotalEventPage] = useState(0);
  const [eventPage, setEventPage] = useState(1);

  useEffect(() => {}, []);

  useFocusEffect(
    React.useCallback(() => {
      // Preload data using AsyncStorage
      AsyncStorage.getItem('UserDetails', (err, result) => {
        if (err === null) {
          let res = JSON.parse(result);
          setUser(res);
          setEventPage(1);
          setUserEvents([]);
          UserEventsApi(res);
        }
      });
    }, []),
  );

  //******************** Hit User Events Api *******************
  const UserEventsApi = async data => {
    if (eventPage == 1) setLoading(true);
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.userEvents + '?page=' + eventPage,
    );
    timeout(
      10000,
      fetch(
        constants.baseUrl + constants.api.userEvents + '?page=' + eventPage,
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
              setOnEventLoad(false);
              setEventFetching(false);
            } else {
              setOnEventLoad(true);
              setEventFetching(true);
              setTotalEventPage(responseJson.data.last_page);
              setEventPage(eventPage + 1);
              setUserEvents([...userEvents, ...data]);
              setEventHolder([...userEvents, ...data]);
            }
            if (
              responseJson.data.last_page === responseJson.data.current_page
            ) {
              setOnEventLoad(false);
              setEventFetching(false);
            }
          } else {
            props.toast.show(responseJson.message, 2000, () => {});
          }
        } else {
          if (responseJson.hasOwnProperty('message')) {
            props.toast.show(responseJson.message, 2000, () => {});
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
            props.toast.show(responseJson[key][secondKey][0], 2000, () => {});
          }
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        props.toast.show(err.message, 2000, () => {});
      });
  };

  //Search filter of the Event list
  const SearchEventFilterFunction = text => {
    //passing the inserted text in textinput
    const newData = eventholder.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.eventname.eventname
        ? item.eventname.eventname.toUpperCase()
        : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    //setting the filtered newData on datasource
    //After setting the data it will automatically re-render the view
    setUserEvents(newData);
  };

  // Event List Item
  const eventRowItem = (item, pos) => {
    return (
      <TouchableOpacity
        style={styles.eventrowContainer}
        activeOpacity={0.8}
        onPress={() => {
          props.navigation.navigate('UserEventDetail', {eventId: item.id});
        }}>
        <View style={styles.eventdetailViewStyle}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.eventSubTextStyle}>
              {item.eventname.eventname}
            </Text>
            <Text style={styles.eventPriceStyle}>
              {I18n.t('common.currency') +
                item.hourly_rate +
                I18n.t('common.hour_basis')}
            </Text>
          </View>
          {/* <Text
            style={styles.eventebedescTextStyle}
            numberOfLines={2}
            ellipsizeMode={'tail'}>
            {item.description}
          </Text> */}
        </View>

        <View style={styles.eventdividerViewStyle} />

        <View style={styles.eventrowViewStyle}>
          <View style={styles.eventinfoViewStyle}>
            <Image
              style={styles.eventrowIconStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_location.png')}
            />
            <Text style={styles.eventdetailTextStyle}>{item.address}</Text>
          </View>
          <View style={styles.eventinfoViewStyle}>
            <Image
              style={styles.eventrowIconStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_calendar.png')}
            />
            {/* <Text style={styles.eventdetailTextStyle}>
              {Moment(item.event_date).format('ll') +
                ' to ' +
                Moment(item.event_end_date).format('ll')}
            </Text> */}
            <Text style={styles.eventdetailTextStyle}>
              {item.event_date != null
                ? Moment(item.event_date).format('ll')
                : 'start-date'}
            </Text>
            <Text style={[styles.eventdetailTextStyle, {marginHorizontal: 0}]}>
              {item.event_end_date != null
                ? Moment(item.event_date).format('ll') !=
                  Moment(item.event_end_date).format('ll')
                  ? 'to'
                  : ''
                : ''}
            </Text>
            <Text style={styles.eventdetailTextStyle}>
              {item.event_end_date != null &&
              Moment(item.event_date).format('ll') !=
                Moment(item.event_end_date).format('ll')
                ? Moment(item.event_end_date).format('ll')
                : ''}
            </Text>
          </View>
          <View style={styles.eventinfoViewStyle}>
            <Image
              style={styles.eventrowIconStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_watch.png')}
            />
            <Text style={styles.eventdetailTextStyle}>
              {Moment(item.start_time, ['hh:mm:ss']).format('LT') +
                ' - ' +
                Moment(item.end_time, ['hh:mm:ss']).format('LT')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  // Bottom List Item
  const BottomEventView = () => {
    return (
      <View>
        {eventfetching ? (
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
    <View style={styles.viewStyle}>
      <View style={styles.editContainer}>
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
          onChangeText={text => {
            setEventText(text);
            SearchEventFilterFunction(text);
          }}
          value={eventText}
        />
        <Image
          style={styles.searchIcon}
          resizeMode={'contain'}
          source={require('../../Assets/Images/ic_find.png')}
        />
      </View>
      {userEvents.length == 0 && (
        <View style={commonStyles.emptyView}>
          <Image
            style={commonStyles.ImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/app_logo.png')}
          />
          <Text style={commonStyles.EmptyText}>{'No Events'}</Text>
        </View>
      )}
      {userEvents.length != 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode={'never'}
          contentContainerStyle={{paddingVertical: 10}}
          style={{alignSelf: 'center'}}
          data={userEvents}
          renderItem={({item, pos}) => eventRowItem(item, pos)}
          keyExtractor={item => item.keyExtractor}
          onScrollEndDrag={() => console.log(' *********end')}
          onScrollBeginDrag={() => console.log(' *******start')}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          onEndReachedThreshold={0.5}
          onEndReached={({distanceFromEnd}) => {
            console.log(' ***************** ' + distanceFromEnd);
            if (eventPage <= totalEventPage && onEventLoad && eventText == '') {
              UserEventsApi(user);
            }
          }}
          ListFooterComponent={BottomEventView}
        />
      )}

      {/* <Toast
        ref={toast}
        style={commonStyles.toastStyle}
        textStyle={commonStyles.toastTextStyle}
      /> */}
      {isLoading && (
        <View style={commonStyles.loaderStyle}>
          <DotIndicator color={Colors.theme} size={15} count={4} />
        </View>
      )}
    </View>
  );
};

export default Home;
