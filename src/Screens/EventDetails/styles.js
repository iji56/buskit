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
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: Fonts.MontserratMedium,
    color: Colors.white,
  },
  viewStyle: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  eventContainer: {
    flex: 1,
    margin: 15,
    borderRadius: 10,
    shadowColor: Colors.black,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 0},
    elevation: 5,
    backgroundColor: Colors.white,
  },
  bannerConatiner: {
    height: 180,
    width: viewportWidth - 30,
    alignSelf: 'center',
  },
  bannerStyle: {
    height: 180,
    width: viewportWidth - 30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  detailViewStyle: {
    //width: viewportWidth - 15,
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 5,
    marginHorizontal: 15,
  },
  eventTextStyle: {
    fontSize: 16,
    fontFamily: Fonts.MontserratBold,
    color: Colors.black,
  },
  descTextStyle: {
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.black,
    marginTop: 5,
  },
  detailRowStyle: {
    flex: 1,
    marginHorizontal: 15,
    justifyContent: 'center',
  },
  rowImageStyle: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  nameTextStyle: {
    fontSize: 15,
    fontFamily: Fonts.MontserratBold,
    color: Colors.black,
  },
  typeTextStyle: {
    fontSize: 12,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.grey,
    marginTop: 3,
  },

  rowViewStyle: {
    marginVertical: 20,
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateViewStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 15,
    marginHorizontal: 15,
  },
  timeViewStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 15,
    marginHorizontal: 15,
  },
  infoViewStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 15,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  rowIconStyle: {
    height: 15,
    width: 15,
  },
  detailTextStyle: {
    fontSize: 14,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.blackdark,
    alignSelf: 'center',
    marginHorizontal: 5,
  },

  dividerViewStyle: {
    height: 1,
    marginTop: 10,
    marginHorizontal: 15,
    backgroundColor: Colors.offgrey,
  },

  tipContainer: {
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

  rowImageContainer: {
    height: 120,
    width: viewportWidth / 2 - 40,
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: Colors.theme,
    borderRadius: 10,
    shadowColor: Colors.black,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 0},
    elevation: 4,
  },
  rowImageView: {
    height: 120,
    width: viewportWidth / 2 - 40,
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
});
