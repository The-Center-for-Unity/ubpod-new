import seriesAvailability from '../data/series-availability.json';
import { SeriesInfo } from './seriesUtils';

/**
 * Get the list of available series IDs for a specific language
 * @param language The language code (e.g., 'en', 'es')
 * @returns Array of series IDs available for that language
 */
export function getAvailableSeriesIds(language: string): string[] {
  return seriesAvailability[language as keyof typeof seriesAvailability] || [];
}

/**
 * Filter a series array to only include series available for the specified language
 * @param series Array of SeriesInfo objects
 * @param language The language code (e.g., 'en', 'es')
 * @returns Filtered array containing only available series
 */
export function filterSeriesByLanguage(series: SeriesInfo[], language: string): SeriesInfo[] {
  const availableIds = getAvailableSeriesIds(language);
  return series.filter(s => availableIds.includes(s.id));
}

/**
 * Get available series categories for a specific language
 * @param language The language code (e.g., 'en', 'es')
 * @returns Object with available categories and their counts
 */
export function getAvailableCategories(language: string) {
  const availableIds = getAvailableSeriesIds(language);
  
  const hasJesusSeries = availableIds.some(id => id.startsWith('jesus-'));
  const hasCosmicSeries = availableIds.some(id => id.startsWith('cosmic-'));
  
  return {
    hasJesusSeries,
    hasCosmicSeries,
    totalCount: availableIds.length,
    jesusCount: availableIds.filter(id => id.startsWith('jesus-')).length,
    cosmicCount: availableIds.filter(id => id.startsWith('cosmic-')).length
  };
} 