import { Episode, SeriesType, EpisodeTranslations } from '../types/index';
import { getAudioUrl, getPdfUrl, JESUS_AUDIO_BASE_URL, URANTIA_AUDIO_BASE_URL } from '../config/audio';
import episodesData from '../data/json/episodes.json';
import cosmicSeriesMappingsData from '../data/json/cosmic-series-mappings.json';
import { getTranscriptUrl } from './mediaUtils';

// Import consolidated content files
import seriesMetadata from '../locales/series-metadata.json';
import enContent from '../locales/en/content/content.json';
import esContent from '../locales/es/content/content.json';

// Define the cosmic audio URL - use the same R2 backend that other audio files use
const COSMIC_AUDIO_BASE_URL = import.meta.env.VITE_COSMIC_AUDIO_BASE_URL || URANTIA_AUDIO_BASE_URL;

// Type definitions for the consolidated content structure
interface EpisodeContent {
  title: string;
  logline: string;
  episodeCard: string;
  summary: string;
}

interface SeriesContent {
  seriesTitle: string;
  seriesDescription: string;
  episodes: Record<string, EpisodeContent>;
}

interface EpisodeMetadata {
  id: number;
  summaryKey?: string;
  paperNumber?: number;
}

interface SeriesMetadata {
  seriesId: string;
  episodes: EpisodeMetadata[];
}

/**
 * Get episode data from consolidated content files
 */
function getEpisodeContent(seriesId: string, episodeId: number, language: 'en' | 'es'): EpisodeContent | null {
  const content = language === 'en' ? enContent : esContent;
  const seriesContent = content[seriesId as keyof typeof content] as SeriesContent | undefined;
  
  if (!seriesContent) {
    console.warn(`[episodeUtils] Series ${seriesId} not found in ${language} content`);
    return null;
  }
  
  const episodeContent = seriesContent.episodes[episodeId.toString()];
  
  if (!episodeContent) {
    console.warn(`[episodeUtils] Episode ${episodeId} not found in series ${seriesId} for ${language}`);
    return null;
  }
  
  return episodeContent;
}

/**
 * Get series metadata from consolidated metadata file
 */
function getSeriesMetadata(seriesId: string): SeriesMetadata | undefined {
  return seriesMetadata[seriesId as keyof typeof seriesMetadata] as SeriesMetadata | undefined;
}

/**
 * Get all episodes for a series
 */
export function getEpisodesForSeries(seriesId: string, language: string = 'en'): Episode[] {
  console.log(`[episodeUtils] Getting episodes for series: ${seriesId} (${language})`);
  
  const seriesData = getSeriesMetadata(seriesId);
  if (!seriesData) {
    console.warn(`[episodeUtils] Series ${seriesId} not found in metadata`);
    return [];
  }
  
  const episodes: Episode[] = [];
  
  for (const episodeMetadata of seriesData.episodes) {
    const episode = getEpisode(seriesId, episodeMetadata.id, language);
    if (episode) {
      episodes.push(episode);
    }
  }
  
  console.log(`[episodeUtils] Found ${episodes.length} episodes for series ${seriesId}`);
  return episodes;
}

/**
 * Get a single episode with all its data
 */
export function getEpisode(seriesId: string, episodeId: number, language: string = 'en'): Episode | undefined {
  console.log(`[episodeUtils] Getting episode: ${seriesId}/${episodeId} (${language})`);
  
  // Get series metadata
  const seriesData = getSeriesMetadata(seriesId);
  if (!seriesData) {
    console.warn(`[episodeUtils] Series ${seriesId} not found in metadata`);
    return undefined;
  }
  
  // Find episode metadata
  const episodeMetadata = seriesData.episodes.find(ep => ep.id === episodeId);
  if (!episodeMetadata) {
    console.warn(`[episodeUtils] Episode ${episodeId} not found in series ${seriesId}`);
    return undefined;
  }
  
  // Get content for both languages to build complete episode data
  const enEpisodeContent = getEpisodeContent(seriesId, episodeId, 'en');
  const esEpisodeContent = getEpisodeContent(seriesId, episodeId, 'es');
  
  if (!enEpisodeContent) {
    console.warn(`[episodeUtils] English content not found for ${seriesId}/${episodeId}`);
    return undefined;
  }
  
  // Use the requested language content as primary
  const primaryContent = language === 'es' ? esEpisodeContent : enEpisodeContent;
  const fallbackContent = language === 'es' ? enEpisodeContent : esEpisodeContent;
  
  // Generate URLs
  const audioUrl = getAudioUrl(seriesId, episodeId, language);
  const pdfUrl = getPdfUrl(seriesId, episodeId, language);
  const imageUrl = getImageUrl(seriesId, episodeId);
  
  // Build episode object
  const episode: Episode = {
    id: episodeId,
    title: primaryContent?.title || fallbackContent?.title || `Episode ${episodeId}`,
    audioUrl,
    pdfUrl,
    imageUrl,
    series: seriesId as SeriesType,
    description: primaryContent?.logline || fallbackContent?.logline || '',
    summary: primaryContent?.summary || fallbackContent?.summary || '',
    cardSummary: primaryContent?.episodeCard || fallbackContent?.episodeCard || primaryContent?.logline || fallbackContent?.logline || '',
    summaryKey: episodeMetadata.summaryKey || undefined
  };
  
  console.log(`[episodeUtils] Built episode: ${episode.title}`);
  return episode;
}

/**
 * Generate image URL for an episode
 */
function getImageUrl(seriesId: string, episodeId: number): string {
  return `/images/${seriesId}/card-${episodeId}.jpg`;
}

/**
 * Get recent episodes across all series
 */
export function getRecentEpisodes(count: number = 5): Episode[] {
  const allEpisodes: Episode[] = [];
  
  // Get episodes from all series
  for (const seriesId of Object.keys(seriesMetadata)) {
    const seriesEpisodes = getEpisodesForSeries(seriesId, 'en');
    allEpisodes.push(...seriesEpisodes);
  }
  
  // Sort by series and episode ID, then take the most recent
  allEpisodes.sort((a, b) => {
    if (a.series !== b.series) {
      return a.series.localeCompare(b.series);
    }
    return a.id - b.id;
  });
  
  return allEpisodes.slice(-count);
}

/**
 * Get episode by ID across all series
 */
export function getEpisodeById(id: number, series: string, language: string = 'en'): Episode | undefined {
  return getEpisode(series, id, language);
}

/**
 * Get Urantia Paper part number (for organization)
 */
export function getUrantiaPaperPart(paperId: number): number {
  if (paperId <= 31) return 1;
  if (paperId <= 57) return 2;
  if (paperId <= 119) return 3;
  return 4;
}

/**
 * Generate audio file list for a series
 */
export function generateAudioFileList(seriesId: string): string[] {
  const seriesData = getSeriesMetadata(seriesId);
  if (!seriesData) return [];
  
  return seriesData.episodes.map(episode => {
    const audioUrl = getAudioUrl(seriesId, episode.id, 'en');
    return audioUrl.split('/').pop() || '';
  });
}

/**
 * Get DiscoverJesus summary (for Jesus series)
 */
export function getDiscoverJesusSummary(sourceUrl: string | undefined): { cardSummary?: string; summary?: string } {
  if (!sourceUrl) {
    return {
      cardSummary: 'Read the full article on DiscoverJesus.com',
      summary: 'Read the full article on DiscoverJesus.com'
    };
  }
  
  return {
    cardSummary: `Read the full article on DiscoverJesus.com`,
    summary: `Read the full article on DiscoverJesus.com`
  };
} 