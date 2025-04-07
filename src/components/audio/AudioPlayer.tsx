import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Clock } from 'lucide-react';
import { AudioPlayerState } from '../../types/index';
import { useAudioAnalytics } from '../../hooks/useAudioAnalytics';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  episodeId?: string | number;
  onEnded?: () => void;
  onError?: (error: string) => void;
}

export default function AudioPlayer({ audioUrl, title, episodeId, onEnded, onError }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playerState, setPlayerState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    loading: true,
    error: null,
    playbackSpeed: parseFloat(localStorage.getItem('audioPlaybackSpeed') || '1.0')
  });
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showSpeedControls, setShowSpeedControls] = useState(false);

  const { isPlaying, currentTime, duration, volume, loading, error, playbackSpeed } = playerState;

  // Log audio URL for debugging
  useEffect(() => {
    console.log(`[AudioPlayer] Loading audio from URL: ${audioUrl}`);
    // Test direct access to the URL to verify it works
    fetch(audioUrl, { method: 'HEAD' })
      .then(response => {
        console.log(`[AudioPlayer] HEAD request status: ${response.status} ${response.statusText}`);
        if (!response.ok) {
          console.error(`[AudioPlayer] Error loading audio file: ${response.status} ${response.statusText}`);
        }
      })
      .catch(err => {
        console.error(`[AudioPlayer] Fetch error:`, err);
      });
  }, [audioUrl]);

  // Initialize analytics tracking
  useAudioAnalytics({
    audioRef,
    title,
    id: episodeId
  });

  // Format time in MM:SS format
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        console.log('[AudioPlayer] Attempting to play audio...');
        audioRef.current.play().catch((err) => {
          console.error('[AudioPlayer] Play error:', err);
          setPlayerState((prev: AudioPlayerState) => ({ ...prev, error: 'Failed to play audio. Please try again.' }));
          if (onError) onError('Failed to play audio. Please try again.');
        });
      }
      setPlayerState((prev: AudioPlayerState) => ({ ...prev, isPlaying: !prev.isPlaying }));
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setPlayerState((prev: AudioPlayerState) => ({ ...prev, volume: newVolume }));
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      const newVolume = volume === 0 ? 1 : 0;
      audioRef.current.volume = newVolume;
      setPlayerState((prev: AudioPlayerState) => ({ ...prev, volume: newVolume }));
    }
  };

  // Toggle volume slider visibility
  const toggleVolumeSlider = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };

  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setPlayerState((prev: AudioPlayerState) => ({ ...prev, currentTime: newTime }));
    }
  };

  // Skip forward 10 seconds
  const skipForward = () => {
    if (audioRef.current) {
      const newTime = Math.min(audioRef.current.currentTime + 10, duration);
      audioRef.current.currentTime = newTime;
      setPlayerState((prev: AudioPlayerState) => ({ ...prev, currentTime: newTime }));
    }
  };

  // Skip backward 10 seconds
  const skipBackward = () => {
    if (audioRef.current) {
      const newTime = Math.max(audioRef.current.currentTime - 10, 0);
      audioRef.current.currentTime = newTime;
      setPlayerState((prev: AudioPlayerState) => ({ ...prev, currentTime: newTime }));
    }
  };

  // Handle playback speed change
  const handleSpeedChange = (newSpeed: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
      setPlayerState((prev: AudioPlayerState) => ({ ...prev, playbackSpeed: newSpeed }));
      localStorage.setItem('audioPlaybackSpeed', newSpeed.toString());
    }
  };

  // Toggle speed controls visibility
  const toggleSpeedControls = () => {
    setShowSpeedControls(!showSpeedControls);
  };

  // Set up event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setPlayerState((prev: AudioPlayerState) => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleLoadedMetadata = () => {
      console.log('[AudioPlayer] Metadata loaded successfully. Duration:', audio.duration);
      setPlayerState((prev: AudioPlayerState) => ({
        ...prev,
        duration: audio.duration,
        loading: false
      }));
      // Apply saved playback rate when audio metadata is loaded
      audio.playbackRate = playerState.playbackSpeed;
    };

    const handleEnded = () => {
      setPlayerState((prev: AudioPlayerState) => ({ ...prev, isPlaying: false }));
      if (onEnded) onEnded();
    };

    const handleError = (e: Event) => {
      console.error('[AudioPlayer] Audio error event:', e);
      const errorElement = e.target as HTMLAudioElement;
      console.error('[AudioPlayer] Audio error code:', errorElement.error?.code);
      console.error('[AudioPlayer] Audio error message:', errorElement.error?.message);
      
      setPlayerState((prev: AudioPlayerState) => ({
        ...prev,
        error: `Error loading audio file: ${errorElement.error?.message || 'Unknown error'}`,
        loading: false
      }));
      if (onError) onError(`Error loading audio file: ${errorElement.error?.message || 'Unknown error'}`);
    };

    const handleRateChange = () => {
      setPlayerState((prev: AudioPlayerState) => ({ ...prev, playbackSpeed: audio.playbackRate }));
      localStorage.setItem('audioPlaybackSpeed', audio.playbackRate.toString());
    };

    // Add event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ratechange', handleRateChange);

    // Clean up
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ratechange', handleRateChange);
    };
  }, [onEnded, onError, playerState.playbackSpeed]);

  // Close volume and speed sliders when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as HTMLElement;
      if (showVolumeSlider && !target.closest('.volume-control')) {
        setShowVolumeSlider(false);
      }
      if (showSpeedControls && !target.closest('.speed-control')) {
        setShowSpeedControls(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showVolumeSlider, showSpeedControls]);

  // Update audio source when audioUrl changes
  useEffect(() => {
    console.log('[AudioPlayer] Audio URL changed:', audioUrl);
    setPlayerState((prev: AudioPlayerState) => ({ ...prev, loading: true, error: null }));
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [audioUrl]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-medium">Audio Error</p>
        <p>{error}</p>
        <p className="mt-2 text-sm">
          Please try again or <a href={audioUrl} className="underline" download>download the audio file</a>.
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Debug URL: {audioUrl}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-3xl mx-auto">
      <audio ref={audioRef} preload="metadata">
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className="mb-2">
        <h3 className="text-lg font-medium truncate">{title}</h3>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="mb-4">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={skipBackward}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Skip backward 10 seconds"
              >
                <SkipBack size={20} />
              </button>

              <button
                onClick={togglePlayPause}
                className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>

              <button
                onClick={skipForward}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Skip forward 10 seconds"
              >
                <SkipForward size={20} />
              </button>
              
              {/* Playback Speed Control */}
              <div className="speed-control relative flex items-center">
                <button
                  onClick={toggleSpeedControls}
                  className="flex items-center px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                  aria-label="Playback Speed"
                >
                  <Clock size={16} />
                  <span className="ml-1 text-xs font-medium">{playbackSpeed}x</span>
                </button>

                {/* Speed control dropdown */}
                <div 
                  className={`absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg p-2 z-20 transition-opacity duration-200 ${
                    showSpeedControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="flex flex-col space-y-1">
                    {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`px-3 py-1 text-sm rounded ${
                          playbackSpeed === speed 
                            ? 'bg-primary text-white' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="volume-control relative flex items-center">
              <button
                onClick={toggleVolumeSlider}
                className="p-2 rounded-full hover:bg-gray-100 z-10"
                aria-label={volume === 0 ? 'Unmute' : 'Mute'}
              >
                {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

              {/* Mobile-friendly volume slider */}
              <div 
                className={`absolute bottom-full right-0 bg-white shadow-lg rounded-lg p-3 mb-2 transition-opacity duration-200 ${
                  showVolumeSlider ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-32 h-6 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    // Improve touch target size
                    WebkitAppearance: 'none',
                    appearance: 'none'
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>{Math.round(volume * 100)}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 