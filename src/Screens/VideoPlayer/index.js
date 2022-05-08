import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import CustomStatusBar from '../../Components/CustomStatusBar';
import styles from './styles';
import Colors from '../../Res/Colors';
import Video from 'react-native-video';

const Home = props => {
  const {videoURL} = props.route.params;
  const player = useRef(null);

  const onBuffer = () => {
    <ActivityIndicator />;
  };
  const videoError = () => {};

  return (
    // Within your render function, assuming you have a file called
    // "background.mp4" in your project. You can include multiple videos
    // on asingle screen if you like.
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
        <Text style={styles.titleText}>{'Video Player'}</Text>
        <View style={styles.backImageBack} />
      </View>
      <Video
        style={styles.backgroundVideo}
        source={{uri: videoURL}} // Can be a URL or a local file.
        ref={player} // Store reference
        rate={1.0} // Rate for video playback
        resizeMode={'contain'}
        poster={'https://imgur.com/eYsCWCF.png'}
        posterResizeMode={'contain'}
        onBuffer={onBuffer} // Callback when remote video is buffering
        onError={videoError} // Callback when video cannot be loaded
        controls={true}
      />
    </SafeAreaView>
  );
};

export default Home;
