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
import I18n from '../../Config/I18n';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';

const Home = props => {
  const {type} = props.route.params;
  const [user, setUser] = useState('');
  const [buskers, setBuskers] = useState([]);
  const [arrayholder, setHolder] = useState([]);
  const [text, setText] = useState('');

  const [isLoading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [onLoad, setOnLoad] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const toast = useRef(null);

  useEffect(() => {
    let data = [
      {
        id: 1,
        name: 'Artist Name',
        stagename: '@artistName',
        profile_img: 'image',
        busker_bio:
          'lorem ipsum door sit amet, consecletur adipiscing elit. Vertibibulum',
        categorydata: {
          id: 8,
          category: 'dancer',
        },
        address: '126, Carver St, Brooklyn, NY 12120',
        price: '100',
        fans_count: '22',
        distance: 0.35556,
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
          setBuskers([]);
          FavBuskersApi(res);
        }
      });
    }, []),
  );

  //******************** Hit Fav Buskers Api *******************
  const FavBuskersApi = async data => {
    if (page == 1) setLoading(true);
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.favoriteList + '?page=' + page,
    );
    timeout(
      10000,
      fetch(
        constants.baseUrl +
          constants.api.favoriteList +
          '?user_id=' +
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
              setBuskers([...buskers, ...data]);
              setHolder([...buskers, ...data]);
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

  //******************** Hit Favorite Api ***********************
  const FavoriteApi = async (item, busker) => {
    let data = {
      user_id: user.id,
      busker_id: busker.id,
      favorite_status: '0',
    };
    setLoading(true);
    console.log('data', data);
    console.log('ApiCall', constants.baseUrl + constants.api.addFavorite);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.addFavorite, {
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
        console.log(
          'response',
          responseCode + '' + JSON.stringify(responseJson),
        );
        setLoading(false);
        if (responseCode === 200) {
          if (responseJson.success == 'true') {
            var data = responseJson.data;
            handleRemovePost(item);
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

  const handleRemovePost = item => {
    let dataBuksers = buskers;
    let index = dataBuksers.indexOf(item);
    console.log('pos', index);
    if (index !== -1) {
      if (index == 0 && dataBuksers.length == 1) {
        setBuskers([]);
      } else {
        dataBuksers.splice(index, 1); //to remove a single item starting at index
        setBuskers(dataBuksers);
      }
    }
    // let _itemState = buskers.filter((_item, _index) => _index !== index);
    // setBuskers(_itemState);
  };

  //Search filter of the list
  const SearchFilterFunction = text => {
    //passing the inserted text in textinput
    const newData = arrayholder.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.buskerdata.name
        ? item.buskerdata.name.toUpperCase()
        : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    //setting the filtered newData on datasource
    //After setting the data it will automatically re-render the view
    setBuskers(newData);
  };

  //Busker List Item
  const rowItem = (item, pos) => {
    if (item.buskerdata == null) return <View />;
    else
      return (
        <TouchableOpacity
          style={styles.rowContainer}
          activeOpacity={0.8}
          onPress={() => {
            props.navigation.navigate('BuskerDetail', {
              item: item.buskerdata,
              type: 'normal',
            });
          }}>
          <View style={styles.rowImageStyle}>
            <Image
              style={styles.rowImageStyle}
              resizeMode={'cover'}
              source={require('../../Assets/Images/profileImage.png')}
            />
            <Image
              style={[styles.rowImageStyle, {position: 'absolute'}]}
              resizeMode={'cover'}
              source={{
                uri:
                  item.buskerdata.profile_img != null
                    ? item.buskerdata.profile_img
                    : 'image',
              }}
            />
          </View>
          <View style={styles.detailViewStyle}>
            <View style={styles.rowViewStyle}>
              <Text style={styles.nameTextStyle}>{item.buskerdata.name}</Text>
            </View>
            <Text
              style={styles.descTextStyle}
              numberOfLines={2}
              ellipsizeMode={'tail'}>
              {item.buskerdata.busker_bio != null &&
              item.buskerdata.busker_bio != ''
                ? item.buskerdata.busker_bio
                : 'Busker Bio Not Added!'}
            </Text>
            <View style={styles.rowViewStyle}>
              <View style={styles.rowViewStyle}>
                <Text style={styles.typePriceTextStyle}>
                  {item.buskerdata.other_cat_name != null
                    ? item.buskerdata.other_cat_name
                    : item.buskerdata.categorydata != null
                    ? item.buskerdata.categorydata.name
                    : 'Artist'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.endRowViewStyle}
                onPress={() => {
                  if (type == 'fav') FavoriteApi(item, item.buskerdata);
                }}>
                <Image
                  style={styles.likeImageStyle}
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/heart_filled.png')}
                />
                <Text style={styles.likeTextStyle}>
                  {item.buskerdata.fans_count}
                </Text>
              </TouchableOpacity>
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
        <Text style={styles.titleText}>{I18n.t('busker.fav_buskers')}</Text>
        <TouchableOpacity style={styles.backImageBack} onPress={() => {}}>
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
        {buskers.length == 0 && (
          <View style={commonStyles.emptyView}>
            <Image
              style={commonStyles.ImageStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/app_logo.png')}
            />
            <Text style={commonStyles.EmptyText}>{'No Favorites'}</Text>
          </View>
        )}
        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode={'never'}
          contentContainerStyle={{paddingVertical: 10}}
          style={{alignSelf: 'center'}}
          data={buskers}
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
              FavBuskersApi(user);
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
