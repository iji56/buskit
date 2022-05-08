import React, {useState, useEffect, useRef} from 'react';
import {Image, Text, View, TouchableOpacity, SafeAreaView} from 'react-native';
import styles from '../Res/Styles';
import Colors from '../Res/Colors';
import Strings from '../Res/String';

import CustomStatusBar from '../Components/CustomStatusBar';
import commonStyles from '../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

//const GOOGLE_API_KEY = 'AIzaSyCPFefUcKipTLsFZHXXnx4RuFOX6E-z91M';
const GOOGLE_API_KEY = 'AIzaSyC2LNQ0xw5GxnOEe19r4SL7BLY6w04kIBg';

const GooglePlaces = props => {
  const {lat, lng} = props.route.params;
  const [mapReady, setMapReady] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const toast = useRef(null);

  useEffect(() => {
    // Initialize the module (needs to be done only once)
    Geocoder.init(GOOGLE_API_KEY, {language: 'en'});
    setLatitude(lat);
    setLongitude(lng);
  });

  const getAddress = (lat, lng) => {
    Geocoder.from(lat, lng)
      .then(json => {
        console.log('json --> ', json);
        var addressComponent = json.results[0];
        console.log(JSON.stringify(addressComponent));
        //setLocation(addressComponent.formatted_address);
      })
      .catch(error => {
        console.log(error);
        toast.current.show('No Address Found', 2000, () => {});
      });
  };

  return (
    <SafeAreaView style={styles.viewcontainer}>
      <CustomStatusBar color={Colors.theme} />
      <View style={styles.headerRowStyle}>
        <TouchableOpacity
          style={styles.backImageBack}
          onPress={() => props.navigation.goBack(null)}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../Assets/Images/back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.titleTxt}>{'Google Marker'}</Text>
        <TouchableOpacity
          style={styles.doneTextBack}
          onPress={() => getAddress(latitude, longitude)}>
          <Text style={styles.doneTxt}>{'Done'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.viewStyle}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          onPress={e => console.log('Region', e.nativeEvent)}
          onLayout={() => setMapReady(true)}>
          {mapReady && (
            <Marker
              draggable={true}
              coordinate={{
                latitude: lat,
                longitude: lng,
              }}
              title={'Location'}
              pinColor={Colors.red}
              isPreselected={true}
              onDragEnd={e => {
                console.log('Region', e.nativeEvent.coordinate);
                setLatitude(e.nativeEvent.coordinate.latitude);
                setLongitude(e.nativeEvent.coordinate.longitude);
                toast.current.show(
                  'lat: ' +
                    e.nativeEvent.coordinate.latitude +
                    '\nlng: ' +
                    e.nativeEvent.coordinate.longitude,
                  2000,
                  () => {},
                );
              }}
            />
          )}
        </MapView>
      </View>
      <Toast
        ref={toast}
        style={commonStyles.toastStyle}
        textStyle={commonStyles.toastTextStyle}
      />
    </SafeAreaView>
  );
};

export default GooglePlaces;
