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
  hourTextStyle: {
    position: 'absolute',
    top: 25,
    right: 0,
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.grey,
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
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
  },
  genreActiveContainer: {
    height: 40,
    width: viewportWidth / 3 - 25,
    marginVertical: 5,
    marginHorizontal: 3,
    borderColor: Colors.theme,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: Colors.theme,
    justifyContent: 'center',
  },
  genreBtnText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.black,
    alignSelf: 'center',
  },
  genreActiveText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.white,
    alignSelf: 'center',
  },
});
