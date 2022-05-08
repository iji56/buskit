import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  AsyncStorage,
  SafeAreaView,
  KeyboardAvoidingView,
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
import {Keyboard} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

const Home = props => {
  const [name, setName] = useState(I18n.t('cmsPage.contact'));
  const [desc, setDesc] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const contactRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  const userData = useSelector(state => state.user);

  useEffect(() => {
    //ContactApi();
  }, []);

  //******************** Hit Contact Api *******************
  const ContactApi = async () => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.cmsPage);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.cmsPage + '?page_id=3', {
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
            setName(data.name);
            setDesc(data.description);
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

  //***************** Validate Functions  *******************/
  const validateEmail = email => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  };

  const checkRequest = () => {
    Keyboard.dismiss();
    if (contact.length == 0) {
      toast.current.show('Please enter name', 2000, () => {});
    } else if (contact.length < 3) {
      toast.current.show('Please enter valid name', 2000, () => {});
    } else if (email.length == 0) {
      toast.current.show('Please enter email', 2000, () => {});
    } else if (!validateEmail(email)) {
      toast.current.show('Please enter valid email', 2000, () => {});
    } else if (message.length == 0) {
      toast.current.show('Please enter message', 2000, () => {});
    } else if (message.length < 20) {
      toast.current.show('Message must be 20 char atleast', 2000, () => {});
    } else {
      let data = {
        name: contact,
        email: email,
        message: message,
      };
      ContactUsApi(data);
    }
  };

  //******************** Hit ContactUs Api *******************
  const ContactUsApi = async data => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.contactUs);
    console.log('Data', JSON.stringify(data));
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.contactUs, {
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
            toast.current.show(
              'Enquiry Submitted Successfully',
              2000,
              () => {},
            );
            setContact('');
            contactRef.current.setValue('');
            setEmail('');
            emailRef.current.setValue('');
            setMessage('');
            messageRef.current.setValue('');
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
          activeOpacity={0.8}
          onPress={() => {
            props.navigation.goBack();
          }}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.titleText}>{name}</Text>
        <TouchableOpacity style={styles.backImageBack} />
      </View>
      <KeyboardAvoidingView
        style={[styles.viewStyle]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.viewStyle}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps={'handled'}
          overScrollMode="never">
          <Text style={styles.descText}>{I18n.t('cmsPage.contact_head')}</Text>

          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              ref={contactRef}
              placeholder={I18n.t('cmsPage.contact_name')}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={15}
              maxLength={40}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.theme}}
              keyboardType={'default'}
              returnKeyType={'done'}
              returnKeyLabel={'Done'}
              defaultValue={contact}
              onChangeText={setContact}
              formatText={text => formatText(text)}
            />
          </View>
          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              ref={emailRef}
              placeholder={I18n.t('cmsPage.contact_email')}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={15}
              maxLength={30}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.theme}}
              keyboardType={'email-address'}
              returnKeyType={'done'}
              returnKeyLabel={'Done'}
              defaultValue={email}
              autoCorrect={false}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.editBoxContainer}>
            <TextField
              selectionColor={Colors.theme}
              ref={messageRef}
              placeholder={I18n.t('cmsPage.contact_msg')}
              containerStyle={{height: 125}}
              inputContainerStyle={[styles.inputContainer, {height: 125}]}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={15}
              multiline={true}
              maxLength={220}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.black}}
              keyboardType={'default'}
              returnKeyType={'done'}
              returnKeyLabel={'Done'}
              defaultValue={message}
              onChangeText={setMessage}
              blurOnSubmit={true}
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.btnContainer}
          activeOpacity={0.5}
          onPress={() => checkRequest()}>
          <Text style={styles.btnText}>{I18n.t('cmsPage.send_message')}</Text>
        </TouchableOpacity>
        
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

export default Home;
