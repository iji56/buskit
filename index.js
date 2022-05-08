/**
 * @format
 */

import {AppRegistry, Text, TextInput, Animated} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import React from 'react';
import {Provider as StoreProvider} from 'react-redux';
import configureStore from './src/Redux/Store';

const RNRedux = () => (
  <StoreProvider store={configureStore}>
    <App />
  </StoreProvider>
);
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = Text.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
Animated.Text.propTypes = Animated.Text.propTypes || Text.propTypes;
AppRegistry.registerComponent(appName.name, () => RNRedux);
AppRegistry.registerComponent(appName, () => RNRedux);
