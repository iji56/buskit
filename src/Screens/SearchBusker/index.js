import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Keyboard,
  AsyncStorage,
  SafeAreaView,
} from 'react-native';
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
  const [user, setUser] = useState('');
  const [editText, setEditText] = useState('');
  const [buskers, setBuskers] = useState([]);
  const [events, setEvents] = useState([]);

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
  }, []);

  //******************** Hit Find Buskers Api *********************
  const FindBuskerApi = async () => {
    if (editText.length == 0) {
      toast.current.show('Please input text', 2000, () => {});
    } else {
      let data = {
        title: editText,
      };
      setLoading(true);
      console.log('ApiCall', constants.baseUrl + constants.api.findBusker);
      timeout(
        10000,
        fetch(constants.baseUrl + constants.api.findBusker, {
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
              var buskerData = responseJson.buskerdata.data;
              var eventData = responseJson.ManageEvent.data;
              setBuskers(buskerData);
              setEvents(eventData);
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
              toast.current.show(
                responseJson[key][secondKey][0],
                2000,
                () => {},
              );
            }
          }
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
          toast.current.show(err.message, 2000, () => {});
        });
    }
  };

  const buskerItem = (item, pos) => {
    return (
      <>
        <TouchableOpacity
          style={styles.rowContainer}
          activeOpacity={0.8}
          onPress={() => {
            props.navigation.navigate('BuskerDetail', {
              item: item,
              type: 'normal',
            });
          }}>
          <View style={styles.rowImageView}>
            <Image
              style={styles.rowImageView}
              resizeMode={'cover'}
              source={require('../../Assets/Images/profileImage.png')}
            />
            <Image
              style={[styles.rowImageView, {position: 'absolute'}]}
              resizeMode={'cover'}
              source={{
                uri: item.profile_img != null ? item.profile_img : 'image',
              }}
            />
          </View>
          <View style={styles.detailViewStyle}>
            <Text style={styles.nameTextStyle}>{item.name}</Text>
            <Text style={styles.descTextStyle}>{'@' + item.stagename}</Text>
            <Text style={styles.typeTextStyle}>
              {item.other_cat_name != null
                ? item.other_cat_name
                : item.categorydata != null
                ? item.categorydata.category
                : 'Category'}
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const eventItem = (item, pos) => {
    return (
      <>
        <TouchableOpacity
          style={styles.rowContainer}
          activeOpacity={0.8}
          onPress={() => {
            props.navigation.navigate('EventDetail', {
              event: item,
              type: 'user',
              action: 'null',
            });
          }}>
          <View style={styles.rowBannerView}>
            <Image
              style={styles.rowBannerView}
              resizeMode={'cover'}
              source={require('../../Assets/Images/thumbImage.png')}
            />
            <Image
              style={[styles.rowBannerView, {position: 'absolute'}]}
              resizeMode={'cover'}
              source={{uri: item.image}}
            />
          </View>
          <View style={styles.detailViewStyle}>
            <Text style={styles.nameTextStyle}>{item.event_name}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginEnd: 10,
              }}>
              <Image
                style={styles.rowIconView}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_location.png')}
              />
              <Text
                style={styles.descTextStyle}
                numberOfLines={2}
                ellipsizeMode={'tail'}>
                {item.address}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.viewcontainer}>
      <CustomStatusBar color={Colors.theme} />
      <View style={styles.headerRowStyle}>
        <TouchableOpacity
          style={styles.backImageBack}
          activeOpacity={0.8}
          onPress={() => props.navigation.goBack()}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.titleText}>{I18n.t('search.searching')}</Text>
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
            returnKeyLabel={'Search'}
            returnKeyType={'search'}
            onChangeText={setEditText}
            onSubmitEditing={() => {
              Keyboard.dismiss();
              FindBuskerApi();
            }}
          />
          <TouchableOpacity
            style={styles.serchContainer}
            onPress={() => {
              Keyboard.dismiss();
              FindBuskerApi();
            }}>
            <Image
              style={styles.searchIconStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_find.png')}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps={'handled'}
          overScrollMode="never">
          <Text style={styles.headText}>{I18n.t('search.artists')}</Text>
          {buskers.length == 0 && (
            <View style={styles.emptyView}>
              <Text style={styles.EmptyText}>{'No Artist'}</Text>
            </View>
          )}
          {buskers.length != 0 && (
            <FlatList
              showsVerticalScrollIndicator={false}
              bounces={false}
              overScrollMode={'never'}
              style={{alignSelf: 'center'}}
              data={buskers}
              renderItem={({item, pos}) => buskerItem(item, pos)}
              keyExtractor={item => item.keyExtractor}
            />
          )}

          <Text style={styles.headText}>{I18n.t('search.events')}</Text>
          {events.length == 0 && (
            <View style={styles.emptyView}>
              <Text style={styles.EmptyText}>{'No Events'}</Text>
            </View>
          )}
          {events.length != 0 && (
            <FlatList
              showsVerticalScrollIndicator={false}
              bounces={false}
              overScrollMode={'never'}
              style={{alignSelf: 'center'}}
              contentContainerStyle={{paddingBottom: 15}}
              data={events}
              renderItem={({item, pos}) => eventItem(item, pos)}
              keyExtractor={item => item.keyExtractor}
            />
          )}
        </ScrollView>
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
