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
  viewStyle: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  backCurveView: {
    height: 150,
    width: viewportWidth,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    backgroundColor: Colors.theme,
    justifyContent: 'center',
    //transform: [{scaleX: 2}],
  },
  headerMsgText: {
    fontSize: 20,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.white,
    alignSelf: 'center',
    textAlign: 'center',
  },

  logoStyle: {
    height: 80,
    width: 160,
    alignSelf: 'center',
    marginTop: 30,
  },
  imageStyle: {
    height: 150,
    width: 150,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },

  nameTxtStyle: {
    color: Colors.black,
    fontFamily: Fonts.MontserratBold,
    fontSize: 18,
    alignSelf: 'center',
  },
  subTxtStyle: {
    color: Colors.black,
    fontFamily: Fonts.MontserratMedium,
    fontSize: 14,
    marginVertical: 10,
    alignSelf: 'center',
  },
  rowIdContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 20,
  },
  idSubTxtStyle: {
    color: Colors.grey,
    fontFamily: Fonts.MontserratMedium,
    fontSize: 16,
    alignSelf: 'center',
  },
  idTxtStyle: {
    color: Colors.black,
    fontFamily: Fonts.MontserratSemiBold,
    fontSize: 16,
    alignSelf: 'center',
  },
  payHeadTxtStyle: {
    color: Colors.black,
    fontFamily: Fonts.MontserratBold,
    fontSize: 18,
    alignSelf: 'center',
  },
  payRowStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  payContainer: {
    width: 80,
    borderRadius: 5,
    borderColor: Colors.boxgrey,
    borderWidth: 1,
    paddingHorizontal: 0,
    marginHorizontal: 10,
    alignSelf: 'center',
  },
  payIconStyle: {
    height: 50,
    width: 70,
    alignSelf: 'center',
  },

  btnContainer: {
    height: 45,
    //width: 200,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.theme,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
  },
  btnText: {
    fontSize: 16,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.white,
    alignSelf: 'center',
  },
});
