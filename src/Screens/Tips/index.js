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
import Tooltip from 'react-native-walkthrough-tooltip';

const Home = props => {
  const [user, setUser] = useState('');
  const [tips, setTips] = useState([]);
  const [arrayholder, setHolder] = useState([]);
  const [text, setText] = useState('');

  const [isLoading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [onLoad, setOnLoad] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const toast = useRef(null);
  const [toolTipVisible, setToolTipVisible] = useState(false);
 
  const [isTipAvailabel, setisTipAvailabel] = useState(false);
  const [totalTip, setTotalTip] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [actualReceive, setActualReceive] = useState(0);
  const [transactionCount, setTransactionCount] = useState(10);
  const [payoutDate, setPayoutDate] = useState('');
  const [noTipPendingMessage, setNoTipPendingMessage] = useState('You do not have tip amount!');
 

  useEffect(() => {
    let data = [
      {
        id: 20,
        transaction_id: 'trxn123453',
        user_id: 40,
        reciever_id: 43,
        amount: '7',
        customer_id: 'cust12503',
        status: 'successful',
        payment_method: 'stripe',
        notes: null,
        created_at: '2020-10-27T06:48:57.000000Z',
        updated_at: '2020-10-27T06:48:57.000000Z',
        user: {
          id: 40,
          name: 'Demo',
          profile_img: null,
        },
      },
    ];
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Preload data using AsyncStorage
      AsyncStorage.getItem('UserDetails', (err, result) => {
        if (err === null) {
          let res = JSON.parse(result);
          setUser(res);
          setPage(1);
          setTips([]);
          setisTipAvailabel(false)
          setTotalTip(0);
          setPlatformFee(0);
          setActualReceive(0);
          setTransactionCount(10);
          setPayoutDate('');
          TipsDetailApi(res);
          TipsApi(res);
        }
      });
    }, []),
  );

   //******************** Hit Total Tips detail api *******************
   const TipsDetailApi = async data => {
    setLoading(true);
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.tipsDetail,
    );
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.tipsDetail, {
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


        // {"success":true,"data":{"total_tip_balance":20,
        // "platform_fee":6,"recieve_amount":14,"transaction_count":6},
        // "message":"Payout detail listed successfully."}
        console.log("inside API CALLLLIIIINNNGGGG:::----",isTipAvailabel)

        setLoading(false);
        if (responseCode === 200) {
          if (responseJson.success) {
           
            setisTipAvailabel(true);
            setTotalTip(responseJson.data.total_tip_balance);
            setPlatformFee(responseJson.data.platform_fee);
            setActualReceive(responseJson.data.recieve_amount);
            setTransactionCount(responseJson.data.transaction_count);
            setPayoutDate(responseJson.data.payout_date_time);
            
          } else {
            console.log("inside ELSEEEEEEEEEEEEE")
            setisTipAvailabel(false);
            setNoTipPendingMessage(responseJson.message)
            setTransactionCount(10);
            
          }
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        toast.current.show(err.message, 2000, () => {});
      });
  };

  //******************** Hit Tips Api *******************
  const TipsApi = async data => {
    if (page == 1) setLoading(true);
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.tipsList + '?page=' + page,
    );
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.tipsList + '?page=' + page, {
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
            var data = responseJson.data.data;
            if (data.length === 0) {
              setOnLoad(false);
              setFetching(false);
            } else {
              setOnLoad(true);
              setFetching(true);
              setTotalPage(responseJson.data.last_page);
              setPage(page + 1);
              setTips([...tips, ...data]);
              setHolder([...tips, ...data]);
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

  //Search filter of the list
  const SearchFilterFunction = text => {
    //passing the inserted text in textinput
    const newData = arrayholder.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.user.name
        ? item.user.name.toUpperCase()
        : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    //setting the filtered newData on datasource
    //After setting the data it will automatically re-render the view
    setTips(newData);
  };

  // Tips Row Item
  const rowItem = (item, pos) => {
    if (item.user == null) return <View />;
    else
      return (
        <TouchableOpacity
          style={[styles.rowContainer,{backgroundColor: item.payout_status.toUpperCase()==='SCHEDULE'?'white':'#E8E8E8'}]}
          activeOpacity={0.8}
          onPress={() => {
            props.navigation.navigate('TipThanks', {
              item: item,
              type: 'busker',
            });
          }}>
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
                {I18n.t('common.currency') + item.amount}
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
        <TouchableOpacity style={styles.backImageBack} onPress={() => {}}>
          {/* <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/back.png')}
          /> */}
        </TouchableOpacity>
        <Text style={styles.titleText}>{I18n.t('tips.tips')}</Text>
        <TouchableOpacity
          style={styles.backImageBack}
          onPress={() => {
            //props.navigation.navigate('Notifications');
          }}>
          {/* <Image
                style={styles.backImageStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_notification.png')}
              /> */}
        </TouchableOpacity>
      </View>
      <View style={styles.viewStyle}>
        {/* <View style={styles.editContainer}>
           <TextField
              selectionColor={Colors.theme}
            placeholder={I18n.t('common.search')}
            inputContainerStyle={styles.inputContainer}
            tintColor={Colors.theme}
            lineWidth={0}
            activeLineWidth={0}
            labelFontSize={0}
            fontSize={15}
            style={{
              fontFamily: Fonts.MontserratRegular,
              color: Colors.black,
            }}
            keyboardType={'default'}
            autoCapitalize={'none'}
            clearButtonMode={'always'}
            returnKeyLabel={'Done'}
            returnKeyType={'done'}
            onChangeText={text => SearchFilterFunction(text)}
            value={text}
          />
          <Image
            style={styles.searchIcon}
            resizeMode={'contain'}
            source={require('../../Assets/Images/ic_find.png')}
          />
        </View> */}
        
        {tips.length == 0 ? (
          <View style={commonStyles.emptyView}>
            <Image
              style={commonStyles.ImageStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/app_logo.png')}
            />
            <Text style={commonStyles.EmptyText}>{'No Tips'}</Text>
          </View>
        ):(
          <View style={{flexDirection:'column',paddingTop:50}}>
            <Text style={[styles.headerTipTextStyle,{fontSize:13}]}>
  { 'Your Tip Balance'} 
  </Text>
             <Tooltip
          animated={true}
          // (Optional) When true,
          // tooltip will animate in/out when showing/hiding
          arrowSize={{width: 16, height: 8}}
          // (Optional) Dimensions of arrow bubble pointing
          // to the highlighted element
          backgroundColor="rgba(0,0,0,0.05)"
          // (Optional) Color of the fullscreen background
          // beneath the tooltip.
          isVisible={toolTipVisible}
          // (Must) When true, tooltip is displayed
          content={
           

          <View style={styles.detailContainer}>
            {isTipAvailabel ? (
              <View>
          <View style={styles.toolTipRowViewStyle}>
              <Text style={styles.detailHeadText}>
                {I18n.t('tips.total_tip_balance')}
              </Text>
              <Text style={styles.detailSubText}>
                {I18n.t('common.currency')+totalTip.toFixed(2)}
              </Text>
            </View>
           
            <View style={styles.toolTipRowViewStyle}>
              <Text style={styles.detailHeadText}>
                {I18n.t('tips.platform_fee')}
              </Text>
              <Text
                style={styles.detailSubText}
                numberOfLines={1}
                ellipsizeMode={'middle'}>
                {I18n.t('common.currency') + platformFee.toFixed(2)}
              </Text>
            </View>
            
            <View style={{ flexDirection: 'row',
    alignItems:'center',
    // marginVertical: 5,
    paddingVertical:11,}}>
              <Text style={styles.detailHeadText}>
                {I18n.t('tips.you_receive')}
              </Text>
              <Text style={styles.detailSubTextAmount}>
              {I18n.t('common.currency') + actualReceive.toFixed(2)}
              </Text>
            </View>
            </View>
            ):(
              <View style={styles.rowViewStyle}>
              <Text style={styles.detailHeadText}>
                {noTipPendingMessage}
              </Text>
            
            </View>
            )
            }
            </View>


          }
          // (Must) This is the view displayed in the tooltip
          placement= {isTipAvailabel? "bottom":"top"}
          // (Must) top, bottom, left, right, auto.
          onClose={() => setToolTipVisible(false)}
          // (Optional) Callback fired when the user taps the tooltip
        >
            <TouchableOpacity 
           onPress={() => setToolTipVisible(true)}
           style={{alignSelf:'center',flexDirection:'row',justifyContent:'center',alignItems:'center'}}
           activeOpacity={.6}
            >
                <Text style={styles.tipsPageTextStyle}>{I18n.t('common.currency') + totalTip.toFixed(2)}
                </Text>
                <Image
              style={{height:20,width:20,marginStart:4}}
              // resizeMode={'center'}
              source={require('../../Assets/Images/info_icon.png')}
            />
                </TouchableOpacity>
                </Tooltip>

          <Text style={styles.payoutTextStyle}>
            { transactionCount===undefined?"Your next auto payout is on "+ payoutDate : "You need "+ transactionCount +" more transaction in order to get auto payout "} 
            </Text>


        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode={'never'}Ò
          contentContainerStyle={{paddingTop: 10,paddingBottom:100}}
          style={{alignSelf: 'center',backgroundColor:'#F7F7F7',paddingHorizontal:5}}
          data={tips}
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
              TipsApi(user);
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
         {/* <Tooltip
          animated={true}
          // (Optional) When true,
          // tooltip will animate in/out when showing/hiding
          arrowSize={{width: 16, height: 8}}
          // (Optional) Dimensions of arrow bubble pointing
          // to the highlighted element
          backgroundColor="rgba(0,0,0,0.5)"
          // (Optional) Color of the fullscreen background
          // beneath the tooltip.
          isVisible={toolTipVisible}
          // (Must) When true, tooltip is displayed
          content={<Text>Hello! AboutReact</Text>}
          // (Must) This is the view displayed in the tooltip
          placement="bottom"
          // (Must) top, bottom, left, right, auto.
          onClose={() => setToolTipVisible(false)}
          // (Optional) Callback fired when the user taps the tooltip
        >
          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={() => setToolTipVisible(true)}>
            <Text style={styles.buttonTextStyle}>
              Say Hi to AboutReact
            </Text>
          </TouchableHighlight>
        </Tooltip> */}
    </SafeAreaView>
  );
};

export default Home;
