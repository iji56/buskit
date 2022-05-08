import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Keyboard,
  Platform,
  AsyncStorage,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {TextField} from 'react-native-material-textfield';
import DeviceInfo from 'react-native-device-info';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import Fonts from '../../Res/Fonts';
import I18n from '../../Config/I18n';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import {DotIndicator} from 'react-native-indicators';
import constants from '../../Config/Constants';
import firebaseSvc from '../../Components/FirebaseSvc';
import Toast, {DURATION} from 'react-native-easy-toast';

import {useSelector, useDispatch} from 'react-redux';
import {addUser, addFirebase} from '../../Redux/Actions';
import Icon from 'react-native-vector-icons/FontAwesome';

const Home = props => {
  const {socialId, socialType, userName, userEmail} = props.route.params;
  const [userType, setUserType] = useState(1);
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [otherGenre, setOtherGenre] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [genres, setGenres] = useState([]);
  const [genreId, setGenreId] = useState(0);
  const [genreName, setGenreName] = useState('');
  const [isLoading, setLoading] = useState(false);

  const [isPrivacyPolicyAccepted, setIsPrivacyPolicyAccepted] = useState(false);
  const [isPrivacyErrorOccured, setIsPrivacyErrorOccured] = useState(false);

  const toast = useRef(null);

  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    //console.log('Data', user);
    Icon.loadFont();
    console.log(
      'Data',
      socialId + ',' + socialType + ',' + userName + ',' + userEmail,
    );
    if (Platform.OS == 'ios') {
      AsyncStorage.getItem('fcmToken', (err, result) => {
        if (err === null) {
          let token = JSON.parse(result);
          console.log('token', token);
          setToken(token);
        }
      });
    } else {
      AsyncStorage.getItem('deviceToken', (err, result) => {
        if (err === null) {
          let token = JSON.parse(result);
          console.log('token', token);
          setToken(token);
        }
      });
    }
    if (
      socialType == 'google' ||
      socialType == 'facebook' ||
      socialType == 'apple'
    ) {
      setName(userName);
      setEmail(userEmail);
    }
  }, []);

  //***************** register Functions  *******************/
  const validateEmail = email => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  };

  const validateNumber = phone => {
    var re = /^[0-9\b]+$/;
    return re.test(phone);
  };

  const register = async () => {
    Keyboard.dismiss();
    if (name.length == 0) {
      toast.current.show('Please enter name', 2000, () => {});
    } else if (name.length < 3) {
      toast.current.show('Please enter valid name', 2000, () => {});
    } else if (userType == 2 && username.length == 0) {
      toast.current.show('Please enter username', 2000, () => {});
    } else if (userType == 2 && genreName.length == 0) {
      toast.current.show('Please select genre', 2000, () => {});
    } else if (email.length == 0) {
      toast.current.show('Please enter email', 2000, () => {});
    } else if (!validateEmail(email)) {
      toast.current.show('Please enter valid email', 2000, () => {});
    } else if (phone.length == 0) {
      toast.current.show('Please enter phone number', 2000, () => {});
    } else if (phone.length < 10) {
      toast.current.show('Please enter valid phone number', 2000, () => {});
    } else if (password.length == 0) {
      toast.current.show('Please enter password', 2000, () => {});
    } else if (password.length < 6) {
      toast.current.show('Password should be 6 char altleast', 2000, () => {});
    } else if (confirmPassword.length == 0) {
      toast.current.show('Please confirm password', 2000, () => {});
    } else if (password != confirmPassword) {
      toast.current.show('Password Mismatch!', 2000, () => {});
    } else if (!isPrivacyPolicyAccepted) {
      setIsPrivacyErrorOccured(true);
      toast.current.show('Please accept our privacy policy', 2000, () => {});
    } else {
      var data = {
        name: name,
        email: email,
        phone: phone,
        password: password,
        device_id: DeviceInfo.getUniqueId(),
        device_type: Platform.OS,
        device_token:
          token != null && token != ''
            ? token
            : 'cXKu_4AJTRCBYs8GAMNOF_:APA91bF9GIvCm46LNb11h1dVYM6_-rrs-Aj8Mok9w4nhwjsuyArc_BrMjiWsGxW6qiyE3GQa_eQfB2n0BWCjIc_U6REDp0jWbGqpKuaYbNW4uYXeqEzPhCcCAoaz_LKORnPytVpv4MNr',
        user_type: userType,
      };
      if (socialType == 'google') {
        data.google_social_id = socialId;
      } else if (socialType == 'facebook') {
        data.fb_social_id = socialId;
      } else if (socialType == 'apple') {
        data.apple_social_id = socialId;
      }
      if (userType == 2) {
        data.stagename = username;
        data.genre = genreId;
      }
      if (otherGenre != '') {
        data.other_cat_name = otherGenre;
      }
      onCreateFirebase(data);
    }
  };

  const onCreateFirebase = async data => {
    setLoading(true);
    try {
      const user = {
        name: name,
        email: email,
        password: password,
        avatar: '',
      };
      firebaseSvc
        .createAccount(user)
        .then(res => {
          console.log('Firebase user -->', JSON.stringify(res));
          onStoreData(user, res, data);
        })
        .catch(err => {
          console.log('Firebase Error:' + err);
          setLoading(false);
          toast.current.show(
            'This Email is already registered',
            2000,
            () => {},
          );
        });
    } catch ({message}) {
      setLoading(false);
      toast.current.show(
        'Error creating firebase user with email',
        2000,
        () => {},
      );
      console.log('create account failed. catch error:' + message);
    }
  };

  const deleteUser = () => {
    firebaseSvc
      .auth()
      .currentUser.delete()
      .then(function() {
        console.log('delete successful?');
        console.log(app.auth().currentUser);
      })
      .catch(function(error) {
        console.error({error});
      });
  };

  const onStoreData = (user, result, data) => {
    user.id = result.user.uid;
    user._id = result.user.uid;
    AsyncStorage.setItem('FirebaseUser', JSON.stringify(user));
    dispatch(addFirebase(user));
    // send Data to backend
    data.firebase_id = result.user.uid;
    RegisterApi(data);
  };

  //******************** Hit Register Api *******************
  const RegisterApi = async data => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.registration);
    console.log('Data', JSON.stringify(data));
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.registration, {
        method: 'POST',
        headers: {
          // Accept: 'application/json',
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),
    )
      .then(processResponse)
      .then(res => {
        console.log('🚀 ~ file: index.js ~ line 246 ~ res', res);
        const {responseCode, responseJson} = res;
        setLoading(false);
        if (responseCode === 200) {
          if (responseJson.success == 'true') {
            var data = JSON.stringify(responseJson?.data);
            AsyncStorage.setItem('UserDetails', data);
            dispatch(addUser(responseJson.data));
            if (responseJson.data.user_type == 1) {
              props.navigation.reset({
                index: 0,
                routes: [{name: 'UserTab', params: {route: 'initial'}}],
              });
            } else {
              props.navigation.reset({
                index: 0,
                routes: [{name: 'BuskerTab', params: {route: 'initial'}}],
              });
            }
          } else {
            toast.current.show(responseJson.message, 2000, () => {});
          }
        } else {
          if (responseJson.hasOwnProperty('message')) {
            toast.current.show(responseJson?.message, 2000, () => {});
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
        console.log('🚀 ~ file: index.js ~ line 287 ~ err', err);
        setLoading(false);
        toast.current.show(err?.message, 2000, () => {});
      });
  };

  //******************** Hit Genres Api *******************
  const GenresApi = async () => {
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
            setGenres(data);
            setModalVisible(true);
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

  const rowItem = (item, pos) => {
    return (
      <TouchableOpacity
        style={styles.genreBtnContainer}
        activeOpacity={0.5}
        onPress={() => {
          if (item.name === 'Other') {
            setModalVisible(false);
            setGenreId(item.id);
            setGenreName(item.name);
            setEditModalVisible(true);
          } else {
            setGenreId(item.id);
            setGenreName(item.name);
            setModalVisible(false);
            setOtherGenre('');
          }
        }}>
        <Text style={styles.genreBtnText}>{item.name}</Text>
      </TouchableOpacity>
    );
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
        <Text style={styles.titleText}>{I18n.t('loginRegister.sign_up')}</Text>
        <TouchableOpacity
          style={styles.backImageBack}
          onPress={() => {
            props.navigation.goBack();
          }}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/ic_close.png')}
          />
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
          <View style={styles.chooseContainer}>
            <TouchableOpacity
              style={
                userType == 1
                  ? styles.activeBtnContainer
                  : styles.inactiveBtnContainer
              }
              activeOpacity={0.8}
              onPress={() => {
                setUserType(1);
              }}>
              <Text
                style={userType == 1 ? styles.activeText : styles.inactiveText}>
                {I18n.t('loginRegister.as_fan')}
              </Text>
            </TouchableOpacity>
            <View style={styles.chooseDivider} />
            <TouchableOpacity
              style={
                userType == 2
                  ? styles.activeBtnContainer
                  : styles.inactiveBtnContainer
              }
              activeOpacity={0.8}
              onPress={() => {
                setUserType(2);
              }}>
              <Text
                style={userType == 2 ? styles.activeText : styles.inactiveText}>
                {I18n.t('loginRegister.as_busker')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('common.name')}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              style={{fontFamily: Fonts.MontserratRegular, color: Colors.black}}
              keyboardType={'name-phone-pad'}
              autoCapitalize={'words'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              defaultValue={name}
              onChangeText={setName}
              maxLength={40}
              formatText={text => formatText(text)}
              placeholderTextColor={Colors.grey}
            />
            <Image
              style={styles.editIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_user.png')}
            />
          </View>

          {userType == 2 && (
            <>
              <View style={styles.editContainer}>
                <TextField
                  selectionColor={Colors.theme}
                  placeholder={I18n.t('common.username')}
                  inputContainerStyle={styles.inputContainer}
                  tintColor={Colors.theme}
                  labelFontSize={0}
                  fontSize={16}
                  style={{
                    fontFamily: Fonts.MontserratRegular,
                    color: Colors.black,
                  }}
                  placeholderTextColor={Colors.grey}
                  keyboardType={'default'}
                  autoCapitalize={'none'}
                  returnKeyLabel={'Done'}
                  returnKeyType={'done'}
                  maxLength={30}
                  onChangeText={setUserName}
                />
                <Image
                  style={styles.editIcon}
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/ic_tag.png')}
                />
              </View>

              <TouchableOpacity
                style={styles.editContainer}
                activeOpacity={0.7}
                onPress={() => GenresApi()}>
                <TextField
                  selectionColor={Colors.theme}
                  placeholder={I18n.t('common.genres')}
                  placeholderTextColor={Colors.grey}
                  inputContainerStyle={styles.inputContainer}
                  tintColor={Colors.theme}
                  labelFontSize={0}
                  fontSize={16}
                  style={{
                    fontFamily: Fonts.MontserratRegular,
                    color: Colors.black,
                  }}
                  defaultValue={genreName}
                  editable={false}
                  autoCapitalize={'none'}
                  keyboardType={'default'}
                  maxLength={30}
                />
                <Image
                  style={styles.editIcon}
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/ic_category.png')}
                />
                <Image
                  style={styles.dropIcon}
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/ic_drop_down.png')}
                />
              </TouchableOpacity>
            </>
          )}

          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('common.email_txt')}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              placeholderTextColor={Colors.grey}
              style={{fontFamily: Fonts.MontserratRegular, color: Colors.black}}
              keyboardType={'email-address'}
              autoCapitalize={'none'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              defaultValue={email}
              editable={
                socialType == 'normal' ||
                (socialType === 'apple' && email === null)
                  ? true
                  : false
              }
              autoCorrect={false}
              onChangeText={setEmail}
              maxLength={40}
            />
            <Image
              style={styles.editIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_mail.png')}
            />
          </View>

          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('common.mobile_txt')}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              maxLength={10}
              placeholderTextColor={Colors.grey}
              style={{fontFamily: Fonts.MontserratRegular, color: Colors.black}}
              keyboardType={'phone-pad'}
              autoCapitalize={'none'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              onChangeText={setPhone}
              formatText={text => formatNumber(text)}
            />
            <Image
              style={styles.editIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_phone.png')}
            />
          </View>

          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('common.password_txt')}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              placeholderTextColor={Colors.grey}
              style={{fontFamily: Fonts.MontserratRegular, color: Colors.black}}
              secureTextEntry={secure}
              keyboardType={'default'}
              autoCapitalize={'none'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              onChangeText={setPassword}
              maxLength={40}
            />
            <Image
              style={styles.editIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_lock.png')}
            />
            <TouchableOpacity
              style={styles.eyeConatainer}
              onPress={() => setSecure(!secure)}>
              <Image
                style={styles.eyeIcon}
                resizeMode={'contain'}
                source={
                  secure
                    ? require('../../Assets/Images/ic_eye.png')
                    : require('../../Assets/Images/ic_hide.png')
                }
              />
            </TouchableOpacity>
          </View>

          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('common.confirm_pass_txt')}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              placeholderTextColor={Colors.grey}
              style={{fontFamily: Fonts.MontserratRegular, color: Colors.black}}
              secureTextEntry={true}
              keyboardType={'default'}
              autoCapitalize={'none'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              onChangeText={setConfirmPassword}
              maxLength={40}
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
              setIsPrivacyErrorOccured(false);
              register();
            }}>
            <Text style={styles.btnText}>
              {I18n.t('loginRegister.sign_up')}
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              marginHorizontal: 10,
              marginBottom: 50,
            }}>
            <CheckBox
              containerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 0,
                margin: 0,
                width: 30,
                height: 25,
              }}
              uncheckedColor={isPrivacyErrorOccured ? 'red' : 'lightgray'}
              checkedColor={Colors.theme}
              size={22}
              checked={isPrivacyPolicyAccepted}
              onPress={() => {
                setIsPrivacyErrorOccured(false);
                setIsPrivacyPolicyAccepted(!isPrivacyPolicyAccepted);
              }}
            />
            <Text style={{fontSize: 13, flexWrap: 'wrap', flex: 1}}>
              By signing up, you agree to our{' '}
              <Text
                onPress={() =>
                  props.navigation.navigate('TermsCondition', {
                    action: '2',
                    title: I18n.t('account.terms_condition'),
                  })
                }
                style={{
                  color: 'black',
                  fontSize: 13,
                  fontWeight: '700',
                }}>
                {I18n.t('account.terms_condition')}
              </Text>
              {' and '}
              <Text
                onPress={() =>
                  props.navigation.navigate('TermsCondition', {
                    action: '4',
                    title: I18n.t('account.policy'),
                  })
                }
                style={{
                  color: 'black',
                  fontSize: 13,
                  fontWeight: '700',
                }}>
                {I18n.t('account.policy')}
              </Text>
            </Text>
          </View>

          <View style={styles.bottomContainer}>
            <Text style={styles.bottomText}>
              {I18n.t('loginRegister.already_have_msg')}
            </Text>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('SignIn');
              }}>
              <Text style={styles.linkText}>
                {I18n.t('loginRegister.sign_in')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.dialogModal}>
            <View style={styles.modalRowContainer}>
              <Text style={styles.modalHeadText}>
                {I18n.t('common.genres')}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
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
              data={genres}
              numColumns={3}
              renderItem={({item, pos}) => rowItem(item, pos)}
              keyExtractor={item => item.keyExtractor}
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.dialogModal}>
            <View style={styles.modalRowContainer}>
              <Text style={styles.modalHeadText}>
                {I18n.t('common.genres')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setOtherGenre('');
                  setEditModalVisible(false);
                }}>
                <Image
                  style={styles.modalCloseStyle}
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/ic_close.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.editContainer, {marginBottom: 15}]}>
              <TextField
                selectionColor={Colors.theme}
                placeholder={I18n.t('common.genres')}
                inputContainerStyle={styles.inputContainer}
                tintColor={Colors.theme}
                labelFontSize={0}
                fontSize={16}
                style={{
                  fontFamily: Fonts.MontserratRegular,
                  color: Colors.black,
                }}
                placeholderTextColor={Colors.grey}
                keyboardType={'default'}
                autoCapitalize={'none'}
                returnKeyLabel={'Done'}
                returnKeyType={'done'}
                defaultValue={otherGenre}
                onChangeText={setOtherGenre}
                maxLength={30}
              />
              <Image
                style={styles.editIcon}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_category.png')}
              />
            </View>
            <TouchableOpacity
              style={styles.doneBtnContainer}
              onPress={() => {
                setGenreName(otherGenre);
                setEditModalVisible(false);
              }}>
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

export default Home;
