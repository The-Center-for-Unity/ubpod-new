import { SeriesType } from '../types/index';

/**
 * Maps legacy series IDs to new series IDs
 */
export const legacySeriesMap: Record<string, string> = {
  // Keep series IDs as-is to preserve social media links
  'urantia-papers': 'urantia-papers', // No remapping for Urantia Papers
  'jesus-1': 'jesus-1', // No remapping for Jesus series
  'discover-jesus': 'jesus-1', // Map to first Jesus series
  'history': 'series-platform-3', // Maps to Urantia History
  'sadler-workbooks': 'series-platform-1', // Default mapping
};

/**
 * Determines which platform series a paper number belongs to
 * @param paperNumber The paper number
 * @returns The appropriate platform series ID
 */
export function getPlatformSeriesForPaper(paperNumber: number): string {
  if (paperNumber >= 1 && paperNumber <= 31) {
    return 'series-platform-1';
  } else if (paperNumber >= 32 && paperNumber <= 56) {
    return 'series-platform-2';
  } else if (paperNumber >= 57 && paperNumber <= 119) {
    return 'series-platform-3';
  } else if (paperNumber >= 120 && paperNumber <= 196) {
    return 'series-platform-4';
  }
  
  // Default to first series if paper number is invalid
  return 'series-platform-1';
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
  
  // For urantia-papers, map to the appropriate platform series based on paper number
  if (series === 'urantia-papers') {
    const paperNumber = parseInt(id, 10);
    if (!isNaN(paperNumber)) {
      const newSeriesId = getPlatformSeriesForPaper(paperNumber);
      
      // Calculate episode ID within the new series
      let newEpisodeId: number;
      if (paperNumber >= 1 && paperNumber <= 31) {
        newEpisodeId = paperNumber;
      } else if (paperNumber >= 32 && paperNumber <= 56) {
        newEpisodeId = paperNumber - 31;
      } else if (paperNumber >= 57 && paperNumber <= 119) {
        newEpisodeId = paperNumber - 56;
      } else if (paperNumber >= 120 && paperNumber <= 196) {
        newEpisodeId = paperNumber - 119;
      } else {
        newEpisodeId = 1;
      }
      
      return { seriesId: newSeriesId, episodeId: newEpisodeId.toString() };
    }
  }
  
  // For other legacy series, use the mapping table
  const newSeriesId = legacySeriesMap[series] || 'series-platform-1';
  return { seriesId: newSeriesId, episodeId: id };
} 