import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  Alert,
  Keyboard,
  AsyncStorage,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import {TextField} from 'react-native-material-textfield';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import Fonts from '../../Res/Fonts';
import I18n from '../../Config/I18n';
import Moment from 'moment';
import OpenAppSettings from 'react-native-app-settings';
import ImageCropPicker from 'react-native-image-crop-picker';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';

import Geocoder from 'react-native-geocoding';
const GOOGLE_API_KEY = 'AIzaSyC2LNQ0xw5GxnOEe19r4SL7BLY6w04kIBg';

const NewEvent = props => {
  const {eventItem} = props.route.params;
  const [user, setUser] = useState('');
  const [eventId, setEventId] = useState(0);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventStDate, setEventStDate] = useState('');
  const [eventEdDate, setEventEdDate] = useState('');
  const [eventStTime, setEventStTime] = useState('');
  const [eventEdTime, setEventEdTime] = useState('');
  const [dateType, setDateType] = useState(1);
  const [timeType, setTimeType] = useState(1);
  const [dateVisibility, setDateVisibility] = useState(false);
  const [timeVisibility, setTimeVisibility] = useState(false);
  const [picUri, setPicUri] = useState('');
  const [images, setImages] = useState([]);
  const [maxFiles, setMaxFiles] = useState(5);

  const [eventLoc, setEventLoc] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    // Initialize the module (needs to be done only once)
    Geocoder.init(GOOGLE_API_KEY, {language: 'en'});
    // Preload data using AsyncStorage
    AsyncStorage.getItem('UserDetails', (err, result) => {
      if (err === null) {
        let res = JSON.parse(result);
        setUser(res);
      }
    });
    if (eventItem != null) {
      setEventData(eventItem);
      setImages(eventItem.event_gallery);
      setMaxFiles(5 - eventItem.event_gallery.length);
    }
  }, []);

  const ChangePlace = data => {
    console.log('updated place--->4', data);
    // if (data.includes(', USA')) setEventLoc(data.replace(', USA', ''));
    // else setEventLoc(data);
    // getCoordinates(data);
  };

  const getCoordinates = data => {
    Geocoder.from(data)
      .then(json => {
        var location = json.results[0].geometry.location;
        console.log(location);
        setLatitude(location.lat);
        setLongitude(location.lng);
        //GoToMaps(location.lat, location.lng);
      })
      .catch(error => console.log(error));
  };

  const setEventData = item => {
    setEventId(item.id);
    setEventTitle(item.event_name);
    setEventDesc(item.description);
    setEventLoc(item.address);
    setLatitude(item.latitude);
    setLongitude(item.longitude);
    setEventStDate(item.event_date);
    setEventEdDate(item.event_end_date);
    setEventStTime(Moment(item.start_time, 'hh:mm A').toDate());
    setEventEdTime(Moment(item.end_time, 'hh:mm A').toDate());
    setPicUri(item.banner_image);
  };

  // const MapPlace = data => {
  //   console.log('updated place--->5', data);
  // };
  // const GoToMaps = (lat, lng) => {
  //   props.navigation.navigate('GooglePointer', {
  //     lat: lat,
  //     lng: lng,
  //   });
  // };

  const hideDateDialog = () => {
    setDateVisibility(false);
  };
  const handleDateConfirm = date => {
    hideDateDialog();
    if (dateType == 1) {
      if (eventEdDate == '') {
        setEventStDate(date);
      } else {
        if (date > eventEdDate)
          toast.current.show('Start Date should be smaller', 2000, () => {});
        else {
          setEventStDate(date);
          setEventStTime('');
          setEventEdTime('');
        }
      }
    } else {
      if (date < eventStDate)
        toast.current.show('End date should be greater', 2000, () => {});
      else {
        setEventEdDate(date);
        setEventStTime('');
        setEventEdTime('');
      }
    }
  };

  const hideTimeDialog = () => {
    setTimeVisibility(false);
  };
  const handleTimeConfirm = time => {
    hideTimeDialog();
    if (timeType === 1) {
      if (eventEdTime == '') {
        checkCurrentDateTime(time);
      } else {
        checkStartTime(time);
      }
    } else {
      checkEndTime(time);
    }
  };

  const checkCurrentDateTime = time => {
    if (Moment(eventStDate).format('ll') === Moment(new Date()).format('ll')) {
      if (time < new Date().getTime())
        toast.current.show(
          'Start Time should be greater than current time',
          2000,
          () => {},
        );
      else setEventStTime(time);
    } else setEventStTime(time);
  };

  const checkStartTime = time => {
    if (Moment(eventStDate).format('ll') === Moment(eventEdDate).format('ll')) {
      if (time >= eventEdTime)
        toast.current.show('Start Time should be smaller', 2000, () => {});
      else setEventStTime(time);
    } else {
      setEventStTime(time);
    }
  };

  const checkEndTime = time => {
    if (Moment(eventStDate).format('ll') === Moment(eventEdDate).format('ll')) {
      if (time <= eventStTime)
        toast.current.show('End Time should be greater', 2000, () => {});
      else setEventEdTime(time);
    } else {
      setEventEdTime(time);
    }
  };

  const selectPhotoTapped = type => {
    let options = {
      quality: 1.0,
      allowsEditing: false,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        showAlert();
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log('response', response.assets[0].uri);
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        Image.getSize(response.assets[0].uri, (width, height) => {
          console.log('dimen', width + ',' + height);
        });
        if (type == 'banner') setPicUri(response.assets[0].uri);
        else addImageInput(images.length, response.assets[0].uri);
      }
    });
  };

  const selectMultiplePhoto = () => {
    console.log('max Files', maxFiles);
    ImageCropPicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      maxFiles: maxFiles, // work only for ios
    })
      .then(imageObjects => {
        // this check for android and ios for setting images
        if (imageObjects.length > 5 || imageObjects.length > maxFiles) {
          toast.current.show('Cannot Upload more than 5', 2000, () => {});
        } else if (imageObjects.length <= maxFiles) {
          console.log(imageObjects);
          imageObjects.forEach(element => {
            addImageInput(images.length, element.path);
          });
          // this check is only for ios
          setMaxFiles(maxFiles - imageObjects.length);
        }
      })
      .catch(err => {
        console.log(err.message);
        if (err.message != 'User cancelled image selection') showAlert();
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

  //function to add imageInput dynamically
  const addImageInput = (index, UriData) => {
    let input = images;
    let dict = {id: index, gallery: UriData};
    input.push(dict);
    setImages([...input]);
    //console.log('data', input);
  };

  //function to add text from imageInputs into single array
  const addValues = (index, uri) => {
    let dataArray = images;
    let checkBool = false;
    if (dataArray.length !== 0) {
      dataArray.forEach(element => {
        if (element.index === index) {
          element.uri = uri;
          checkBool = true;
        }
      });
    }
    if (checkBool) {
      setImages([...images, ...dataArray]);
    } else {
      dataArray.push({id: index, uri: uri});
      setImages([...images, ...dataArray]);
    }
    console.log('data', dataArray);
  };

  const checkValidate = async () => {
    // else if (picUri == '') {
    //   toast.current.show('Please select event banner', 2000, () => {});
    // }
    Keyboard.dismiss();
    if (eventTitle.length == 0) {
      toast.current.show('Please enter event name', 2000, () => {});
    } else if (eventDesc.length == 0) {
      toast.current.show('Please enter event description', 2000, () => {});
    } else if (eventLoc.length == 0) {
      toast.current.show('Please enter event location', 2000, () => {});
    } else if (eventStDate.length == 0) {
      toast.current.show('Please enter event start date', 2000, () => {});
    } else if (eventEdDate.length == 0) {
      toast.current.show('Please enter event end date', 2000, () => {});
    } else if (eventStTime.length == 0) {
      toast.current.show('Please enter event start time', 2000, () => {});
    } else if (eventEdTime.length == 0) {
      toast.current.show('Please enter event end time', 2000, () => {});
    } else {
      //modify the object however you want to here
      let formdata = new FormData();
      if (eventItem != null) {
        formdata.append('event_id', eventId);
      }
      formdata.append('event_name', eventTitle);
      formdata.append('event_description', eventDesc);
      formdata.append('event_location', eventLoc);
      formdata.append('event_date', Moment(eventStDate).format('YYYY-MM-DD'));
      formdata.append(
        'event_end_date',
        Moment(eventEdDate).format('YYYY-MM-DD'),
      );
      formdata.append('start_time', Moment(eventStTime).format('hh:mm A'));
      formdata.append('end_time', Moment(eventEdTime).format('hh:mm A'));
      formdata.append('latitude', latitude);
      formdata.append('longitude', longitude);
      if (picUri != '' && !picUri.includes('https://')) {
        formdata.append('banner', {
          uri: picUri,
          name: 'image.png',
          type: 'image/png',
        });
      }

      //follow the api with event create or update
      if (eventItem == null) NewEventApi(formdata);
      else UpdateEventApi(formdata);
    }
  };

  //******************** Hit New Event Api *********************
  const NewEventApi = async data => {
    setLoading(true);
    console.log('data', JSON.stringify(data));
    console.log('ApiCall', constants.baseUrl + constants.api.buskerNewEvent);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.buskerNewEvent, {
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
            toast.current.show(responseJson.message, 2000, () => {});
            //props.navigation.goBack();
            UploadGalleryApi(data.id);
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

  //******************** Hit Update Event Api *******************
  const UpdateEventApi = async data => {
    setLoading(true);
    console.log('data', JSON.stringify(data));
    console.log('ApiCall', constants.baseUrl + constants.api.updateEvent);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.updateEvent, {
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
            toast.current.show(responseJson.message, 2000, () => {});
            //props.navigation.goBack();
            UploadGalleryApi(data.id);
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

  //******************** Hit Upload Gallery Api *******************
  const UploadGalleryApi = async event_id => {
    let formdata = new FormData();
    formdata.append('event_id', event_id);
    if (images.length != '') {
      //!picUri.startsWith('https://')
      images.forEach(element => {
        if (!element.gallery.startsWith('https://'))
          formdata.append('image[]', {
            uri: element.gallery,
            name: 'image.png',
            type: 'image/png',
          });
      });
    }
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.uploadEventGallery,
    );
    console.log('Data', JSON.stringify(formdata));
    props.navigation.goBack();
    timeout(
      60 * 10000,
      fetch(constants.baseUrl + constants.api.uploadEventGallery, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.access_token}`,
        },
        body: formdata,
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
            toast.current.show(responseJson.message, 2000, () => {});
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

  //******************** Hit Delete Gallery Api ***********************
  const GalleryDeleteApi = async item => {
    let data = {
      event_gallery_id: item.id,
    };
    setLoading(true);
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.deleteEventGallery,
    );
    console.log('galleryId', data);
    timeout(
      10000,
      fetch(
        constants.baseUrl +
          constants.api.deleteEventGallery +
          '?event_gallery_id=' +
          item.id,
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
    let dataBuskers = images;
    let index = dataBuskers.indexOf(item);
    console.log('pos', index);
    if (index !== -1) {
      if (index == 0 && images.length == 1) {
        setImages([]);
      } else {
        dataBuskers.splice(index, 1); //to remove a single item starting at index
        setImages([...dataBuskers]);
      }
    }
    setMaxFiles(maxFiles + 1);
  };

  //function to remove imageInput dynamically
  const removeImageInput = value => {
    let inputData = images;
    var pos = inputData.findIndex(item => item.uri === value.uri);
    if (pos !== -1) inputData.splice(pos, 1);
    setImages([...inputData]);
  };

  // Row Component for Gallery
  // const galleryItem = (item, pos) => {
  //   return (
  //     <View>
  //       <TouchableOpacity
  //         style={styles.rowImageContainer}
  //         activeOpacity={0.8}
  //         onPress={() => {
  //           props.navigation.navigate('FullImage', {imageURL: item.image});
  //         }}>
  //         <View style={styles.rowImageView}>
  //           <Image
  //             style={styles.rowImageView}
  //             resizeMode={'cover'}
  //             source={require('../../Assets/Images/thumbImage.png')}
  //           />
  //           <Image
  //             style={[styles.rowImageView, {position: 'absolute'}]}
  //             resizeMode={'cover'}
  //             source={{
  //               uri: item.image,
  //             }}
  //           />
  //         </View>
  //       </TouchableOpacity>

  //       <TouchableOpacity
  //         style={styles.rowCloseBack}
  //         activeOpacity={0.8}
  //         onPress={() => {
  //           if (eventItem != null) GalleryDeleteApi(item);
  //         }}>
  //         <Image
  //           style={styles.rowCloseImage}
  //           resizeMode={'contain'}
  //           source={require('../../Assets/Images/ic_close.png')}
  //         />
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

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
        <Text style={styles.titleText}>{I18n.t('newEvent.new_event')}</Text>
        <View style={styles.backImageBack} />
      </View>
      <KeyboardAvoidingView
        style={styles.viewStyle}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.viewStyle}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps={'always'}
          //listViewDisplayed={false}
          overScrollMode="never">
          <TouchableOpacity
            style={styles.ImageConatiner}
            activeOpacity={0.8}
            onPress={() => {
              selectPhotoTapped('banner');
            }}>
            <Image
              style={styles.imageStyle}
              resizeMode={'cover'}
              source={
                picUri != null && picUri != ''
                  ? {uri: picUri}
                  : require('../../Assets/Images/thumbImage.png')
              }
            />
            <View style={styles.blurStyle}>
              <Image
                style={[styles.blurAddStyle]}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_add.png')}
              />
              <Text style={styles.blurTextStyle}>{'Add Event Banner'}</Text>
            </View>
          </TouchableOpacity>

          <ScrollView
            contentContainerStyle={{
              paddingStart: 10,
              paddingEnd: 10,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            overScrollMode={'never'}
            bounces={false}>
            <View style={styles.imageContainer}>
              {images.map(item => {
                return (
                  <View>
                    <TouchableOpacity
                      style={styles.rowImageContainer}
                      activeOpacity={0.8}
                      onPress={() => {
                        let imageData = [];
                        images.forEach(element => {
                          imageData.push(element.gallery);
                        });
                        props.navigation.navigate('FullImage', {
                          imageURLs: imageData,
                          pos: imageData.findIndex(
                            images => images == item.gallery,
                          ),
                        });
                        // props.navigation.navigate('FullImage', {
                        //   imageURL: item.gallery,
                        // });
                      }}>
                      <View style={styles.rowImageView}>
                        <Image
                          style={styles.rowImageView}
                          resizeMode={'cover'}
                          source={require('../../Assets/Images/thumbImage.png')}
                        />
                        <Image
                          style={[styles.rowImageView, {position: 'absolute'}]}
                          resizeMode={'cover'}
                          source={{
                            uri: item.gallery,
                          }}
                        />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.rowCloseBack}
                      activeOpacity={0.8}
                      onPress={() => {
                        if (eventItem != null) {
                          if (item.hasOwnProperty('event_id')) {
                            GalleryDeleteApi(item);
                          } else {
                            handleRemovePost(item);
                          }
                        } else handleRemovePost(item);
                      }}>
                      <Image
                        style={styles.rowCloseImage}
                        resizeMode={'contain'}
                        source={require('../../Assets/Images/ic_close.png')}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}

              {images.length < 5 && (
                <TouchableOpacity
                  onPress={() => {
                    //selectPhotoTapped('gallery');
                    selectMultiplePhoto();
                  }}>
                  <View style={styles.addContainer}>
                    <View style={styles.add_btn}>
                      <Image
                        style={styles.addIcon}
                        source={require('../../Assets/Images/ic_add.png')}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.add_txt}>{'Add Image'}</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('newEvent.event_title')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.black}}
              keyboardType={'default'}
              returnKeyType={'done'}
              returnKeyLabel={'Done'}
              defaultValue={eventTitle}
              onChangeText={setEventTitle}
            />
          </View>

          <View style={styles.editContainer}>
            <TextField
              selectionColor={Colors.theme}
              placeholder={I18n.t('newEvent.event_desc')}
              placeholderTextColor={Colors.grey}
              inputContainerStyle={styles.inputContainer}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.black}}
              keyboardType={'default'}
              returnKeyType={'done'}
              returnKeyLabel={'Done'}
              defaultValue={eventDesc}
              onChangeText={setEventDesc}
            />
          </View>

          <TouchableOpacity
            style={styles.editContainer}
            onPress={() => {
              props.navigation.navigate('GooglePlaces', {
                onPlaceSelect: ChangePlace,
              });
            }}>
            <TextField
              selectionColor={Colors.theme}
              //placeholder={I18n.t('newEvent.event_loc')}
              //placeholderTextColor={Colors.grey}
              inputContainerStyle={[styles.inputContainer, {paddingRight: 25}]}
              tintColor={Colors.theme}
              labelFontSize={0}
              fontSize={16}
              style={{fontFamily: Fonts.MontserratMedium, color: Colors.black}}
              keyboardType={'default'}
              editable={false}
              //defaultValue={eventLoc}
              //onChangeText={setEventDesc}
            />
            <Text
              style={{
                position: 'absolute',
                fontSize: 16,
                fontFamily: Fonts.MontserratMedium,
                color: eventLoc == '' ? Colors.grey : Colors.black,
                paddingRight: 25,
                paddingStart: 5,
                top: 22,
              }}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {eventLoc == '' ? I18n.t('findBusker.event_loc') : eventLoc}
            </Text>
            <Image
              style={styles.rightIcon}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_location.png')}
            />
          </TouchableOpacity>

          {/* <View style={styles.placeEditContainer}>
            <GooglePlacesAutocomplete
              placeholder={I18n.t('newEvent.event_loc')}
              placeholderTextColor={Colors.grey}
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
              }}
            />
            <Image
              style={styles.placeIconStyle}
              resizeMode={'contain'}
              source={require('../../Assets/Images/ic_location.png')}
            />
          </View> */}
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => {
                setDateType(1);
                setDateVisibility(true);
              }}>
              <TextField
                selectionColor={Colors.theme}
                placeholder={I18n.t('newEvent.event_st_date')}
                placeholderTextColor={Colors.grey}
                inputContainerStyle={styles.inputContainer}
                tintColor={Colors.theme}
                labelFontSize={0}
                fontSize={16}
                style={{
                  fontFamily: Fonts.MontserratMedium,
                  color: Colors.black,
                }}
                editable={false}
                defaultValue={
                  eventStDate != '' ? Moment(eventStDate).format('l') : ''
                }
              />

              <Image
                style={styles.rightIcon}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_calendar.png')}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => {
                if (eventStDate == '')
                  toast.current.show(
                    'Select Event Start Date First',
                    2000,
                    () => {},
                  );
                else {
                  setDateType(2);
                  setDateVisibility(true);
                }
              }}>
              <TextField
                selectionColor={Colors.theme}
                placeholder={I18n.t('newEvent.event_ed_date')}
                placeholderTextColor={Colors.grey}
                inputContainerStyle={styles.inputContainer}
                tintColor={Colors.theme}
                labelFontSize={0}
                fontSize={16}
                style={{
                  fontFamily: Fonts.MontserratMedium,
                  color: Colors.black,
                }}
                editable={false}
                defaultValue={
                  eventEdDate != '' ? Moment(eventEdDate).format('l') : ''
                }
              />

              <Image
                style={styles.rightIcon}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_calendar.png')}
              />
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => {
                if (eventStDate == '' && eventEdDate == '')
                  toast.current.show('Select Event Date First', 2000, () => {});
                else {
                  setTimeVisibility(true);
                  setTimeType(1);
                }
              }}>
              <TextField
                selectionColor={Colors.theme}
                placeholder={I18n.t('newEvent.start_time')}
                placeholderTextColor={Colors.grey}
                inputContainerStyle={styles.inputContainer}
                tintColor={Colors.theme}
                labelFontSize={0}
                fontSize={16}
                style={{
                  fontFamily: Fonts.MontserratMedium,
                  color: Colors.black,
                }}
                editable={false}
                defaultValue={
                  eventStTime != '' ? Moment(eventStTime).format('LT') : ''
                }
              />

              <Image
                style={styles.rightIcon}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_watch.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => {
                if (eventStTime == '')
                  toast.current.show('Select Start Time First', 2000, () => {});
                else {
                  setTimeVisibility(true);
                  setTimeType(2);
                }
              }}>
              <TextField
                selectionColor={Colors.theme}
                placeholder={I18n.t('newEvent.end_time')}
                placeholderTextColor={Colors.grey}
                inputContainerStyle={styles.inputContainer}
                tintColor={Colors.theme}
                labelFontSize={0}
                fontSize={16}
                style={{
                  fontFamily: Fonts.MontserratMedium,
                  color: Colors.black,
                }}
                editable={false}
                defaultValue={
                  eventEdTime != '' ? Moment(eventEdTime).format('LT') : ''
                }
              />

              <Image
                style={styles.rightIcon}
                resizeMode={'contain'}
                source={require('../../Assets/Images/ic_watch.png')}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.btnContainer}
            activeOpacity={0.5}
            onPress={() => checkValidate()}>
            <Text style={styles.btnText}>
              {eventItem != null
                ? I18n.t('newEvent.update_event')
                : I18n.t('newEvent.create_event')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <DateTimePickerModal
        isVisible={dateVisibility}
        mode="date"
        minimumDate={new Date(Date.now())}
        date={
          dateType == 1
            ? eventStDate != ''
              ? new Date(eventStDate)
              : new Date(Date.now())
            : eventEdDate != ''
            ? new Date(eventEdDate)
            : new Date(Date.now())
        }
        onConfirm={handleDateConfirm}
        onCancel={hideDateDialog}
        headerTextIOS={dateType == 1 ? 'Pick Start Date' : 'Pick End Date'}
        textColor={Colors.black}
        isDarkModeEnabled={false}
      />

      <DateTimePickerModal
        isVisible={timeVisibility}
        mode="time"
        is24Hour={false}
        date={
          timeType == 1
            ? eventStTime != ''
              ? new Date(eventStTime)
              : new Date()
            : eventEdTime != ''
            ? new Date(eventEdTime)
            : new Date()
        }
        onConfirm={handleTimeConfirm}
        onCancel={hideTimeDialog}
        headerTextIOS={timeType == 1 ? 'Pick Start Time' : 'Pick End Time'}
        textColor={Colors.black}
        isDarkModeEnabled={false}
      />

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

export default NewEvent;
