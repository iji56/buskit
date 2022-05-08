import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  AsyncStorage,
  BackHandler,
} from 'react-native';
import WebView from 'react-native-webview';
import CustomStatusBar from './CustomStatusBar';
import Colors from '../Res/Colors';
import commonStyles from '../Res/Styles';
import Toast, {DURATION} from 'react-native-easy-toast';
import constants from '../Config/Constants';
//import {timeout, processResponse} from './CommonFunctions';

const StripeCheckout = props => {
  const {amount, receiverId, receiverName, noteDesc} = props.route.params;
  const {callback} = props.route.params;

  const [user, setUser] = useState('');
  // const [secretKey, setSecretKey] = useState(
  //   'sk_test_T74erGc5CiJvBG9qX7BTi3wT00TzaXHECc',
  // );
  const [secretKey, setSecretKey] = useState('');
  const [approvalUrl, setApprovalUrl] = useState(null);
  const [baseUrl, setBaseUrl] = useState(
    'https://projects.webbycentral.xyz/WC716/public/checkout/',
  );
  const [sessionId, setSessionId] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [status, setStatus] = useState('failed');

  const ref = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loadingType, setLoadingType] = useState(1);
  const toast = useRef(null);

  useEffect(() => {
    console.log(
      'pay data',
      `amount: ${amount}, id: ${receiverId}, name: ${receiverName}, note: ${noteDesc}`,
    );
    AsyncStorage.getItem('UserDetails', (err, result) => {
      if (err === null) {
        let res = JSON.parse(result);
        setUser(res);
        CredentialApi(res);
      }
    });
    // Create Token
    // makeSessionData(amount * 100,secretKey);
    // Back Button Handler
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  const handleBackButton = () => {
    if (canGoBack && ref) {
      ref.current.goBack();
      return true;
    }
    return false;
  };

  const makeSessionData = (amount, key) => {
    var details = {
      'payment_method_types[0]': 'card',
      'line_items[0][name]': 'Tip Busker',
      'line_items[0][description]': 'Appreciating Performance',
      'line_items[0][images][0]': 'https://imgur.com/Yl9Dji5.png',
      'line_items[0][amount]': amount,
      'line_items[0][currency]': 'usd',
      'line_items[0][quantity]': 1,
      success_url:
        'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://example.com/cancel',
    };
    // creating urlencoded form data
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    // token api call
    makeCkeckout(formBody, key);
  };

  const makeCkeckout = async (formData, secretKey) => {
    timeout(
      100000,
      fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${secretKey}`,
        },
        body: formData,
      }),
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('payment response', responseJson);
        if (responseJson.hasOwnProperty('error')) {
          console.log(
            'error 1--->',
            'error:' +
              responseJson.error.type +
              ',desc:' +
              responseJson.error.message,
          );
          callback(responseJson.error.message);
          props.navigation.goBack(null);
        } else {
          setSessionId(responseJson.id);
          setPaymentIntent(responseJson.payment_intent);
          setApprovalUrl(baseUrl + responseJson.id);
        }
      })
      .catch(err => {
        console.log('payment error', err);
        toast.current.show(err.message, 2000, () => {});
        callback(err.message);
        props.navigation.goBack(null);
      });
  };

  // getting pay data with access token for payment
  const getPayment = async () => {
    timeout(
      100000,
      fetch('https://api.stripe.com/v1/checkout/sessions/' + sessionId, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secretKey}`,
        },
      }),
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('payment response', responseJson);
        if (responseJson.hasOwnProperty('error')) {
          console.log(
            'error 1--->',
            'error:' +
              responseJson.error.type +
              ',desc:' +
              responseJson.error.message,
          );
          callback(responseJson.error.message);
          props.navigation.goBack(null);
        } else {
          setSessionId(responseJson.id);
          setPaymentIntent(responseJson.payment_intent);
          setCustomerId(responseJson.customer);
          setStatus('successful');
          checkoutApi(
            responseJson.payment_intent,
            responseJson.customer,
            'successful',
          );
        }
      })
      .catch(err => {
        console.log('payment error', err);
        toast.current.show(err.message, 2000, () => {});
        callback(err.message);
        props.navigation.goBack(null);
      });
  };

  //******************** Hit Checkout Api *****************
  const checkoutApi = async (id, customerId, status) => {
    let data = {
      transaction_id: id,
      customer_id: customerId,
      reciever_id: receiverId,
      reciever_name: receiverName,
      amount: amount,
      status: status,
      payment_method: 'stripe',
    };
    if (noteDesc != '') {
      data.notes = noteDesc;
    }
    console.log('ApiCall', constants.baseUrl + constants.api.transactions);
    console.log('form', JSON.stringify(data));
    timeout(
      30000,
      fetch(constants.baseUrl + constants.api.transactions, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify(data),
      }),
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('Response', responseJson);
        if (responseJson.success) {
          console.log('payment entry succesfull');
          props.navigation.navigate('TipSuccess', {
            id: id,
            amount: amount,
            receiverId: receiverId,
            receiverName: receiverName,
          });
        } else {
          callback('End Transaction Error');
          props.navigation.goBack(null);
        }
      })
      .catch(err => {
        console.log(err);
        toast.current.show(err.message, 2000, () => {});
        callback('End Transaction Server Failed');
        props.navigation.goBack(null);
      });
  };

  //******************** Hit Credentials Api *****************
  const CredentialApi = async user => {
    console.log('ApiCall', constants.baseUrl + constants.api.paymentKey);
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.paymentKey, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.access_token}`,
        },
      }),
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('Response', responseJson);
        if (responseJson.data.length != 0) {
          responseJson.data.forEach(element => {
            if (element.name == 'stripe_secret_key') {
              setSecretKey(element.value);
              // Create Token
              makeSessionData(amount * 100, element.value);
            }
          });
        }
      })
      .catch(err => {
        console.log(err);
        props.navigation.goBack(null);
      });
  };

  // navigation with sucees data api of the payment response
  const _onNavigationStateChange = async webViewState => {
    // set cangoback value
    setCanGoBack(webViewState.canGoBack);
    console.log('url--->', webViewState);
    if (webViewState.url.includes('https://example.com/success')) {
      // making approve url as null again
      setApprovalUrl(null);
      setLoadingType(2);

      var url = webViewState.url;
      var regex = /[?&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;
      while ((match = regex.exec(url))) {
        params[match[1]] = match[2];
      }
      console.log(params);
      //const {PayerID} = params;
      getPayment();
    } else if (webViewState.url.includes('https://example.com/cancel')) {
      // making approve url as null again
      setApprovalUrl(null);
      setLoadingType(1);
      props.navigation.goBack(null);
    } else if (
      webViewState.title.includes('https://projects.webbycentral.xyz') ||
      webViewState.title.includes('https://checkout.stripe.com')
    ) {
      // making approve url as null again
      setApprovalUrl(baseUrl + sessionId);
      setLoadingType(1);
    }
  };

  const ActivityIndicatorLoadingView = () => {
    //making a view to show to while loading the webpage
    return (
      <View style={commonStyles.WebViewStyle}>
        <ActivityIndicator size="large" color={Colors.theme} />
        <Text style={commonStyles.LoadingTextStyle}>Loading Gateway</Text>
      </View>
    );
  };

  console.log('apURL-->', approvalUrl);
  return (
    <>
      <CustomStatusBar color={Colors.theme} />
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.ViewContainer}>
          {approvalUrl ? (
            <WebView
              // Webview Refernce
              ref={ref}
              // Webview Style
              style={commonStyles.WebViewStyle}
              //Loading URL
              source={{uri: approvalUrl}}
              //Navigation Change Interface
              onNavigationStateChange={_onNavigationStateChange.bind(this)}
              //Enable Javascript support
              javaScriptEnabled={true}
              //For the Cache
              domStorageEnabled={true}
              //View to show while loading the webpage
              renderLoading={ActivityIndicatorLoadingView}
              //Want to show the view or not
              startInLoadingState={true}
            />
          ) : (
            <View>
              <ActivityIndicator size="large" color={Colors.theme} />
              <Text style={commonStyles.LoadingTextStyle}>
                {loadingType === 1 ? 'Loading Gateway' : 'Executing Payment'}
              </Text>
              {loadingType === 2 && (
                <Text style={commonStyles.LoadingDoneStyle}>
                  Do not press back button
                </Text>
              )}
            </View>
          )}
        </View>
        <Toast
          ref={toast}
          style={commonStyles.toastStyle}
          textStyle={commonStyles.toastTextStyle}
        />
      </SafeAreaView>
    </>
  );
};

export default StripeCheckout;

// Rough implementation for timeout Api Call.
export function timeout(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error('timeout'));
    }, ms);
    promise.then(resolve, reject);
  });
}
