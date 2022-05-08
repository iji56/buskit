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
  menuImageBack: {
    height: 30,
    width: 30,
    marginHorizontal: 15,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  menuText: {
    fontSize: 14,
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
  },
  EmptyText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    textAlign: 'center',
    color: Colors.grey,
  },

  rowContainer: {
    height: 150,
    width: viewportWidth / 2 - 25,
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: Colors.theme,
    borderRadius: 10,
    shadowColor: Colors.black,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 0},
    elevation: 2,
  },
  rowImageView: {
    height: 150,
    width: viewportWidth / 2 - 25,
    borderRadius: 10,
    justifyContent: 'center',
  },
  detailViewStyle: {
    flex: 1,
    marginHorizontal: 15,
    justifyContent: 'center',
  },
  nameTextStyle: {
    fontSize: 16,
    fontFamily: Fonts.MontserratBold,
    color: Colors.black,
  },
  descTextStyle: {
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.black,
    marginVertical: 5,
  },
  detailTextStyle: {
    fontSize: 12,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.grey,
  },
  rowIconBack: {
    position: 'absolute',
    height: 25,
    width: 25,
    borderRadius: 15,
    right: 1,
    justifyContent: 'center',
    backgroundColor: Colors.white,
    elevation: 5,
  },
  rowIconStyle: {
    height: 10,
    width: 10,
    alignSelf: 'center',
    tintColor: Colors.theme,
  },
  rowPlayImage: {
    height: 30,
    width: 30,
    alignSelf: 'center',
    tintColor: Colors.white,
    position: 'absolute',
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
