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

  imageStyle: {
    height: 150,
    width: 150,
    alignSelf: 'center',
    marginBottom: 10,
  },
  titleText: {
    fontSize: 28,
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: Fonts.MontserratMedium,
    color: Colors.black,
  },
  msgText: {
    fontSize: 15,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 10,
    marginHorizontal: 40,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.grey,
  },
  noteText: {
    fontSize: 11,
    alignSelf: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.lightgrey,
  },

  headerText: {
    fontSize: 16,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.blackdark,
    marginHorizontal: 20,
    marginTop: 40,
  },
  detailContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: Colors.blackdark,
    padding: 10,
  },
  rowViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  detailHeadText: {
    fontSize: 14,
    alignSelf: 'center',
    fontFamily: Fonts.MontserratRegular,
    color: Colors.blackdark,
  },
  detailSubText: {
    fontSize: 14,
    alignSelf: 'center',
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.black,
  },
  txnSubText: {
    width: 200,
    fontSize: 14,
    alignSelf: 'center',
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.black,
  },

  bottomView: {
    position: 'absolute',
    bottom: 0,
  },
  btnContainer: {
    height: 45,
    width: viewportWidth - 40,
    marginVertical: 10,
    backgroundColor: Colors.theme,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 5,
  },
  btnText: {
    fontSize: 18,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.white,
    alignSelf: 'center',
  },
});
