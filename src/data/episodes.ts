import { Episode } from '../types';

// Main episodes array - Urantia Papers
const urantiaEpisodes: Episode[] = [
  {
    id: 0,
    title: "Foreword",
    audioUrl: "/audio/foreword.mp3",
    pdfUrl: "/pdfs/foreword.pdf",
    series: "urantia-papers",
    description: "An introduction to the Urantia Papers, covering Deity, reality, universe definitions, and an outline of the structure of the cosmos."
  },
  {
    id: 1,
    title: "Paper 1: The Universal Father",
    audioUrl: "/audio/paper-1.mp3",
    pdfUrl: "/pdfs/paper-1.pdf",
    series: "urantia-papers",
    description: "A description of the nature of God, the Universal Father, and his relationship to the cosmos and its inhabitants."
  },
  {
    id: 2,
    title: "Paper 2: The Nature of God",
    audioUrl: "/audio/paper-2.mp3",
    pdfUrl: "/pdfs/paper-2.pdf",
    series: "urantia-papers",
    description: "An exploration of the attributes and character of God, including his infinity, perfection, and love."
  }
];

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