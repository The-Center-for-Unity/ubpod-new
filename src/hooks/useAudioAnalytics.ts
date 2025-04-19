import { useRef, useEffect } from 'react';
import { track } from '../utils/analytics';

interface UseAudioAnalyticsProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  title: string;
  id?: string | number;
}

/**
 * Custom hook to track audio playback events
 */
export function useAudioAnalytics({ audioRef, title, id = 'unknown' }: UseAudioAnalyticsProps) {
  const playDurationRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Track play events
    const handlePlay = () => {
      const eventData = { 
        episodeId: id, 
        title 
      };
      track('Audio Play', eventData);
      playDurationRef.current = 0;
      lastUpdateTimeRef.current = Date.now();
    };
    
    // Track pause events
    const handlePause = () => {
      // Update play duration when paused
      if (lastUpdateTimeRef.current > 0) {
        playDurationRef.current += (Date.now() - lastUpdateTimeRef.current) / 1000;
      }
      
      const eventData = { 
        episodeId: id, 
        title,
        duration: Math.round(playDurationRef.current)
      };
      track('Audio Pause', eventData);
    };
    
    // Track end events
    const handleEnded = () => {
      const eventData = { 
        episodeId: id, 
        title,
        duration: Math.round(audio.duration)
      };
      track('Audio Ended', eventData);
    };
    
    // Track seeking events
    const handleSeeking = () => {
      const eventData = { 
        episodeId: id, 
        title,
        position: Math.round(audio.currentTime)
      };
      track('Audio Seek', eventData);
    };
    
    // Add event listeners
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('seeking', handleSeeking);
    
    // Clean up
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('seeking', handleSeeking);
    };
  }, [audioRef, id, title]);
} 