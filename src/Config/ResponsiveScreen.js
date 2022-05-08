import { Platform, Dimensions, PixelRatio } from 'react-native';

// Retrieve initial screen's width & height
const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

// Guideline sizes are based on standard ~iPhoneX" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const widthPercentageToDP = widthPercent => {
  const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel(SCREEN_WIDTH * elemWidth / 100);
};

const heightPercentageToDP = heightPercent => {
  const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel(SCREEN_HEIGHT * elemHeight / 100);
};

const scale = size => {
  const newSize = SCREEN_WIDTH * size / guidelineBaseWidth; 
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export {
  widthPercentageToDP,
  heightPercentageToDP,
  scale
};