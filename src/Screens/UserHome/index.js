import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Platform,
  Dimensions,
  Alert,
  SafeAreaView,
  PermissionsAndroid,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import MapView, {PROVIDER_GOOGLE, Marker, Circle} from 'react-native-maps';
import RBSheet from 'react-native-raw-bottom-sheet';
import Slider from '@react-native-community/slider';
import OpenAppSettings from 'react-native-app-settings';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import {DotIndicator} from 'react-native-indicators';
import {SwipeablePanel} from 'rn-swipeable-panel';
import Toast, {DURATION} from 'react-native-easy-toast';
import RangeSlider from 'rn-range-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import I18n from '../../Config/I18n';
import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';

const GOOGLE_API_KEY = 'AIzaSyCPFefUcKipTLsFZHXXnx4RuFOX6E-z91M';
const {height, width} = Dimensions.get('window');

export const dummyImage =
  'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

const Home = props => {
  //const [user, setUser] = useState('');
  const [mapVisible, setMapVisible] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [region, setRegion] = useState(null);
  const [lat, setLatitude] = useState(0);
  const [lng, setLongitude] = useState(0);
  const [delta, setDelta] = useState(0.1);
  const [range, setRange] = useState(1);
  const [location, setLocation] = useState(I18n.t('userHome.location_hint'));

  const [mapBuskers, setMapBuskers] = useState([]);
  const [buskers, setBuskers] = useState([]);
  const [events, setEvents] = useState([]);

  const rbRef = useRef(null);
  const [panelProps, setPanelProps] = useState({
    fullWidth: true,
    openLarge: false,
    showCloseButton: true,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
  });
  const [isPanelActive, setIsPanelActive] = useState(false);
  const [slideValue, setSlideValue] = useState(1);
  const [genres, setGenres] = useState([]);
  const [genreId, setGenreId] = useState(0);

  const [isLoading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [onLoad, setOnLoad] = useState(false);
  const [locationPermission, setLocationPermission] = useState('');
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const toast = useRef(null);

  const user = useSelector(state => state.user);

  useEffect(() => {
    async function checkLocationPermission() {
      const granted = await AsyncStorage.getItem('locationPermission');
      Platform.OS === 'android'
        ? setLocationPermission(granted)
        : setLocationPermission('granted');
    }
    checkLocationPermission();
  }, []);

  useEffect(() => {
    console.log('Data!', user);
    // Initialize the module (needs to be done only once)
    Geocoder.init(GOOGLE_API_KEY, {language: 'en'});
    // Store default region for map
    storeRegion(lat, lng);
    // Get Location for map initial
    getLocation();
  }, [getLocation, lat, lng, storeRegion, user]);

  useFocusEffect(
    React.useCallback(() => {
      if (mapVisible) {
        setEvents([]);
        setMapBuskers([]);
        BuskerMapApi(lat, lng, range);
        EventNearApi(lat, lng, range);
      } else {
        setPage(1);
        setBuskers([]);
        BuskerNearApi(lat, lng, range, 1);
      }
    }, [
      mapVisible,
      BuskerMapApi,
      lat,
      lng,
      range,
      EventNearApi,
      BuskerNearApi,
    ]),
    // React.useCallback(() => {
    //   // Get Location for map initial
    //   getLocation();
    // }, [mapVisible, range, genreId]),
  );

  const callback = (loc, lat, lng) => {
    console.log('loc(lat,lng)-->', loc + ' (' + lat + ',' + lng + ') ');
    setEvents([]);
    setBuskers([]);
    setMapBuskers([]);
    setLatitude(lat);
    setLongitude(lng);
    setLocation(loc);
    storeRegion(lat, lng);
    UpdateLocationApi(lat, lng);
  };

  const storeRegion = useCallback((latitude, longitude) => {
    setRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: delta,
      longitudeDelta: delta,
    });
  });

  const getLocation = useCallback(() => {
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
        storeRegion(position.coords.latitude, position.coords.longitude);
        UpdateLocationApi(position.coords.latitude, position.coords.longitude);
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
  });

  const getAddress = (lat, lng) => {
    Geocoder.from(lat, lng)
      .then(json => {
        console.log('json --> ', json);
        var addressComponent = json.results[0];
        console.log(JSON.stringify(addressComponent));
        setLocation(addressComponent.formatted_address);
      })
      .catch(error => console.log(error));
  };

  const showAlert = type => {
    if (type === 1) {
      Alert.alert(
        I18n.t('location.location_alert'),
        I18n.t('location.location_permission'),
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
          },
          {
            text: I18n.t('location.open_settings'),
            onPress: () => {
              showAlert(2);
              OpenAppSettings.open();
            },
          },
        ],
      );
    } else {
      Alert.alert(
        I18n.t('location.location_alert'),
        I18n.t('location.location_unavailable'),
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
          },
          {text: I18n.t('location.locate_again'), onPress: () => getLocation()},
        ],
      );
    }
  };

  const openPanel = () => {
    setIsPanelActive(true);
  };

  const closePanel = () => {
    setIsPanelActive(false);
  };

  //******************** Hit Location Api **********************
  const UpdateLocationApi = async (lat, lng) => {
    let data = {
      latitude: lat,
      longitude: lng,
    };
    setLoading(true);
    console.log('Acesss-Token', user.access_token);
    console.log(
      'ApiCall',
      constants.baseUrl +
        constants.api.updateLocation +
        ',lat:' +
        lat +
        ',lng:' +
        lng,
    );
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.updateLocation, {
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
            if (mapVisible) {
              BuskerMapApi(lat, lng, range);
              EventNearApi(lat, lng, range);
            } else {
              setPage(1);
              BuskerNearApi(lat, lng, range, 1);
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

  //******************** Hit Map Buskers  Api ******************
  const BuskerMapApi = useCallback(
    async (lat, lng, range) => {
      let data = {
        latitude: lat,
        longitude: lng,
        radius: range,
      };
      if (genreId !== 0) {
        data.busker_type = genreId;
      }

      setLoading(true);
      console.log('body', data);
      console.log('ApiCall', constants.baseUrl + constants.api.buskerMapList);
      timeout(
        10000,
        fetch(constants.baseUrl + constants.api.buskerMapList, {
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
              setMapBuskers(data);
              //toast.current.show(responseJson.message, 2000, () => {});
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
    },
    [genreId, user.access_token],
  );

  //******************** Hit Near Events Api *******************
  const EventNearApi = useCallback(async (lat, lng, range) => {
    let data = {
      latitude: lat,
      longitude: lng,
      radius: range,
    };
    if (genreId !== 0) {
      data.busker_type = genreId;
    }

    setLoading(true);
    console.log('body', data);
    console.log('ApiCall', constants.baseUrl + constants.api.eventNearList);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.eventNearList, {
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
            setEvents(data);
            //toast.current.show(responseJson.message, 2000, () => {});
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
  });

  //******************** Hit Near Buskers  Api ******************
  const BuskerNearApi = useCallback(
    async (lat, lng, range, page) => {
      let data = {
        latitude: lat,
        longitude: lng,
        radius: range,
      };
      if (genreId !== 0) {
        data.busker_type = genreId;
      }

      if (page === 1) {
        setLoading(true);
      }
      console.log('body', data);
      console.log(
        'ApiCall',
        constants.baseUrl + constants.api.buskerNearList + '?page=' + page,
      );
      timeout(
        10000,
        fetch(
          constants.baseUrl + constants.api.buskerNearList + '?page=' + page,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              //'X-Requested-With': 'XMLHttpRequest',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.access_token}`,
            },
            body: JSON.stringify(data),
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
                setBuskers(data);
                setPage(page + 1);
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
          setOnLoad(false);
          setFetching(false);
          toast.current.show(err.message, 2000, () => {});
        });
    },
    [genreId, user],
  );

  //******************** Hit Favorite Api ***********************
  const FavoriteApi = async (item, status) => {
    let data = {
      user_id: user.id,
      busker_id: item.id,
      favorite_status: status,
    };
    setLoading(true);
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
            toast.current.show(responseJson.message, 2000, () => {});
            handleLikePost(item, status);
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

  //******************** Hit Genres List Api ********************
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
            data.forEach(element => {
              if (element.id == genreId) {
                element.state = true;
              } else {
                element.state = false;
              }
            });
            setGenres(data);
            openPanel();
            //rbRef.current.open();
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

  // Genre Row Item(filter)
  const filterItem = (item, pos) => {
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
    setGenres(dataArray);
    setGenreId(item.id);
  };
  const resetFilter = () => {
    setSlideValue(1);
    var data = genres;
    data.forEach(element => {
      element.state = false;
    });
    setGenres(data);
    setGenreId(0);
  };
  const applyFilter = () => {
    setRange(slideValue);
    if (mapVisible) {
      setEvents([]);
      setMapBuskers([]);
      BuskerMapApi(lat, lng, slideValue);
      EventNearApi(lat, lng, slideValue);
    } else {
      setPage(1);
      setBuskers([]);
      BuskerNearApi(lat, lng, slideValue, 1);
    }
    //rbRef.current.close();
    closePanel();
  };

  // Event Row Item
  const eventItem = (item, pos) => {
    return (
      <TouchableOpacity
        style={styles.eventRowContainer}
        activeOpacity={0.8}
        onPress={() => {
          props.navigation.navigate('EventDetail', {
            event: item,
            type: 'user',
            action: 'null',
          });
        }}>
        <View style={styles.eventImageStyle}>
          <Image
            style={styles.eventImageStyle}
            resizeMode={'cover'}
            source={require('../../Assets/Images/thumbImage.png')}
          />
          <Image
            style={[styles.eventImageStyle, {position: 'absolute'}]}
            resizeMode={'cover'}
            source={{
              uri: item.banner_image != null ? item.banner_image : 'image',
            }}
          />
        </View>
        <View style={styles.eventDetailView}>
          <Text style={styles.eventNameText}>
            {item.event_name != null ? item.event_name : ''}
          </Text>
          <Text
            style={styles.eventDescText}
            numberOfLines={2}
            ellipsizeMode={'tail'}>
            {item.description != null ? item.description : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  // Artist Row Item
  const artistItem = (item, pos) => {
    return (
      <TouchableOpacity
        style={styles.rowContainer}
        activeOpacity={0.8}
        onPress={() => {
          props.navigation.navigate('BuskerDetail', {
            item: item,
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
              uri: item.profile_img != null ? item.profile_img : 'image',
            }}
          />
        </View>
        <View style={styles.detailViewStyle}>
          <View style={styles.rowViewStyle}>
            <Text style={styles.nameTextStyle}>{item.name}</Text>
            <Text style={styles.mileTextStyle}>
              {Math.round(item.distance * 100) / 100 +
                ' ' +
                I18n.t('common.distance')}
            </Text>
          </View>
          <Text
            style={styles.descTextStyle}
            numberOfLines={2}
            ellipsizeMode={'tail'}>
            {item.busker_bio != null && item.busker_bio != ''
              ? item.busker_bio
              : 'Busker Bio Not Added!'}
          </Text>
          <View style={styles.rowViewStyle}>
            <View style={styles.rowViewStyle}>
              <Text style={styles.typePriceTextStyle}>
                {item.other_cat_name != null
                  ? item.other_cat_name
                  : item.category != null
                  ? item.category
                  : 'artist'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.endRowViewStyle}
              onPress={() => {
                if (item.favorite == null) {
                  FavoriteApi(item, 1);
                } else {
                  if (item.favorite == '1') {
                    FavoriteApi(item, 0);
                  } else {
                    FavoriteApi(item, 1);
                  }
                }
              }}>
              <Image
                style={styles.likeImageStyle}
                resizeMode={'contain'}
                source={
                  item.favorite != null
                    ? item.favorite == '1'
                      ? require('../../Assets/Images/heart_filled.png')
                      : require('../../Assets/Images/heart_empty.png')
                    : require('../../Assets/Images/heart_empty.png')
                }
              />
              <Text style={styles.likeTextStyle}>{item.fans_count}</Text>
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
  // Handle Like Post
  const handleLikePost = (item, status) => {
    let busker = buskers.find(data => {
      return data.id === item.id;
    });
    console.log('found', busker);
    busker.favorite = status === 1 ? '1' : '0';
    busker.fans_count =
      status === 1
        ? Number(busker.fans_count) + 1
        : Number(busker.fans_count) - 1;
    setBuskers([...buskers]);
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

  return (
    <SafeAreaView style={styles.viewcontainer}>
      <CustomStatusBar color={Colors.theme} />
      <View style={styles.headerRowStyle}>
        <TouchableOpacity
          style={styles.titleRowContainer}
          onPress={() => props.navigation.navigate('GetLocation', {callback})}>
          <Image
            style={styles.titleImage}
            resizeMode={'contain'}
            source={require('../../Assets/Images/ic_compass.png')}
          />
          <Text
            style={styles.titleText}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {location}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backImageBack}
          onPress={() => {
            props.navigation.navigate('GetLocation', {callback: callback});
          }}>
          <Image
            style={[
              styles.titleImage,
              {tintColor: Colors.grey, width: 30, paddingRight: 15},
            ]}
            resizeMode={'contain'}
            source={require('../../Assets/Images/ic_edit.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backImageBack}
          onPress={() => {
            props.navigation.navigate('SearchBusker');
          }}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/ic_search.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backImageBack}
          onPress={() => {
            GenresApi();
          }}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/ic_filter.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.viewStyle}>
        {/* Map List Container */}
        <View style={styles.MapContainer}>
          {mapVisible && locationPermission === 'granted' ? (
            <MapView
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map}
              region={region}
              onPress={region => console.log('Region', region.nativeEvent)}
              onLayout={() => setMapReady(true)}>
              {mapReady && lat != 0 && lng != 0 && (
                <>
                  <Circle
                    center={{
                      latitude: lat,
                      longitude: lng,
                    }}
                    radius={200}
                    strokeWidth={0}
                    strokeColor={Colors.theme}
                    fillColor={Colors.blackUltra}
                  />
                  <Marker
                    coordinate={region}
                    title={'Current Location'}
                    pinColor={Colors.red}
                    isPreselected={true}
                  />
                  {mapBuskers.map(marker => (
                    <Marker
                      anchor={{x: 0.5, y: 1}}
                      centerOffset={{x: 0.5, y: 0}}
                      calloutAnchor={{x: 0.5, y: 0}}
                      coordinate={{
                        latitude: parseFloat(marker.latitude),
                        longitude: parseFloat(marker.longitude),
                      }}
                      title={marker.name}
                      description={marker.category}
                      pinColor={Colors.theme}
                      onCalloutPress={() => {
                        props.navigation.navigate('BuskerDetail', {
                          item: marker,
                          type: 'normal',
                        });
                      }}>
                      <Image
                        key={marker.id}
                        source={{
                          uri: marker?.profile_img
                            ? marker?.profile_img
                            : dummyImage,
                        }}
                        style={[
                          styles.userImageStyle,
                          {
                            borderColor: Colors.gold,
                          },
                        ]}
                        resizeMode="cover"
                      />
                    </Marker>
                  ))}
                </>
              )}
            </MapView>
          ) : (
            <View style={styles.noMap}>
              <Text style={styles.listHeadText}>
                {'Need location permissons to show map.'}
              </Text>
            </View>
          )}
          {!mapVisible && lat != 0 && lng != 0 && (
            <View style={styles.viewStyle}>
              <View style={styles.listHeadRow}>
                <Text style={styles.listHeadText}>
                  {I18n.t('userHome.busker_near')}
                </Text>
              </View>
              {buskers.length == 0 && (
                <View style={commonStyles.emptyView}>
                  <Image
                    style={commonStyles.ImageStyle}
                    resizeMode={'contain'}
                    source={require('../../Assets/Images/app_logo.png')}
                  />
                  <Text style={commonStyles.EmptyText}>{'No Buskers'}</Text>
                </View>
              )}
              <FlatList
                showsVerticalScrollIndicator={false}
                bounces={false}
                overScrollMode={'never'}
                contentContainerStyle={{paddingBottom: 5}}
                extraData={buskers.favorite}
                data={buskers}
                renderItem={({item, pos}) => artistItem(item, pos)}
                keyExtractor={(item, pos) => item.id}
                onScrollEndDrag={() => console.log(' *********end')}
                onScrollBeginDrag={() => console.log(' *******start')}
                initialNumToRender={8}
                maxToRenderPerBatch={8}
                onEndReachedThreshold={0.5}
                onEndReached={({distanceFromEnd}) => {
                  console.log(' ***************** ' + distanceFromEnd);
                  if (page <= totalPage && onLoad) {
                    BuskerNearApi(lat, lng, range, page);
                  }
                }}
                ListFooterComponent={BottomView}
              />
            </View>
          )}
          <View style={styles.fabViewStyle}>
            {mapVisible && lat != 0 && lng != 0 && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  getLocation();
                }}
                style={styles.fabBtnStyle}>
                <Image
                  source={require('../../Assets/Images/ic_gps.png')}
                  style={styles.fabIconStyle}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            )}
            {lat != 0 && lng != 0 && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setMapVisible(!mapVisible);
                  if (!mapVisible) {
                    setEvents([]);
                    setMapBuskers([]);
                    BuskerMapApi(lat, lng, range);
                    EventNearApi(lat, lng, range);
                  } else {
                    setPage(1);
                    setBuskers([]);
                    BuskerNearApi(lat, lng, range, 1);
                  }
                }}
                style={styles.fabBtnStyle}>
                <Image
                  source={
                    mapVisible
                      ? require('../../Assets/Images/ic_list.png')
                      : require('../../Assets/Images/ic_map.png')
                  }
                  style={styles.fabIconStyle}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {/* Event List Container */}
        {mapVisible && (
          <View style={styles.listContainer}>
            <View style={styles.listHeadRow}>
              <Text style={styles.listHeadText}>
                {I18n.t('userHome.event_near')}
              </Text>
              {events.length == 0 && (
                <Text style={styles.listSubText}>
                  {I18n.t('userHome.no_events')}
                </Text>
              )}
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              bounces={false}
              horizontal={true}
              overScrollMode={'never'}
              contentContainerStyle={{paddingBottom: 0}}
              data={events}
              numColumns={1}
              renderItem={({item, pos}) => eventItem(item, pos)}
              keyExtractor={item => item.keyExtractor}
            />
          </View>
        )}
      </View>
      {lat == 0 && lng == 0 && (
        <View style={styles.emptyLocation}>
          <Text style={styles.emptyTxtLoc}>No Location Found</Text>
          <TouchableOpacity
            style={styles.emptyBtnContainer}
            activeOpacity={0.5}
            onPress={() => getLocation()}>
            <Text style={styles.emptyBtnText}>{'Get Location'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filter Bottom Sheet */}
      <SwipeablePanel {...panelProps} isActive={isPanelActive} openLarge={true}>
        <View style={{flex: 1}}>
          <View style={styles.sheet_headContainer}>
            <Text style={styles.sheet_title_text}>
              {I18n.t('userHome.filter')}
            </Text>
            {/* Distance Range Conatiner */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.sheet_head_text}>
                {I18n.t('userHome.set_range')}
              </Text>
              <Text style={[styles.distanceRowText, {top: 5}]}>
                {'(' + slideValue + ')'}
              </Text>
            </View>

            {/* <Slider
              style={styles.sliderStyle}
              minimumValue={1}
              maximumValue={5}
              minimumTrackTintColor={Colors.theme}
              maximumTrackTintColor={Colors.black}
              thumbTintColor={Colors.theme}
              step={1}
              value={slideValue}
              onValueChange={setSlideValue}
            /> */}
            <RangeSlider
              style={styles.sliderStyle}
              gravity={'center'}
              min={1}
              max={5}
              step={1}
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
              <Text style={styles.distanceRowText}>{'1 Miles or Less'}</Text>
              <Text style={styles.distanceRowText}>{'5 Miles or More'}</Text>
            </View>
            {/* Buker Type Conatiner */}
            <Text style={styles.sheet_head_text}>
              {I18n.t('userHome.busker_type')}
            </Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              bounces={false}
              overScrollMode={'never'}
              style={styles.sheet_list_style}
              data={genres}
              numColumns={3}
              renderItem={({item, pos}) => filterItem(item, pos)}
              keyExtractor={item => item.keyExtractor}
            />
          </View>
          {/* Action Btn Container */}
          <View style={styles.btnViewContainer}>
            <TouchableOpacity
              style={styles.resetContainer}
              activeOpacity={0.7}
              onPress={() => resetFilter()}>
              <Text style={styles.resetText}>{I18n.t('userHome.reset')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyContainer}
              activeOpacity={0.7}
              onPress={() => applyFilter()}>
              <Text style={styles.applyText}>{I18n.t('userHome.apply')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SwipeablePanel>
      <RBSheet
        ref={rbRef}
        height={Platform.OS === 'ios' && height >= 812 ? 190 : 400}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
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

export default Home;
