import React, { useState } from 'react';
import { LocalizedLink } from '../shared/LocalizedLink';
import { ChevronRight, ChevronDown, ChevronUp, Users, Globe, Book, Library } from 'lucide-react';
import { SeriesInfo } from '../../utils/seriesUtils';

interface SeriesContentProps {
  jesusSeries: SeriesInfo[];
  cosmicSeries: SeriesInfo[];
  searchQuery: string;
}

const SeriesContent: React.FC<SeriesContentProps> = ({ 
  jesusSeries, 
  cosmicSeries,
  searchQuery
}) => {
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    'jesus': true,
    'cosmic': true
  });

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  // Render a series card
  const SeriesCard = ({ series }: { series: SeriesInfo }) => {
    const [imageError, setImageError] = useState(false);
    
    const placeholderIcon = series.category === 'jesus-focused' 
      ? <Book className="w-10 h-10 text-gold/30" />
      : <Library className="w-10 h-10 text-blue-400/30" />;
      
    const placeholderStyle = series.category === 'jesus-focused'
      ? 'bg-gradient-to-br from-rose-900/40 to-navy-dark'
      : 'bg-gradient-to-br from-blue-900/40 to-navy-dark';
    
    return (
      <LocalizedLink 
        to={`/series/${series.id}`}
        className="flex bg-navy-dark/50 rounded-lg overflow-hidden hover:bg-navy-dark transition-colors border border-white/10 hover:border-white/20 group shadow-md hover:shadow-lg h-full"
      >
        <div className={`w-[120px] relative overflow-hidden flex-shrink-0 ${imageError ? placeholderStyle : ''}`}>
          {!imageError && series.imageSrc ? (
            <img 
              src={series.imageSrc} 
              alt={series.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {placeholderIcon}
            </div>
          )}
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h5 className="text-base font-semibold text-white mb-2 line-clamp-2">{series.title}</h5>
            <p className="text-xs text-white/80 mb-2 line-clamp-2 italic">
              {series.logline || series.description}
            </p>
          </div>
          <div>
            {series.totalEpisodes && (
              <div className="text-xs text-white/50 mb-1">
                {series.totalEpisodes} Episodes
              </div>
            )}
            <div className="flex items-center text-gold text-xs font-medium group-hover:translate-x-1 transition-transform">
              View Episodes
              <ChevronRight size={12} className="ml-1" />
            </div>
          </div>
        </div>
      </LocalizedLink>
    );
  };
  
  // Section component
  const SeriesSection = ({ 
    id, 
    title, 
    description, 
    series,
    icon,
    titleColor
  }: { 
    id: string;
    title: string; 
    description: string; 
    series: SeriesInfo[];
    icon: React.ReactNode;
    titleColor: string;
  }) => (
    <div className="mb-10">
      <div className="mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center">
          <div className="mr-3">
            {icon}
          </div>
          <div>
            <h2 className={`font-semibold text-xl ${titleColor}`}>
              {title}
            </h2>
          </div>
          <div className="ml-auto">
            <button
              onClick={() => toggleSection(id)}
              className="p-1 rounded-full hover:bg-white/5 transition-colors"
            >
              {expandedSections[id] ? (
                <ChevronUp className="text-white/60" size={18} />
              ) : (
                <ChevronDown className="text-white/60" size={18} />
              )}
            </button>
          </div>
        </div>
        <p className="text-white/70 text-sm mt-2 pl-10">
          {description}
        </p>
        <div className="mt-1 text-xs text-white/50 pl-10">
          {id === 'jesus' ? jesusSeries.length : cosmicSeries.length} series • {id === 'jesus' ? jesusSeries.length * 5 : cosmicSeries.length * 5} episodes
        </div>
      </div>
      
      {expandedSections[id] && (
        <div className="pl-0">
          {series.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              No series found matching your search criteria
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {series.map(item => (
                <SeriesCard key={item.id} series={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
  
  return (
    <div className="max-w-5xl mx-auto">
      <SeriesSection 
        id="jesus"
        title="The Life and Teachings of Jesus" 
        description="Explore the complete life story and teachings of Jesus as revealed in the Urantia Book, from his birth through resurrection, with insights beyond traditional Biblical accounts."
        series={jesusSeries}
        icon={<Users className="w-6 h-6 text-rose-400" />}
        titleColor="text-rose-400"
      />
      
      <SeriesSection 
        id="cosmic"
        title="Cosmic Series" 
        description="Discover the cosmic teachings from the first three parts of The Urantia Book, covering everything from the nature of God to universe structure and Earth's planetary history."
        series={cosmicSeries}
        icon={<Globe className="w-6 h-6 text-blue-400" />}
        titleColor="text-blue-400"
      />
    </div>
  );
};

export default SeriesContent; 