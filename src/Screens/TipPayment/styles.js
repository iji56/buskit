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

  profileImageStyle: {
    height: 130,
    width: viewportWidth - 40,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 15,
    alignSelf: 'center',
  },
  nameText: {
    fontSize: 18,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.black,
    alignSelf: 'center',
    marginHorizontal: 20,
    marginBottom: 25,
  },
  headerText: {
    fontSize: 15,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.black,
    marginHorizontal: 20,
  },
  messageText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratLight,
    color: Colors.black,
    alignSelf: 'center',
    textAlign: 'center',
    marginHorizontal: 20,
  },

  rowContainer: {
    //flexDirection: 'row',
    marginHorizontal: 20,
  },
  rowViewStyle: {
    //width: 55,
    marginEnd: 8,
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: Colors.black,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 0},
    elevation: 3,
  },
  rowActiveStyle: {
    //width: 55,
    marginEnd: 8,
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: Colors.theme,
    backgroundColor: Colors.theme,
    shadowColor: Colors.black,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 0},
    elevation: 3,
  },
  rowInactiveText: {
    fontSize: 12,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.black,
    alignSelf: 'center',
  },
  rowActiveText: {
    fontSize: 12,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.white,
    alignSelf: 'center',
  },

  editContainer: {
    height: 45,
    marginTop: -10,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  inputContainer: {
    paddingRight: 0,
    paddingLeft: 0,
  },
  leftIcon: {
    position: 'absolute',
    top: 25,
    left: 0,
    height: 18,
    width: 18,
  },

  payContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 20,
  },
  payImageStyle: {
    height: 50,
    width: 90,
  },
  changeText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.blackdark,
    marginEnd: 5,
  },
  dropIconStyle: {
    height: 15,
    width: 15,
    alignSelf: 'center',
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
  btnInactiveContainer: {
    marginHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
    height: 45,
    backgroundColor: Colors.grey,
    justifyContent: 'center',
    borderRadius: 5,
  },
  btnText: {
    fontSize: 16,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.white,
    alignSelf: 'center',
  },

  sheet_headContainer: {
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sheet_head_text: {
    fontSize: 16,
    color: Colors.theme,
    fontFamily: Fonts.MontserratMedium,
  },
  container_sheet_row: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: Colors.offWhite,
    borderColor: Colors.grey,
    borderTopWidth: 0.5,
  },
  container_sheet_text: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  sheet_text_view: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: Fonts.MontserratSemiBold,
  },
  payment_pic: {
    height: 35,
    width: 35,
    borderRadius: 35,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 4},
    elevation: 5,
  },
});
