import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Download, ChevronLeft, BookOpen, Share2, AlertTriangle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { getEpisodeById, getUrantiaPaperPart } from '../data/episodes';
import { Episode } from '../types/index';

export default function EpisodePage() {
  const { id, series = 'urantia-papers' } = useParams<{ id: string; series?: string }>();
  const navigate = useNavigate();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<boolean>(false);
  const [shareNotification, setShareNotification] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Load episode data
  useEffect(() => {
    if (id) {
      try {
        const episodeData = getEpisodeById(parseInt(id), series);
        if (episodeData) {
          setEpisode(episodeData);
          setIsLoading(false);
        } else {
          setError(`Episode not found in ${series} series`);
          setIsLoading(false);
        }
      } catch (err) {
        setError('Failed to load episode');
        setIsLoading(false);
      }
    }
  }, [id, series]);

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
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current && !audioError) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
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
  const getPartColor = (paperId: number) => {
    const part = getUrantiaPaperPart(paperId);
    switch (part) {
      case 1: return 'border-blue-500/30 from-blue-500/20';
      case 2: return 'border-green-500/30 from-green-500/20';
      case 3: return 'border-amber-500/30 from-amber-500/20';
      case 4: return 'border-rose-500/30 from-rose-500/20';
      default: return 'border-gray-500/30 from-gray-500/20';
    }
  };

  // Navigate to previous or next episode
  const navigateToEpisode = (direction: 'prev' | 'next') => {
    if (!episode) return;
    
    const targetId = direction === 'prev' 
      ? episode.id - 1 
      : episode.id + 1;
    
    // Check if target episode exists
    try {
      const targetEpisode = getEpisodeById(targetId, series);
      if (targetEpisode) {
        navigate(`/listen/${series}/${targetId}`);
      }
    } catch (err) {
      console.error('Error navigating to episode:', err);
    }
  };

  // Get previous and next episode info for navigation
  const prevEpisode = episode ? getEpisodeById(episode.id - 1, series) : null;
  const nextEpisode = episode ? getEpisodeById(episode.id + 1, series) : null;

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

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (error && !episode) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-white/70 mb-6">{error || 'Episode not found'}</p>
          <button 
            onClick={() => navigate('/urantia-papers')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to Papers
          </button>
        </div>
      </Layout>
    );
  }

  if (!episode) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/urantia-papers')}
          className="flex items-center text-white/70 hover:text-white mb-6"
        >
          <ChevronLeft size={20} className="mr-1" />
          <span>Back to Papers</span>
        </button>
        
        {/* Episode Header */}
        <motion.div 
          className={`rounded-xl p-8 mb-8 bg-gradient-to-r ${getPartColor(episode.id)} to-transparent border border-white/10`}
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
                src={episode.audioUrl}
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
                </div>
                
                <div className="flex items-center space-x-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <button 
                    onClick={toggleMute}
                    className="text-white/70 hover:text-white"
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
                    className="w-full sm:w-24 accent-primary"
                  />
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* PDF Viewer */}
        {episode.pdfUrl && (
          <div className="bg-navy-light/30 rounded-xl border border-white/10 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Read Along</h2>
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-white/70 mb-6">For the best reading experience, we recommend opening the PDF in a new tab.</p>
              <a
                href={episode.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                <BookOpen size={20} />
                <span>Open PDF in New Tab</span>
              </a>
            </div>
          </div>
        )}
        
        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-4 border-t border-white/10">
          {prevEpisode ? (
            <button 
              onClick={() => navigateToEpisode('prev')}
              className="flex items-center text-white/70 hover:text-white group"
            >
              <ChevronLeft size={20} className="mr-1 group-hover:transform group-hover:-translate-x-1 transition-transform" />
              <div className="text-left">
                <span className="block text-xs text-white/50">Previous</span>
                {series === 'urantia-papers' ? (
                  <>
                    <span className="hidden md:block">{prevEpisode.title}</span>
                    <span className="block md:hidden">
                      {prevEpisode.id === 0 ? 'Foreword' : `Paper ${prevEpisode.id}`}
                    </span>
                  </>
                ) : (
                  <span className="block">{prevEpisode.title.length > 25 ? prevEpisode.title.substring(0, 25) + '...' : prevEpisode.title}</span>
                )}
              </div>
            </button>
          ) : (
            <div></div> /* Empty div to maintain layout */
          )}
          
          {nextEpisode ? (
            <button 
              onClick={() => navigateToEpisode('next')}
              className="flex items-center text-white/70 hover:text-white group"
            >
              <div className="text-right">
                <span className="block text-xs text-white/50">Next</span>
                {series === 'urantia-papers' ? (
                  <>
                    <span className="hidden md:block">{nextEpisode.title}</span>
                    <span className="block md:hidden">
                      {nextEpisode.id === 0 ? 'Foreword' : `Paper ${nextEpisode.id}`}
                    </span>
                  </>
                ) : (
                  <span className="block">{nextEpisode.title.length > 25 ? nextEpisode.title.substring(0, 25) + '...' : nextEpisode.title}</span>
                )}
              </div>
              <ChevronLeft size={20} className="ml-1 transform rotate-180 group-hover:transform group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <div></div> /* Empty div to maintain layout */
          )}
        </div>
      </div>
    </Layout>
  );
} 