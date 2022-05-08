import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {TextField} from 'react-native-material-textfield';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import Fonts from '../../Res/Fonts';
import I18n from '../../Config/I18n';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';

import {useSelector, useDispatch} from 'react-redux';
import {addEvent, deleteEvent, deleteEventId} from '../../Redux/Actions';

const Home = props => {
  const {hireData} = props.route.params;
  const [user, setUser] = useState('');
  const [buskers, setBuskers] = useState([]);
  const [arrayholder, setHolder] = useState([]);
  const [text, setText] = useState('');

  const [isLoading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [onLoad, setOnLoad] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const toast = useRef(null);

  const event = useSelector(state => state.event);
  const eventID = useSelector(state => state.eventId);
  const dispatch = useDispatch();

  useEffect(() => {
    // Add Event to Redux
    dispatch(addEvent(hireData));
    // Back Button Handler
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log('eventId:', eventID);
      // Preload data using AsyncStorage
      AsyncStorage.getItem('UserDetails', (err, result) => {
        if (err === null) {
          let res = JSON.parse(result);
          setUser(res);
          setPage(1);
          setBuskers([]);
          FindBuskersApi(res, 1, []);
        }
      });
    }, [eventID]),
  );

  function handleBackButtonClick() {
    dispatch(deleteEvent());
    dispatch(deleteEventId());
    props.navigation.goBack();
    return true;
  }

  //******************** Hit Find Buskers Api *******************
  const FindBuskersApi = async (user, page, buskers) => {
    let IdList = hireData.busker_type;
    let formdata = new FormData();
    formdata.append(
      'event_id',
      eventID != 0 && eventID != undefined ? eventID : 0,
    );
    formdata.append('latitude', hireData.latitude);
    formdata.append('longitude', hireData.longitude);
    formdata.append('event_date', hireData.event_date);
    formdata.append('event_end_date', hireData.event_end_date);
    formdata.append('start_time', hireData.start_time);
    formdata.append('end_time', hireData.end_time);
    IdList.forEach(element => {
      formdata.append('busker_type[]', element);
    });
    // let data = {
    //   latitude: hireData.latitude,
    //   longitude: hireData.longitude,
    //   //hourly_rate: hireData.hourly_rate,
    //   event_id: eventID != 0 && eventID != undefined ? eventID : 0,
    // };

    if (page == 1) setLoading(true);
    console.log('data', JSON.stringify(formdata));
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.searchAvailBusker + '?page=' + page,
    );
    timeout(
      10000,
      fetch(
        constants.baseUrl + constants.api.searchAvailBusker + '?page=' + page,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.access_token}`,
          },
          //body: JSON.stringify(data),
          body: formdata,
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
              setBuskers([...buskers, ...data]);
              setHolder([...buskers, ...data]);
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

  //Search filter of the list
  const SearchFilterFunction = text => {
    //passing the inserted text in textinput
    const newData = arrayholder.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    //setting the filtered newData on datasource
    //After setting the data it will automatically re-render the view
    setBuskers(newData);
  };

  // Busker List Item
  const rowItem = (item, pos) => {
    return (
      <TouchableOpacity
        style={styles.rowContainer}
        activeOpacity={0.8}
        onPress={() => {
          props.navigation.navigate('BuskerDetail', {
            item: item,
            type: 'hire',
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
              uri: item.profile_img != null ? item.profile_img : 'image',
            }}
          />
        </View>
        <View style={styles.detailViewStyle}>
          <View style={styles.rowViewStyle}>
            <Text style={styles.nameTextStyle}>{item.name}</Text>
            <Text style={styles.mileTextStyle}>
              {Math.round(item.distance * 100) / 100 +
                ' ' +
                I18n.t('common.distance')}
            </Text>
          </View>
          <Text
            style={styles.descTextStyle}
            numberOfLines={2}
            ellipsizeMode={'tail'}>
            {item.busker_bio != null && item.busker_bio != ''
              ? item.busker_bio
              : 'Bio Yet Not Added!'}
          </Text>
          <View style={styles.rowViewStyle}>
            <View style={styles.rowViewStyle}>
              <Text style={styles.typePriceTextStyle}>{'category'}</Text>
            </View>
            <View style={styles.endRowViewStyle}>
              <Text style={styles.typePriceTextStyle}>
                {I18n.t('common.currency') +
                  item.hourly_rate +
                  I18n.t('common.hour_basis')}
              </Text>
            </View>
          </View>
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
        <TouchableOpacity
          style={styles.backImageBack}
          onPress={() => {
            dispatch(deleteEvent());
            dispatch(deleteEventId());
            props.navigation.goBack();
          }}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.titleText}>{I18n.t('busker.avail_buskers')}</Text>
        <TouchableOpacity style={styles.backImageBack} onPress={() => {}}>
          {/* <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/ic_notification.png')}
          /> */}
        </TouchableOpacity>
      </View>
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
        {buskers.length == 0 && (
          <View style={commonStyles.emptyView}>
            <Image
              style={commonStyles.ImageStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/app_logo.png')}
            />
            <Text style={commonStyles.EmptyText}>{'No Buskers Found'}</Text>
          </View>
        )}
        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode={'never'}
          contentContainerStyle={{paddingVertical: 10}}
          style={{alignSelf: 'center'}}
          data={buskers}
          renderItem={({item, pos}) => rowItem(item, pos)}
          keyExtractor={(item, pos) => item.id}
          onScrollEndDrag={() => console.log(' *********end')}
          onScrollBeginDrag={() => console.log(' *******start')}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          onEndReachedThreshold={0.5}
          onEndReached={({distanceFromEnd}) => {
            console.log(' ***************** ' + distanceFromEnd);
            if (page <= totalPage && onLoad) {
              FindBuskersApi(user, page, buskers);
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
