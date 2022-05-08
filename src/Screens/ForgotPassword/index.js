import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  StatusBar,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import Fonts from '../../Res/Fonts';
import {TextField} from 'react-native-material-textfield';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';
import I18n from '../../Config/I18n';

const ForgotPassword = props => {
  const [email, setEmail] = useState('');

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  useEffect(() => {}, []);

  //***************** Functions  *******************/
  const validateEmail = email => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  };

  const forgot = async () => {
    Keyboard.dismiss();
    if (email.length == 0) {
      toast.current.show('Please enter email', 2000, () => {});
    } else if (!validateEmail(email)) {
      toast.current.show('Please check email', 2000, () => {});
    } else {
      Keyboard.dismiss();
      let data = {
        email: email,
      };
      ForgotOtpApi(data);
    }
  };

  //******************** Hit ForgotOtp Api *******************
  const ForgotOtpApi = async data => {
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
          if (responseJson.success == 'true') {
            var data = responseJson.data;
            props.navigation.navigate('ForgotOTP', {
              email: email,
              value: data.otp,
            });
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
          {I18n.t('forgotPassword.forgot_password')}
        </Text>
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
            style={styles.logoStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/forgot_image.png')}
          />

          <Text style={styles.headerText}>
            {I18n.t('forgotPassword.forgot_header')}
          </Text>

          <Text style={styles.messageText}>
            {I18n.t('forgotPassword.forgot_msg')}
          </Text>

          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('common.enter_email')}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              style={{fontFamily: Fonts.MontserratRegular, color: Colors.black}}
              keyboardType={'email-address'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              autoCorrect={false}
              onChangeText={setEmail}
            />
            <Image
              style={styles.editIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_mail.png')}
            />
          </View>

          <TouchableOpacity
            style={styles.btnContainer}
            activeOpacity={0.5}
            onPress={() => {
              forgot();
            }}>
            <Text style={styles.btnText}>{I18n.t('common.next_btn')}</Text>
          </TouchableOpacity>
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
