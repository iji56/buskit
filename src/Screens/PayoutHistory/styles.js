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
    marginTop: 15,
   
    flexDirection: 'row',
    borderRadius: 10,
    shadowColor: Colors.black,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 0},
    elevation: 5,
    backgroundColor: Colors.white,
  },
  rowImageStyle: {
    height: 120,
    width: 120,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent:'flex-start'
  },
  detailViewStyle: {
    flex: 1,
    margin: 10,
    justifyContent: 'center',
  },
  // rowViewStyle: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  nameTextStyle: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.black,
    alignSelf:'center',
  },
  timeTextStyle: {
    fontSize: 12,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.offgrey,
  },
  descTextStyle: {
    fontSize: 14,
    fontFamily: Fonts.MontserratLight,
    color: Colors.black,
    marginVertical: 5,
  },
  priceTextStyle: {
    fontSize: 18,
    fontFamily: Fonts.MontserratBold,
    color: Colors.black,
    alignSelf:'center',
  },
  viewTextStyle: {
    fontSize: 13,
    fontFamily: Fonts.MontserratMedium,
    color: 'blue',
  },
  tipsPageTextStyle:{
    textAlign:'center',
    color:'#50C878',
    fontSize:22,
    fontFamily: Fonts.MontserratBold,
  },
  payoutTextStyle: {
    fontSize: 12,
    marginVertical:15,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.offgrey,
    textAlign:'center',
    alignSelf:'center'
  },
  headerTipTextStyle: {
    fontSize: 12,
    marginBottom:6,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.offgrey,
    textAlign:'center',
    alignSelf:'center'
  },
  detailContainer: {
    width:250,
    paddingHorizontal:10,
    // paddingVertical:0,
    backgroundColor:'white'
  },
  rowViewStyle: {
    flexDirection: 'row',
    alignItems:'center',
    marginVertical: 5,
  },
  toolTipRowViewStyle: {
    flexDirection: 'row',
    alignItems:'center',
    // marginVertical: 5,
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
});
