# TDW to UBPod: Data and Logic Migration Guide

Last edited: March 14, 2025 7:05 PM
Tags: Urantia Book Pod

# Data and Logic Migration Guide

This guide focuses on migrating the data models, hooks, and business logic from UBPod to the new Vite application.

## Types and Models

First, we need to establish the type definitions. Create a `src/types/index.ts` file:

```tsx
// src/types/index.ts

export type EpisodeSeries = 'urantia-papers' | 'sadler-workbooks' | 'discover-jesus' | 'history';

export interface Episode {
  id: number;
  title: string;
  description?: string;
  audioUrl: string;
  pdfUrl?: string;
  series: EpisodeSeries;
  sourceUrl?: string;
  imageUrl?: string;
}

// Additional type definitions as needed
export interface AnimationVariants {
  hidden: any;
  visible: any;
  [key: string]: any;
}

```

## Data Files

Migrate the episode data from UBPod. Create the following files in `src/data/`:

### Episodes Data

```tsx
// src/data/episodes.ts

import { Episode } from '../types';

// Main episodes array - Urantia Papers
const urantiaEpisodes: Episode[] = [
  {
    id: 0,
    title: "Foreword",
    audioUrl: "/audio/urantia/foreword.mp3",
    pdfUrl: "/pdf/urantia/foreword.pdf",
    series: "urantia-papers",
    description: "An introduction to the Urantia Papers, covering Deity, reality, universe definitions, and an outline of the structure of the cosmos."
  },
  {
    id: 1,
    title: "The Universal Father",
    audioUrl: "/audio/urantia/paper-001.mp3",
    pdfUrl: "/pdf/urantia/paper-001.pdf",
    series: "urantia-papers",
    description: "A description of the nature of God, the Universal Father, and his relationship to the cosmos and its inhabitants."
  },
  // Add all other Urantia Papers episodes here
  // ...
];

// Discover Jesus Episodes
const discoverJesusEpisodes: Episode[] = [
  {
    id: 120,
    title: "Jesus' Birth and Infancy",
    audioUrl: "/audio/discover-jesus/episode-001.mp3",
    pdfUrl: "/pdf/discover-jesus/episode-001.pdf",
    series: "discover-jesus",
    sourceUrl: "https://discoverjesus.com/event/birth-and-infancy-of-jesus",
    imageUrl: "/images/discover-jesus/birth.jpg",
    description: "The remarkable circumstances surrounding Jesus' birth in Bethlehem and his early childhood."
  },
  // Add other Discover Jesus episodes here
  // ...
];

// History Episodes
const historyEpisodes: Episode[] = [
  {
    id: 1,
    title: "The Forum and the Contact Commission",
    audioUrl: "/audio/history/episode-001.mp3",
    series: "history",
    imageUrl: "/images/history/forum.jpg",
    sourceUrl: "https://urantia-book.org/archive/history/doc722.htm",
    description: "How the Forum was formed and the role of the Contact Commission in receiving the Urantia Papers."
  },
  // Add other History episodes here
  // ...
];

// Sadler Workbooks Episodes
const sadlerWorkbooksEpisodes: Episode[] = [
  {
    id: 1,
    title: "Foreword and Paper 1",
    audioUrl: "/audio/workbooks/workbook-001.mp3",
    series: "sadler-workbooks",
    sourceUrl: "https://urantiabookstudy.com/urantiabook/workbooks/foreword.pdf",
    description: "Dr. William S. Sadler's study notes and commentary on the Foreword and Paper 1."
  },
  // Add other Sadler Workbooks episodes here
  // ...
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
export function getEpisodeById(id: number): Episode | undefined {
  return [
    ...urantiaEpisodes,
    ...discoverJesusEpisodes,
    ...historyEpisodes,
    ...sadlerWorkbooksEpisodes
  ].find(ep => ep.id === id);
}

```

## Hooks

Create custom hooks to manage episode data and audio playback:

### useEpisode Hook

```tsx
// src/hooks/useEpisode.ts

import { useState, useEffect } from 'react';
import { Episode } from '../types';
import { getEpisodeById } from '../data/episodes';

interface UseEpisodeResult {
  episode: Episode | null;
  loading: boolean;
  error: string | null;
  audioExists: boolean | null;
  pdfExists: boolean | null;
  transcriptExists: boolean | null;
  analysisExists: boolean | null;
}

export function useEpisode(id: number): UseEpisodeResult {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioExists, setAudioExists] = useState<boolean | null>(null);
  const [pdfExists, setPdfExists] = useState<boolean | null>(null);
  const [transcriptExists, setTranscriptExists] = useState<boolean | null>(null);
  const [analysisExists, setAnalysisExists] = useState<boolean | null>(null);

  // Get transcript filename based on episode
  const getTranscriptPath = (ep: Episode): string => {
    const { id, series } = ep;
    if (series === 'urantia-papers') {
      return id === 0
        ? `/transcripts/foreword-transcript.pdf`
        : `/transcripts/paper-${id.toString().padStart(3, '0')}-transcript.pdf`;
    } else if (series === 'discover-jesus') {
      return `/transcripts/discover-jesus/episode-${id.toString().padStart(3, '0')}-transcript.pdf`;
    } else if (series === 'history') {
      return `/transcripts/history/episode-${id.toString().padStart(3, '0')}-transcript.pdf`;
    } else { // sadler-workbooks
      return `/transcripts/workbooks/workbook-${id.toString().padStart(3, '0')}-transcript.pdf`;
    }
  };

  // Get analysis filename based on episode
  const getAnalysisPath = (ep: Episode): string => {
    const { id, series } = ep;
    if (series === 'urantia-papers') {
      return id === 0
        ? `/analysis/foreword-analysis.pdf`
        : `/analysis/paper-${id.toString().padStart(3, '0')}-analysis.pdf`;
    } else if (series === 'discover-jesus') {
      return `/analysis/discover-jesus/episode-${id.toString().padStart(3, '0')}-analysis.pdf`;
    } else {
      return ''; // No analysis for other series
    }
  };

  // Fetch episode data and check file existence
  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const ep = getEpisodeById(id);

        if (!ep) {
          setError('Episode not found');
          setLoading(false);
          return;
        }

        setEpisode(ep);

        // Check if audio file exists
        if (ep.audioUrl) {
          try {
            const audioRes = await fetch(ep.audioUrl, { method: 'HEAD' });
            setAudioExists(audioRes.ok);
          } catch {
            setAudioExists(false);
          }
        } else {
          setAudioExists(false);
        }

        // Check if PDF exists
        if (ep.pdfUrl) {
          try {
            const pdfRes = await fetch(ep.pdfUrl, { method: 'HEAD' });
            setPdfExists(pdfRes.ok);
          } catch {
            setPdfExists(false);
          }
        } else {
          setPdfExists(false);
        }

        // Check transcript exists
        const transcriptPath = getTranscriptPath(ep);
        try {
          const transcriptRes = await fetch(transcriptPath, { method: 'HEAD' });
          setTranscriptExists(transcriptRes.ok);
        } catch {
          setTranscriptExists(false);
        }

        // Check if analysis exists (only for certain series)
        if (ep.series === 'urantia-papers' || ep.series === 'discover-jesus') {
          const analysisPath = getAnalysisPath(ep);
          if (analysisPath) {
            try {
              const analysisRes = await fetch(analysisPath, { method: 'HEAD' });
              setAnalysisExists(analysisRes.ok);
            } catch {
              setAnalysisExists(false);
            }
          } else {
            setAnalysisExists(false);
          }
        } else {
          setAnalysisExists(false);
        }
      } catch (err) {
        setError('Failed to load episode');
        console.error('Error loading episode:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [id]);

  return {
    episode,
    loading,
    error,
    audioExists,
    pdfExists,
    transcriptExists,
    analysisExists
  };
}

```

### useAudioAnalytics Hook

```tsx
// src/hooks/useAudioAnalytics.ts

import { useEffect, useRef, useState } from 'react';
import { track } from '@vercel/analytics';

interface UseAudioAnalyticsProps {
  episodeId: number;
  episodeTitle: string;
}

export function useAudioAnalytics({ episodeId, episodeTitle }: UseAudioAnalyticsProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playDuration, setPlayDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      const eventData = { episodeId, title: episodeTitle };
      track('Audio Play', eventData);
      setIsPlaying(true);
      setPlayDuration(0);
    };

    const handlePause = () => {
      const eventData = {
        episodeId,
        title: episodeTitle,
        duration: Math.round(playDuration)
      };
      track('Audio Pause', eventData);
      setIsPlaying(false);
    };

    const handleEnded = () => {
      const eventData = {
        episodeId,
        title: episodeTitle,
        duration: Math.round(audio.duration)
      };
      track('Audio Ended', eventData);
      setIsPlaying(false);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    // Clean up event listeners
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [episodeId, episodeTitle, playDuration]);

  // Update play duration counter
  useEffect(() => {
    let interval: number | undefined;

    if (isPlaying) {
      interval = setInterval(() => {
        setPlayDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  return {
    audioRef,
    isPlaying,
    playDuration
  };
}

```

## Constants

Create constants files to manage shared values and animation configurations:

```tsx
// src/constants/animations.ts

import { AnimationVariants } from '../types';

// Container animation for staggered children
export const containerVariants: AnimationVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

// Item animation for staggered elements
export const itemVariants: AnimationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

// Fade in animation for sections
export const fadeInVariants: AnimationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

// Page transition animations
export const pageVariants: AnimationVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Button hover animation
export const buttonHoverVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

```

## Analytics Integration

Create utility files for analytics integration:

```tsx
// src/utils/analytics.ts

import { track as vercelTrack } from '@vercel/analytics';

interface TrackEvent {
  name: string;
  properties?: Record<string, any>;
}

export function trackEvent({ name, properties }: TrackEvent): void {
  // Track with Vercel Analytics
  vercelTrack(name, properties);

  // Log event to console in development
  if (import.meta.env.MODE === 'development') {
    console.log(`[Analytics]`, name, properties);
  }

  // Add any additional analytics services here
}

```

## Main Entry Point

Create the main entry point file:

```tsx
// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

```

## Handling File Checking

Create a utility function to check if files exist:

```tsx
// src/utils/fileChecks.ts

export async function checkFileExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`Error checking file existence for ${url}:`, error);
    return false;
  }
}

export async function checkFilesExistence({
  audioUrl,
  pdfUrl,
  transcriptUrl,
  analysisUrl
}: {
  audioUrl?: string;
  pdfUrl?: string;
  transcriptUrl?: string;
  analysisUrl?: string;
}) {
  const results = {
    audioExists: false,
    pdfExists: false,
    transcriptExists: false,
    analysisExists: false
  };

  const checks = [
    audioUrl ? checkFileExists(audioUrl).then(exists => { results.audioExists = exists; }) : Promise.resolve(),
    pdfUrl ? checkFileExists(pdfUrl).then(exists => { results.pdfExists = exists; }) : Promise.resolve(),
    transcriptUrl ? checkFileExists(transcriptUrl).then(exists => { results.transcriptExists = exists; }) : Promise.resolve(),
    analysisUrl ? checkFileExists(analysisUrl).then(exists => { results.analysisExists = exists; }) : Promise.resolve()
  ];

  await Promise.all(checks);
  return results;
}

```

These files and utilities provide the foundation for migrating UBPod's data and business logic to the new Vite application. They maintain the same functionality while adapting to the new architecture and incorporating TDW's design patterns.