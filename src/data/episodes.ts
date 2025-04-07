import { Episode } from '../types/index';
import urantiaSummaries from './json/urantia_summaries.json';
import { getAudioUrl, getPdfUrl } from '../config/audio';
import { getEpisode as getEpisodeUtil } from '../utils/episodeUtils';

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
    audioUrl: getAudioUrl('urantia-papers', id),
    pdfUrl: getPdfUrl('urantia-papers', id),
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
    audioUrl: getAudioUrl('discover-jesus', 1),
    series: "discover-jesus",
    sourceUrl: "https://discoverjesus.com/event/birth-and-infancy-of-jesus",
    imageUrl: "/images/discoverjesus/birth.jpg",
    description: "The remarkable circumstances surrounding Jesus' birth in Bethlehem and his early childhood."
  },
  {
    id: 2,
    title: "The Twelve Apostles",
    audioUrl: getAudioUrl('discover-jesus', 2),
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
 * @returns The episode or undefined if not found
 */
export function getEpisodeById(id: number, series: string): Episode | undefined {
  // Check for new series IDs (jesus-1, jesus-2, cosmic-1, etc.)
  if (series.startsWith('jesus-') || series.startsWith('cosmic-') || series.startsWith('series-platform-')) {
    try {
      // For new series IDs, use the utility function from episodeUtils
      return getEpisodeUtil(series, id);
    } catch (err) {
      console.error(`Error getting episode for ${series}:${id}`, err);
      return undefined;
    }
  }
  
  // Handle Urantia Papers specifically
  if (series === 'urantia-papers') {
    return urantiaEpisodes.find(ep => ep.id === id);
  }
  
  // For other legacy series types
  // (Implementation would depend on what other legacy series are available)
  
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