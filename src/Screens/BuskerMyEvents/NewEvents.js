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
import Moment from 'moment';
import I18n from '../../Config/I18n';

import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';

const Home = props => {
  const [user, setUser] = useState('');
  const [newEvents, setNewEvents] = useState([]);
  const [newholder, setNewHolder] = useState([]);
  const [newText, setNewText] = useState('');

  //const toast = useRef(null);
  const [isLoading, setLoading] = useState(false);

  const [newfetching, setNewFetching] = useState(false);
  const [onNewLoad, setOnNewLoad] = useState(false);
  const [totalNewPage, setTotalNewPage] = useState(0);
  const [newPage, setNewPage] = useState(1);

  useEffect(() => {}, []);

  useFocusEffect(
    React.useCallback(() => {
      // Preload data using AsyncStorage
      AsyncStorage.getItem('UserDetails', (err, result) => {
        if (err === null) {
          let res = JSON.parse(result);
          setUser(res);
          setNewPage(1);
          setNewEvents([]);
          BuskerNewEventsApi(res);
        }
      });
    }, []),
  );

  //******************** Hit Events Api *******************
  const BuskerNewEventsApi = async data => {
    if (newPage == 1) setLoading(true);
    console.log(
      'ApiCall',
      constants.baseUrl +
        constants.api.buskerEvents +
        '?page=' +
        newPage +
        '&event_type=upcoming',
    );
    timeout(
      10000,
      fetch(
        constants.baseUrl +
          constants.api.buskerEvents +
          '?busker_id=' +
          data.id +
          '&event_type=upcoming' +
          '&page=' +
          newPage,
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
              setOnNewLoad(false);
              setNewFetching(false);
            } else {
              setOnNewLoad(true);
              setNewFetching(true);
              setTotalNewPage(responseJson.data.last_page);
              setNewPage(newPage + 1);
              setNewEvents([...newEvents, ...data]);
              setNewHolder([...newEvents, ...data]);
            }
            if (
              responseJson.data.last_page === responseJson.data.current_page
            ) {
              setOnNewLoad(false);
              setNewFetching(false);
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

  //Search filter of the new list
  const SearchNewFilterFunction = text => {
    //passing the inserted text in textinput
    const newData = newholder.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.event_name
        ? item.event_name.toUpperCase()
        : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    //setting the filtered newData on datasource
    //After setting the data it will automatically re-render the view
    setNewEvents(newData);
  };

  // Event Row List Item
  const NewRowItem = (item, pos) => {
    return (
      <TouchableOpacity
        style={styles.rowContainer}
        activeOpacity={1.0}
        onPress={() => {
          props.navigation.navigate('EventDetail', {
            event: item,
            type: 'busker',
            action: 'new',
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
              ' to ' +
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
      </TouchableOpacity>
    );
  };
  // Bottom List Item
  const NewBottomView = () => {
    return (
      <View>
        {newfetching ? (
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
              onChangeText={text => {
                setNewText(text);
                SearchNewFilterFunction(text);
              }}
              value={newText}
            />
            <Image
              style={styles.searchIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_find.png')}
            />
          </View> */}
      {newEvents.length == 0 && (
        <View style={commonStyles.emptyView}>
          <Image
            style={commonStyles.ImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/app_logo.png')}
          />
          <Text style={commonStyles.EmptyText}>{'No Events'}</Text>
        </View>
      )}
      {newEvents.length != 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode={'never'}
          contentContainerStyle={{paddingVertical: 10}}
          style={{alignSelf: 'center'}}
          data={newEvents}
          renderItem={({item, pos}) => NewRowItem(item, pos)}
          keyExtractor={item => item.keyExtractor}
          onScrollEndDrag={() => console.log(' *********end')}
          onScrollBeginDrag={() => console.log(' *******start')}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          onEndReachedThreshold={0.5}
          onEndReached={({distanceFromEnd}) => {
            console.log(' ***************** ' + distanceFromEnd);
            if (newPage <= totalNewPage && onNewLoad) {
              BuskerNewEventsApi(user);
            }
          }}
          ListFooterComponent={NewBottomView}
        />
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => props.navigation.navigate('NewEvent', {eventItem: null})}
        style={styles.fabBtnStyle}>
        <Image
          source={require('../../Assets/Images/ic_add.png')}
          style={styles.fabIconStyle}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
      {isLoading && (
        <View style={commonStyles.loaderStyle}>
          <DotIndicator color={Colors.theme} size={15} count={4} />
        </View>
      )}
    </View>
  );
};

export default Home;
