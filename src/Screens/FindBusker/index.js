import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  StatusBar,
  Modal,
  FlatList,
  Keyboard,
  AsyncStorage,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {TextField} from 'react-native-material-textfield';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import Fonts from '../../Res/Fonts';
import I18n from '../../Config/I18n';
import Moment from 'moment';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';

import Geocoder from 'react-native-geocoding';
const GOOGLE_API_KEY = 'AIzaSyC2LNQ0xw5GxnOEe19r4SL7BLY6w04kIBg';

const FindBusker = props => {
  const [user, setUser] = useState('');
  const [types, setTypes] = useState([]);
  const [typeId, setTypeId] = useState(0);
  const [eventType, setEventType] = useState('');
  const [categories, setCategories] = useState([]);
  const [IdList, setIdList] = useState([]);
  const [IdTemp, setIdTemp] = useState([]);
  const [NameList, setNameList] = useState([]);
  const [NameTemp, setNameTemp] = useState([]);
  const [categoryNames, setCategoryNames] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventGuest, setEventGuest] = useState('');
  const [eventRate, setEventRate] = useState('');
  //const [eventDate, setEventDate] = useState('');
  const [eventStDate, setEventStDate] = useState('');
  const [eventEdDate, setEventEdDate] = useState('');
  const [eventStTime, setEventStTime] = useState('');
  const [eventEdTime, setEventEdTime] = useState('');
  const [dateType, setDateType] = useState(1);
  const [timeType, setTimeType] = useState(1);
  const [dateVisibility, setDateVisibility] = useState(false);
  const [timeVisibility, setTimeVisibility] = useState(false);
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const [eventLoc, setEventLoc] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const inputDesc = useRef(null);
  const inputGuests = useRef(null);
  const inputRate = useRef(null);

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    // Initialize the module (needs to be done only once)
    Geocoder.init(GOOGLE_API_KEY, {language: 'en'});
    // Preload data using AsyncStorage
    AsyncStorage.getItem('UserDetails', (err, result) => {
      if (err === null) {
        let res = JSON.parse(result);
        setUser(res);
      }
    });
    const unsubscribe = props.navigation.addListener('tabPress', e => {
      // Prevent default behavior
      //e.preventDefault();
      // Do something manually
      clearInput();
    });
    return unsubscribe;
  }, [props.navigation]);

  useFocusEffect(React.useCallback(() => {}, []));

  const clearInput = () => {
    setTypeId(0);
    setEventType('');
    setIdList([]);
    setIdTemp([]);
    setNameList([]);
    setNameTemp([]);
    setCategoryNames('');
    setEventLoc('');
    setLatitude(0);
    setLongitude(0);
    setEventStDate('');
    setEventEdDate('');
    setEventStTime('');
    setEventEdTime('');
    setEventDesc('');
    setEventGuest('');
    setEventRate('');
    inputDesc.current.setValue('');
    inputGuests.current.setValue('');
    inputRate.current.setValue('');
  };

  const ChangePlace = data => {
    console.log('updated place--->3', data);
    if (data.includes(', USA')) setEventLoc(data.replace(', USA', ''));
    else setEventLoc(data);
    getCoordinates(data);
  };

  const getCoordinates = data => {
    Geocoder.from(data)
      .then(json => {
        var location = json.results[0].geometry.location;
        console.log(location);
        setLatitude(location.lat);
        setLongitude(location.lng);
      })
      .catch(error => console.log(error));
  };

  // const MapPlace = (data, lat, lng) => {
  //   console.log('updated place--->', data);
  //   setEventLoc(data);
  //   setLatitude(lat);
  //   setLongitude(lng);
  // };

  // const GoToMaps = (lat, lng) => {
  //   props.navigation.navigate('GooglePointer', {
  //     lat: lat,
  //     lng: lng,
  //   });
  // };

  const hideDateDialog = () => {
    setDateVisibility(false);
  };
  const handleDateConfirm = date => {
    hideDateDialog();
    if (dateType == 1) {
      if (eventEdDate == '') {
        setEventStDate(date);
      } else {
        if (date > eventEdDate)
          toast.current.show('Start Date should be smaller', 2000, () => {});
        else {
          setEventStDate(date);
          setEventStTime('');
          setEventEdTime('');
        }
      }
    } else {
      setEventEdDate(date);
      setEventStTime('');
      setEventEdTime('');
      // if (date < eventStDate)
      //   toast.current.show('End date should be greater', 2000, () => {});
      // else {
      //   setEventEdDate(date);
      //   setEventStTime('');
      //   setEventEdTime('');
      // }
    }
  };

  const hideTimeDialog = () => {
    setTimeVisibility(false);
  };
  const handleTimeConfirm = time => {
    console.log('selected time:- ############# ', time);
    hideTimeDialog();
    if (timeType === 1) {
      if (eventEdTime == '') setEventStTime(time);
      else checkStartTime(time);
    } else {
      checkEndTime(time);
    }
  };

  const checkStartTime = time => {
    if (Moment(eventStDate).format('ll') === Moment(eventEdDate).format('ll')) {
      if (time >= eventEdTime)
        toast.current.show('Start Time should be smaller', 2000, () => {});
      else setEventStTime(time);
    } else {
      setEventStTime(time);
    }
  };

  const checkEndTime = time => {
    if (Moment(eventStDate).format('ll') === Moment(eventEdDate).format('ll')) {
      if (time <= eventStTime)
        toast.current.show('End Time should be greater', 2000, () => {});
      else setEventEdTime(time);
    } else {
      setEventEdTime(time);
    }
  };

  const checkValidate = async () => {
    Keyboard.dismiss();
    // console.log("eventStTime @@@@@@@@@@@@@@:- ",Moment(eventStTime).format('LT'))
    // console.log("eventEdTime @@@@@@@@@@@@@@:- ",Moment(eventEdTime).format('LT'))

    // var startTime=Moment(eventStTime).format('LT')
    // var endTime=Moment(eventEdTime).format('LT')

    // console.log("@@@@@@@@@@@@@@@@ start time:- ",Moment(startTime, "h:mm:ss A").format("HH:mm:ss"))
    // console.log("@@@@@@@@@@@@@@@@ start time:- ",Moment(endTime, "h:mm:ss A").format("HH:mm:ss"))
    if (eventType.length == 0) {
      toast.current.show('Please select event type', 2000, () => {});
    } else if (IdList.length == 0) {
      toast.current.show('Please select busker type', 2000, () => {});
    } else if (eventLoc.length == 0) {
      toast.current.show('Please enter event location', 2000, () => {});
    } else if (eventStDate.length == 0) {
      toast.current.show('Please select event start date', 2000, () => {});
    } else if (eventEdDate.length == 0) {
      toast.current.show('Please select event end date', 2000, () => {});
    } else if (eventStTime.length == 0) {
      toast.current.show('Please select event start time', 2000, () => {});
    } else if (eventEdTime.length == 0) {
      toast.current.show('Please select event end time', 2000, () => {});
    } else if (eventDesc.length == 0) {
      toast.current.show('Please enter event description', 2000, () => {});
    } else if (eventGuest.length == 0) {
      toast.current.show('Please enter no of guests', 2000, () => {});
    } else if (eventRate.length == 0) {
      toast.current.show('Please enter hourly rate', 2000, () => {});
    } else if (eventRate == 0) {
      toast.current.show('Hourly rate cannot be zero', 2000, () => {});
    } else {
      //modify the object however you want to here
      let hireData = {
        event_type: typeId,
        busker_type: IdList,
        description: eventDesc,
        event_location: eventLoc,
        latitude: latitude,
        longitude: longitude,
        event_date: Moment(eventStDate).format('YYYY-MM-DD'),
        event_end_date: Moment(eventEdDate).format('YYYY-MM-DD'),
        start_time: Moment(eventStTime).format('HH:mm:ss'),
        end_time: Moment(eventEdTime).format('HH:mm:ss'),
        guest_size: eventGuest,
        hourly_rate: eventRate,
      };
      props.navigation.navigate('AvailBuskers', {
        hireData: hireData,
      });
    }
  };

  //******************** Hit Categories Api *******************
  const CategoriesApi = async () => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.genreList);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.genreList, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
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
            data.forEach(element => {
              if (IdList.length != 0) {
                var index = IdList.indexOf(element.id);
                if (index !== -1) element.state = true;
                else element.state = false;
              } else {
                element.state = false;
              }
            });
            setCategories(data);
            setCategoryModalVisible(true);
          } else {
            toast.current.show(responseJson.message, 2000);
          }
        } else {
          if (responseJson.hasOwnProperty('message')) {
            toast.current.show(responseJson.message, 2000);
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
            toast.current.show(responseJson[key][secondKey][0], 2000);
          }
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        toast.current.show(err.message, 2000, () => {});
      });
  };

  const categoryRowItem = (item, pos) => {
    return (
      <TouchableOpacity
        style={
          item.state ? styles.genreActiveContainer : styles.genreBtnContainer
        }
        activeOpacity={0.5}
        onPress={() => onPressItem(item, pos)}>
        <Text style={item.state ? styles.genreActiveText : styles.genreBtnText}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const onPressItem = (item, pos) => {
    item.state = !item.state;
    setCategories([...categories]);

    var index = IdTemp.indexOf(item.id);
    if (index !== -1) IdTemp.splice(index, 1);
    else IdTemp.push(item.id);
    var index = NameTemp.indexOf(item.name);
    if (index !== -1) NameTemp.splice(index, 1);
    else NameTemp.push(item.name);

    console.log('Ids select:', IdTemp);
  };

  const onCategoryDone = () => {
    setIdList([...IdTemp]);
    setNameList([...NameTemp]);
    setCategoryNames(NameTemp.join(', '));
    console.log('IdDone:', IdTemp);
    console.log('ListDone:', NameTemp);
    setCategoryModalVisible(false);
  };

  const openCategoryModel = () => {
    if (IdList != 0) {
      setIdTemp([...IdList]);
      setNameTemp([...NameList]);
    } else {
      setIdTemp([]);
      setNameTemp([]);
    }
    CategoriesApi();
    console.log('IdOpen:', IdList);
    console.log('ListOpen:', NameList);
  };

  const closeCategoryModel = () => {
    if (IdList != 0) {
      setIdTemp([...IdList]);
      setNameTemp([[...NameList]]);
    } else {
      setIdTemp([]);
      setNameTemp([]);
    }
    setCategoryModalVisible(false);
    console.log('IdClose:', IdList);
    console.log('ListClose:', NameList);
  };

  //******************** Hit Types Api *******************
  const TypesApi = async () => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.eventTypes);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.eventTypes, {
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
            setTypes(data);
            setTypeModalVisible(true);
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

  const typeRowItem = (item, pos) => {
    return (
      <TouchableOpacity
        style={styles.typeContainer}
        activeOpacity={0.5}
        onPress={() => {
          setTypeId(item.id);
          setEventType(item.event_name);
          setTypeModalVisible(false);
        }}>
        <Text style={styles.typeText}>{item.event_name}</Text>
      </TouchableOpacity>
    );
  };
  const dividerItem = () => {
    return <View style={styles.dividerStyle} />;
  };

  const formatNumber = text => {
    return text.replace(/[^+\d]/g, '');
  };

  const formatText = text => {
    return text.replace(/[^a-zA-Z\s]/g, '');
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
        <Text style={styles.titleText}>{I18n.t('findBusker.header_txt')}</Text>
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
      <KeyboardAvoidingView
        style={styles.viewStyle}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.viewStyle}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps={'handled'}
          overScrollMode="never">
          <TouchableOpacity
            style={styles.editContainer}
            onPress={() => TypesApi()}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('findBusker.event_type')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.black}}
              defaultValue={eventType}
              editable={false}
              autoCapitalize={'none'}
              keyboardType={'default'}
            />
            <Image
              style={styles.rightIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_drop_down.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editContainer}
            onPress={() => openCategoryModel()}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('findBusker.busker_type')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.black}}
              defaultValue={categoryNames}
              editable={false}
              autoCapitalize={'none'}
              keyboardType={'default'}
            />
            <Image
              style={styles.rightIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_drop_down.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editContainer}
            onPress={() => {
              props.navigation.navigate('GooglePlaces', {
                onPlaceSelect: ChangePlace,
              });
            }}>
            <TextField
              selectionColor={Colors.theme}
              //placeholder={I18n.t('findBusker.event_loc')}
              //placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.black}}
              keyboardType={'default'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              editable={false}
              //defaultValue={eventLoc}
              //onChangeText={setEventLoc}
            />
            <Text
              style={{
                position: 'absolute',
                fontSize: 16,
                fontFamily: Fonts.MontserratMedium,
                color: eventLoc == '' ? Colors.grey : Colors.black,
                paddingRight: 25,
                top: 22,
              }}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {eventLoc == '' ? I18n.t('findBusker.event_loc') : eventLoc}
            </Text>
            <Image
              style={styles.rightIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_location.png')}
            />
          </TouchableOpacity>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => {
                setDateType(1);
                setDateVisibility(true);
              }}>
              <TextField
                selectionColor={Colors.theme}
                placeholder={I18n.t('findBusker.event_st_date')}
                placeholderTextColor={Colors.grey}
                inputContainerStyle={styles.inputContainer}
                tintColor={Colors.theme}
                labelFontSize={0}
                fontSize={16}
                style={{
                  fontFamily: Fonts.MontserratMedium,
                  color: Colors.black,
                }}
                editable={false}
                defaultValue={
                  eventStDate != '' ? Moment(eventStDate).format('l') : ''
                }
              />

              <Image
                style={styles.rightIcon}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_calendar.png')}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => {
                if (eventStDate == '')
                  toast.current.show(
                    'Select Event Start Date First',
                    2000,
                    () => {},
                  );
                else {
                  setDateType(2);
                  setDateVisibility(true);
                }
              }}>
              <TextField
                selectionColor={Colors.theme}
                placeholder={I18n.t('findBusker.event_ed_date')}
                placeholderTextColor={Colors.grey}
                inputContainerStyle={styles.inputContainer}
                tintColor={Colors.theme}
                labelFontSize={0}
                fontSize={16}
                style={{
                  fontFamily: Fonts.MontserratMedium,
                  color: Colors.black,
                }}
                editable={false}
                defaultValue={
                  eventEdDate != '' ? Moment(eventEdDate).format('l') : ''
                }
              />

              <Image
                style={styles.rightIcon}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_calendar.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => {
                setTimeVisibility(true);
                setTimeType(1);
              }}>
              <TextField
                selectionColor={Colors.theme}
                placeholder={I18n.t('findBusker.start_time')}
                placeholderTextColor={Colors.grey}
                inputContainerStyle={styles.inputContainer}
                tintColor={Colors.theme}
                labelFontSize={0}
                fontSize={16}
                style={{
                  fontFamily: Fonts.MontserratMedium,
                  color: Colors.black,
                }}
                editable={false}
                defaultValue={
                  eventStTime != '' ? Moment(eventStTime).format('LT') : ''
                }
              />

              <Image
                style={styles.rightIcon}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_watch.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => {
                if (eventStTime == '')
                  toast.current.show('Select Start Time First', 2000, () => {});
                else {
                  setTimeVisibility(true);
                  setTimeType(2);
                }
              }}>
              <TextField
                selectionColor={Colors.theme}
                placeholder={I18n.t('findBusker.end_time')}
                placeholderTextColor={Colors.grey}
                inputContainerStyle={styles.inputContainer}
                tintColor={Colors.theme}
                labelFontSize={0}
                fontSize={16}
                style={{
                  fontFamily: Fonts.MontserratMedium,
                  color: Colors.black,
                }}
                editable={false}
                defaultValue={
                  eventEdTime != '' ? Moment(eventEdTime).format('LT') : ''
                }
              />

              <Image
                style={styles.rightIcon}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_watch.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              ref={inputDesc}
              placeholder={I18n.t('findBusker.event_desc')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              maxLength={250}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.black}}
              keyboardType={'default'}
              returnKeyType={'done'}
              returnKeyLabel={'Done'}
              defaultValue={eventDesc}
              value={eventDesc}
              onChangeText={setEventDesc}
            />
          </View>
          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              ref={inputGuests}
              placeholder={I18n.t('findBusker.no_of_guest')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              maxLength={3}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.black}}
              keyboardType={'number-pad'}
              returnKeyType={'done'}
              returnKeyLabel={'Done'}
              defaultValue={eventGuest}
              value={eventGuest}
              onChangeText={setEventGuest}
              formatText={text => formatNumber(text)}
            />
            {eventGuest.length != 0 && (
              <Text style={styles.hourTextStyle}>
                {I18n.t('artist.guests')}
              </Text>
            )}
          </View>
          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              ref={inputRate}
              placeholder={I18n.t('findBusker.hourly_rate')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              maxLength={4}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.black}}
              keyboardType={'number-pad'}
              returnKeyType={'done'}
              returnKeyLabel={'Done'}
              defaultValue={eventRate}
              value={eventRate}
              onChangeText={setEventRate}
              formatText={text => formatNumber(text)}
            />
            {eventRate.length != 0 && (
              <Text style={styles.hourTextStyle}>
                {I18n.t('artist.per_hour')}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.btnContainer}
            activeOpacity={0.5}
            onPress={() => checkValidate()}>
            <Text style={styles.btnText}>
              {I18n.t('findBusker.search_busker')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <DateTimePickerModal
        modalStyleIOS={{color: 'red'}}
        isVisible={dateVisibility}
        mode="date"
        minimumDate={
          dateType == 1
            ? new Date(Date.now() + 86400000)
            : new Date(eventStDate)
        }
        date={
          dateType == 1
            ? eventStDate != ''
              ? new Date(eventStDate)
              : new Date(Date.now() + 86400000)
            : eventEdDate != ''
            ? new Date(eventEdDate)
            : new Date(Date.now() + 86400000)
        }
        onConfirm={handleDateConfirm}
        onCancel={hideDateDialog}
        headerTextIOS={dateType == 1 ? 'Pick Start Date' : 'Pick End Date'}
        textColor={Colors.black}
        isDarkModeEnabled={false}
      />

      <DateTimePickerModal
        isVisible={timeVisibility}
        mode="time"
        is24Hour={false}
        date={
          timeType == 1
            ? eventStTime != ''
              ? new Date(eventStTime)
              : new Date()
            : eventEdTime != ''
            ? new Date(eventEdTime)
            : new Date()
        }
        onConfirm={handleTimeConfirm}
        onCancel={hideTimeDialog}
        headerTextIOS={timeType == 1 ? 'Pick Start Time' : 'Pick End Time'}
        // textColor={Colors.black}
        isDarkModeEnabled={false}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={typeModalVisible}
        onRequestClose={() => setTypeModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.dialogModal}>
            <View style={styles.modalRowContainer}>
              <Text style={styles.modalHeadText}>
                {I18n.t('findBusker.types')}
              </Text>
              <TouchableOpacity onPress={() => setTypeModalVisible(false)}>
                <Image
                  style={styles.modalCloseStyle}
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/ic_close.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.dividerStyle} />
            <FlatList
              showsVerticalScrollIndicator={false}
              bounces={false}
              overScrollMode={'never'}
              data={types}
              renderItem={({item, pos}) => typeRowItem(item, pos)}
              keyExtractor={item => item.keyExtractor}
              ItemSeparatorComponent={dividerItem}
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={() => closeCategoryModel()}>
        <View style={styles.modalBackground}>
          <View style={styles.dialogModal}>
            <View style={styles.modalRowContainer}>
              <Text style={styles.modalHeadText}>
                {I18n.t('common.genres')}
              </Text>
              <TouchableOpacity onPress={() => closeCategoryModel()}>
                <Image
                  style={styles.modalCloseStyle}
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/ic_close.png')}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              bounces={false}
              overScrollMode={'never'}
              style={{alignSelf: 'center'}}
              data={categories}
              numColumns={3}
              renderItem={({item, pos}) => categoryRowItem(item, pos)}
              keyExtractor={item => item.keyExtractor}
            />
            <TouchableOpacity
              style={styles.doneBtnContainer}
              onPress={() => onCategoryDone()}>
              {/* <Text style={styles.doneBtnTxt}>{I18n.t('common.done_btn')}</Text> */}
              <Image
                style={styles.imgBtnView}
                source={require('../../Assets/Images/done_btn.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

export default FindBusker;
