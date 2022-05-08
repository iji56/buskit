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
  headerRowStyle: {
    flexDirection: 'row',
    height: IS_IOS ? 44 : 55,
    backgroundColor: Colors.theme,
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
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: Fonts.MontserratMedium,
    color: Colors.white,
  },
  viewStyle: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  logoStyle: {
    height: 200,
    width: 200,
    alignSelf: 'center',
    marginTop: 30,
  },
  headerText: {
    fontSize: 20,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.black,
    alignSelf: 'center',
    textAlign: 'center',
    marginHorizontal: 25,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    fontFamily: Fonts.MontserratLight,
    color: Colors.black,
    alignSelf: 'center',
    textAlign: 'center',
    marginHorizontal: 25,
  },
  editContainer: {
    marginHorizontal: 20,
    height: 50,
    marginTop: 10,
  },
  inputContainer: {
    paddingLeft: 30,
  },

  otpViewStyle: {
    width: '80%',
    height: 50,
    marginVertical: 20,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  underlineStyleBase: {
    width: 45,
    height: 60,
    color: Colors.theme,
    backgroundColor: Colors.boxgrey,
    fontSize: 24,
    textAlign: 'center',
    //fontFamily: Fonts.MontserratRegular,
  },
  underlineStyleHighLighted: {
    borderWidth: 1,
    borderColor: Colors.theme,
  },

  btnContainer: {
    height: 50,
    width: 50,
    margin: 20,
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: Colors.theme,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  btnImage: {
    height: 30,
    width: 30,
    alignSelf: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    marginHorizontal: 25,
    marginBottom: 20,
  },
  bottomText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.dimgrey,
    alignSelf: 'center',
    marginStart: 5,
  },
  linkText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratBold,
    color: Colors.theme,
    alignSelf: 'center',
  },
});
