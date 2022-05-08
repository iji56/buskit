import React, {useState, useEffect, useRef} from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import styles from '../Res/Styles';
import Colors from '../Res/Colors';
import Strings from '../Res/String';
import CustomStatusBar from '../Components/CustomStatusBar';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const GOOGLE_API_KEY = 'AIzaSyC2LNQ0xw5GxnOEe19r4SL7BLY6w04kIBg';

const GooglePlaces = props => {
  const {onPlaceSelect} = props.route.params;
  const googleView = useRef();
  const googleInput = useRef();
  const [value, setValue] = useState('');

  useEffect(() => {
    console.log('param', onPlaceSelect);
  });

  const setSubmit = () => {
    googleView.current?.setAddressText(value);
    googleView.current?.focus;
    googleInput.current.focus();
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
        <Text style={styles.titleText}>{'Google Places'}</Text>
      </View>
      <ScrollView
        style={styles.viewStyle}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps={'always'}
        overScrollMode="never">
        <GooglePlacesAutocomplete
          placeholder="Search Places"
          ref={googleView}
          minLength={3}
          autoFocus={false}
          returnKeyType={'default'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          listViewDisplayed={true} // true/false/undefined
          //fetchDetails={true}
          query={{
            key: GOOGLE_API_KEY,
            language: 'en', // language of the results
            //components: 'country:us',
          }}
          getDefaultValue={() => value}
          onPress={(data, details = null) => {
            console.log(
              JSON.stringify(data) + '----->',
              JSON.stringify(details),
            );
            props.navigation.goBack({type: 'place'});
            onPlaceSelect(details.description);
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default GooglePlaces;
