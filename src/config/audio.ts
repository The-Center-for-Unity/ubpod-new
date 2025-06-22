// Audio file configuration
import { getMediaUrl } from '../utils/mediaUtils';

// Base URLs for audio files in Cloudflare R2
export const JESUS_AUDIO_BASE_URL = 'https://pub-111d6f5663274cc5aefdcc72206eec40.r2.dev';
export const URANTIA_AUDIO_BASE_URL = 'https://pub-69ae36e16d64438e9bb56350459d5c7d.r2.dev';

/**
 * Get the audio URL for an episode with language support
 * 
 * @param series The series ID
 * @param id The episode ID within the series
 * @param language The language code (default: 'en')
 * @returns URL to the audio file
 */
export function getAudioUrl(series: string, id: number, language: string = 'en'): string {
  try {
    // Use mediaUtils as the single source of truth with language
    const url = getMediaUrl(series, id, 'mp3', language);
    if (!url) {
      console.error(`[audio] No audio URL found for ${series}-${id} (${language})`);
      throw new Error(`No audio URL found for ${series}-${id} (${language})`);
    }
    return url;
  } catch (error) {
    console.error(`[ERROR] Error generating audio URL: ${error}`);
    throw error;
  }
}

/**
 * Get the PDF URL for a paper with language support
 * @param series The series ID
 * @param id The episode ID
 * @param language The language code (default: 'en')
 * @returns URL to the PDF file or undefined if none exists
 */
export function getPdfUrl(series: string, id: number, language: string = 'en'): string | undefined {
  try {
    // Use mediaUtils as the single source of truth with language
    const url = getMediaUrl(series, id, 'pdf', language);
    return url || undefined;
  } catch (error) {
    console.error(`[ERROR] Error generating PDF URL: ${error}`);
    return undefined;
  }
} 