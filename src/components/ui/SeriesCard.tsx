import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, Library } from 'lucide-react';
import type { SeriesInfo } from '../../utils/seriesUtils';

interface SeriesCardProps {
  series: SeriesInfo;
}

export default function SeriesCard({ series }: SeriesCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Get category badge text and color
  const getCategoryBadge = () => {
    switch (series.category) {
      case 'jesus-focused':
        return {
          text: 'Jesus Series',
          className: 'bg-gold/20 text-gold'
        };
      case 'parts-i-iii':
        return {
          text: 'Cosmic Series',
          className: 'bg-blue-400/20 text-blue-400'
        };
      default:
        return {
          text: 'Series',
          className: 'bg-primary/20 text-primary'
        };
    }
  };
  
  const badge = getCategoryBadge();
  
  // Get appropriate icon based on category
  const getPlaceholderIcon = () => {
    if (series.category === 'jesus-focused') {
      return <Book className="w-16 h-16 text-gold/30" />;
    }
    return <Library className="w-16 h-16 text-blue-400/30" />;
  };
  
  const placeholderImageStyle = series.category === 'jesus-focused' 
    ? 'bg-gradient-to-br from-rose-900/40 to-navy-dark'
    : 'bg-gradient-to-br from-blue-900/40 to-navy-dark';
  
  return (
    <Link to={`/series/${series.id}`} className="group">
      <div className="rounded-lg overflow-hidden bg-navy-light/20 border border-white/5 hover:border-white/20 transition-all h-full flex flex-col shadow-md hover:shadow-lg">
        <div className={`aspect-video relative overflow-hidden ${imageError ? placeholderImageStyle : ''}`}>
          {!imageError && series.imageSrc ? (
            <img 
              src={series.imageSrc} 
              alt={series.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {getPlaceholderIcon()}
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badge.className}`}>
              {badge.text}
            </span>
          </div>
        </div>
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="title-card text-white mb-3 line-clamp-2 min-h-[3.5rem]">{series.title}</h3>
          <p className="text-sm text-white/80 line-clamp-3 flex-grow min-h-[4.5rem] italic">
            {series.logline || series.description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-primary text-sm font-medium group-hover:underline">
              View Episodes
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
} 