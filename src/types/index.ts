export type EpisodeSeries = 'urantia-papers' | 'sadler-workbooks' | 'discover-jesus' | 'history';

export interface Episode {
  id: number;
  title: string;
  audioUrl: string;
  pdfUrl?: string;
  series: SeriesType;
  description: string;
  summary?: string;
  cardSummary?: string;
  imageUrl?: string;
  sourceUrl?: string;
}

export type SeriesType = 'urantia-papers' | 'discover-jesus' | 'history' | 'sadler-workbooks';

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