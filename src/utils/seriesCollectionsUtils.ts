import { useTranslation } from 'react-i18next';
import { SeriesInfo } from './seriesUtils';

/**
 * Get translated series data
 * @param seriesId The series ID (e.g., 'jesus-1', 'cosmic-1')
 * @param language The language code (not currently used due to hook limitations)
 * @returns Partial SeriesInfo with translated fields
 */
export function getTranslatedSeriesData(seriesId: string, language: string = 'en'): Partial<SeriesInfo> {
  const { t } = useTranslation('series-collections');
  
  const translation = {
    title: t(`series.${seriesId}.title`, { defaultValue: '' }),
    description: t(`series.${seriesId}.description`, { defaultValue: '' }),
    logline: t(`series.${seriesId}.logline`, { defaultValue: '' })
  };

  // Filter out empty translations (fallback to original values)
  return Object.fromEntries(
    Object.entries(translation).filter(([_, value]) => value !== '')
  );
}

/**
 * Get all UI labels for series collections
 * @returns Object with all translated UI labels
 */
export function getSeriesCollectionsUILabels() {
  const { t } = useTranslation('series-collections');
  
  return {
    buttons: {
      allSeries: t('ui.buttons.allSeries'),
      jesusSeries: t('ui.buttons.jesusSeries'),
      cosmicSeries: t('ui.buttons.cosmicSeries')
    },
    sections: {
      jesusTitle: t('ui.sections.jesusTitle'),
      jesusDescription: t('ui.sections.jesusDescription'),
      cosmicTitle: t('ui.sections.cosmicTitle'),
      cosmicDescription: t('ui.sections.cosmicDescription')
    },
    badges: {
      jesus: t('ui.badges.jesus'),
      cosmic: t('ui.badges.cosmic')
    },
    status: {
      showingCount: t('ui.status.showingCount'),
      noSeries: t('ui.status.noSeries'),
      searchNoResults: t('ui.status.searchNoResults'),
      clearFilters: t('ui.status.clearFilters')
    },
    actions: {
      viewEpisodes: t('ui.actions.viewEpisodes'),
      viewDetails: t('ui.actions.viewDetails'),
      episodes: t('ui.actions.episodes')
    }
  };
}

/**
 * Get category badge configuration with translated text
 * @param category The series category
 * @returns Badge configuration object
 */
export function getCategoryBadge(category: 'jesus-focused' | 'parts-i-iii') {
  const labels = getSeriesCollectionsUILabels();
  
  switch (category) {
    case 'jesus-focused':
      return {
        text: labels.badges.jesus,
        className: 'bg-gold/20 text-gold'
      };
    case 'parts-i-iii':
      return {
        text: labels.badges.cosmic,
        className: 'bg-blue-400/20 text-blue-400'
      };
    default:
      return {
        text: '',
        className: 'bg-gray/20 text-gray'
      };
  }
} 