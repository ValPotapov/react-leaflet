import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { BASE_LOCALE, DEFAULT_LOCALE, LOCALES } from '../constants';

const options = {
  order: ['path'],
  lookupFromPathIndex: 0,
  checkWhitelist: true,
  caches: ['localStorage'],
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: options,
    keySeparator: false,
    supportedLngs: LOCALES,
    ns: ['common'],
    fallbackLng: localStorage.getItem(BASE_LOCALE) || DEFAULT_LOCALE,
    fallbackNS: false,
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    returnEmptyString: false,
  });

export default i18n;
