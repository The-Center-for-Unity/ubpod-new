import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Navigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Download, ChevronLeft, BookOpen, Share2, AlertTriangle, ExternalLink, Clock, ChevronDown, ChevronUp, ChevronRight, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../i18n/LanguageContext';
import Layout from '../components/layout/Layout';
import { getEpisode as getEpisodeUtils, getUrantiaPaperPart, getEpisodeById } from '../utils/episodeUtils';
import { Episode, SeriesType } from '../types/index';
import { useAudioAnalytics } from '../hooks/useAudioAnalytics';
import { getSeriesInfo } from '../utils/seriesUtils';
import { mapLegacyUrl, getPlatformSeriesForPaper } from '../utils/urlUtils';
import { getAvailableSeriesIds } from '../utils/seriesAvailabilityUtils';
import { fadeInVariants } from '../constants/animations';
import SocialShareMenu from '../components/ui/SocialShareMenu';
import { getLocalizedPath } from '../utils/i18nRouteUtils';
import MetaTags from '../components/layout/MetaTags';
import { LocalizedLink } from '../components/shared/LocalizedLink';

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
  
  // IMMEDIATE DEBUG - this will execute as soon as the component renders
  console.log(`[IMMEDIATE DEBUG] useParams result:`, { id, series, seriesId, episodeId });
  console.log(`[IMMEDIATE DEBUG] URL:`, window.location.href);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('episode');
  const { language, isInitialized } = useLanguage();
  
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
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  // Initialize analytics tracking if episode is loaded
  useAudioAnalytics({
    audioRef,
    title: episode?.title || 'Unknown Episode',
    id: episode?.id?.toString() || id || episodeId || 'unknown'
  });

  // Force audio reload when language or audioUrl changes
  useEffect(() => {
    if (audioRef.current && episode?.audioUrl) {
      console.log(`[AUDIO RELOAD] Forcing audio reload for language: ${language}, URL: ${episode.audioUrl}`);
      
      // Stop current playback
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
      setAudioError(false);
      
      // Force reload with new source
      audioRef.current.src = decodeAudioUrl(episode.audioUrl);
      audioRef.current.load(); // This forces a complete reload
      
      console.log(`[AUDIO RELOAD] Audio element reloaded with new source`);
    }
  }, [language, episode?.audioUrl]); // Reload whenever language OR audioUrl changes

  // Load episode data
  useEffect(() => {
    // Wait for language context to be initialized to prevent race conditions
    if (!isInitialized) {
      return;
    }

    // Case 1: New URL format (/series/:seriesId/:episodeId)
    if (seriesId && episodeId) {
      try {
        // Check if the series is available in the current language
        const availableSeriesIds = getAvailableSeriesIds(language);
        const isSeriesAvailable = availableSeriesIds.includes(seriesId);
        
        if (!isSeriesAvailable) {
          console.log(`[SERIES AVAILABILITY] Series ${seriesId} not available in ${language}. Available series:`, availableSeriesIds);
          // Redirect to series page with unavailable notice
          const localizedPath = getLocalizedPath(`/series?unavailable=${seriesId}`, language);
          navigate(localizedPath, { replace: true });
          return;
        }

        // Use language from the language context
        console.log(`[CRITICAL DEBUG] URL PARAMS: seriesId=${seriesId}, episodeId=${episodeId}, parsed=${parseInt(episodeId, 10)}`);
        let episodeData = getEpisodeUtils(seriesId, parseInt(episodeId, 10), language);
        
        // Debug transcript URL - use console.log that will show in browser
        console.log("DEBUG - URL parsing:", {
          seriesId,
          episodeId,
          episodeIdType: typeof episodeId,
          parsedEpisodeId: parseInt(episodeId, 10),
          urlParams: { seriesId, episodeId },
          actualURL: window.location.href,
          pathname: window.location.pathname
        });
        
        console.log("DEBUG - Episode data:", { 
          id: episodeData?.id,
          title: episodeData?.title,
          language,
          episodeIdParam: episodeId,
          episodeIdType: typeof episodeId,
          parsedEpisodeId: parseInt(episodeId, 10),
          parsedEpisodeIdType: typeof parseInt(episodeId, 10),
          transcriptUrl: episodeData?.transcriptUrl,
          hasTranscript: !!(episodeData?.transcriptUrl && episodeData?.transcriptUrl.trim() !== ''),
          translations: episodeData?.translations,
          audioUrl: episodeData?.audioUrl,
          hasSpanishTranslation: episodeData?.translations?.es ? true : false,
          spanishTitle: episodeData?.translations?.es?.title
        });
        
        // Note: Cosmic series now automatically load rich content from summaryKey in episodeUtils.ts
        // No special handling needed here - the translation system handles it
        
        if (episodeData) {
          setEpisode(episodeData);
          setIsLoading(false);
          setError(null); // Clear any previous errors
          
          // Audio will be reloaded by the useEffect above when episode.audioUrl changes
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
        const validLegacySeries = ['urantia-papers', 'discover-jesus', 'sadler-workbooks'];
        const validJesusSeries = Array.from({ length: 14 }, (_, i) => `jesus-${i + 1}`);
        const validCosmicSeries = Array.from({ length: 14 }, (_, i) => `cosmic-${i + 1}`);
        
        const allValidSeries = [
          ...validLegacySeries,
          ...validJesusSeries,
          ...validCosmicSeries
        ];
        
        if (!allValidSeries.includes(series)) {
          setError(`Unknown series: ${series}`);
          setIsLoading(false);
          return;
        }
        
        // Check if the series is available in the current language (for new series formats)
        if (series.startsWith('jesus-') || series.startsWith('cosmic-')) {
          const availableSeriesIds = getAvailableSeriesIds(language);
          const isSeriesAvailable = availableSeriesIds.includes(series);
          
          if (!isSeriesAvailable) {
            console.log(`[SERIES AVAILABILITY] Legacy series ${series} not available in ${language}. Available series:`, availableSeriesIds);
            // Redirect to series page with unavailable notice
            const localizedPath = getLocalizedPath(`/series?unavailable=${series}`, language);
            navigate(localizedPath, { replace: true });
            return;
          }
        }
        
        // First, try to load the episode from the old data source with language support
        const oldEpisodeData = getEpisodeById(parseInt(id, 10), series as string, language);
        
        if (oldEpisodeData) {
          setEpisode(oldEpisodeData);
          setIsLoading(false);
          setError(null); // Clear any previous errors
          
          // Audio will be reloaded by the useEffect above when episode.audioUrl changes
          
          // Don't redirect if it's the urantia-papers, jesus-series, or cosmic-series to preserve those links
          if (series === 'urantia-papers' || series.startsWith('jesus-') || series.startsWith('cosmic-')) {
            // Just keep the current URL
            return;
          }
          
          // Set up redirection to new URL format for other series
          const newUrl = `/series/${series}/${id}`;
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
  }, [isInitialized, language, seriesId, episodeId, series, id]);

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

  // Add cleanup effect to stop audio when component unmounts
  useEffect(() => {
    return () => {
      // Clean up audio when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    };
  }, []);

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

  const skipForward = () => {
    if (audioRef.current && !audioError) {
      const newTime = Math.min(audioRef.current.currentTime + 10, duration);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipBackward = () => {
    if (audioRef.current && !audioError) {
      const newTime = Math.max(audioRef.current.currentTime - 10, 0);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
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
    if (!episode) return;

    // Stop audio playback when navigating
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
    
    // Handle navigation based on URL format
    if (seriesId && episodeId) {
      // New URL format (/series/:seriesId/:episodeId)
      const currentEpisodeNumber = parseInt(episodeId, 10);
      const totalEpisodes = getSeriesInfo(seriesId)?.totalEpisodes || 0;
      
      let nextEpisodeId;
      if (direction === 'next') {
        nextEpisodeId = currentEpisodeNumber < totalEpisodes ? currentEpisodeNumber + 1 : null;
      } else {
        nextEpisodeId = currentEpisodeNumber > 1 ? currentEpisodeNumber - 1 : null;
      }
      
      if (nextEpisodeId) {
        const newUrl = `/series/${seriesId}/${nextEpisodeId}`;
        navigate(getLocalizedPath(newUrl, language));
      }
    } 
    else if (series && episode) {
      // Old URL format (/listen/:series/:id)
      const targetId = direction === 'prev' 
        ? episode.id - 1 
        : episode.id + 1;
      
      // Check if target episode exists
      try {
        const targetEpisode = getEpisodeById(targetId, series as string);
        if (targetEpisode) {
          const targetUrl = `/listen/${series}/${targetId}`;
          
          // Force a hard navigation by not using React Router
          window.location.href = targetUrl;
        }
      } catch (err) {
        console.error('Error navigating to episode:', err);
      }
    }
  };

  // Get previous and next episode info for navigation
  const prevEpisode = (episode && series) ? getEpisodeById(episode.id - 1, series as string) : null;
  const nextEpisode = (episode && series) ? getEpisodeById(episode.id + 1, series as string) : null;

  const handleAudioError = () => {
    setAudioError(true);
    
    // Display a more specific message for cosmic series since they're not available yet
    if (episode?.series?.startsWith('cosmic-')) {
      setError('The audio for this cosmic series episode is not available yet. We are currently working on generating these files.');
    } else {
      setError('Failed to load audio file. Please try again later.');
    }
  };

  const handlePdfError = () => {
    setPdfError(true);
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
    // Handle both new format (/series/:seriesId/:episodeId) and old format (/listen/:series/:id)
    const currentSeriesId = seriesId || series;
    const currentEpisodeId = episodeId || id;
    
    if (!currentEpisodeId || !currentSeriesId) return '';
    
    const currentEpisodeNumber = parseInt(currentEpisodeId, 10);
    const seriesInfo = getSeriesInfo(currentSeriesId);
    const isUrantiaPapers = currentSeriesId === 'urantia-papers';

    let totalEpisodes = seriesInfo?.totalEpisodes;
    if (isUrantiaPapers && !totalEpisodes) {
        totalEpisodes = 197; // Papers 0-196
    }

    if (!totalEpisodes) return '';

    if (isUrantiaPapers) {
        // 0-indexed
        if (currentEpisodeNumber >= totalEpisodes - 1) return '';
    } else {
        // 1-indexed
        if (currentEpisodeNumber >= totalEpisodes) return '';
    }
    
    return `/series/${currentSeriesId}/${currentEpisodeNumber + 1}`;
  };
  
  const getPrevEpisodeUrl = () => {
    // Handle both new format (/series/:seriesId/:episodeId) and old format (/listen/:series/:id)
    const currentSeriesId = seriesId || series;
    const currentEpisodeId = episodeId || id;
    
    if (!currentEpisodeId || !currentSeriesId) return '';
    
    const currentEpisodeNumber = parseInt(currentEpisodeId, 10);
    const isUrantiaPapers = currentSeriesId === 'urantia-papers';
    
    if (isUrantiaPapers) {
      if (currentEpisodeNumber <= 0) return '';
    } else {
      if (currentEpisodeNumber <= 1) return '';
    }
    
    return `/series/${currentSeriesId}/${currentEpisodeNumber - 1}`;
  };
  
  const nextUrl = getNextEpisodeUrl();
  const prevUrl = getPrevEpisodeUrl();

  // Get the appropriate back link based on series type
  const getBackLink = () => {
    const seriesType = seriesId || series;
    if (!seriesType) return '/series';

    if (seriesType === 'urantia-papers') {
      return '/urantia-papers';
    } else if (seriesType.startsWith('jesus-') || seriesType.startsWith('cosmic-')) {
      return `/series/${seriesType}`;
    } else {
      return '/series';
    }
  };
  
  // Get back button text based on series type
  const getBackButtonText = () => {
    const seriesType = seriesId || series;
    if (seriesType === 'urantia-papers') {
      return t('navigation.back_to_papers');
    }
    return t('navigation.back_to_series');
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

  // Toggle summary expansion
  const toggleSummary = () => {
    setSummaryExpanded(!summaryExpanded);
  };

  const handleCopy = (textToCopy: string, type: 'link' | 'embed' = 'link') => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setShareNotification(type === 'link' ? t('share.linkCopied') : t('share.embedCopied'));
    });
  };

  // Show error if any
  if (error && !episode) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <p className="font-medium">Error</p>
            <p>{error}</p>
            <LocalizedLink to="/" className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded-lg">
              {t('actions.return_home', { ns: 'common' })}
            </LocalizedLink>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="sr-only">{t('loading')}</span>
        </div>
      </Layout>
    );
  }

  if (!episode) {
    return null;
  }

  return (
    <Layout>
      <MetaTags 
        title={t('meta.title', { title: episode.translations && episode.translations[language] 
          ? episode.translations[language].title || episode.title
          : episode.title })}
        description={t('meta.description', { description: episode.summary || episode.description || '' })}
        url={window.location.href}
        imageUrl={episode.imageUrl || "https://www.urantiabookpod.com/og-image.png"}
      />
      <motion.div 
        className="max-w-6xl mx-auto px-4 py-8"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        <div className="mb-6">
          <LocalizedLink 
            to={getBackLink()}
            className="flex items-center text-white/70 hover:text-white mb-6"
          >
            <ChevronLeft size={20} className="mr-1" />
            <span>
              {getBackButtonText()}
            </span>
          </LocalizedLink>
        </div>
        
        {/* Main Content Block */}
        <motion.div 
          className={`rounded-xl p-6 md:p-8 mb-8 bg-gradient-to-r ${getPartColor(episode.id, episode.series)} to-transparent border border-white/10`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            {/* Left Side: Title and Description */}
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <span className="text-primary text-4xl font-bold mr-4">{episode.id}</span>
                <h1 className="title-main text-xl md:text-2xl lg:text-3xl">
                  {episode.translations && episode.translations[language] 
                    ? episode.translations[language].title || episode.title
                    : episode.title}
                </h1>
              </div>
              {episode.description && (
                <p className="body-lg mt-4 italic text-white/80">{episode.description}</p>
              )}
            </div>

            {/* Right Side: Action Buttons */}
            <div className="flex-shrink-0 mt-4 md:mt-0 md:ml-6">
              <div className="flex flex-col space-y-3">
                {/* DiscoverJesus button for Jesus episodes */}
                {episode.series?.startsWith('jesus-') && episode.sourceUrl && (
                  <a
                    href={episode.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gold/80 text-navy rounded-md hover:bg-gold transition-colors"
                  >
                    <ExternalLink size={18} />
                    <span>{t('external.read_on_dj')}</span>
                  </a>
                )}
                
                {/* PDF button - only for non-Jesus episodes */}
                {!episode.series?.startsWith('jesus-') && episode.pdfUrl && (
                  <a
                    href={episode.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center gap-2 px-4 py-2 bg-navy-light/70 text-white/90 rounded-md hover:bg-navy-light/80 transition-colors"
                  >
                    <BookOpen size={18} />
                    <span>{t('player.read_pdf')}</span>
                  </a>
                )}
                
                {/* Transcript button - only for non-Jesus episodes */}
                {!episode.series?.startsWith('jesus-') && episode.transcriptUrl && (
                  <a
                    href={episode.transcriptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center gap-2 px-4 py-3 bg-navy-light/50 text-white/90 rounded-md transition-colors hover:bg-navy-light/80"
                    role="button"
                  >
                    <FileText size={18} />
                    <span>{t('player.downloadTranscript')}</span>
                  </a>
                )}
                
                {/* Download Audio - always available */}
                {episode.audioUrl && (
                  <a
                    href={episode.audioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center gap-2 px-4 py-3 bg-navy-light/50 text-white/90 rounded-md transition-colors hover:bg-navy-light/80"
                  >
                    <Download size={18} />
                    <span>{t('player.download')}</span>
                  </a>
                )}
                
                {/* Share - always available */}
                <SocialShareMenu 
                  url={window.location.href}
                  title={`Listen to ${episode.translations && episode.translations[language] 
                    ? episode.translations[language].title || episode.title
                    : episode.title} | Urantia Book Podcast`}
                  description={`Check out this episode of the Urantia Book Podcast: ${episode.translations && episode.translations[language] 
                    ? episode.translations[language].title || episode.title
                    : episode.title}`}
                />
              </div>
            </div>
          </div>

          {/* Summary Box (inside main content block) */}
          {episode.summary && (
            <div className="mt-6 p-4 bg-black/20 rounded-lg border border-white/10">
              <div className="flex justify-between items-center cursor-pointer" onClick={toggleSummary}>
                <h3 className="text-lg font-semibold text-primary">{t('summary.title')}</h3>
                <button className="text-white/70 hover:text-white flex items-center gap-1 text-sm" aria-label={summaryExpanded ? t('summary.read_less') : t('summary.read_more')}>
                  {summaryExpanded ? (
                    <><span>{t('summary.read_less')}</span><ChevronUp size={16} /></>
                  ) : (
                    <><span>{t('summary.read_more')}</span><ChevronDown size={16} /></>
                  )}
                </button>
              </div>
              <AnimatePresence initial={false}>
                {summaryExpanded ? (
                  <motion.div key="full-summary" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1, marginTop: '1rem' }} exit={{ height: 0, opacity: 0, marginTop: 0 }} transition={{ duration: 0.3 }}>
                    <p className="text-white/90 leading-relaxed">{episode.summary}</p>
                  </motion.div>
                ) : (
                  <motion.div key="summary-preview" initial={false} animate={{ height: "auto", opacity: 1, marginTop: '1rem' }} exit={{ height: 0, opacity: 0, marginTop: 0 }} transition={{ duration: 0.3 }}>
                    <p className="text-white/90 leading-relaxed line-clamp-3">{episode.summary}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
        
        {/* Audio Player (outside main content block) */}
        <div className="bg-navy-light/30 rounded-xl border border-white/10 p-6 mb-8">
          {audioError ? (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-orange-800 mb-6">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{t('errors.audio_not_available')}</p>
                  <p>{error}</p>
                  {episode?.series?.startsWith('cosmic-') && (
                    <p className="mt-2 text-sm">
                      {t('errors.cosmic_unavailable')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                onError={handleAudioError}
                className="hidden"
              >
                <source src={decodeAudioUrl(episode.audioUrl)} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              
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
                    onClick={skipBackward}
                    className="flex items-center justify-center w-10 h-10 bg-navy-light hover:bg-navy text-white/90 hover:text-white rounded-lg transition"
                    aria-label={t('player.skipBackward')}
                  >
                    <SkipBack size={20} />
                  </button>
                  
                  <button 
                    onClick={togglePlayPause}
                    className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-dark transition-colors"
                    aria-label={isPlaying ? t('player.pause') : t('player.play')}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                  </button>
                  
                  <button 
                    onClick={skipForward}
                    className="flex items-center justify-center w-10 h-10 bg-navy-light hover:bg-navy text-white/90 hover:text-white rounded-lg transition"
                    aria-label={t('player.skipForward')}
                  >
                    <SkipForward size={20} />
                  </button>
                  
                  {/* Playback Speed Control */}
                  <div className="speed-control relative">
                    <button
                      onClick={toggleSpeedControls}
                      className="px-2 py-1 bg-navy-light/50 text-white/70 hover:text-white rounded flex items-center"
                      aria-label={t('player.speed')}
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
                    aria-label={isMuted ? t('player.unmute') : t('player.mute')}
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
        

        
        {/* Episode Navigation */}
        <div className="flex justify-between items-center mb-12">
          {prevUrl ? (
            <LocalizedLink
              to={prevUrl}
              className="flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition bg-navy-light hover:bg-navy text-white/90 hover:text-white"
            >
              <ChevronLeft size={20} />
              <span>{t('navigation.previous_episode')}</span>
            </LocalizedLink>
          ) : (
            <span className="flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition bg-navy-light/30 text-white/30 cursor-not-allowed">
              <ChevronLeft size={20} />
              <span>{t('navigation.previous_episode')}</span>
            </span>
          )}
          
          {nextUrl ? (
            <LocalizedLink
              to={nextUrl}
              className="flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition bg-navy-light hover:bg-navy text-white/90 hover:text-white"
            >
              <span>{t('navigation.next_episode')}</span>
              <ChevronRight size={20} />
            </LocalizedLink>
          ) : (
            <span className="flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition bg-navy-light/30 text-white/30 cursor-not-allowed">
              <span>{t('navigation.next_episode')}</span>
              <ChevronRight size={20} />
            </span>
          )}
        </div>
      </motion.div>
    </Layout>
  );
}