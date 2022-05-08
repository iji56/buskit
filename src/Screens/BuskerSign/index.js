import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  Platform,
  Dimensions,
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
import QRCode from 'react-native-qrcode-svg';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import OpenAppSettings from 'react-native-app-settings';
import RNImageToPdf from 'react-native-image-to-pdf';
import ViewShot, {captureRef} from 'react-native-view-shot';

import {Svg, Path} from 'react-native-svg';
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

import {useSelector, useDispatch} from 'react-redux';

const Home = props => {
  const [user, setUser] = useState('');
  const [buskerId, setBuskerId] = useState('');
  const [buskerName, setBuskerName] = useState('');

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);
  const viewRef = useRef(null);
  const qrRef = useRef(null);
  const [valueQRCode, setValueQRCode] = useState('NA');

  const userData = useSelector(state => user.state);

  useEffect(() => {
    // Preload data using AsyncStorage
    AsyncStorage.getItem('UserDetails', (err, result) => {
      if (err === null) {
        let res = JSON.parse(result);
        setUser(res);
        setBuskerId(res.busker_unique_id);
        setBuskerName(res.name);
        QrCodeValue(res);
      }
    });
  }, []);

  const QrCodeValue = user => {
    setValueQRCode(
      JSON.stringify({
        busker_id: user.id,
        busker_name: user.name,
      }),
    );
  };

  const checkPermission = () => {
    check(
      Platform.OS === 'ios'
        ? takeScreenRef() //getDataURL()
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
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
            takeScreenRef();
            //getDataURL();
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
        ? PERMISSIONS.IOS.MEDIA_LIBRARY
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
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
            takeScreenRef();
            //getDataURL();
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            showAlert();
            break;
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        toast.current.show(err.message, 2000, () => {});
      });
  };

  const showAlert = () => {
    Alert.alert(
      I18n.t('storage.storage_alert'),
      I18n.t('storage.storage_permission'),
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

  // get base64 string encode of the qrcode (currently logo is not included)
  const getDataURL = () => {
    setLoading(true);
    qrRef.current.toDataURL(data => {
      console.log('data->', data);
      // var image = new Image();
      // image.src = `data:image/png;base64,${data}`;
      RNFS.writeFile(RNFS.CachesDirectoryPath + '/BuskerId.png', data, 'base64')
        .then(success => {
          setLoading(false);
          return CameraRoll.saveToCameraRoll(
            RNFS.CachesDirectoryPath + '/BuskerId.png',
            'photo',
          );
        })
        .then(() => {
          setLoading(false);
          toast.current.show('Saved to gallery!', 2000, () => {});
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
          // toast.current.show(err.message, 2000, () => {});
        })
        .finally(() => {
          myAsyncPDFFunction(RNFS.CachesDirectoryPath + '/BuskerId.png');
        });
    });
  };

  const myAsyncPDFFunction = async path => {
    try {
      // let base64Paths = [];
      // base64Paths.length = 0;
      // base64Paths.push(`data:image/jpeg;base64,${data}`);
      const options = {
        imagePaths: [path],
        name: Platform.OS == 'ios' ? 'BuskerId' : 'BuskerId.pdf',
      };
      const pdf = await RNImageToPdf.createPDFbyImages(options);
      setLoading(false);
      console.log('file done', pdf.filePath);
    } catch (e) {
      setLoading(false);
      console.log('pdf error', e);
    }
  };

  //handler to take scren ref
  const takeScreenRef = () => {
    captureRef(viewRef, {
      format: 'jpg',
      quality: 0.8,
      result: 'base64',
    }).then(
      //callback function to get the result URL of the screnref
      uri => {
        console.log('Image saved ', uri);
        RNFS.writeFile(
          RNFS.CachesDirectoryPath + '/BuskerScan.png',
          uri,
          'base64',
        )
          .then(success => {
            return CameraRoll.saveToCameraRoll(
              RNFS.CachesDirectoryPath + '/BuskerScan.png',
              'photo',
            );
          })
          .then(() => {
            toast.current.show('Saved to gallery!', 2000, () => {});
          })
          .catch(err => {
            console.log(err);
          });
      },
      error => {
        console.error('Oops, snapshot failed', error);
      },
    );
  };

  //function for image capture modes in ViewShot
  const onCaptureSuccess = uri => {
    console.log('capture uri ', uri);
  };
  const onCaptureFailure = error => {
    console.log('error code ', error);
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
        <Text style={styles.titleText}>{I18n.t('buskerSign.my_sign')}</Text>
        <View style={styles.backImageBack} />
      </View>
      <ScrollView
        style={styles.viewStyle}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never">
        {/* Curve View Container */}
        {/* <View style={styles.backCurveView}>
          <Text style={styles.headerMsgText}>
            {I18n.t('buskerSign.tip_msg')}
          </Text>
        </View> */}
        {/* <Svg width={viewportWidth} height="40" >
          <Path
            d="M 10 10 C 400 200, 40 20, 50 10"
            stroke={Colors.theme}
            fill={Colors.theme}
          />
        </Svg> */}
        <ViewShot
          ref={viewRef}
          style={styles.viewStyle}
          onCapture={() => onCaptureSuccess()}
          onCaptureFailure={() => onCaptureFailure()}>
          <Image
            style={styles.logoStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/buskit_login.png')}
          />
          <View style={styles.imageStyle}>
            <QRCode
              //ref={qrRef}
              getRef={qrRef}
              value={valueQRCode}
              size={150}
              color={Colors.skmiBlue}
            />
          </View>
          <Text style={styles.nameTxtStyle}>{buskerName}</Text>
          {/* <Text style={styles.subTxtStyle}>{I18n.t('common.or_txt')}</Text> */}
          <View style={styles.rowIdContainer}>
            <Text style={styles.idSubTxtStyle}>
              {I18n.t('buskerSign.user_id')}
            </Text>
            <Text style={styles.idTxtStyle}>{buskerId}</Text>
          </View>
          <Text style={styles.payHeadTxtStyle}>
            {I18n.t('buskerSign.payment_options')}
          </Text>

          <View style={styles.payRowStyle}>
            <View style={styles.payContainer}>
              <Image
                style={styles.payIconStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_mastercard.png')}
              />
            </View>
            <View style={styles.payContainer}>
              <Image
                style={styles.payIconStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_visa.png')}
              />
            </View>
            <View style={styles.payContainer}>
              <Image
                style={styles.payIconStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_american_express.png')}
              />
            </View>
          </View>
          <View style={[styles.payContainer, {marginBottom: 40}]}>
            <Image
              style={styles.payIconStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/paypal.png')}
            />
          </View>
        </ViewShot>

        <TouchableOpacity
          style={styles.btnContainer}
          activeOpacity={0.5}
          onPress={() => checkPermission()}>
          <Text style={styles.btnText}>{I18n.t('buskerSign.print_code')}</Text>
        </TouchableOpacity>
      </ScrollView>
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
