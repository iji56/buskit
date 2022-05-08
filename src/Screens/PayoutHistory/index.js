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

const PayoutHistory = props => {
  const [user, setUser] = useState('');
  

  const [isLoading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [onLoad, setOnLoad] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const toast = useRef(null);
 
 
  const [isPayoutAvailable, setIsPayoutAvailable] = useState(false);
  const [totalPayout, setTotalPayout] = useState(0);
  const [payoutData, setPayoutData] = useState([]);


 

  useEffect(() => {
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Preload data using AsyncStorage
      AsyncStorage.getItem('UserDetails', (err, result) => {
        if (err === null) {
          let res = JSON.parse(result);
          setUser(res);
          setPage(1);
          setTotalPage(0)
          setPayoutData([]);
          setTotalPayout(0);
          // TipsDetailApi(res);
          PayoutApi(res);
        }
      });
    }, []),
  );


  //******************** Hit Tips Api *******************
  const PayoutApi = async data => {
    if (page == 1) setLoading(true);
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.tipPayout + '?page=' + page,
    );
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.tipPayout + '?page=' + page, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.access_token}`,
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
          if (responseJson.success) {
            var data = responseJson.data.all_payout.data;
            if (data.length === 0) {
              setOnLoad(false);
              setFetching(false);
            } else {
              setOnLoad(true);
              setFetching(true);
              setIsPayoutAvailable(true)
              setTotalPayout(responseJson.data.total_payout_amount)
              setTotalPage(responseJson.data.last_page);
              setPage(page + 1);
              setPayoutData([...payoutData, ...data]);
              console.log("PAYOUT DATA IS----",data)
            }
            if (
              responseJson.data.last_page === responseJson.data.current_page
            ) {
              setOnLoad(false);
              setFetching(false);
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


  // Tips Row Item
  const rowItem = (item, pos) => {
    // console.log("ITEM IS----",item);
    console.log("ITEM IS--payoutDate--",item.payoutDate);
    console.log("ITEM IS--payoutAmount--",item.payoutAmount);
   
   
      return (
        // <TouchableOpacity
        //   style={[styles.rowContainer,{backgroundColor: 'white'}]}
         
        //   onPress={() => {
        //     props.navigation.navigate('TipThanks', {
        //       item: item,
        //       type: 'busker',
        //     });
        //   }}>
          
          <View style={[styles.rowContainer,{flex:1,flexDirection:'row',padding:20}]}>
            
              <Text style={styles.nameTextStyle}>{item.payout_date}</Text>
              <Text style={styles.priceTextStyle}>
                {I18n.t('common.currency') + item.payout_amount}
              </Text>
              <TouchableOpacity
          style={{borderBottomColor:'blue',borderBottomWidth:2,marginLeft:6,justifyContent:'center',alignSelf:'center'}}
         
          onPress={() => {
            console.log("ddddddddddd",item.batch_id)
            props.navigation.navigate('PayoutDetail', {
              payoutBatchId: item.batch_id,
              totalPayout:item.payout_amount
            });
          }}>
              <Text style={styles.viewTextStyle}>
                View
              </Text>
              </TouchableOpacity>
           
          </View>
        // </TouchableOpacity>
      );
  };
  // Bottom List Item
  const BottomView = () => {
    return (
      <View>
        {fetching ? (
          <ActivityIndicator
            size="small"
            color={Colors.theme}
            style={{marginLeft: 6}}
          />
        ) : null}
      </View>
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
        <Text style={styles.titleText}>{I18n.t('tips.payoutHistory')}</Text>
        <TouchableOpacity
          style={styles.backImageBack}
          onPress={() => {
          }}>
          
        </TouchableOpacity>
      </View>
      <View style={styles.viewStyle}>
       
        
        {payoutData.length == 0 ? (
          <View style={commonStyles.emptyView}>
            <Image
              style={commonStyles.ImageStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/app_logo.png')}
            />
            <Text style={commonStyles.EmptyText}>{'No Tips'}</Text>
          </View>
        ):(
          <View style={{flexDirection:'column'}}>
            <Text style={[styles.tipsPageTextStyle,{paddingTop:30,paddingBottom:20,}]}>{'Total Payout : '+I18n.t('common.currency') + Number(totalPayout).toFixed(2)}
                </Text>
           
          

        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode={'never'}Ò
          contentContainerStyle={{paddingBottom:100}}
          style={{alignSelf: 'center',backgroundColor:'#F7F7F7',paddingHorizontal:5}}
          data={payoutData}
          renderItem={({item, pos}) => rowItem(item, pos)}
          keyExtractor={item => item.keyExtractor}
          onScrollEndDrag={() => console.log(' *********end')}
          onScrollBeginDrag={() => console.log(' *******start')}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          onEndReachedThreshold={0.5}
          onEndReached={({distanceFromEnd}) => {
            console.log(' ***************** ' + distanceFromEnd);
            if (page <= totalPage && onLoad) {
              PayoutApi(user);
            }
          }}
          ListFooterComponent={BottomView}
        />
       
            </View>
        )}
      </View>
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

export default PayoutHistory;
