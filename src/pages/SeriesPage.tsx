import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import SeriesCardGrid from '../components/ui/SeriesCardGrid';
import SeriesContent from '../components/series/SeriesContent';
import { getSeriesByCategory, getAllSeries, SeriesInfo } from '../utils/seriesUtils';
import { Search, Users, Globe } from 'lucide-react';

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
  
  // Filter series by part
  const getJesusSeries = (): SeriesInfo[] => {
    // Get Jesus-related series (Part IV, papers 120-196)
    return getAllSeries().filter(series => {
      // Only include Jesus-focused series
      if (series.category !== 'jesus-focused') return false;
      
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
      // Only include parts-i-iii series
      if (series.category !== 'parts-i-iii') return false;
      
      // Filter by search query if any
      if (searchQuery) {
        return series.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               series.description.toLowerCase().includes(searchQuery.toLowerCase());
      }
      
      return true;
    });
  };

  return (
    <Layout>
      <main className="min-h-screen bg-navy-dark">
        {/* Hero Section */}
        <section className="bg-navy-dark pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center mb-12">
              <h1 className="title-main text-4xl md:text-5xl lg:text-6xl mb-6 text-white">
                Series Collections
              </h1>
              <p className="section-subtitle text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                Our carefully curated series provide structured pathways to explore 
                The Urantia Book's profound teachings. Each series contains 5 episodes 
                delving into specific topics.
              </p>
            </div>
            
            {/* About Series Boxes */}
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-rose-900/30 to-navy-dark p-8 rounded-xl border border-white/10 shadow-lg transform transition hover:translate-y-[-5px]">
                <div className="flex items-center mb-4">
                  <Users className="w-10 h-10 text-rose-400/70 mr-4 flex-shrink-0" />
                  <h3 className="text-rose-400 text-2xl font-bold">The Life and Teachings of Jesus</h3>
                </div>
                <p className="text-white/80">
                  Fourteen series exploring aspects of Jesus' life, teachings, and significance as revealed 
                  in the Urantia Book. These series offer comparative understanding between traditional religious 
                  concepts and the expanded Urantia perspective.
                </p>
                <div className="mt-4 text-sm text-white/60 font-semibold">
                  14 series • 70 episodes
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/30 to-navy-dark p-8 rounded-xl border border-white/10 shadow-lg transform transition hover:translate-y-[-5px]">
                <div className="flex items-center mb-4">
                  <Globe className="w-10 h-10 text-blue-400/70 mr-4 flex-shrink-0" />
                  <h3 className="text-blue-400 text-2xl font-bold">Cosmic Series</h3>
                </div>
                <p className="text-white/80">
                  Fourteen series exploring the cosmic teachings from Parts I-III, designed for newcomers 
                  to understand universal aspects of the Urantia revelation including divine personalities, 
                  celestial beings, universe structure, and Earth's unique history.
                </p>
                <div className="mt-4 text-sm text-white/60 font-semibold">
                  14 series • 70 episodes
                </div>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto mt-12 relative">
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
            <div className="flex justify-center mt-6">
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
        </section>
        
        {/* Content Section */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            {/* Separator */}
            <div className="max-w-5xl mx-auto mb-12">
              <div className="border-t border-white/10 pt-8"></div>
            </div>
          
            {viewMode === 'grid' ? (
              <SeriesCardGrid />
            ) : (
              <SeriesContent 
                jesusSeries={getJesusSeries()}
                cosmicSeries={getRevelationSeries()}
                searchQuery={searchQuery}
              />
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
} 