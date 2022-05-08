import I18n from 'i18n-js';
import { I18nManager} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import en from './locales/en.json';
import es from './locales/es.json';

I18n.defaultLocale = 'en';
I18n.fallbacks = true;
I18n.translations = {en, es};

// check the current Locale
const currentLocale = I18n.currentLocale();

// Is it a RTL language?
const isRTL = currentLocale.indexOf('es') === 0;

// Allow RTL alignment in RTL languages
I18nManager.allowRTL(isRTL);
I18nManager.forceRTL(isRTL);

AsyncStorage.getItem('langCode', (err, result) => {
  //console.warn('locale ', result);
  console.log('isRTL', isRTL);
  if (result !== null) {
    I18n.locale = result;
  } else {
    I18n.locale = 'en';
  }
});

export default I18n;
