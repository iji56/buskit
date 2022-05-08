import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
  AsyncStorage,
  SafeAreaView,
  Keyboard,
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

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import OpenAppSettings from 'react-native-app-settings';
import {SwipeablePanel} from 'rn-swipeable-panel';

const Home = props => {
  const [user, setUser] = useState('');
  const [findId, setFindId] = useState('');
  const [bukers, setBuskers] = useState([]);
  const [findBuskers, setFindBuskers] = useState([]);

  const qrScanref = useRef(null);
  const [qrScan, setQRScan] = useState(false);
  const [torch, setTorch] = useState(false);

  const [panelProps, setPanelProps] = useState({
    fullWidth: true,
    openLarge: false,
    showCloseButton: true,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
  });
  const [isPanelActive, setIsPanelActive] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  useEffect(() => {}, []);

  useFocusEffect(
    React.useCallback(() => {
      // Preload data using AsyncStorage
      AsyncStorage.getItem('UserDetails', (err, result) => {
        if (err === null) {
          let res = JSON.parse(result);
          setUser(res);
          setBuskers([]);
          RecentTipsApi(res);
        }
      });
    }, []),
  );

  const openPanel = () => {
    setIsPanelActive(true);
  };

  const closePanel = () => {
    setIsPanelActive(false);
  };

  const qrScanSuccess = e => {
    console.log('data', e);
    try {
      let res = JSON.parse(e.data);
      console.log('JSON Data', res);
      if (
        res.hasOwnProperty('busker_id') &&
        res.hasOwnProperty('busker_name')
      ) {
        props.navigation.navigate('TipPayment', {
          id: res.busker_id,
          name: res.busker_name,
        });
      } else {
        toast.current.show('Busker QrCode Undefined', 2000, () => {});
      }
    } catch (err) {
      console.log(err.message);
      toast.current.show('Invalid Code', 2000, () => {});
    }
    setQRScan(false);
  };

  const checkPermission = () => {
    check(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    )
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log('This feature is not available');
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            requestPermission();
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            setQRScan(true);
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            showAlert();
            break;
        }
      })
      .catch(err => {
        console.log(err);
        toast.current.show(err.message, 2000, () => {});
      });
  };

  const requestPermission = () => {
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    )
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log('This feature is not available');
            break;
          case RESULTS.DENIED:
            console.log('The permission has been denied');
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            setQRScan(true);
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            showAlert();
            break;
        }
      })
      .catch(err => {
        console.log(err);
        toast.current.show(err.message, 2000, () => {});
      });
  };

  const showAlert = () => {
    Alert.alert(
      I18n.t('storage.storage_alert'),
      I18n.t('storage.camera_permission'),
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: I18n.t('storage.open_settings'),
          onPress: () => OpenAppSettings.open(),
        },
      ],
    );
  };

  //******************** Hit Search Api ***********************
  const SearchApi = async () => {
    if (findId.length == 0) {
      toast.current.show('Please input text', 2000, () => {});
    } else {
      setLoading(true);
      console.log('ApiCall', constants.baseUrl + constants.api.findBuskerName);
      timeout(
        10000,
        fetch(
          constants.baseUrl +
            constants.api.findBuskerName +
            '?busker_name=' +
            findId,
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
            if (responseJson.success) {
              var data = responseJson.data.data;
              setFindBuskers(data);
              openPanel();
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

  //******************** Hit Recent Tips Api ***********************
  const RecentTipsApi = async user => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.userRecentTips);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.userRecentTips, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.access_token}`,
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
            var data = responseJson.data;
            setBuskers(data);
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

  const rowItem = (item, pos) => {
    if (item.busker == null) return <View />;
    else
      return (
        <TouchableOpacity
          style={styles.rowContainer}
          activeOpacity={0.5}
          onPress={() => {
            props.navigation.navigate('TipPayment', {
              id: item.busker.id,
              name: item.busker.name,
            });
          }}>
          <Image
            style={styles.rowImageStyle}
            resizeMode={'cover'}
            source={
              item.busker.profile_img != null && item.busker.profile_img != ''
                ? {uri: item.busker.profile_img}
                : require('../../Assets/Images/profileImage.png')
            }
          />
          <Text style={styles.rowNameTxtStyle}>{item.busker.name}</Text>
        </TouchableOpacity>
      );
  };

  const findItem = (item, pos) => {
    return (
      <TouchableOpacity
        style={styles.sheetRowContainer}
        activeOpacity={0.5}
        onPress={() => {
          // props.navigation.navigate('TipPayment', {
          //   id: item.id,
          //   name: item.name,
          // });
          props.navigation.navigate('BuskerDetail', {
            item: item,
            type: 'normal',
          });
        }}>
        <Image
          style={styles.sheetRowImage}
          resizeMode={'cover'}
          source={
            item.profile_img != null && item.profile_img != ''
              ? {uri: item.profile_img}
              : require('../../Assets/Images/profileImage.png')
          }
        />
        <View style={styles.sheetRowStyle}>
          <Text style={styles.sheetRowName}>{item.name}</Text>
          <Text style={styles.sheetRowDesc}>
            {item.genersdata.name != null ? item.genersdata.name : 'Artist'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.viewcontainer}>
      <CustomStatusBar color={Colors.theme} />
      {qrScan && (
        <>
          <View style={styles.scannerViewStyle}>
            <QRCodeScanner
              ref={qrScanref}
              onRead={qrScanSuccess}
              showMarker={true}
              cameraType={'back'}
              customMarker={
                <Image
                  style={styles.scanMarkerStyle}
                  source={require('../../Assets/Images/roundedRectangle.png')}
                  resizeMode={'contain'}
                />
              }
              cameraStyle={{marginEnd: 5}}
              flashMode={
                torch
                  ? RNCamera.Constants.FlashMode.torch
                  : RNCamera.Constants.FlashMode.off
              }
              topContent={<View />}
            />
          </View>
          <TouchableOpacity
            style={styles.headerTorchView}
            activeOpacity={0.5}
            onPress={() => setTorch(!torch)}>
            <Image
              style={styles.headerTorchIcon}
              source={require('../../Assets/Images/ic_torch_fill.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerCloseView}
            activeOpacity={0.5}
            onPress={() => setQRScan(false)}>
            <Image
              style={styles.headerCloseIcon}
              source={require('../../Assets/Images/ic_close.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </>
      )}
      {!qrScan && (
        <>
          <View style={styles.headerRowStyle}>
            <TouchableOpacity style={styles.backImageBack} onPress={() => {}}>
              {/* <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/back.png')}
          /> */}
            </TouchableOpacity>
            <Text style={styles.titleText}>
              {I18n.t('tipBusker.tip_busker')}
            </Text>
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
            {/* Curve View Container */}
            {/* <View style={styles.backCurveView} /> */}
            {/* Card View Container */}
            <View style={styles.cardViewStyle}>
              {/* Search Busker Container */}
              <View style={styles.editContainer}>
                <TextField
                  selectionColor={Colors.theme}
                  placeholder={I18n.t('tipBusker.type_busker_id')}
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
                  defaultValue={findId}
                  onChangeText={setFindId}
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                    SearchApi();
                  }}
                />

                <TouchableOpacity
                  style={styles.searchContainer}
                  onPress={() => {
                    Keyboard.dismiss();
                    SearchApi();
                  }}>
                  <Image
                    style={styles.searchIcon}
                    resizeMode={'contain'}
                    source={require('../../Assets/Images/ic_search.png')}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.findContainer}
                  onPress={() =>
                    props.navigation.navigate('FavBuskers', {type: 'tip'})
                  }>
                  <Image
                    style={styles.findIcon}
                    resizeMode={'contain'}
                    source={require('../../Assets/Images/ic_contact.png')}
                  />
                </TouchableOpacity>
              </View>

              {/* Recent Tips Container */}
              <View style={styles.tipsContainer}>
                <Text style={styles.tipsTxtStyle}>
                  {I18n.t('tipBusker.recent_tips')}
                </Text>
                {bukers.length == 0 && (
                  <Text style={styles.EmptyText}>{'No Tips Given'}</Text>
                )}
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  bounces={false}
                  overScrollMode={'never'}
                  horizontal={true}
                  contentContainerStyle={{paddingHorizontal: 5}}
                  data={bukers}
                  renderItem={({item, pos}) => rowItem(item, pos)}
                  keyExtractor={item => item.keyExtractor}
                />
              </View>

              {/* Scan Detail Container */}
              <TouchableOpacity
                style={styles.scanContainer}
                activeOpacity={0.8}
                onPress={() => checkPermission()}>
                <Text style={styles.subTxtStyle}>
                  {I18n.t('common.or_txt')}
                </Text>

                <Text style={styles.scanTxtStyle}>
                  {I18n.t('tipBusker.scan_busker_code')}
                </Text>

                <Image
                  style={styles.scanImageStyle}
                  resizeMode={'cover'}
                  source={require('../../Assets/Images/scan_code.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      {/* Filter Bottom Sheet */}
      <SwipeablePanel {...panelProps} isActive={isPanelActive}>
        <View style={{flex: 1}}>
          <View style={styles.sheet_headContainer}>
            {/* Buker Type Conatiner */}
            <Text style={styles.sheet_head_text}>
              {I18n.t('userHome.busker_found')}
            </Text>
            {findBuskers.length == 0 && (
              <Text style={styles.sheetEmptyText}>{'No Busker Found'}</Text>
            )}
            <FlatList
              showsVerticalScrollIndicator={false}
              bounces={false}
              overScrollMode={'never'}
              style={styles.sheet_list_style}
              data={findBuskers}
              renderItem={({item, pos}) => findItem(item, pos)}
              keyExtractor={item => item.keyExtractor}
            />
          </View>
        </View>
      </SwipeablePanel>

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
