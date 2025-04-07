import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllSeries, getSeriesByCategory } from '../../utils/seriesUtils';
import type { SeriesInfo } from '../../utils/seriesUtils';
import { SeriesType } from '../../types/index';

interface SeriesNavigationProps {
  currentSeries?: SeriesType;
}

export default function SeriesNavigation({ currentSeries }: SeriesNavigationProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'jesus-focused' | 'parts-i-iii'>('all');
  
  // Get series based on selected category
  const getSeriesToDisplay = (): SeriesInfo[] => {
    if (activeCategory === 'all') {
      return getAllSeries();
    }
    return getSeriesByCategory(activeCategory);
  };
  
  const series = getSeriesToDisplay();
  
  return (
    <div className="bg-navy-dark rounded-lg p-6">
      <h2 className="title-subtitle mb-4">Podcast Series</h2>
      
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-4 text-sm">
        <button 
          className={`px-3 py-1 rounded ${activeCategory === 'all' ? 'bg-primary text-white' : 'bg-navy-light/30 text-white/70 hover:bg-navy-light/50'}`}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        <button 
          className={`px-3 py-1 rounded ${activeCategory === 'jesus-focused' ? 'bg-primary text-white' : 'bg-navy-light/30 text-white/70 hover:bg-navy-light/50'}`}
          onClick={() => setActiveCategory('jesus-focused')}
        >
          Jesus
        </button>
        <button 
          className={`px-3 py-1 rounded ${activeCategory === 'parts-i-iii' ? 'bg-primary text-white' : 'bg-navy-light/30 text-white/70 hover:bg-navy-light/50'}`}
          onClick={() => setActiveCategory('parts-i-iii')}
        >
          Fifth Epochal Revelation
        </button>
      </div>
      
      {/* Series list */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {series.map(series => (
          <Link 
            key={series.id}
            to={`/series/${series.id}`}
            className={`block py-2 px-3 rounded transition-colors ${
              currentSeries === series.id 
                ? 'bg-gold/20 text-white font-medium' 
                : 'hover:bg-navy-light/30 text-white/80 hover:text-white'
            }`}
          >
            {series.title}
          </Link>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/10">
        <Link 
          to="/series"
          className="text-gold hover:text-gold-light text-sm flex items-center justify-center"
        >
          View All Series
        </Link>
      </div>
    </div>
  );
} 