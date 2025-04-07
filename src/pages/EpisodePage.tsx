import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Navigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Download, ChevronLeft, BookOpen, Share2, AlertTriangle, ExternalLink, Clock } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { getEpisodeById, getUrantiaPaperPart, discoverJesusLinks } from '../data/episodes';
import { Episode, SeriesType } from '../types/index';
import { useAudioAnalytics } from '../hooks/useAudioAnalytics';
import { getEpisode as getEpisodeUtils } from '../utils/episodeUtils';
import { getSeriesInfo } from '../utils/seriesUtils';
import { mapLegacyUrl, getPlatformSeriesForPaper } from '../utils/urlUtils';

export default function EpisodePage() {
  // Support both old format (/listen/:series/:id) and new format (/series/:seriesId/:episodeId)
  const { 
    id, 
    series, 
    seriesId, 
    episodeId 
  } = useParams<{ 
    id?: string; 
    series?: string; 
    seriesId?: string; 
    episodeId?: string; 
  }>();
  
  const navigate = useNavigate();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState<boolean>(false);
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(
    () => parseFloat(localStorage.getItem('audioVolume') || '1')
  );
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<boolean>(false);
  const [shareNotification, setShareNotification] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(
    parseFloat(localStorage.getItem('audioPlaybackSpeed') || '1.0')
  );
  const [showSpeedControls, setShowSpeedControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Initialize analytics tracking if episode is loaded
  useAudioAnalytics({
    audioRef,
    title: episode?.title || 'Unknown Episode',
    id: episode?.id?.toString() || id || episodeId || 'unknown'
  });

  // Load episode data
  useEffect(() => {
    // Case 1: New URL format (/series/:seriesId/:episodeId)
    if (seriesId && episodeId) {
      try {
        const episodeData = getEpisodeUtils(seriesId, parseInt(episodeId, 10));
        if (episodeData) {
          setEpisode(episodeData);
          setIsLoading(false);
        } else {
          setError(`Episode not found in ${seriesId} series`);
          setIsLoading(false);
        }
      } catch (err) {
        setError('Failed to load episode');
        setIsLoading(false);
      }
    }
    // Case 2: Old URL format (/listen/:series/:id) - needs redirection to new format
    else if (series && id) {
      try {
        // Validate the ID is a valid number
        const episodeIdNumber = parseInt(id, 10);
        if (isNaN(episodeIdNumber)) {
          setError(`Invalid episode ID: ${id}`);
          setIsLoading(false);
          return;
        }
        
        // Validate the series is recognized - include all valid series IDs
        const validLegacySeries = ['urantia-papers', 'discover-jesus', 'history', 'sadler-workbooks'];
        const validJesusSeries = Array.from({ length: 14 }, (_, i) => `jesus-${i + 1}`);
        const validCosmicSeries = Array.from({ length: 14 }, (_, i) => `cosmic-${i + 1}`);
        const validPlatformSeries = Array.from({ length: 4 }, (_, i) => `series-platform-${i + 1}`);
        
        const allValidSeries = [
          ...validLegacySeries,
          ...validJesusSeries,
          ...validCosmicSeries,
          ...validPlatformSeries
        ];
        
        if (!allValidSeries.includes(series)) {
          setError(`Unknown series: ${series}`);
          setIsLoading(false);
          return;
        }
        
        // First, try to load the episode from the old data source
        const oldEpisodeData = getEpisodeById(parseInt(id), series as string);
        
        if (oldEpisodeData) {
          setEpisode(oldEpisodeData);
          setIsLoading(false);
          
          // Don't redirect if it's the urantia-papers or jesus series to preserve existing links
          if (series === 'urantia-papers' || series.startsWith('jesus-')) {
            // Just keep the current URL
            return;
          }
          
          // Set up redirection to new URL format for other series
          const { seriesId: newSeriesId, episodeId: newEpisodeId } = mapLegacyUrl(
            series as string, 
            id as string
          );
          const newUrl = `/series/${newSeriesId}/${newEpisodeId}`;
          setRedirectUrl(newUrl);
          
          // Allow content to render first, then redirect
          setTimeout(() => {
            setShouldRedirect(true);
          }, 500);
        } else {
          // Get series info to display in error message
          const seriesInfo = getSeriesInfo(series as string);
          const seriesTitle = seriesInfo ? seriesInfo.title : series;
          
          setError(`Episode ${episodeIdNumber} not found in ${seriesTitle} series`);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error loading episode:', err);
        setError('Failed to load episode');
        setIsLoading(false);
      }
    }
    // Case 3: Just episode ID from historical URLs (/episode/:id) - usually Urantia Papers
    else if (id && !series && !seriesId) {
      try {
        // Assume it's a Urantia Paper
        const paperNumber = parseInt(id as string, 10);
        
        // Handle case where the paper number isn't a valid number
        if (isNaN(paperNumber)) {
          setError(`Invalid paper number: ${id}`);
          setIsLoading(false);
          return;
        }
        
        const paperSeriesId = getPlatformSeriesForPaper(paperNumber);
        
        // Calculate episode number within the series
        let seriesEpisodeNumber: number;
        if (paperNumber >= 1 && paperNumber <= 31) {
          seriesEpisodeNumber = paperNumber;
        } else if (paperNumber >= 32 && paperNumber <= 56) {
          seriesEpisodeNumber = paperNumber - 31;
        } else if (paperNumber >= 57 && paperNumber <= 119) {
          seriesEpisodeNumber = paperNumber - 56;
        } else if (paperNumber >= 120 && paperNumber <= 196) {
          seriesEpisodeNumber = paperNumber - 119;
        } else {
          // Handle out of range paper numbers
          setError(`Paper number ${paperNumber} is out of range`);
          setIsLoading(false);
          return;
        }
        
        // Check if a paper with this number exists
        try {
          const oldEpisodeData = getEpisodeById(paperNumber, 'urantia-papers');
          
          if (!oldEpisodeData) {
            setError(`Paper ${paperNumber} not found`);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          // Just continue with redirection anyway
        }
        
        // Set up redirection to new URL format
        const newUrl = `/series/${paperSeriesId}/${seriesEpisodeNumber}`;
        setRedirectUrl(newUrl);
        
        // Allow content to render first, then redirect
        setTimeout(() => {
          setShouldRedirect(true);
        }, 500);
      } catch (err) {
        setError('Failed to load episode');
        setIsLoading(false);
      }
    } else {
      setError('Invalid episode URL');
      setIsLoading(false);
    }
  }, [id, series, seriesId, episodeId]);

  // Perform redirection if needed
  useEffect(() => {
    if (shouldRedirect && redirectUrl) {
      // Navigate programmatically instead of using the Navigate component
      navigate(redirectUrl, { replace: true });
    }
  }, [shouldRedirect, redirectUrl, navigate]);

  // Initialize audio settings when component mounts
  useEffect(() => {
    if (audioRef.current) {
      // Apply saved volume
      try {
        audioRef.current.volume = volume;
      } catch (err) {
        console.error('Error setting initial volume:', err);
      }
      
      // Apply saved playback speed
      try {
        audioRef.current.playbackRate = playbackSpeed;
      } catch (err) {
        console.error('Error setting initial playback speed:', err);
      }
    }
  }, [volume, playbackSpeed, episode]);

  // Audio control functions
  const togglePlayPause = () => {
    if (audioRef.current && !audioError) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          setAudioError(true);
          setError('Failed to play audio. Please try again.');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current && !audioError) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * duration;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      
      if (audioRef.current && !audioError) {
        // Some mobile browsers restrict volume changes
        // We use try-catch to handle potential errors
        audioRef.current.volume = newVolume;
        
        // Explicitly handle mute state
        if (newVolume === 0) {
          setIsMuted(true);
          audioRef.current.muted = true;
        } else if (isMuted) {
          setIsMuted(false);
          audioRef.current.muted = false;
        }

        // Store volume preference (optional)
        try {
          localStorage.setItem('audioVolume', newVolume.toString());
        } catch (storageErr) {
          // Ignore storage errors
        }
      }
    } catch (err) {
      console.error('Error changing volume:', err);
      // Handle gracefully - some browsers restrict volume control
    }
  };

  const toggleMute = () => {
    if (audioRef.current && !audioError) {
      if (isMuted) {
        audioRef.current.volume = volume;
      } else {
        audioRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Get part color based on paper ID
  const getPartColor = (paperId: number, seriesType: string) => {
    // For Urantia Papers series
    if (seriesType === 'urantia-papers') {
      const part = getUrantiaPaperPart(paperId);
      switch (part) {
        case 1: return 'border-blue-500/30 from-blue-500/20';
        case 2: return 'border-green-500/30 from-green-500/20';
        case 3: return 'border-amber-500/30 from-amber-500/20';
        case 4: return 'border-rose-500/30 from-rose-500/20';
        default: return 'border-gray-500/30 from-gray-500/20';
      }
    }
    
    // For Jesus series
    if (seriesType.startsWith('jesus-')) {
      return 'border-rose-500/30 from-rose-500/20'; // Use the same color as Part 4 (Jesus)
    }
    
    // Default fallback
    return 'border-gray-500/30 from-gray-500/20';
  };

  // Navigate to previous or next episode
  const navigateToEpisode = (direction: 'prev' | 'next') => {
    if (!episode || !series) return;
    
    const targetId = direction === 'prev' 
      ? episode.id - 1 
      : episode.id + 1;
    
    // Check if target episode exists
    try {
      const targetEpisode = getEpisodeById(targetId, series as string);
      if (targetEpisode) {
        navigate(`/listen/${series}/${targetId}`);
      }
    } catch (err) {
      console.error('Error navigating to episode:', err);
    }
  };

  // Get previous and next episode info for navigation
  const prevEpisode = (episode && series) ? getEpisodeById(episode.id - 1, series as string) : null;
  const nextEpisode = (episode && series) ? getEpisodeById(episode.id + 1, series as string) : null;

  const handleAudioError = () => {
    setAudioError(true);
    setError('Audio file not found or cannot be played. Please check that the file exists at the specified path.');
  };

  const handlePdfError = () => {
    setPdfError(true);
  };

  const handleShare = async () => {
    if (!episode) return;
    
    const shareUrl = `${window.location.origin}/listen/${series}/${episode.id}`;
    const shareTitle = `Listen to ${episode.title} | Urantia Book Podcast`;
    const shareText = `Check out this episode of the Urantia Book Podcast: ${episode.title}`;
    
    // Try to use the Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fall back to clipboard copy
        copyToClipboard(shareUrl);
        setShareNotification('Link copied to clipboard!');
      }
    } else {
      // Fall back to clipboard copy
      copyToClipboard(shareUrl);
      setShareNotification('Link copied to clipboard!');
    }
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setShareNotification(null);
    }, 3000);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setShareNotification('Link copied to clipboard!');
      })
      .catch(() => {
        setShareNotification('Failed to copy link');
      });
  };
  
  // Add this new function to handle viewing the audio URL
  const handleViewAudioUrl = () => {
    if (episode) {
      alert(`Audio URL: ${episode.audioUrl}`);
      console.log('Audio URL:', episode.audioUrl);
    }
  };

  // Handle playback speed change
  const handleSpeedChange = (speed: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      localStorage.setItem('audioPlaybackSpeed', speed.toString());
      setShowSpeedControls(false);
    }
  };

  // Toggle speed controls visibility
  const toggleSpeedControls = () => {
    setShowSpeedControls(!showSpeedControls);
  };

  // Set playback speed when audio loads
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, episode?.audioUrl]);

  // Close speed controls when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showSpeedControls && !target.closest('.speed-control')) {
        setShowSpeedControls(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSpeedControls]);

  // Get series info for navigation
  const currentSeriesInfo = seriesId ? getSeriesInfo(seriesId) : null;
  
  // Calculate the next and previous episode for new URL format
  const getNextEpisodeUrl = () => {
    if (!episodeId || !seriesId) return '';
    
    const currentEpisodeNumber = parseInt(episodeId, 10);
    const seriesInfo = getSeriesInfo(seriesId);
    
    if (!seriesInfo || currentEpisodeNumber >= seriesInfo.totalEpisodes) {
      return '';
    }
    
    return `/series/${seriesId}/${currentEpisodeNumber + 1}`;
  };
  
  const getPrevEpisodeUrl = () => {
    if (!episodeId || !seriesId) return '';
    
    const currentEpisodeNumber = parseInt(episodeId, 10);
    
    if (currentEpisodeNumber <= 1) {
      return '';
    }
    
    return `/series/${seriesId}/${currentEpisodeNumber - 1}`;
  };
  
  const nextUrl = getNextEpisodeUrl();
  const prevUrl = getPrevEpisodeUrl();

  // Get the appropriate back link based on series type
  const getBackLink = () => {
    if (!series && !seriesId) return '/series';
    
    if (series === 'urantia-papers') {
      return '/urantia-papers';
    } else if (series && series.startsWith('jesus-')) {
      return `/series/${series}`;
    } else if (seriesId && seriesId.startsWith('jesus-')) {
      return `/series/${seriesId}`;
    } else {
      return '/series';
    }
  };
  
  // Get back button text based on series type
  const getBackButtonText = () => {
    if (series === 'urantia-papers') {
      return 'Back to Papers';
    } else if ((series && series.startsWith('jesus-')) || (seriesId && seriesId.startsWith('jesus-'))) {
      return 'Back to Episodes';
    } else {
      return 'Back to Series';
    }
  };

  const decodeAudioUrl = (url: string): string => {
    try {
      // Check if the URL contains encoded characters
      if (url.includes('%')) {
        console.log('[EpisodePage] Decoding URL:', url);
        
        // Try to decode the entire URL
        const decoded = decodeURIComponent(url);
        
        // Check if it's a relative URL
        if (decoded.startsWith('/')) {
          return decoded;
        }
        
        // Check if it's an absolute URL
        if (decoded.startsWith('http')) {
          // For absolute URLs, we need to ensure the domain part is not double-decoded
          const urlParts = new URL(url);
          const origin = urlParts.origin; // This should remain encoded
          const path = decodeURIComponent(urlParts.pathname); // Decode the path
          return `${origin}${path}`;
        }
        
        return decoded;
      }
      return url;
    } catch (error) {
      console.error('[EpisodePage] Error decoding URL:', error);
      return url;
    }
  };

  // Render error state with improved UI
  if (error) {
    return (
      <Layout>
        <main className="min-h-screen bg-navy-dark flex items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-6xl font-bold text-white mb-6">ERROR</h1>
            <p className="text-lg text-white/80 mb-10 max-w-lg">
              {error}
            </p>
            
            <div className="flex gap-4">
              <Link
                to={series && typeof series === 'string' ? `/series/${series}` : '/series'}
                className="px-6 py-3 bg-gold text-navy-dark rounded-full hover:bg-gold-light transition-all duration-300 font-bold"
              >
                <ChevronLeft className="inline mr-2 h-5 w-5" />
                Back to Series
              </Link>
              
              <Link
                to="/"
                className="px-6 py-3 bg-navy-light/50 text-white rounded-full hover:bg-navy-light/70 transition-all duration-300 font-bold"
              >
                Home
              </Link>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!episode) {
    return null;
  }

  return (
    <Layout>
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <button 
          onClick={() => navigate(getBackLink())}
          className="flex items-center text-white/70 hover:text-white mb-6"
        >
          <ChevronLeft size={20} className="mr-1" />
          <span>
            {getBackButtonText()}
          </span>
        </button>
        
        {/* Episode Header */}
        <motion.div 
          className={`rounded-xl p-8 mb-8 bg-gradient-to-r ${getPartColor(episode.id, episode.series)} to-transparent border border-white/10`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center">
                <span className="text-primary text-2xl font-bold mr-3">{episode.id}</span>
                <h1 className="title-main text-2xl md:text-4xl lg:text-5xl">{episode.title}</h1>
              </div>
              
              {/* Add logline here */}
              {episode.cardSummary && (
                <p className="mt-4 text-lg text-white/80 italic leading-relaxed max-w-3xl">
                  {episode.cardSummary}
                </p>
              )}
              
              {/* Only show description if it's not just repeating the title */}
              {episode.description && !episode.description.includes(episode.title) && (
                <p className="body-lg mt-2 max-w-3xl">{episode.description}</p>
              )}
              
              {episode.summary && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <h3 className="text-lg font-semibold text-primary mb-2">Summary</h3>
                  <p className="text-white/90 leading-relaxed">{episode.summary}</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              {episode.pdfUrl && (
                <a
                  href={episode.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-navy-light/70 text-white/90 rounded-md hover:bg-navy transition-colors"
                >
                  <BookOpen size={18} />
                  <span>Read PDF</span>
                </a>
              )}
              
              <a
                href={episode.audioUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-navy-light/70 text-white/90 rounded-md hover:bg-navy transition-colors"
              >
                <Download size={18} />
                <span>Download Audio</span>
              </a>
              
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-navy-light/70 text-white/90 rounded-md hover:bg-navy transition-colors"
              >
                <Share2 size={18} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Share Notification */}
        {shareNotification && (
          <motion.div 
            className="fixed bottom-4 right-4 bg-navy-light text-white px-4 py-3 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {shareNotification}
          </motion.div>
        )}
        
        {/* Audio Player */}
        <div className="bg-navy-light/30 rounded-xl border border-white/10 p-6 mb-8">
          {audioError ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle size={48} className="text-amber-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Audio Unavailable</h3>
              <p className="text-white/70 max-w-lg mb-4">
                Audio file could not be loaded. Please check that the file exists at the specified path.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => navigate('/urantia-papers')}
                  className="bg-navy-light text-white px-4 py-2 rounded-md hover:bg-navy transition-colors"
                >
                  Back to Papers
                </button>
                <button
                  onClick={handleViewAudioUrl}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
                >
                  View Audio URL
                </button>
              </div>
            </div>
          ) : (
            <>
              <audio
                ref={audioRef}
                src={decodeAudioUrl(episode.audioUrl)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                onError={handleAudioError}
              />
              
              {/* Progress Bar */}
              <div 
                ref={progressBarRef}
                className="h-2 bg-navy-light rounded-full mb-4 cursor-pointer"
                onClick={handleProgressBarClick}
              >
                <div 
                  className="h-full bg-primary rounded-full relative"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              
              {/* Time Display */}
              <div className="flex justify-between text-white/50 text-sm mb-4">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              
              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => navigateToEpisode('prev')}
                    className="text-white/70 hover:text-white disabled:opacity-50"
                    disabled={episode.id <= 1}
                  >
                    <SkipBack size={24} />
                  </button>
                  
                  <button 
                    onClick={togglePlayPause}
                    className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-dark transition-colors"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                  </button>
                  
                  <button 
                    onClick={() => navigateToEpisode('next')}
                    className="text-white/70 hover:text-white disabled:opacity-50"
                    disabled={episode.id >= 196}
                  >
                    <SkipForward size={24} />
                  </button>
                  
                  {/* Playback Speed Control */}
                  <div className="speed-control relative">
                    <button
                      onClick={toggleSpeedControls}
                      className="px-2 py-1 bg-navy-light/50 text-white/70 hover:text-white rounded flex items-center"
                      aria-label="Playback Speed"
                    >
                      <Clock size={16} className="mr-1" />
                      <span className="text-xs">{playbackSpeed}x</span>
                    </button>
                    
                    {/* Speed control dropdown */}
                    {showSpeedControls && (
                      <div className="absolute top-full left-0 mt-1 bg-navy-dark border border-white/10 rounded p-2 z-30">
                        <div className="flex flex-col space-y-1">
                          {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((speed) => (
                            <button
                              key={speed}
                              onClick={() => handleSpeedChange(speed)}
                              className={`px-3 py-1 text-sm rounded text-left ${
                                playbackSpeed === speed 
                                  ? 'bg-primary text-white' 
                                  : 'text-white/70 hover:bg-navy-light hover:text-white'
                              }`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <button 
                    onClick={toggleMute}
                    className="text-white/70 hover:text-white p-2"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full sm:w-24 h-7 accent-primary appearance-none bg-navy-light/70 rounded-full cursor-pointer"
                    style={{
                      WebkitAppearance: 'none',
                      appearance: 'none',
                      background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${isMuted ? 0 : volume * 100}%, #374151 ${isMuted ? 0 : volume * 100}%, #374151 100%)`
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </Layout>
  );
}