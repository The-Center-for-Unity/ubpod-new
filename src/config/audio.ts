// Audio file configuration
import { getMediaUrl } from '../utils/mediaUtils';

// Base URLs for audio files in Cloudflare R2
export const JESUS_AUDIO_BASE_URL = 'https://pub-111d6f5663274cc5aefdcc72206eec40.r2.dev';
export const URANTIA_AUDIO_BASE_URL = 'https://pub-69ae36e16d64438e9bb56350459d5c7d.r2.dev';

/**
 * Get the audio URL for an episode
 * 
 * @param series The series ID
 * @param id The episode ID within the series
 * @returns URL to the audio file
 */
export function getAudioUrl(series: string, id: number): string {
  try {
    // Use mediaUtils as the single source of truth
    const url = getMediaUrl(series, id, 'mp3');
    if (!url) {
      console.error(`[audio] No audio URL found for ${series}-${id}`);
      throw new Error(`No audio URL found for ${series}-${id}`);
    }
    return url;
  } catch (error) {
    console.error(`[ERROR] Error generating audio URL: ${error}`);
    throw error; // Re-throw the error to be handled by the caller
  }
}

/**
 * Get the PDF URL for a paper
 * @param series The series ID
 * @param id The episode ID
 * @returns URL to the PDF file or undefined if none exists
 */
export function getPdfUrl(series: string, id: number): string | undefined {
  try {
    // Use mediaUtils as the single source of truth
    const url = getMediaUrl(series, id, 'pdf');
    return url || undefined;
  } catch (error) {
    console.error(`[ERROR] Error generating PDF URL: ${error}`);
    return undefined;
  }
} 