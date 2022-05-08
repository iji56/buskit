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
    tintColor: Colors.white,
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

  editContainer: {
    flex: 1,
    marginHorizontal: 20,
    height: 50,
    marginTop: 5,
  },
  inputContainer: {
    paddingRight: 30,
  },
  leftIcon: {
    position: 'absolute',
    top: 25,
    left: 0,
    height: 18,
    width: 18,
    tintColor: Colors.black,
  },
  rightIcon: {
    position: 'absolute',
    top: 25,
    right: 0,
    height: 15,
    width: 15,
  },
  headerText: {
    fontSize: 20,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.black,
    alignSelf: 'center',
    textAlign: 'center',
    marginHorizontal: 25,
    marginTop: 30,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratLight,
    color: Colors.black,
    alignSelf: 'center',
    textAlign: 'center',
    marginHorizontal: 25,
  },
  bankNoteTxt: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontStyle: 'italic',
    fontSize: 12,
    color: Colors.grey,
    marginHorizontal: 20,
    marginTop: 15,
  },

  btnContainer: {
    marginHorizontal: 20,
    marginTop: 30,
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

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  dialogModal: {
    width: viewportWidth - 25,
    position: 'absolute',
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  modalRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  modalHeadText: {
    flex: 1,
    color: Colors.black,
    fontFamily: Fonts.MontserratSemiBold,
    fontSize: 18,
  },
  modalCloseStyle: {
    height: 15,
    width: 15,
    alignSelf: 'center',
    tintColor: Colors.grey,
  },
  typeContainer: {
    height: 40,
    marginVertical: 5,
    marginHorizontal: 3,
    justifyContent: 'center',
  },
  typeText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.black,
  },
  dividerStyle: {
    height: 1,
    backgroundColor: Colors.offgrey,
  },
});
