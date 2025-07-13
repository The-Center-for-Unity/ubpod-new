// Translation loader utilities for connecting existing Spanish translations
// to TypeScript data structures

// Import existing translation files from src directory
import urantiaTranslationsEs from '../locales/es/content/urantia-papers.json';
import urantiaTranslationsEn from '../locales/en/content/urantia-papers.json';
import jesusSummariesEs from '../locales/es/content/jesus-summaries.json';
import jesusSummariesEn from '../locales/en/content/jesus-summaries.json';
import generalSummariesEs from '../locales/es/content/general-summaries.json';
import generalSummariesEn from '../locales/en/content/general-summaries.json';

// Cache for loaded translations
const translationCache = new Map<string, any>();

// English paper titles (will be moved to separate JSON file later)
const ENGLISH_PAPER_TITLES: Record<number, string> = {
  0: "Foreword",
  1: "The Universal Father",
  2: "The Nature of God",
  3: "The Attributes of God",
  4: "God's Relation to the Universe",
  5: "God's Relation to the Individual",
  6: "The Eternal Son",
  7: "Relation of the Eternal Son to the Universe",
  8: "The Infinite Spirit",
  9: "Relation of the Infinite Spirit to the Universe",
  10: "The Paradise Trinity",
  11: "The Eternal Isle of Paradise",
  12: "The Universe of Universes",
  13: "The Sacred Spheres of Paradise",
  14: "The Central and Divine Universe",
  15: "The Seven Superuniverses",
  16: "The Seven Master Spirits",
  17: "The Seven Supreme Spirit Groups",
  18: "The Supreme Trinity Personalities",
  19: "The Co-ordinate Trinity-Origin",
  20: "The Paradise Sons of God",
  21: "The Paradise Creator Sons",
  22: "The Trinitized Sons of God",
  23: "The Solitary Messengers",
  24: "Higher Personalities of the Infinite",
  25: "The Messenger Hosts of Space",
  26: "Ministering Spirits of the Central",
  27: "Ministry of the Primary Supernaphim",
  28: "Ministering Spirits of the Superuniverses",
  29: "The Universe Power Directors",
  30: "Personalities of the Grand Universe",
  31: "The Corps of the Finality",
  32: "The Evolution of Local Universes",
  33: "Administration of the Local Universe",
  34: "The Local Universe Mother Spirit",
  35: "The Local Universe Sons of God",
  36: "The Life Carriers",
  37: "Personalities of the Local Universe",
  38: "Ministering Spirits of the Local Universe",
  39: "The Seraphic Hosts",
  40: "The Ascending Sons of God",
  41: "Physical Aspects of the Local Universe",
  42: "Energy—Mind and Matter",
  43: "The Constellations",
  44: "The Celestial Artisans",
  45: "The Local System Administration",
  46: "The Local System Headquarters",
  47: "The Seven Mansion Worlds",
  48: "The Morontia Life",
  49: "The Inhabited Worlds",
  50: "The Planetary Princes",
  51: "The Planetary Adams",
  52: "Planetary Mortal Epochs",
  53: "The Lucifer Rebellion",
  54: "Problems of the Lucifer Rebellion",
  55: "The Spheres of Light and Life",
  56: "Universal Unity",
  57: "The Origin of Urantia",
  58: "Life Establishment on Urantia",
  59: "The Marine-Life Era on Urantia",
  60: "Urantia During the Early Land-Life Era",
  61: "The Mammalian Era on Urantia",
  62: "The Dawn Races of Early Man",
  63: "The First Human Family",
  64: "The Evolutionary Races of Color",
  65: "The Overcontrol of Evolution",
  66: "The Planetary Prince of Urantia",
  67: "The Planetary Rebellion",
  68: "The Dawn of Civilization",
  69: "Primitive Human Institutions",
  70: "The Evolution of Human Government",
  71: "Development of the State",
  72: "Government on a Neighboring Planet",
  73: "The Garden of Eden",
  74: "Adam and Eve",
  75: "The Default of Adam and Eve",
  76: "The Second Garden",
  77: "The Midway Creatures",
  78: "The Violet Race After the Days of Adam",
  79: "Andite Expansion in the Orient",
  80: "Andite Expansion in the Occident",
  81: "Development of Modern Civilization",
  82: "The Evolution of Marriage",
  83: "The Marriage Institution",
  84: "Marriage and Family Life",
  85: "The Origins of Worship",
  86: "Early Evolution of Religion",
  87: "The Ghost Cults",
  88: "Fetishes, Charms, and Magic",
  89: "Sin, Sacrifice, and Atonement",
  90: "Shamanism—Medicine Men and Priests",
  91: "The Evolution of Prayer",
  92: "The Later Evolution of Religion",
  93: "Machiventa Melchizedek",
  94: "The Melchizedek Teachings in the Orient",
  95: "The Melchizedek Teachings in the Levant",
  96: "Yahweh—God of the Hebrews",
  97: "Evolution of the God Concept",
  98: "The Melchizedek Teachings in the Occident",
  99: "The Social Problems of Religion",
  100: "Religion in Human Experience",
  101: "The Real Nature of Religion",
  102: "The Foundations of Religious Faith",
  103: "The Reality of Religious Experience",
  104: "Growth of the Trinity Concept",
  105: "Deity and Reality",
  106: "Universe Levels of Reality",
  107: "Origin and Nature of Thought Adjusters",
  108: "Mission and Ministry of Thought Adjusters",
  109: "Relation of Adjusters to Universe Creatures",
  110: "Relation of Adjusters to Individual Mortals",
  111: "The Adjuster and the Soul",
  112: "Personality Survival",
  113: "Seraphic Guardians of Destiny",
  114: "Seraphic Planetary Government",
  115: "The Supreme Being",
  116: "The Almighty Supreme",
  117: "God the Supreme",
  118: "Supreme and Ultimate—Time and Space",
  119: "The Bestowals of Christ Michael",
  120: "The Bestowal of Michael on Urantia",
  121: "The Times of Michael's Bestowal",
  122: "Birth and Infancy of Jesus",
  123: "The Early Childhood of Jesus",
  124: "The Later Childhood of Jesus",
  125: "Jesus at Jerusalem",
  126: "The Two Crucial Years",
  127: "The Adolescent Years",
  128: "Jesus' Early Manhood",
  129: "The Later Adult Life of Jesus",
  130: "On the Way to Rome",
  131: "The World's Religions",
  132: "The Sojourn at Rome",
  133: "The Return from Rome",
  134: "The Transition Years",
  135: "John the Baptist",
  136: "Baptism and the Forty Days",
  137: "Tarrying Time in Galilee",
  138: "Training the Kingdom's Messengers",
  139: "The Twelve Apostles",
  140: "The Ordination of the Twelve",
  141: "Beginning the Public Work",
  142: "The Passover at Jerusalem",
  143: "Going Through Samaria",
  144: "At Gilboa and in the Decapolis",
  145: "Four Eventful Days at Capernaum",
  146: "First Preaching Tour of Galilee",
  147: "The Interlude Visit to Jerusalem",
  148: "Training Evangelists at Bethsaida",
  149: "The Second Preaching Tour",
  150: "The Third Preaching Tour",
  151: "Tarrying and Teaching by the Seaside",
  152: "Events Leading up to the Capernaum Crisis",
  153: "The Crisis at Capernaum",
  154: "Last Days at Capernaum",
  155: "Fleeing Through Northern Galilee",
  156: "The Sojourn at Tyre and Sidon",
  157: "At Caesarea-Philippi",
  158: "The Mount of Transfiguration",
  159: "The Decapolis Tour",
  160: "Rodan of Alexandria",
  161: "Further Discussions with Rodan",
  162: "At the Feast of Tabernacles",
  163: "Ordination of the Seventy at Magadan",
  164: "At the Feast of Dedication",
  165: "The Perean Mission Begins",
  166: "Last Visit to Northern Perea",
  167: "The Visit to Philadelphia",
  168: "The Resurrection of Lazarus",
  169: "Last Teaching at Pella",
  170: "The Kingdom of Heaven",
  171: "On the Way to Jerusalem",
  172: "Going into Jerusalem",
  173: "Monday in Jerusalem",
  174: "Tuesday Morning in the Temple",
  175: "The Last Temple Discourse",
  176: "Tuesday Evening on Mount Olivet",
  177: "Wednesday, the Rest Day",
  178: "Last Day at the Camp",
  179: "The Last Supper",
  180: "The Farewell Discourse",
  181: "Final Admonitions and Warnings",
  182: "In Gethsemane",
  183: "The Betrayal and Arrest of Jesus",
  184: "Before the Sanhedrin Court",
  185: "The Trial Before Pilate",
  186: "Just Before the Crucifixion",
  187: "The Crucifixion",
  188: "The Time of the Tomb",
  189: "The Resurrection",
  190: "Morontia Appearances of Jesus",
  191: "Appearances to the Apostles and Other Leaders",
  192: "Appearances in Galilee",
  193: "Final Appearances and Ascension",
  194: "Bestowal of the Spirit of Truth",
  195: "After Pentecost",
  196: "The Faith of Jesus"
};

/**
 * Load Urantia paper translations from Spanish JSON
 */
export function loadUrantiaPaperTranslations(): Record<number, { title: string; episode_card: string; episode_page: string }> {
  const cacheKey = 'urantia-papers-es';
  
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  
  const translations: Record<number, { title: string; episode_card: string; episode_page: string }> = {};
  
  // Parse the JSON structure (paper_0, paper_1, etc.)
  Object.entries(urantiaTranslationsEs).forEach(([key, value]) => {
    if (key.startsWith('paper_')) {
      const paperNumber = parseInt(key.replace('paper_', ''));
      translations[paperNumber] = {
        title: value.title,
        episode_card: value.episode_card,
        episode_page: value.episode_page
      };
    }
  });
  
  translationCache.set(cacheKey, translations);
  return translations;
}

/**
 * Get Spanish title for a specific paper
 */
export function getSpanishPaperTitle(paperId: number): string | undefined {
  const translations = loadUrantiaPaperTranslations();
  return translations[paperId]?.title;
}

/**
 * Get Spanish episode card for a specific paper
 */
export function getSpanishPaperCard(paperId: number): string | undefined {
  const translations = loadUrantiaPaperTranslations();
  return translations[paperId]?.episode_card;
}

/**
 * Get Spanish episode page summary for a specific paper
 */
export function getSpanishPaperPage(paperId: number): string | undefined {
  const translations = loadUrantiaPaperTranslations();
  return translations[paperId]?.episode_page;
}

/**
 * Get English paper title for a specific paper
 */
export function getEnglishPaperTitle(paperId: number): string | undefined {
  return ENGLISH_PAPER_TITLES[paperId];
}

/**
 * Get English paper card summary from translation system
 */
export function getEnglishPaperCard(paperId: number): string | undefined {
  const key = `paper_${paperId}` as keyof typeof urantiaTranslationsEn;
  return urantiaTranslationsEn[key]?.episode_card;
}

/**
 * Get English paper page summary from translation system
 */
export function getEnglishPaperPage(paperId: number): string | undefined {
  const key = `paper_${paperId}` as keyof typeof urantiaTranslationsEn;
  return urantiaTranslationsEn[key]?.episode_page;
}

/**
 * Load Jesus summaries translations from Spanish JSON
 */
export function loadJesusSummariesTranslations(): Record<string, { shortSummary: string; fullSummary: string }> {
  const cacheKey = 'jesus-summaries-es';
  
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  
  const translations: Record<string, { shortSummary: string; fullSummary: string }> = {};
  
  // Parse the JSON structure directly - it's already in the correct format
  for (const [id, content] of Object.entries(jesusSummariesEs)) {
    if (content && typeof content === 'object' && 'shortSummary' in content && 'fullSummary' in content) {
      translations[id] = {
        shortSummary: content.shortSummary,
        fullSummary: content.fullSummary
      };
    }
  }
  
  translationCache.set(cacheKey, translations);
  return translations;
}

/**
 * Get Spanish short summary for a specific Jesus summary
 */
export function getSpanishJesusShortSummary(summaryId: string): string | undefined {
  const translations = loadJesusSummariesTranslations();
  return translations[summaryId]?.shortSummary;
}

/**
 * Get Spanish full summary for a specific Jesus summary
 */
export function getSpanishJesusFullSummary(summaryId: string): string | undefined {
  const translations = loadJesusSummariesTranslations();
  return translations[summaryId]?.fullSummary;
}

// Placeholder functions for other translation loaders (to be implemented)
export function loadSeriesMetadataTranslations() {
  // TODO: Implement when we work on episodeUtils.ts, seriesUtils.ts, episodes.json
  return {};
} 