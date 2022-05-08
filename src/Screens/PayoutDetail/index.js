import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
  SafeAreaView,
  I18nManager,
  TouchableHighlight,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {TextField} from 'react-native-material-textfield';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import Fonts from '../../Res/Fonts';
import Moment from 'moment';
import I18n from '../../Config/I18n';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';
// import Tooltip from 'react-native-walkthrough-tooltip';

const PayoutDetail = props => {
  const [user, setUser] = useState('');
  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);
   const {payoutBatchId,totalPayout} = props.route.params;

   const [tipsData, setTipsData] = useState([]);
  //  const [totalPayout, setTotalPayout] = useState(900);


 

  useEffect(() => {
    // console.log('Item------------------------------------', JSON.stringify(tipsData));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Preload data using AsyncStorage
      AsyncStorage.getItem('UserDetails', (err, result) => {
        if (err === null) {
          let res = JSON.parse(result);
          setUser(res);
          setTipsData([]);
          PayoutApi(res);
        }
      });
    }, []),
  );

   //******************** Hit Tips Api *******************
   const PayoutApi = async data => {
    setLoading(true);
    let ParamData = {
      batch_id: payoutBatchId
    };
   
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.tipPayoutDetail,
    );
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.tipPayoutDetail, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.access_token}`,
        },
        body: JSON.stringify(ParamData),
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
              setTipsData(data);
              console.log("PAYOUT DATA IS----",data)
            
            
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

  

  // Tips Row Item
  const rowItem = (item, pos) => {
      return (
        <TouchableOpacity
          style={[styles.rowContainer,{backgroundColor:'white'}]}
          activeOpacity={0.8}
          onPress={() => {
            props.navigation.navigate('TipThanks', {
              item: item,
              type: 'busker',
            }); 
           }}
           >
          <View
            style={[
              styles.rowImageStyle,
              {
                borderWidth: I18nManager.isRTL ? 1 : 0,
                borderColor: I18nManager.isRTL ? 'red' : 'green',
              },
            ]}>
            <Image
              style={styles.rowImageStyle}
              resizeMode={'cover'}
              source={require('../../Assets/Images/profileImage.png')}
            />
            {item.user.profile_img != null && (
              <Image
                style={[styles.rowImageStyle, {position: 'absolute'}]}
                resizeMode={'cover'}
                source={{uri: item.user.profile_img}}
              />
            )}
          </View>
          <View style={styles.detailViewStyle}>
            <View style={styles.rowViewStyle}>
              <Text style={styles.nameTextStyle}>{item.user.name}</Text>
              <Text style={styles.priceTextStyle}>
                {I18n.t('common.currency') + item.payout_amount}
              </Text>
            </View>
            <Text
              style={styles.descTextStyle}
              numberOfLines={2}
              ellipsizeMode={'tail'}>
              {item.notes != null && item.notes != ''
                ? item.notes
                : 'No Comment'}
            </Text>
            <View style={styles.rowViewStyle}>
              <Text style={[styles.timeTextStyle,{color:item.payout_status==='schedule'?'#C3C3C5':'#929292'}]}>
                {Moment(item.created_at).format('lll')}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
  };
  
  return (
    <SafeAreaView style={styles.viewcontainer}>
      <CustomStatusBar color={Colors.theme} />
      <View style={styles.headerRowStyle}>
        <TouchableOpacity style={styles.backImageBack} onPress={() => {
           props.navigation.goBack();
        }}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.titleText}>{I18n.t('tips.payoutdetail')}</Text>
        <TouchableOpacity
          style={styles.backImageBack}
          onPress={() => {
          }}>
          
        </TouchableOpacity>
      </View>
      <View style={styles.viewStyle}>
       
        
       
          <View style={{flexDirection:'column'}}>
            <Text style={[styles.tipsPageTextStyle,{paddingTop:30,paddingBottom:20,}]}>{'Total Payout : '+I18n.t('common.currency') + Number(totalPayout).toFixed(2)}
                </Text>
           
          

        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode={'never'}Ò
          contentContainerStyle={{paddingBottom:100}}
          style={{alignSelf: 'center',backgroundColor:'#F7F7F7',paddingHorizontal:5}}
          data={tipsData}
          renderItem={({item, pos}) => rowItem(item, pos)}
          keyExtractor={item => item.keyExtractor}
          
        />
       
            </View>
        
      </View>
      {isLoading && (
        <View style={commonStyles.loaderStyle}>
          <DotIndicator color={Colors.theme} size={15} count={4} />
        </View>
      )}
      <Toast
        ref={toast}
        style={commonStyles.toastStyle}
        textStyle={commonStyles.toastTextStyle}
      />
      
         
    </SafeAreaView>
  );
};

export default PayoutDetail;
