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
  saveContainer: {
    marginHorizontal: 15,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  saveText: {
    fontSize: 16,
    alignSelf: 'center',
    fontFamily: Fonts.MontserratRegular,
    color: Colors.white,
  },
  viewStyle: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  profileContainer: {
    marginTop: 30,
    marginBottom: 20,
    alignSelf: 'center',
  },
  profileImage: {
    height: 120,
    width: 120,
    borderRadius: 60,
  },
  editImageStyle: {
    width: 32,
    height: 32,
    borderRadius: 20,
    bottom: 0,
    alignSelf: 'flex-end',
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: Colors.dimblue,
  },
  editImage: {
    height: 18,
    width: 18,
    alignSelf: 'center',
  },

  headerTxtStyle: {
    fontSize: 18,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.black,
    marginTop: 20,
    marginHorizontal: 20,
  },

  editContainer: {
    flex: 1,
    marginHorizontal: 20,
    //height: 45,
  },
  editLongContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  inputContainer: {
    paddingLeft: 30,
    height: 40,
  },
  inputIcon: {
    position: 'absolute',
    top: 15,
    left: 0,
    height: 18,
    width: 18,
    tintColor: Colors.dimblue,
  },
  inputBioIcon: {
    position: 'absolute',
    bottom: 18,
    left: 0,
    height: 18,
    width: 18,
    tintColor: Colors.dimblue,
  },
  hourTextStyle: {
    position: 'absolute',
    top: 15,
    right: 0,
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.grey,
  },

  placeEditContainer: {
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
  },
  placesInputContainer: {
    height: 45,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
  },
  placesInputText: {
    height: 45,
    paddingStart: 35,
    fontSize: 16,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.black,
    borderBottomWidth: 0.3,
    borderBottomColor: Colors.grey,
  },
  placeIconStyle: {
    position: 'absolute',
    top: 25,
    left: 5,
    height: 18,
    width: 18,
    tintColor: Colors.dimblue,
  },

  sliderHeadTxt: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: Fonts.MontserratSemiBold,
    marginTop: 20,
    marginStart: 20,
    marginEnd: 5,
  },
  sliderStyle: {
    width: viewportWidth - 40,
    height: 45,
    alignSelf: 'center',
  },
  thumbStyle: {
    height: 15,
    width: 15,
    borderRadius: 10,
    backgroundColor: Colors.theme,
  },
  railStyle: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.grey,
  },
  railColorStyle: {
    flex: 1,
    height: 2.5,
    backgroundColor: Colors.theme,
  },
  labelContainer: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: Colors.theme,
    borderRadius: 5,
  },
  labelStyle: {
    fontSize: 11,
    color: Colors.white,
    fontFamily: Fonts.MontserratMedium,
  },
  distanceRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  distanceRowText: {
    fontSize: 11,
    color: Colors.grey,
    fontFamily: Fonts.MontserratSemiBold,
  },

  socialCardView: {
    width: viewportWidth - 30,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingBottom: 30,
    borderRadius: 10,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 4},
    elevation: 10,
  },
  socialEditContainer: {
    flex: 1,
    marginHorizontal: 15,
    height: 45,
  },
  socialInputContainer: {
    paddingLeft: 30,
    paddingRight: 5,
  },
  socialInputIcon: {
    position: 'absolute',
    top: 25,
    //right: 5,
    left: 5,
    height: 18,
    width: 18,
    //tintColor: Colors.black,
  },
  socialText: {
    fontSize: 16,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.black,
  },

  cardViewStyle: {
    width: viewportWidth - 30,
    alignSelf: 'center',
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 4},
    elevation: 10,
  },

  btnContainer: {
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
  btnActiveContainer: {
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
  btnText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.black,
    alignSelf: 'center',
  },
  btnActiveText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.white,
    alignSelf: 'center',
  },
});
