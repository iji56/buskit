import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  Linking,
  Alert,
  AsyncStorage,
  SafeAreaView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import styles from './styles';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';
import I18n from '../../Config/I18n';

const Home = props => {
  const {user} = props.route.params;
  const [profile, setProfile] = useState('');
  const [name, setName] = useState('Busker Name');
  const [username, setUserName] = useState('stagename');
  const [address, setAddress] = useState('');
  const [genreId, setGenreId] = useState(0);
  const [genre, setGenre] = useState('Artist');
  const [othergenre, setOtherGenre] = useState(null);
  const [bio, setBio] = useState('');
  const [posts, setPosts] = useState('0');
  const [fans, setFans] = useState('0');
  const [picUri, setPicUri] = useState('');

  const [twitterUrl, setTwitter] = useState('');
  const [instagramUrl, setInstagram] = useState('');
  const [facebookUrl, setFacebook] = useState('');
  const [youtubeUrl, setYoutube] = useState('');
  const [soundcloudUrl, setSoundCloud] = useState('');
  const [appleMusicUrl, setAppleMusic] = useState('');
  const [spotifyUrl, setSpotify] = useState('');

  const [paypalActive, setPaypalActive] = useState(false);
  const [stripeActive, setStripeActive] = useState(false);
  const [paypalAccount, setPaypalAccount] = useState('');
  const [stripeAccount, setStripeAccount] = useState('');

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    setProfile(user);
    console.log("user data is following::::::::::::::",JSON.stringify(user))
    setData(user);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Preload data using AsyncStorage
      AsyncStorage.getItem('UserDetails', (err, result) => {
        if (err === null) {
          let res = JSON.parse(result);
          //setUser(res);
          PaymentDetailApi(res);
        }
      });
    }, []),
  );

  const setData = data => {
    setName(data.name);
    if (data.stagename != null) setUserName(data.stagename);
    if (data.address != null) setAddress(data.address);
    if (data.genersdata != null) {
      setGenreId(data.genersdata.id);
      setGenre(data.genersdata.name);
    }
    if (data.other_cat_name != null) setOtherGenre(data.other_cat_name);
    if (data.busker_bio != null) setBio(data.busker_bio);
    if (data.profile_img != null) setPicUri(data.profile_img);
    if (data.total_fans != null) setFans(data.total_fans);
    if (data.total_posts != null) setPosts(data.total_posts);

    if (data.twitter_url != null) setTwitter(data.twitter_url);
    if (data.instagram_url != null) setInstagram(data.instagram_url);
    if (data.facebook_url != null) setFacebook(data.facebook_url);
    if (data.youtube_url != null) setYoutube(data.youtube_url);
    if (data.soundcloud_url != null) setSoundCloud(data.soundcloud_url);
    if (data.applemusic_url != null) setAppleMusic(data.applemusic_url);
    if (data.spotify_url != null) setSpotify(data.spotify_url);
  };

  const callback = () => {
    BuskerDetailApi();
  };

  const OpenURLButton = async url => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
    // useCallback(async () => {}, [url]);
    // return <Button title={children} onPress={handlePress} />;
  };

  //******************** Hit BuskerDetail Api *******************
  const BuskerDetailApi = async data => {
    setLoading(true);
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.getBusker + user.id,
    );
    timeout(
      10000,
      fetch(
        constants.baseUrl + constants.api.getBusker + '?busker_id=' + user.id,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
          },
        },
      ),
    )
      .then(processResponse)
      .then(res => {
        const {responseCode, responseJson} = res;
        console.log(
          'response',
          responseCode + '' + JSON.stringify(responseJson),
        );
        setLoading(false);
        if (responseCode === 200) {
          if (responseJson.success == 'true') {
            var data = responseJson.data;
            setData(data);
            setProfile(data);
            AsyncStorage.mergeItem('UserDetails', JSON.stringify(data));
          } else {
            toast.current.show(responseJson.message, 2000, () => {});
          }
        } else {
          if (responseJson.hasOwnProperty('message')) {
            toast.current.show(responseJson.message, 2000, () => {});
          } else {
            var key;
            var secondKey;
            for (var k in responseJson) {
              key = k;
              break;
            }
            for (var k in responseJson[key]) {
              secondKey = k;
              break;
            }
            toast.current.show(responseJson[key][secondKey][0], 2000, () => {});
          }
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        toast.current.show(err.message, 2000, () => {});
      });
  };

  //******************** Hit PaymentDetail Api *******************
  const PaymentDetailApi = async user => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.paymentDetails);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.paymentDetails, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.access_token}`,
        },
      }),
    )
      .then(processResponse)
      .then(res => {
        const {responseCode, responseJson} = res;
        console.log(
          'response',
          responseCode + '' + JSON.stringify(responseJson),
        );
        setLoading(false);
        if (responseCode === 200) {
          if (responseJson.success) {
            var data = responseJson.data;
            // if (data.hasOwnProperty('busker_stripe_account')) {
            //   setStripeActive(true);
            //   setStripeAccount(data.busker_stripe_account.stripe_account_id);
            //   StripeStatusApi(user);
            // }
            if (data.hasOwnProperty('busker_paypal_account')) {
              setPaypalActive(true);
              setPaypalAccount(data.busker_paypal_account.email);
            }
          } else {
            toast.current.show(
              'You have not set up your tipping account',
              2000,
              () => {},
            );
            //toast.current.show(responseJson.message, 2000, () => {});
          }
        } else {
          if (responseJson.hasOwnProperty('message')) {
            toast.current.show(responseJson.message, 2000, () => {});
          } else {
            var key;
            var secondKey;
            for (var k in responseJson) {
              key = k;
              break;
            }
            for (var k in responseJson[key]) {
              secondKey = k;
              break;
            }
            toast.current.show(responseJson[key][secondKey][0], 2000, () => {});
          }
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        toast.current.show(err.message, 2000, () => {});
      });
  };

  //******************** Hit StripeStatus Api *******************
  const StripeStatusApi = async user => {
    setLoading(true);
    console.log(
      'ApiCall',
      constants.baseUrl + constants.api.stripeAccountStatus,
    );
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.stripeAccountStatus, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          //'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.access_token}`,
        },
      }),
    )
      .then(processResponse)
      .then(res => {
        const {responseCode, responseJson} = res;
        console.log(
          'response',
          responseCode + '' + JSON.stringify(responseJson),
        );
        setLoading(false);
        if (responseCode === 200) {
          if (responseJson.status == 'Success') {
            toast.current.show('Stripe Account is Active', 2000, () => {});
          } else {
            toast.current.show(responseJson.message, 2000, () => {});
          }
        } else {
          if (responseJson.hasOwnProperty('message')) {
            toast.current.show(responseJson.message, 2000, () => {});
          } else {
            var key;
            var secondKey;
            for (var k in responseJson) {
              key = k;
              break;
            }
            for (var k in responseJson[key]) {
              secondKey = k;
              break;
            }
            toast.current.show(responseJson[key][secondKey][0], 2000, () => {});
          }
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        toast.current.show(err.message, 2000, () => {});
      });
  };

  return (
    <SafeAreaView style={styles.viewcontainer}>
      <CustomStatusBar color={Colors.theme} />
      <View style={styles.headerRowStyle}>
        <TouchableOpacity
          style={styles.backImageBack}
          onPress={() => {
            props.navigation.goBack();
          }}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.titleText}>{I18n.t('artist.artist_profile')}</Text>
        <TouchableOpacity
          style={styles.editContainer}
          onPress={() =>
            props.navigation.navigate('EditBuskerProfile', {
              profile: profile,
              callback: callback,
            })
          }>
          <Text style={styles.editText}>{I18n.t('common.edit_btn')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.viewStyle}>
        {/* Curve View Container */}
        {/* <View style={styles.backCurveView} /> */}
        <ScrollView
          style={styles.parentViewStyle}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps={'handled'}
          overScrollMode="never">
          {/* Card View Container */}
          <View style={styles.cardViewStyle}>
            {/* Profile Detail Container */}
            <View style={styles.profileContainer}>
              <View>
                <Image
                  style={styles.profileImageStyle}
                  source={require('../../Assets/Images/profileImage.png')}
                  resizeMode={'cover'}
                />
                <Image
                  style={[styles.profileImageStyle, {position: 'absolute'}]}
                  source={
                    picUri != null && picUri != ''
                      ? {uri: picUri}
                      : require('../../Assets/Images/profileImage.png')
                  }
                  resizeMode={'cover'}
                />
              </View>
              <Text style={styles.nameTxtStyle}>{name}</Text>
              <Text style={styles.subTxtStyle}>{'@' + username}</Text>
              {address != '' && (
                <Text
                  style={styles.subTxtStyle}
                  numberOfLines={2}
                  ellipsizeMode={'tail'}>
                  {address}
                </Text>
              )}
            </View>
            {/* Divider */}
            <View style={styles.dividerStyle} />
            {/* Genre Detail Container */}
            <View style={styles.genreContainer}>
              <Text style={styles.genreTxtStyle}>
                {othergenre != null ? othergenre : genre}
              </Text>
              {bio != '' && (
                <Text
                  style={styles.descTxtStyle}
                  numberOfLines={4}
                  ellipsizeMode={'tail'}>
                  {bio}
                </Text>
              )}
              {/* Social Container */}
              <View style={styles.socialViewStyle}>
                <TouchableOpacity
                  style={styles.socialConatiner}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (instagramUrl != '') OpenURLButton(instagramUrl);
                  }}>
                  <Image
                    style={styles.socialImageStyle}
                    resizeMode={'contain'}
                    source={require('../../Assets/Images/instagram_logo.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialConatiner}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (twitterUrl != '') OpenURLButton(twitterUrl);
                  }}>
                  <Image
                    style={styles.socialImageStyle}
                    resizeMode={'contain'}
                    source={require('../../Assets/Images/twitter_logo.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialConatiner}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (youtubeUrl != '') OpenURLButton(youtubeUrl);
                  }}>
                  <Image
                    style={styles.socialImageStyle}
                    resizeMode={'contain'}
                    source={require('../../Assets/Images/youtube_logo.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialConatiner}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (facebookUrl != '') OpenURLButton(facebookUrl);
                  }}>
                  <Image
                    style={styles.socialImageStyle}
                    resizeMode={'contain'}
                    source={require('../../Assets/Images/facebook_logo.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialConatiner}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (soundcloudUrl != '') OpenURLButton(soundcloudUrl);
                  }}>
                  <Image
                    style={styles.socialImageStyle}
                    resizeMode={'contain'}
                    source={require('../../Assets/Images/soundcloud_logo.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialConatiner}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (appleMusicUrl != '') OpenURLButton(appleMusicUrl);
                  }}>
                  <Image
                    style={styles.socialImageStyle}
                    resizeMode={'contain'}
                    source={require('../../Assets/Images/music_logo.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialConatiner}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (spotifyUrl != '') OpenURLButton(spotifyUrl);
                  }}>
                  <Image
                    style={styles.socialImageStyle}
                    resizeMode={'contain'}
                    source={require('../../Assets/Images/spotify_logo.png')}
                  />
                </TouchableOpacity>
              </View>
              {/* Posts Fans Container */}
              <View style={styles.rowViewStyle}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.rowContainer}
                  onPress={() => props.navigation.goBack()}>
                  <Image
                    style={styles.rowIconStyle}
                    resizeMode={'contain'}
                    source={require('../../Assets/Images/ic_camera.png')}
                  />
                  <Text style={styles.rowValueTxtStyle}>
                    {posts + ' Posts'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.rowContainer}
                  onPress={() =>
                    props.navigation.navigate('BuskerFans', {
                      callback: callback,
                    })
                  }>
                  <Image
                    style={styles.rowIconStyle}
                    resizeMode={'contain'}
                    source={require('../../Assets/Images/heart_empty.png')}
                  />
                  <Text style={styles.rowValueTxtStyle}>{fans + ' Fans'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* Payments Container */}
          <View style={styles.paymentContainer}>
            <Text style={styles.rowHeadTxtStyle}>
              {I18n.t('artist.payment_settings')}
            </Text>
            <TouchableOpacity
              style={styles.detailContainer}
              activeOpacity={0.8}
              onPress={() => {
                props.navigation.navigate('PaypalLogin');
              }}>
              <Image
                style={styles.rowImageStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/paypal_logo.png')}
              />
              <View style={styles.detailViewStyle}>
                <Text style={styles.rowNameTxtStyle}>
                  {I18n.t('artist.paypal_account')}
                </Text>
                {paypalActive && (
                  <Text style={styles.rowDescTxtStyle}>{paypalAccount}</Text>
                )}
              </View>
              <Text style={styles.rowDescTxtStyle}>
                {paypalActive ? I18n.t('common.edit_btn') : I18n.t('common.add_btn')}
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.detailContainer}
              activeOpacity={0.8}
              onPress={() => {
                props.navigation.navigate('BankDetails', {
                  type: stripeActive ? 2 : 1,
                });
              }}>
              <Image
                style={styles.rowImageStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/stripe_logo.png')}
              />
              <View style={styles.detailViewStyle}>
                <Text style={styles.rowNameTxtStyle}>
                  {I18n.t('artist.stripe_account')}
                </Text>
                {stripeActive && (
                  <Text style={styles.rowDescTxtStyle}>{stripeAccount}</Text>
                )}
              </View>
              <Text style={styles.rowDescTxtStyle}>
                {stripeActive
                  ? I18n.t('common.edit_btn')
                  : I18n.t('common.add_btn')}
              </Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </View>

      <Toast
        ref={toast}
        style={commonStyles.toastStyle}
        textStyle={commonStyles.toastTextStyle}
      />
      {isLoading && (
        <View style={commonStyles.loaderStyle}>
          <DotIndicator color={Colors.theme} size={15} count={4} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Home;
