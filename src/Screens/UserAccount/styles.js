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
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: Fonts.MontserratMedium,
    color: Colors.white,
  },
  viewStyle: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  profileContainer: {
    width: viewportWidth,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.theme,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageStyle: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },

  detailContainer: {
    marginTop: 15,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  detailRowStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  detailIconStyle: {
    height: 12,
    width: 12,
    marginHorizontal: 5,
    alignSelf: 'center',
  },
  nameTxtStyle: {
    color: Colors.white,
    fontFamily: Fonts.MontserratBold,
    fontSize: 18,
  },
  emailTxtStyle: {
    color: Colors.whiteTrans,
    fontFamily: Fonts.MontserratSemiBold,
    fontSize: 14,
    alignSelf: 'center',
  },

  bottomRowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  bottomViewStyle: {
    flexDirection: 'row',
    marginEnd: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: Colors.whiteTrans,
    borderWidth: 1,
    borderRadius: 8,
  },
  btnImageStyle: {
    height: 12,
    width: 12,
    marginEnd: 5,
    alignSelf: 'center',
    tintColor: Colors.whiteTrans,
  },
  btnTextStyle: {
    color: Colors.whiteTrans,
    fontFamily: Fonts.MontserratBold,
    fontSize: 12,
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  rowTopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.boxgrey,
  },
  rowOpenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderWidth: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderColor: Colors.boxgrey,
  },
  rowContainer: {
    marginHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderColor: Colors.boxgrey,
    borderTopColor: 'transparent',
  },
  rowViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  // rowContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   marginHorizontal: 15,
  //   marginBottom: 10,
  //   paddingHorizontal: 10,
  //   paddingVertical: 15,
  //   borderWidth: 2,
  //   borderRadius: 10,
  //   borderColor: Colors.boxgrey,
  // },
  rowImageStyle: {
    height: 15,
    width: 15,
    tintColor: Colors.black,
    marginEnd: 10,
  },
  rowHeadTxtStyle: {
    flex: 1,
    marginHorizontal: 15,
    marginBottom: 10,
    fontFamily: Fonts.MontserratSemiBold,
    fontSize: 14,
    color: Colors.offgrey,
  },
  rowSubTxtStyle: {
    flex: 1,
    color: Colors.blackdark,
    fontFamily: Fonts.MontserratSemiBold,
    fontSize: 14,
    marginEnd: 25,
  },
  rowIconStyle: {
    height: 15,
    width: 15,
    tintColor: Colors.black,
    alignSelf: 'center',
  },
  rowIconRotate: {
    height: 15,
    width: 15,
    tintColor: Colors.black,
    alignSelf: 'center',
    transform: [{rotate: '180deg'}],
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.boxgrey,
  },

  switchInnerColor: {
    borderColor: Colors.theme,
    borderWidth: 5,
  },
  switchInnerGrey: {
    borderColor: Colors.grey,
    borderWidth: 5,
  },
  switchOuterCircle: {
    alignContent: 'center',
    justifyContent: 'center',
  },

  cmsRowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  cmsRowViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 10,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: Colors.theme,
  },
  cmsRowTxtStyle: {
    color: Colors.theme,
    fontFamily: Fonts.MontserratSemiBold,
    fontSize: 14,
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
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  modalImageBack: {
    height: 120,
    width: 120,
    borderRadius: 100,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.offgrey,
  },
  modalImageStyle: {
    height: 100,
    width: 100,
    alignSelf: 'center',
  },
  modalHeadText: {
    color: Colors.black,
    fontFamily: Fonts.MontserratBold,
    fontSize: 22,
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  modalMsgText: {
    color: Colors.grey,
    fontFamily: Fonts.MontserratMedium,
    fontSize: 14,
    textAlign: 'center',
    alignSelf: 'center',
    marginVertical: 5,
  },
});
