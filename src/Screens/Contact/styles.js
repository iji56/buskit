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

  headText: {
    fontSize: 14,
    marginVertical: 15,
    marginHorizontal: 15,
    fontFamily: Fonts.MontserratBold,
    color: Colors.black,
  },
  descText: {
    fontSize: 14,
    marginTop: 15,
    marginHorizontal: 15,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.grey,
  },

  editContainer: {
    marginHorizontal: 20,
    height: 50,
    marginTop: 10,
  },
  editBoxContainer: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  inputContainer: {
    paddingHorizontal: 10,
  },
  editIcon: {
    position: 'absolute',
    top: 25,
    left: 0,
    height: 18,
    width: 18,
    tintColor: Colors.black,
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
    flexDirection: 'row',
    width: viewportWidth - 30,
    marginVertical: 10,
  },
  rowImageView: {
    height: 50,
    width: 50,
    borderRadius: 30,
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
    bottom: 0,
    // position: 'absolute',
    justifyContent: 'center',
    height: 45,
    width: viewportWidth - 40,
    margin: 20,
    backgroundColor: Colors.theme,
  },
  btnText: {
    fontSize: 16,
    fontFamily: Fonts.MontserratMedium,
    alignSelf: 'center',
    color: Colors.white,
  },
});
