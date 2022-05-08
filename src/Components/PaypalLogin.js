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

const PaypalLogin = props => {
  //const {callback} = props.route.params;

  const [user, setUser] = useState('');
  // const [authKey, setAuthKey] = useState(
  //   'QWZ2X1dmNGZRTGg1Z2dGSmpKRDJTdnpDeU1rOTVselQtUHh5ZktLUWtHSkhNMFBUcE92RHJjenhkZ0NMa3VyaDlkWW1fT21CR0VmMGc3SWY6RUFDSjZEZGhTOFVLbG9FVkNHTnJyQWtjUFRmRHZwTWltNkE3TjZONFpRXzJ3WHRyVTc0cXlIakVCdnFfdDNJSlBuczVfN0Y1LWhZZzRUMXk=',
  // );
  // const [clientId, setClientId] = useState('Afv_Wf4fQLh5ggFJjJD2SvzCyMk95lzT-PxyfKKQkGJHM0PTpOvDrczxdgCLkurh9dYm_OmBGEf0g7If');
  const [authKey, setAuthKey] = useState('');
  const [clientId, setClientId] = useState('');
  const [approve, setApprove] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState(
    'https://'+constants.paypalBaseUrl+'connect/',
  );
  const [flowEntry, setFlowEntry] = useState('static');
  const [scope, setScope] = useState(
    'openid email https://uri.paypal.com/services/paypalattributes',
  );
  const [redirectUrl, setRedirectUrl] = useState(constants.paypalRedirectUrl);
  // const [redirectUrl, setRedirectUrl] = useState('https://app.busk-it.com/return');
  const [responseType, setResponseType] = useState('code');
  const [schemaType, setSchemaType] = useState('paypalv1.1');

  const [accessCode, setAccessCode] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [payerId, setPayerId] = useState(null);
  const [payerName, setPayerName] = useState(null);
  const [payerEmail, setPayerEmail] = useState(null);
  const [status, setStatus] = useState('failed');

  const ref = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loadingType, setLoadingType] = useState(1);
  const toast = useRef(null);

  useEffect(() => {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    AsyncStorage.getItem('UserDetails', (err, result) => {
      if (err === null) {
        let res = JSON.parse(result);
        setUser(res);
        // Get Credentail
        CredentialApi(res);
      }
    });
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

  const createTokenData = accessCode => {
    var details = {
      grant_type: 'authorization_code',
      code: accessCode,
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
    getAccessToken(formBody);
  };

  // getting paypal access token for transaction
  const getAccessToken = async formData => {
    timeout(
      10000,
      fetch('https://'+constants.paypalBaseUrl+'v1/oauth2/token', {
        // fetch('https://www.paypal.com/v1/oauth2/token', {
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
        if (
          responseJson.hasOwnProperty('name') &&
          responseJson.hasOwnProperty('message')
        ) {
          console.log(
            'problem--->',
            'name:' + responseJson.name + ',message:' + responseJson.message,
          );
        } else if (
          responseJson.hasOwnProperty('error') &&
          responseJson.hasOwnProperty('error_description')
        ) {
          console.log(
            'error--->',
            'error:' +
              responseJson.error +
              ',desc:' +
              responseJson.error_description,
          );
        } else {
          console.log('token response', responseJson);
          setAccessToken(responseJson.access_token);
          // payment api call
          getUserInfo(responseJson.access_token);
        }
      })
      .catch(err => {
        console.log('token error', err);
        toast.current.show(err.message, 2000, () => {});
      });
  };

  // getting pay data with access token for payment
  const getUserInfo = async accesstoken => {
    timeout(
      10000,
      fetch(
        'https://'+constants.paypalBaseUrl+'v1/identity/oauth2/userinfo' +
        // 'https://www.paypal.com/v1/identity/oauth2/userinfo' +
          '?schema=' +
          schemaType,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accesstoken}`,
          },
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
            'problem 1--->',
            'name:' + responseJson.name + ',message:' + responseJson.message,
          );
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
        } else {
          console.log('payment response', responseJson);
          const {emails} = responseJson;
          const emailId = emails.find(data => data.primary);
          setUserId(responseJson.user_id);
          setPayerId(responseJson.payer_id);
          setPayerName(responseJson.name);
          setPayerEmail(emailId.value);
          setStatus('successful');
          // add paypal user in database
          AddPaypalApi(
            responseJson.user_id,
            responseJson.payer_id,
            emailId.value,
          );
        }
      })
      .catch(err => {
        console.log('profile error', err);
        toast.current.show(err.message, 2000, () => {});
      });
  };

  //******************** Hit AddPaypal Api *****************
  const AddPaypalApi = async (userId, payerId, payerEmail) => {
    let data = {
      user_id: userId,
      payer_id: payerId,
      email: payerEmail,
    };
    console.log('ApiCall', constants.baseUrl + constants.api.buskerAddPaypal);
    console.log('form', JSON.stringify(data));
    timeout(
      10000,
      fetch(constants.baseUrl + constants.api.buskerAddPaypal, {
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
          console.log('paypal add succesfull');
        }
        props.navigation.goBack();
      })
      .catch(err => {
        console.log(err);
        toast.current.show(err.message, 2000, () => {});
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
            if (element.name == 'paypal_client_key') {
              setClientId(element.value);
            }
            if (element.name == 'paypal_auth_key') {
              setAuthKey(element.value);
            }
          });
          setApprove(true);
          console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ uri'+
          approvalUrl +
          '?flowEntry=' +
          flowEntry +
          '&client_id=' +
          "AQXdHe3oiwJKDsorkiuA-5bqNEywY1eEN3YP_ioaIAQeQ3YEaYwGC6t0ajj0s2c_IE8pkUYyQMhXG0tf" +
          '&scope=' +
          "AQXdHe3oiwJKDsorkiuA-5bqNEywY1eEN3YP_ioaIAQeQ3YEaYwGC6t0ajj0s2c_IE8pkUYyQMhXG0tf" +
          '&redirect_uri=' +
          redirectUrl +
          '&response_type=' +
          responseType,)
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
    // if (webViewState.url.startsWith('https://app.busk-it.com/return?code')) {
      if (webViewState.url.startsWith(constants.paypalRedirectUrl+'?code')) {
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
      const {code} = params;
      setAccessCode(code);
      createTokenData(code);
    } else if (
      // webViewState.url.startsWith('https://app.busk-it.com/return?error')
      webViewState.url.startsWith(constants.paypalRedirectUrl+'?error')
    ) {
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
        <Text style={commonStyles.LoadingTextStyle}>Loading</Text>
      </View>
    );
  };

  return (
    <>
      <CustomStatusBar color={Colors.theme} />
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.ViewContainer}>
          {approvalUrl && approve ? (
            <WebView
              // Webview Refernce
              ref={ref}
              // Webview Style
              style={commonStyles.WebViewStyle}
              //Loading URL
              source={{
                uri:
                  approvalUrl +
                  '?flowEntry=' +
                  flowEntry +
                  '&client_id=' +
                  clientId +
                  '&scope=' +
                  scope +
                  '&redirect_uri=' +
                  redirectUrl +
                  '&response_type=' +
                  responseType,
              }}
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
                {loadingType === 1 ? 'Loading' : 'Getting Info'}
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

export default PaypalLogin;

// Rough implementation for timeout Api Call.
export function timeout(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error('timeout'));
    }, ms);
    promise.then(resolve, reject);
  });
}
