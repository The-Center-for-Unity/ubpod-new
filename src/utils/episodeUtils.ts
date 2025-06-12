import { Episode, SeriesType, EpisodeTranslations } from '../types/index';
import { getAudioUrl, getPdfUrl, JESUS_AUDIO_BASE_URL, URANTIA_AUDIO_BASE_URL } from '../config/audio';
import episodesData from '../data/json/episodes.json';
import cosmicSeriesMappingsData from '../data/json/cosmic-series-mappings.json';
import { getTranscriptUrl } from './mediaUtils';
import { loadUrantiaPaperTranslations, getSpanishPaperTitle, getSpanishPaperCard, getSpanishPaperPage, getEnglishPaperTitle, getEnglishPaperCard, getEnglishPaperPage, getSpanishJesusShortSummary, getSpanishJesusFullSummary } from './translationLoaders';
import seriesMetadataEs from '../locales/es/content/series-metadata.json';
import episodeTitlesEs from '../locales/es/content/episode-titles.json';
import episodeLoglines from '../locales/es/content/episode-loglines.json';
import episodeTitlesEn from '../locales/en/content/episode-titles.json';
import episodeLoglineEn from '../locales/en/content/episode-loglines.json';
import jesusSummariesEn from '../locales/en/content/jesus-summaries.json';
import jesusSummariesEs from '../locales/es/content/jesus-summaries.json';

// Define the cosmic audio URL - use the same R2 backend that other audio files use
const COSMIC_AUDIO_BASE_URL = import.meta.env.VITE_COSMIC_AUDIO_BASE_URL || URANTIA_AUDIO_BASE_URL;

/**
 * Get summary data from translation system for Jesus episodes
 */
function getJesusSummaryFromTranslations(summaryKey: string): { cardSummary?: string; summary?: string } {
  // Try to load from English Jesus summaries
  const englishData = jesusSummariesEn[summaryKey as keyof typeof jesusSummariesEn];
  
  if (englishData && typeof englishData === 'object' && 'shortSummary' in englishData && 'fullSummary' in englishData) {
    return {
      cardSummary: englishData.shortSummary,
      summary: englishData.fullSummary
    };
  }
  
  // Fallback to generic content if not found
  console.log(`[DEBUG] No Jesus summary found for key: ${summaryKey}, using fallback`);
  return {
    cardSummary: `Experience the profound teachings and events from Jesus' life.`,
    summary: `Experience the profound teachings and events from Jesus' life.`
  };
}

/**
 * Get translations for Jesus series episodes
 */
function getJesusEpisodeTranslations(seriesId: string, episodeId: number, englishTitle: string, summaryKey: string): EpisodeTranslations {
  console.log(`[DEBUG] === getJesusEpisodeTranslations START ===`);
  console.log(`[DEBUG] Jesus translations for ${seriesId}/${episodeId}, summaryKey: ${summaryKey}`);
  
  // Get English content from Jesus summaries
  const englishData = jesusSummariesEn[summaryKey as keyof typeof jesusSummariesEn];
  let englishDescription = `Experience the profound teachings and events from Jesus' life.`;
  let englishSummary = `Experience the profound teachings and events from Jesus' life.`;
  let englishCardSummary = `Experience the profound teachings and events from Jesus' life.`;
  let enhancedEnglishTitle = englishTitle;
  
  console.log(`[DEBUG] English data lookup result:`, { 
    summaryKey, 
    found: !!englishData,
    hasTitle: englishData && 'title' in englishData,
    englishDataType: typeof englishData
  });
  
  if (englishData && typeof englishData === 'object' && 'shortSummary' in englishData && 'fullSummary' in englishData && 'title' in englishData) {
    englishDescription = englishData.shortSummary;
    englishSummary = englishData.fullSummary;
    englishCardSummary = englishData.shortSummary;
    enhancedEnglishTitle = englishData.title || englishTitle;
    console.log(`[DEBUG] Enhanced English title: "${enhancedEnglishTitle}"`);
  }
  
  // Get Spanish content from Jesus summaries
  const spanishShort = getSpanishJesusShortSummary(summaryKey);
  const spanishFull = getSpanishJesusFullSummary(summaryKey);
  
  // Get Spanish title from series metadata
  let spanishTitle = enhancedEnglishTitle; // Fallback to English
  let spanishDescription = englishDescription;
  let spanishSummary = englishSummary;
  let spanishCardSummary = englishCardSummary;
  
  // Try to get Spanish title from series metadata (episodeTitlesEs)
  const spanishTitles = episodeTitlesEs[seriesId as keyof typeof episodeTitlesEs];
  if (Array.isArray(spanishTitles) && spanishTitles[episodeId - 1]) {
    spanishTitle = spanishTitles[episodeId - 1];
    console.log(`[DEBUG] Spanish title found in series metadata: "${spanishTitle}"`);
  } else {
    console.log(`[DEBUG] No Spanish title found in series metadata, using fallback: "${spanishTitle}"`);
  }
  
  console.log(`[DEBUG] Spanish data lookup result:`, { 
    summaryKey, 
    seriesId,
    episodeId,
    spanishTitlesFound: !!spanishTitles,
    spanishTitlesLength: Array.isArray(spanishTitles) ? spanishTitles.length : 0,
    spanishShortFound: !!spanishShort,
    spanishFullFound: !!spanishFull,
    finalSpanishTitle: spanishTitle
  });
  
  if (spanishShort && spanishFull) {
    spanishDescription = spanishShort;
    spanishSummary = spanishFull;
    spanishCardSummary = spanishShort;
    console.log(`[DEBUG] Spanish content loaded successfully`);
  } else {
    console.log(`[DEBUG] Spanish content not found, using English fallback`);
  }
  
  const result = {
    en: {
      title: enhancedEnglishTitle,
      description: englishDescription,
      summary: englishSummary,
      cardSummary: englishCardSummary
    },
    es: {
      title: spanishTitle,
      description: spanishDescription,
      summary: spanishSummary,
      cardSummary: spanishCardSummary
    }
  };
  
  console.log(`[DEBUG] Final Jesus translations result:`, {
    englishTitle: result.en.title,
    spanishTitle: result.es.title,
    summaryKey,
    resultType: typeof result,
    resultKeys: Object.keys(result),
    isArray: Array.isArray(result)
  });
  console.log(`[DEBUG] Actual result object:`, result);
  console.log(`[DEBUG] === getJesusEpisodeTranslations END ===`);
  
  return result;
}

/**
 * Get translations for cosmic series episodes
 */
function getCosmicEpisodeTranslations(seriesId: string, episodeId: number, englishTitle: string, summaryKey?: string): EpisodeTranslations {
  // Get English translations from the loaded data
  const englishTitles = episodeTitlesEn[seriesId as keyof typeof episodeTitlesEn];
  const englishLoglinesList = episodeLoglineEn[seriesId as keyof typeof episodeLoglineEn];
  
  // Get Spanish translations from the loaded data
  const seriesData = seriesMetadataEs[seriesId as keyof typeof seriesMetadataEs];
  const spanishTitles = episodeTitlesEs[seriesId as keyof typeof episodeTitlesEs];
  const spanishLoglinesList = episodeLoglines[seriesId as keyof typeof episodeLoglines];
  
  // Get specific episode translations
  const properEnglishTitle = Array.isArray(englishTitles) && englishTitles[episodeId - 1] 
    ? englishTitles[episodeId - 1] 
    : englishTitle;
  
  let englishLogline = Array.isArray(englishLoglinesList) && englishLoglinesList[episodeId - 1]
    ? englishLoglinesList[episodeId - 1]
    : `Explore the profound cosmic teachings of the Urantia Book.`;
  
  // Check if we can get richer content from Urantia summaries using summaryKey
  let englishDescription = englishLogline;
  let englishSummary = englishLogline;
  let englishCardSummary = englishLogline;
  
  if (summaryKey && summaryKey.startsWith('paper_')) {
    const paperNumber = parseInt(summaryKey.substring(6), 10);
    console.log(`[DEBUG] Translation function using summaryKey: ${summaryKey}, paper number: ${paperNumber}`);
    
    const englishCard = getEnglishPaperCard(paperNumber);
    const englishPage = getEnglishPaperPage(paperNumber);
    
    if (englishCard || englishPage) {
      englishDescription = englishCard || englishPage || englishLogline;
      englishSummary = englishPage || englishCard || englishLogline;
      englishCardSummary = englishCard || englishLogline;
      console.log(`[DEBUG] Enhanced translation function with rich Urantia content for paper ${paperNumber}`);
    }
  }
  
  const spanishTitle = Array.isArray(spanishTitles) && spanishTitles[episodeId - 1] 
    ? spanishTitles[episodeId - 1] 
    : properEnglishTitle;
  
  let spanishLogline = Array.isArray(spanishLoglinesList) && spanishLoglinesList[episodeId - 1]
    ? spanishLoglinesList[episodeId - 1]
    : englishLogline;
  
  // Check if we can get richer Spanish content from Urantia summaries using summaryKey
  let spanishDescription = spanishLogline;
  let spanishSummary = spanishLogline;
  let spanishCardSummary = spanishLogline;
  
  if (summaryKey && summaryKey.startsWith('paper_')) {
    const paperNumber = parseInt(summaryKey.substring(6), 10);
    console.log(`[DEBUG] Spanish translation function using summaryKey: ${summaryKey}, paper number: ${paperNumber}`);
    
    const spanishCard = getSpanishPaperCard(paperNumber);
    const spanishPage = getSpanishPaperPage(paperNumber);
    
    if (spanishCard || spanishPage) {
      spanishDescription = spanishCard || spanishPage || spanishLogline;
      spanishSummary = spanishPage || spanishCard || spanishLogline;
      spanishCardSummary = spanishCard || spanishLogline;
      console.log(`[DEBUG] Enhanced Spanish translation function with rich Urantia content for paper ${paperNumber}`);
    }
  }
  
  return {
    en: {
      title: properEnglishTitle,
      description: englishDescription,
      summary: englishSummary,
      cardSummary: englishCardSummary
    },
    es: {
      title: spanishTitle,
      description: spanishDescription,
      summary: spanishSummary,
      cardSummary: spanishCardSummary
    }
  };
}

/**
 * Generate Urantia Papers episodes from translation system
 */
function generateUrantiaPapers(): Episode[] {
  const papers: Episode[] = [];
  
  // Create all papers from 0 to 196
  for (let paperId = 0; paperId <= 196; paperId++) {
    // Get the title from our translation loader, or use a generic title if not found
    const title = getEnglishPaperTitle(paperId) || `Paper ${paperId}`;
    
    // Load Spanish translations using the translation loader
    const spanishTitle = getSpanishPaperTitle(paperId);
    const spanishCard = getSpanishPaperCard(paperId);
    const spanishPage = getSpanishPaperPage(paperId);
    
    // Format the title with "Paper X:" prefix for all papers except the Foreword
    const formattedTitle = paperId === 0 ? "Foreword" : `Paper ${paperId}: ${title}`;
    
    // Format Spanish title appropriately
    const formattedSpanishTitle = spanishTitle 
      ? (paperId === 0 ? spanishTitle : `Documento ${paperId}: ${spanishTitle}`)
      : formattedTitle; // Fallback to English if no Spanish translation
    
    // Get English translations from the translation system  
    const englishCard = getEnglishPaperCard(paperId);
    const englishPage = getEnglishPaperPage(paperId);
    
    // Use translation data if available, otherwise use fallback
    const defaultEnglishCard = `Enjoy a narrative journey through the Urantia Book, one paper at a time.`;
    const defaultEnglishPage = `Enjoy a narrative journey through the Urantia Book, one paper at a time.`;
    const defaultSpanishCard = `Disfruta de un viaje narrativo a través del Libro de Urantia, un documento a la vez.`;
    const defaultSpanishPage = `Disfruta de un viaje narrativo a través del Libro de Urantia, un documento a la vez.`;
    
    // Create the episode object with translations
    const episode: Episode = {
      id: paperId,
      title: formattedTitle,
      audioUrl: getAudioUrl('urantia-papers', paperId),
      pdfUrl: getPdfUrl('urantia-papers', paperId),
      series: "urantia-papers",
      // Use English card summary if available, otherwise fallback
      description: englishCard || defaultEnglishCard,
      summary: englishPage || defaultEnglishPage,
      cardSummary: englishCard || defaultEnglishCard,
      translations: {
        en: {
          title: formattedTitle,
          description: englishCard || defaultEnglishCard,
          summary: englishPage || defaultEnglishPage,
          cardSummary: englishCard || defaultEnglishCard
        },
        es: {
          title: formattedSpanishTitle,
          description: spanishCard || defaultSpanishCard,
          summary: spanishPage || defaultSpanishPage,
          cardSummary: spanishCard || defaultSpanishCard,
        },
      }
    };
    
    papers.push(episode);
  }
  
  return papers;
}

// Main function to get all episodes for a given series
export function getEpisodesForSeries(seriesId: string, language: string = 'en'): Episode[] {
  let episodes: Episode[];

  // Use ONLY episodes.json data and translation system
  if (seriesId === 'urantia-papers') {
    episodes = generateUrantiaPapers();
  } else if (seriesId.startsWith('jesus-') && episodesData[seriesId as keyof typeof episodesData]) {
    // Handle Jesus series from episodes.json data
    console.log(`[DEBUG] Loading Jesus series data for: ${seriesId}`);
    const seriesData = episodesData[seriesId as keyof typeof episodesData];
    
    episodes = seriesData.episodes.map((ep: any) => {
      // Get the summary from translation system using the summaryKey
      const summaryData = getJesusSummaryFromTranslations(ep.summaryKey);
      
      const episode: Episode = {
        id: ep.id,
        title: ep.title,
        audioUrl: getAudioUrl(seriesId, ep.id), // Use proper R2 URL generation
        series: seriesId as SeriesType,
        description: summaryData.cardSummary || `Experience the profound teachings and events from Jesus' life.`,
        summary: summaryData.summary || `Experience the profound teachings and events from Jesus' life.`,
        cardSummary: summaryData.cardSummary,
        sourceUrl: `https://discoverjesus.com/${ep.summaryKey}`,
        imageUrl: ep.imageUrl,
        pdfUrl: ep.pdfUrl,
        // Add translations for Jesus series
        translations: getJesusEpisodeTranslations(seriesId, ep.id, ep.title, ep.summaryKey)
      };
      
      console.log(`[DEBUG] Created Jesus episode: ${ep.id} - ${ep.title}`);
      return episode;
    });
  } else if (seriesId.startsWith('cosmic-') && episodesData[seriesId as keyof typeof episodesData]) {
    // Handle Cosmic series from episodes.json data using translation system
    console.log(`[DEBUG] Loading Cosmic series data for: ${seriesId} (language: ${language})`);
    const seriesData = episodesData[seriesId as keyof typeof episodesData];
    
    episodes = seriesData.episodes.map((ep: any) => {
      // Check if this cosmic episode has a summaryKey for rich Urantia Paper content
      let richDescription = ep.description || `Explore the profound cosmic teachings of the Urantia Book.`;
      let richSummary = ep.summary || ep.description || `Explore the profound cosmic teachings of the Urantia Book.`;
      let richCardSummary = ep.cardSummary;
      
      // If summaryKey exists and starts with "paper_", load rich content from Urantia summaries
      if (ep.summaryKey && ep.summaryKey.startsWith('paper_')) {
        const paperNumber = parseInt(ep.summaryKey.substring(6), 10);
        console.log(`[DEBUG] Cosmic episode ${ep.id} has summaryKey: ${ep.summaryKey}, extracting paper number: ${paperNumber}`);
        
        // Load rich content from Urantia Paper data (prefer English for base episode)
        const englishCard = getEnglishPaperCard(paperNumber);
        const englishPage = getEnglishPaperPage(paperNumber);
        
        if (englishCard || englishPage) {
          richDescription = englishCard || englishPage || richDescription;
          richSummary = englishPage || englishCard || richSummary;
          richCardSummary = englishCard || richCardSummary;
          console.log(`[DEBUG] Loaded rich Urantia content for cosmic episode ${ep.id} from paper ${paperNumber}`);
        } else {
          console.log(`[DEBUG] No rich Urantia content found for paper ${paperNumber}, using translation system`);
        }
      }
      
      const episode: Episode = {
        id: ep.id,
        title: ep.title,
        audioUrl: getAudioUrl(seriesId, ep.id), // Use proper R2 URL generation
        series: seriesId as SeriesType,
        description: richDescription,
        summary: richSummary,
        cardSummary: richCardSummary,
        imageUrl: ep.imageUrl,
        pdfUrl: ep.pdfUrl,
        // Add translations for cosmic series
        translations: getCosmicEpisodeTranslations(seriesId, ep.id, ep.title, ep.summaryKey)
      };
      
      console.log(`[DEBUG] Created Cosmic episode: ${ep.id} - ${ep.title}`);
      return episode;
    });
  } else {
    // No hardcoded fallback - only use translation system
    console.log(`[DEBUG] No episode data found for series: ${seriesId}`);
    return [];
  }
  
  // Apply language-specific translations for all languages (including English)
  episodes = episodes.map(episode => {
    if (episode.translations && episode.translations[language]) {
      const translationData = episode.translations[language];
      console.log(`[DEBUG] Applying ${language} translations for episode ${episode.id}: ${translationData.title}`);
      return {
        ...episode,
        title: translationData.title || episode.title,
        description: translationData.description || episode.description,
        summary: translationData.summary || episode.summary,
        cardSummary: translationData.cardSummary || episode.cardSummary,
        // Preserve the translations object!
        translations: episode.translations
      };
    }
    console.log(`[DEBUG] No ${language} translations found for episode ${episode.id}`);
    return episode;
  });
  
  return episodes;
}

/**
 * Get a specific episode by series and id
 * @param seriesId The series ID
 * @param episodeId The episode ID
 * @param language Optional language code (e.g., 'es' for Spanish)
 * @returns The episode with translations applied if available
 */
export function getEpisode(seriesId: string, episodeId: number, language: string = 'en'): Episode | undefined {
  console.log(`[DEBUG] === getEpisode START ===`);
  console.log(`[DEBUG] Getting episode: ${seriesId}/${episodeId}, language: ${language}, type of episodeId: ${typeof episodeId}`);
  
  // Get all episodes for the series with the specified language
  const episodes = getEpisodesForSeries(seriesId, language);
  console.log(`[DEBUG] getEpisodesForSeries returned ${episodes.length} episodes for ${seriesId} in ${language}`);
  
  // DEBUG: Log all episode IDs and their types
  console.log(`[DEBUG] Available episode IDs:`, episodes.map(ep => ({
    id: ep.id,
    type: typeof ep.id,
    title: ep.title
  })));
  
  console.log(`[DEBUG] Looking for episodeId: ${episodeId} (type: ${typeof episodeId})`);
  
  // Find the requested episode
  const episode = episodes.find(ep => {
    console.log(`[DEBUG] Raw comparison: ep.id=${ep.id}, episodeId=${episodeId}`);
    console.log(`[DEBUG] JSON.stringify: ep.id=${JSON.stringify(ep.id)}, episodeId=${JSON.stringify(episodeId)}`);
    console.log(`[DEBUG] Strict equality: ${ep.id} === ${episodeId} is ${ep.id === episodeId}`);
    console.log(`[DEBUG] Loose equality: ${ep.id} == ${episodeId} is ${ep.id == episodeId}`);
    const match = ep.id === episodeId;
    console.log(`[DEBUG] Final match result: ${match}`);
    return match;
  });
  
  if (!episode) {
    console.log(`[DEBUG] Episode not found: ${seriesId}/${episodeId}`);
    console.log(`[DEBUG] Available episodes:`, episodes.map(ep => `${ep.id}: ${ep.title}`));
    return undefined;
  }
  
  console.log(`[DEBUG] Found episode before additional translations:`, {
    id: episode.id,
    title: episode.title,
    language: language,
    hasTranslations: !!episode.translations,
    translations: episode.translations ? Object.keys(episode.translations) : 'none'
  });
  
  // Always set the transcriptUrl with the correct language.
  episode.transcriptUrl = getTranscriptUrl(seriesId, episodeId, language) || undefined;
  
  // Apply translations if available and not English
  if (language !== 'en' && episode.translations) {
    console.log(`[DEBUG] Applying ${language} translations...`);
    const translationData = episode.translations[language];
    if (translationData) {
      console.log(`[DEBUG] Translation data found for ${language}:`, {
        title: translationData.title,
        hasDescription: !!translationData.description,
        hasSummary: !!translationData.summary,
        hasCardSummary: !!translationData.cardSummary
      });
      const translatedEpisode = {
        ...episode,
        title: translationData.title || episode.title,
        description: translationData.description || episode.description,
        summary: translationData.summary || episode.summary,
        cardSummary: translationData.cardSummary || episode.cardSummary,
        
        // For audio and PDF URLs, we need to adjust for language
        audioUrl: getAudioPath(episode.audioUrl, language),
        pdfUrl: episode.pdfUrl ? getPdfPath(episode.pdfUrl, language) : undefined,
        // The transcriptUrl is already localized from the call above, so pass it through.
        transcriptUrl: episode.transcriptUrl
      };
      console.log(`[DEBUG] Final translated episode:`, {
        id: translatedEpisode.id,
        title: translatedEpisode.title,
        language: language
      });
      console.log(`[DEBUG] === getEpisode END (translated) ===`);
      return translatedEpisode;
    } else {
      console.log(`[DEBUG] No translation data found for language: ${language}`);
    }
  } else {
    console.log(`[DEBUG] No translation needed - language: ${language}, hasTranslations: ${!!episode.translations}`);
  }
  
  console.log(`[DEBUG] Final episode (no translation):`, {
    id: episode.id,
    title: episode.title,
    language: language
  });
  console.log(`[DEBUG] === getEpisode END (no translation) ===`);
  return episode;
}

/**
 * Adjusts an audio URL to include a language path segment.
 * @param url The original audio URL
 * @param language The language code (e.g., 'es')
 * @returns The new URL with the language path segment
 */
function getAudioPath(url: string, language: string): string {
  if (language === 'en' || !url) {
    return url;
  }
  // Inserts the language code before the file extension.
  // Example: /audio/file.mp3 -> /audio/file-es.mp3
  return url.replace(/\.([^.]+)$/, `-${language}.$1`);
}

/**
 * Adjusts a PDF URL to include a language path segment.
 * @param url The original PDF URL
 * @param language The language code (e.g., 'es')
 * @returns The new URL with the language path segment
 */
function getPdfPath(url: string, language: string): string {
  if (language === 'en' || !url) {
    return url;
  }
  // Inserts the language code before the file extension.
  // Example: /pdf/file.pdf -> /pdf/file-es.pdf
  return url.replace(/\.([^.]+)$/, `-${language}.$1`);
}

/**
 * Adjusts a transcript URL to include a language path segment.
 * @param url The original transcript URL
 * @param language The language code (e.g., 'es')
 * @returns The new URL with the language path segment
 */
function getTranscriptPath(url: string, language: string): string {
  if (language === 'en' || !url) {
    return url;
  }
  // Inserts the language code before the file extension.
  // Example: /transcript/file.pdf -> /transcript/file-es.pdf
  return url.replace(/\.([^.]+)$/, `-${language}.$1`);
}

/**
 * Get recent episodes across all series
 */
export function getRecentEpisodes(count: number = 5): Episode[] {
  const allEpisodes: Episode[] = [];
  
  // Get episodes from available series in episodes.json
  Object.keys(episodesData).forEach(seriesId => {
    const episodes = getEpisodesForSeries(seriesId);
    allEpisodes.push(...episodes);
  });
  
  // Add Urantia papers
  const urantiaPapers = getEpisodesForSeries('urantia-papers');
  allEpisodes.push(...urantiaPapers);
  
  // Sort by ID (most recent first) and return the requested count
  return allEpisodes
    .sort((a, b) => b.id - a.id)
    .slice(0, count);
}

/**
 * Generate audio file list for a series
 */
export function generateAudioFileList(seriesId: string): string[] {
  const episodes = getEpisodesForSeries(seriesId);
  return episodes.map(episode => episode.audioUrl).filter(Boolean);
}

/**
 * Get the part number for a Urantia Paper
 */
export function getUrantiaPaperPart(paperId: number): number {
  if (paperId === 0) return 0; // Foreword
  if (paperId >= 1 && paperId <= 31) return 1;
  if (paperId >= 32 && paperId <= 56) return 2;
  if (paperId >= 57 && paperId <= 119) return 3;
  if (paperId >= 120 && paperId <= 196) return 4;
  return 0; // Default
}

/**
 * Legacy function - get episode by id and series (backwards compatibility)
 */
export function getEpisodeById(id: number, series: string, language: string = 'en'): Episode | undefined {
  return getEpisode(series, id, language);
}

/**
 * Legacy function for Jesus summaries - now returns default data
 */
export function getDiscoverJesusSummary(sourceUrl: string | undefined): { cardSummary?: string; summary?: string } {
  console.log(`[DEBUG] Looking up Jesus summary for URL: ${sourceUrl}`);
  
  if (!sourceUrl) {
    return {};
  }
  
  // Extract the path from the URL
  const urlPath = sourceUrl.replace('https://discoverjesus.com/', '');
  console.log(`[DEBUG] Extracted URL path: ${urlPath}`);
  
  // Return default summary for now - will be replaced by translation system
    return {
    cardSummary: `Experience the profound teachings and events from Jesus' life.`,
    summary: `Experience the profound teachings and events from Jesus' life.`
    };
} 