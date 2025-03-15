import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Share2 } from 'lucide-react';
import Layout from '../components/layout/Layout';
import AudioPlayer from '../components/audio/AudioPlayer';
import { Episode } from '../types/index';
import { getEpisodeById } from '../data/episodes';

export default function EpisodeDetailPage() {
  const { series = '', id = '' } = useParams<{ series: string; id: string }>();
  const navigate = useNavigate();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareNotification, setShareNotification] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    try {
      const episodeId = parseInt(id, 10);
      if (isNaN(episodeId)) {
        throw new Error('Invalid episode ID');
      }
      
      const foundEpisode = getEpisodeById(episodeId, series);
      if (!foundEpisode) {
        throw new Error('Episode not found');
      }
      
      setEpisode(foundEpisode);
    } catch (err) {
      setError('Failed to load episode. Please try again later.');
      console.error('Error loading episode:', err);
    } finally {
      setLoading(false);
    }
  }, [series, id]);

  const handleBack = () => {
    navigate(`/listen/${series}`);
  };

  const handleAudioError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    // Try to use the Web Share API if available
    if (navigator.share && episode) {
      try {
        await navigator.share({
          title: episode.title,
          text: episode.description,
          url: url
        });
        setShareNotification('Shared successfully!');
      } catch (err) {
        // Fallback to clipboard if user cancels or share fails
        copyToClipboard(url);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      copyToClipboard(url);
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={handleBack}
          className="flex items-center gap-1 mb-6 text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to {series.replace('-', ' ')}</span>
        </button>
        
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mb-8">
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && episode && (
          <div>
            <div className="mb-8">
              <h1 className="title-main mb-4">{episode.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{episode.description}</p>
              
              {episode.summary && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Summary</h3>
                  <p className="text-gray-700 leading-relaxed">{episode.summary}</p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-4 mb-8">
                {episode.pdfUrl && (
                  <a 
                    href={episode.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <FileText size={20} />
                    <span>Read PDF</span>
                  </a>
                )}
                
                <a 
                  href={episode.audioUrl} 
                  download
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Download size={20} />
                  <span>Download Audio</span>
                </a>
                
                {episode.sourceUrl && (
                  <a 
                    href={episode.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <span>View Source</span>
                  </a>
                )}
                
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Share2 size={20} />
                  <span>Share</span>
                </button>
              </div>
              
              <AudioPlayer 
                audioUrl={episode.audioUrl} 
                title={episode.title}
                episodeId={episode.id}
                onError={handleAudioError}
              />
            </div>
            
            {episode.imageUrl && (
              <div className="mt-8">
                <img 
                  src={episode.imageUrl} 
                  alt={episode.title} 
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        )}
        
        {/* Share Notification */}
        {shareNotification && (
          <div className="fixed bottom-4 right-4 bg-primary text-white px-4 py-3 rounded-lg shadow-lg transition-opacity duration-300">
            {shareNotification}
          </div>
        )}
      </div>
    </Layout>
  );
} 