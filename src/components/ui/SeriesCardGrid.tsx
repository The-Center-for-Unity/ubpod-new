import React, { useState } from 'react';
import { getAllSeries, getSeriesByCategory } from '../../utils/seriesUtils';
import SeriesCard from './SeriesCard';

export default function SeriesCardGrid() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'jesus-focused' | 'parts-i-iii'>('all');
  
  // Get series based on selected category
  const getSeriesToDisplay = () => {
    if (activeCategory === 'all') {
      return getAllSeries();
    }
    return getSeriesByCategory(activeCategory);
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
          All Series
        </button>
        <button 
          className={`px-4 py-2 rounded-full transition-colors ${activeCategory === 'jesus-focused' ? 'bg-primary text-white' : 'bg-navy-light/30 text-white/70 hover:bg-navy-light/50'}`}
          onClick={() => setActiveCategory('jesus-focused')}
        >
          Jesus Series
        </button>
        <button 
          className={`px-4 py-2 rounded-full transition-colors ${activeCategory === 'parts-i-iii' ? 'bg-primary text-white' : 'bg-navy-light/30 text-white/70 hover:bg-navy-light/50'}`}
          onClick={() => setActiveCategory('parts-i-iii')}
        >
          Cosmic Series
        </button>
      </div>
      
      {/* Display count of series being shown */}
      <div className="text-center mb-6 text-white/60">
        Showing {series.length} series
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
          <p className="text-white/60 text-lg">No series found in this category.</p>
        </div>
      )}
    </div>
  );
} 