import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  AsyncStorage,
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

import {useSelector, useDispatch} from 'react-redux';
import {deleteUser} from '../../Redux/Actions';

const ResetPassword = props => {
  const [user, setUser] = useState('');
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [secureOld, setSecureOld] = useState(true);
  const [secureNew, setSecureNew] = useState(true);

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  const userData = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // Preload data using AsyncStorage
    AsyncStorage.getItem('UserDetails', (err, result) => {
      if (err === null) {
        let res = JSON.parse(result);
        setUser(res);
      }
    });
  }, []);

  const changePass = () => {
    Keyboard.dismiss();
    if (oldPass.length == 0) {
      toast.current.show('Please enter old password', 2000, () => {});
    } else if (newPass.length == 0) {
      toast.current.show('Please enter new password', 2000, () => {});
    } else if (confirmPass.length == 0) {
      toast.current.show('Please confirm new password', 2000, () => {});
    } else if (newPass != confirmPass) {
      toast.current.show('Password Mismatch!', 2000, () => {});
    } else {
      let data = {
        user_id: user.id,
        old_password: oldPass,
        new_password: newPass,
        confirm_password: confirmPass,
      };
      ChangePassApi(data);
    }
  };

  //******************** Hit ForgotPass Api *******************
  const ChangePassApi = async data => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.changePassword);
    console.log('Data', JSON.stringify(data));
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.changePassword, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.access_token}`,
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
            AsyncStorage.removeItem('UserDetails');
            dispatch(deleteUser());
            toast.current.show('Password Sucessfully Changed', 1000, () => {
              props.navigation.reset({
                index: 0,
                routes: [{name: 'SignIn'}],
              });
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
          {I18n.t('forgotPassword.change_password')}
        </Text>
        <View style={styles.backImageBack} />
      </View>
      <KeyboardAvoidingView style={styles.viewStyle} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.viewStyle}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps={'handled'}
          overScrollMode="never">
          <Image
            style={styles.logoStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/password_image.png')}
          />

          <Text style={styles.headerText}>
            {I18n.t('forgotPassword.reset_header')}
          </Text>

          <View style={styles.editContainer}>
             <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('common.old_password_txt')}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              style={{fontFamily: Fonts.MontserratRegular, color: Colors.black}}
              keyboardType={'default'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              secureTextEntry={secureOld}
              onChangeText={setOldPass}
            />
            <Image
              style={styles.editIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_lock.png')}
            />
            <TouchableOpacity
              style={styles.eyeConatainer}
              onPress={() => setSecureOld(!secureOld)}>
              <Image
                style={styles.eyeIcon}
                resizeMode={'contain'}
                source={
                  secureOld
                    ? require('../../Assets/Images/ic_eye.png')
                    : require('../../Assets/Images/ic_hide.png')
                }
              />
            </TouchableOpacity>
          </View>

          <View style={styles.editContainer}>
             <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('common.new_password_txt')}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              style={{fontFamily: Fonts.MontserratRegular, color: Colors.black}}
              keyboardType={'default'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              secureTextEntry={secureNew}
              onChangeText={setNewPass}
            />
            <Image
              style={styles.editIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_lock.png')}
            />
            <TouchableOpacity
              style={styles.eyeConatainer}
              onPress={() => setSecureNew(!secureNew)}>
              <Image
                style={styles.eyeIcon}
                resizeMode={'contain'}
                source={
                  secureNew
                    ? require('../../Assets/Images/ic_eye.png')
                    : require('../../Assets/Images/ic_hide.png')
                }
              />
            </TouchableOpacity>
          </View>

          <View style={styles.editContainer}>
             <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('common.confirm_new_txt')}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              style={{fontFamily: Fonts.MontserratRegular, color: Colors.black}}
              keyboardType={'default'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              secureTextEntry={true}
              onChangeText={setConfirmPass}
            />
            <Image
              style={styles.editIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_lock.png')}
            />
          </View>

          <TouchableOpacity
            style={styles.btnContainer}
            activeOpacity={0.5}
            onPress={() => {
              changePass();
            }}>
            <Text style={styles.btnText}>
              {I18n.t('forgotPassword.change_password')}
            </Text>
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

export default ResetPassword;
