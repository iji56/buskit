import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import I18n from '../../Config/I18n';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';

import Moment from 'moment';
import {GiftedChat} from 'react-native-gifted-chat';
import firebaseSvc from '../../Components/FirebaseSvc';

const ChatScreen = props => {
  const {
    user,
    chatRoom,
    senderId,
    receiverId,
    receiverName,
  } = props.route.params;
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    console.log('ChatRoom', chatRoom);
    console.log('ChatUser', user);
    firebaseSvc.refRoomOn(message => {
      //setMessages(prevState => [...prevState, message]);
      setMessages(prevState => GiftedChat.append(prevState, message));
    });
  }, []);

  const sendMessage = () => {
    console.log('Text-Message', inputText);
    if (inputText.length != 0) {
      let data = {
        message: inputText,
        room_id: chatRoom,
        sender_id: senderId,
        receiver_id: receiverId,
      };
      MessageSendApi(data);
    } else {
      toast.current.show('Please Enter Text', 2000, () => {});
    }
  };

  //******************** Hit Send Message Api *******************
  const MessageSendApi = async data => {
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
        console.log(
          'response',
          responseCode + '' + JSON.stringify(responseJson),
        );
        if (responseCode === 200) {
          if (responseJson.success == 'true') {
            var data = responseJson.data;
            //setGenres(data);
          } else {
            console.log('message-api-error', responseJson.message);
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
            console.log('message-error:', responseJson[key][secondKey][0]);
          }
        }
      })
      .catch(err => {
        console.log('message-exception', err.message);
      });
  };

  const EmptyChatView = props => {
    return (
      <View style={styles.emptyView}>
        <Image
          style={styles.ImageStyle}
          resizeMode={'contain'}
          source={require('../../Assets/Images/app_logo.png')}
        />
        <Text style={styles.EmptyText}>{'No Chats Yet!'}</Text>
        <Text style={styles.EmptyText}>{'Send First Message'}</Text>
      </View>
    );
  };

  const ChatLoader = props => {
    return (
      <ActivityIndicator
        size={'large'}
        color={Colors.theme}
        style={styles.loaderStyle}
      />
    );
  };

  const SendButton = props => {
    return (
      <TouchableOpacity
        style={styles.sendContainer}
        onPress={() => {
          if (inputText.length != 0) {
            sendMessage();
            firebaseSvc.sendSingleMessage(inputText, user);
            setInputText('');
          }
        }}>
        <Text style={styles.sendBtnStyle}>Send</Text>
      </TouchableOpacity>
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
            Keyboard.dismiss();
            props.navigation.goBack();
          }}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.titleText}>{receiverName}</Text>
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
        <GiftedChat
          keyboardShouldPersistTaps="handled"
          user={user}
          messages={messages}
          alwaysShowSend={true}
          showUserAvatar={true}
          onSend={messages => {
            firebaseSvc.sendMessage(messages);
            sendMessage();
          }}
          text={inputText}
          onInputTextChanged={setInputText}
          renderChatEmpty={EmptyChatView}
          renderLoading={ChatLoader}
          renderSend={SendButton}
          // timeTextStyle={{
          //   left: {justifyContent: 'flex-end'},
          //   right: {justifyContent: 'flex-start'},
          // }}
          // renderTime={message => (
          //   <View style={{}}>
          //     <Text style={{}}>
          //       {Moment(message.createdAt).format('ll')}
          //     </Text>
          //   </View>
          // )}
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

export default ChatScreen;
