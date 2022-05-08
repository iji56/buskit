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
    justifyContent: 'center',
  },

  loaderStyle: {
    flex: 1,
    color: Colors.theme,
    justifyContent: 'center',
  },

  sendContainer:{
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    marginEnd: 15,
  },
  sendBtnStyle: {
    fontSize: 16,
    fontFamily: Fonts.MontserratSemiBold,
    textAlign: 'center',
    color: Colors.lightblue,
  },

  emptyView: {
    height: viewportHeight - 50,
    width: viewportWidth,
    justifyContent: 'center',
    backgroundColor: Colors.white,
    transform: [{scaleY: -1}],
  },
  ImageStyle: {
    height: 100,
    width: 100,
    alignSelf: 'center',
  },
  EmptyText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    textAlign: 'center',
    color: Colors.grey,
  },
});
