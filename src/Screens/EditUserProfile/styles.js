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

  editContainer: {
    flex: 1,
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
  headerText: {
    fontSize: 18,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.black,
    alignSelf: 'center',
    textAlign: 'center',
    marginHorizontal: 25,
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

  profileContainer: {
    marginVertical: 30,
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
