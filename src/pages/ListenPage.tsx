import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import EpisodeCard from '../components/ui/EpisodeCard';
import { Episode } from '../types';
import { 
  getUrantiaPapers, 
  getDiscoverJesusEpisodes, 
  getHistoryEpisodes, 
  getSadlerWorkbooks 
} from '../data/episodes';

export default function ListenPage() {
  const { series = 'urantia-papers' } = useParams<{ series: string }>();
  const navigate = useNavigate();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    try {
      let seriesEpisodes: Episode[] = [];
      
      switch (series) {
        case 'urantia-papers':
          seriesEpisodes = getUrantiaPapers();
          break;
        case 'discover-jesus':
          seriesEpisodes = getDiscoverJesusEpisodes();
          break;
        case 'history':
          seriesEpisodes = getHistoryEpisodes();
          break;
        case 'sadler-workbooks':
          seriesEpisodes = getSadlerWorkbooks();
          break;
        default:
          throw new Error('Invalid series');
      }
      
      setEpisodes(seriesEpisodes);
    } catch (err) {
      setError('Failed to load episodes. Please try again later.');
      console.error('Error loading episodes:', err);
    } finally {
      setLoading(false);
    }
  }, [series]);

  const getSeriesTitle = () => {
    switch (series) {
      case 'urantia-papers':
        return 'Urantia Papers';
      case 'discover-jesus':
        return 'Discover Jesus';
      case 'history':
        return 'History of the Urantia Book';
      case 'sadler-workbooks':
        return 'Dr. Sadler\'s Workbooks';
      default:
        return 'Episodes';
    }
  };

  const handlePlay = (episodeId: number) => {
    navigate(`/listen/${series}/${episodeId}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="title-main mb-8">{getSeriesTitle()}</h1>
        
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
        
        {!loading && !error && episodes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No episodes found in this series.</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodes.map((episode) => (
            <EpisodeCard 
              key={episode.id} 
              episode={episode} 
              onPlay={() => handlePlay(episode.id)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
} 