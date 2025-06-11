/**
 * mediaUtils.ts - Unified media URL generation utility
 * 
 * This module serves as a single source of truth for accessing all media resources
 * from R2 buckets, handling:
 * - Urantia Papers MP3s and PDFs
 * - Jesus Series MP3s 
 * - Cosmic Series MP3s
 * - Discover Jesus series
 * - History series
 * - Sadler Workbooks series
 */

import jesusSeriesMappingsData from '../data/json/jesus-series-mappings.json';
import cosmicSeriesMappingsData from '../data/json/cosmic-series-mappings.json';

// Constants for R2 bucket URLs
export const URANTIA_BUCKET_URL = 'https://pub-69ae36e16d64438e9bb56350459d5c7d.r2.dev';
export const JESUS_BUCKET_URL = 'https://pub-111d6f5663274cc5aefdcc72206eec40.r2.dev';

// Types for direct mappings
interface MediaMapping {
  filename: string;
}

interface SeriesMapping {
  [key: string]: MediaMapping; // key format: "{seriesId}-{episodeNumber}"
}

// Direct mappings for Jesus Series episodes
// Import from generated file
export const jesusSeriesMapping: SeriesMapping = 
  (jesusSeriesMappingsData as any).jesusSeriesMapping || {};

// Direct mappings for Cosmic Series episodes
// Import from generated file
export const cosmicSeriesMapping: SeriesMapping = 
  (cosmicSeriesMappingsData as any).cosmicSeriesMapping || {};

/**
 * Get media URL for any episode type (Urantia Papers, Jesus Series, Cosmic Series)
 * @param seriesId The series identifier (e.g., 'urantia-papers', 'jesus-1', 'cosmic-2')
 * @param episodeNumber The episode number within the series
 * @param fileType The type of file to retrieve ('mp3' or 'pdf')
 * @param language The language code for the media file ('en', 'es', etc.)
 * @returns The complete URL to the media file, or null if not available
 */
export function getMediaUrl(
  seriesId: string, 
  episodeNumber: number, 
  fileType: 'mp3' | 'pdf' = 'mp3',
  language: string = 'en'
): string | null {
  try {
    // For Urantia Papers (simple pattern)
    if (seriesId === 'urantia-papers' || seriesId.startsWith('FER')) {
      const baseFilename = episodeNumber === 0 
        ? `foreword.${fileType}`
        : `paper-${episodeNumber}.${fileType}`;
      
      if (language === 'en') {
        return `${URANTIA_BUCKET_URL}/${baseFilename}`;
      } else {
        // Correctly append language code to filename
        const localizedFilename = baseFilename.replace(/\.([^.]+)$/, `-${language}.$1`);
        return `${URANTIA_BUCKET_URL}/${localizedFilename}`;
      }
    }
    
    // For discover-jesus series
    if (seriesId === 'discover-jesus') {
      // Only mp3 files are available
      if (fileType === 'pdf') {
        return null;
      }
      
      // Use the specific format for discover-jesus
      if (language === 'en') {
        return `${JESUS_BUCKET_URL}/audio/discover-jesus/episode-${episodeNumber}.mp3`;
      } else {
        return `${JESUS_BUCKET_URL}/audio/discover-jesus/${language}/episode-${episodeNumber}.mp3`;
      }
    }
    
    // For history series
    if (seriesId === 'history') {
      // Only mp3 files are available
      if (fileType === 'pdf') {
        return null;
      }
      
      // Use the same format as discover-jesus but with history path
      if (language === 'en') {
        return `${JESUS_BUCKET_URL}/audio/history/episode-${episodeNumber}.mp3`;
      } else {
        return `${JESUS_BUCKET_URL}/audio/history/${language}/episode-${episodeNumber}.mp3`;
      }
    }
    
    // For sadler-workbooks series
    if (seriesId === 'sadler-workbooks') {
      // Only mp3 files are available for now
      if (fileType === 'pdf') {
        return null;
      }
      
      // Use the same format as discover-jesus but with sadler-workbooks path
      if (language === 'en') {
        return `${JESUS_BUCKET_URL}/audio/sadler-workbooks/episode-${episodeNumber}.mp3`;
      } else {
        return `${JESUS_BUCKET_URL}/audio/sadler-workbooks/${language}/episode-${episodeNumber}.mp3`;
      }
    }
    
    // For Jesus Series (direct mapping)
    if (seriesId.startsWith('jesus-')) {
      // Only mp3 files are available for Jesus series
      if (fileType === 'pdf') {
        return null;
      }
      
      const mappingKey = `${seriesId}-${episodeNumber}`;
      const mapping = jesusSeriesMapping[mappingKey];
      
      if (mapping && mapping.filename) {
        if (language === 'en') {
          return `${JESUS_BUCKET_URL}/${encodeURIComponent(mapping.filename)}`;
        } else {
          // Handle language-specific path
          // Assuming the language folder is at the same level
          const baseFilename = mapping.filename;
          return `${JESUS_BUCKET_URL}/${language}/${encodeURIComponent(baseFilename)}`;
        }
      }
      
      console.error(`[MediaUtils] No mapping found for Jesus Series: ${mappingKey}`);
      return null;
    }
    
    // For Cosmic Series
    if (seriesId.startsWith('cosmic-')) {
      const mappingKey = `${seriesId}-${episodeNumber}`;
      
      if (fileType === 'mp3') {
        const mapping = cosmicSeriesMapping[mappingKey];
        
        if (mapping && mapping.filename) {
          if (language === 'en') {
            return `${URANTIA_BUCKET_URL}/${mapping.filename}`;
          } else {
            // Handle language-specific path
            return `${URANTIA_BUCKET_URL}/${language}/${mapping.filename}`;
          }
        }
      } else if (fileType === 'pdf') {
        // Use the same pattern as Urantia papers for PDFs
        // Extract the paper number from the mapping
        const mapping = cosmicSeriesMapping[mappingKey];
        if (mapping) {
          const paperNumberMatch = mapping.filename.match(/paper-(\d+)\.mp3/);
          if (paperNumberMatch && paperNumberMatch[1]) {
            if (language === 'en') {
              return `${URANTIA_BUCKET_URL}/paper-${paperNumberMatch[1]}.pdf`;
            } else {
              return `${URANTIA_BUCKET_URL}/${language}/paper-${paperNumberMatch[1]}.pdf`;
            }
          }
        }
      }
      
      console.error(`[MediaUtils] No mapping found for Cosmic Series: ${mappingKey} (${fileType})`);
      return null;
    }
    
    console.error(`[MediaUtils] Unknown series type: ${seriesId} (Known series types: urantia-papers, discover-jesus, history, sadler-workbooks, jesus-*, cosmic-*)`);
    return null;
  } catch (error) {
    console.error(`[MediaUtils] Error generating media URL:`, error);
    return null;
  }
}

/**
 * Get transcript URL for any episode type
 * @param seriesId The series identifier (e.g., 'urantia-papers', 'jesus-1', 'cosmic-2')
 * @param episodeNumber The episode number within the series
 * @param language The language code for the transcript ('en', 'es', etc.)
 * @returns The complete URL to the transcript file, or null if not available
 */
export function getTranscriptUrl(
  seriesId: string, 
  episodeNumber: number | string,
  language: string = 'en'
): string | null {
  // As of June 2024, no Spanish transcripts are available.
  // To prevent showing a button that leads to a 404, we return null.
  if (language === 'es') {
    return null; 
  }

  try {
    // Ensure episodeNumber is a number
    const episodeNum = typeof episodeNumber === 'string' ? parseInt(episodeNumber, 10) : episodeNumber;
    
    console.log(`[getTranscriptUrl] Looking for transcript: ${seriesId}/${episodeNum}, original type: ${typeof episodeNumber}, converted type: ${typeof episodeNum}`);
    
    // For Urantia Papers (correct pattern with PDFs)
    if (seriesId === 'urantia-papers' || seriesId.startsWith('FER')) {
      const baseFilename = episodeNum === 0 
        ? `foreword-transcript.pdf`
        : `paper-${episodeNum}-transcript.pdf`;
      
      let finalFilename = baseFilename;
      if (language !== 'en') {
        finalFilename = baseFilename.replace(/\.([^.]+)$/, `-${language}.$1`);
      }
      
      const url = `${URANTIA_BUCKET_URL}/${finalFilename}`;
      console.log(`[getTranscriptUrl] Generated Urantia URL: ${url}`);
      return url;
    }
    
    // For discover-jesus series
    if (seriesId === 'discover-jesus') {
      // Use PDF format instead of TXT and proper path
      let url;
      const baseFilename = `discover-jesus-episode-${episodeNum}-transcript.pdf`;
      if (language === 'en') {
        url = `${JESUS_BUCKET_URL}/${baseFilename}`;
      } else {
        const localizedFilename = baseFilename.replace(/\.([^.]+)$/, `-${language}.$1`);
        url = `${JESUS_BUCKET_URL}/${localizedFilename}`;
      }
      console.log(`[getTranscriptUrl] Generated discover-jesus URL: ${url}`);
      return url;
    }
    
    // For history series
    if (seriesId === 'history') {
      // Use PDF format instead of TXT and proper path
      let url;
      const baseFilename = `history-episode-${episodeNum}-transcript.pdf`;
      if (language === 'en') {
        url = `${JESUS_BUCKET_URL}/${baseFilename}`;
      } else {
        const localizedFilename = baseFilename.replace(/\.([^.]+)$/, `-${language}.$1`);
        url = `${JESUS_BUCKET_URL}/${localizedFilename}`;
      }
      console.log(`[getTranscriptUrl] Generated history URL: ${url}`);
      return url;
    }
    
    // For sadler-workbooks series
    if (seriesId === 'sadler-workbooks') {
      // Use PDF format instead of TXT and proper path
      let url;
      const baseFilename = `sadler-workbooks-episode-${episodeNum}-transcript.pdf`;
      if (language === 'en') {
        url = `${JESUS_BUCKET_URL}/${baseFilename}`;
      } else {
        const localizedFilename = baseFilename.replace(/\.([^.]+)$/, `-${language}.$1`);
        url = `${JESUS_BUCKET_URL}/${localizedFilename}`;
      }
      console.log(`[getTranscriptUrl] Generated sadler-workbooks URL: ${url}`);
      return url;
    }
    
    // For Jesus Series (direct mapping)
    if (seriesId.startsWith('jesus-')) {
      const mappingKey = `${seriesId}-${episodeNum}`;
      const mapping = jesusSeriesMapping[mappingKey];
      
      if (mapping && mapping.filename) {
        // Use filename without .mp3 extension and add -transcript.pdf
        const transcriptFilename = mapping.filename.replace(/\.mp3$/, '-transcript.pdf');
        let url;
        
        if (language === 'en') {
          url = `${JESUS_BUCKET_URL}/${encodeURIComponent(transcriptFilename)}`;
        } else {
          url = `${JESUS_BUCKET_URL}/${language}/${encodeURIComponent(transcriptFilename)}`;
        }
        
        console.log(`[getTranscriptUrl] Generated Jesus Series URL: ${url} from mapping: ${mapping.filename}`);
        return url;
      }
      
      console.error(`[MediaUtils] No mapping found for Jesus Series transcript: ${mappingKey}`);
      return null;
    }
    
    // For Cosmic Series
    if (seriesId.startsWith('cosmic-')) {
      const mappingKey = `${seriesId}-${episodeNum}`;
      const mapping = cosmicSeriesMapping[mappingKey];
      
      if (mapping && mapping.filename) {
        // Extract paper number if available, then use proper format
        const paperNumberMatch = mapping.filename.match(/paper-(\d+)\.mp3/);
        let url;
        
        if (paperNumberMatch && paperNumberMatch[1]) {
          const paperNumber = paperNumberMatch[1];
          
          if (language === 'en') {
            url = `${URANTIA_BUCKET_URL}/paper-${paperNumber}-transcript.pdf`;
          } else {
            url = `${URANTIA_BUCKET_URL}/${language}/paper-${paperNumber}-transcript.pdf`;
          }
          
          console.log(`[getTranscriptUrl] Generated Cosmic Series URL: ${url} from mapping: ${mapping.filename}`);
          return url;
        } else {
          // Fallback to using the filename directly
          const transcriptFilename = mapping.filename.replace(/\.mp3$/, '-transcript.pdf');
          
          if (language === 'en') {
            url = `${URANTIA_BUCKET_URL}/${transcriptFilename}`;
          } else {
            url = `${URANTIA_BUCKET_URL}/${language}/${transcriptFilename}`;
          }
          
          console.log(`[getTranscriptUrl] Generated Cosmic Series URL (fallback): ${url}`);
          return url;
        }
      }
      
      console.error(`[MediaUtils] No mapping found for Cosmic Series transcript: ${mappingKey}`);
      return null;
    }
    
    console.error(`[MediaUtils] Unknown series type for transcript: ${seriesId}`);
    return null;
  } catch (error) {
    console.error(`[MediaUtils] Error generating transcript URL:`, error);
    return null;
  }
}

/**
 * Check if media file exists for an episode
 * @param seriesId The series identifier
 * @param episodeNumber The episode number
 * @param fileType The type of media to check
 * @returns Boolean indicating if the media file is available
 */
export function doesMediaExist(
  seriesId: string, 
  episodeNumber: number, 
  fileType: 'mp3' | 'pdf' = 'mp3'
): boolean {
  return getMediaUrl(seriesId, episodeNumber, fileType) !== null;
}

/**
 * Get the display name for a media file
 * @param seriesId The series identifier
 * @param episodeNumber The episode number
 * @returns The human-readable name for the media file
 */
export function getMediaDisplayName(seriesId: string, episodeNumber: number): string {
  if (seriesId === 'urantia-papers') {
    return episodeNumber === 0 ? 'Foreword' : `Paper ${episodeNumber}`;
  }
  
  if (seriesId === 'discover-jesus') {
    return `Discover Jesus - Episode ${episodeNumber}`;
  }
  
  if (seriesId === 'history') {
    return `History - Episode ${episodeNumber}`;
  }
  
  if (seriesId === 'sadler-workbooks') {
    return `Sadler Workbook - Episode ${episodeNumber}`;
  }
  
  if (seriesId.startsWith('jesus-')) {
    const mappingKey = `${seriesId}-${episodeNumber}`;
    const mapping = jesusSeriesMapping[mappingKey];
    
    if (mapping && mapping.filename) {
      // Remove any prefix like "Topic - " or "Event - " and the file extension
      return mapping.filename
        .replace(/^(Topic|Event|Person|Group) - /, '')
        .replace(/\.mp3$/, '')
        .replace(/_/g, "'");
    }
  }
  
  if (seriesId.startsWith('cosmic-')) {
    const mappingKey = `${seriesId}-${episodeNumber}`;
    const mapping = cosmicSeriesMapping[mappingKey];
    
    if (mapping && mapping.filename) {
      // Return based on paper number
      const paperNumberMatch = mapping.filename.match(/paper-(\d+)\.mp3/);
      if (paperNumberMatch && paperNumberMatch[1]) {
        return `Paper ${paperNumberMatch[1]}`;
      }
    }
  }
  
  return `Episode ${episodeNumber}`;
} 