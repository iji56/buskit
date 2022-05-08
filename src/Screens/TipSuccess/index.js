import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import CustomStatusBar from '../../Components/CustomStatusBar';
import I18n from '../../Config/I18n';

const ThankYou = props => {
  const {id, amount, receiverId, receiverName} = props.route.params;
  const [txnId, setTxnId] = useState('');
  const [tipAmount, setTipAmount] = useState('0');
  const [buskerId, setBuskerId] = useState(0);
  const [buskerName, setBuskerName] = useState('BuskerName');

  useEffect(() => {
    setTxnId(id);
    setTipAmount(amount);
    setBuskerId(receiverId);
    setBuskerName(receiverName);
    // Back Button Handler
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  function handleBackButtonClick() {
    return true;
  }

  return (
    <SafeAreaView style={styles.viewcontainer}>
      <CustomStatusBar color={Colors.theme} />
      <View style={styles.headerRowStyle}>
        <TouchableOpacity
          style={styles.backImageBack}
          onPress={() => {
            //props.navigation.goBack();
          }}>
          {/* <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/back.png')}
          /> */}
        </TouchableOpacity>
        <Text style={styles.titleText} />
        <View style={styles.backImageBack} />
      </View>

      <View style={styles.viewStyle}>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps={'handled'}
          overScrollMode="never">
          <Image
            style={styles.imageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/busker_playing.png')}
          />
          <Text style={styles.titleText}>
            {I18n.t('tipSuccess.thank_you_txt')}
          </Text>
          <Text style={styles.msgText}>
            <Text>{I18n.t('tipSuccess.message_txt')}</Text>
            <Text style={{fontWeight: 'bold', color: Colors.black}}>
              {buskerName}
            </Text>
          </Text>
          <Text style={styles.headerText}>
            {I18n.t('tipSuccess.payment_summary')}
          </Text>
          <View style={styles.detailContainer}>
            <View style={styles.rowViewStyle}>
              <Text style={styles.detailHeadText}>
                {I18n.t('tipSuccess.trans_id')}
              </Text>
              <Text
                style={styles.txnSubText}
                numberOfLines={1}
                ellipsizeMode={'middle'}>
                {txnId}
              </Text>
            </View>
            <View style={styles.rowViewStyle}>
              <Text style={styles.detailHeadText}>
                {I18n.t('tipSuccess.tip_amount')}
              </Text>
              <Text style={styles.detailSubText}>{I18n.t('common.currency')+tipAmount}</Text>
            </View>
            <View style={styles.rowViewStyle}>
              <Text style={styles.detailHeadText}>
                {I18n.t('tipSuccess.paid_to')}
              </Text>
              <Text style={styles.detailSubText}>{buskerName}</Text>
            </View>
          </View>

          <Text style={styles.noteText}>{I18n.t('tipSuccess.note_txt')}</Text>
          <TouchableOpacity
            style={styles.btnContainer}
            activeOpacity={0.5}
            onPress={() => {
              props.navigation.reset({
                index: 0,
                routes: [{name: 'UserTab', params: {route: 'initial'}}],
              });
            }}>
            <Text style={styles.btnText}>{I18n.t('common.done_btn')}</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.bottomView} />
      </View>
    </SafeAreaView>
  );
};

export default ThankYou;
