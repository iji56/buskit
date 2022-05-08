import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  Keyboard,
  Alert,
  AsyncStorage,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import {TextField} from 'react-native-material-textfield';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import Fonts from '../../Res/Fonts';
import I18n from '../../Config/I18n';
import OpenAppSettings from 'react-native-app-settings';
import ImageCropPicker from 'react-native-image-crop-picker';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';

const ForgotPassword = props => {
  const {data, callback} = props.route.params;
  const [user, setUser] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [picUri, setPicUri] = useState('');
  const [socialEmail, setSocialEmail] = useState(false);

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    // Preload data using AsyncStorage
    AsyncStorage.getItem('UserDetails', (err, result) => {
      if (err === null) {
        let res = JSON.parse(result);
        setUser(res);
      }
    });
    setName(data.name);
    setEmail(data.email);
    setPhone(data.phone);
    if (data.profile_img != null) setPicUri(data.profile_img);
  }, []);

  const selectPhotoTapped = () => {
    let options = {
      quality: 1.0,
      allowsEditing: false,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    console.log(
      '🚀 ~ file: index.js ~ line 66 ~ selectPhotoTapped ~ options',
      options,
    );
    // return;
    launchImageLibrary(options, response => {
      //console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        showAlert();
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log(
          'response',
          JSON.stringify(response),
          response.assets[0].uri,
        );
        //setPicUri(response.assets[0].uri);
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        Image.getSize(response.assets[0].uri, (width, height) => {
          console.log('dimen', width + ',' + height);
        });
        cropPhoto(response.assets[0].uri);
      }
    });
  };

  const cropPhoto = imagepath => {
    ImageCropPicker.openCropper({
      path: imagepath,
      width: 300,
      height: 300,
    }).then(image => {
      console.log(image);
      setPicUri(image.path);
    });
  };

  const cropOpenPhoto = path => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
    });
  };

  const showAlert = () => {
    Alert.alert(
      I18n.t('storage.storage_alert'),
      I18n.t('storage.generic_permission'),
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: I18n.t('storage.open_settings'),
          onPress: () => OpenAppSettings.open(),
        },
      ],
    );
  };

  const popBack = data => {
    //AsyncStorage.setItem('UserDetails', JSON.stringify(data));
    //dispatch(addUser(data));
    setTimeout(() => {
      props.navigation.goBack();
      callback();
    }, 1000);
  };

  //***************** Functions  *******************/
  const validateEmail = email => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  };

  const validateNumber = phone => {
    var re = /^[0-9\b]+$/;
    return re.test(phone);
  };

  const checkValidate = async () => {
    Keyboard.dismiss();
    if (name.length == 0) {
      toast.current.show('Please enter name', 2000, () => {});
    } else if (name.length < 3) {
      toast.current.show('Please enter valid name', 2000, () => {});
    } else if (email.length == 0) {
      toast.current.show('Please enter email', 2000, () => {});
    } else if (!validateEmail(email)) {
      toast.current.show('Please enter valid email', 2000, () => {});
    } else if (phone.length == 0) {
      toast.current.show('Please enter phone number', 2000, () => {});
    } else if (phone.length < 10) {
      toast.current.show('Please enter valid phone number', 2000, () => {});
    } else {
      //modify the object however you want to here
      let formdata = new FormData();
      formdata.append('name', name);
      formdata.append('phone', phone);
      formdata.append('email', email);
      if (picUri != '' && !picUri.startsWith('https://')) {
        formdata.append('image', {
          uri: picUri,
          name: 'image.png',
          type: 'image/png',
        });
      }
      UpdateProfileApi(formdata);
    }
  };

  //******************** Hit Update Api *******************
  const UpdateProfileApi = async data => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.userUpdateProfile);
    console.log('Data', JSON.stringify(data));
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.userUpdateProfile, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.access_token}`,
        },
        body: data,
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
            toast.current.show(responseJson.message, 1000, () => {});
            popBack(data);
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
        <Text style={styles.titleText}>{I18n.t('profile.my_profile')}</Text>
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
          <View style={styles.profileContainer}>
            <Image
              source={require('../../Assets/Images/profileImage.png')}
              style={styles.profileImage}
              resizeMode={'cover'}
            />
            <Image
              style={[styles.profileImage, {position: 'absolute'}]}
              source={
                picUri != null && picUri != ''
                  ? {uri: picUri}
                  : require('../../Assets/Images/profileImage.png')
              }
              resizeMode={'cover'}
            />
            <TouchableOpacity
              style={styles.editImageStyle}
              onPress={() => {
                selectPhotoTapped();
                //cropOpenPhoto();
              }}>
              <Image
                style={styles.editImage}
                source={require('../../Assets/Images/ic_edit.png')}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row'}}>
            <View style={styles.editContainer}>
              <TextField
                selectionColor={Colors.theme}
                placeholder={I18n.t('common.name')}
                inputContainerStyle={[styles.inputContainer]}
                tintColor={Colors.theme}
                labelFontSize={0}
                fontSize={16}
                maxLength={40}
                style={{
                  fontFamily: Fonts.MontserratRegular,
                  color: Colors.black,
                }}
                keyboardType={'default'}
                returnKeyLabel={'Done'}
                returnKeyType={'done'}
                defaultValue={name}
                onChangeText={setName}
                formatText={text => formatText(text)}
              />
              <Image
                style={styles.editIcon}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_user.png')}
              />
            </View>
            {/* <View style={styles.editContainer}>
               <TextField
              selectionColor={Colors.theme}
                placeholder={I18n.t('common.last_name')}
                inputContainerStyle={[styles.inputContainer]}
                tintColor={Colors.theme}
                labelFontSize={0}
                fontSize={16}
                style={{
                  fontFamily: Fonts.MontserratRegular,
                  color: Colors.black,
                }}
                keyboardType={'default'}
                defaultValue={name}
                onChangeText={setName}
              />
              <Image
                style={styles.editIcon}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_user.png')}
              />
            </View> */}
          </View>

          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('common.email_txt')}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.grey}
              labelFontSize={0}
              fontSize={16}
              maxLength={30}
              style={{fontFamily: Fonts.MontserratRegular, color: Colors.grey}}
              keyboardType={'email-address'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              defaultValue={email}
              editable={false}
              autoCorrect={false}
              onChangeText={setEmail}
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
              placeholder={I18n.t('common.phone_txt')}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              style={{fontFamily: Fonts.MontserratRegular, color: Colors.black}}
              maxLength={10}
              keyboardType={'phone-pad'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              defaultValue={phone}
              onChangeText={setPhone}
              formatText={text => formatNumber(text)}
            />
            <Image
              style={styles.editIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_phone.png')}
            />
          </View>

          <TouchableOpacity
            style={styles.btnContainer}
            activeOpacity={0.5}
            onPress={() => checkValidate()}>
            <Text style={styles.btnText}>{I18n.t('common.edit_profile')}</Text>
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
