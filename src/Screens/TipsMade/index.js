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

const Home = props => {
  const [user, setUser] = useState('');
  const [tipsMade, setTipsMade] = useState([]);
  const [arrayholder, setHolder] = useState([]);
  const [text, setText] = useState('');

  const [isLoading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [onLoad, setOnLoad] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const toast = useRef(null);

  useEffect(() => {
    // Preload data using AsyncStorage
    AsyncStorage.getItem('UserDetails', (err, result) => {
      if (err === null) {
        let res = JSON.parse(result);
        setUser(res);
        setPage(1);
        setTipsMade([]);
        TipsSentApi(res);
      }
    });
    let data = [
      {
        id: 12,
        transaction_id: 'PAYID-L6LIRHQ24K07011RW2475508',
        user_id: 39,
        reciever_id: 20,
        amount: '1.00',
        customer_id: '6W8KGM4VFR9RG',
        status: 'successful',
        payment_method: 'paypal',
        notes: null,
        created_at: '2020-10-26T08:31:42.000000Z',
        updated_at: '2020-10-26T08:31:42.000000Z',
        busker: {
          id: 20,
          name: 'demouser',
          category: '8',
          profile_img: null,
          categorydata: {
            id: 8,
            category: 'dancer',
          },
        },
      },
    ];
  }, []);

  useFocusEffect(React.useCallback(() => {}, []));

  //******************** Hit Fav Buskers Api *******************
  const TipsSentApi = async data => {
    if (page == 1) setLoading(true);
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.tipsSentList + '?page=' + page,
    );
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.tipsSentList + '?page=' + page, {
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
              setTipsMade([...tipsMade, ...data]);
              setHolder([...tipsMade, ...data]);
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
      const itemData = item.busker.name
        ? item.busker.name.toUpperCase()
        : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    //setting the filtered newData on datasource
    //After setting the data it will automatically re-render the view
    setTipsMade(newData);
  };

  // Tips List Item
  const rowItem = (item, pos) => {
    if (item.busker == null) return <View />;
    else
      return (
        <TouchableOpacity
          style={styles.rowContainer}
          activeOpacity={0.8}
          onPress={() => {
            props.navigation.navigate('TipThanks', {item: item, type: 'user'});
          }}>
          <TouchableOpacity
            style={styles.rowImageStyle}
            activeOpacity={0.8}
            onPress={() => {
              if (item.busker != null)
                props.navigation.navigate('BuskerDetail', {
                  item: item.busker,
                  type: 'normal',
                });
            }}>
            <Image
              style={styles.rowImageStyle}
              resizeMode={'cover'}
              source={require('../../Assets/Images/profileImage.png')}
            />
            {item.busker.profile_img != null && (
              <Image
                style={[styles.rowImageStyle, {position: 'absolute'}]}
                resizeMode={'cover'}
                source={{
                  uri: item.busker.profile_img,
                }}
              />
            )}
          </TouchableOpacity>
          <View style={styles.detailViewStyle}>
            <View style={styles.rowViewStyle}>
              <Text style={styles.nameTextStyle}>{item.busker.name}</Text>
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
                : 'No Comments'}
            </Text>
            <View style={styles.rowViewStyle}>
              <Text style={styles.txnTextStyle}>
                {I18n.t('tips.transaction_id')}
              </Text>
              <Text
                style={styles.txnIdTextStyle}
                numberOfLines={1}
                ellipsizeMode={'tail'}>
                {item.transaction_id}
              </Text>
            </View>
            <View style={styles.rowViewStyle}>
              <Text style={styles.timeTextStyle}>
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
        <Text style={styles.titleText}>{I18n.t('tips.tips_made')}</Text>
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
        <View style={styles.editContainer}>
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
        </View>
        {tipsMade.length == 0 && (
          <View style={commonStyles.emptyView}>
            <Image
              style={commonStyles.ImageStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/app_logo.png')}
            />
            <Text style={commonStyles.EmptyText}>{'No Tips Given'}</Text>
          </View>
        )}
        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode={'never'}
          contentContainerStyle={{paddingVertical: 10}}
          style={{alignSelf: 'center'}}
          data={tipsMade}
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
              TipsSentApi(user);
            }
          }}
          ListFooterComponent={BottomView}
        />
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

export default Home;
