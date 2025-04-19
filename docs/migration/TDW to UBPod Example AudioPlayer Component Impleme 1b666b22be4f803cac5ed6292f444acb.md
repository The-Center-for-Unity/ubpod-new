# TDW to UBPod: Example AudioPlayer Component Implementation

Last edited: March 14, 2025 7:08 PM
Tags: Urantia Book Pod

```jsx
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { track } from '@vercel/analytics';
import { buttonHoverVariants } from '../constants/animations';

interface AudioPlayerProps {
  src: string;
  episodeTitle: string;
  episodeId: number;
}

export default function AudioPlayer({ src, episodeTitle, episodeId }: AudioPlayerProps) {
  // State for player functionality
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playDuration, setPlayDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial volume
    audio.volume = volume;
    
    // Handle metadata loading
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    
    // Handle loading errors
    const handleError = () => {
      setError('Failed to load audio file');
      setIsLoading(false);
    };
    
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    
    // Clean up
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Update current time as audio plays
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  // Analytics tracking for play/pause/end events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set up event listeners
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

    // Clean up
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [episodeId, episodeTitle, playDuration]);

  // Play duration tracking
  useEffect(() => {
    let interval: number | undefined;
    
    if (isPlaying) {
      interval = window.setInterval(() => {
        setPlayDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isPlaying]);

  // Play/pause toggle
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        setError('Failed to play audio');
      });
    }
  };

  // Mute toggle
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Seek to position
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume;
      setVolume(newVolume);
      
      // If volume is set to 0, mute; otherwise unmute
      if (newVolume === 0) {
        audio.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        audio.muted = false;
        setIsMuted(false);
      }
    }
  };

  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-navy-light/30 rounded-lg p-6 border border-white/5 flex items-center justify-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
        <span className="ml-3 text-white/70">Loading audio...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-navy-light/30 rounded-lg p-6 border border-white/5 text-center">
        <p className="text-red-400 mb-2">{error}</p>
        <p className="text-white/70 text-sm">Please try downloading the audio file instead.</p>
        <a 
          href={src} 
          download
          className="inline-flex items-center mt-4 px-4 py-2 bg-gold text-navy rounded-full hover:bg-gold-light transition-colors text-sm"
        >
          Download Audio
        </a>
      </div>
    );
  }

  return (
    <div className="bg-navy-light/30 rounded-lg p-6 border border-white/5 hover:border-gold/20 transition-colors">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
      />
      
      <div className="space-y-4">
        {/* Main Controls */}
        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <motion.button
            className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0"
            onClick={togglePlayPause}
            variants={buttonHoverVariants}
            whileHover="hover"
            whileTap="tap"
            aria-label={isPlaying ? 'Pause' : 'Play'}
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
              aria-label="Seek"
            />
            
            {/* Time Indicators */}
            <div className="flex justify-between text-xs text-white/60">
              <span>{formatTime(currentTime)}</span>
              <span>{duration ? formatTime(duration) : '--:--'}</span>
            </div>
          </div>
          
          {/* Volume Controls */}
          <div className="relative group">
            <button
              onClick={toggleMute}
              className="text-white/60 hover:text-white/80 transition-colors p-2"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            
            {/* Volume Slider - Appears on hover */}
            <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block bg-navy-light p-2 rounded shadow-lg">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold"
                aria-label="Volume"
              />
            </div>
          </div>
        </div>
        
        {/* Download option for accessibility */}
        <div className="text-center">
          <a 
            href={src} 
            download
            className="text-xs text-white/50 hover:text-white/70 transition-colors"
          >
            Download audio file
          </a>
        </div>
      </div>
    </div>
  );
}
```