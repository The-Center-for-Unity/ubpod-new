/**
 * mediaIntegration.ts - Integration of new mediaUtils with existing code
 * 
 * This module demonstrates how to integrate the new mediaUtils with the existing
 * code without breaking existing functionality. It provides wrapper functions
 * that use the new utilities as a fallback when existing methods fail.
 */

import { getAudioUrl as getExistingAudioUrl, getPdfUrl as getExistingPdfUrl } from '../config/audio';
import { getMediaUrl, doesMediaExist } from './mediaUtils';

/**
 * Get audio URL with fallback to new system
 * 
 * This function tries the existing system first, and if it fails (throws an error),
 * it falls back to the new mediaUtils system.
 * 
 * @param series The series identifier (e.g., 'urantia-papers', 'jesus-1', 'cosmic-2')
 * @param id The episode number within the series
 * @returns URL to the audio file or null if not available
 */
export function getAudioUrlWithFallback(series: string, id: number): string | null {
  try {
    // Try the existing system first
    const existingUrl = getExistingAudioUrl(series, id);
    
    // If we got a URL, verify it works (for Jesus and Cosmic series only)
    if (existingUrl && (series.startsWith('jesus-') || series.startsWith('cosmic-'))) {
      // This is a placeholder for verification - in a real implementation,
      // you might do a HEAD request or other validation
      
      // For now, we'll just check if the URL is likely to be valid
      // (e.g., doesn't contain characters that would be rejected by R2)
      if (existingUrl.includes('%') || 
          existingUrl.includes(' ') || 
          existingUrl.includes('(') || 
          existingUrl.includes(')')) {
        console.warn(`[MediaIntegration] Potentially invalid URL from existing system: ${existingUrl}`);
        // Fall back to new system
        return getMediaUrl(series, id, 'mp3');
      }
    }
    
    return existingUrl;
  } catch (error) {
    console.warn(`[MediaIntegration] Error from existing audio URL system:`, error);
    // Fall back to new system
    return getMediaUrl(series, id, 'mp3');
  }
}

/**
 * Get PDF URL with fallback to new system
 * 
 * This function tries the existing system first, and if it fails (returns undefined),
 * it falls back to the new mediaUtils system.
 * 
 * @param series The series identifier (e.g., 'urantia-papers', 'jesus-1', 'cosmic-2')
 * @param id The episode number within the series
 * @returns URL to the PDF file or null if not available
 */
export function getPdfUrlWithFallback(series: string, id: number): string | null {
  try {
    // Try the existing system first
    const existingUrl = getExistingPdfUrl(series, id);
    
    // If we got a URL, return it
    if (existingUrl) {
      return existingUrl;
    }
    
    // Otherwise, fall back to new system
    return getMediaUrl(series, id, 'pdf');
  } catch (error) {
    console.warn(`[MediaIntegration] Error from existing PDF URL system:`, error);
    // Fall back to new system
    return getMediaUrl(series, id, 'pdf');
  }
}

/**
 * Check if an audio file exists for an episode
 * 
 * @param series The series identifier
 * @param id The episode number
 * @returns Boolean indicating if the audio file is available
 */
export function doesAudioExist(series: string, id: number): boolean {
  // Try the new system first as it's more reliable
  if (doesMediaExist(series, id, 'mp3')) {
    return true;
  }
  
  // If not found in the new system, try the existing system
  try {
    const existingUrl = getExistingAudioUrl(series, id);
    return !!existingUrl;
  } catch (error) {
    return false;
  }
}

/**
 * Check if a PDF file exists for an episode
 * 
 * @param series The series identifier
 * @param id The episode number
 * @returns Boolean indicating if the PDF file is available
 */
export function doesPdfExist(series: string, id: number): boolean {
  // Try the new system first as it's more reliable
  if (doesMediaExist(series, id, 'pdf')) {
    return true;
  }
  
  // If not found in the new system, try the existing system
  try {
    const existingUrl = getExistingPdfUrl(series, id);
    return !!existingUrl;
  } catch (error) {
    return false;
  }
} 