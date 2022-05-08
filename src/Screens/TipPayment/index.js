import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  AsyncStorage,
  Dimensions,
  KeyboardAvoidingView,
  SafeAreaView,
  Keyboard,
  TextInput,
} from 'react-native';
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
import RBSheet from 'react-native-raw-bottom-sheet';
//import {TextInputMask} from 'react-native-masked-text';
import TextInputMask from 'react-native-text-input-mask';
const {height} = Dimensions.get('window');

const TipPayment = props => {
  const {id, name} = props.route.params;
  const [user, setUser] = useState('');
  const [buskerId, setBuskerId] = useState(0);
  const [buskerName, setBuskerName] = useState('Busker Name');
  const [image, setImage] = useState('');

  const inputRef = useRef(null);
  const [inputFocus, setInputFocus] = useState(false);
  const [tips, setTips] = useState([]);
  const [tip, setTip] = useState('');
  const [customTip, setCustomTip] = useState('');

  const [tiptype, setTipType] = useState(0);
  const [tipNull, setTipNull] = useState(null);
  const [minTip, setMinTip] = useState(0);
  const [paypalActive, setPaypalActive] = useState(false);
  const [stripeActive, setStripeActive] = useState(false);
  const [note, setNote] = useState('');

  const RBRef = useRef(null);
  const toast = useRef(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setBuskerId(id);
    setBuskerName(name);
    // Preload data using AsyncStorage
    AsyncStorage.getItem('UserDetails', (err, result) => {
      if (err === null) {
        let res = JSON.parse(result);
        setUser(res);
        BuskerPayouts(res);
        TipCommissions(res);
      }
    });

    let data = [
      {id: 1, amount: '0.50', active: false},
      {id: 2, amount: '1.00', active: false},
      {id: 3, amount: '2.00', active: false},
      {id: 4, amount: '5.00', active: false},
    ];
    setTips(data);

    //KeyBoard Listeners
    // Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    // Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // // cleanup function
    // return () => {
    //   Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
    //   Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    // };
  }, []);

  // callack from Trasaction Web Screens with Error or Message
  const callback = message => {
    toast.current.show(message, 2000, () => {});
  };

  const ConTwoDecDigit = digit => {
    return digit.indexOf('.') > 0
      ? digit.split('.').length >= 2
        ? digit.split('.')[0] + '.' + digit.split('.')[1].substring(-1, 2)
        : digit
      : digit;
  };

  const formatText = text => {
    return text
      .replace(/[^\dA-Z]/g, '')
      .replace(/(.{2})/g, '$1.')
      .trim();
  };

  //******************** Hit Tips Commission Api ***********************
  const TipCommissions = async user => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.tipCommission);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.tipCommission, {
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
            if (data.length != 0) {
              setMinTip(data[0].value);
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

  //******************** Hit Busker Payouts Api ***********************
  const BuskerPayouts = async user => {
    let data = {busker_id: id};
    setLoading(true);
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.buskerActivePayouts,
    );
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.buskerActivePayouts, {
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
          if (responseJson.success) {
            var data = responseJson.data;
            if (
              data.hasOwnProperty('busker_paypal_account') &&
              data.hasOwnProperty('busker_stripe_account')
            ) {
              setPaypalActive(true);
              setStripeActive(true);
              setTipType(1);
            } else if (data.hasOwnProperty('busker_paypal_account')) {
              setPaypalActive(true);
              setTipType(1);
            } else if (data.hasOwnProperty('busker_stripe_account')) {
              setStripeActive(true);
              setTipType(2);
            }
          } else {
            toast.current.show(responseJson.message, 2000, () => {});
            setPaypalActive(true);
            setStripeActive(true);
            setTipType(0);
            setTipNull(1);
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

  const sendTip = tipValue => {
    if (Number(tipValue) > 0) {
      if (tiptype == 0) {
        toast.current.show(
          'Busker has not yet set up their tipping account',
          2000,
          () => {},
        );
      } else {
        if (tiptype == 1 && Number(tipValue) > Number(minTip))
          props.navigation.navigate('PaypalPayout', {
            amount: tipValue,
            noteDesc: note,
            receiverId: buskerId,
            receiverName: buskerName,
            callback: callback,
          });
        else if (tiptype == 2 && Number(tipValue) > Number(minTip))
          props.navigation.navigate('StripePayout', {
            amount: tipValue,
            noteDesc: note,
            receiverId: buskerId,
            receiverName: buskerName,
            callback: callback,
          });
        else
          toast.current.show(
            'Tip Amount is less than the minimum tip',
            3000,
            () => {},
          );
      }
    }
  };

  const onCheckTip = () => {
    let dataArray = tips;
    dataArray.forEach(element => {
      element.active = false;
    });
    setTips([...dataArray]);
    setTip('');
  };

  const onPressTip = (item, index) => {
    let dataArray = tips;
    
    console.log("data array:- ",dataArray)
    
    dataArray = dataArray.map(e => {
      if (item.id === e.id) {
        item.active = !e.active;
        return item;
      } else {
        e.active = false;
        return e;
      }
    });
    console.log("data array:- ------",dataArray)
    setTips(dataArray);
    if(item.active)
    setTip(item.amount);
    else
    setTip('')
    setCustomTip('');
    //inputRef.current.setValue('');
  };

  // Row Component for Images
  const tipItem = (item, pos) => {
    return (
      <TouchableOpacity
        style={item.active ? styles.rowActiveStyle : styles.rowViewStyle}
        activeOpacity={0.5}
        onPress={() => onPressTip(item, pos)}>
        <Text
          style={item.active ? styles.rowActiveText : styles.rowInactiveText}>
          {I18n.t('common.currency') + item.amount}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleChange = event => {
    console.log('Keyboard Press:' + event.nativeEvent.key);
    var est = parseFloat(
      parseFloat(customTip == '' ? 0 : customTip) * 10 +
        parseFloat(event.nativeEvent.key) / 100,
    ).toString();

    console.log('est:', est);
    setCustomTip(est);
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
        <Text style={styles.titleText}>{I18n.t('tipBusker.tip_payment')}</Text>
        <View style={styles.backImageBack} />
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
          <Image
            style={styles.profileImageStyle}
            source={
              image != null && image != ''
                ? {uri: image}
                : require('../../Assets/Images/busker_tip.png')
            }
            resizeMode={'cover'}
          />
          <Text style={styles.nameText}>{buskerName}</Text>

          {/* Detail View */}
          <Text style={[styles.headerText]}>
            {I18n.t('tipBusker.leave_tip')}
          </Text>

          <View style={styles.rowContainer}>
            <FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              bounces={false}
              overScrollMode={'never'}
              contentContainerStyle={{paddingVertical: 15}}
              //style={{alignSelf: 'center'}}
              data={tips}
              horizontal={true}
              renderItem={({item, pos}) => tipItem(item, pos)}
              keyExtractor={item => item.keyExtractor}
            />
          </View>

          {/* * mask: (String | required | default '')
           * the mask pattern
           * 9 - accept digit.
           * A - accept alpha.
           * S - accept alphanumeric.
           * * - accept all, EXCEPT white space. */}

          {/* <TextInputMask
            type={'custom'}
            placeholder={I18n.t('tipBusker.tip_hint')}
            style={{
              height: 45,
              marginHorizontal: 20,
              marginBottom: 30,
              fontFamily: Fonts.MontserratRegular,
              color: Colors.black,
              justifyContent: 'flex-start',
              textAlign: 'right',
            }}
            options={{
              mask: '999.99',
            }}
            value={customTip}
            onChangeText={text => {
              onCheckTip();
              setCustomTip(text);
            }}
            keyboardType={'decimal-pad'}
            returnKeyType="done"
            returnKeyLabel="Done"
            maxLength={6}
          /> */}

          <Text style={styles.headerText}>
            {I18n.t('tipBusker.enter_custom_tip')}
          </Text>
          <TextInputMask
            refInput={inputRef}
            placeholder={I18n.t('tipBusker.tip_hint')}
            style={{
              height: 40,
              marginHorizontal: 20,
              fontFamily: Fonts.MontserratRegular,
              color: Colors.black,
              justifyContent: 'flex-start',
              textAlign: 'right',
            }}
            //value={customTip}
            onChangeText={(formatted, extracted) => {
              console.log('formated', formatted); // +1 (123) 456-78-90
              console.log('extracted', extracted); // 1234567890
              onCheckTip();
              if (formatted.endsWith('.')) setCustomTip(formatted + '0');
              else setCustomTip(formatted);
            }}
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
            mask={'[99].[00]'}
            keyboardType={'decimal-pad'}
            returnKeyType="done"
            returnKeyLabel="Done"
          />
          <View
            style={{
              height: inputFocus ? 2 : 0.7,
              marginHorizontal: 20,
              marginBottom: 30,
              backgroundColor: inputFocus ? Colors.theme : Colors.grey,
            }}
          />

          {/* <View style={styles.editContainer}>
             <TextField
              selectionColor={Colors.theme}
              ref={inputRef}
              placeholder={I18n.t('tipBusker.tip_hint')}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              maxLength={5}
              style={{
                fontFamily: Fonts.MontserratRegular,
                color: Colors.black,
                justifyContent: 'flex-start',
                textAlign: 'right',
              }}
              keyboardType={'decimal-pad'}
              returnKeyType="done"
              returnKeyLabel="Done"
              formatText={formatText}
              defaultValue={customTip}
              value={customTip}
              onChangeText={val => {
                onCheckTip();
              }}
            />
          </View> */}
          {/* <TextInput
            refInput={inputRef}
            placeholder={I18n.t('tipBusker.tip_hint')}
            style={{
              height: 40,
              marginHorizontal: 20,
              fontFamily: Fonts.MontserratRegular,
              color: Colors.black,
              justifyContent: 'flex-start',
              textAlign: 'right',
            }}
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
            keyboardType={'number-pad'}
            returnKeyType="done"
            returnKeyLabel="Done"
            //onKeyPress={handleChange}
            onChangeText={val => {
              onCheckTip();
              var temp = parseFloat(val / 100);
              setCustomTip(temp);
            }}
          />
          <View
            style={{
              height: inputFocus ? 2 : 0.7,
              marginHorizontal: 20,
              marginBottom: 30,
              backgroundColor: inputFocus ? Colors.theme : Colors.grey,
            }}
          /> */}

          <Text style={styles.headerText}>{I18n.t('tipBusker.add_note')}</Text>
          <View style={styles.editContainer}>
             <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('tipBusker.note_hint')}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              maxLength={100}
              style={{fontFamily: Fonts.MontserratRegular, color: Colors.black}}
              keyboardType={'default'}
              returnKeyType="done"
              returnKeyLabel="Done"
              defaultValue={note}
              onChangeText={setNote}
            />
          </View>
          {/* Pay View Conatiner */}
          <Text style={styles.headerText}>{I18n.t('tipBusker.pay_using')}</Text>
          <View style={styles.payContainer}>
            {(stripeActive || paypalActive) && tipNull == null && (
              <Image
                style={styles.payImageStyle}
                source={
                  tiptype == 1
                    ? require('../../Assets/Images/paypal.png')
                    : ""
                    // require('../../Assets/Images/stripe.png')
                }
                resizeMode={'contain'}
              />
            )}

            {(stripeActive || paypalActive) && tipNull != null && (
              <Image
                style={styles.payImageStyle}
                source={
                  tipNull == 1
                    ? require('../../Assets/Images/paypal.png')
                    : ""
                    // require('../../Assets/Images/stripe.png')
                }
                resizeMode={'contain'}
              />
            )}

            {/* {stripeActive && paypalActive && (
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => {
                  RBRef.current.open();
                }}>
                <Text style={styles.changeText}>
                  {I18n.t('tipBusker.select_txt')}
                </Text>
                <Image
                  style={styles.dropIconStyle}
                  source={require('../../Assets/Images/ic_drop_down.png')}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            )} */}
          </View>

          <TouchableOpacity
            style={
              Number(tip) > 0 || Number(customTip) > 0
                ? styles.btnContainer
                : styles.btnInactiveContainer
            }
            activeOpacity={0.7}
            onPress={() => {
              if (tip != '') sendTip(tip);
              else sendTip(customTip);
            }}>
            <Text style={styles.btnText}>
              <Text>
                {I18n.t('tipBusker.submit_tip') +
                  '(' +
                  I18n.t('common.currency')}
              </Text>
              <Text>{tip != '' ? tip : customTip}</Text>
              <Text>{')'}</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Slider Payment Sheet */}
      {/* <RBSheet
        ref={RBRef}
        height={Platform.OS === 'ios' && height >= 812 ? 160 : 125}
        closeOnDragDown={true}
        //closeOnPressMask={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            justifyContent: 'center',
            flexWrap: 'wrap',
          },
        }}>
        <>
          <View style={styles.sheet_headContainer}>
            <Text style={styles.sheet_head_text}>
              {I18n.t('tipBusker.choose_option')}
            </Text>
          </View>
          {tiptype == 1 && (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.container_sheet_row}
              onPress={() => {
                RBRef.current.close();
                setTipType(2);
              }}>
              <Image
                style={styles.payment_pic}
                source={require('../../Assets/Images/stripe_logo.png')}
                resizeMode="stretch"
              />
              <View style={styles.container_sheet_text}>
                <Text style={styles.sheet_text_view}>{'Stripe'}</Text>
              </View>
            </TouchableOpacity>
          )}
          {tiptype == 2 && (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.container_sheet_row}
              onPress={() => {
                RBRef.current.close();
                setTipType(1);
              }}>
              <Image
                style={styles.payment_pic}
                source={require('../../Assets/Images/paypal_logo.png')}
                resizeMode="stretch"
              />
              <View style={styles.container_sheet_text}>
                <Text style={styles.sheet_text_view}>{'Paypal'}</Text>
              </View>
            </TouchableOpacity>
          )}

          {tiptype == 0 && tipNull == 1 && (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.container_sheet_row}
              onPress={() => {
                RBRef.current.close();
                setTipNull(2);
              }}>
              <Image
                style={styles.payment_pic}
                source={require('../../Assets/Images/stripe_logo.png')}
                resizeMode="stretch"
              />
              <View style={styles.container_sheet_text}>
                <Text style={styles.sheet_text_view}>{'Stripe'}</Text>
              </View>
            </TouchableOpacity>
          )}

          {tiptype == 0 && tipNull == 2 && (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.container_sheet_row}
              onPress={() => {
                RBRef.current.close();
                setTipNull(1);
              }}>
              <Image
                style={styles.payment_pic}
                source={require('../../Assets/Images/paypal_logo.png')}
                resizeMode="stretch"
              />
              <View style={styles.container_sheet_text}>
                <Text style={styles.sheet_text_view}>{'Paypal'}</Text>
              </View>
            </TouchableOpacity>
          )}
        </>
      </RBSheet> */}

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

export default TipPayment;
