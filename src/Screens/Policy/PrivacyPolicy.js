import React from 'react';
// import i18n from 'i18n-js';
// import { keyboardProps } from "../Auth/SignUpScreen";
import {WebView} from 'react-native-webview';
// import API from "../../api";
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  Platform,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';

import {Colors} from '../../Res/Colors';
import {DotIndicator} from 'react-native-indicators';

export default class PrivacyPolicy extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: `${navigation.state.params.title}`,
  });

  state = {
    isLoaded: true,
    uri: false,
  };

  componentDidMount() {
    const action = this.props.route.params.action;

    console.warn('--->', action);
    if (action === 'term') {
      this.setState({
        uri:
          'https://www.busk-it.com/privacy-policy',
      });
    } else {
      this.setState({
        uri: 'https://www.busk-it.com/privacy-policy',
      });
    }
  }

  renderLoading = () => {
    return (
      <View
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 'auto',
          marginBottom: 'auto',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          justifyContent: 'center',
        }}>
     
          <DotIndicator color={'red'} size={15} count={4} />
      </View>
    );
  };

  render() {
    let {uri} = this.state;
    // const source = require('../../../assets/PDF/PRIVACY_POLICY.pdf');

    if (!uri) return null;

    return (
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            backgroundColor: 'white',
            flexDirection: 'row',
            padding: 3,
            alignItems: 'center',
            elevation: 10,
            height: 50,
            zIndex: 2,
          }}>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => this.props.navigation.pop()}>
            <Image
              resizeMode={'contain'}
              style={{
                height: 20,
                width: 30,
                marginStart: 10,
                tintColor: '#fff',
              }}
              source={require('../../Assets/Images/back_arrow.png')}
            />
            <Text style={{color: '#fff'}}>{this.props.route.params.title}</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>
          {/* {!this.state.isLoaded && <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, }}/>} */}
          <View style={{flex: 1}}>
           
              <WebView
                style={{flex: 1}}
                source={{uri}}
                onLoad={() => this.setState({isLoaded: false})}
                // renderLoading={this.renderLoading}
                // startInLoadingState={true}
              />
            
          </View>
        </View>

        {this.state.isLoaded && this.renderLoading()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  d: {
    fontWeight: 'bold',
    color: '#FD3477',
    fontSize: 17,
    paddingHorizontal: 15,
  },
});
