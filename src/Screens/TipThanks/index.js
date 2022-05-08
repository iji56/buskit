import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  AsyncStorage,
  SafeAreaView,
} from 'react-native';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import I18n from '../../Config/I18n';
import Moment from 'moment';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';

import {useSelector} from 'react-redux';
import firebaseSvc from '../../Components/FirebaseSvc';

const ThankYou = props => {
  const {item, type} = props.route.params;
  const [user, setUser] = useState('');

  const [tipAmount, setTipAmount] = useState('0.00');
  const [platformFee, setPlatformFee] = useState('0.00');
  const [buskerAmount, setBuskerAmount] = useState('0.00');

  const [tipMessage, setTipMessage] = useState('No Comments');
  const [tipDate, setTipDate] = useState('01 Jan 1976 0:00 AM');
  const [name, setName] = useState('Name');
  const [pic, setPic] = useState(null);

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);
  const chatUser = useSelector(state => state.firebase);

  useEffect(() => {
    console.log('Item', item);
    console.log('Firebase', chatUser);
    // Preload data using AsyncStorage
    AsyncStorage.getItem('UserDetails', (err, result) => {
      if (err === null) {
        let res = JSON.parse(result);
        setUser(res);
      }
    });
    // setters
    setTipAmount(item.amount);
    setPlatformFee(item.commission);
    setBuskerAmount(item.payout_amount);
    if (item.notes != null && item.notes != '') setTipMessage(item.notes);
    setTipDate(item.created_at);

    if (type == 'user') setName(item.busker.name);
    else setName(item.user.name);
    if (type == 'user') setPic(item.busker.profile_img);
    else setPic(item.user.profile_img);
  }, []);

  const SayThanksMessage = () => {
    let text = 'Thanks for the Tip';
    let room = firebaseSvc.setChatRoom(item.user.id, item.reciever_id);
    console.log('Room Ref:' + room);
    firebaseSvc.sendSingleMessage(text, chatUser);
    // creating data for server
    let data = {
      message: text,
      room_id: item.user.id + '-' + item.reciever_id,
      sender_id: item.reciever_id,
      receiver_id: item.user.id,
    };
    MessageSendApi(data);
  };

  //******************** Hit Send Message Api *******************
  const MessageThanksApi = async => {
    setLoading(true);
    let data = {
      user_id: item.user.id,
      busker_id: item.reciever_id,
    };
    console.log('ApiCall', constants.baseUrl + constants.api.tipsThanks);
    console.log('Thank-Data', data);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.tipsThanks, {
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
        setLoading(false);
        console.log(
          'response',
          responseCode + '' + JSON.stringify(responseJson),
        );
        if (responseCode === 200) {
          if (responseJson.success == 'true') {
            var data = responseJson.data;
            toast.current.show(
              'Thanks Send to ' + item.user.name,
              2000,
              () => {},
            );
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
        setLoading(false);
        console.log('message-exception', err.message);
        toast.current.show(err.message, 2000, () => {});
      });
  };

  //******************** Hit Send Message Api *******************
  const MessageSendApi = async data => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.chatMessageSend);
    console.log('Msg-Data', data);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.chatMessageSend, {
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
        setLoading(false);
        console.log(
          'response',
          responseCode + '' + JSON.stringify(responseJson),
        );
        if (responseCode === 200) {
          if (responseJson.success == 'true') {
            var data = responseJson.data;
            console.log('Chat Group', 'Tip Message Send');
          } else {
            console.log('Msg Error', responseJson.message);
          }
        } else {
          if (responseJson.hasOwnProperty('message')) {
            console.log('message-error:', responseJson.message);
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
            console.log('Api Error', responseJson[key][secondKey][0]);
          }
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('message-exception', err.message);
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
        <Text style={styles.titleText}>{I18n.t('tipThanks.tip_details')}</Text>
        <View style={styles.backImageBack} />
      </View>

      <View style={styles.viewStyle}>
        <ScrollView
          style={{}}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps={'handled'}
          overScrollMode="never">
          
          <Text style={styles.msgText}>{tipMessage}</Text>
          <Text style={styles.dateText}>{Moment(tipDate).format('lll')}</Text>
          {/* <Text style={styles.headerText}>
            {I18n.t('tipThanks.payment_summary')}
          </Text> */}
          <View style={styles.detailContainer}>
          <View style={styles.rowViewStyle}>
              <Text style={styles.detailHeadText}>
                {I18n.t('tipThanks.tip_amount')}
              </Text>
              <Text style={styles.detailSubText}>
                {I18n.t('common.currency') + Number(tipAmount).toFixed(2)}
              </Text>
            </View>
            <View style={styles.rowViewStyle}>
              <Text style={styles.detailHeadText}>
                {I18n.t('tipThanks.platform_fee')}
              </Text>
              <Text
                style={styles.detailSubText}
                numberOfLines={1}
                ellipsizeMode={'middle'}>
                {I18n.t('common.currency') + Number(platformFee).toFixed(2)}
              </Text>
            </View>
            
            <View style={{flexDirection: 'row',
    alignItems:'center',
    paddingVertical:11,}}>
              <Text style={styles.detailHeadText}>
                {I18n.t('tipThanks.busker_amount')}
              </Text>
              <Text style={styles.detailSubTextAmount}>{I18n.t('common.currency') + Number(buskerAmount).toFixed(2)}</Text>
            </View>
            
           
          </View>
          {type == 'busker' && (
          <View style={styles.bottomView}>
            <TouchableOpacity
              style={styles.btnContainer}
              activeOpacity={0.5}
              onPress={() => {
                MessageThanksApi();
                SayThanksMessage();
              }}>
              <Text style={styles.btnText}>
                {I18n.t('tipThanks.say_thanks')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        </ScrollView>

        
      </View>
     
      <TouchableOpacity
      style={{position:'absolute',top:150,left:0,right:0}}
            activeOpacity={0.8}
            onPress={() => {
              if (type == 'user')
                if (item.busker != null)
                  props.navigation.navigate('BuskerDetail', {
                    item: item.busker,
                    type: 'normal',
                  });
            }}>
            <View style={styles.imageStyle}>
              <Image
                style={styles.imageStyle}
                resizeMode={'cover'}
                source={require('../../Assets/Images/profileImage.png')}
              />
              {pic != null && (
                <Image
                  style={[styles.imageStyle, {position: 'absolute'}]}
                  resizeMode={'cover'}
                  source={{uri: pic}}
                />
              )}
            </View>
            <Text style={styles.nameText}>{name}</Text>
          </TouchableOpacity>
     
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

export default ThankYou;
