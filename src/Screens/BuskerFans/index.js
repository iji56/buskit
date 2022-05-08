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
  Alert,
  SafeAreaView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {TextField} from 'react-native-material-textfield';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import Fonts from '../../Res/Fonts';
import I18n from '../../Config/I18n';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';

const Home = props => {
  // const {callback} = props.route.params!==undefined && props.route.params!==null?props.route.params:null;
  const [user, setUser] = useState('');
  const [fans, setFans] = useState([]);
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
        setFans([]);
        BuskerFansApi(res);
      }
    });
  }, []);

  useFocusEffect(React.useCallback(() => {}, []));

  //******************** Hit Fav Buskers Api *******************
  const BuskerFansApi = async data => {
    if (page == 1) setLoading(true);
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.buskerFanList + '?page=' + page,
    );
    timeout(
      10000,
      fetch(
        constants.baseUrl +
          constants.api.buskerFanList +
          '?busker_id=' +
          data.id +
          '&page=' +
          page,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.access_token}`,
          },
        },
      ),
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
            var data = responseJson.data.data;
            if (data.length === 0) {
              setOnLoad(false);
              setFetching(false);
            } else {
              setOnLoad(true);
              setFetching(true);
              setTotalPage(responseJson.data.last_page);
              setPage(page + 1);
              setFans([...fans, ...data]);
              setHolder([...fans, ...data]);
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

  const deleteTapped = async item => {
    Alert.alert('Remove Fan', 'Are you sure you want to remove?', [
      {
        text: 'NO',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          FanDeleteApi(item);
        },
        style: 'default',
      },
    ]);
  };

  //******************** Hit Favorite Api ***********************
  const FanDeleteApi = async item => {
    let data = {
      user_id: item.userdata.id,
    };
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.buskerFanDelete);
    console.log('userData', data);
    timeout(
      10000,
      fetch(
        constants.baseUrl +
          constants.api.buskerFanDelete +
          '?user_id=' +
          item.userdata.id,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.access_token}`,
          },
        },
      ),
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
            //toast.current.show(responseJson.message, 2000, () => {});
            handleRemoveFans(item);
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

  // handle Remove Fans from list
  const handleRemoveFans = item => {
    let users = fans;
    let index = users.indexOf(item);
    console.log('pos', index);
    toast.current.show(
      item.userdata.name + ' removed from your fans list',
      2000,
      () => {},
    );
    if (index !== -1) {
      if (index == 0 && users.length == 1) {
        setFans([]);
      } else {
        users.splice(index, 1); //to remove a single item starting at index
        setFans(users);
      }
    }
  };

  //Search filter of the list
  const SearchFilterFunction = text => {
    //passing the inserted text in textinput
    const newData = arrayholder.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.userdata.name
        ? item.userdata.name.toUpperCase()
        : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    //setting the filtered newData on datasource
    //After setting the data it will automatically re-render the view
    setFans(newData);
  };

  // Busker Row Item
  const rowItem = (item, pos) => {
    return (
      <>
        <TouchableOpacity
          style={styles.rowContainer}
          activeOpacity={0.8}
          onPress={() => {}}>
          <View style={styles.rowImageView}>
            <Image
              style={styles.rowImageView}
              resizeMode={'cover'}
              source={require('../../Assets/Images/profileImage.png')}
            />
            <Image
              style={[styles.rowImageView, {position: 'absolute'}]}
              resizeMode={'cover'}
              // source={item.banner != null ? {uri: item.banner} : ''}
              source={{
                uri:
                  item.userdata.profile_img != null
                    ? item.userdata.profile_img
                    : '',
              }}
            />
          </View>
          <View style={styles.detailViewStyle}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.nameTextStyle}>{item.userdata.name}</Text>
              <TouchableOpacity
                style={styles.rowIconView}
                onPress={() => deleteTapped(item)}>
                <Image
                  style={styles.rowIconView}
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/ic_delete.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </>
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
          activeOpacity={0.8}
          onPress={() => {
            props.navigation.goBack();
            // if(callback!==undefined && callback!== null){
            // callback();
            // }
          }}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.titleText}>{I18n.t('account.my_fans')}</Text>
        <TouchableOpacity style={styles.backImageBack} />
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
        {fans.length == 0 && (
          <View style={commonStyles.emptyView}>
            <Image
              style={commonStyles.ImageStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/app_logo.png')}
            />
            <Text style={commonStyles.EmptyText}>{'No Fans'}</Text>
          </View>
        )}
        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode={'never'}
          contentContainerStyle={{paddingVertical: 10}}
          style={{alignSelf: 'center'}}
          data={fans}
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
              BuskerFansApi(user);
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
