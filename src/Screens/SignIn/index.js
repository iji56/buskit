import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  Platform,
  AsyncStorage,
  KeyboardAvoidingView,
  Keyboard,
  SafeAreaView,
  Alert,
} from 'react-native';
import {TextField} from 'react-native-material-textfield';
import DeviceInfo from 'react-native-device-info';
import {useSelector, useDispatch} from 'react-redux';
import {googleSignInwebClientId} from '../../Components/GoogleSignDetails';
import styles from './styles';
import Colors from '../../Res/Colors';
import Fonts from '../../Res/Fonts';
import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';
import I18n from '../../Config/I18n';
import {GoogleSignin, statusCodes} from 'react-native-google-signin';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';
import firebaseSvc from '../../Components/FirebaseSvc';

import {addUser, addFirebase} from '../../Redux/Actions';

import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';

const SignIn = props => {
  const [token, setToken] = useState('');
  const [user, setUser] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const [socialId, setSocialId] = useState('');
  const [socialType, setSocialType] = useState('');
  const [username, setUserName] = useState('');
  const [useremail, setUserEmail] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  //const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    //console.log('Data', user);
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
    //Configure Google SignIn Credentials
    GoogleSignin.configure({
      webClientId: googleSignInwebClientId, // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: false, // true if you wish to access user APIs on behalf of the user from your own server
    });
  }, []);

  //Prompts a modal to let the user google sign promptly.
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        //Check if device has Google Play Services installed. Resolves to true on iOS.
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info --> ', userInfo);
      setUserInfo(userInfo);
      setSocialId(userInfo.user.id);
      setSocialType('google');
      setUserName(userInfo.user.name);
      setUserEmail(userInfo.user.email);
      socialData(
        userInfo.user.name,
        userInfo.user.email,
        null,
        userInfo.user.id,
        'google',
      );
      signOut();
    } catch (error) {
      console.log(
        'Message',
        error.message + '(' + JSON.stringify(statusCodes) + ')',
      );
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
        signOut();
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
        toast.current.show(
          'Play Services Not Available or Outdated',
          2000,
          () => {},
        );
      } else {
        Alert.alert(
          'Error: ' + error.message + '(' + JSON.stringify(statusCodes) + ')',
        );
        console.log('Some Other Error Happened', error);
        toast.current.show('Google Error!!!' + error, 2000, () => {});
        signOut();
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.log('GOOGLE SIGNOUT ERROR', error.message);
    }
  };

  // Graph Facebook Request to get login info via accessToken.
  const getInfoFromToken = accessToken => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id,name,first_name,last_name,email',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      {accessToken, parameters: PROFILE_REQUEST_PARAMS},
      (error, user) => {
        if (error) {
          console.log('login info has error: ' + JSON.stringify(error));
          toast.current.show('FB Info Error', 2000, () => {});
        } else {
          console.log('User Info --> ', user);
          setUserInfo(user);
          setSocialId(user.id);
          setSocialType('facebook');
          setUserName(user.name);
          setUserEmail(user.email);
          socialData(user.name, user.email, null, user.id, 'facebook');
          fbLogout();
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  // Attempt a login using the Facebook login dialog asking for default permissions.
  const fbLogin = () => {
    LoginManager.logInWithPermissions([
      'public_profile',
      'email',
      // 'user_mobile_phone',
    ]).then(
      login => {
        if (login.isCancelled) {
          console.log('Login cancelled');
          fbLogout();
        } else {
          AccessToken.getCurrentAccessToken()
            .then(data => {
              console.log(JSON.stringify(data));
              const accessToken = data.accessToken.toString();
              getInfoFromToken(accessToken);
            })
            .catch(err => {
              console.log('FB Access Token:', err);
              toast.current.show('Fb Login Error!!!', 2000, () => {});
            });
        }
      },
      error => {
        console.log('Login fail with error: ' + error);
        toast.current.show('Fb Login Error!!!', 2000, () => {});
        fbLogout();
      },
    );
  };

  const fbLogout = async () => {
    try {
      let data = await AccessToken.getCurrentAccessToken();
      if (data !== null) {
        const current_access_token = data.accessToken.toString();
        const logout = new GraphRequest(
          'me/permissions/',
          {
            accessToken: current_access_token,
            httpMethod: 'DELETE',
          },
          (error, result) => {
            if (error) {
              console.log('Error fetching data: ' + error.toString());
            } else {
              LoginManager.logOut();
            }
          },
        );
        new GraphRequestManager().addRequest(logout).start();
      }
    } catch (error) {
      console.log('FB LOGOUT ERROR', error.message);
    }
  };

  //***************** login Functions  *******************/
  const validateEmail = email => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  };

  // Social Data for API
  const socialData = async (name, email, phone, socialId, socialType) => {
    Keyboard.dismiss();
    let data = {
      name: name,
      email: email,
      social_id: socialId,
      social_type: socialType,
      device_id: DeviceInfo.getUniqueId(),
      device_type: Platform.OS,
      device_token:
        token != null && token != ''
          ? token
          : 'cXKu_4AJTRCBYs8GAMNOF_:APA91bF9GIvCm46LNb11h1dVYM6_-rrs-Aj8Mok9w4nhwjsuyArc_BrMjiWsGxW6qiyE3GQa_eQfB2n0BWCjIc_U6REDp0jWbGqpKuaYbNW4uYXeqEzPhCcCAoaz_LKORnPytVpv4MNr',
    };

    console.log('social data is following:--- ', data);

    SocialLoginApi(data);
  };

  //******************** Hit Social Login Api *******************
  const SocialLoginApi = async body => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.socialLogin);
    console.log('Data', JSON.stringify(body));
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.socialLogin, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
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
            if (responseJson.hasOwnProperty('data')) {
              var data = JSON.stringify(responseJson.data);
              setUser(responseJson.data);
              AsyncStorage.setItem('UserDetails', data);
              dispatch(addUser(responseJson.data));
              onLoginFirebase(body.email);
              setForwardScreen(responseJson.data);
            } else {
              moveToSignUpScreen(body);
              // props.navigation.navigate('SignUp', {
              //   socialId: body.social_id,
              //   socialType: body.social_type,
              //   userName: body.name,
              //   userEmail: body.email,
              // });
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

  const moveToSignUpScreen = async body => {
    props.navigation.navigate('SignUp', {
      socialId: await body.social_id,
      socialType: await body.social_type,
      userName: await body.name,
      userEmail: await body.email,
    });
  };

  // Login Data for API
  const login = async () => {
    Keyboard.dismiss();
    if (email.length == 0) {
      toast.current.show('Please enter email', 2000, () => {});
    } else if (!validateEmail(email)) {
      toast.current.show('Please check email', 2000, () => {});
    } else if (password.length == 0) {
      toast.current.show('Please enter password', 2000, () => {});
    } else {
      Keyboard.dismiss();
      let data = {
        email: email,
        password: password,
        device_id: DeviceInfo.getUniqueId(),
        device_type: Platform.OS,
        device_token:
          token != null && token != ''
            ? token
            : 'cXKu_4AJTRCBYs8GAMNOF_:APA91bF9GIvCm46LNb11h1dVYM6_-rrs-Aj8Mok9w4nhwjsuyArc_BrMjiWsGxW6qiyE3GQa_eQfB2n0BWCjIc_U6REDp0jWbGqpKuaYbNW4uYXeqEzPhCcCAoaz_LKORnPytVpv4MNr',
      };
      LoginApi(data);
    }
  };

  //******************** Hit Simple Login Api ********************
  const LoginApi = async body => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.login);
    console.log('Data', JSON.stringify(body));
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.login, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
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
            console.log(
              'Login info is====#################################===',
              responseJson.data,
            );
            var data = JSON.stringify(responseJson.data);
            setUser(responseJson.data);
            AsyncStorage.setItem('UserDetails', data);
            dispatch(addUser(responseJson.data));
            onLoginFirebase(body.email);
            setForwardScreen(responseJson.data);
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

  const setForwardScreen = user => {
    if (user.user_type == 1) {
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
  };

  // using Fire.js
  const onLoginFirebase = async email => {
    setLoading(true);
    try {
      const user = {
        email: email,
        password: '123456',
        avatar: '',
      };
      firebaseSvc.login(user).then(res => {
        if (res != null) {
          console.log('FirebaseUser', JSON.stringify(res));
          user.name = res.user.displayName;
          user.id = res.user.uid;
          user._id = res.user.uid;
          AsyncStorage.setItem('FirebaseUser', JSON.stringify(user));
          dispatch(addFirebase(user));
        }
      });
    } catch ({message}) {
      console.log('Login account failed. catch error:' + message);
    }
  };

  const onCreateFirebase = async () => {
    try {
      const fuser = {
        name: user.name,
        email: user.email,
        password: '123456',
        avatar: '',
      };
      firebaseSvc
        .createAccount(fuser)
        .then(res => {
          console.log('Firebase user -->', JSON.stringify(res));
          onStoreData(fuser, res);
        })
        .catch(err =>
          toast.current.show('Firebase Error:' + err, 2000, () => {}),
        );
    } catch ({message}) {
      console.log('create account failed. catch error:' + message);
    }
  };

  const onStoreData = (user, result) => {
    user.id = result.user.uid;
    user._id = result.user.uid;
    AsyncStorage.setItem('FirebaseUser', JSON.stringify(user));
    dispatch(addFirebase(user));
    // send Data to backend
    //RegisterApi(data);
  };

  // const onAppleButtonPress = async () => {
  //     // performs login request
  //     const appleAuthRequestResponse = await appleAuth.performRequest({
  //       requestedOperation: appleAuth.Operation.LOGIN,
  //       requestedScopes: [
  //         AppleAuthRequestScope.EMAIL,
  //         AppleAuthRequestScope.FULL_NAME,
  //       ],
  //     });

  //     console.log("apple login response---- ",appleAuthRequestResponse)
  //     // get current authentication state for user
  //     // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
  //     const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
  //     console.log("apple login ------response---- ",credentialState);
  //     // use credentialState response to ensure the user is authenticated
  //     if (credentialState === appleAuth.State.AUTHORIZED) {
  //       // user is authenticated
  //     }
  // }

  /**
   * Starts the Sign In flow.
   */
  async function onAppleButtonPress() {
    console.warn('Beginning Apple Authentication');

    // start a login request

    let user = '';
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      console.log('appleAuthRequestResponse', appleAuthRequestResponse);

      const {
        user: newUser,
        email,
        nonce,
        identityToken,
        realUserStatus /* etc */,
      } = appleAuthRequestResponse;

      user = newUser;
      let fullName = '';
      if (
        appleAuthRequestResponse.fullName.givenName !== undefined &&
        appleAuthRequestResponse.fullName.givenName !== null
      )
        fullName =
          (await appleAuthRequestResponse.fullName.givenName) +
          ' ' +
          appleAuthRequestResponse.fullName.familyName;

      console.log('new user is ---------------', user);
      console.log('new user is ---------------', fullName);
      console.log('new user is ---------------', fullName);

      if (identityToken) {
        // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
        console.log(nonce, identityToken);
      } else {
        // no token - failed sign-in?
      }

      if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
        console.log("I'm a real person!");
      }

      console.warn(`Apple Authentication Completed, ${user}, ${email}`);

      setSocialId(user);
      setSocialType('apple');
      setUserName(fullName);
      setUserEmail(email);
      socialData(fullName, email, null, user, 'apple');
    } catch (error) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        console.error(error);
      }
    }
  }

  const AppleLogout = async () => {
    console.log('apple logout called-----------------------------------------');
    const appleAuthLogoutRequestResponse = await appleAuth
      .performRequest({
        requestedOperation: appleAuth.Operation.LOGOUT,
      })
      .catch(error => {
        console.log('Caught logout error..', error);
      });
  };

  return (
    <SafeAreaView style={styles.viewcontainer}>
      <CustomStatusBar color={Colors.theme} />
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
            source={require('../../Assets/Images/buskit_login.png')}
          />
          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('common.username')}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              style={{fontFamily: Fonts.MontserratRegular, color: Colors.black}}
              keyboardType={'default'}
              autoCapitalize={'none'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              autoCorrect={false}
              onChangeText={setEmail}
              placeholderTextColor={Colors.grey}
            />
            <Image
              style={styles.editIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_user.png')}
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
              style={{fontFamily: Fonts.MontserratRegular, color: Colors.black}}
              secureTextEntry={true}
              keyboardType={'default'}
              autoCapitalize={'none'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              onChangeText={setPassword}
              placeholderTextColor={Colors.grey}
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
              login();
            }}>
            <Text style={styles.btnText}>
              {I18n.t('loginRegister.sign_in')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              props.navigation.navigate('ForgotPassword');
            }}>
            <Text style={styles.forgotText}>
              {I18n.t('loginRegister.forgot_password')}
            </Text>
          </TouchableOpacity>

          <View style={styles.connectContainer}>
            <View style={styles.connectDivider} />
            <Text style={styles.connectText}>
              {I18n.t('loginRegister.connect_with')}
            </Text>
            <View style={styles.connectDivider} />
          </View>

          <View style={styles.socialBtnView}>
            <TouchableOpacity
              style={styles.socialContainer}
              onPress={() => {
                signIn();
              }}>
              <Image
                style={styles.socialIcon}
                resizeMode={'contain'}
                source={require('../../Assets/Images/google_icon.png')}
              />
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.socialContainer}
              onPress={() => {
                fbLogin();
              }}>
              <Image
                style={styles.socialIcon}
                resizeMode={'contain'}
                source={require('../../Assets/Images/facebook_icon.png')}
              />
            </TouchableOpacity> */}

            {appleAuth.isSupported && Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.socialContainer}
                onPress={() => onAppleButtonPress()}>
                <Image
                  style={styles.socialIcon}
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/apple_icon.png')}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* {(appleAuth.isSupported && Platform.OS==='ios' && 

              <View style = {{
                 flex:1,
                  height:50,
                  marginBottom:20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>

            <TouchableOpacity
              style={styles.socialContainer}
              onPress={() => onAppleButtonPress()}>
              <Image
                style={styles.socialIcon}
                resizeMode={'contain'}
                source={require('../../Assets/Images/facebook_icon.png')}
              />
            </TouchableOpacity>
     
    </View>
    )} */}

          <View style={styles.bottomContainer}>
            <Text style={styles.bottomText}>
              {I18n.t('loginRegister.dont_have_msg')}
            </Text>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('SignUp', {
                  socialId: null,
                  socialType: 'normal',
                  userName: null,
                  userEmail: null,
                });
              }}>
              <Text style={styles.linkText}>
                {I18n.t('loginRegister.sign_up')}
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

export default SignIn;
