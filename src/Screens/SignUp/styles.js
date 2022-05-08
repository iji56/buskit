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
    marginStart: 20,
    fontSize: 20,
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
  dropIcon: {
    position: 'absolute',
    top: 25,
    right: 0,
    height: 15,
    width: 15,
    tintColor: Colors.grey,
  },
  eyeConatainer: {
    position: 'absolute',
    top: 25,
    right: 0,
  },
  eyeIcon: {
    height: 20,
    width: 20,
    tintColor: Colors.grey,
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

  chooseContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 25,
    marginTop: 40,
    marginBottom: 20,
  },
  chooseDivider: {
    width: 0.7,
    height: 35,
    backgroundColor: Colors.black,
  },
  activeBtnContainer: {
    // width: 130,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.theme,
    backgroundColor: Colors.theme,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveBtnContainer: {
    // width: 130,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.grey,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.white,
    alignSelf: 'center',
  },
  inactiveText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.grey,
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
    paddingVertical: 20,
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
    fontSize: 20,
  },
  modalCloseStyle: {
    height: 18,
    width: 18,
    alignSelf: 'center',
    tintColor: Colors.grey,
  },

  doneBtnContainer: {
    height: 45,
    marginVertical: 10,
    // borderColor: Colors.theme,
    // borderWidth: 1,
    borderRadius: 25,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  doneBtnTxt: {
    fontSize: 14,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.theme,
    alignSelf: 'center',
  },
  imgBtnView: {
    height: 45,
    width: 45,
    alignSelf: 'center',
  },

  genreBtnContainer: {
    height: 40,
    width: viewportWidth / 3 - 25,
    marginVertical: 5,
    marginHorizontal: 3,
    borderColor: Colors.theme,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
  },
  genreBtnText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.theme,
    alignSelf: 'center',
  },
});
