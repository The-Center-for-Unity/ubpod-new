import { SeriesType } from '../types/index';

export interface SeriesInfo {
  id: string;
  title: string;
  description: string;
  logline?: string;
  category: 'jesus-focused' | 'parts-i-iii';
  imageSrc: string;
  paperRange?: string;
  totalEpisodes: number;
}

// All series information
const seriesData: SeriesInfo[] = [
  // ============================================
  // THE LIFE AND TEACHINGS OF JESUS (14 series)
  // ============================================
  
  // Jesus-Focused Series (1-14)
  {
    id: 'jesus-1',
    title: "Beyond Traditional Religion: The True Nature of God",
    description: "Comparing conventional religious concepts of God with the expanded Urantia perspective",
    logline: "Discover the loving Universal Father behind religious traditions and transform your relationship with a God who values love over fear.",
    category: 'jesus-focused',
    imageSrc: '/images/series/jesus-birth.jpg',
    paperRange: '1-196',
    totalEpisodes: 5
  },
  {
    id: 'jesus-2',
    title: "Jesus Revealed: Beyond the Biblical Account",
    description: "Exploring aspects of Jesus' life not found in traditional Christian texts",
    logline: "Explore untold stories of Jesus' travels, education, and experiences that shaped the divine human who changed our world forever.",
    category: 'jesus-focused',
    imageSrc: '/images/series/jesus-ministry.jpg',
    paperRange: '120-196',
    totalEpisodes: 5
  },
  {
    id: 'jesus-3',
    title: "The Inner Divine Presence: Thought Adjusters & Holy Spirit",
    description: "Comparing traditional concepts of divine guidance with Urantia teachings",
    logline: "Understand the remarkable connection between your mind and God's indwelling spirit, transcending traditional concepts of spiritual guidance.",
    category: 'jesus-focused',
    imageSrc: '/images/series/jesus-teachings.jpg',
    paperRange: '107-112',
    totalEpisodes: 5
  },
  {
    id: 'jesus-4',
    title: "Life After Death: The Mansion World Journey",
    description: "Contrasting traditional afterlife concepts with the Urantia cosmology",
    logline: "Discover what happens after death according to the Urantia Book—a progressive journey of growth far beyond traditional concepts of heaven.",
    category: 'jesus-focused',
    imageSrc: '/images/series/jesus-kingdom.jpg',
    paperRange: '47-48',
    totalEpisodes: 5
  },
  {
    id: 'jesus-5',
    title: "Women in Spiritual Leadership: A New Perspective",
    description: "Comparing historical religious views of women with Jesus' revolutionary approach",
    logline: "Meet the remarkable women who followed Jesus and discover his revolutionary approach to gender equality that was centuries ahead of his time.",
    category: 'jesus-focused',
    imageSrc: '/images/series/jesus-journey.jpg',
    paperRange: '120-196',
    totalEpisodes: 5
  },
  {
    id: 'jesus-6',
    title: "Good & Evil Reconsidered: Beyond Traditional Theology",
    description: "Reframing traditional concepts of sin and evil through Urantia teachings",
    logline: "Explore the true origins of evil, sin, and suffering, and discover a cosmic perspective that transcends traditional religious explanations.",
    category: 'jesus-focused',
    imageSrc: '/images/series/jesus-final-week.jpg',
    paperRange: '53-54',
    totalEpisodes: 5
  },
  {
    id: 'jesus-7',
    title: "Prayer & Worship: Enhanced Understanding",
    description: "Expanding traditional views of communication with the Divine",
    logline: "Transform your spiritual practices with deeper insights into prayer and worship that enhance personal communication with the Divine.",
    category: 'jesus-focused',
    imageSrc: '/images/series/jesus-resurrection.jpg',
    paperRange: '91-196',
    totalEpisodes: 5
  },
  {
    id: 'jesus-8',
    title: "Angels & Celestial Beings: The Cosmic Hierarchy",
    description: "Comparing traditional angelic concepts with the expanded Urantia cosmology",
    logline: "Meet the countless celestial personalities who serve throughout the universe, far beyond traditional religious concepts of angels.",
    category: 'jesus-focused',
    imageSrc: '/images/series/jesus-bestowal.jpg',
    paperRange: '38-39',
    totalEpisodes: 5
  },
  {
    id: 'jesus-9',
    title: "The Kingdom of Heaven: Spiritual Reality vs. Religious Concept",
    description: "Contrasting traditional religious concepts with Jesus' actual teachings",
    logline: "Discover Jesus' true message about the spiritual kingdom—not a future realm, but a present reality of divine relationship.",
    category: 'jesus-focused',
    imageSrc: '/images/series/jesus-apostles.jpg',
    paperRange: '170-180',
    totalEpisodes: 5
  },
  {
    id: 'jesus-10',
    title: "Jesus' Transformative Moments: Behind the Familiar Stories",
    description: "Providing deeper context for familiar Biblical events",
    logline: "Experience familiar biblical stories with expanded details and cosmic context that transforms their spiritual significance.",
    category: 'jesus-focused',
    imageSrc: '/images/series/jesus-sermons.jpg',
    paperRange: '135-190',
    totalEpisodes: 5
  },
  {
    id: 'jesus-11',
    title: "The Human Experience: Divine Insights on Daily Challenges",
    description: "Addressing universal human concerns through Urantia wisdom",
    logline: "Cosmic wisdom for everyday problems—practical divine insights that enhance relationships, work, and personal fulfillment.",
    category: 'jesus-focused',
    imageSrc: '/images/series/jesus-miracles.jpg',
    paperRange: '140-160',
    totalEpisodes: 5
  },
  {
    id: 'jesus-12',
    title: "Jesus' Death & Resurrection: The Expanded Narrative",
    description: "Offering revelatory details beyond traditional accounts",
    logline: "The crucifixion and resurrection reveal a cosmic victory with universal implications beyond religious doctrine about sin and salvation.",
    category: 'jesus-focused',
    imageSrc: '/images/series/jesus-women.jpg',
    paperRange: '185-190',
    totalEpisodes: 5
  },
  {
    id: 'jesus-13',
    title: "Evolving Faith: From Traditional Religion to Cosmic Truth",
    description: "Bridging conventional religious concepts with expanded spiritual understanding",
    logline: "Religious concepts evolve like everything else—see how spiritual truth has progressed from primitive belief toward cosmic revelation.",
    category: 'jesus-focused',
    imageSrc: '/images/series/jesus-family.jpg',
    paperRange: '92-98',
    totalEpisodes: 5
  },
  {
    id: 'jesus-14',
    title: "The Human Jesus: Beyond the Divine Image",
    description: "Humanizing Jesus beyond traditional religious portrayals",
    logline: "Jesus laughed, had hobbies, and experienced emotions—discover the fully human person behind the religious icon.",
    category: 'jesus-focused',
    imageSrc: '/images/series/jesus-legacy.jpg',
    paperRange: '120-196',
    totalEpisodes: 5
  },
  
  // ============================================
  // THE FIFTH EPOCHAL REVELATION (14 series)
  // ============================================
  
  // Parts I-III Series (14 series)
  {
    id: 'cosmic-1',
    title: "Cosmic Origins: Understanding Universe Creation",
    description: "Introducing the fundamental cosmology of the Urantia revelation",
    logline: "Explore the magnificent architecture of creation—from eternal Paradise to the evolving universes of time and space.",
    category: 'parts-i-iii',
    imageSrc: '/images/series/paradise.jpg',
    paperRange: '1-42',
    totalEpisodes: 5
  },
  {
    id: 'cosmic-2',
    title: "Divine Personalities: The Beings Beyond Traditional Religion",
    description: "Introducing celestial personalities and hierarchy",
    logline: "Meet the divine personalities who sustain the universe—from the Paradise Trinity to the many orders of celestial ministers.",
    category: 'parts-i-iii',
    imageSrc: '/images/series/superuniverses.jpg',
    paperRange: '6-28',
    totalEpisodes: 5
  },
  {
    id: 'cosmic-3',
    title: "The Thought Adjuster: Your Inner Divine Compass",
    description: "Understanding the indwelling presence of God",
    logline: "Discover the remarkable fragment of God living within your mind—your divine pilot guiding your spiritual evolution.",
    category: 'parts-i-iii',
    imageSrc: '/images/series/nebadon.jpg',
    paperRange: '107-112',
    totalEpisodes: 5
  },
  {
    id: 'cosmic-4',
    title: "Our Local Universe: Nebadon's Organization",
    description: "Understanding our cosmic neighborhood",
    logline: "Learn about our local universe Nebadon—its creation, administration, and the personalities who manage our cosmic neighborhood.",
    category: 'parts-i-iii',
    imageSrc: '/images/series/trinity.jpg',
    paperRange: '32-35',
    totalEpisodes: 5
  },
  {
    id: 'cosmic-5',
    title: "Angels Among Us: The Seraphic Hosts",
    description: "Understanding angelic ministries",
    logline: "Explore the fascinating reality of angels—their nature, purpose, and how they interact with humans throughout our lives.",
    category: 'parts-i-iii',
    imageSrc: '/images/series/universal-father.jpg',
    paperRange: '38-39',
    totalEpisodes: 5
  },
  {
    id: 'cosmic-6',
    title: "Life After Death: The Ascension Career",
    description: "Understanding the progressive journey after mortal life",
    logline: "The mansion worlds are just the beginning—discover your epic journey through the universe after mortal death.",
    category: 'parts-i-iii',
    imageSrc: '/images/series/eternal-son.jpg',
    paperRange: '40-48',
    totalEpisodes: 5
  },
  {
    id: 'cosmic-7',
    title: "Urantia's Remarkable History",
    description: "Understanding Earth's unique planetary development",
    logline: "The untold story of Earth's (Urantia's) formation, early life development, and the emergence of humanity.",
    category: 'parts-i-iii',
    imageSrc: '/images/series/infinite-spirit.jpg',
    paperRange: '57-67',
    totalEpisodes: 5
  },
  {
    id: 'cosmic-8',
    title: "The Lucifer Rebellion: Cosmic Crisis",
    description: "Understanding the rebellion's impact on Earth's spiritual development",
    logline: "The cosmic rebellion that isolated our world and continues to influence human affairs—discover the truth behind the myths of Satan.",
    category: 'parts-i-iii',
    imageSrc: '/images/series/local-universe-evolution.jpg',
    paperRange: '53-54',
    totalEpisodes: 5
  },
  {
    id: 'cosmic-9',
    title: "Adam & Eve: The True Story",
    description: "Revealing the actual mission and impact of Adam and Eve",
    logline: "The real mission of Adam and Eve on our world went far beyond the biblical garden story—discover their true purpose and legacy.",
    category: 'parts-i-iii',
    imageSrc: '/images/series/life-carriers.jpg',
    paperRange: '73-78',
    totalEpisodes: 5
  },
  {
    id: 'cosmic-10',
    title: "Melchizedek Missions: Divine Interventions",
    description: "Understanding key spiritual interventions in human history",
    logline: "Explore how Melchizedek's emergency mission to Salem became the foundation for Judaism, Christianity, and Islam.",
    category: 'parts-i-iii',
    imageSrc: '/images/series/thought-adjusters.jpg',
    paperRange: '93-98',
    totalEpisodes: 5
  },
  {
    id: 'cosmic-11',
    title: "Evolution of Religion: From Fear to Faith",
    description: "Tracing the development of human religious concepts",
    logline: "Follow humanity's religious evolution from primitive fear of nature through ghost cults to enlightened spiritual understanding.",
    category: 'parts-i-iii',
    imageSrc: '/images/series/urantia-history-deep.jpg',
    paperRange: '85-92',
    totalEpisodes: 5
  },
  {
    id: 'cosmic-12',
    title: "Genuine Spirituality: The Reality of Religious Experience",
    description: "Understanding authentic spiritual growth",
    logline: "Go beyond doctrine and ritual to discover the authentic reality of personal religious experience and spiritual growth.",
    category: 'parts-i-iii',
    imageSrc: '/images/series/lucifer-rebellion.jpg',
    paperRange: '100-103',
    totalEpisodes: 5
  },
  {
    id: 'cosmic-13',
    title: "The Supreme Being: Evolving Deity",
    description: "Understanding the concept of experiential Deity",
    logline: "Discover God the Supreme—the evolving Deity whose growth depends on all our experiences and achievements in time and space.",
    category: 'parts-i-iii',
    imageSrc: '/images/series/adam-eve.jpg',
    paperRange: '105-117',
    totalEpisodes: 5
  },
  {
    id: 'cosmic-14',
    title: "The Divine Family: Understanding Eternal Relationships",
    description: "Exploring the relationships among divine personalities",
    logline: "Explore the relationships between the Universal Father, Eternal Son, and Infinite Spirit—the divine family at the core of all reality.",
    category: 'parts-i-iii',
    imageSrc: '/images/series/seraphim.jpg',
    paperRange: '4-10',
    totalEpisodes: 5
  }
];

/**
 * Get all series information
 * @returns Array of all series
 */
export function getAllSeries(): SeriesInfo[] {
  return seriesData;
}

/**
 * Get series by category
 * @param category The category to filter by
 * @returns Array of series in the specified category
 */
export function getSeriesByCategory(category: 'jesus-focused' | 'parts-i-iii'): SeriesInfo[] {
  return seriesData.filter(series => series.category === category);
}

/**
 * Get series information by ID
 * @param seriesId The ID of the series
 * @returns Series information or undefined if not found
 */
export function getSeriesInfo(seriesId: string): SeriesInfo | undefined {
  return seriesData.find(series => series.id === seriesId);
}

/**
 * Get episode file path based on series and episode number
 * @param seriesId The series ID
 * @param episodeNumber The episode number
 * @returns The file path to the audio file
 */
export function getEpisodeAudioPath(seriesId: string, episodeNumber: number): string {
  // Build the path based on series type and episode number
  return `/audio/${seriesId}/episode-${episodeNumber}.mp3`;
}

/**
 * Get the next episode number for a given series
 * @param seriesId The series ID
 * @param currentEpisode The current episode number
 * @returns The next episode number or null if at the end of the series
 */
export function getNextEpisode(seriesId: string, currentEpisode: number): number | null {
  const series = getSeriesInfo(seriesId);
  if (!series) return null;
  
  return currentEpisode < series.totalEpisodes ? currentEpisode + 1 : null;
}

/**
 * Get the previous episode number for a given series
 * @param seriesId The series ID
 * @param currentEpisode The current episode number
 * @returns The previous episode number or null if at the beginning of the series
 */
export function getPreviousEpisode(seriesId: string, currentEpisode: number): number | null {
  return currentEpisode > 1 ? currentEpisode - 1 : null;
}

/**
 * Get episode title based on series and episode number
 * @param seriesId The series ID
 * @param episodeNumber The episode number
 * @returns The episode title
 */
export function getEpisodeTitle(seriesId: string, episodeNumber: number): string {
  const series = getSeriesInfo(seriesId);
  if (!series) return `Episode ${episodeNumber}`;
  
  // Return a generic episode title
  return `${series.title} - Episode ${episodeNumber}`;
}

/**
 * Check if a series is Jesus-related (for asset handling)
 */
export function isJesusRelatedSeries(seriesId: SeriesType): boolean {
  // Check if it's a new Jesus-focused series
  if (seriesId.startsWith('jesus-')) {
    return true;
  }
  
  // Check if it's a legacy Jesus-related series
  return [
    'discover-jesus',
    // We can remove these since they're no longer in the SeriesType
    // but we keep the function for backward compatibility
  ].includes(seriesId as any);
} 