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
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: Fonts.MontserratMedium,
    color: Colors.white,
  },
  editContainer: {
    marginHorizontal: 15,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  editText: {
    fontSize: 16,
    alignSelf: 'center',
    fontFamily: Fonts.MontserratRegular,
    color: Colors.white,
  },
  viewStyle: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  backCurveView: {
    height: 100,
    width: viewportWidth + 25,
    alignSelf: 'center',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    backgroundColor: Colors.theme,
  },
  parentViewStyle: {
    flex: 1,
    //position: 'absolute',
  },
  paymentContainer: {
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  cardViewStyle: {
    //position: 'absolute',
    width: viewportWidth - 25,
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 4},
    elevation: 8,
  },
  profileContainer: {
    flexDirection: 'column',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  profileImageStyle: {
    height: 70,
    width: 70,
    borderRadius: 40,
    alignSelf: 'center',
  },
  nameTxtStyle: {
    color: Colors.black,
    fontFamily: Fonts.MontserratBold,
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
    alignSelf: 'center',
  },
  subTxtStyle: {
    color: Colors.grey,
    fontFamily: Fonts.MontserratMedium,
    fontSize: 14,
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: 5,
  },
  genreContainer: {
    flexDirection: 'column',
    marginVertical: 10,
    marginHorizontal: 15,
  },
  genreTxtStyle: {
    color: Colors.red,
    fontFamily: Fonts.MontserratSemiBold,
    fontSize: 18,
    alignSelf: 'center',
    marginBottom: 5,
  },
  descTxtStyle: {
    color: Colors.blackdark,
    fontFamily: Fonts.MontserratRegular,
    fontSize: 14,
    alignSelf: 'center',
    textAlign: 'center',
  },

  dividerStyle: {
    height: 1,
    backgroundColor: Colors.offgrey,
  },

  socialViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 40,
    alignSelf: 'center',
  },
  socialConatiner: {
    height: 30,
    width: 30,
    marginHorizontal: 8,
    alignSelf: 'center',
  },
  socialImageStyle: {
    height: 30,
    width: 30,
    alignSelf: 'center',
    //tintColor: Colors.black,
  },

  rowViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  rowIconStyle: {
    height: 20,
    width: 20,
    tintColor: Colors.black,
    alignSelf: 'center',
  },
  rowValueTxtStyle: {
    color: Colors.grey,
    fontFamily: Fonts.MontserratSemiBold,
    fontSize: 13,
    marginStart: 5,
    alignSelf: 'center',
  },

  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.boxgrey,
  },
  detailViewStyle: {
    flex: 1,
    marginStart: 10,
  },
  rowHeadTxtStyle: {
    color: Colors.black,
    fontFamily: Fonts.MontserratSemiBold,
    fontSize: 16,
    marginHorizontal: 10,
    marginTop: 15,
    marginBottom: 5,
  },
  rowNameTxtStyle: {
    color: Colors.black,
    fontFamily: Fonts.MontserratSemiBold,
    fontSize: 16,
  },
  rowDescTxtStyle: {
    color: Colors.grey,
    fontFamily: Fonts.MontserratMedium,
    fontSize: 14,
    marginTop: 5,
  },
  rowImageStyle: {
    height: 30,
    width: 40,
    alignSelf: 'center',
  },
});
