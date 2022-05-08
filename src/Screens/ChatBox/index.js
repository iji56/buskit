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

import {useSelector} from 'react-redux';
import firebaseSvc from '../../Components/FirebaseSvc';

const Home = props => {
  const {type} = props.route.params;
  const [user, setUser] = useState('');
  const [chatUser, setChatUser] = useState('');
  const [chatRooms, setChatRooms] = useState([]);
  const [arrayholder, setHolder] = useState([]);
  const [text, setText] = useState('');

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  const firebaseUser = useSelector(state => state.firebase);

  useEffect(() => {
    console.log('Firebase', firebaseUser);
    // Preload data using AsyncStorage
    AsyncStorage.getItem('FirebaseUser', (err, result) => {
      if (err === null) {
        let res = JSON.parse(result);
        console.log('Firebase User', res);
        setChatUser(res);
      }
    });
    //Demo Chat Data
    let data = [
      {
        id: 1,
        user1_id: 43,
        user2_id: 48,
        userdata1: {
          id: 4,
          name: 'John',
          profile_img: 'image',
        },
        userdata2: {
          id: 4,
          name: 'John',
          profile_img: 'image',
        },
        recent_msg:
          'lorem ipsum door sit amet, consecletur adipiscing elit. Vertibibulum',
        created_at: '2020-08-27 17:00:00',
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
          ChatRoomApi(res);
        }
      });
    }, []),
  );

  //******************** Hit Chat Rooms Api *******************
  const ChatRoomApi = async data => {
    setLoading(true);
    let body = {
      user_id: data.id,
    };
    console.log('ApiCall', constants.baseUrl + constants.api.chatMessageRooms);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.chatMessageRooms, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.access_token}`,
        },
        body: JSON.stringify(body),
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
            setChatRooms(data);
            setHolder(data);
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
      let data = item.user1_id === user.id ? item.userdata2 : item.userdata1;
      //applying filter for the inserted text in search bar
      const itemData = data.name ? data.name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    //setting the filtered newData on datasource
    //After setting the data it will automatically re-render the view
    setChatRooms(newData);
  };

  const rowItem = (item, pos) => {
    let data = null;
    if (item.user1_id === user.id) {
      data = item.userdata2;
    } else {
      data = item.userdata1;
    }
    return (
      <>
        <TouchableOpacity
          style={styles.rowContainer}
          activeOpacity={0.8}
          onPress={() => {
            var res = item.room_id.split('-');
            let room = firebaseSvc.setChatRoom(res[0], res[1]);
            console.log('Room Ref:' + room);
            props.navigation.navigate('ChatScreen', {
              user: chatUser,
              chatRoom: item.room_id,
              senderId: user.id,
              receiverId: data.id,
              receiverName: data.name,
            });
          }}>
          <View style={styles.rowImageView}>
            <Image
              style={styles.rowImageView}
              resizeMode={'cover'}
              source={require('../../Assets/Images/profileImage.png')}
            />
            {data.profile_img != null && (
              <Image
                style={[styles.rowImageView, {position: 'absolute'}]}
                resizeMode={'cover'}
                source={{uri: data.profile_img}}
              />
            )}
          </View>
          <View style={styles.detailViewStyle}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.nameTextStyle}>{data.name}</Text>
              <Text style={styles.detailTextStyle}>
                {Moment(new Date()).format('ll') ===
                Moment(item.updated_at).format('ll')
                  ? Moment(item.updated_at).format('LT')
                  : Moment(item.updated_at).format('ll')}
              </Text>
            </View>
            <Text
              style={styles.descTextStyle}
              numberOfLines={2}
              ellipsizeMode={'tail'}>
              {item.recent_msg}
            </Text>
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
          onPress={() => {
            if (type == 'user') props.navigation.goBack();
          }}>
          {type == 'user' && (
            <Image
              style={styles.backImageStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/back.png')}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.titleText}>{I18n.t('buskerHome.chatbox')}</Text>
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
        {chatRooms.length == 0 && (
          <View style={commonStyles.emptyView}>
            <Image
              style={commonStyles.ImageStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/app_logo.png')}
            />
            <Text style={commonStyles.EmptyText}>{'No Chats'}</Text>
          </View>
        )}
        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode={'never'}
          contentContainerStyle={{paddingVertical: 10}}
          style={{alignSelf: 'center'}}
          data={chatRooms}
          renderItem={({item, pos}) => rowItem(item, pos)}
          keyExtractor={item => item.keyExtractor}
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
