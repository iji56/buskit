import {StyleSheet, Dimensions, Platform} from 'react-native';
import Colors from '../../Res/Colors';
import Fonts from '../../Res/Fonts';
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';

const IS_IOS = Platform.OS === 'ios';
const IS_ANDROID = Platform.OS === 'android';
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

export default StyleSheet.create({
  viewcontainer: {
    flex: 1,
    backgroundColor: Colors.theme,
  },
  logoStyle: {
    height: 80,
    width: 160,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  titleText: {
    fontSize: 18,
    alignSelf: 'center',
    fontFamily: Fonts.MontserratMedium,
    color: Colors.white,
  },
  viewStyle: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  editContainer: {
    marginHorizontal: 20,
    height: 50,
    marginTop: 10,
  },
  inputContainer: {
    paddingLeft: 30,
  },
  editIcon: {
    position: 'absolute',
    top: 25,
    left: 0,
    height: 18,
    width: 18,
    tintColor: Colors.black,
  },

  btnContainer: {
    marginHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
    height: 45,
    backgroundColor: Colors.theme,
    justifyContent: 'center',
    borderRadius: 5,
  },
  btnText: {
    fontSize: 18,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.white,
    alignSelf: 'center',
  },
  forgotText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratBold,
    color: Colors.theme,
    alignSelf: 'center',
  },
  connectContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 25,
    marginVertical: 30,
  },
  connectDivider: {
    flex: 1,
    height: 1.2,
    backgroundColor: Colors.dimgrey,
  },
  connectText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.dimGrey2,
    marginHorizontal: 15,
    alignSelf: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  bottomText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.dimGrey2,
    alignSelf: 'center',
  },
  linkText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratBold,
    color: Colors.theme,
    alignSelf: 'center',
  },

  socialBtnView: {
    marginHorizontal: 20,
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialContainer: {
    marginHorizontal: 5,
    paddingVertical: 10,
    width: appleAuth.isSupported && Platform.OS==='ios'?110: 140,
    backgroundColor: Colors.white,
    borderColor: Colors.cyan,
    borderWidth: 1.5,
    borderRadius: 8,
  },
  socialIcon: {
    height: 30,
    width: 30,
    alignSelf: 'center',
  },
});
