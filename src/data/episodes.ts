import { Episode } from '../types/index';
import urantiaSummaries from './json/urantia_summaries.json';

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

// Create a map of summaries for quick lookup
const summaryMap = new Map<number, { episodeCard: string, episodePage: string }>();

// Process the summaries from the JSON file
(urantiaSummaries as UrantiaSummary[]).forEach((summary) => {
  summaryMap.set(summary.paper_number, {
    episodeCard: summary.episode_card,
    episodePage: summary.episode_page
  });
});

// Debug: Check how many summaries were loaded
console.log(`Loaded ${summaryMap.size} summaries from JSON file`);
console.log(`First few summaries in map:`, 
  Array.from(summaryMap.entries())
    .slice(0, 5)
    .map(([id, summary]) => ({ 
      id, 
      episodeCard: summary.episodeCard.substring(0, 30) + '...',
      episodePage: summary.episodePage.substring(0, 30) + '...'
    }))
);

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
  
  // Format the title with "Paper X:" prefix for all papers except the Foreword
  const formattedTitle = id === 0 ? "Foreword" : `Paper ${id}: ${title}`;
  
  // Create the episode object with summaries if available
  const episode: Episode = {
    id,
    title: formattedTitle,
    audioUrl: id === 0 ? "/audio/foreword.mp3" : `/audio/paper-${id}.mp3`,
    pdfUrl: id === 0 ? "/pdfs/foreword.pdf" : `/pdfs/paper-${id}.pdf`,
    series: "urantia-papers",
    description: id === 0 ? "An introduction to the Urantia Papers, covering Deity, reality, universe definitions, and an outline of the structure of the cosmos." : `Paper ${id}: ${title}`,
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
  // Complete list of paper titles
  const paperTitles: Record<number, string> = {
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
  
  const papers: Episode[] = [];
  
  // Create all papers from 0 to 196
  for (let paperId = 0; paperId <= 196; paperId++) {
    // Get the title from our mapping, or use a generic title if not found
    const title = paperTitles[paperId] || `Paper ${paperId}`;
    
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
    title: "Birth and Infancy of Jesus",
    audioUrl: "/audio/discoverjesus/Event - Birth and Infancy of Jesus.mp3",
    series: "discover-jesus",
    sourceUrl: "https://discoverjesus.com/event/birth-and-infancy-of-jesus",
    imageUrl: "/images/discoverjesus/birth.jpg",
    description: "The remarkable circumstances surrounding Jesus' birth in Bethlehem and his early childhood."
  },
  {
    id: 2,
    title: "The Twelve Apostles",
    audioUrl: "/audio/discoverjesus/Group - The Twelve Apostles.mp3",
    series: "discover-jesus",
    sourceUrl: "https://discoverjesus.com/group/the-twelve-apostles",
    description: "An overview of the twelve apostles chosen by Jesus, their backgrounds, and their relationships with the Master."
  }
];

// History Episodes
const historyEpisodes: Episode[] = [
  {
    id: 1,
    title: "A History of the Urantia Papers",
    audioUrl: "/audio/history/a-history-of-the-urantia-papers.mp3",
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
    audioUrl: "/audio/sadler/vol4-part1.mp3",
    series: "sadler-workbooks",
    sourceUrl: "https://urantiabookstudy.com/urantiabook/workbooks/foreword.pdf",
    description: "Dr. William S. Sadler's study notes and commentary on the Foreword and Paper 1."
  },
  {
    id: 2,
    title: "Dr. Sadler's Workbooks - Volume 4, Part 2",
    audioUrl: "/audio/sadler/vol4-part2.mp3",
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

// Helper function to get an episode by ID from any series
export function getEpisodeById(id: number, series: string): Episode | undefined {
  switch (series) {
    case 'urantia-papers':
      return urantiaEpisodes.find(ep => ep.id === id);
    case 'discover-jesus':
      return discoverJesusEpisodes.find(ep => ep.id === id);
    case 'history':
      return historyEpisodes.find(ep => ep.id === id);
    case 'sadler-workbooks':
      return sadlerWorkbooksEpisodes.find(ep => ep.id === id);
    default:
      return undefined;
  }
} 