import {StyleSheet, Dimensions, Platform} from 'react-native';
import Colors from '../../Res/Colors';
import Fonts from '../../Res/Fonts';

const IS_IOS = Platform.OS === 'ios';
const IS_ANDROID = Platform.OS === 'android';
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

export default StyleSheet.create({
  viewcontainer: {
    flex: 1,
    backgroundColor: Colors.theme,
  },
  viewStyle: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
  },

  imageStyle: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  titleText: {
    fontSize: 28,
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: Fonts.MontserratMedium,
    color: Colors.black,
  },
  msgText: {
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center',
    marginHorizontal: 30,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.grey,
  },
});
