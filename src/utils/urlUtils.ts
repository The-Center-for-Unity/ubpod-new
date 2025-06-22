import { SeriesType } from '../types/index';

/**
 * Maps legacy series IDs to new series IDs
 */
export const legacySeriesMap: Record<string, string> = {
  // Keep series IDs as-is to preserve social media links
  'urantia-papers': 'urantia-papers', // No remapping for Urantia Papers
  'jesus-1': 'jesus-1', // No remapping for Jesus series
  'discover-jesus': 'jesus-1', // Map to first Jesus series

  'sadler-workbooks': 'urantia-papers', // Map to unified Urantia Papers
};

/**
 * Returns the unified urantia-papers series for any paper number
 * @param paperNumber The paper number
 * @returns The unified urantia-papers series ID
 */
export function getPlatformSeriesForPaper(paperNumber: number): string {
  // All papers are now in the unified urantia-papers series
  return 'urantia-papers';
}

/**
 * Maps an old URL format to the new format
 * @param oldSeries The old series ID (or undefined)
 * @param episodeId The episode ID (or paper number, or undefined)
 * @returns Object with new series ID and episode ID
 */
export function mapLegacyUrl(oldSeries: string | undefined, episodeId: string | undefined): { seriesId: string, episodeId: string } {
  // Handle undefined inputs
  const series = oldSeries || 'urantia-papers';
  const id = episodeId || '1';
  
  // For urantia-papers, keep the same series and episode ID (unified approach)
  if (series === 'urantia-papers') {
    const paperNumber = parseInt(id, 10);
    if (!isNaN(paperNumber)) {
      // Episode ID equals paper number in the unified series
      return { seriesId: 'urantia-papers', episodeId: paperNumber.toString() };
    }
  }
  
  // For cosmic series, keep the same series ID (no mapping)
  if (series.startsWith('cosmic-')) {
    return { seriesId: series, episodeId: id };
  }
  
  // For other legacy series, use the mapping table
  const newSeriesId = legacySeriesMap[series] || 'urantia-papers';
  return { seriesId: newSeriesId, episodeId: id };
} 