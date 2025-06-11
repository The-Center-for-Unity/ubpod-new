import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../i18n/LanguageContext';
import { getAllSeries, getSeriesByCategory, SeriesInfo } from '../../utils/seriesUtils';
import { filterSeriesByLanguage, getAvailableCategories } from '../../utils/seriesAvailabilityUtils';
import { getSeriesCollectionsUILabels } from '../../utils/seriesCollectionsUtils';
import SeriesCard from './SeriesCard';

export default function SeriesCardGrid() {
  const { language } = useLanguage();
  const { t } = useTranslation('series-collections');
  const [activeCategory, setActiveCategory] = useState<'all' | 'jesus-focused' | 'parts-i-iii'>('all');
  
  // Get translated UI labels
  const labels = getSeriesCollectionsUILabels();
  
  // Get available categories for current language
  const availableCategories = getAvailableCategories(language);
  
  // Reset to 'all' if current category becomes unavailable in this language
  useEffect(() => {
    if (activeCategory === 'jesus-focused' && !availableCategories.hasJesusSeries) {
      setActiveCategory('all');
    }
    if (activeCategory === 'parts-i-iii' && !availableCategories.hasCosmicSeries) {
      setActiveCategory('all');
    }
  }, [language, availableCategories.hasJesusSeries, availableCategories.hasCosmicSeries, activeCategory]);
  
    // Get series based on selected category and language with translations applied
  const getSeriesToDisplay = () => {
    let allSeries;
    if (activeCategory === 'all') {
      allSeries = getAllSeries(language);
    } else {
      allSeries = getSeriesByCategory(activeCategory, language);
    }
    
         // Apply translations to each series
     const translatedSeries = allSeries.map((series: SeriesInfo) => {
       return {
         ...series,
         title: t(`series.${series.id}.title`, { defaultValue: series.title }),
         description: t(`series.${series.id}.description`, { defaultValue: series.description }),
         logline: t(`series.${series.id}.logline`, { defaultValue: series.logline })
       };
     });
    
    // Filter by language availability
    return filterSeriesByLanguage(translatedSeries, language);
  };

  const series = getSeriesToDisplay();
  
  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <button 
          className={`px-4 py-2 rounded-full transition-colors ${activeCategory === 'all' ? 'bg-primary text-white' : 'bg-navy-light/30 text-white/70 hover:bg-navy-light/50'}`}
          onClick={() => setActiveCategory('all')}
        >
          {labels.buttons.allSeries}
        </button>
        {availableCategories.hasJesusSeries && (
          <button 
            className={`px-4 py-2 rounded-full transition-colors ${activeCategory === 'jesus-focused' ? 'bg-primary text-white' : 'bg-navy-light/30 text-white/70 hover:bg-navy-light/50'}`}
            onClick={() => setActiveCategory('jesus-focused')}
          >
            {labels.buttons.jesusSeries}
          </button>
        )}
        {availableCategories.hasCosmicSeries && (
          <button 
            className={`px-4 py-2 rounded-full transition-colors ${activeCategory === 'parts-i-iii' ? 'bg-primary text-white' : 'bg-navy-light/30 text-white/70 hover:bg-navy-light/50'}`}
            onClick={() => setActiveCategory('parts-i-iii')}
          >
            {labels.buttons.cosmicSeries}
          </button>
        )}
      </div>
      
      {/* Display count of series being shown */}
      <div className="text-center mb-6 text-white/60">
        {labels.status.showingCount.replace('{{count}}', series.length.toString())}
      </div>
      
      {/* Series grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {series.map(series => (
          <SeriesCard key={series.id} series={series} />
        ))}
      </div>
      
      {/* Empty state */}
      {series.length === 0 && (
        <div className="text-center py-16">
          <p className="text-white/60 text-lg">{labels.status.noSeries}</p>
        </div>
      )}
    </div>
  );
} 