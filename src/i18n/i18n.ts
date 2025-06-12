import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translation files directly
import enCommon from '../locales/en/common.json';
import enEpisode from '../locales/en/episode.json';
import enHome from '../locales/en/home.json';
import enSeries from '../locales/en/series.json';
import enSeriesCollections from '../locales/en/series-collections.json';
import enSeriesPage from '../locales/en/series-page.json';
import enSeriesDetail from '../locales/en/series-detail.json';
import enContact from '../locales/en/contact.json';
import enDisclaimer from '../locales/en/disclaimer.json';
import enDebug from '../locales/en/debug.json';

import esCommon from '../locales/es/common.json';
import esEpisode from '../locales/es/episode.json';
import esHome from '../locales/es/home.json';
import esSeries from '../locales/es/series.json';
import esSeriesCollections from '../locales/es/series-collections.json';
import esSeriesPage from '../locales/es/series-page.json';
import esSeriesDetail from '../locales/es/series-detail.json';
import esContact from '../locales/es/contact.json';
import esDisclaimer from '../locales/es/disclaimer.json';
import esDebug from '../locales/es/debug.json';

i18n
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
    resources: {
      en: {
        common: enCommon,
        episode: enEpisode,
        home: enHome,
        series: enSeries,
        'series-collections': enSeriesCollections,
        'series-page': enSeriesPage,
        'series-detail': enSeriesDetail,
        contact: enContact,
        disclaimer: enDisclaimer,
        debug: enDebug,
      },
      es: {
        common: esCommon,
        episode: esEpisode,
        home: esHome,
        series: esSeries,
        'series-collections': esSeriesCollections,
        'series-page': esSeriesPage,
        'series-detail': esSeriesDetail,
        contact: esContact,
        disclaimer: esDisclaimer,
        debug: esDebug,
      },
    },
    ns: ['common', 'episode', 'home', 'series', 'series-collections', 'series-page', 'series-detail', 'content'],
    defaultNS: 'common',
  });

export default i18n;