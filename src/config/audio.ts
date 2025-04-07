// Audio file configuration

// Base URL for audio files in Cloudflare R2
export const AUDIO_BASE_URL = import.meta.env.VITE_AUDIO_BASE_URL || "https://pub-111d6f5663274cc5aefdcc72206eec40.r2.dev";

// Function to get the audio URL for a paper
export function getAudioUrl(series: string, id: number): string {
  // Always use Cloudflare R2 unless explicitly told to use local files
  if (import.meta.env.VITE_USE_LOCAL_AUDIO === 'true') {
    // Use local paths
    if (series === 'urantia-papers') {
      return id === 0 ? "/audio/foreword.mp3" : `/audio/paper-${id}.mp3`;
    } else if (series === 'discover-jesus') {
      return `/audio/discoverjesus/Episode-${id}.mp3`;
    } else if (series === 'history') {
      return `/audio/history/episode-${id}.mp3`;
    } else if (series === 'sadler-workbooks') {
      return `/audio/sadler/vol4-part${id}.mp3`;
    } else if (series.startsWith('jesus-')) {
      // For jesus-1 through jesus-14 series
      const seriesNum = series.split('-')[1];
      return `/audio/jesus-series/series-${seriesNum}/episode-${id}.mp3`;
    }
  }
  
  // Default: use Cloudflare R2
  if (series === 'urantia-papers') {
    return id === 0 
      ? `${AUDIO_BASE_URL}/foreword.mp3` 
      : `${AUDIO_BASE_URL}/paper-${id}.mp3`;
  } else if (series === 'discover-jesus') {
    return `${AUDIO_BASE_URL}/discoverjesus/Episode-${id}.mp3`;
  } else if (series === 'history') {
    return `${AUDIO_BASE_URL}/history/episode-${id}.mp3`;
  } else if (series === 'sadler-workbooks') {
    return `${AUDIO_BASE_URL}/sadler/vol4-part${id}.mp3`;
  } else if (series.startsWith('jesus-')) {
    // Handle Jesus series (jesus-1 through jesus-14)
    
    // For jesus-2 series, episode 1 - special case with known filename
    if (series === 'jesus-2' && id === 1) {
      return `${AUDIO_BASE_URL}/Establishing%20Jesus%20Ancestry1.mp3`;
    }
    
    // For other episodes, use simple naming format:
    // "jesus-[series-number]-episode-[episode-number].mp3"
    const seriesNum = series.split('-')[1];
    return `${AUDIO_BASE_URL}/jesus-${seriesNum}-episode-${id}.mp3`;
  }
  
  // Default fallback for any other series
  return `${AUDIO_BASE_URL}/${series}/episode-${id}.mp3`;
}

// Function to get the PDF URL for a paper
export function getPdfUrl(series: string, id: number): string | undefined {
  // Always use Cloudflare R2 unless explicitly told to use local files
  if (import.meta.env.VITE_USE_LOCAL_PDFS === 'true') {
    // Use local paths
    if (series === 'urantia-papers') {
      return id === 0 ? "/pdfs/foreword.pdf" : `/pdfs/paper-${id}.pdf`;
    }
    // Other series don't have PDFs yet
    return undefined;
  }
  
  // Default: use Cloudflare R2
  if (series === 'urantia-papers') {
    return id === 0 
      ? `${AUDIO_BASE_URL}/foreword.pdf` 
      : `${AUDIO_BASE_URL}/paper-${id}.pdf`;
  }
  
  // Other series don't have PDFs yet
  return undefined;
} 