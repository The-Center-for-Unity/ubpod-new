import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import EpisodeCard from '../components/ui/EpisodeCard';
import SeriesNavigation from '../components/ui/SeriesNavigation';
import { Episode, SeriesType } from '../types/index';
import { getSeriesInfo } from '../utils/seriesUtils';
import { getEpisodesForSeries } from '../utils/episodeUtils';
import { PlayCircle } from 'lucide-react';

export default function ListenPage() {
  const { seriesId } = useParams<{ seriesId: string }>();
  const navigate = useNavigate();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!seriesId) return;
    
    try {
      setLoading(true);
      const seriesEpisodes = getEpisodesForSeries(seriesId);
      setEpisodes(seriesEpisodes);
      setError(null);
    } catch (err) {
      console.error('Error loading episodes:', err);
      setError('Failed to load episodes. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [seriesId]);

  const handlePlay = (episode: Episode) => {
    navigate(`/series/${seriesId}/${episode.id}`);
  };

  // Get series information
  const seriesInfo = seriesId ? getSeriesInfo(seriesId) : undefined;

  // Determine category badge text and class
  const getCategoryBadgeText = () => {
    if (!seriesInfo) return 'Series';
    
    switch(seriesInfo.category) {
      case 'jesus-focused':
        return 'Jesus-Focused Series';
      case 'parts-i-iii':
        return 'Cosmic Series';
      default:
        return 'Series';
    }
  };

  const getCategoryBadgeClass = () => {
    if (!seriesInfo) return 'bg-navy-light';
    
    switch(seriesInfo.category) {
      case 'jesus-focused':
        return 'bg-rose-700';
      case 'parts-i-iii':
        return 'bg-emerald-700';
      default:
        return 'bg-navy-light';
    }
  };

  return (
    <Layout>
      <main className="min-h-screen bg-navy-dark pt-24 pb-20">
        {/* Series header */}
        {seriesInfo && (
          <div className="bg-navy py-8 mb-12">
            <div className="container mx-auto px-4">
              <div className="flex flex-col">
                {/* Info - now full width without the image */}
                <div className="w-full">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide text-white mb-4 ${getCategoryBadgeClass()}`}>
                    {getCategoryBadgeText()}
                  </div>
                  <h1 className="title-main text-3xl md:text-4xl lg:text-5xl mb-4">
                    {seriesInfo.title}
                  </h1>
                  <p className="body-lg text-white/80 mb-6 max-w-3xl">
                    {seriesInfo.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <button 
                      className="inline-flex items-center px-6 py-3 bg-gold text-navy-dark rounded-full hover:bg-gold-light transition-all duration-300 font-bold"
                      onClick={() => episodes.length > 0 && handlePlay(episodes[0])}
                      disabled={loading || episodes.length === 0}
                    >
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Start Listening
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="container mx-auto px-4">
          {/* Section Titles Row - Added to align titles */}
          <div className="flex mb-6">
            <div className="lg:w-1/4 xl:w-1/5">
              <h2 className="title-subtitle text-xl tracking-[0.15em] text-gold">
                PODCAST SERIES
              </h2>
            </div>
            <div className="lg:w-3/4 xl:w-4/5">
              <h2 className="title-subtitle text-xl tracking-[0.15em] text-gold">
                EPISODES
              </h2>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left sidebar for series navigation */}
            <div className="lg:w-1/4 xl:w-1/5">
              <SeriesNavigation 
                currentSeries={seriesId as SeriesType} 
                hideTitle={true} 
              />
            </div>
            
            {/* Main content */}
            <div className="lg:w-3/4 xl:w-4/5">
              {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Error</h3>
                  <p>{error}</p>
                </div>
              ) : episodes.length === 0 ? (
                <div className="bg-navy-light rounded-lg p-8 text-center">
                  <h3 className="text-xl font-bold mb-3">No Episodes Available</h3>
                  <p className="text-white/80">
                    This series doesn't have any episodes yet. Please check back later.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {episodes.map((episode) => (
                      <EpisodeCard
                        key={episode.id}
                        episode={episode}
                        onPlay={() => handlePlay(episode)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
} 