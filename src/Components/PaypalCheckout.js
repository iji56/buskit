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

const PaypalCheckout = props => {
  const {amount, receiverId, receiverName, noteDesc} = props.route.params;
  const {callback} = props.route.params;

  const [user, setUser] = useState('');
  // const [authKey, setAuthKey] = useState(
  //   'QWZ2X1dmNGZRTGg1Z2dGSmpKRDJTdnpDeU1rOTVselQtUHh5ZktLUWtHSkhNMFBUcE92RHJjenhkZ0NMa3VyaDlkWW1fT21CR0VmMGc3SWY6RUFDSjZEZGhTOFVLbG9FVkNHTnJyQWtjUFRmRHZwTWltNkE3TjZONFpRXzJ3WHRyVTc0cXlIakVCdnFfdDNJSlBuczVfN0Y1LWhZZzRUMXk=',
  // );
  const [authKey, setAuthKey] = useState(
    'QVk2R3lxcXM4SjN3cGp3XzJrVG5UUUlhMVJlVURiYWltb3lwZ2dYYXdmQlRwcGlBbU9UVGtUc2NadDdsSFN3VDhxRExUMDZvajZVMnZxck46RUg4WjFTakxOV1F6akkzZDk5WVhabFFJNFZwLVNqMGdhOXdMOC0wMnhCMDhuaGd1cTluVTZxNThCMXM4WVZMRExrMHRJSGR4VVYtTVpyaHk=',
  );
  const [accessToken, setAcessToken] = useState(null);
  const [approvalUrl, setApprovalUrl] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [payerId, setPayerId] = useState(null);
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
    // createTokenData(authKey);
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

  const createTokenData = key => {
    var details = {
      grant_type: 'client_credentials',
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
    createToken(formBody, key);
  };

  // getting paypal access token for transaction
  const createToken = async (formData, authKey) => {
    timeout(
      10000,
      fetch('https://' + constants.paypalBaseUrl + 'v1/oauth2/token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${authKey}`,
        },
        body: formData,
      }),
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('token response', responseJson);
        setAcessToken(responseJson.access_token);
        // payment api call
        createPayment(responseJson.access_token);
      })
      .catch(err => {
        console.log('token error', err);
        toast.current.show(err.message, 2000, () => {});
      });
  };

  // getting pay data with access token for payment
  const createPayment = async accessToken => {
    let payData = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      transactions: [
        {
          amount: {
            total: amount,
            currency: 'USD',
            details: {
              subtotal: amount,
              tax: '0.00',
              handling_fee: '0.00',
            },
          },
          description: 'The payment transaction description.',
          payment_options: {
            allowed_payment_method: 'INSTANT_FUNDING_SOURCE',
          },
          item_list: {
            items: [
              {
                name: 'Tip Busker',
                description: 'Appreciating Performance',
                quantity: '1',
                price: amount,
                tax: '0.00',
                currency: 'USD',
              },
            ],
          },
        },
      ],
      redirect_urls: {
        // return_url: 'https://app.busk-it.com/return',
        // cancel_url: 'https://app.busk-it.com/cancel',

        return_url: constants.paypalRedirectUrl,
        cancel_url: constants.paypalRedirectCancelUrl,
      },
    };
    timeout(
      10000,
      fetch('https://' + constants.paypalBaseUrl + 'v1/payments/payment', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payData),
      }),
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('payment response', responseJson);
        if (
          responseJson.hasOwnProperty('name') &&
          responseJson.hasOwnProperty('message')
        ) {
          console.log(
            'problem 1--->',
            'name:' + responseJson.name + ',message:' + responseJson.message,
          );
          callback(responseJson.message);
          props.navigation.goBack(null);
        } else if (
          responseJson.hasOwnProperty('error') &&
          responseJson.hasOwnProperty('error_description')
        ) {
          console.log(
            'error 1--->',
            'error:' +
              responseJson.error +
              ',desc:' +
              responseJson.error_description,
          );
          callback(responseJson.error);
          props.navigation.goBack(null);
        } else {
          const {links} = responseJson;
          const approvalUrl = links.find(data => data.rel == 'approval_url');
          setPaymentId(responseJson.id);
          setApprovalUrl(approvalUrl.href);
        }
      })
      .catch(err => {
        console.log('payment error', err);
        toast.current.show(err.message, 2000, () => {});
        callback(err.message);
        props.navigation.goBack(null);
      });
  };

  // async fetch the last response result of transaction
  const submitTransaction = async PayerID => {
    var data = {payer_id: PayerID};
    timeout(
      10000,
      fetch(
        // 'https://api.paypal.com/v1/payments/payment/' +
        'https://' +
          constants.paypalBaseUrl +
          'v1/payments/payment/' +
          paymentId +
          '/execute',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        },
      ),
    )
      .then(response => response.json())
      .then(responseJson => {
        if (
          responseJson.hasOwnProperty('name') &&
          responseJson.hasOwnProperty('message')
        ) {
          console.log(
            'problem 2--->',
            'name:' + responseJson.name + ',message:' + responseJson.message,
          );
          callback(responseJson.message);
          props.navigation.goBack(null);
        } else if (
          responseJson.hasOwnProperty('error') &&
          responseJson.hasOwnProperty('error_description')
        ) {
          console.log(
            'error 2--->',
            'error:' +
              responseJson.error +
              ',desc:' +
              responseJson.error_description,
          );
          callback(responseJson.error);
          props.navigation.goBack(null);
        } else {
          console.log('success response', JSON.stringify(responseJson));
          setPaymentId(responseJson.id);
          setPayerId(responseJson.payer.payer_info.payer_id);
          setStatus('successful');
          checkoutApi(
            responseJson.id,
            responseJson.payer.payer_info.payer_id,
            'successful',
            JSON.stringify(responseJson),
            responseJson.transactions[0].related_resources[0].sale
              .transaction_fee.value,
          );
        }
      })
      .catch(err => {
        console.log('last error', err);
        toast.current.show(err.message, 2000, () => {});
        callback(err.message);
        props.navigation.goBack(null);
      });
  };

  //******************** Hit Checkout Api *****************
  const checkoutApi = async (
    id,
    payerId,
    status,
    transactionResponse,
    transactionFee,
  ) => {
    let data = {
      transaction_id: id,
      customer_id: payerId,
      reciever_id: receiverId,
      reciever_name: receiverName,
      amount: amount,
      status: status,
      payment_method: 'paypal',
      transaction_response: transactionResponse,
      transaction_fee: transactionFee,
    };
    if (noteDesc != '') {
      data.notes = noteDesc;
    }
    console.log('ApiCall', constants.baseUrl + constants.api.transactions);
    console.log('user.access_token @@@@@@@@@@@@', user.access_token);
    console.log('form data--------------------', JSON.stringify(data));
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
            if (element.name == 'paypal_auth_key') {
              setAuthKey(element.value);
              // payment token data
              createTokenData(element.value);
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
    if (webViewState.url.includes(constants.paypalRedirectUrl)) {
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
      const {PayerID} = params;
      setPayerId(PayerID);
      submitTransaction(PayerID);
    } else if (webViewState.url.includes(constants.paypalRedirectCancelUrl)) {
      // making approve url as null again
      setApprovalUrl(null);
      props.navigation.goBack(null);
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

export default PaypalCheckout;

// Rough implementation for timeout Api Call.
export function timeout(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error('timeout'));
    }, ms);
    promise.then(resolve, reject);
  });
}
