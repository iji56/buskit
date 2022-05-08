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
    marginVertical: 30,
  },
  headerText: {
    fontSize: 22,
    fontFamily: Fonts.MontserratBold,
    color: Colors.black,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 40,
    marginHorizontal: 25,
  },
  messageText: {
    fontSize: 16,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.black,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 20,
    marginHorizontal: 25,
  },
  editContainer: {
    marginHorizontal: 25,
    marginBottom: 20,
  },
  inputContainer: {
    paddingLeft: 35,
  },
  editIcon: {
    position: 'absolute',
    left: 10,
    top: 16,
    height: 18,
    width: 18,
    tintColor: Colors.black,
  },

  placesInputContainer: {
    flexDirection: 'row',
    height: 50,
    paddingStart: 20,
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: Colors.grey,
    backgroundColor: 'transparent',
  },
  placesInputText: {
    height: 40,
    marginTop: 5,
    fontSize: 16,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.black,
  },
  poweredContainer: {
    marginTop: 10,
    justifyContent: 'center',
  },

  connectContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 40,
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
    color: Colors.dimgrey,
    marginHorizontal: 15,
    alignSelf: 'center',
  },

  btnContainer: {
    marginHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
    height: 45,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    borderRadius: 5,
  },
  btnText: {
    fontSize: 18,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.white,
    alignSelf: 'center',
  },
});
