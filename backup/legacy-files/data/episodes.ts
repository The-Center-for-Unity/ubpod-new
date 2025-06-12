import { Episode } from '../types/index';
import urantiaSummaries from './json/urantia_summaries.json';
import urantiaSummariesEs from './json/urantia_summaries_es.json';
import scraperSummaries from './json/summaries.json';  // Import the scraped summaries
import { getAudioUrl, getPdfUrl } from '../config/audio';
import { getEpisode as getEpisodeUtil, getDiscoverJesusSummary } from '../utils/episodeUtils';
import { loadUrantiaPaperTranslations, getSpanishPaperTitle, getSpanishPaperCard, getSpanishPaperPage, getEnglishPaperTitle } from '../utils/translationLoaders';

// Create a map from the scraped summaries for fast lookup by ID
interface ScrapedSummary {
  id: string;
  title: string;
  shortSummary: string;
  fullSummary: string;
  sourceUrl: string;
}

// Convert the array of summaries into a map keyed by ID for easier lookup
const discoverJesusSummaries: Record<string, ScrapedSummary> = {};
(scraperSummaries as ScrapedSummary[]).forEach((summary) => {
  discoverJesusSummaries[summary.id] = summary;
});

// Debug: Log information about the summaries data
console.log('DEBUG SUMMARIES:', {
  summariesCount: (scraperSummaries as ScrapedSummary[]).length,
  mappedCount: Object.keys(discoverJesusSummaries).length,
  sampleKeys: Object.keys(discoverJesusSummaries).slice(0, 3),
  hasPersonalityOfGod: !!discoverJesusSummaries["topic/the-personality-of-god"],
  personalityOfGodData: discoverJesusSummaries["topic/the-personality-of-god"]
});

// Define the structure of the summary data
interface UrantiaSummary {
  paper_number: number;
  title: string;
  filename: string;
  episode_card: string;
  episode_page: string;
}

// Debug: Log the raw summary data for the first few entries
console.log('Raw summary data (first 5 entries):', 
  (urantiaSummaries as UrantiaSummary[]).slice(0, 5).map(s => ({
    paper_number: s.paper_number,
    title: s.title,
    episode_card_preview: s.episode_card.substring(0, 30) + '...'
  }))
);

// Create a map of English summaries for quick lookup
const summaryMap = new Map<number, { episodeCard: string, episodePage: string }>();
(urantiaSummaries as UrantiaSummary[]).forEach((summary) => {
  summaryMap.set(summary.paper_number, {
    episodeCard: summary.episode_card,
    episodePage: summary.episode_page
  });
});

// Create a map of Spanish summaries for quick lookup
const summaryMapEs = new Map<number, { title: string, episodeCard: string, episodePage: string }>();
(urantiaSummariesEs as UrantiaSummary[]).forEach((summary) => {
  summaryMapEs.set(summary.paper_number, {
    title: summary.title,
    episodeCard: summary.episode_card,
    episodePage: summary.episode_page
  });
});

// Debug: Check how many summaries were loaded
console.log(`Loaded ${summaryMap.size} English summaries and ${summaryMapEs.size} Spanish summaries from JSON files`);

// Helper function to get summary for a paper
function getSummaryForPaper(paperId: number): { episodeCard: string, episodePage: string } | undefined {
  const summary = summaryMap.get(paperId);
  
  // Debug: Log lookup attempts for the first few papers
  if (paperId < 5) {
    console.log(`Looking up summary for paper ${paperId}: ${summary ? 'FOUND' : 'NOT FOUND'}`);
  }
  
  return summary;
}

// Helper function to create an episode with summaries automatically applied
function createUrantiaPaper(id: number, title: string): Episode {
  const paperSummary = getSummaryForPaper(id);
  
  // Load Spanish translations using the new translation loader
  const spanishTitle = getSpanishPaperTitle(id);
  const spanishCard = getSpanishPaperCard(id);
  const spanishPage = getSpanishPaperPage(id);
  
  // Format the title with "Paper X:" prefix for all papers except the Foreword
  const formattedTitle = id === 0 ? "Foreword" : `Paper ${id}: ${title}`;
  
  // Format Spanish title appropriately
  const formattedSpanishTitle = spanishTitle 
    ? (id === 0 ? spanishTitle : `Documento ${id}: ${spanishTitle}`)
    : formattedTitle; // Fallback to English if no Spanish translation
  
  // Create the episode object with summaries if available
  const episode: Episode = {
    id,
    title: formattedTitle,
    audioUrl: getAudioUrl('urantia-papers', id),
    pdfUrl: getPdfUrl('urantia-papers', id),
    series: "urantia-papers",
    // The main description should be the shorter card summary (logline)
    description: paperSummary?.episodeCard, 
    // The collapsible summary should be the longer page summary
    summary: paperSummary?.episodePage,
    cardSummary: paperSummary?.episodeCard, // Keep for other uses
    translations: {
      en: {
        title: formattedTitle,
        description: paperSummary?.episodeCard, // Short logline
        summary: paperSummary?.episodePage,     // Long description
        cardSummary: paperSummary?.episodeCard
      },
      es: {
        title: formattedSpanishTitle,
        description: spanishCard || paperSummary?.episodeCard,
        summary: spanishPage || paperSummary?.episodePage,
        cardSummary: spanishCard || paperSummary?.episodeCard,
      },
    }
  };
  
  // Add summaries if available
  if (paperSummary) {
    episode.cardSummary = paperSummary.episodeCard;
    episode.summary = paperSummary.episodePage;
    
    // Debug: Log when summaries are successfully added
    if (id < 5) {
      console.log(`Added summaries to paper ${id}:`, {
        cardSummary: paperSummary.episodeCard.substring(0, 30) + '...',
        summary: paperSummary.episodePage.substring(0, 30) + '...'
      });
    }
  } else {
    console.warn(`No summary found for paper ${id}: ${title}`);
  }
  
  return episode;
}

// Function to generate all Urantia Papers with summaries
function generateUrantiaPapers(): Episode[] {
  
  const papers: Episode[] = [];
  
  // Create all papers from 0 to 196
  for (let paperId = 0; paperId <= 196; paperId++) {
    // Get the title from our translation loader, or use a generic title if not found
    const title = getEnglishPaperTitle(paperId) || `Paper ${paperId}`;
    
    // Create the episode with or without summary
    const episode = createUrantiaPaper(paperId, title);
    papers.push(episode);
    
    // Debug: Log the first few papers to check if summaries are attached
    if (paperId < 5) {
      console.log(`Paper ${paperId} summary:`, {
        title: episode.title,
        hasSummary: !!episode.summary,
        hasCardSummary: !!episode.cardSummary,
        cardSummaryPreview: episode.cardSummary?.substring(0, 50) + '...',
        summaryPreview: episode.summary?.substring(0, 50) + '...'
      });
    }
  }
  
  return papers;
}

// Generate all papers with summaries
const urantiaEpisodes = generateUrantiaPapers();

// Discover Jesus Episodes
const discoverJesusEpisodes: Episode[] = [
  {
    id: 1,
    title: "The Personality of God",
    audioUrl: getAudioUrl('discover-jesus', 1),
    series: "discover-jesus",
    sourceUrl: "https://discoverjesus.com/topic/the-personality-of-god",
    description: "God isn't an abstract force but a personality who seeks relationship—meet the Universal Father who knows you personally.",
    cardSummary: (() => {
      const lookupKey = "topic/the-personality-of-god";
      const summary = discoverJesusSummaries[lookupKey];
      console.log(`[JESUS DEBUG] Episode 1 lookup: "${lookupKey}" -> ${summary ? 'FOUND' : 'NOT FOUND'}`);
      if (summary) {
        console.log(`[JESUS DEBUG] Episode 1 shortSummary length:`, summary.shortSummary?.length);
        console.log(`[JESUS DEBUG] Episode 1 shortSummary preview:`, summary.shortSummary?.substring(0, 100));
      }
      return summary?.shortSummary;
    })(),
    summary: discoverJesusSummaries["topic/the-personality-of-god"]?.fullSummary
  },
  {
    id: 2,
    title: "Birth and Infancy of Jesus",
    audioUrl: getAudioUrl('discover-jesus', 2),
    series: "discover-jesus",
    sourceUrl: "https://discoverjesus.com/event/birth-and-infancy-of-jesus",
    imageUrl: "/images/discoverjesus/birth.jpg",
    description: "The remarkable circumstances surrounding Jesus' birth in Bethlehem and his early childhood.",
    cardSummary: discoverJesusSummaries["event/birth-and-infancy-of-jesus"]?.shortSummary,
    summary: discoverJesusSummaries["event/birth-and-infancy-of-jesus"]?.fullSummary
  },
  {
    id: 3,
    title: "Sojourn in Alexandria",
    audioUrl: getAudioUrl('discover-jesus', 3),
    series: "discover-jesus",
    sourceUrl: "https://discoverjesus.com/event/sojourn-in-alexandria",
    description: "During his unrecorded youth, Jesus studied with the greatest minds in Alexandria—shaping a cosmic perspective no gospel ever mentioned.",
    cardSummary: discoverJesusSummaries["event/sojourn-in-alexandria"]?.shortSummary,
    summary: discoverJesusSummaries["event/sojourn-in-alexandria"]?.fullSummary
  },
  {
    id: 4,
    title: "Jesus' First Passover",
    audioUrl: getAudioUrl('discover-jesus', 4),
    series: "discover-jesus",
    sourceUrl: "https://discoverjesus.com/event/jesus-first-passover-age-13",
    description: "Jesus' first visit to Jerusalem and the temple at age 13, where he engaged with religious scholars.",
    cardSummary: discoverJesusSummaries["event/jesus-first-passover-age-13"]?.shortSummary,
    summary: discoverJesusSummaries["event/jesus-first-passover-age-13"]?.fullSummary
  },
  {
    id: 5,
    title: "The Great Temptation",
    audioUrl: getAudioUrl('discover-jesus', 5),
    series: "discover-jesus",
    sourceUrl: "https://discoverjesus.com/event/the-great-temptation",
    description: "Jesus' six weeks alone with God on Mount Hermon, where he mastered his mind and consecrated himself for his earthly mission.",
    cardSummary: discoverJesusSummaries["event/the-great-temptation"]?.shortSummary,
    summary: discoverJesusSummaries["event/the-great-temptation"]?.fullSummary
  }
];

// Debug log for the first episode
console.log('DEBUG FIRST EPISODE:', {
  episode: discoverJesusEpisodes[0],
  cardSummaryExists: !!discoverJesusEpisodes[0].cardSummary,
  summaryExists: !!discoverJesusEpisodes[0].summary,
  cardSummaryValue: discoverJesusEpisodes[0].cardSummary,
  summaryValuePreview: discoverJesusEpisodes[0].summary?.substring(0, 100)
});

// History Episodes
const historyEpisodes: Episode[] = [
  {
    id: 1,
    title: "A History of the Urantia Papers",
    audioUrl: getAudioUrl('history', 1),
    series: "history",
    imageUrl: "/images/history/a history of the urantia papers.png",
    sourceUrl: "https://urantia-book.org/archive/history/doc722.htm",
    description: "How the Forum was formed and the role of the Contact Commission in receiving the Urantia Papers."
  }
];

// Sadler Workbooks Episodes
const sadlerWorkbooksEpisodes: Episode[] = [
  {
    id: 1,
    title: "Dr. Sadler's Workbooks - Volume 4, Part 1",
    audioUrl: getAudioUrl('sadler-workbooks', 1),
    series: "sadler-workbooks",
    sourceUrl: "https://urantiabookstudy.com/urantiabook/workbooks/foreword.pdf",
    description: "Dr. William S. Sadler's study notes and commentary on the Foreword and Paper 1."
  },
  {
    id: 2,
    title: "Dr. Sadler's Workbooks - Volume 4, Part 2",
    audioUrl: getAudioUrl('sadler-workbooks', 2),
    series: "sadler-workbooks",
    sourceUrl: "https://urantiabookstudy.com/urantiabook/workbooks/foreword.pdf",
    description: "Dr. William S. Sadler's study notes and commentary on Papers 2-3."
  }
];

// Helper function to get the part number for a Urantia Paper
export function getUrantiaPaperPart(paperId: number): number {
  if (paperId >= 0 && paperId <= 31) return 1;
  if (paperId >= 32 && paperId <= 56) return 2;
  if (paperId >= 57 && paperId <= 119) return 3;
  if (paperId >= 120 && paperId <= 196) return 4;
  return 0; // Invalid paper ID
}

// Exported getter functions
export function getUrantiaPapers(): Episode[] {
  return urantiaEpisodes;
}

export function getDiscoverJesusEpisodes(): Episode[] {
  return discoverJesusEpisodes;
}

export function getHistoryEpisodes(): Episode[] {
  return historyEpisodes;
}

export function getSadlerWorkbooks(): Episode[] {
  return sadlerWorkbooksEpisodes;
}

/**
 * Get an episode by ID and series
 * @param id The episode ID
 * @param series The series ID
 * @param language Optional language code (e.g., 'es' for Spanish)
 * @returns The episode or undefined if not found
 */
export function getEpisodeById(id: number, series: string, language: string = 'en'): Episode | undefined {
  // Debug for the specific series we're working with
  console.log('DEBUG getEpisodeById:', { id, series, language, isJesusSeries: series.startsWith('jesus-') });
  
  // Check for new series IDs (jesus-1, jesus-2, cosmic-1, etc.)
  if (series.startsWith('jesus-') || series.startsWith('cosmic-') || series.startsWith('series-platform-')) {
    try {
      // For new series IDs, use the utility function from episodeUtils with language support
      const episodeData = getEpisodeUtil(series, id, language);
      console.log('DEBUG jesus series episode:', { 
        episodeFound: !!episodeData,
        language,
        hasSummary: episodeData?.summary ? true : false,
        hasCardSummary: episodeData?.cardSummary ? true : false,
        cardSummary: episodeData?.cardSummary?.substring(0, 50),
        summary: episodeData?.summary?.substring(0, 50)
      });
      return episodeData;
    } catch (err) {
      console.error(`Error getting episode for ${series}:${id} in language ${language}`, err);
      return undefined;
    }
  }
  
  // Handle Urantia Papers specifically
  if (series === 'urantia-papers') {
    const episode = urantiaEpisodes.find(ep => ep.id === id);
    
    // If we found the episode and language is not English, apply language-specific adjustments
    if (episode && language !== 'en') {
      const translatedEpisode: Episode = {
        ...episode,
        // Apply language-specific paths to URLs
        audioUrl: language === 'en' ? episode.audioUrl : episode.audioUrl.replace(/\/([^/]+)$/, `/${language}/$1`),
        pdfUrl: episode.pdfUrl ? (language === 'en' ? episode.pdfUrl : episode.pdfUrl.replace(/\/([^/]+)$/, `/${language}/$1`)) : undefined,
        transcriptUrl: episode.transcriptUrl ? (language === 'en' ? episode.transcriptUrl : episode.transcriptUrl.replace(/\/([^/]+)$/, `/${language}/$1`)) : undefined,
        
        // Apply translations if available
        ...(episode.translations && episode.translations[language] ? {
          title: episode.translations[language].title || episode.title,
          description: episode.translations[language].description || episode.description,
          summary: episode.translations[language].summary || episode.summary,
          cardSummary: episode.translations[language].cardSummary || episode.cardSummary,
          shortSummary: episode.translations[language].shortSummary || episode.shortSummary,
        } : {})
      };
      
      return translatedEpisode;
    }
    
    return episode;
  }
  
  // Handle discover-jesus episodes
  if (series === 'discover-jesus') {
    const episode = discoverJesusEpisodes.find(ep => ep.id === id);
    
    // Debug the episode retrieval
    console.log('DEBUG GET_EPISODE_BY_ID:', {
      requestedId: id,
      requestedSeries: series,
      language,
      episodeFound: !!episode,
      episodeDetails: episode ? {
        id: episode.id,
        title: episode.title, 
        hasSummary: !!episode.summary,
        hasCardSummary: !!episode.cardSummary
      } : null
    });
    
    if (!episode) return undefined;
    
    // If the episode exists but doesn't have summaries (cardSummary/summary), 
    // try to add them directly from the JSON
    if (episode.sourceUrl && (!episode.cardSummary || !episode.summary)) {
      // Extract the path part from the URL (everything after discoverjesus.com/)
      const urlPath = episode.sourceUrl.split('discoverjesus.com/')[1];
      
      // Debug the summary lookup
      console.log('DEBUG SUMMARY LOOKUP:', {
        urlPath,
        summaryExists: !!discoverJesusSummaries[urlPath],
        summaryData: discoverJesusSummaries[urlPath]
      });
      
      // Get the summaries directly from the imported JSON
      const summaryData = discoverJesusSummaries[urlPath];
      
      if (summaryData) {
        episode.cardSummary = episode.cardSummary || summaryData.shortSummary;
        episode.summary = episode.summary || summaryData.fullSummary;
      }
    }
    
    // If language is not English, apply language-specific adjustments
    if (language !== 'en') {
      const translatedEpisode: Episode = {
        ...episode,
        // Apply language-specific paths to URLs
        audioUrl: language === 'en' ? episode.audioUrl : episode.audioUrl.replace(/\/([^/]+)$/, `/${language}/$1`),
        
        // Apply translations if available
        ...(episode.translations && episode.translations[language] ? {
          title: episode.translations[language].title || episode.title,
          description: episode.translations[language].description || episode.description,
          summary: episode.translations[language].summary || episode.summary,
          cardSummary: episode.translations[language].cardSummary || episode.cardSummary,
          shortSummary: episode.translations[language].shortSummary || episode.shortSummary,
        } : {})
      };
      
      return translatedEpisode;
    }
    
    return episode;
  }
  
  // For other legacy series types (history, sadler-workbooks)
  if (series === 'history' || series === 'sadler-workbooks') {
    const seriesData = series === 'history' ? historyEpisodes : sadlerWorkbooksEpisodes;
    const episode = seriesData.find(ep => ep.id === id);
    
    if (episode && language !== 'en') {
      // Apply language-specific adjustments
      const translatedEpisode: Episode = {
        ...episode,
        // Apply language-specific paths to URLs
        audioUrl: language === 'en' ? episode.audioUrl : episode.audioUrl.replace(/\/([^/]+)$/, `/${language}/$1`),
        
        // Apply translations if available
        ...(episode.translations && episode.translations[language] ? {
          title: episode.translations[language].title || episode.title,
          description: episode.translations[language].description || episode.description,
          summary: episode.translations[language].summary || episode.summary,
          cardSummary: episode.translations[language].cardSummary || episode.cardSummary,
          shortSummary: episode.translations[language].shortSummary || episode.shortSummary,
        } : {})
      };
      
      return translatedEpisode;
    }
    
    return episode;
  }
  
  // If we get here, we couldn't find the episode
  return undefined;
}

// Define the DiscoverJesus links
export const discoverJesusLinks: {
  [key: number]: { title: string; url: string }[]
} = {
  120: [
    { title: "Jesus' Bestowal Mission", url: "https://discoverjesus.com/topic/jesus-bestowal-mission" },
    { title: "Jesus Christ – Our Creator Son", url: "https://discoverjesus.com/topic/jesus-christ-our-creator-son" },
    { title: "Did Jesus Marry Anyone?", url: "https://discoverjesus.com/topic/did-jesus-marry-anyone" }
  ],
  121: [
    { title: "The Western World in the First Century", url: "https://discoverjesus.com/topic/the-western-world-in-the-first-century" },
    { title: "Concepts of the Expected Messiah", url: "https://discoverjesus.com/topic/concepts-of-the-expected-messiah" }
  ],
  122: [
    { title: "Gabriel's Announcement to Mary", url: "https://discoverjesus.com/event/gabriels-announcement-to-mary" },
    { title: "Birth and Infancy of Jesus", url: "https://discoverjesus.com/event/birth-and-infancy-of-jesus" },
    { title: "Three Wise Men", url: "https://discoverjesus.com/group/three-wise-men" }
  ],
  123: [
    { title: "Jesus' Early Education", url: "https://discoverjesus.com/topic/jesus-early-education" },
    { title: "Jesus' Fourth Year", url: "https://discoverjesus.com/event/jesus-fourth-year" },
    { title: "Jesus' Life in Nazareth – Age 6", url: "https://discoverjesus.com/event/jesus-life-in-nazareth-age-6" }
  ],
  124: [
    { title: "Jesus' Tenth Year", url: "https://discoverjesus.com/event/jesus-tenth-year" },
    { title: "Jesus' Eleventh Year", url: "https://discoverjesus.com/event/jesus-eleventh-year" },
    { title: "Jesus' Twelfth Year", url: "https://discoverjesus.com/event/jesus-twelfth-year" }
  ],
  125: [
    { title: "Jesus' First Passover – Age 13", url: "https://discoverjesus.com/event/jesus-first-passover-age-13" },
    { title: "Joseph", url: "https://discoverjesus.com/person/joseph-father-of-jesus" },
    { title: "Mary", url: "https://discoverjesus.com/person/mary-mother-of-jesus" }
  ],
  126: [
    { title: "Jesus' Fourteenth Year", url: "https://discoverjesus.com/event/jesus-fourteenth-year" },
    { title: "Death of Joseph", url: "https://discoverjesus.com/event/death-of-joseph" },
    { title: "Jesus' Fifteenth Year", url: "https://discoverjesus.com/event/jesus-fifteenth-year" }
  ],
  127: [
    { title: "Jesus' Sixteenth Year", url: "https://discoverjesus.com/event/jesus-sixteenth-year" },
    { title: "Jesus' Seventeenth Year", url: "https://discoverjesus.com/event/jesus-seventeenth-year" },
    { title: "Jesus' Eighteenth Year", url: "https://discoverjesus.com/event/jesus-eighteenth-year" }
  ],
  128: [
    { title: "Jesus' Twenty-First Year", url: "https://discoverjesus.com/event/jesus-twenty-first-year" },
    { title: "Jesus' Twenty-Second Year", url: "https://discoverjesus.com/event/jesus-twenty-second-year-new-job-in-sepphoris" },
    { title: "Jesus' Twenty-Fourth Year", url: "https://discoverjesus.com/event/jesus-twenty-fourth-year" }
  ],
  129: [
    { title: "Zebedee Hires Jesus in His Boatbuilding Shop", url: "https://discoverjesus.com/event/zebedee-hires-jesus-in-his-boatbuilding-shop" },
    { title: "Zebedee's Family", url: "https://discoverjesus.com/group/zebedees-family" },
    { title: "Jesus' Combined Nature – Human and Divine", url: "https://discoverjesus.com/topic/jesus-combined-nature-human-and-divine" }
  ],
  130: [
    { title: "Jesus' Tour of the Mediterranean World", url: "https://discoverjesus.com/topic/jesus-tour-of-the-mediterranean-world" },
    { title: "Good and Evil", url: "https://discoverjesus.com/topic/good-and-evil" },
    { title: "Jesus Delivers a Discourse on Reality", url: "https://discoverjesus.com/event/jesus-delivers-a-discourse-on-reality" }
  ],
  131: [
    { title: "Religion – Buddhism", url: "https://discoverjesus.com/topic/religion-buddhism" },
    { title: "Personal Religion of Jesus", url: "https://discoverjesus.com/topic/personal-religion-of-jesus" },
    { title: "Anger – The Lack of Understanding", url: "https://discoverjesus.com/topic/anger-the-lack-of-understanding" }
  ],
  132: [
    { title: "Jesus Counsels the Rich Man", url: "https://discoverjesus.com/event/jesus-counsels-the-rich-man" },
    { title: "Jesus' Sojourn at Rome", url: "https://discoverjesus.com/event/jesus-sojourn-at-rome" },
    { title: "True Values", url: "https://discoverjesus.com/topic/true-values" }
  ],
  133: [
    { title: "Jesus Delivers a Discourse on the Soul", url: "https://discoverjesus.com/event/jesus-delivers-a-discourse-on-the-soul" },
    { title: "How Did Jesus Treat Women?", url: "https://discoverjesus.com/topic/how-did-jesus-treat-women" },
    { title: "Loving God Instead of Fearing God", url: "https://discoverjesus.com/topic/loving-god-instead-of-fearing-god" }
  ],
  134: [
    { title: "Jesus Delivers the Urmia Lectures", url: "https://discoverjesus.com/event/jesus-delivers-the-urmia-lectures" },
    { title: "Jesus' Year of Solitary Wanderings", url: "https://discoverjesus.com/event/jesus-year-of-solitary-wanderings" },
    { title: "Jesus' Final Period of Waiting", url: "https://discoverjesus.com/event/jesus-final-period-of-waiting" }
  ],
  135: [
    { title: "Birth of John the Baptist", url: "https://discoverjesus.com/event/birth-of-john-the-baptist" },
    { title: "Baptism of Jesus in the Jordan", url: "https://discoverjesus.com/event/baptism-of-jesus-in-the-jordan" },
    { title: "Forty Days in the Wilderness", url: "https://discoverjesus.com/event/forty-days-in-the-wilderness" }
  ],
  136: [
    { title: "Concepts of the Expected Messiah", url: "https://discoverjesus.com/topic/concepts-of-the-expected-messiah" },
    { title: "Jesus Destroys all of his writings", url: "https://discoverjesus.com/event/jesus-destroys-all-of-his-writings" },
    { title: "Rebellion – Lucifer, Satan, and Caligastia", url: "https://discoverjesus.com/topic/rebellion-lucifer-satan-and-caligastia" }
  ],
  137: [
    { title: "Jesus Chooses Andrew and Simon as Apostles", url: "https://discoverjesus.com/event/jesus-chooses-andrew-and-simon-as-apostles" },
    { title: "Choosing Phillip and Nathaniel as Apostles", url: "https://discoverjesus.com/event/choosing-philip-and-nathaniel-as-apostles" },
    { title: "Jesus Attends a Wedding at Cana", url: "https://discoverjesus.com/event/jesus-attends-a-wedding-at-cana" }
  ],
  138: [
    { title: "The Final Six Apostles are Chosen", url: "https://discoverjesus.com/event/the-final-six-apostles-are-chosen" },
    { title: "Training the Kingdom's Messengers", url: "https://discoverjesus.com/topic/training-the-kingdoms-messengers" },
    { title: "Organization of the Twelve Apostles", url: "https://discoverjesus.com/event/organization-of-the-twelve-apostles" }
  ],
  139: [
    { title: "The Twelve Apostles", url: "https://discoverjesus.com/group/the-twelve-apostles" },
    { title: "Self-Mastery – Be You Perfect", url: "https://discoverjesus.com/topic/self-mastery-be-you-perfect" },
    { title: "Overview of Jesus' Teachings", url: "https://discoverjesus.com/topic/overview-of-jesus-teachings" }
  ],
  140: [
    { title: "Jesus Ordains His Twelve Apostles", url: "https://discoverjesus.com/event/jesus-ordains-his-twelve-apostles" },
    { title: "Analysis of the Ordination Sermon", url: "https://discoverjesus.com/event/analysis-of-the-ordination-sermon" },
    { title: "Fruits of the Spirit", url: "https://discoverjesus.com/topic/fruits-of-the-spirit" }
  ],
  141: [
    { title: "Beginning the Public Work", url: "https://discoverjesus.com/event/beginning-the-public-work" },
    { title: "Did Jesus Ever Feel Sad?", url: "https://discoverjesus.com/topic/did-jesus-ever-feel-sad" },
    { title: "Why Do We Suffer from Affliction?", url: "https://discoverjesus.com/topic/why-do-we-suffer-from-affliction" }
  ],
  142: [
    { title: "The Visit with Jacob about God's Wrath", url: "https://discoverjesus.com/event/the-visit-with-jacob-about-gods-wrath" },
    { title: "The Visit with Nicodemus", url: "https://discoverjesus.com/event/the-visit-with-nicodemus" }
  ],
  143: [
    { title: "Jesus' Discourse on Self-Mastery", url: "https://discoverjesus.com/event/jesus-discourse-on-self-mastery" },
    { title: "Jesus and the Apostles Take a 3-Day Vacation", url: "https://discoverjesus.com/event/jesus-and-the-apostles-take-a-3-day-vacation" },
    { title: "Jesus Meets Nalda - the Women at the Well", url: "https://discoverjesus.com/event/jesus-meets-nalda-the-woman-at-the-well" }
  ],
  144: [
    { title: "Jesus and the Twelve Retire for Two Months", url: "https://discoverjesus.com/event/jesus-and-the-twelve-retire-for-two-months" },
    { title: "Worship and Prayer", url: "https://discoverjesus.com/topic/worship-and-prayer" },
    { title: "Jesus Introduces the Lord's Prayer to the Apostles", url: "https://discoverjesus.com/event/jesus-introduces-the-lords-prayer-to-the-apostles" }
  ],
  145: [
    { title: "The Draught of Fishes", url: "https://discoverjesus.com/event/the-draught-of-fishes" },
    { title: "The Healing at Sundown", url: "https://discoverjesus.com/event/the-healing-at-sundown" },
    { title: "Why Do We Suffer from Affliction?", url: "https://discoverjesus.com/topic/why-do-we-suffer-from-affliction" }
  ],
  146: [
    { title: "First Preaching Tour of Galilee", url: "https://discoverjesus.com/event/first-preaching-tour-of-galilee" },
    { title: "Discourse About Spirits of the Dead", url: "https://discoverjesus.com/event/discourse-about-spirits-of-the-dead" },
    { title: "Healing the Son of Titus", url: "https://discoverjesus.com/event/healing-the-son-of-titus" }
  ],
  147: [
    { title: "Jesus' Discourse About the Rule of Living", url: "https://discoverjesus.com/event/jesus-discourse-about-the-rule-of-living" },
    { title: "Six Jerusalem Spies", url: "https://discoverjesus.com/group/six-jerusalem-spies" },
    { title: "Visiting Simon the Pharisee", url: "https://discoverjesus.com/event/visiting-simon-the-pharisee" }
  ],
  148: [
    { title: "Discourse on Job – Misunderstanding Suffering", url: "https://discoverjesus.com/event/discourse-on-job-misunderstanding-suffering" },
    { title: "Establishing The Kingdom's First Hospital", url: "https://discoverjesus.com/event/establishing-the-kingdoms-first-hospital" },
    { title: "Jesus Discusses the Purpose of Affliction", url: "https://discoverjesus.com/event/jesus-discusses-the-purpose-of-affliction" }
  ],
  149: [
    { title: "What Teaching Methods Did Jesus Use?", url: "https://discoverjesus.com/topic/what-teaching-methods-did-jesus-use" },
    { title: "The Second Preaching Tour", url: "https://discoverjesus.com/event/the-second-preaching-tour" },
    { title: "Why Are Some People Happier than Others?", url: "https://discoverjesus.com/topic/why-are-some-people-happier-than-others" }
  ],
  150: [
    { title: "The Third Preaching Tour", url: "https://discoverjesus.com/event/the-third-preaching-tour" },
    { title: "Women's Evangelistic Corps", url: "https://discoverjesus.com/group/womens-evangelistic-corps" },
    { title: "Jesus' Discourse about Magic and Superstition", url: "https://discoverjesus.com/event/jesus-discourse-about-magic-and-superstition" }
  ],
  151: [
    { title: "Jesus' Parables on the Kingdom of Heaven", url: "https://discoverjesus.com/event/jesus-parables-on-the-kingdom-of-heaven" },
    { title: "Jesus Discusses the Benefits of Using Parables", url: "https://discoverjesus.com/event/jesus-discusses-the-benefits-of-using-parables" },
    { title: "Jesus Teaches the Parable of the Sower", url: "https://discoverjesus.com/event/jesus-teaches-the-parable-of-the-sower" }
  ],
  152: [
    { title: "The King-Making Episode", url: "https://discoverjesus.com/event/the-king-making-episode" },
    { title: "Jesus Feeds the Five Thousand", url: "https://discoverjesus.com/event/jesus-feeds-the-five-thousand" },
    { title: "Jesus Awakens Girl in Coma", url: "https://discoverjesus.com/event/jesus-awakens-girl-in-coma" }
  ],
  153: [
    { title: "The Epochal Sermon", url: "https://discoverjesus.com/event/the-epochal-sermon" },
    { title: "Six Jerusalem Spies", url: "https://discoverjesus.com/group/six-jerusalem-spies" }
  ],
  154: [
    { title: "Synagogues of Palestine are Closed to Jesus", url: "https://discoverjesus.com/event/synagogues-of-palestine-are-closed-to-jesus" },
    { title: "Jesus Departs in Haste", url: "https://discoverjesus.com/event/jesus-departs-in-haste" }
  ],
  155: [
    { title: "Jesus' Discourse on True Religion", url: "https://discoverjesus.com/event/jesus-discourse-on-true-religion" },
    { title: "Fleeing Through Northern Galilee", url: "https://discoverjesus.com/event/fleeing-through-northern-galilee" },
    { title: "Jesus' Discourse on Religion of the Spirit", url: "https://discoverjesus.com/event/jesus-discourse-on-religion-of-the-spirit" }
  ],
  156: [
    { title: "Jesus' Teaching at Tyre", url: "https://discoverjesus.com/event/jesus-teaching-at-tyre" },
    { title: "Jesus and the Twenty-Four Teach in Sidon", url: "https://discoverjesus.com/event/jesus-and-the-twenty-four-teach-in-sidon" },
    { title: "Jesus Heals the Daughter of Norana", url: "https://discoverjesus.com/event/jesus-heals-the-daughter-of-norana" }
  ],
  157: [
    { title: "Peter's Confession", url: "https://discoverjesus.com/event/peters-confession" },
    { title: "Concepts of the Expected Messiah", url: "https://discoverjesus.com/topic/concepts-of-the-expected-messiah" }
  ],
  158: [
    { title: "The Transfiguration", url: "https://discoverjesus.com/event/the-transfiguration" },
    { title: "Healing the Boy with Double Affliction", url: "https://discoverjesus.com/event/healing-the-boy-with-double-affliction" }
  ],
  159: [
    { title: "Lessons from the Decapolis Tour", url: "https://discoverjesus.com/event/lessons-from-the-decapolis-tour" },
    { title: "What Teaching Methods Did Jesus Use?", url: "https://discoverjesus.com/topic/what-teaching-methods-did-jesus-use" }
  ],
  160: [
    { title: "Nathaniel and Thomas' Discussion with Rodan", url: "https://discoverjesus.com/event/nathaniel-and-thomas-discussion-with-rodan" },
    { title: "Philosophy – Rodan of Alexandria", url: "https://discoverjesus.com/topic/philosophy-rodan-of-alexandria" },
    { title: "Balance and Lures of Maturity", url: "https://discoverjesus.com/topic/balance-and-lures-of-maturity" }
  ],
  161: [
    { title: "Nathaniel and Thomas' Discussion with Rodan", url: "https://discoverjesus.com/event/nathaniel-and-thomas-discussion-with-rodan" },
    { title: "Philosophy – Rodan of Alexandria", url: "https://discoverjesus.com/topic/philosophy-rodan-of-alexandria" },
    { title: "Jesus' Combined Nature – Human and Divine", url: "https://discoverjesus.com/topic/jesus-combined-nature-human-and-divine" }
  ],
  162: [
    { title: "Jesus' Public Declaration of Divinity Brings Danger", url: "https://discoverjesus.com/event/jesus-public-declaration-of-divinity-brings-danger" },
    { title: "The Woman Taken in Adultery", url: "https://discoverjesus.com/event/the-woman-taken-in-adultery" },
    { title: "First Temple Talk", url: "https://discoverjesus.com/event/first-temple-talk" }
  ],
  163: [
    { title: "Ordination of the Seventy", url: "https://discoverjesus.com/event/ordination-of-the-seventy" },
    { title: "Jesus Counsels the Rich Man", url: "https://discoverjesus.com/event/jesus-counsels-the-rich-man" },
    { title: "What Did Jesus Say about Wealth?", url: "https://discoverjesus.com/topic/what-did-jesus-say-about-wealth" }
  ],
  164: [
    { title: "Jesus Tells the Story of the Good Samaritan", url: "https://discoverjesus.com/event/jesus-tells-the-story-of-the-good-samaritan" },
    { title: "Jesus Heals Josiah – the Blind Beggar", url: "https://discoverjesus.com/event/jesus-heals-josiah-the-blind-beggar" },
    { title: "Sanhedrin", url: "https://discoverjesus.com/group/sanhedrin" }
  ]
}; 

// Export for debugging
export const debugData = {
  summariesCount: (scraperSummaries as ScrapedSummary[]).length,
  mappedCount: Object.keys(discoverJesusSummaries).length,
  personalityOfGodData: discoverJesusSummaries["topic/the-personality-of-god"],
  sampleData: (scraperSummaries as ScrapedSummary[]).slice(0, 3)
}; 