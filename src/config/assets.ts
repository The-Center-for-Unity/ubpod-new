import { SeriesType } from '../types/index';
import { isJesusRelatedSeries } from '../utils/seriesUtils';

// Configure R2 base URL - replace with actual URL in production
const R2_BASE_URL = "https://r2.ubpod.com";

/**
 * Get the URL for an asset, determining whether it should come from R2 or local storage
 * @param path The asset path
 * @param type The asset type (audio, image, pdf)
 * @returns The full URL to the asset
 */
export const getAssetUrl = (path: string, type: 'audio' | 'image' | 'pdf' = 'audio'): string => {
  // Extract series from path (assuming path format like "/series-id/file.mp3")
  const pathParts = path.split('/');
  const seriesId = pathParts.length > 1 ? pathParts[1] : '';
  
  // Jesus-related series and new series files come from R2
  if (isSeriesInR2(seriesId as SeriesType)) {
    // Make sure the path doesn't start with a slash when appending to R2 URL
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${R2_BASE_URL}/${type}/${cleanPath}`;
  }
  
  // Default to local assets for original content
  return path.startsWith('/') ? path : `/${type}/${path}`;
};

/**
 * Check if a series should be served from R2
 */
function isSeriesInR2(seriesId: SeriesType): boolean {
  // All Jesus-focused series
  if (isJesusRelatedSeries(seriesId)) {
    return true;
  }
  
  // All parts-i-iii series
  if (seriesId.startsWith('central-') || seriesId.startsWith('local-')) {
    return true;
  }
  
  // Legacy parts-i-iii series are no longer in SeriesType
  // but we keep the check for backward compatibility
  return false;
}

/**
 * Get the profile image URL for Jesus-related content from DiscoverJesus.com
 * @param audioUrl The audio URL from which to derive the image name
 * @returns The URL to the profile image
 */
export const getProfileImage = (audioUrl: string): string => {
  // Extract the base name from audio URL
  const fileName = audioUrl.split('/').pop()?.replace('.mp3', '') || '';
  
  // Return the corresponding profile image from R2
  return `${R2_BASE_URL}/profiles/${fileName}.jpg`;
}; 