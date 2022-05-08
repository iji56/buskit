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

  scannerViewStyle: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  headerTorchView: {
    alignSelf: 'flex-start',
    position: 'absolute',
    marginTop: IS_IOS ? (viewportHeight >= 812 ? 60 : 35) : 20,
    left: 20,
  },
  headerCloseView: {
    alignSelf: 'flex-end',
    position: 'absolute',
    marginTop: IS_IOS ? (viewportHeight >= 812 ? 60 : 35) : 20,
    right: 20,
  },
  headerTorchIcon: {
    height: 25,
    width: 30,
    alignSelf: 'center',
    tintColor: Colors.white,
  },
  headerCloseIcon: {
    height: 20,
    width: 20,
    alignSelf: 'center',
    tintColor: Colors.white,
  },
  scanMarkerStyle: {
    height: viewportHeight >= 640 ? 250 : 250,
    width: viewportHeight >= 640 ? 250 : 250,
  },

  backCurveView: {
    height: 100,
    width: viewportWidth + 25,
    alignSelf: 'center',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    backgroundColor: Colors.theme,
  },
  cardViewStyle: {
    // height: IS_IOS ? viewportHeight - 220 : viewportHeight - 180,
    marginBottom: 80,
    width: viewportWidth - 25,
    position: 'absolute',
    alignSelf: 'center',
    //justifyContent: 'center',
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 4},
    elevation: 5,
  },

  editContainer: {
    height: 50,
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 40,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 4},
    elevation: 8,
  },
  inputContainer: {
    height: 45,
    paddingLeft: 45,
    paddingRight: 45,
  },
  searchContainer: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
  searchIcon: {
    height: 20,
    width: 20,
  },
  findContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  findIcon: {
    height: 20,
    width: 20,
  },

  tipsContainer: {
    flexDirection: 'column',
    marginVertical: 10,
    height: 140,
  },
  tipsTxtStyle: {
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 15,
    fontSize: 18,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.black,
  },
  EmptyText: {
    marginVertical: 10,
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    textAlign: 'center',
    alignSelf: 'center',
    color: Colors.grey,
  },

  scanContainer: {
    marginVertical: 20,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  scanImageStyle: {
    height: 180,
    width: 180,
    alignSelf: 'center',
  },
  scanTxtStyle: {
    color: Colors.black,
    fontFamily: Fonts.MontserratBold,
    fontSize: 16,
    marginVertical: 5,
    alignSelf: 'center',
  },
  subTxtStyle: {
    color: Colors.black,
    fontFamily: Fonts.MontserratMedium,
    fontSize: 14,
    alignSelf: 'center',
  },

  rowContainer: {
    width: 70,
    flexDirection: 'column',
    marginHorizontal: 5,
  },
  rowNameTxtStyle: {
    color: Colors.black,
    fontFamily: Fonts.MontserratMedium,
    fontSize: 12,
    marginVertical: 5,
    alignSelf: 'center',
    textAlign: 'center',
  },
  rowImageStyle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignSelf: 'center',
  },

  sheet_headContainer: {
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sheet_title_text: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: Fonts.MontserratSemiBold,
    alignSelf: 'center',
  },
  sheet_head_text: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.MontserratSemiBold,
    marginVertical: 10,
  },
  sheet_list_style: {
    marginVertical: 10,
  },
  sheetRowContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  sheetRowImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignSelf: 'center',
  },
  sheetRowStyle: {
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  sheetRowName: {
    color: Colors.black,
    fontFamily: Fonts.MontserratMedium,
    fontSize: 15,
  },
  sheetRowDesc: {
    color: Colors.grey,
    fontFamily: Fonts.MontserratRegular,
    fontSize: 12,
    marginTop: 3,
  },
  sheetEmptyText: {
    color: Colors.grey,
    fontFamily: Fonts.MontserratRegular,
    fontSize: 12,
    alignSelf: 'center',
    marginTop: 40,
  },
});
