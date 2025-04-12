import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import SeriesCardGrid from '../components/ui/SeriesCardGrid';
import { getAllSeries, SeriesInfo } from '../utils/seriesUtils';
import { Search, Users, Globe, BookOpen, GridIcon, ListIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SeriesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'structured'>('structured');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Get all series
  const allSeries = getAllSeries();
  
  // Count series by category
  const jesusSeriesCount = allSeries.filter(s => s.category === 'jesus-focused').length;
  const cosmicSeriesCount = allSeries.filter(s => s.category === 'parts-i-iii').length;
  
  // Filter series based on search and category
  const filteredSeries = allSeries.filter(series => {
    // Filter by category if selected
    if (activeCategory && activeCategory !== 'all') {
      if (activeCategory === 'jesus' && series.category !== 'jesus-focused') return false;
      if (activeCategory === 'cosmic' && series.category !== 'parts-i-iii') return false;
    }
    
    // Filter by search query if any
    if (searchQuery) {
      return series.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             series.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });
  
  // Group by category for structured view
  const jesusSeries = filteredSeries.filter(s => s.category === 'jesus-focused');
  const cosmicSeries = filteredSeries.filter(s => s.category === 'parts-i-iii');
  
  // Featured series - first from each category
  const featuredSeries = [
    allSeries.find(s => s.category === 'jesus-focused'),
    allSeries.find(s => s.category === 'parts-i-iii')
  ].filter(Boolean) as SeriesInfo[];

  return (
    <Layout>
      <main className="min-h-screen bg-navy-dark">
        {/* Enhanced Hero Section with Value Proposition */}
        <section className="bg-navy-dark pt-24 pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="title-main text-4xl md:text-5xl lg:text-6xl mb-4 text-white">
                Discover Life-Changing Cosmic Wisdom
              </h1>
              <p className="section-subtitle text-xl text-white/90 max-w-2xl mx-auto mb-4">
                Immerse yourself in the Urantia Book's profound teachings through {allSeries.length} expertly narrated audio series
              </p>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                From the life of Jesus to cosmic origins, each series transforms complex concepts into accessible insights for spiritual growth
              </p>
            </div>
          </div>
        </section>
        
        {/* Featured Series - Enhanced Start Here Section */}
        <section className="pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-3">Begin Your Cosmic Journey</h2>
                <p className="text-white/70 max-w-xl mx-auto">
                  Our most popular series offer perfect entry points to understanding the Urantia Book's transformative teachings:
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {featuredSeries.map(series => (
                  <Link 
                    key={series.id}
                    to={`/series/${series.id}`} 
                    className="block bg-navy-light/30 rounded-xl overflow-hidden border border-white/10 transition-all hover:scale-[1.02] hover:border-primary/30"
                  >
                    <div className="p-6">
                      <div className="bg-primary/70 text-white text-xs px-2 py-1 rounded inline-block mb-3">
                        Fan Favorite
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{series.title}</h3>
                      <p className="text-white/70 text-sm mb-3 line-clamp-2">{series.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-white/50 text-xs">5 episodes • ~1 hour total</span>
                        <span className="text-primary text-sm">Start your journey →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Main Content Section with integrated controls */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Section Heading */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Explore All Series Collections</h2>
                <p className="text-white/70 max-w-xl mx-auto">
                  Browse our complete library of audio teachings or search for specific topics
                </p>
              </div>
            
              {/* Content Controls - Directly above the content they affect */}
              <div className="bg-navy-light/20 rounded-t-xl border-t border-x border-white/10 p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  {/* Category Pills */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      className={`px-3 py-1.5 rounded-md text-sm ${activeCategory === null ? 'bg-primary text-white' : 'bg-navy-light/30 text-white/70 hover:bg-navy-light/50'}`}
                      onClick={() => setActiveCategory(null)}
                    >
                      All Series ({allSeries.length})
                    </button>
                    <button
                      className={`flex items-center px-3 py-1.5 rounded-md text-sm ${activeCategory === 'jesus' ? 'bg-primary text-white' : 'bg-navy-light/30 text-white/70 hover:bg-navy-light/50'}`}
                      onClick={() => setActiveCategory(activeCategory === 'jesus' ? null : 'jesus')}
                    >
                      <Users className="w-3.5 h-3.5 mr-1.5" />
                      Jesus ({jesusSeriesCount})
                    </button>
                    <button
                      className={`flex items-center px-3 py-1.5 rounded-md text-sm ${activeCategory === 'cosmic' ? 'bg-primary text-white' : 'bg-navy-light/30 text-white/70 hover:bg-navy-light/50'}`}
                      onClick={() => setActiveCategory(activeCategory === 'cosmic' ? null : 'cosmic')}
                    >
                      <Globe className="w-3.5 h-3.5 mr-1.5" />
                      Cosmic ({cosmicSeriesCount})
                    </button>
                  </div>
                  
                  {/* View Toggle */}
                  <div className="flex gap-2">
                    <button
                      className={`p-1.5 rounded ${viewMode === 'structured' ? 'bg-primary text-white' : 'bg-navy-light/30 text-white/70'}`}
                      onClick={() => setViewMode('structured')}
                      aria-label="Structured View"
                      title="Structured View"
                    >
                      <ListIcon size={18} />
                    </button>
                    <button
                      className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-navy-light/30 text-white/70'}`}
                      onClick={() => setViewMode('grid')}
                      aria-label="Grid View"
                      title="Grid View"
                    >
                      <GridIcon size={18} />
                    </button>
                  </div>
                </div>
                
                {/* Search - Right above results */}
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={16} />
                    <input
                      type="text"
                      placeholder="Search series by title or description..."
                      className="w-full py-2 pl-10 pr-4 bg-navy-light/30 border border-white/10 rounded-md text-white placeholder:text-white/50 text-sm focus:outline-none focus:border-primary/50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {searchQuery && (
                    <div className="mt-2 text-sm text-white/70">
                      Found {filteredSeries.length} results for "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
              
              {/* Series Content */}
              <div className="bg-navy-dark border-x border-b border-white/10 rounded-b-xl p-4">
                {filteredSeries.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-white/70">No series found matching your search. Try adjusting your filters.</p>
                    <button 
                      className="mt-4 text-primary hover:text-primary-light"
                      onClick={() => {setSearchQuery(''); setActiveCategory(null);}}
                    >
                      Clear filters
                    </button>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="space-y-8">
                    {jesusSeries.length > 0 && (
                      <div>
                        <div className="flex items-center mb-4">
                          <Users className="w-5 h-5 text-rose-400/70 mr-2" />
                          <h2 className="text-xl font-bold text-rose-400">The Life and Teachings of Jesus</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                          {jesusSeries.map(series => (
                            <Link 
                              key={series.id}
                              to={`/series/${series.id}`}
                              className="block bg-navy-light/20 rounded-lg overflow-hidden border border-white/10 transition-all hover:scale-[1.02] hover:border-primary/30 hover:shadow-lg"
                            >
                              <div className="p-4 sm:p-5">
                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{series.title}</h3>
                                <p className="text-white/70 text-sm mb-3 line-clamp-2">{series.description}</p>
                                <div className="flex items-center text-white/50 text-xs">
                                  <span>{series.totalEpisodes || 5} episodes</span>
                                  <span className="mx-1.5">•</span>
                                  <span>~1 hour</span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {cosmicSeries.length > 0 && (
                      <div>
                        <div className="flex items-center mb-4">
                          <Globe className="w-5 h-5 text-blue-400/70 mr-2" />
                          <h2 className="text-xl font-bold text-blue-400">Cosmic Series</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                          {cosmicSeries.map(series => (
                            <Link 
                              key={series.id}
                              to={`/series/${series.id}`}
                              className="block bg-navy-light/20 rounded-lg overflow-hidden border border-white/10 transition-all hover:scale-[1.02] hover:border-primary/30 hover:shadow-lg"
                            >
                              <div className="p-4 sm:p-5">
                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{series.title}</h3>
                                <p className="text-white/70 text-sm mb-3 line-clamp-2">{series.description}</p>
                                <div className="flex items-center text-white/50 text-xs">
                                  <span>{series.totalEpisodes || 5} episodes</span>
                                  <span className="mx-1.5">•</span>
                                  <span>~1 hour</span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {jesusSeries.length > 0 && (
                      <div>
                        <div className="flex items-center mb-4">
                          <Users className="w-5 h-5 text-rose-400/70 mr-2" />
                          <h2 className="text-xl font-bold text-rose-400">The Life and Teachings of Jesus</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {jesusSeries.map(series => (
                            <Link 
                              key={series.id}
                              to={`/series/${series.id}`}
                              className="block bg-navy-light/20 rounded-lg overflow-hidden border border-white/10 transition-all hover:scale-[1.02] hover:border-primary/30 hover:shadow-lg"
                            >
                              <div className="p-4 sm:p-5">
                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{series.title}</h3>
                                <p className="text-white/70 text-sm mb-3 line-clamp-2">{series.description}</p>
                                <div className="flex items-center text-white/50 text-xs">
                                  <span>{series.totalEpisodes || 5} episodes</span>
                                  <span className="mx-1.5">•</span>
                                  <span>~1 hour</span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {cosmicSeries.length > 0 && (
                      <div>
                        <div className="flex items-center mb-4">
                          <Globe className="w-5 h-5 text-blue-400/70 mr-2" />
                          <h2 className="text-xl font-bold text-blue-400">Cosmic Series</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {cosmicSeries.map(series => (
                            <Link 
                              key={series.id}
                              to={`/series/${series.id}`}
                              className="block bg-navy-light/20 rounded-lg overflow-hidden border border-white/10 transition-all hover:scale-[1.02] hover:border-primary/30 hover:shadow-lg"
                            >
                              <div className="p-4 sm:p-5">
                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{series.title}</h3>
                                <p className="text-white/70 text-sm mb-3 line-clamp-2">{series.description}</p>
                                <div className="flex items-center text-white/50 text-xs">
                                  <span>{series.totalEpisodes || 5} episodes</span>
                                  <span className="mx-1.5">•</span>
                                  <span>~1 hour</span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
} 