import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SeriesCardGrid from '../components/ui/SeriesCardGrid';
import { getSeriesByCategory, getAllSeries, SeriesInfo } from '../utils/seriesUtils';
import { ChevronRight, ChevronDown, ChevronUp, Search, Library, Book, Users, Globe } from 'lucide-react';

export default function SeriesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'structured'>('structured');
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    'jesus': true,
    'revelation': false
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [iconErrors, setIconErrors] = useState<{[key: string]: boolean}>({
    'jesus': false,
    'revelation': false
  });
  
  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  // Handle icon load error
  const handleIconError = (section: string) => {
    setIconErrors(prev => ({
      ...prev,
      [section]: true
    }));
  };
  
  // Get icon for section
  const getSectionIcon = (section: string) => {
    if (section === 'jesus') {
      return <Users className="w-12 h-12 text-rose-400/70" />;
    }
    return <Globe className="w-12 h-12 text-blue-400/70" />;
  };
  
  // Filter series by part
  const getJesusSeries = (): SeriesInfo[] => {
    // Get Jesus-related series (Part IV, papers 120-196)
    return getAllSeries().filter(series => {
      // Include all Jesus-focused series
      if (series.category === 'jesus-focused') return true;
      
      // Filter by search query if any
      if (searchQuery) {
        return series.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               series.description.toLowerCase().includes(searchQuery.toLowerCase());
      }
      
      return true;
    });
  };
  
  const getRevelationSeries = (): SeriesInfo[] => {
    // Get series related to Parts I-III (papers 1-119)
    return getAllSeries().filter(series => {
      // Include all parts-i-iii series
      if (series.category === 'parts-i-iii') return true;
      
      // Filter by search query if any
      if (searchQuery) {
        return series.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               series.description.toLowerCase().includes(searchQuery.toLowerCase());
      }
      
      return false;
    });
  };

  // Render a series card
  const SeriesCard = ({ series }: { series: SeriesInfo }) => {
    const [imageError, setImageError] = useState(false);
    
    const placeholderIcon = series.category === 'jesus-focused' 
      ? <Book className="w-12 h-12 text-gold/30" />
      : <Library className="w-12 h-12 text-blue-400/30" />;
      
    const placeholderStyle = series.category === 'jesus-focused'
      ? 'bg-gradient-to-br from-rose-900/40 to-navy-dark'
      : 'bg-gradient-to-br from-blue-900/40 to-navy-dark';
    
    return (
      <Link 
        to={`/series/${series.id}`}
        className="flex bg-navy-dark/50 rounded-lg overflow-hidden hover:bg-navy-dark transition-colors border border-white/10 hover:border-white/20 group mb-4 shadow-md hover:shadow-lg"
      >
        <div className={`w-[180px] aspect-square relative overflow-hidden flex-shrink-0 ${imageError ? placeholderStyle : ''}`}>
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
        <div className="p-5 flex-grow flex flex-col justify-between">
          <div>
            <h5 className="text-xl font-semibold text-white mb-3 line-clamp-1">{series.title}</h5>
            <p className="text-sm text-white/80 mb-3 line-clamp-2 italic">
              {series.logline || series.description}
            </p>
          </div>
          <div>
            {series.paperRange && (
              <div className="text-xs text-white/50 mb-3">
                {series.totalEpisodes} Episodes
              </div>
            )}
            <div className="flex items-center text-gold text-sm font-medium group-hover:translate-x-1 transition-transform">
              View Episodes
              <ChevronRight size={14} className="ml-1" />
            </div>
          </div>
        </div>
      </Link>
    );
  };

  // Section component with toggle
  const Section = ({ 
    id, 
    title, 
    description, 
    series, 
    color,
    bgColor,
    iconPath
  }: { 
    id: string;
    title: string; 
    description: string; 
    series: SeriesInfo[];
    color: string;
    bgColor: string;
    iconPath?: string;
  }) => (
    <div className={`${bgColor} rounded-lg overflow-hidden mb-8 shadow-lg border border-white/5`}>
      <button 
        className="w-full text-left p-6 flex justify-between items-start"
        onClick={() => toggleSection(id)}
      >
        <div className="flex items-start">
          <div className="mr-4 flex-shrink-0 mt-1">
            {iconPath && !iconErrors[id] ? (
              <img 
                src={iconPath} 
                alt="" 
                className="w-12 h-12 opacity-70" 
                onError={() => handleIconError(id)}
              />
            ) : (
              <div className="flex items-center justify-center">
                {getSectionIcon(id)}
              </div>
            )}
          </div>
          <div>
            <h2 className={`title-main text-2xl md:text-3xl mb-2 ${color}`}>
              {title}
            </h2>
            <p className="text-white/70 max-w-3xl">
              {description}
            </p>
            <div className="mt-2 text-sm text-white/50">
              {series.length} series • {series.length * 5} episodes
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          {expandedSections[id] ? (
            <ChevronUp className="text-white/70" size={24} />
          ) : (
            <ChevronDown className="text-white/70" size={24} />
          )}
        </div>
      </button>
      
      {expandedSections[id] && (
        <div className="p-6 pt-0 border-t border-white/10">
          {series.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              No series found matching your search criteria
            </div>
          ) : (
            <div className="flex flex-col space-y-5">
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
    <Layout>
      <main className="min-h-screen bg-navy-dark">
        {/* Hero Section */}
        <section className="bg-navy-dark pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="title-main text-4xl md:text-5xl lg:text-6xl mb-6 text-white">
                Series Collections
              </h1>
              <p className="section-subtitle text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Explore our carefully curated series on different aspects of The Urantia Book's teachings.
                Each series contains 5 episodes delving into specific topics.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-xl mx-auto mb-8 relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search series by title or description..."
                    className="w-full py-3 px-5 pr-12 bg-navy-light/30 border border-white/10 rounded-full text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-gold/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                </div>
              </div>
              
              {/* View Toggle */}
              <div className="flex justify-center mb-4">
                <div className="inline-flex bg-navy-light/30 rounded-lg p-1">
                  <button 
                    className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'structured' ? 'bg-primary text-white' : 'text-white/70 hover:text-white'}`}
                    onClick={() => setViewMode('structured')}
                  >
                    Structured View
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-white/70 hover:text-white'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    Grid View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Content Section */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            {viewMode === 'grid' ? (
              <SeriesCardGrid />
            ) : (
              <div className="max-w-5xl mx-auto">
                <Section 
                  id="jesus"
                  title="The Life and Teachings of Jesus" 
                  description="Explore the complete life story and teachings of Jesus as revealed in the Urantia Book, from his birth through resurrection, with insights beyond traditional Biblical accounts."
                  series={getJesusSeries()}
                  color="text-rose-400"
                  bgColor="bg-navy-dark"
                  iconPath="/images/icons/jesus-icon.png"
                />
                
                <Section 
                  id="revelation"
                  title="The Fifth Epochal Revelation" 
                  description="Discover the cosmic teachings from the first three parts of The Urantia Book, covering everything from the nature of God to universe structure and Earth's planetary history."
                  series={getRevelationSeries()}
                  color="text-blue-400"
                  bgColor="bg-navy-dark"
                  iconPath="/images/icons/universe-icon.png"
                />
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 bg-navy-light/20 rounded-lg mt-8">
          <div className="px-6">
            <h2 className="title-main text-2xl md:text-3xl mb-6 text-gold text-center">
              About These Series
            </h2>
            <div className="prose prose-lg prose-invert mx-auto">
              <p className="text-center mb-8">
                Both collections contain series with 5 episodes each, designed to provide structured 
                pathways to explore The Urantia Book's profound teachings.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-navy-dark/50 p-6 rounded-lg">
                  <h3 className="text-rose-400 text-xl mb-3">The Life and Teachings of Jesus</h3>
                  <p className="text-white/80 text-sm">
                    Fourteen series exploring aspects of Jesus' life, teachings, and significance as revealed 
                    in the Urantia Book. These series offer comparative understanding between traditional religious 
                    concepts and the expanded Urantia perspective.
                  </p>
                </div>
                
                <div className="bg-navy-dark/50 p-6 rounded-lg">
                  <h3 className="text-blue-400 text-xl mb-3">The Fifth Epochal Revelation</h3>
                  <p className="text-white/80 text-sm">
                    Fourteen series exploring the cosmic teachings from Parts I-III, designed for newcomers 
                    to understand universal aspects of the Urantia revelation including divine personalities, 
                    celestial beings, universe structure, and Earth's unique history.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
} 