import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  Keyboard,
  AsyncStorage,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
} from 'react-native';
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
import {
  timeout,
  processResponse,
  calculate_age,
} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';

import Geocoder from 'react-native-geocoding';
const GOOGLE_API_KEY = 'AIzaSyC2LNQ0xw5GxnOEe19r4SL7BLY6w04kIBg';

const BankDetails = props => {
  const {type} = props.route.params;
  const [user, setUser] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [abaRouting, setAbaRouting] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [ssn, setSSN] = useState('');
  const [dob, setDOB] = useState('');
  const [dateVisibility, setDateVisibility] = useState(false);

  const [eventLoc, setEventLoc] = useState('');

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
        if (type == 2) BankDetailsApi(res);
      }
    });
  }, []);

  const ChangePlace = data => {
    console.log('updated place--->1', data);
    setEventLoc(data);
  };

  const checkValidate = async () => {
    Keyboard.dismiss();
    if (accountName == '') {
      toast.current.show('Please enter account holder name', 2000, () => {});
    } else if (accountNumber == '') {
      toast.current.show('Please enter account number', 2000, () => {});
    } else if (swiftCode == '') {
      toast.current.show('Please enter swift code', 2000, () => {});
    } else if (abaRouting == '') {
      toast.current.show('Please enter aba routing', 2000, () => {});
    } else if (abaRouting.length < 9) {
      toast.current.show('aba routing must be 9 digits', 2000, () => {});
    } else if (dob === '') {
      toast.current.show('Date of Birth cannot be empty', 2000, () => {});
    } else if (address === '') {
      toast.current.show('Address cannot be empty', 2000, () => {});
    } else if (city === '') {
      toast.current.show('City cannot be empty', 2000, () => {});
    } else if (state === '') {
      toast.current.show('State cannot be empty', 2000, () => {});
    } else if (postalCode === '') {
      toast.current.show('Postal Code cannot be empty', 2000, () => {});
    } else if (!formatPostalCode(postalCode)) {
      toast.current.show('Postal Code not valid', 2000, () => {});
    } else if (ssn === '') {
      toast.current.show('SSN cannot be empty', 2000, () => {});
    } else if (ssn.length < 4) {
      toast.current.show('SSN not valid', 2000, () => {});
    } else {
      let data = {
        account_holder_name: accountName,
        account_number: accountNumber,
        BIC_code: swiftCode,
        ABA_routing: abaRouting,
        dob: Moment(dob).format('YYYY/MM/DD'),
        address: address,
        city: city,
        state: state,
        postal_code: postalCode,
        ssn_last_four: ssn,
      };
      UpdateBankApi(data);
    }
  };

  //******************** Hit Update Bank Api *******************
  const UpdateBankApi = async data => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.updateBankDetails);
    console.log('data', data);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.updateBankDetails, {
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
            props.navigation.goBack();
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

  //******************** Hit Bank Details Api *******************
  const BankDetailsApi = async user => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.buskerBankDetails);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.buskerBankDetails, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.access_token}`,
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
          if (responseJson.success) {
            var data = responseJson.data;
            setBankDetails(data);
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

  const setBankDetails = data => {
    setAccountName(data.acc_holder_name);
    setAccountNumber(data.acc_number);
    setSwiftCode(data.BIC_code);
    setAbaRouting(data.ABA_routing);
    setDOB(data.dob);
    setAddress(data.address);
    setCity(data.city);
    setState(data.state);
    setPostalCode(data.postal_code);
    setSSN(data.ssn_last_four);
  };

  // functions for bank details
  const hideDateDialog = () => {
    setDateVisibility(false);
  };
  const handleDateConfirm = date => {
    hideDateDialog();
    console.log('age---->', calculate_age(new Date(date)));
    setDOB(date);
  };

  const formatNumber = text => {
    return text.replace(/[^+\d]/g, '');
  };

  const formatPostalCode = code => {
    var re = /^[0-9]{5}(?:-[0-9]{4})?$/;
    return re.test(code);
  };

  const formatText = text => {
    return text.replace(/[^a-zA-Z\s]/g, '');
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
        <Text style={styles.titleText}>{I18n.t('bank.header_txt')}</Text>
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
          overScrollMode={'never'}>
          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('bank.account_name')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              maxLength={40}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.black}}
              defaultValue={accountName}
              autoCapitalize={'words'}
              keyboardType={'name-phone-pad'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              onChangeText={setAccountName}
              formatText={formatText}
            />
          </View>

          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('bank.account_number')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              maxLength={30}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.black}}
              defaultValue={accountNumber}
              autoCapitalize={'none'}
              formatText={formatNumber}
              keyboardType={'number-pad'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              onChangeText={setAccountNumber}
            />
          </View>

          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('bank.swift_code')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              maxLength={11}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.black}}
              defaultValue={swiftCode}
              autoCapitalize={'none'}
              keyboardType={'default'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              onChangeText={setSwiftCode}
            />
          </View>

          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('bank.aba_routing')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              maxLength={9}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.black}}
              defaultValue={abaRouting}
              autoCapitalize={'none'}
              formatText={formatNumber}
              keyboardType={'number-pad'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              onChangeText={setAbaRouting}
            />
          </View>

          <TouchableOpacity
            style={styles.editContainer}
            onPress={() => setDateVisibility(true)}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('bank.dob')}
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
              defaultValue={dob != '' ? Moment(dob).format('YYYY-MM-DD') : ''}
            />

            <Image
              style={styles.rightIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_calendar.png')}
            />
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.editContainer}
            onPress={() =>
              props.navigation.navigate('GooglePlaces', {
                onPlaceSelect: ChangePlace,
              })
            }>
             <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('findBusker.event_loc')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.black}}
              keyboardType={'default'}
              editable={false}
              defaultValue={eventLoc}
              onChangeText={setEventLoc}
            />
            <Image
              style={styles.rightIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_location.png')}
            />
          </TouchableOpacity> */}

          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('bank.address')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              maxLength={100}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.black}}
              defaultValue={address}
              keyboardType={'default'}
              autoCapitalize={'none'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              onChangeText={setAddress}
            />
          </View>
          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('bank.city')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              maxLength={40}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.black}}
              defaultValue={city}
              keyboardType={'default'}
              autoCapitalize={'none'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              onChangeText={setCity}
            />
          </View>
          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('bank.state')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              maxLength={40}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.black}}
              defaultValue={state}
              keyboardType={'default'}
              autoCapitalize={'none'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              onChangeText={setState}
            />
          </View>
          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('bank.postal_code')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              maxLength={15}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.black}}
              defaultValue={postalCode}
              keyboardType={'number-pad'}
              autoCapitalize={'none'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              onChangeText={setPostalCode}
            />
          </View>
          <View style={styles.editContainer}>
            <TextField
              placeholder={I18n.t('bank.ssn')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              maxLength={4}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.black}}
              defaultValue={ssn}
              keyboardType={'number-pad'}
              autoCapitalize={'none'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              formatText={formatNumber}
              onChangeText={setSSN}
            />
          </View>

          {/* Note Desc View */}
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.bankNoteTxt}>
              Note: We require these extra information to create your stripe
              account which help you recieve gifts directly in your bank
              account.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.btnContainer}
            activeOpacity={0.5}
            onPress={() => checkValidate()}>
            <Text style={styles.btnText}>{I18n.t('common.save_btn')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <DateTimePickerModal
        isVisible={dateVisibility}
        mode="date"
        maximumDate={new Date(Date.now() - 568025136000)}
        date={dob != '' ? new Date(dob) : new Date(Date.now() - 568025136000)}
        onConfirm={handleDateConfirm}
        onCancel={hideDateDialog}
        headerTextIOS={'PICK A DATE'}
        textColor={Colors.black}
        isDarkModeEnabled={false}
      />

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

export default BankDetails;
