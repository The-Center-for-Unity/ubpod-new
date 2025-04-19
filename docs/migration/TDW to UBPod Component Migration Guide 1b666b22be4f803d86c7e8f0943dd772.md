# TDW to UBPod: Component Migration Guide

Last edited: March 14, 2025 6:57 PM
Tags: Urantia Book Pod

# Component Migration Guide

This guide details how to adapt specific components from TDW to UBPod, preserving the design language while implementing podcast-specific functionality.

## Header Component

The Header is the main navigation component that users interact with. TDW has a sophisticated header with a clean design we want to preserve.

### Migration Steps:

1. Copy TDW's `src/components/Header.tsx` as a starting point
2. Modify the navigation items to match UBPod's structure:

```tsx
// src/components/Header.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from './Logo';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { path: '/', label: 'The Urantia Papers' },
    { path: '/sadler-workbooks', label: 'Dr. Sadler\'s Workbooks' },
    { path: '/discover-jesus', label: 'Discover Jesus' },
    { path: '/history', label: 'A History of the Urantia Papers' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy/80 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <Logo className="w-8 h-8" />
            <span className="title-subtitle text-sm tracking-[0.15em]">
              Urantia Book Podcast
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="body-lg text-sm text-white/70 hover:text-white/90 transition-colors tracking-wider"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/disclaimer"
              className="text-white/70 hover:text-white/90 transition-colors text-sm"
            >
              Disclaimer
            </Link>
            <a
              href="https://www.thecenterforunity.org/contribute"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-2 bg-gold text-navy rounded-full
                        hover:bg-gold-light transition-all duration-300 btn-text"
            >
              Pay It Forward
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white/70 hover:text-white/90"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="md:hidden fixed inset-0 bg-navy z-40"
        initial={{ opacity: 0, x: '100%' }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          x: isMobileMenuOpen ? 0 : '100%'
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full pt-20 px-6">
          <nav className="space-y-6">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block text-xl text-white/70 hover:text-white/90 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/disclaimer"
              className="block text-xl text-white/70 hover:text-white/90 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Disclaimer
            </Link>
            <a
              href="https://www.thecenterforunity.org/contribute"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-2 bg-gold text-navy rounded-full
                        hover:bg-gold-light transition-all duration-300 btn-text mt-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pay It Forward
            </a>
          </nav>
        </div>
      </motion.div>
    </header>
  );
}

```

1. Key considerations:
    - We're using TDW's color scheme and typography classes
    - The navigation items are updated for UBPod
    - We've preserved the mobile menu animations using framer-motion

## AudioPlayer Component

Create a custom audio player component that matches TDW's design language:

```tsx
// src/components/AudioPlayer.tsx
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { track } from '@vercel/analytics';

interface AudioPlayerProps {
  src: string;
  episodeTitle: string;
  episodeId: number;
}

export default function AudioPlayer({ src, episodeTitle, episodeId }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playDuration, setPlayDuration] = useState(0);

  // Update current time as audio plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle audio duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Play/pause toggle
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Mute toggle
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Seek to position
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Analytics tracking
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set up event listeners
    const handlePlay = () => {
      const eventData = { episodeId, title: episodeTitle };
      track('Audio Play', eventData);
      setPlayDuration(0);
    };

    const handlePause = () => {
      const eventData = {
        episodeId,
        title: episodeTitle,
        duration: Math.round(playDuration)
      };
      track('Audio Pause', eventData);
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

    // Update play duration every second while playing
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, episodeId, episodeTitle, playDuration]);

  return (
    <div className="bg-navy-light/30 rounded-lg p-4 border border-white/5 hover:border-gold/20 transition-colors">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        hidden
      />

      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <motion.button
          className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center"
          onClick={togglePlayPause}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-gold" />
          ) : (
            <Play className="w-5 h-5 text-gold ml-1" />
          )}
        </motion.button>

        {/* Time and Progress */}
        <div className="flex-1 space-y-2">
          {/* Progress Bar */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold"
          />

          {/* Time Indicators */}
          <div className="flex justify-between text-xs text-white/60">
            <span>{formatTime(currentTime)}</span>
            <span>{duration ? formatTime(duration) : '--:--'}</span>
          </div>
        </div>

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="text-white/60 hover:text-white/80 transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}

```

## Episode Card Component

Create a reusable card component for displaying episodes:

```tsx
// src/components/EpisodeCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Episode } from '../types';

interface EpisodeCardProps {
  episode: Episode;
  baseUrl: string;
}

export default function EpisodeCard({ episode, baseUrl }: EpisodeCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-navy-light/30 rounded-lg p-6 border border-white/5 hover:border-gold/20 transition-colors"
    >
      <Link to={`${baseUrl}/${episode.id}`} className="space-y-4">
        <h3 className="title-subtitle tracking-wide text-white/90 line-clamp-2 h-14">
          {episode.title}
        </h3>

        {episode.description && (
          <p className="body-lg text-white/70 line-clamp-3">
            {episode.description}
          </p>
        )}

        <div className="flex items-center justify-end text-gold">
          <span className="text-sm mr-1">Listen</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </Link>
    </motion.div>
  );
}

```

## Episode Grid Component

Create a component to display a grid of episodes:

```tsx
// src/components/EpisodeGrid.tsx
import React from 'react';
import { Episode } from '../types';
import EpisodeCard from './EpisodeCard';

interface EpisodeGridProps {
  episodes: Episode[];
  baseUrl: string;
  title?: string;
}

export default function EpisodeGrid({ episodes, baseUrl, title }: EpisodeGridProps) {
  if (episodes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="body-lg text-white/70">No episodes found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {title && (
        <h2 className="title-subtitle text-2xl tracking-wider text-white/90">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {episodes.map((episode) => (
          <EpisodeCard
            key={episode.id}
            episode={episode}
            baseUrl={baseUrl}
          />
        ))}
      </div>
    </div>
  );
}

```

## PDF Viewer Component

Create a component to display PDFs:

```tsx
// src/components/PDFViewer.tsx
import React from 'react';
import { Download, ExternalLink } from 'lucide-react';

interface PDFViewerProps {
  pdfUrl: string;
  title: string;
}

export default function PDFViewer({ pdfUrl, title }: PDFViewerProps) {
  return (
    <div className="bg-navy-light/30 rounded-lg overflow-hidden border border-white/5">
      <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <span className="font-medium text-white/80">{title}</span>
        <div className="flex items-center gap-3">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-navy-light rounded transition-colors"
            aria-label="Open in new tab"
          >
            <ExternalLink className="w-4 h-4 text-white/60" />
          </a>
          <a
            href={pdfUrl}
            download
            className="p-2 hover:bg-navy-light rounded transition-colors"
            aria-label="Download PDF"
          >
            <Download className="w-4 h-4 text-white/60" />
          </a>
        </div>
      </div>
      <div className="aspect-[4/3] bg-gray-900">
        <object
          data={pdfUrl}
          type="application/pdf"
          width="100%"
          height="100%"
          className="w-full h-full"
        >
          <p className="p-4 text-white/70">
            Your browser doesn't support embedded PDFs. You can
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-gold mx-1">
              open the PDF in a new tab
            </a>
            to view it.
          </p>
        </object>
      </div>
    </div>
  );
}

```

## Layout Component

Create a layout component for consistent page structure:

```tsx
// src/components/Layout.tsx
import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

// Page animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function Layout({ children, className = '' }: LayoutProps) {
  return (
    <div className="min-h-screen bg-navy text-white flex flex-col">
      <Header />
      <motion.main
        className={`flex-grow py-20 ${className}`}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

```

## HomePage Implementation

Implement the home page with the updated components:

```tsx
// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import EpisodeGrid from '../components/EpisodeGrid';
import { getUrantiaPapers } from '../data/episodes';
import { motion } from 'framer-motion';

export default function HomePage() {
  const episodes = getUrantiaPapers();

  // Groups for different parts of the book
  const forewordEpisode = episodes.slice(0, 1);
  const part1Episodes = episodes.slice(1, 32);
  const part2Episodes = episodes.slice(32, 57);
  const part3Episodes = episodes.slice(57, 120);
  const part4Episodes = episodes.slice(120);

  const platformButtons = [
    { name: 'YouTube', url: 'https://www.youtube.com/...' },
    { name: 'Spotify', url: 'https://open.spotify.com/...' },
    { name: 'Apple Podcasts', url: 'https://podcasts.apple.com/...' },
    { name: 'Amazon Music', url: 'https://music.amazon.com/...' }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          className="max-w-3xl mx-auto text-center space-y-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="title-main text-5xl tracking-[0.15em]">
            Urantia Book
            <br />
            Podcast
          </h1>
          <p className="section-subtitle text-xl text-gold tracking-wide">
            These first AI-generated conversations about the Urantia Papers are truly inspiring!
          </p>
          <p className="body-lg max-w-2xl mx-auto tracking-wide">
            Explore the profound teachings of The Urantia Book through AI-narrated episodes.
            Listen while reading along with the original text.
          </p>
        </motion.div>

        {/* Platform Links */}
        <div className="max-w-xl mx-auto mb-16">
          <div className="bg-navy-light/30 rounded-lg p-6 border border-white/5">
            <h2 className="text-center text-lg font-semibold mb-4">Also available on:</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {platformButtons.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gold text-navy rounded-full
                             hover:bg-gold-light transition-colors duration-300 btn-text"
                >
                  {platform.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Episode Sections */}
        <div className="space-y-16">
          {/* Foreword */}
          <section>
            <EpisodeGrid
              episodes={forewordEpisode}
              baseUrl="/episode"
              title="Foreword"
            />
          </section>

          {/* Part I */}
          <section>
            <h2 className="title-subtitle text-2xl tracking-wider text-gold mb-8">
              Part I: The Central and Superuniverses
            </h2>
            <EpisodeGrid
              episodes={part1Episodes}
              baseUrl="/episode"
            />
          </section>

          {/* Only show a few episodes for each part and add a "View All" button */}
          {/* Part II */}
          <section>
            <h2 className="title-subtitle text-2xl tracking-wider text-gold mb-8">
              Part II: The Local Universe
            </h2>
            <EpisodeGrid
              episodes={part2Episodes.slice(0, 6)}
              baseUrl="/episode"
            />
            {part2Episodes.length > 6 && (
              <div className="text-center mt-8">
                <Link
                  to="/part-2"
                  className="inline-flex items-center px-6 py-2 bg-navy-light text-white rounded-full hover:bg-navy transition-colors"
                >
                  View All Part II Episodes
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            )}
          </section>

          {/* Similar sections for Part III and IV */}
        </div>
      </div>
    </Layout>
  );
}

```

## EpisodePage Implementation

```tsx
// src/pages/EpisodePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, FileText, BookOpen, LineChart } from 'lucide-react';
import Layout from '../components/Layout';
import AudioPlayer from '../components/AudioPlayer';
import PDFViewer from '../components/PDFViewer';
import ContactForm from '../components/ContactForm';
import { getUrantiaPapers } from '../data/episodes';

export default function EpisodePage() {
  const { id } = useParams<{ id: string }>();
  const episodeId = parseInt(id || '0');
  const episodes = getUrantiaPapers();
  const episode = episodes.find(ep => ep.id === episodeId);

  const [audioExists, setAudioExists] = useState<boolean | null>(null);
  const [transcriptExists, setTranscriptExists] = useState<boolean | null>(null);
  const [sourceExists, setSourceExists] = useState<boolean | null>(null);
  const [analysisExists, setAnalysisExists] = useState<boolean | null>(null);

  const getFileName = (id: number, type: 'transcript' | 'analysis') => {
    if (id === 0) return `foreword-${type}.pdf`;
    return `paper-${id}-${type}.pdf`;
  };

  // Check if various files exist
  useEffect(() => {
    if (episode) {
      // Check audio
      if (episode.audioUrl) {
        fetch(episode.audioUrl, { method: 'HEAD' })
          .then(response => setAudioExists(response.ok))
          .catch(() => setAudioExists(false));
      } else {
        setAudioExists(false);
      }

      // Check source material
      if (episode.pdfUrl) {
        fetch(episode.pdfUrl, { method: 'HEAD' })
          .then(response => setSourceExists(response.ok))
          .catch(() => setSourceExists(false));
      } else {
        setSourceExists(false);
      }

      // Check analysis if needed
      if (episode.id) {
        const analysisPath = `/analysis/${getFileName(episode.id, 'analysis')}`;
        fetch(analysisPath, { method: 'HEAD' })
          .then(response => setAnalysisExists(response.ok))
          .catch(() => setAnalysisExists(false));
      }

      // Check transcript
      const transcriptPath = `/transcripts/${getFileName(episode.id, 'transcript')}`;
      fetch(transcriptPath, { method: 'HEAD' })
        .then(response => setTranscriptExists(response.ok))
        .catch(() => setTranscriptExists(false));
    }
  }, [episode]);

  if (!episode) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Episode Not Found</h2>
          <p className="mb-6">The episode you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-2 bg-gold text-navy rounded-full hover:bg-gold-light transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </Layout>
    );
  }

  const prevEpisode = episodes.find(ep => ep.id === episodeId - 1);
  const nextEpisode = episodes.find(ep => ep.id === episodeId + 1);

  return (
    <Layout>
      <div className="container mx-auto px-4 pb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{episode.title}</h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Controls and Downloads */}
          <div className="lg:col-span-2 space-y-6">
            {/* Audio Player */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Listen</h2>
              {audioExists === true ? (
                <AudioPlayer
                  src={episode.audioUrl}
                  episodeTitle={episode.title}
                  episodeId={episode.id}
                />
              ) : (
                <div className="bg-navy-light/30 rounded-lg p-6 border border-white/5">
                  <p className="text-white/70 font-medium">Audio coming soon...</p>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
              {prevEpisode ? (
                <Link
                  to={`/episode/${prevEpisode.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-navy-light/30 hover:bg-navy-light/50 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Link>
              ) : (
                <div className="flex-1"></div>
              )}

              {nextEpisode && (
                <Link
                  to={`/episode/${nextEpisode.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-navy-light/30 hover:bg-navy-light/50 rounded-lg transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Downloads Section */}
            <div className="bg-navy-light/30 rounded-lg p-6 border border-white/5">
              <h2 className="text-xl font-semibold mb-4">Downloads</h2>
              <div className="space-y-3">
                {transcriptExists !== null && (
                  transcriptExists ? (
                    <a
                      href={`/transcripts/${getFileName(episode.id, 'transcript')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 hover:bg-navy-light/50 rounded-lg transition-colors group"
                    >
                      <FileText className="w-5 h-5 text-gold" />
                      <span className="flex-1 text-white/80 group-hover:text-white/90">Download Podcast Transcript</span>
                    </a>
                  ) : (
                    <p className="text-white/50 font-medium p-3">Transcript coming soon...</p>
                  )
                )}

                {sourceExists !== null && (
                  sourceExists ? (
                    <a
                      href={episode.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 hover:bg-navy-light/50 rounded-lg transition-colors group"
                    >
                      <BookOpen className="w-5 h-5 text-gold" />
                      <span className="flex-1 text-white/80 group-hover:text-white/90">Download Source Material (Urantia Paper)</span>
                    </a>
                  ) : (
                    <p className="text-white/50 font-medium p-3">Source Material coming soon...</p>
                  )
                )}

                {analysisExists !== null && (
                  analysisExists ? (
                    <a
                      href={`/analysis/${getFileName(episode.id, 'analysis')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 hover:bg-navy-light/50 rounded-lg transition-colors group"
                    >
                      <LineChart className="w-5 h-5 text-gold" />
                      <span className="flex-1 text-white/80 group-hover:text-white/90">Download Episode Analysis</span>
                    </a>
                  ) : (
                    <p className="text-white/50 font-medium p-3">Episode Analysis coming soon...</p>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Column - PDF Viewer */}
          <div className="lg:col-span-3">
            {sourceExists && episode.pdfUrl ? (
              <PDFViewer
                pdfUrl={episode.pdfUrl}
                title="The Urantia Book"
              />
            ) : (
              <div className="bg-navy-light/30 rounded-lg p-6 border border-white/5 text-center">
                <p className="text-white/70">PDF source material coming soon...</p>
              </div>
            )}
          </div>
        </div>

        {/* Learn More Section for Jesus-related episodes */}
        {episodeId >= 120 && episodeId <= 196 && (
          <div className="mt-12 mb-12">
            <h2 className="text-xl font-semibold mb-4">Learn More</h2>
            <div className="bg-navy-light/30 rounded-lg p-6 border border-white/5">
              <h3 className="text-lg font-medium mb-3">Related Content on Discover Jesus:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a
                  href="https://discoverjesus.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-2 bg-navy-light/50 hover:bg-navy-light rounded-lg transition-colors group"
                >
                  <span className="text-white/80 group-hover:text-white/90">Visit DiscoverJesus.com</span>
                  <ChevronRight className="w-4 h-4 text-gold" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Contact Form */}
        <div className="mt-12">
          <ContactForm />
        </div>
      </div>
    </Layout>
  );
}

```

## App.tsx Implementation

Set up the main application structure with routing:

```tsx
// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import EpisodePage from './pages/EpisodePage';
import DiscoverJesusPage from './pages/DiscoverJesusPage';
import DiscoverJesusEpisodePage from './pages/DiscoverJesusEpisodePage';
import HistoryPage from './pages/HistoryPage';
import HistoryEpisodePage from './pages/HistoryEpisodePage';
import WorkbooksPage from './pages/WorkbooksPage';
import WorkbookEpisodePage from './pages/WorkbookEpisodePage';
import DisclaimerPage from './pages/DisclaimerPage';
import NotFoundPage from './pages/NotFoundPage';
import { Analytics } from '@vercel/analytics/react';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/episode/:id" element={<EpisodePage />} />
          <Route path="/discover-jesus" element={<DiscoverJesusPage />} />
          <Route path="/discover-jesus/:id" element={<DiscoverJesusEpisodePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<HistoryEpisodePage />} />
          <Route path="/sadler-workbooks" element={<WorkbooksPage />} />
          <Route path="/sadler-workbooks/:id" element={<WorkbookEpisodePage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;

```

## ContactForm Component

```tsx
// src/components/ContactForm.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactForm() {
  const [showForm, setShowForm] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [question, setQuestion] = useState({
    num1: Math.floor(Math.random() * 10) + 1,
    num2: Math.floor(Math.random() * 10) + 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(answer) === question.num1 + question.num2) {
      setShowForm(true);
      setError('');
    } else {
      setError('Incorrect answer. Please try again.');
    }
  };

  if (showForm) {
    return (
      <div className="bg-navy-light/30 rounded-lg p-6 border border-white/5">
        <h3 className="text-xl font-semibold mb-2">Contact us</h3>
        <p className="text-white/80">Please email us at: contact@thecenterforunity.org</p>
      </div>
    );
  }

  return (
    <div className="bg-navy-light/30 rounded-lg p-6 border border-white/5">
      <h3 className="text-xl font-semibold mb-4">Contact us</h3>
      <p className="mb-4 text-white/80">To access support, please answer this question:</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white/80 mb-2">
            What is {question.num1} + {question.num2}?
          </label>
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="bg-navy-light border border-white/10 px-4 py-2 rounded-lg w-full text-white/90 focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>

        <motion.button
          type="submit"
          className="px-6 py-2 bg-gold text-navy rounded-full hover:bg-gold-light transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Submit
        </motion.button>

        {error && (
          <p className="text-red-400 mt-2">{error}</p>
        )}
      </form>
    </div>
  );
}

```

## Styling Updates

Update the `src/index.css` file to include TDW's styling approach:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import fonts */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap');
@import url('https://use.typekit.net/ruy4wnb.css'); /* For Trajan Pro 3 */

/* Base Typography */
:root {
  --font-trajan: "trajan-pro-3", serif;
  --font-cinzel: 'Cinzel', serif;
  --font-montserrat: 'Montserrat', sans-serif;

  /* Colors */
  --color-navy: #0c1631;
  --color-navy-light: #132048;
  --color-gold: #d4af37;
  --color-gold-light: #e6c458;
}

body {
  font-family: var(--font-montserrat);
  @apply bg-navy text-white;
}

/* Typography utility classes */
@layer components {
  .title-main {
    font-family: var(--font-trajan);
    @apply text-5xl md:text-6xl font-normal text-white;
    line-height: 1.1;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .title-subtitle {
    font-family: var(--font-cinzel);
    @apply text-xl md:text-2xl text-white tracking-wide;
    line-height: 1.4;
    letter-spacing: 0.02em;
  }

  .section-subtitle {
    font-family: var(--font-cinzel);
    @apply text-xl md:text-2xl text-white/90 tracking-wide;
    line-height: 1.4;
    letter-spacing: 0.02em;
  }

  .body-lg {
    font-family: var(--font-montserrat);
    @apply text-lg leading-relaxed text-white/70 font-light;
    line-height: 1.7;
    letter-spacing: 0.015em;
  }

  .btn-text {
    font-family: var(--font-montserrat);
    @apply text-base font-medium tracking-wide;
    letter-spacing: 0.02em;
  }
}

/* Custom color classes */
@layer utilities {
  .bg-navy {
    background-color: var(--color-navy);
  }
  .bg-navy-light {
    background-color: var(--color-navy-light);
  }
  .bg-gold {
    background-color: var(--color-gold);
  }
  .bg-gold-light {
    background-color: var(--color-gold-light);
  }
  .text-gold {
    color: var(--color-gold);
  }
}

```

## Tailwind Configuration

Update the `tailwind.config.js` file to include TDW's theme configuration:

```
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0c1631',
          light: '#132048',
        },
        gold: {
          DEFAULT: '#d4af37',
          light: '#e6c458',
        },
      },
      fontFamily: {
        trajan: ['"trajan-pro-3"', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

```

These components provide a solid foundation for migrating UBPod to a Vite application using TDW's design system. Each component is designed to be modular and reusable, following TDW's styling patterns while preserving UBPod's core functionality.