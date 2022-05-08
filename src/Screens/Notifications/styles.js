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
    backgroundColor: Colors.offWhite,
  },

  emptyView: {
    height: viewportHeight - 50,
    width: viewportWidth,
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  ImageStyle: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    tintColor: Colors.grey,
  },
  EmptyText: {
    fontSize: 14,
    marginTop: 15,
    fontFamily: Fonts.MontserratRegular,
    textAlign: 'center',
    color: Colors.grey,
  },

  rowContainer: {
    width: viewportWidth - 15,
    marginTop: 10,
    marginHorizontal: 5,
    padding: 15,
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: Colors.black,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 0},
    elevation: 5,
    backgroundColor: Colors.white,
  },
  detailViewStyle: {
    flex: 1,
  },
  nameTextStyle: {
    fontSize: 16,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.black,
  },
  typeTextStyle: {
    fontSize: 13,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.grey,
    marginTop: 3,
  },
  eventTextStyle: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.MontserratBold,
    color: Colors.black,
  },
  eventPriceStyle: {
    fontSize: 15,
    fontFamily: Fonts.MontserratBold,
    color: Colors.black,
  },
  descTextStyle: {
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.black,
    marginVertical: 5,
  },

  rowViewStyle: {
    margin: 10,
  },
  infoViewStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerViewStyle: {
    height: 1,
    marginHorizontal: 15,
    backgroundColor: Colors.offgrey,
  },
  rowIconStyle: {
    height: 15,
    width: 15,
    alignSelf: 'center',
    tintColor: Colors.theme,
  },
  detailTextStyle: {
    fontSize: 12,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.grey,
    alignSelf: 'flex-end',
    marginHorizontal: 10,
    marginVertical: 5,
  },

  tipContainer: {
    flex: 1,
    justifyContent: 'center',
    height: 45,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: Colors.theme,
  },
  tipText: {
    fontSize: 15,
    fontFamily: Fonts.MontserratMedium,
    alignSelf: 'center',
    color: Colors.white,
  },
});
