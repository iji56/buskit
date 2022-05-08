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
    height: 45,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 40,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 4},
    elevation: 10,
  },
  inputContainer: {
    height: 40,
    paddingLeft: 20,
    paddingRight: 45,
  },
  serchContainer: {
    position: 'absolute',
    top: 15,
    right: 20,
    height: 15,
    width: 15,
  },
  searchIconStyle: {
    height: 15,
    width: 15,
  },
  headText: {
    fontSize: 15,
    marginVertical: 15,
    marginHorizontal: 20,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.grey,
  },

  emptyView: {
    height: 150,
    width: viewportWidth,
    justifyContent: 'center',
  },
  ImageStyle: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    tintColor: Colors.grey,
  },
  EmptyText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    textAlign: 'center',
    color: Colors.grey,
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: viewportWidth - 25,
    marginVertical: 5,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 4},
    elevation: 5,
  },
  rowImageView: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  rowBannerView: {
    height: 60,
    width: 60,
    borderRadius: 10,
  },
  rowIconView: {
    height: 15,
    width: 15,
    tintColor: Colors.blackdark,
    marginEnd: 5,
  },
  detailViewStyle: {
    flex: 1,
    marginStart: 15,
    marginEnd: 10,
    justifyContent: 'center',
  },
  nameTextStyle: {
    fontSize: 16,
    fontFamily: Fonts.MontserratBold,
    color: Colors.black,
  },
  descTextStyle: {
    fontSize: 14,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.blackdark,
    marginTop: 3,
  },
  typeTextStyle: {
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.blackdark,
    marginTop: 3,
  },

  detailTextStyle: {
    fontSize: 12,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.grey,
  },
  rowIconStyle: {
    height: 15,
    width: 15,
    alignSelf: 'center',
    tintColor: Colors.theme,
  },

  dividerViewStyle: {
    height: 1,
    backgroundColor: Colors.offgrey,
  },

  btnContainer: {
    flex: 1,
    justifyContent: 'center',
    height: 45,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: Colors.theme,
  },
  btnText: {
    fontSize: 15,
    fontFamily: Fonts.MontserratMedium,
    alignSelf: 'center',
    color: Colors.white,
  },
});
