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

import frCommon from '../locales/fr/common.json';
import frEpisode from '../locales/fr/episode.json';
import frHome from '../locales/fr/home.json';
import frSeries from '../locales/fr/series.json';
import frSeriesCollections from '../locales/fr/series-collections.json';
import frSeriesPage from '../locales/fr/series-page.json';
import frSeriesDetail from '../locales/fr/series-detail.json';
import frContact from '../locales/fr/contact.json';
import frDisclaimer from '../locales/fr/disclaimer.json';
import frDebug from '../locales/fr/debug.json';

import ptCommon from '../locales/pt/common.json';
import ptEpisode from '../locales/pt/episode.json';
import ptHome from '../locales/pt/home.json';
import ptSeries from '../locales/pt/series.json';
import ptSeriesCollections from '../locales/pt/series-collections.json';
import ptSeriesPage from '../locales/pt/series-page.json';
import ptSeriesDetail from '../locales/pt/series-detail.json';
import ptContact from '../locales/pt/contact.json';
import ptDisclaimer from '../locales/pt/disclaimer.json';
import ptDebug from '../locales/pt/debug.json';

// Russian translations
import ruCommon from '../locales/ru/common.json';
import ruEpisode from '../locales/ru/episode.json';
import ruHome from '../locales/ru/home.json';
import ruSeries from '../locales/ru/series.json';
import ruSeriesCollections from '../locales/ru/series-collections.json';
import ruSeriesPage from '../locales/ru/series-page.json';
import ruSeriesDetail from '../locales/ru/series-detail.json';
import ruContact from '../locales/ru/contact.json';
import ruDisclaimer from '../locales/ru/disclaimer.json';
import ruDebug from '../locales/ru/debug.json';

import roCommon from '../locales/ro/common.json';
import roEpisode from '../locales/ro/episode.json';
import roHome from '../locales/ro/home.json';
import roSeries from '../locales/ro/series.json';
import roSeriesCollections from '../locales/ro/series-collections.json';
import roSeriesPage from '../locales/ro/series-page.json';
import roSeriesDetail from '../locales/ro/series-detail.json';
import roContact from '../locales/ro/contact.json';
import roDisclaimer from '../locales/ro/disclaimer.json';
import roDebug from '../locales/ro/debug.json';

// German translations
import deCommon from '../locales/de/common.json';
import deEpisode from '../locales/de/episode.json';
import deHome from '../locales/de/home.json';
import deSeries from '../locales/de/series.json';
import deSeriesCollections from '../locales/de/series-collections.json';
import deSeriesPage from '../locales/de/series-page.json';
import deSeriesDetail from '../locales/de/series-detail.json';
import deContact from '../locales/de/contact.json';
import deDisclaimer from '../locales/de/disclaimer.json';
import deDebug from '../locales/de/debug.json';

i18n
  .use(LanguageDetector) // detects user language
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'fr', 'pt', 'ru', 'ro', 'de'],
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
      fr: {
        common: frCommon,
        episode: frEpisode,
        home: frHome,
        series: frSeries,
        'series-collections': frSeriesCollections,
        'series-page': frSeriesPage,
        'series-detail': frSeriesDetail,
        contact: frContact,
        disclaimer: frDisclaimer,
        debug: frDebug,
      },
      pt: {
        common: ptCommon,
        episode: ptEpisode,
        home: ptHome,
        series: ptSeries,
        'series-collections': ptSeriesCollections,
        'series-page': ptSeriesPage,
        'series-detail': ptSeriesDetail,
        contact: ptContact,
        disclaimer: ptDisclaimer,
        debug: ptDebug,
      },
      ru: {
        common: ruCommon,
        episode: ruEpisode,
        home: ruHome,
        series: ruSeries,
        'series-collections': ruSeriesCollections,
        'series-page': ruSeriesPage,
        'series-detail': ruSeriesDetail,
        contact: ruContact,
        disclaimer: ruDisclaimer,
        debug: ruDebug,
      },
      ro: {
        common: roCommon,
        episode: roEpisode,
        home: roHome,
        series: roSeries,
        'series-collections': roSeriesCollections,
        'series-page': roSeriesPage,
        'series-detail': roSeriesDetail,
        contact: roContact,
        disclaimer: roDisclaimer,
        debug: roDebug,
      },
      de: {
        common: deCommon,
        episode: deEpisode,
        home: deHome,
        series: deSeries,
        'series-collections': deSeriesCollections,
        'series-page': deSeriesPage,
        'series-detail': deSeriesDetail,
        contact: deContact,
        disclaimer: deDisclaimer,
        debug: deDebug,
      },
    },
    ns: ['common', 'episode', 'home', 'series', 'series-collections', 'series-page', 'series-detail', 'content'],
    defaultNS: 'common',
  });

export default i18n;