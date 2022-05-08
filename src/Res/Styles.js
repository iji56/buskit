import {StyleSheet, Dimensions, Platform} from 'react-native';
import Colors from './Colors';
import {scale} from '../Config/ResponsiveScreen';
import Fonts from './Fonts';

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
    height: 60,
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
    fontSize: 18,
    alignSelf: 'center',
    fontFamily: Fonts.MontserratRegular,
    color: Colors.white,
  },
  viewStyle: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerStyle: {
    flexDirection: 'row',
    backgroundColor: Colors.theme,
    height: IS_ANDROID ? 50 : 44,
    alignItems: 'center',
  },
  headerStartBtn: {
    marginStart: 10,
    height: scale(30),
    width: scale(40),
    tintColor: Colors.white,
  },
  headerEndBtn: {
    marginEnd: 10,
    height: scale(30),
    width: scale(40),
    tintColor: Colors.white,
  },
  headerEndTxt: {
    paddingHorizontal: 15,
    color: Colors.white,
    fontFamily: Fonts.MontserratRegular,
    fontSize: scale(18),
  },
  headerTitle: {
    color: Colors.white,
    fontFamily: Fonts.MontserratSemiBold,
    fontSize: scale(22),
    flex: 1,
    textAlign: 'center',
  },
  curveViewStyle: {
    backgroundColor: Colors.white,
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
  },
  toastStyle: {
    backgroundColor: Colors.theme,
    position: 'absolute',
    bottom: -20,
  },
  toastTextStyle: {
    fontFamily: Fonts.MontserratMedium,
    color: Colors.white,
  },
  loaderStyle: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  flatlistDivider: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.blacklight,
  },
  emtyViewStyle: {
    backgroundColor: Colors.theme,
    height: 60,
  },

  emptyViewFull: {
    height: viewportHeight,
    width: viewportWidth,
    justifyContent: 'center',
    backgroundColor: Colors.offWhite,
  },
  emptyView: {
    height: viewportHeight - 150,
    width: viewportWidth,
    justifyContent: 'center',
    backgroundColor: Colors.offWhite,
  },
  ImageStyle: {
    height: 120,
    width: 120,
    alignSelf: 'center',
  },
  EmptyText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    textAlign: 'center',
    color: Colors.grey,
  },

  //lcation styles
  placesInputContainer: {
    height: 50,
    //paddingStart: 20,
    //borderRadius: 25,
    //borderWidth: 0.5,
    //borderColor: Colors.grey,
    //backgroundColor: 'transparent',
  },
  placesInputText: {
    height: 40,
    marginTop: 5,
    fontSize: 16,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.black,
  },
  poweredContainer: {
    marginTop: 10,
    justifyContent: 'center',
  },

  //payment styles
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  ViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  WebViewStyle: {
    width: viewportWidth,
    height: viewportHeight,
    justifyContent: 'center',
  },
  LoadingTextStyle: {
    color: Colors.black,
    fontFamily: Fonts.MontserratRegular,
    fontSize: 18,
    textAlign: 'center',
  },
  LoadingDoneStyle: {
    color: Colors.theme,
    fontFamily: Fonts.MontserratLight,
    fontSize: 14,
    textAlign: 'center',
  },

  titleTxt: {
    flex: 1,
    fontSize: 18,
    alignSelf: 'center',
    fontFamily: Fonts.MontserratRegular,
    color: Colors.white,
  },
  doneTxt: {
    fontSize: 14,
    alignSelf: 'center',
    fontFamily: Fonts.MontserratRegular,
    color: Colors.white,
  },
  doneTextBack: {
    height: 30,
    width: 40,
    marginHorizontal: 15,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  map: {
    //...StyleSheet.absoluteFillObject,
    //flex: 1,
    height: viewportHeight,
    width: viewportWidth,
  },
});
