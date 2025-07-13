// Platform series (removed - consolidated into urantia-papers)

// Jesus-focused series
export type JesusFocusedSeriesType = 
  'jesus-1' | 
  'jesus-2' | 
  'jesus-3' | 
  'jesus-4' | 
  'jesus-5' | 
  'jesus-6' | 
  'jesus-7' | 
  'jesus-8' | 
  'jesus-9' | 
  'jesus-10' | 
  'jesus-11' | 
  'jesus-12' | 
  'jesus-13' | 
  'jesus-14';

// Parts I-III series
export type PartsSeriesType = 
  'central-1' | 
  'central-2' | 
  'local-1' | 
  'local-2' | 
  'local-3';

// Legacy series types (for backward compatibility)
export type LegacySeriesType = 
  'urantia-papers' | 
  'discover-jesus' | 
  'sadler-workbooks';

// Combined series type
export type SeriesType = 
  // Jesus-focused series
  | 'jesus-1' | 'jesus-2' | 'jesus-3' | 'jesus-4' | 'jesus-5' 
  | 'jesus-6' | 'jesus-7' | 'jesus-8' | 'jesus-9' | 'jesus-10'
  | 'jesus-11' | 'jesus-12' | 'jesus-13' | 'jesus-14'
  
  // Parts I-III series (Fifth Epochal Revelation)
  | 'cosmic-1' | 'cosmic-2' | 'cosmic-3' | 'cosmic-4' | 'cosmic-5'
  | 'cosmic-6' | 'cosmic-7' | 'cosmic-8' | 'cosmic-9' | 'cosmic-10'
  | 'cosmic-11' | 'cosmic-12' | 'cosmic-13' | 'cosmic-14'
  
  // Legacy series IDs (for backward compatibility)
  | 'urantia-papers' | 'discover-jesus' | 'sadler-workbooks'
  
  // Platform-specific series removed - consolidated into urantia-papers

export type EpisodeSeries = SeriesType;

export interface EpisodeTranslations {
  [language: string]: {
    title: string;
    description?: string;
    summary?: string;
    cardSummary?: string;
    shortSummary?: string;
  };
}

export interface Episode {
  id: number;
  title: string;
  description?: string;
  shortSummary?: string;  // Brief summary that appears under the title
  summary?: string;       // Full detailed summary
  cardSummary?: string;   // Summary used in cards/previews
  audioUrl: string;
  pdfUrl?: string;
  series: SeriesType;
  sourceUrl?: string;
  imageUrl?: string;
  transcriptUrl?: string;
  summaryKey?: string;    // Link to translation content
  translations?: EpisodeTranslations; // Added translations support
}

export interface AnimationVariants {
  hidden: any;
  visible: any;
  [key: string]: any;
}

// Audio player types
export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  loading: boolean;
  error: string | null;
  playbackSpeed: number;
}

// Navigation types
export interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}

// UI types
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

// Animation types
export interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

// Define the type for our master episodes JSON file
export interface EpisodeData {
  id: number;
  title: string;
  audioUrl: string;
  pdfUrl: string;
  summaryKey: string | null;
  imageUrl: string;
}

export interface SeriesData {
  seriesTitle: string;
  seriesDescription: string;
  episodes: EpisodeData[];
}

export interface EpisodesJson {
  [seriesId: string]: SeriesData;
} 