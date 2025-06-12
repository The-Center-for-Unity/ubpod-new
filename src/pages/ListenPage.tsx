import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import EpisodeCard from '../components/ui/EpisodeCard';
import SeriesNavigation from '../components/ui/SeriesNavigation';
import { Episode, SeriesType } from '../types/index';
import { getSeriesInfo } from '../utils/seriesUtils';
import { getEpisodesForSeries } from '../utils/episodeUtils';
import { getAvailableSeriesIds } from '../utils/seriesAvailabilityUtils';
import { useLanguage } from '../i18n/LanguageContext';
import { PlayCircle } from 'lucide-react';

export default function ListenPage() {
  const { seriesId } = useParams<{ seriesId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { t } = useTranslation(['series-detail', 'series-collections']);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if current series is available in the selected language
  useEffect(() => {
    if (!seriesId) return;
    
    const availableSeriesIds = getAvailableSeriesIds(language);
    const isSeriesAvailable = availableSeriesIds.includes(seriesId);
    
    if (!isSeriesAvailable) {
      // Redirect to series page - the series page will show available content
      // and can display a message explaining why they were redirected
      const basePath = language === 'es' ? '/es' : '';
      navigate(`${basePath}/series?unavailable=${seriesId}`, { replace: true });
      return;
    }
  }, [seriesId, language, navigate]);

  useEffect(() => {
    if (!seriesId) return;
    
    // Only proceed if series is available (the redirect effect above will handle unavailable series)
    const availableSeriesIds = getAvailableSeriesIds(language);
    const isSeriesAvailable = availableSeriesIds.includes(seriesId);
    
    if (!isSeriesAvailable) return;
    
    try {
      setLoading(true);
      const seriesEpisodes = getEpisodesForSeries(seriesId, language);
      setEpisodes(seriesEpisodes);
      setError(null);
    } catch (err) {
      console.error('Error loading episodes:', err);
      setError('Failed to load episodes. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [seriesId, language]);

  const handlePlay = (episode: Episode) => {
    const basePath = language === 'es' ? '/es' : '';
    navigate(`${basePath}/series/${seriesId}/${episode.id}`);
  };

  // Get series information with translations
  const baseSeriesInfo = seriesId ? getSeriesInfo(seriesId) : undefined;
  const seriesInfo = baseSeriesInfo ? {
    ...baseSeriesInfo,
    title: t(`series-collections:series.${seriesId}.title`, { defaultValue: baseSeriesInfo.title }),
    description: t(`series-collections:series.${seriesId}.description`, { defaultValue: baseSeriesInfo.description }),
    logline: t(`series-collections:series.${seriesId}.logline`, { defaultValue: baseSeriesInfo.logline })
  } : undefined;

  // Determine category badge text and class
  const getCategoryBadgeText = () => {
    if (!seriesInfo) return t('series-detail:header.badges.cosmicSeries');
    
    switch(seriesInfo.category) {
      case 'jesus-focused':
        return t('series-detail:header.badges.jesusFocused');
      case 'parts-i-iii':
        return t('series-detail:header.badges.cosmicSeries');
      default:
        return t('series-detail:header.badges.cosmicSeries');
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
          <div className="bg-navy py-8 mb-8 sm:mb-12">
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
                      {t('series-detail:header.actions.startListening')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="container mx-auto px-4">
          {/* Section Titles Row - Desktop only */}
          <div className="hidden lg:flex mb-6">
            <div className="lg:w-1/4 xl:w-1/5">
              <h2 className="title-subtitle text-xl tracking-[0.15em] text-gold">
                {t('series-detail:navigation.title')}
              </h2>
            </div>
            <div className="lg:w-3/4 xl:w-4/5">
              <h2 className="title-subtitle text-xl tracking-[0.15em] text-gold">
                {t('series-detail:episodes.title')}
              </h2>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left sidebar for series navigation */}
            <div className="w-full lg:w-1/4 xl:w-1/5">
              {/* Mobile Series Title - Only shown on mobile */}
              <div className="mb-3 lg:hidden">
                <h2 className="title-subtitle text-lg tracking-[0.15em] text-gold">
                  {t('series-detail:navigation.mobileTitle')}
                </h2>
              </div>
              
              <SeriesNavigation 
                key={`${language}-${seriesId}`}
                currentSeries={seriesId as SeriesType} 
                hideTitle={true} 
              />
            </div>
            
            {/* Main content */}
            <div className="lg:w-3/4 xl:w-4/5 mt-8 lg:mt-0">
              {/* Mobile Episodes Title - Only shown on mobile */}
              <div className="mb-4 lg:hidden">
                <h2 className="title-subtitle text-xl tracking-[0.15em] text-gold">
                  {t('series-detail:episodes.title')}
                </h2>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center min-h-[300px]">
                  <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{t('series-detail:episodes.error.title')}</h3>
                  <p>{t('series-detail:episodes.error.message')}</p>
                </div>
              ) : episodes.length === 0 ? (
                <div className="bg-navy-light rounded-lg p-8 text-center">
                  <h3 className="text-xl font-bold mb-3">{t('series-detail:episodes.noEpisodes.title')}</h3>
                  <p className="text-white/80">
                    {t('series-detail:episodes.noEpisodes.message')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {episodes.map((episode) => (
                    <EpisodeCard
                      key={episode.id}
                      episode={episode}
                      onPlay={() => handlePlay(episode)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
} 