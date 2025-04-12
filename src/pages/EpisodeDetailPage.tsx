import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import Layout from '../components/layout/Layout';
import AudioPlayer from '../components/audio/AudioPlayer';
import { Episode } from '../types/index';
import { getEpisodeById } from '../data/episodes';
import SocialShareMenu from '../components/ui/SocialShareMenu';

export default function EpisodeDetailPage() {
  const { series = '', id = '' } = useParams<{ series: string; id: string }>();
  const navigate = useNavigate();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            <h1 className="text-2xl font-bold mb-4">{episode.title}</h1>
            
            {episode.description && (
              <div className="mb-6 text-gray-700">
                <p>{episode.description}</p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-3 mb-8">
              {episode.pdfUrl && (
                <a 
                  href={episode.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <FileText size={20} />
                  <span>View PDF</span>
                </a>
              )}
              
              <a 
                href={episode.audioUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Download size={20} />
                <span>Download Audio</span>
              </a>
              
              <SocialShareMenu 
                url={`${window.location.origin}/series/${series}/${episode.id}`}
                title={`Listen to ${episode.title} | Urantia Book Podcast`}
                description={`Check out this episode of the Urantia Book Podcast: ${episode.title}`}
              />
            </div>
            
            <AudioPlayer 
              audioUrl={episode.audioUrl} 
              title={episode.title}
              episodeId={episode.id}
              onError={handleAudioError}
            />
          </div>
        )}
      </div>
    </Layout>
  );
} 