import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend) // loads translations from /public/locales/{lng}/{ns}.json
  .use(LanguageDetector) // detects user language
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'fr', 'pt'],
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ['path', 'navigator'],
      lookupFromPathIndex: 0,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    ns: ['common', 'episode', 'home'],
    defaultNS: 'common',
  });

export default i18n;