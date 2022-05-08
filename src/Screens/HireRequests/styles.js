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
  rowImageStyle: {
    height: 60,
    width: 60,
    borderRadius: 35,
  },
  rowViewStyle: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameTextStyle: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.MontserratBold,
    color: Colors.black,
  },
  priceTextStyle: {
    fontSize: 14,
    fontFamily: Fonts.MontserratBold,
    color: Colors.black,
  },
  emailTextStyle: {
    fontSize: 13,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.grey,
  },

  dividerViewStyle: {
    height: 1,
    marginHorizontal: 15,
    backgroundColor: Colors.offgrey,
  },

  detailViewStyle: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  detailRowView: {
    flexDirection: 'row',
    marginTop: 5,
  },
  eventTextStyle: {
    fontSize: 14,
    fontFamily: Fonts.MontserratBold,
    color: Colors.black,
  },
  eventSubTextStyle: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.blackdark,
    marginTop: 2,
  },
  eventDateTextStyle: {
    fontSize: 13,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.blackdark,
    marginTop: 2,
  },
  descTextStyle: {
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.black,
    marginTop: 5,
    marginBottom: 10,
  },

  btnViewContainer: {
    height: 45,
    flexDirection: 'row',
  },
  rejectContainer: {
    flex: 1,
    justifyContent: 'center',
    height: 45,
    backgroundColor: Colors.black,
    borderBottomLeftRadius: 10,
  },
  rejectText: {
    fontSize: 15,
    fontFamily: Fonts.MontserratMedium,
    alignSelf: 'center',
    color: Colors.white,
  },
  acceptContainer: {
    flex: 1,
    justifyContent: 'center',
    height: 45,
    backgroundColor: Colors.green,
    borderBottomRightRadius: 10,
  },
  acceptText: {
    fontSize: 15,
    fontFamily: Fonts.MontserratMedium,
    alignSelf: 'center',
    color: Colors.white,
  },
});
