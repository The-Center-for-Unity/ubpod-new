import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Navigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Download, ChevronLeft, BookOpen, Share2, AlertTriangle, ExternalLink, Clock, ChevronDown, ChevronUp, ChevronRight, FileText } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { getEpisodeById, getUrantiaPaperPart, discoverJesusLinks } from '../data/episodes';
import { Episode, SeriesType } from '../types/index';
import { useAudioAnalytics } from '../hooks/useAudioAnalytics';
import { getEpisode as getEpisodeUtils } from '../utils/episodeUtils';
import { getSeriesInfo } from '../utils/seriesUtils';
import { mapLegacyUrl, getPlatformSeriesForPaper } from '../utils/urlUtils';
import { formatTitleWithoutNumber } from '../utils/formatTitle';
import { fadeIn } from '../constants/animations';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import SocialShareMenu from '../components/ui/SocialShareMenu';
import MetaTags from '../components/layout/MetaTags';

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
  
  const location = useLocation();
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
  const [summaryExpanded, setSummaryExpanded] = useState(false);

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
        let episodeData = getEpisodeUtils(seriesId, parseInt(episodeId, 10));
        
        // Debug transcript URL - use console.log that will show in browser
        console.log("DEBUG - Episode data:", { 
          id: episodeData?.id,
          title: episodeData?.title,
          episodeIdParam: episodeId,
          episodeIdType: typeof episodeId,
          parsedEpisodeId: parseInt(episodeId, 10),
          parsedEpisodeIdType: typeof parseInt(episodeId, 10),
          transcriptUrl: episodeData?.transcriptUrl,
          hasTranscript: !!(episodeData?.transcriptUrl && episodeData?.transcriptUrl.trim() !== '')
        });
        
        // Special handling for cosmic series - make them mirror the Urantia Papers exactly
        if (seriesId.startsWith('cosmic-')) {
          // Extract series number and episode number
          const seriesNum = parseInt(seriesId.split('-')[1], 10);
          const episodeNum = parseInt(episodeId, 10);
          
          // Map to the corresponding paper number
          let mappedPaperNumber: number | null = null;
          
          // Use the same mapping as in episodeUtils.ts
          switch(seriesId) {
            case 'cosmic-1':
              const paper1Mapping = [1, 12, 13, 15, 42];
              mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper1Mapping[episodeNum - 1] : null;
              break;
            case 'cosmic-2':
              const paper2Mapping = [6, 8, 10, 20, 16];
              mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper2Mapping[episodeNum - 1] : null;
              break;
            case 'cosmic-3':
              const paper3Mapping = [107, 108, 110, 111, 112];
              mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper3Mapping[episodeNum - 1] : null;
              break;
            case 'cosmic-4':
              const paper4Mapping = [32, 33, 34, 35, 41];
              mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper4Mapping[episodeNum - 1] : null;
              break;
            case 'cosmic-5':
              const paper5Mapping = [38, 39, 113, 114, 77];
              mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper5Mapping[episodeNum - 1] : null;
              break;
            case 'cosmic-6':
              const paper6Mapping = [40, 47, 48, 31, 56];
              mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper6Mapping[episodeNum - 1] : null;
              break;
            case 'cosmic-7':
              const paper7Mapping = [57, 58, 62, 64, 66];
              mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper7Mapping[episodeNum - 1] : null;
              break;
            case 'cosmic-8':
              const paper8Mapping = [53, 54, 67, 75, 66];
              mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper8Mapping[episodeNum - 1] : null;
              break;
            case 'cosmic-9':
              const paper9Mapping = [73, 74, 76, 78, 75];
              mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper9Mapping[episodeNum - 1] : null;
              break;
            case 'cosmic-10':
              const paper10Mapping = [93, 94, 95, 96, 98];
              mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper10Mapping[episodeNum - 1] : null;
              break;
            case 'cosmic-11':
              const paper11Mapping = [85, 86, 87, 89, 92];
              mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper11Mapping[episodeNum - 1] : null;
              break;
            case 'cosmic-12':
              const paper12Mapping = [100, 101, 102, 103, 196];
              mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper12Mapping[episodeNum - 1] : null;
              break;
            case 'cosmic-13':
              const paper13Mapping = [0, 105, 115, 116, 117];
              mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper13Mapping[episodeNum - 1] : null;
              break;
            case 'cosmic-14':
              const paper14Mapping = [4, 5, 7, 9, 10];
              mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper14Mapping[episodeNum - 1] : null;
              break;
          }
          
          if (mappedPaperNumber !== null) {
            // Get the corresponding Urantia paper
            // Handle the foreword as a special case
            if (mappedPaperNumber === 0) {
              // For foreword (paper 0), we need to handle it specially
              try {
                // Try to get the foreword episode by ID 0
                const forewordEpisode = getEpisodeUtils('urantia-papers', 0);
                if (forewordEpisode) {
                  const originalUrl = episodeData?.audioUrl;
                  episodeData = {
                    ...forewordEpisode,
                    series: seriesId as SeriesType,
                    id: episodeNum,
                    audioUrl: originalUrl || forewordEpisode.audioUrl
                  };
                }
              } catch (error) {
                console.error("Error loading foreword:", error);
              }
            } else {
              // For regular papers, use the paper number directly
              const urantiaEpisode = getEpisodeUtils('urantia-papers', mappedPaperNumber);
              
              if (urantiaEpisode) {
                // Override the episode data with the Urantia paper data, but keep the original URL
                const originalUrl = episodeData?.audioUrl;
                episodeData = {
                  ...urantiaEpisode,
                  series: seriesId as SeriesType,
                  // Keep the original series ID for navigation purposes
                  id: episodeNum,
                  // Keep the cosmic URL pattern for consistency with nav links
                  audioUrl: originalUrl || urantiaEpisode.audioUrl
                };
              }
            }
          }
        }
        
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
          
          // Don't redirect if it's the urantia-papers, jesus-series, or cosmic-series to preserve those links
          if (series === 'urantia-papers' || series.startsWith('jesus-') || series.startsWith('cosmic-')) {
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
      const targetEpisodeNumber = direction === 'prev' 
        ? currentEpisodeNumber - 1 
        : currentEpisodeNumber + 1;
      
      const seriesInfo = getSeriesInfo(seriesId);
      
      // Validate episode number is in range
      if (direction === 'prev' && targetEpisodeNumber < 1) return;
      if (direction === 'next' && seriesInfo && targetEpisodeNumber > seriesInfo.totalEpisodes) return;
      
      // Navigate to the new episode
      const targetUrl = `/series/${seriesId}/${targetEpisodeNumber}`;
      
      // Force a hard navigation by not using React Router
      window.location.href = targetUrl;
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
    } else if (series && series.startsWith('cosmic-')) {
      return `/series/${series}`;
    } else if (seriesId && seriesId.startsWith('cosmic-')) {
      return `/series/${seriesId}`;
    } else {
      return '/series';
    }
  };
  
  // Get back button text based on series type
  const getBackButtonText = () => {
    if (series === 'urantia-papers') {
      return 'Back to Papers';
    } else if ((series && series.startsWith('jesus-')) || (seriesId && seriesId.startsWith('jesus-')) ||
              (series && series.startsWith('cosmic-')) || (seriesId && seriesId.startsWith('cosmic-'))) {
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

  // Toggle summary expansion
  const toggleSummary = () => {
    setSummaryExpanded(!summaryExpanded);
  };

  // Near the top of the component, add a function to format the title:
  const formatTitle = (title: string, seriesId: string | undefined, episodeId: string | number | undefined) => {
    // For cosmic series, ensure we show the "PAPER X:" prefix if it's not already there
    if (seriesId?.startsWith('cosmic-')) {
      // Extract the mapped paper number
      const seriesNum = parseInt(seriesId.split('-')[1], 10);
      const episodeNum = parseInt(String(episodeId), 10);
      let mappedPaperNumber: number | null = null;
      
      // Same mapping logic as above
      switch(seriesId) {
        case 'cosmic-1':
          const paper1Mapping = [1, 12, 13, 15, 42];
          mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper1Mapping[episodeNum - 1] : null;
          break;
        case 'cosmic-2':
          const paper2Mapping = [6, 8, 10, 20, 16];
          mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper2Mapping[episodeNum - 1] : null;
          break;
        case 'cosmic-3':
          const paper3Mapping = [107, 108, 110, 111, 112];
          mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper3Mapping[episodeNum - 1] : null;
          break;
        case 'cosmic-4':
          const paper4Mapping = [32, 33, 34, 35, 41];
          mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper4Mapping[episodeNum - 1] : null;
          break;
        case 'cosmic-5':
          const paper5Mapping = [38, 39, 113, 114, 77];
          mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper5Mapping[episodeNum - 1] : null;
          break;
        case 'cosmic-6':
          const paper6Mapping = [40, 47, 48, 31, 56];
          mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper6Mapping[episodeNum - 1] : null;
          break;
        case 'cosmic-7':
          const paper7Mapping = [57, 58, 62, 64, 66];
          mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper7Mapping[episodeNum - 1] : null;
          break;
        case 'cosmic-8':
          const paper8Mapping = [53, 54, 67, 75, 66];
          mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper8Mapping[episodeNum - 1] : null;
          break;
        case 'cosmic-9':
          const paper9Mapping = [73, 74, 76, 78, 75];
          mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper9Mapping[episodeNum - 1] : null;
          break;
        case 'cosmic-10':
          const paper10Mapping = [93, 94, 95, 96, 98];
          mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper10Mapping[episodeNum - 1] : null;
          break;
        case 'cosmic-11':
          const paper11Mapping = [85, 86, 87, 89, 92];
          mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper11Mapping[episodeNum - 1] : null;
          break;
        case 'cosmic-12':
          const paper12Mapping = [100, 101, 102, 103, 196];
          mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper12Mapping[episodeNum - 1] : null;
          break;
        case 'cosmic-13':
          const paper13Mapping = [0, 105, 115, 116, 117];
          mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper13Mapping[episodeNum - 1] : null;
          break;
        case 'cosmic-14':
          const paper14Mapping = [4, 5, 7, 9, 10];
          mappedPaperNumber = episodeNum && episodeNum <= 5 ? paper14Mapping[episodeNum - 1] : null;
          break;
      }
      
      if (mappedPaperNumber) {
        // Special case for foreword
        if (mappedPaperNumber === 0) {
          return "FOREWORD";
        }
        
        // Check if title already has "PAPER X:" prefix
        if (!title.toUpperCase().includes('PAPER')) {
          return `PAPER ${mappedPaperNumber}: ${title}`;
        }
      }
    }
    return title;
  };

  // Show error if any
  if (error && !episode) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <p className="font-medium">Error</p>
            <p>{error}</p>
            <Link to="/" className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded-lg">
              Return Home
            </Link>
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
        </div>
      </Layout>
    );
  }

  if (!episode) {
    return null;
  }

  return (
    <Layout>
      {episode && (
        <MetaTags 
          title={`${episode.title} | Urantia Book Podcast`}
          description={`Listen to ${episode.title} from the Urantia Book Podcast: ${episode.description?.substring(0, 150)}...`}
          url={window.location.href}
          imageUrl={episode.imageUrl || "https://www.urantiabookpod.com/og-image.png"}
          type="article"
        />
      )}
      <main className="container mx-auto px-4 py-8 max-w-6xl" key={location.pathname}>
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
                <h1 className="title-main text-xl md:text-2xl lg:text-3xl">
                  {formatTitle(episode.title, episode.series, episode.id)}
                </h1>
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
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-primary mb-2">Summary</h3>
                    <button 
                      onClick={toggleSummary}
                      className="text-white/70 hover:text-white flex items-center gap-1 text-sm"
                      aria-label={summaryExpanded ? "Collapse summary" : "Expand summary"}
                    >
                      {summaryExpanded ? (
                        <>
                          <span>Read Less</span>
                          <ChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          <span>Read More</span>
                          <ChevronDown size={16} />
                        </>
                      )}
                    </button>
                  </div>
                  
                  <AnimatePresence initial={false}>
                    {summaryExpanded ? (
                      <motion.div
                        key="full-summary"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-white/90 leading-relaxed">{episode.summary}</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="summary-preview"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-white/90 leading-relaxed line-clamp-3">
                          {episode.summary}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              {/* For Jesus series: Show "Read on DiscoverJesus.com" button */}
              {episode.sourceUrl && episode.series.startsWith('jesus-') && (
                <a
                  href={episode.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gold text-navy-dark rounded-md hover:bg-gold-light transition-colors font-medium"
                >
                  <ExternalLink size={18} />
                  <span>Read on DiscoverJesus.com</span>
                </a>
              )}
              
              {/* For other series: Show PDF button if available */}
              {episode.pdfUrl && episode.pdfUrl.trim() !== '' && !episode.series.startsWith('jesus-') && (
                <a
                  href={episode.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-navy-light/70 text-white/90 hover:bg-navy transition-colors"
                >
                  <BookOpen size={18} />
                  <span>Read PDF</span>
                </a>
              )}
              
              {/* Show Transcript button for Urantia Papers - direct URL generation */}
              {episode.series === 'urantia-papers' && (() => {
                // Log the transcript URL for debugging
                const transcriptUrl = `https://pub-69ae36e16d64438e9bb56350459d5c7d.r2.dev/${episode.id === 0 ? 'foreword' : `paper-${episode.id}`}-transcript.pdf`;
                console.log(`Generating transcript URL for paper ${episode.id}: ${transcriptUrl}`);
                
                return (
                  <a
                    href={transcriptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-navy-light/70 text-white/90 hover:bg-navy transition-colors"
                  >
                    <FileText size={18} />
                    <span>Read Transcript</span>
                  </a>
                );
              })()}
              
              <a
                href={episode.audioUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-navy-light/70 text-white/90 hover:bg-navy transition-colors"
              >
                <Download size={18} />
                <span>Download Audio</span>
              </a>
              
              <SocialShareMenu 
                url={window.location.href}
                title={`Listen to ${episode.title} | Urantia Book Podcast`}
                description={`Check out this episode of the Urantia Book Podcast: ${episode.title}`}
              />
            </div>
          </div>
        </motion.div>
        
        {/* Audio Player */}
        <div className="bg-navy-light/30 rounded-xl border border-white/10 p-6 mb-8">
          {audioError ? (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-orange-800 mb-6">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Audio Not Available</p>
                  <p>{error}</p>
                  {episode?.series?.startsWith('cosmic-') && (
                    <p className="mt-2 text-sm">
                      The cosmic series audio files are still being created. You can continue exploring the text content below.
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
                    aria-label="Rewind 10 seconds"
                  >
                    <SkipBack size={20} />
                  </button>
                  
                  <button 
                    onClick={togglePlayPause}
                    className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-dark transition-colors"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                  </button>
                  
                  <button 
                    onClick={skipForward}
                    className="flex items-center justify-center w-10 h-10 bg-navy-light hover:bg-navy text-white/90 hover:text-white rounded-lg transition"
                    aria-label="Fast forward 10 seconds"
                  >
                    <SkipForward size={20} />
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
        
        {/* DiscoverJesus.com related links for Urantia Papers */}
        {episode.series === 'urantia-papers' && 
         episode.id >= 120 && 
         episode.id <= 196 && 
         discoverJesusLinks[episode.id] && (
          <motion.div 
            className="bg-navy-light/30 rounded-xl border border-white/10 p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-bold mb-4">Related Content on DiscoverJesus.com</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {discoverJesusLinks[episode.id].map((link, index) => (
                <a 
                  key={index}
                  href={link.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-navy-light/50 hover:bg-navy-light/80 text-white rounded-md transition-colors group"
                >
                  <ExternalLink size={16} className="flex-shrink-0 text-gold group-hover:text-gold-light transition-colors" />
                  <span>{link.title}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Episode Navigation */}
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={() => navigateToEpisode('prev')}
            disabled={
              seriesId && episodeId
                ? parseInt(episodeId, 10) <= 1
                : episode?.id <= 1
            }
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition
              ${(seriesId && episodeId
                  ? parseInt(episodeId, 10) <= 1
                  : episode?.id <= 1)
                ? 'bg-navy-light/30 text-white/30 cursor-not-allowed' 
                : 'bg-navy-light hover:bg-navy text-white/90 hover:text-white'}`}
          >
            <ChevronLeft size={20} />
            <span>Previous Episode</span>
          </button>
          
          <button 
            onClick={() => navigateToEpisode('next')}
            disabled={
              seriesId && episodeId
                ? !getNextEpisodeUrl()
                : episode?.id >= (
                    episode?.series === 'urantia-papers' ? 196 : 
                    episode?.series?.startsWith('jesus-') ? 5 : 
                    episode?.series?.startsWith('cosmic-') ? 5 :
                    5 // Default max for most series is 5 episodes
                  )
            }
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition
              ${(seriesId && episodeId
                  ? !getNextEpisodeUrl()
                  : episode?.id >= (
                      episode?.series === 'urantia-papers' ? 196 : 
                      episode?.series?.startsWith('jesus-') ? 5 : 
                      episode?.series?.startsWith('cosmic-') ? 5 :
                      5 // Default max for most series is 5 episodes
                    ))
                ? 'bg-navy-light/30 text-white/30 cursor-not-allowed' 
                : 'bg-navy-light hover:bg-navy text-white/90 hover:text-white'}`}
          >
            <span>Next Episode</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </main>
    </Layout>
  );
}