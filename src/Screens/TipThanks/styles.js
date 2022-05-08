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
    height: 150,
    paddingTop:10,
    // height: IS_IOS ? 44 : 55,
    backgroundColor: Colors.theme,
  },
  backImageBack: {
    height: 30,
    width: 30,
    marginHorizontal: 15,
    backgroundColor: 'transparent',
    borderRadius: 20,
    justifyContent: 'center',
    // alignSelf: 'center',
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
    // alignSelf: 'center',
    fontFamily: Fonts.MontserratMedium,
    color: Colors.white,
  },
  viewStyle: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop:85
  },

  imageStyle: {
    height: 100,
    width: 100,
    borderRadius: 50,
    
    alignSelf: 'center',
  },
  nameText: {
    fontSize: 18,
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: Fonts.MontserratMedium,
    color: Colors.black,
    marginTop: 10,
  },
  msgText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.black,
    marginVertical: 5,
    marginHorizontal: 20,
    textAlign:'center',
    alignSelf:'center'
  },
  dateText: {
    fontSize: 12,
    alignSelf: 'center',
    fontFamily: Fonts.MontserratMedium,
    color: Colors.dimgrey,
    marginVertical: 15,
  },

  headerText: {
    fontSize: 16,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.blackdark,
    marginHorizontal: 20,
    marginTop: 40,
  },
  detailContainer: {
    marginHorizontal:20,
    marginVertical:10,
    paddingHorizontal:15,
    // paddingVertical:10,
    margin: 5,
    flexDirection: 'column',
    borderRadius: 10,
    shadowColor: Colors.black,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 0},
    elevation: 5,
    backgroundColor: Colors.white,
  },
  rowViewStyle: {
    flexDirection: 'row',
    alignItems:'center',
    paddingVertical:11,
    borderBottomWidth:1,
    borderBottomColor:'lightgray'
    
  },
  detailHeadText: {
    fontSize: 14,
    fontWeight:'600',
    fontFamily: Fonts.MontserratRegular,
    color: Colors.blackdark,
  },
  detailSubText: {
    flex:1,
    fontSize: 14,
    fontWeight:'700',
    textAlign:'right',
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.black,
  },
  detailSubTextAmount: {
    flex:1,
    fontSize: 14,
    fontWeight:'700',
    textAlign:'right',
    fontFamily: Fonts.MontserratSemiBold,
    color: '#50C878',
  },
  bottomView: {
    alignSelf: 'center',
  },
  btnContainer: {
    height: 45,
    width: viewportWidth - 40,
    marginVertical: 20,
    backgroundColor: Colors.theme,
    justifyContent: 'center',
    borderRadius: 5,
  },
  btnText: {
    fontSize: 18,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.white,
    alignSelf: 'center',
  },
});
