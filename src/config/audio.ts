// Audio file configuration

// Base URL for audio files in Cloudflare R2
export const AUDIO_BASE_URL = import.meta.env.VITE_AUDIO_BASE_URL || "https://pub-111d6f5663274cc5aefdcc72206eec40.r2.dev";

/**
 * Get the audio URL for an episode
 * This function maps different series IDs to their correct audio file paths in R2
 * 
 * @param series The series ID
 * @param id The episode ID within the series
 * @returns URL to the audio file
 */
export function getAudioUrl(series: string, id: number): string {
  console.log(`[DEBUG] Getting audio URL for ${series}/${id}`);
  
  // Use local paths if configured
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
    } else if (series.startsWith('cosmic-') || series.startsWith('series-')) {
      return `/audio/new-series/${series}/episode-${id}.mp3`;
    }
    
    // Default fallback for any other series
    return `/audio/${series}/episode-${id}.mp3`;
  }
  
  // Hard-coded debug URL for jesus-1/1 that we know works
  if (series === 'jesus-1' && id === 1) {
    console.log('[DEBUG] Using hard-coded URL for jesus-1/1');
    return `${AUDIO_BASE_URL}/Topic - The Personality of God.mp3`;
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
    // Get the exact file mapping for Jesus series episodes
    const fileName = getJesusSeriesFileName(series, id);
    if (fileName) {
      // Important: Don't URL encode the filename as it's already properly encoded in the mapping
      const url = `${AUDIO_BASE_URL}/${fileName}`;
      console.log(`[DEBUG] Found mapped filename for ${series}/${id}:`, url);
      return url;
    }
    
    // If no mapping is found, use a standard fallback format
    console.log(`[DEBUG] No mapping found for ${series}/${id}, using fallback`);
    const seriesNum = series.split('-')[1];
    return `${AUDIO_BASE_URL}/jesus-${seriesNum}-episode-${id}.mp3`;
  } else if (series.startsWith('cosmic-') || series.startsWith('series-')) {
    // For Fifth Epochal Revelation series (15+), we might be reusing Urantia Papers
    // Handle Series 15-28 by mapping to actual paper numbers when applicable
    if (series === 'cosmic-1' && id === 1) {
      // First episode of Cosmic Origins maps to Paper 1
      return `${AUDIO_BASE_URL}/paper-1.mp3`;
    }
    
    // Add other specific mappings as needed
    
    // Default new series format
    return `${AUDIO_BASE_URL}/new-series/${series}/episode-${id}.mp3`;
  }
  
  // Default fallback for any other series
  return `${AUDIO_BASE_URL}/${series}/episode-${id}.mp3`;
}

/**
 * Get the PDF URL for a paper
 * @param series The series ID
 * @param id The episode ID
 * @returns URL to the PDF file or undefined if none exists
 */
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

/**
 * Get the correct filename for a Jesus series episode
 * Based on the Series Organization document and tree-level6.txt
 * 
 * @param seriesId The full series ID (e.g., "jesus-1")
 * @param episodeNum The episode number (1-5)
 * @returns The encoded filename for the R2 URL or null if not found
 */
function getJesusSeriesFileName(seriesId: string, episodeNum: number): string | null {
  // Complete mapping of all series episodes to their filenames
  // Based on "Urantia Book Podcast (UBPod) - Series Organization 1cd66b22be4f8075971afbec1c5f0393.md"
  // and matching to actual filenames in tree-level6.txt
  
  const seriesEpisodeMapping: Record<string, string[]> = {
    // Series 1: "Beyond Traditional Religion: The True Nature of God"
    "jesus-1": [
      "Topic - The Personality of God.mp3",
      "Topic - Loving God Instead of Fearing God.mp3",
      "Topic - Growth of the God Concept.mp3",
      "Topic - Divine Forgiveness.mp3",
      "Topic - Faith and Righteousness.mp3"
    ],
    
    // Series 2: "Jesus Revealed: Beyond the Biblical Account"
    "jesus-2": [
      "Event - Sojourn in Alexandria.mp3",
      "Topic - Jesus_ Tour of the Mediterranean World.mp3",
      "Topic - Jesus Combined Nature.mp3",
      "Topic - Star of Bethlehem.mp3",
      "Topic - Jesus Harp.mp3"
    ],
    
    // Series 3: "The Inner Divine Presence: Thought Adjusters & Holy Spirit"
    "jesus-3": [
      "Topic - Indwelling Spirit of God.mp3",
      "Topic - Spirit of Truth - _The Comforter_.mp3",
      "Topic - Jesus Personalized Indwelling Spirit.mp3",
      "Topic - Personal Religion of Jesus.mp3",
      "Topic - Sonship with God.mp3"
    ],
    
    // Series 4: "Life After Death: The Mansion World Journey"
    "jesus-4": [
      "Topic - What Happens When We Die.mp3",
      "Topic - What Is the Soul.mp3",
      "Topic - Jesus_ Resurrection Experience.mp3",
      "Topic - Jesus_ Resurrected Morontia Body.mp3",
      "Event - The Resurrection of Jesus.mp3"
    ],
    
    // Series 5: "Women in Spiritual Leadership: A New Perspective"
    "jesus-5": [
      "Event - Jesus Establishes the Women_s Corps.mp3",
      "Group - Women_s Evangelistic Corps.mp3",
      "Person - Mary Magdalene.mp3",
      "Topic - How Did Jesus Treat Women.mp3",
      "Person - Mary - mother of Jesus.mp3"
    ],
    
    // Series 6: "Good & Evil Reconsidered: Beyond Traditional Theology"
    "jesus-6": [
      "Topic - Good and Evil.mp3",
      "Topic - Why Are We Confronted With Unfair Life Situations.mp3",
      "Topic - Why Do We Suffer from Affliction.mp3",
      "Topic - Accidents and Divine Intervention.mp3",
      "Topic - Anger - The Lack of Understanding.mp3"
    ],
    
    // Series 7: "Prayer & Worship: Enhanced Understanding"
    "jesus-7": [
      "Topic - Worship and Prayer.mp3",
      "Topic - Divine Forgiveness.mp3",
      "Event - Jesus_ Discourse on True Religion.mp3",
      "Topic - Personal Religion of Jesus.mp3",
      "Topic - Acme of Religious Living.mp3"
    ],
    
    // Series 8: "Angels & Celestial Beings: The Cosmic Hierarchy"
    "jesus-8": [
      "Topic - Angels - the Daughters of God.mp3",
      "Topic - Jesus - Celestial Visitations.mp3",
      "Person - Gabriel.mp3",
      "Person - Satan.mp3",
      "Person - Machiventa Melchizedek.mp3"
    ],
    
    // Series 9: "The Kingdom of Heaven: Spiritual Reality vs. Religious Concept"
    "jesus-9": [
      "Topic - The Kingdom of Heaven.mp3",
      "Topic - Overview of Jesus Teachings.mp3",
      "Topic - Jesus Personal Ministry as He Passed By.mp3",
      "Topic - Training the Kingdom_s Messengers.mp3",
      "Topic - Profound Quotes to Live By.mp3"
    ],
    
    // Series 10: "Jesus' Transformative Moments: Behind the Familiar Stories"
    "jesus-10": [
      "Event - Baptism of Jesus in the Jordan.mp3",
      "Event - Jesus Feeds the Five Thousand.mp3",
      "Event - The Transfiguration.mp3",
      "Event - Resurrection of Lazarus.mp3",
      "Event - The Last Supper.mp3"
    ],
    
    // Series 11: "The Human Experience: Divine Insights on Daily Challenges"
    "jesus-11": [
      "Topic - Art of Living.mp3",
      "Topic - Marriage, Divorce, and Children.mp3",
      "Topic - Balance and Lures of Maturity.mp3",
      "Topic - True Values.mp3",
      "Topic - Why Are Some People Happier than Others.mp3"
    ],
    
    // Series 12: "Jesus' Death & Resurrection: The Expanded Narrative"
    "jesus-12": [
      "Event - Betrayal and Arrest of Jesus.mp3",
      "Event - Pilate_s Last Appeal and Surrender.mp3",
      "Topic - Meaning of Jesus Death on the Cross.mp3",
      "Topic - The Two Thieves on the Cross.mp3",
      "Topic - Jesus_ Post-Resurrection Appearances.mp3"
    ],
    
    // Series 13: "Evolving Faith: From Traditional Religion to Cosmic Truth"
    "jesus-13": [
      "Topic - Evolution of the Atonement Doctrine.mp3",
      "Topic - Concepts of the Expected Messiah.mp3",
      "Topic - Mistakes of Jesus_ Early Followers.mp3",
      "Topic - After Pentecost - Peter, Paul, and Christianity.mp3",
      "Topic - Was Jesus Really Born of a Virgin.mp3"
    ],
    
    // Series 14: "The Human Jesus: Beyond the Divine Image"
    "jesus-14": [
      "Topic - Hobbies and Interests Jesus Enjoyed.mp3",
      "Topic - Did Jesus Ever Feel Sad.mp3",
      "Topic - Did Jesus Marry Anyone.mp3",
      "Topic - Importance of the Early Home Life.mp3",
      "Person - Jesus.mp3"
    ]
  };
  
  // Get the array of episodes for this series
  const episodes = seriesEpisodeMapping[seriesId];
  if (!episodes) {
    console.log(`[DEBUG] No mapping found for series ${seriesId}`);
    return null;
  }
  
  // Episodes are 1-indexed in the UI, but 0-indexed in the array
  const arrayIndex = episodeNum - 1;
  if (arrayIndex < 0 || arrayIndex >= episodes.length) {
    console.log(`[DEBUG] Episode ${episodeNum} is out of range for series ${seriesId}`);
    return null;
  }
  
  // Return the filename - we'll encode it at the time of URL construction
  return episodes[arrayIndex];
} 