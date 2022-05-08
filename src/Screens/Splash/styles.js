import {StyleSheet, Dimensions, Platform} from 'react-native';
import Colors from '../../Res/Colors';
import Fonts from '../../Res/Fonts';

const IS_IOS = Platform.OS === 'ios';
const IS_ANDROID = Platform.OS === 'android';
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

export default StyleSheet.create({
  viewcontainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerRowStyle: {
    flexDirection: 'row',
    height: 60,
  },
  backImageBack: {
    height: 30,
    width: 30,
    marginHorizontal: 15,
    backgroundColor: 'transparent',
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  backImageStyle: {
    height: 20,
    width: 20,
    alignSelf: 'center',
  },
  titleText: {
    fontSize: 18,
    alignSelf: 'center',
    fontFamily: Fonts.MontserratRegular,
    color: Colors.white,
  },
  viewStyles: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
  },
  splash: {
    height: 200,
    width: 350,
    alignSelf: 'center',
  },
});
