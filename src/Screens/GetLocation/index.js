import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  StatusBar,
  Alert,
  AsyncStorage,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import Fonts from '../../Res/Fonts';
import I18n from '../../Config/I18n';
import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';

import OpenAppSettings from 'react-native-app-settings';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const GOOGLE_API_KEY = 'AIzaSyCPFefUcKipTLsFZHXXnx4RuFOX6E-z91M';

const GetLocation = props => {
  const {callback} = props.route.params;
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const googleView = useRef();
  const googleInput = useRef();
  const [value, setValue] = useState('');

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    // Initialize the module (needs to be done only once)
    Geocoder.init(GOOGLE_API_KEY, {language: 'en'});
    // Geolocation?.requestAuthorization();
    // Preload data using AsyncStorage
    AsyncStorage.getItem('AccessToken', (err, result) => {
      if (err === null) {
        let res = JSON.parse(result);
      }
    });
  }, []);

  const setSubmit = () => {
    googleView.current?.setAddressText(value);
    googleView.current?.focus;
    googleInput.current.focus();
  };

  const getLocation = () => {
    setLoading(true);
    // Getting the current location
    Geolocation.getCurrentPosition(
      position => {
        setLoading(false);
        const initialPosition = JSON.stringify(position);
        console.log('position', initialPosition);
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        getAddress(position.coords.latitude, position.coords.longitude);
      },
      error => {
        setLoading(false);
        const locError = JSON.stringify(error);
        console.log('loc error', locError);
        showAlert(error.code);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        //maximumAge: 1000,
        distanceFilter: 10,
        useSignificantChanges: true,
      },
    );
  };

  const getAddress = (lat, lng) => {
    Geocoder.from(lat, lng)
      .then(json => {
        var addressComponent = json.results[0];
        console.log(JSON.stringify(addressComponent));
        callback(addressComponent.formatted_address, lat, lng);
        props.navigation.goBack(null);
      })
      .catch(error => console.log(error));
  };

  const getCoordinates = data => {
    Geocoder.from(data)
      .then(json => {
        var location = json.results[0].geometry.location;
        console.log(location);
        setLatitude(location.lat);
        setLongitude(location.lng);
        callback(data, location.lat, location.lng);
        props.navigation.goBack(null);
      })
      .catch(error => console.log(error));
  };

  const showAlert = type => {
    if (type === 1) {
      Alert.alert(
        'Location Alert',
        'It seems location permission was not granted. Please go to settings and allow permission',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
          },
          {
            text: 'Open Settings',
            onPress: () => {
              showAlert(2);
              OpenAppSettings.open();
            },
          },
        ],
      );
    } else {
      Alert.alert(
        'Location Alert',
        'No location provider available. Please enable your location services from settings.',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
          },
          {text: 'Fetch Again', onPress: () => getLocation()},
        ],
      );
    }
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
        <Text style={styles.titleText}>{I18n.t('location.header_txt')}</Text>
        <View style={styles.backImageBack} />
      </View>
      <KeyboardAvoidingView style={styles.viewStyle}>
        <ScrollView
          style={styles.viewStyle}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps={'always'}
          overScrollMode="never">
          <Text style={styles.headerText}>
            {I18n.t('location.where_you_are')}
          </Text>

          <Text style={styles.messageText}>
            {I18n.t('location.location_msg')}
          </Text>

          <TouchableOpacity
            style={styles.btnContainer}
            activeOpacity={0.5}
            onPress={() => {
              getLocation();
            }}>
            <Text style={styles.btnText}>
              {I18n.t('location.find_location')}
            </Text>
          </TouchableOpacity>

          <View style={styles.connectContainer}>
            <View style={styles.connectDivider} />
            <Text style={styles.connectText}>
              {I18n.t('location.connect_with')}
            </Text>
            <View style={styles.connectDivider} />
          </View>

          <View style={styles.editContainer}>
            <GooglePlacesAutocomplete
              placeholder={I18n.t('location.enter_address')}
              ref={googleView}
              minLength={3}
              autoFocus={false}
              returnKeyType={'default'}
              listViewDisplayed={true} // true/false/undefined
              //fetchDetails={true}
              query={{
                key: GOOGLE_API_KEY,
                language: 'en',
              }}
              onPress={(data, details = null) => {
                console.log(
                  JSON.stringify(data) + '----->',
                  JSON.stringify(details),
                );
                getCoordinates(details.description);
              }}
              onFail={error => console.log(error)}
              filterReverseGeocodingByTypes={[
                'locality',
                'administrative_area_level_3',
              ]}
              styles={{
                textInputContainer: styles.placesInputContainer,
                textInput: styles.placesInputText,
                poweredContainer: styles.poweredContainer,
              }}
              textInputProps={{
                ref: googleInput,
                onChangeText: setValue,
                onSubmitEditing: setSubmit,
                blurOnSubmit: false,
              }}
            />
            <Image
              style={styles.editIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_location.png')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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

export default GetLocation;
