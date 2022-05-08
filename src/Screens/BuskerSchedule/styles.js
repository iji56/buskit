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
  calendarHeader:{
    fontSize: 16,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.black,
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 15,
  },
  eventHeader:{
    fontSize: 16,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.black,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
    backgroundColor: Colors.offgrey,
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

  emptyView: {
    height: 200,
    width: viewportWidth,
    justifyContent: 'center',
    backgroundColor: Colors.white,
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
