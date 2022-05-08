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
  const [events, setEvents] = useState([]);
  const [arrayholder, setHolder] = useState([]);
  const [text, setText] = useState('');

  const toast = useRef(null);
  const [isLoading, setLoading] = useState(false);

  const [fetching, setFetching] = useState(false);
  const [onLoad, setOnLoad] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {}, []);

  useFocusEffect(
    React.useCallback(() => {
      // Preload data using AsyncStorage
      AsyncStorage.getItem('UserDetails', (err, result) => {
        if (err === null) {
          let res = JSON.parse(result);
          setUser(res);
          setPage(1);
          setEvents([]);
          BuskerEventsApi(res);
        }
      });
    }, []),
  );

  //******************** Hit Busker Events Api *******************
  const BuskerEventsApi = async data => {
    if (page == 1) setLoading(true);
    console.log(
      'ApiCall------',
      constants.baseUrl + constants.api.userFavBuskerEvents + '?page=' + page,
    );

    console.log(
      'ApiCall------ data.access_token',
      data.access_token,
    );


    timeout(
      10000,
      fetch(
        constants.baseUrl + constants.api.userFavBuskerEvents + '?page=' + page,
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
              setEvents([...events, ...data]);
              setHolder([...events, ...data]);
            }
            if (
              responseJson.data.last_page === responseJson.data.current_page
            ) {
              setOnLoad(false);
              setFetching(false);
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

  //Search filter of the list
  const SearchFilterFunction = text => {
    //passing the inserted text in textinput
    const newData = arrayholder.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.event_name
        ? item.event_name.toUpperCase()
        : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    //setting the filtered newData on datasource
    //After setting the data it will automatically re-render the view
    setEvents(newData);
  };

  // List Item
  const rowItem = (item, pos) => {
    return (
      <TouchableOpacity
        style={styles.rowContainer}
        activeOpacity={0.8}
        onPress={() => {
          props.navigation.navigate('EventDetail', {
            event: item,
            type: 'user',
            action: 'null',
          });
        }}>
        <View style={styles.rowBannerStyle}>
          <Image
            style={styles.rowBannerStyle}
            resizeMode={'cover'}
            source={require('../../Assets/Images/thumbImage.png')}
          />
          <Image
            style={[styles.rowBannerStyle, {position: 'absolute'}]}
            resizeMode={'cover'}
            source={{
              uri: item.banner_image != null ? item.banner_image : 'image',
            }}
          />

          <View style={styles.detailViewStyle}>
            <Text style={styles.eventTextStyle}>{item.event_name}</Text>
          </View>
        </View>

        {/* <View style={styles.rowViewStyle} /> */}
        <View style={styles.dateViewStyle}>
          <Image
            style={styles.rowIconStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/ic_calendar.png')}
          />
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
        </View>
        <View style={styles.timeViewStyle}>
          <Image
            style={styles.rowIconStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/ic_watch.png')}
          />
          <Text style={styles.detailTextStyle}>
            {Moment(item.start_time, ['hh:mm:ss']).format('LT') +
              ' - ' +
              Moment(item.end_time, ['hh:mm:ss']).format('LT')}
          </Text>
        </View>

        <View style={styles.infoViewStyle}>
          <Image
            style={styles.rowIconStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/ic_location.png')}
          />
          <Text
            style={styles.detailTextStyle}
            ellipsizeMode={'tail'}
            numberOfLines={2}>
            {item.address}
          </Text>
        </View>

        <View style={styles.dividerViewStyle} />

        <TouchableOpacity
          style={styles.rowViewStyle}
          activeOpacity={0.7}
          onPress={() => {
            if (item.buskerdata != null)
              props.navigation.navigate('BuskerDetail', {
                item: item.buskerdata,
                type: 'normal',
              });
          }}>
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
                  item.buskerdata.profile_img != null
                    ? item.buskerdata.profile_img
                    : 'image',
              }}
            />
          </View>
          <View style={styles.detailRowStyle}>
            <Text style={styles.nameTextStyle}>{item.buskerdata.name}</Text>
            <Text style={styles.typeTextStyle}>
              {item.buskerdata.other_cat_name != null
                ? item.buskerdata.other_cat_name
                : item.buskerdata.categorydata != null
                ? item.buskerdata.categorydata.name
                : 'artist'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tipContainer}
          activeOpacity={0.7}
          onPress={() => {
            if (item.buskerdata != null)
              props.navigation.navigate('TipPayment', {
                id: item.buskerdata.id,
                name: item.buskerdata.name,
              });
          }}>
          <Text style={styles.tipText}>{I18n.t('events.tip_busker')}</Text>
        </TouchableOpacity>
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
            setText(text);
            SearchFilterFunction(text);
          }}
          value={text}
        />
        <Image
          style={styles.searchIcon}
          resizeMode={'contain'}
          source={require('../../Assets/Images/ic_find.png')}
        />
      </View>
      {events.length == 0 && (
        <View style={commonStyles.emptyView}>
          <Image
            style={commonStyles.ImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/app_logo.png')}
          />
          <Text style={commonStyles.EmptyText}>{'No Events'}</Text>
        </View>
      )}
      {events.length != 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode={'never'}
          contentContainerStyle={{paddingVertical: 10}}
          style={{alignSelf: 'center'}}
          data={events}
          renderItem={({item, pos}) => rowItem(item, pos)}
          keyExtractor={item => item.keyExtractor}
          onScrollEndDrag={() => console.log(' *********end')}
          onScrollBeginDrag={() => console.log(' *******start')}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          onEndReachedThreshold={0.5}
          onEndReached={({distanceFromEnd}) => {
            console.log(' ***************** ' + distanceFromEnd);
            if (page <= totalPage && onLoad && text == '') {
              BuskerEventsApi(user);
            }
          }}
          ListFooterComponent={BottomView}
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
