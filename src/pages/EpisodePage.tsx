import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Download, ChevronLeft, BookOpen, Share2, AlertTriangle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { getEpisodeById, getUrantiaPaperPart } from '../data/episodes';
import { Episode } from '../types/index';

export default function EpisodePage() {
  const { id } = useParams<{ id: string }>();
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Load episode data
  useEffect(() => {
    if (id) {
      try {
        const episodeData = getEpisodeById(parseInt(id), 'urantia-papers');
        if (episodeData) {
          setEpisode(episodeData);
          setIsLoading(false);
        } else {
          setError('Episode not found');
          setIsLoading(false);
        }
      } catch (err) {
        setError('Failed to load episode');
        setIsLoading(false);
      }
    }
  }, [id]);

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
    if (episode) {
      const currentId = episode.id;
      const targetId = direction === 'prev' ? currentId - 1 : currentId + 1;
      
      // Check if target episode exists
      try {
        const targetEpisode = getEpisodeById(targetId, 'urantia-papers');
        if (targetEpisode) {
          navigate(`/episode/${targetId}`);
        }
      } catch (err) {
        // Do nothing if episode doesn't exist
      }
    }
  };

  const handleAudioError = () => {
    setAudioError(true);
    setError('Audio file not found or cannot be played. Please check that the file exists at the specified path.');
  };

  const handlePdfError = () => {
    setPdfError(true);
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
                <h1 className="title-main">{episode.title}</h1>
              </div>
              <p className="body-lg mt-2 max-w-3xl">{episode.description}</p>
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
              
              <button className="flex items-center gap-2 px-4 py-2 bg-navy-light/70 text-white/90 rounded-md hover:bg-navy transition-colors">
                <Share2 size={18} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </motion.div>
        
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
                <a
                  href={episode.audioUrl}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Audio URL
                </a>
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
              <div className="flex items-center justify-between">
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
                
                <div className="flex items-center space-x-2">
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
                    className="w-24 accent-primary"
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
            <div className="aspect-w-16 aspect-h-9 bg-navy-dark rounded-lg overflow-hidden">
              {pdfError ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <AlertTriangle size={36} className="text-amber-500 mb-4" />
                  <p className="text-white/70 max-w-lg mb-4">
                    PDF file could not be loaded. Please check that the file exists at the specified path.
                  </p>
                  <a
                    href={episode.pdfUrl}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View PDF URL
                  </a>
                </div>
              ) : (
                <iframe 
                  src={episode.pdfUrl}
                  className="w-full h-full"
                  title={`PDF for ${episode.title}`}
                  onError={handlePdfError}
                  allowFullScreen
                />
              )}
            </div>
          </div>
        )}
        
        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-4 border-t border-white/10">
          <button 
            onClick={() => navigateToEpisode('prev')}
            className={`flex items-center text-white/70 hover:text-white ${episode.id <= 1 ? 'invisible' : ''}`}
          >
            <ChevronLeft size={20} className="mr-1" />
            <span>Previous Paper</span>
          </button>
          
          <button 
            onClick={() => navigateToEpisode('next')}
            className={`flex items-center text-white/70 hover:text-white ${episode.id >= 196 ? 'invisible' : ''}`}
          >
            <span>Next Paper</span>
            <ChevronLeft size={20} className="ml-1 transform rotate-180" />
          </button>
        </div>
      </div>
    </Layout>
  );
} 