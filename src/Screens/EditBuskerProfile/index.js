import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Alert,
  AsyncStorage,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import {TextField} from 'react-native-material-textfield';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import Fonts from '../../Res/Fonts';
import I18n from '../../Config/I18n';
import OpenAppSettings from 'react-native-app-settings';
import RangeSlider from 'rn-range-slider';
import ImageCropPicker from 'react-native-image-crop-picker';
import Geolocation from '@react-native-community/geolocation';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import constants from '../../Config/Constants';
import {
  timeout,
  processResponse,
  hasWhiteSpace,
} from '../../Config/CommonFunctions';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';

import Geocoder from 'react-native-geocoding';
const GOOGLE_API_KEY = 'AIzaSyC2LNQ0xw5GxnOEe19r4SL7BLY6w04kIBg';

const ForgotPassword = props => {
  const {profile, callback} = props.route.params;
  const [user, setUser] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [bio, setBio] = useState('');
  const [rate, setRate] = useState('');
  const [picUri, setPicUri] = useState('');
  const [genreId, setGenreId] = useState(0);
  const [genres, setGenres] = useState([]);
  const [otherActive, setOtherActive] = useState(false);
  const [othergenres, setOtherGenres] = useState('');
  const scrollRef = useRef(null);

  const [slideValue, setSlideValue] = useState(1);

  const [twitterUrl, setTwitter] = useState(I18n.t('artist.twit_hint'));
  const [instagramUrl, setInstagram] = useState(I18n.t('artist.insta_hint'));
  const [facebookUrl, setFacebook] = useState(I18n.t('artist.face_hint'));
  const [youtubeUrl, setYoutube] = useState(I18n.t('artist.you_hint'));
  const [soundcloudUrl, setSoundCloud] = useState(I18n.t('artist.sound_hint'));
  const [appleMusicUrl, setAppleMusic] = useState(I18n.t('artist.music_hint'));
  const [spotifyUrl, setSpotify] = useState(I18n.t('artist.spot_hint'));

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    // Initialize the module (needs to be done only once)
    Geocoder.init(GOOGLE_API_KEY, {language: 'en'});
    // Geolocation?.requestAuthorization();
    // Preload data using AsyncStorage
    AsyncStorage.getItem('UserDetails', (err, result) => {
      if (err === null) {
        let res = JSON.parse(result);
        console.log('result', res);
        setUser(res);
        //setUserData(res);
      }
    });
    setUserData(profile);
    // get genres API
    GenresApi();
  }, [GenresApi, profile]);

  const setUserData = res => {
    setName(res.name);
    setEmail(res.email);
    setPhone(res.phone);
    if (res.stagename != null) {
      setUsername(res.stagename);
    }
    if (res.address != null) {
      setLocation(res.address);
    }
    if (res.busker_bio != null) {
      setBio(res.busker_bio);
    }
    if (res.hourly_rate != null) {
      setRate(res.hourly_rate);
    }
    if (res.profile_img != null) {
      setPicUri(res.profile_img);
    }
    if (res.latitude != null) {
      setLatitude(res.latitude);
    }
    if (res.longitude != null) {
      setLongitude(res.longitude);
    }
    if (res.hire_range != null) {
      setSlideValue(res.hire_range);
    }
    if (res.genersdata != null) {
      setGenreId(res.genersdata.id);
    }
    if (res.other_cat_name != null) {
      setOtherActive(true);
      setOtherGenres(res.other_cat_name);
    }

    if (res.twitter_url != null) {
      setTwitter(res.twitter_url);
    }
    if (res.instagram_url != null) {
      setInstagram(res.instagram_url);
    }
    if (res.facebook_url != null) {
      setFacebook(res.facebook_url);
    }
    if (res.youtube_url != null) {
      setYoutube(res.youtube_url);
    }
    if (res.soundcloud_url != null) {
      setSoundCloud(res.soundcloud_url);
    }
    if (res.applemusic_url != null) {
      setAppleMusic(res.applemusic_url);
    }
    if (res.spotify_url != null) {
      setSpotify(res.spotify_url);
    }
  };

  const ChangePlace = data => {
    console.log('updated place--->2', data);
    setLocation(data);
    getCoordinates(data);
  };

  const getCoordinates = data => {
    Geocoder.from(data)
      .then(json => {
        var location = json.results[0].geometry.location;
        console.log(location);
        setLatitude(location.lat);
        setLongitude(location.lng);
      })
      .catch(error => console.log(error));
  };

  const popBack = data => {
    //AsyncStorage.setItem('UserDetails', JSON.stringify(data));
    //dispatch(addUser(data));
    setTimeout(() => {
      props.navigation.goBack();
      callback();
    }, 1000);
  };

  const selectPhotoTapped = () => {
    let options = {
      quality: 1.0,
      allowsEditing: false,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, response => {
      //console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        showAlert();
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log('response', response.assets[0].uri);
        //setPicUri(response.assets[0].uri);
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        Image.getSize(response.assets[0].uri, (width, height) => {
          console.log('dimen', width + ',' + height);
        });
        cropPhoto(response.assets[0].uri);
      }
    });
  };

  const cropPhoto = imagepath => {
    ImageCropPicker.openCropper({
      path: imagepath,
      width: 300,
      height: 300,
    }).then(image => {
      console.log(image);
      setPicUri(image.path);
    });
  };

  const showAlert = () => {
    Alert.alert(
      I18n.t('storage.storage_alert'),
      I18n.t('storage.generic_permission'),
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

  //*****************  Functions  *******************/
  const validateEmail = email => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  };

  const validateNumber = phone => {
    var re = /^[0-9\b]+$/;
    return re.test(phone);
  };

  const checkValidate = async () => {
    Keyboard.dismiss();
    if (name.length == 0) {
      toast.current.show('Please enter name', 2000, () => {});
    } else if (name.length < 3) {
      toast.current.show('Please enter valid name', 2000, () => {});
    } else if (email.length == 0) {
      toast.current.show('Please enter email', 2000, () => {});
    } else if (!validateEmail(email)) {
      toast.current.show('Please enter valid email', 2000, () => {});
    } else if (username.length == 0) {
      toast.current.show('Please enter stagename', 2000, () => {});
    } else if (phone.length == 0) {
      toast.current.show('Please enter phone number', 2000, () => {});
    } else if (phone.length < 10) {
      toast.current.show('Please enter valid phone number', 2000, () => {});
    } else if (latitude == 0 && longitude == 0) {
      toast.current.show('Please enter valid address', 2000, () => {});
    } else if (rate.length == 0) {
      toast.current.show('Please enter hourly rate', 2000, () => {});
    } else if (otherActive && othergenres.length == 0) {
      toast.current.show('Please enter other type name', 2000, () => {});
    } else if (hasWhiteSpace(instagramUrl)) {
      toast.current.show('Instagram url contain spaces', 2000, () => {});
    } else if (hasWhiteSpace(twitterUrl)) {
      toast.current.show('Twitter url contain spaces', 2000, () => {});
    } else if (hasWhiteSpace(facebookUrl)) {
      toast.current.show('Facebook url contain spaces', 2000, () => {});
    } else if (hasWhiteSpace(youtubeUrl)) {
      toast.current.show('Youtube url contain spaces', 2000, () => {});
    } else if (hasWhiteSpace(soundcloudUrl)) {
      toast.current.show('SoundCloud url contain spaces', 2000, () => {});
    } else if (hasWhiteSpace(appleMusicUrl)) {
      toast.current.show('AppleMusic url contain spaces', 2000, () => {});
    } else if (hasWhiteSpace(spotifyUrl)) {
      toast.current.show('Spotify url contain spaces', 2000, () => {});
    } else {
      //modify the object however you want to here
      let formdata = new FormData();
      formdata.append('name', name);
      formdata.append('stagename', username);
      formdata.append('phone', phone);
      formdata.append('email', email);
      formdata.append('address', location);
      formdata.append('latitude', latitude);
      formdata.append('longitude', longitude);
      formdata.append('busker_bio', bio);
      formdata.append('hourly_rate', rate);
      formdata.append('hire_range', slideValue);
      formdata.append('genre', genreId);
      if (otherActive) {
        formdata.append('other_cat_name', othergenres);
      }
      if (picUri != '' && !picUri.startsWith('https://')) {
        formdata.append('image', {
          uri: picUri,
          name: 'image.png',
          type: 'image/png',
        });
      }
      //get the access to busker links if correct
      if (
        !instagramUrl.endsWith('/') &&
        instagramUrl.startsWith('https://') &&
        instagramUrl.includes(I18n.t('artist.insta_hint'))
      ) {
        formdata.append('instagram_url', instagramUrl);
      }
      if (
        !twitterUrl.endsWith('/') &&
        twitterUrl.startsWith('https://') &&
        twitterUrl.includes(I18n.t('artist.twit_hint'))
      ) {
        formdata.append('twitter_url', twitterUrl);
      }
      if (
        !youtubeUrl.endsWith('/') &&
        youtubeUrl.startsWith('https://') &&
        youtubeUrl.includes(I18n.t('artist.you_hint'))
      ) {
        formdata.append('youtube_url', youtubeUrl);
      }
      if (
        !facebookUrl.endsWith('/') &&
        facebookUrl.startsWith('https://') &&
        facebookUrl.includes(I18n.t('artist.face_hint'))
      ) {
        formdata.append('facebook_url', facebookUrl);
      }
      if (
        !soundcloudUrl.endsWith('/') &&
        soundcloudUrl.startsWith('https://') &&
        soundcloudUrl.includes(I18n.t('artist.sound_hint'))
      ) {
        formdata.append('soundcloud_url', soundcloudUrl);
      }
      if (
        !appleMusicUrl.endsWith('/') &&
        appleMusicUrl.startsWith('https://') &&
        appleMusicUrl.includes(I18n.t('artist.music_hint'))
      ) {
        formdata.append('applemusic_url', appleMusicUrl);
      }
      if (
        !spotifyUrl.endsWith('/') &&
        spotifyUrl.startsWith('https://') &&
        spotifyUrl.includes(I18n.t('artist.spot_hint'))
      ) {
        formdata.append('spotify_url', spotifyUrl);
      }
      UpdateProfileApi(formdata);
    }
  };

  //******************** Hit Update Api *******************
  const UpdateProfileApi = async data => {
    setLoading(true);
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.buskerUpdateProfile,
    );
    console.log('Data', JSON.stringify(data));
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.buskerUpdateProfile, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.access_token}`,
        },
        body: data,
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
            toast.current.show(responseJson.message, 1000, () => {});
            popBack(data);
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

  //******************** Hit Genres Api *******************
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const GenresApi = async () => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.genreList);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.genreList, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
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
          if (responseJson.success == 'true') {
            var data = responseJson.data;
            //setGenres(data);
            data.forEach(element => {
              if (element.id == profile.genersdata.id) {
                element.state = true;
              } else {
                element.state = false;
              }
            });
            setGenres(data);
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

  const onPressCard = (item, index) => {
    let dataArray = genres;
    dataArray = dataArray.map(e => {
      if (item.id === e.id) {
        item.state = !e.state;
        return item;
      } else {
        e.state = false;
        return e;
      }
    });
    if (item.name != 'Other') {
      setOtherActive(false);
    } else {
      setOtherActive(true);
    }
    setGenres(dataArray);
    setGenreId(item.id);
  };

  const rowItem = (item, pos) => {
    return (
      <TouchableOpacity
        style={item.state ? styles.btnActiveContainer : styles.btnContainer}
        activeOpacity={0.5}
        onPress={() => onPressCard(item, pos)}>
        <Text style={item.state ? styles.btnActiveText : styles.btnText}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderThumb = useCallback(() => <View style={styles.thumbStyle} />, []);
  const renderRail = useCallback(() => <View style={styles.railStyle} />, []);
  const renderRailSelected = useCallback(
    () => <View style={styles.railColorStyle} />,
    [],
  );
  const renderLabel = useCallback(
    value => (
      <View style={styles.labelContainer}>
        <Text style={styles.labelStyle}>{value}</Text>
      </View>
    ),
    [],
  );

  const formatNumber = text => {
    return text.replace(/[^+\d]/g, '');
  };

  const formatText = text => {
    return text.replace(/[^a-zA-Z\s]/g, '');
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
        <Text style={styles.titleText}>{I18n.t('common.edit_profile')}</Text>
        <TouchableOpacity
          style={styles.saveContainer}
          onPress={() => checkValidate()}>
          <Text style={styles.saveText}>{I18n.t('common.save_btn')}</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        style={styles.viewStyle}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          ref={scrollRef}
          style={styles.viewStyle}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps={'handled'}
          overScrollMode="never">
          <View style={styles.profileContainer}>
            <Image
              source={require('../../Assets/Images/profileImage.png')}
              style={styles.profileImage}
              resizeMode={'cover'}
            />
            <Image
              style={[styles.profileImage, {position: 'absolute'}]}
              source={
                picUri != null && picUri != ''
                  ? {uri: picUri}
                  : require('../../Assets/Images/profileImage.png')
              }
              resizeMode={'cover'}
            />
            <TouchableOpacity
              style={styles.editImageStyle}
              onPress={() => selectPhotoTapped()}>
              <Image
                style={styles.editImage}
                source={require('../../Assets/Images/ic_edit.png')}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('artist.artist_name')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              style={{fontFamily: Fonts.MontserratRegular, color: Colors.black}}
              keyboardType={'default'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              defaultValue={name}
              onChangeText={setName}
              formatText={text => formatText(text)}
            />
            <Image
              style={styles.inputIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_user.png')}
            />
          </View>

          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('artist.artist_username')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              maxLength={40}
              style={{fontFamily: Fonts.MontserratRegular, color: Colors.black}}
              keyboardType={'default'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              defaultValue={username}
              onChangeText={setUsername}
            />
            <Image
              style={styles.inputIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_tag.png')}
            />
          </View>

          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('artist.artist_email')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              maxLength={30}
              style={{fontFamily: Fonts.MontserratRegular, color: Colors.grey}}
              keyboardType={'email-address'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              defaultValue={email}
              autoCorrect={false}
              editable={false}
              onChangeText={setEmail}
            />
            <Image
              style={styles.inputIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_mail.png')}
            />
          </View>

          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('artist.artist_phone')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              maxLength={10}
              style={{fontFamily: Fonts.MontserratRegular, color: Colors.black}}
              keyboardType={'phone-pad'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              defaultValue={phone}
              onChangeText={setPhone}
              formatText={text => formatNumber(text)}
            />
            <Image
              style={styles.inputIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_phone.png')}
            />
          </View>

          <TouchableOpacity
            style={styles.editContainer}
            onPress={() =>
              props.navigation.navigate('GooglePlaces', {
                onPlaceSelect: ChangePlace,
              })
            }>
            <TextField
              selectionColor={Colors.theme}
              //placeholder={I18n.t('artist.artist_location')}
              //placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              style={{fontFamily: Fonts.MontserratRegular, color: Colors.black}}
              keyboardType={'default'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              editable={false}
              //defaultValue={location}
              //onChangeText={setLocation}
            />
            <Text
              style={{
                position: 'absolute',
                fontSize: 16,
                fontFamily: Fonts.MontserratRegular,
                color: location == '' ? Colors.grey : Colors.black,
                paddingRight: 5,
                paddingStart: 30,
                top: 10,
              }}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {location == '' ? I18n.t('artist.artist_location') : location}
            </Text>
            <Image
              style={styles.inputIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_location.png')}
            />
          </TouchableOpacity>

          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('artist.artist_bio')}
              placeholderTextColor={Colors.grey}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              maxLength={150}
              style={{
                fontFamily: Fonts.MontserratRegular,
                color: Colors.black,
              }}
              inputContainerStyle={styles.inputContainer}
              keyboardType={'default'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              defaultValue={bio}
              onChangeText={setBio}
              // multiline={true}
              // numberOfLines={4}
              // onFocus={() =>
              //   scrollRef.current.scrollTo({x: 0, y: 200, animated: true})
              // }
            />
            <Image
              style={styles.inputIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_bio.png')}
            />
          </View>

          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('artist.artist_rate')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              maxLength={3}
              style={{fontFamily: Fonts.MontserratRegular, color: Colors.black}}
              keyboardType={'numeric'}
              returnKeyLabel={'Done'}
              returnKeyType={'done'}
              defaultValue={rate}
              onChangeText={setRate}
              formatText={text => formatNumber(text)}
            />
            <Image
              style={styles.inputIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_coin.png')}
            />
            <Text style={styles.hourTextStyle}>
              {I18n.t('artist.per_hour')}
            </Text>
          </View>

          {/* Distance Range Conatiner */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.sliderHeadTxt}>
              {I18n.t('artist.hire_range')}
            </Text>
            <Text style={[styles.distanceRowText, {top: 10}]}>
              {'(' + slideValue + ')'}
            </Text>
          </View>
          <RangeSlider
            style={styles.sliderStyle}
            gravity={'center'}
            min={5}
            max={500}
            step={5}
            low={slideValue}
            disableRange={true}
            renderThumb={renderThumb}
            renderRail={renderRail}
            renderRailSelected={renderRailSelected}
            renderLabel={renderLabel}
            onValueChanged={(low, high, fromUser) => {
              setSlideValue(low);
            }}
          />
          <View style={styles.distanceRowContainer}>
            <Text style={styles.distanceRowText}>{'5 Miles or Less'}</Text>
            <Text style={styles.distanceRowText}>{'500 Miles or Less'}</Text>
          </View>

          <Text style={styles.headerTxtStyle}>{I18n.t('artist.genres')}</Text>
          <View style={styles.cardViewStyle}>
            <FlatList
              showsVerticalScrollIndicator={false}
              bounces={false}
              overScrollMode={'never'}
              style={{alignSelf: 'center'}}
              data={genres}
              numColumns={3}
              renderItem={({item, pos}) => rowItem(item, pos)}
              keyExtractor={item => item.keyExtractor}
            />
          </View>
          {otherActive && (
            <>
              <Text style={styles.headerTxtStyle}>
                {I18n.t('artist.artist_other')}
              </Text>
              <View style={styles.cardViewStyle}>
                <View
                  style={[
                    styles.editContainer,
                    {marginTop: -15, marginBottom: 10},
                  ]}>
                  <TextField
                    selectionColor={Colors.theme}
                    placeholder={I18n.t('artist.artist_type')}
                    placeholderTextColor={Colors.grey}
                    inputContainerStyle={styles.inputContainer}
                    tintColor={Colors.theme}
                    labelFontSize={0}
                    fontSize={16}
                    style={{
                      fontFamily: Fonts.MontserratRegular,
                      color: Colors.black,
                    }}
                    keyboardType={'default'}
                    returnKeyLabel={'Done'}
                    returnKeyType={'done'}
                    defaultValue={othergenres}
                    onChangeText={setOtherGenres}
                  />
                  <Image
                    style={styles.inputIcon}
                    resizeMode={'contain'}
                    source={require('../../Assets/Images/ic_category.png')}
                  />
                </View>
              </View>
            </>
          )}
          <Text style={styles.headerTxtStyle}>
            {I18n.t('artist.social_links')}
          </Text>
          <View style={styles.socialCardView}>
            <View style={styles.socialEditContainer}>
              <TextField
                selectionColor={Colors.theme}
                placeholder={I18n.t('artist.insta_hint')}
                inputContainerStyle={styles.socialInputContainer}
                tintColor={Colors.theme}
                labelFontSize={0}
                fontSize={16}
                style={{
                  fontFamily: Fonts.MontserratRegular,
                  color: Colors.black,
                }}
                keyboardType={'default'}
                returnKeyLabel={'Done'}
                returnKeyType={'done'}
                defaultValue={instagramUrl}
                onChangeText={setInstagram}
              />
              <Image
                style={styles.socialInputIcon}
                resizeMode={'contain'}
                source={require('../../Assets/Images/instagram_logo.png')}
              />
            </View>
            <View style={styles.socialEditContainer}>
              <TextField
                selectionColor={Colors.theme}
                placeholder={I18n.t('artist.twit_hint')}
                inputContainerStyle={styles.socialInputContainer}
                tintColor={Colors.theme}
                labelFontSize={0}
                fontSize={16}
                style={{
                  fontFamily: Fonts.MontserratRegular,
                  color: Colors.black,
                }}
                keyboardType={'default'}
                returnKeyLabel={'Done'}
                returnKeyType={'done'}
                defaultValue={twitterUrl}
                onChangeText={setTwitter}
              />
              <Image
                style={styles.socialInputIcon}
                resizeMode={'contain'}
                source={require('../../Assets/Images/twitter_logo.png')}
              />
            </View>

            <View style={styles.socialEditContainer}>
              <TextField
                selectionColor={Colors.theme}
                placeholder={I18n.t('artist.face_hint')}
                inputContainerStyle={styles.socialInputContainer}
                tintColor={Colors.theme}
                labelFontSize={0}
                fontSize={16}
                style={{
                  fontFamily: Fonts.MontserratRegular,
                  color: Colors.black,
                }}
                keyboardType={'default'}
                returnKeyLabel={'Done'}
                returnKeyType={'done'}
                defaultValue={facebookUrl}
                onChangeText={setFacebook}
              />
              <Image
                style={styles.socialInputIcon}
                resizeMode={'contain'}
                source={require('../../Assets/Images/facebook_logo.png')}
              />
            </View>

            <View style={styles.socialEditContainer}>
              <TextField
                selectionColor={Colors.theme}
                placeholder={I18n.t('artist.you_hint')}
                inputContainerStyle={styles.socialInputContainer}
                tintColor={Colors.theme}
                labelFontSize={0}
                fontSize={16}
                style={{
                  fontFamily: Fonts.MontserratRegular,
                  color: Colors.black,
                }}
                keyboardType={'default'}
                returnKeyLabel={'Done'}
                returnKeyType={'done'}
                defaultValue={youtubeUrl}
                onChangeText={setYoutube}
              />
              <Image
                style={styles.socialInputIcon}
                resizeMode={'contain'}
                source={require('../../Assets/Images/youtube_logo.png')}
              />
            </View>

            <View style={styles.socialEditContainer}>
              <TextField
                selectionColor={Colors.theme}
                placeholder={I18n.t('artist.sound_hint')}
                inputContainerStyle={styles.socialInputContainer}
                tintColor={Colors.theme}
                labelFontSize={0}
                fontSize={16}
                style={{
                  fontFamily: Fonts.MontserratRegular,
                  color: Colors.black,
                }}
                keyboardType={'default'}
                returnKeyLabel={'Done'}
                returnKeyType={'done'}
                defaultValue={soundcloudUrl}
                onChangeText={setSoundCloud}
              />
              <Image
                style={styles.socialInputIcon}
                resizeMode={'contain'}
                source={require('../../Assets/Images/soundcloud_logo.png')}
              />
            </View>

            <View style={styles.socialEditContainer}>
              <TextField
                selectionColor={Colors.theme}
                placeholder={I18n.t('artist.music_hint')}
                inputContainerStyle={styles.socialInputContainer}
                tintColor={Colors.theme}
                labelFontSize={0}
                fontSize={16}
                style={{
                  fontFamily: Fonts.MontserratRegular,
                  color: Colors.black,
                }}
                keyboardType={'default'}
                returnKeyLabel={'Done'}
                returnKeyType={'done'}
                defaultValue={appleMusicUrl}
                onChangeText={setAppleMusic}
              />
              <Image
                style={styles.socialInputIcon}
                resizeMode={'contain'}
                source={require('../../Assets/Images/music_logo.png')}
              />
            </View>

            <View style={styles.socialEditContainer}>
              <TextField
                selectionColor={Colors.theme}
                placeholder={I18n.t('artist.spot_hint')}
                inputContainerStyle={styles.socialInputContainer}
                tintColor={Colors.theme}
                labelFontSize={0}
                fontSize={16}
                style={{
                  fontFamily: Fonts.MontserratRegular,
                  color: Colors.black,
                }}
                keyboardType={'default'}
                returnKeyLabel={'Done'}
                returnKeyType={'done'}
                defaultValue={spotifyUrl}
                onChangeText={setSpotify}
              />
              <Image
                style={styles.socialInputIcon}
                resizeMode={'contain'}
                source={require('../../Assets/Images/spotify_logo.png')}
              />
            </View>
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

export default ForgotPassword;
