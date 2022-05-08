import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import Fonts from '../../Res/Fonts';
import {TextField} from 'react-native-material-textfield';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';
import I18n from '../../Config/I18n';

const ForgotPassword = props => {
  const {email, value} = props.route.params;
  const [pin, setPIN] = useState('');
  const [otp, setOTP] = useState('');

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    setPIN(value);
  }, []);

  const resetVerify = () => {
    Keyboard.dismiss();
    if (otp.length == 0) {
      toast.current.show('Please enter otp', 2000, () => {});
    } else if (otp != pin) {
      toast.current.show("OTP Doesn't Match", 2000, () => {});
    } else {
      let data = {
        otp: otp,
        email: email,
      };
      VerifyOtpApi(data);
    }
  };

  //******************** Hit ForgotOtp Api *******************
  const ForgotOtpApi = async () => {
    let data = {
      email: email,
    };
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.forgotVerify);
    console.log('Data', JSON.stringify(data));
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.forgotVerify, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
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
          var data = responseJson.data;
          setPIN(data.otp);
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

  //******************** Hit VerifyOtp Api *******************
  const VerifyOtpApi = async data => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.verifyOTP);
    console.log('Data', JSON.stringify(data));
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.verifyOTP, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
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
            props.navigation.navigate('ResetPassword', {email: email});
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
          {I18n.t('forgotOtp.forgot_password')}
        </Text>
        <View style={styles.backImageBack} />
      </View>
      <KeyboardAvoidingView style={styles.viewStyle}>
        <ScrollView
          style={styles.viewStyle}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps={'handled'}
          overScrollMode="never">
          <Image
            style={styles.logoStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/otp_image.png')}
          />

          <Text style={styles.headerText}>{I18n.t('forgotOtp.enter_otp')}</Text>

          <Text style={styles.messageText}>{I18n.t('forgotOtp.otp_msg')}</Text>

          {/* <View style={styles.editContainer}>
             <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('common.enter_email')}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              style={{fontFamily: Fonts.MontserratRegular, color: Colors.black}}
              keyboardType={'email-address'}
            />
          </View> */}

          <OTPInputView
            style={styles.otpViewStyle}
            pinCount={6}
            keyboardType="number-pad"
            onCodeChanged={setOTP}
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={code => {
              Keyboard.dismiss();
              console.log(`Code is ${code}, you are good to go!`);
            }}
          />

          <TouchableOpacity
            style={styles.btnContainer}
            activeOpacity={0.5}
            onPress={() => {
              resetVerify();
            }}>
            <Image
              style={styles.btnImage}
              resizeMode={'contain'}
              source={require('../../Assets/Images/forward.png')}
            />
          </TouchableOpacity>

          <View style={styles.bottomContainer}>
            <Text style={styles.bottomText}>
              {I18n.t('forgotOtp.have_not_receive')}
            </Text>
            <TouchableOpacity onPress={() => ForgotOtpApi()}>
              <Text style={styles.linkText}>
                {I18n.t('forgotOtp.resend_otp')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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

export default ForgotPassword;
