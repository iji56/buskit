import React, {useState, useEffect, useRef} from 'react';
import {View, Image, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import CustomStatusBar from '../../Components/CustomStatusBar';
import styles from './styles';
import Colors from '../../Res/Colors';
import Swiper from 'react-native-swiper';

const Home = props => {
  const {imageURLs, pos} = props.route.params;
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(3);
  const [error, setError] = useState(false);
  const swiperRef = useRef(null);

  useEffect(() => {
    setImages(imageURLs);
    setIndex(pos);
    setTimeout(() => {
      swiperRef.current.scrollTo(pos, true);
    }, 300);
  }, []);

  renderImage = (image, index) => {
    return (
      <>
        {!error && (
          <Image
            style={styles.bannerImage}
            source={{uri: image}}
            onError={() => setError(true)}
            resizeMode="contain"
          />
        )}
        {error && (
          <Image
            style={styles.bannerImage}
            source={require('../../Assets/Images/thumbImage.png')}
            resizeMode="stretch"
          />
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.viewcontainer}>
      <CustomStatusBar color={Colors.theme} />
      <View style={styles.headerRowStyle}>
        <TouchableOpacity
          style={styles.backImageBack}
          activeOpacity={0.8}
          onPress={() => props.navigation.goBack()}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.titleText}>{'Image Gallery'}</Text>
        <View style={styles.backImageBack} />
      </View>
      <View style={styles.viewStyle}>
        <Swiper
          ref={swiperRef}
          showsButtons={false}
          loop={false}
          autoplay={false}
          showsPagination={true}
          overScrollMode={'never'}
          bounces={false}
          activeDotColor={Colors.theme}
          index={index}>
          {images.map((image, index) => renderImage(image, index))}
        </Swiper>
      </View>
    </SafeAreaView>
  );
};

export default Home;
