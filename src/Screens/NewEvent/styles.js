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

  ImageConatiner: {
    height: 150,
    width: viewportWidth - 30,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  imageStyle: {
    height: 150,
    width: viewportWidth - 30,
    borderRadius: 10,
  },
  blurStyle: {
    position: 'absolute',
    height: 150,
    width: viewportWidth - 30,
    borderRadius: 10,
    backgroundColor: Colors.blackTrans,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  blurAddStyle: {
    height: 13,
    width: 13,
    marginEnd: 10,
    tintColor: Colors.white,
  },
  blurTextStyle: {
    fontSize: 16,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.white,
  },

  editContainer: {
    flex: 1,
    marginHorizontal: 20,
    height: 50,
    marginTop: 10,
  },
  inputContainer: {
    paddingRight: 5,
    paddingLeft: 5,
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

  placeEditContainer: {
    marginTop: 10,
    marginHorizontal: 10,
  },
  placesInputContainer: {
    height: 50,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
  },
  placesInputText: {
    height: 45,
    paddingEnd: 25,
    fontSize: 16,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.black,
    borderBottomWidth: 0.3,
    borderBottomColor: Colors.grey,
  },
  placeIconStyle: {
    position: 'absolute',
    top: 25,
    right: 10,
    height: 15,
    width: 15,
  },

  rowImageContainer: {
    height: 125,
    width: viewportWidth / 2 - 25,
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: Colors.theme,
    borderRadius: 10,
    shadowColor: Colors.black,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 0},
    elevation: 2,
  },
  rowImageView: {
    height: 125,
    width: viewportWidth / 2 - 25,
    borderRadius: 10,
    justifyContent: 'center',
  },
  rowCloseBack: {
    position: 'absolute',
    height: 25,
    width: 25,
    borderRadius: 15,
    right: 1,
    justifyContent: 'center',
    backgroundColor: Colors.white,
    elevation: 5,
  },
  rowCloseImage: {
    height: 10,
    width: 10,
    alignSelf: 'center',
    tintColor: Colors.theme,
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  addContainer: {
    flexDirection: 'row',
    marginStart: 10,
    marginTop: 5,
  },
  add_btn: {
    backgroundColor: Colors.theme,
    height: 25,
    width: 25,
    marginStart: 5,
    marginEnd: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 13,
  },
  add_txt: {
    color: Colors.theme,
    fontSize: 15,
    fontFamily: Fonts.MontserratMedium,
    alignSelf: 'center',
  },
  addIcon: {
    justifyContent: 'center',
    alignSelf: 'center',
    height: 15,
    width: 15,
    tintColor: Colors.white,
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
});
