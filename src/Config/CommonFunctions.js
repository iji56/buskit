import AsyncStorage from "@react-native-async-storage/async-storage";

// Rough implementation for timeout Api Call.
export function timeout(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error('timeout'));
    }, 30000);
    promise.then(resolve, reject);
  });
}

export async function processResponse(response) {
  const responseCode = response.status;
  const responseJson = response.json();
  return Promise.all([responseCode, responseJson]).then(res => ({
    responseCode: res[0],
    responseJson: res[1],
  }));
}

export function calculate_age(dob) {
  var diff_ms = Date.now() - dob.getTime();
  var age_dt = new Date(diff_ms);

  return Math.abs(age_dt.getUTCFullYear() - 1970);
}

export function hasWhiteSpace(s) {
  return s.indexOf(' ') >= 0;
}

export function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
}

// Rough implementation for check image url.
export function checkImageURL(url) {
  fetch(url)
    .then(res => {
      if (res.status == 404) {
        return 'https://imgur.com/P1ExcZK.png';
      } else {
        return `${url}`;
      }
    })
    .catch(err => {
      return 'https://imgur.com/P1ExcZK.png';
    });
}

export function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

export const setData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
};

export const setValue = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
};

export const getData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.warn('bbbbb --- ', JSON.parse(value));
      return JSON.parse(value);
    }
    return null;
  } catch (e) {
    return false;
  }
};

export const getValue = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.warn('bbbbb --- ', value);
      return value;
    }
    return null;
  } catch (e) {
    return false;
  }
};

export const removeData = async key => {
  try {
    await AsyncStorage.removeItem(key);
    return null;
  } catch (e) {
    return false;
  }
};

export const formatBytes = (a, b = 2) => {
  if (0 === a) return '0 Bytes';
  const c = 0 > b ? 0 : b,
    d = Math.floor(Math.log(a) / Math.log(1024));
  return (
    parseFloat((a / Math.pow(1024, d)).toFixed(c)) +
    ' ' +
    ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d]
  );
};
