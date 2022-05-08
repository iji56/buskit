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

  editContainer: {
    //height: 45,
    margin: 10,
    borderRadius: 40,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 4},
    elevation: 8,
  },
  inputContainer: {
    height: 40,
    paddingLeft: 45,
    paddingRight: 15,
  },
  searchIcon: {
    position: 'absolute',
    top: 15,
    left: 15,
    height: 15,
    width: 15,
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
    margin: 5,
    borderRadius: 10,
    shadowColor: Colors.black,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 0},
    elevation: 5,
    backgroundColor: Colors.white,
  },
  rowBannerStyle: {
    width: viewportWidth - 15,
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  detailViewStyle: {
    width: viewportWidth - 15,
    justifyContent: 'center',
    bottom: 0,
    position: 'absolute',
    backgroundColor: Colors.blackTrans,
  },
  eventTextStyle: {
    fontSize: 14,
    fontFamily: Fonts.MontserratBold,
    color: Colors.white,
    marginVertical: 10,
    marginHorizontal: 15,
  },
  detailRowStyle: {
    flex: 1,
    marginHorizontal: 15,
    justifyContent: 'center',
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
  descTextStyle: {
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.black,
    marginVertical: 5,
  },

  rowViewStyle: {
    marginVertical: 10,
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
    marginHorizontal: 15,
    marginTop: 8,
  },
  timeViewStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: 15,
    marginTop: 8,
  },
  infoViewStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: 15,
    marginTop: 8,
    marginBottom: 15,
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

  fabBtnStyle: {
    position: 'absolute',
    width: 45,
    height: 45,
    borderRadius: 25,
    right: 20,
    bottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.theme,
  },
  fabIconStyle: {
    width: 20,
    height: 20,
    tintColor: Colors.white,
  },
});
