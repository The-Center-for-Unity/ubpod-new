import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SeriesType } from '../../types/index';
import { getAllSeries, getSeriesInfo } from '../../utils/seriesUtils';
import { ChevronDown, Users, Globe, LayoutGrid } from 'lucide-react';

interface SeriesNavigationProps {
  currentSeries?: SeriesType;
  hideTitle?: boolean;
}

export default function SeriesNavigation({ currentSeries, hideTitle = false }: SeriesNavigationProps) {
  const allSeries = getAllSeries();
  const currentSeriesInfo = currentSeries ? getSeriesInfo(currentSeries) : null;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'jesus' | 'cosmic'>('all');

  // Filter series based on selected category
  const filteredSeries = allSeries.filter(series => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'jesus') return series.category === 'jesus-focused';
    if (categoryFilter === 'cosmic') return series.category === 'parts-i-iii';
    return true;
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="mb-6">
      {!hideTitle && (
        <h2 className="title-subtitle text-lg tracking-[0.15em] text-gold mb-3">
          PODCAST SERIES
        </h2>
      )}

      {/* Category Filter */}
      <div className="mb-4 flex justify-between bg-navy-light/80 rounded-lg p-1 backdrop-blur-sm border border-white/10">
        <button 
          onClick={() => setCategoryFilter('all')}
          className={`flex-1 flex items-center justify-center py-2 px-1 text-xs sm:text-sm rounded-md transition-colors ${
            categoryFilter === 'all' 
              ? 'bg-navy-dark text-white font-medium' 
              : 'text-white/70 hover:text-white hover:bg-navy-dark/50'
          }`}
        >
          <LayoutGrid className="w-3 h-3 mr-1" />
          All
        </button>
        <button 
          onClick={() => setCategoryFilter('jesus')}
          className={`flex-1 flex items-center justify-center py-2 px-1 text-xs sm:text-sm rounded-md transition-colors ${
            categoryFilter === 'jesus' 
              ? 'bg-navy-dark text-rose-400 font-medium' 
              : 'text-white/70 hover:text-white hover:bg-navy-dark/50'
          }`}
        >
          <Users className="w-3 h-3 mr-1" />
          Jesus
        </button>
        <button 
          onClick={() => setCategoryFilter('cosmic')}
          className={`flex-1 flex items-center justify-center py-2 px-1 text-xs sm:text-sm rounded-md transition-colors ${
            categoryFilter === 'cosmic' 
              ? 'bg-navy-dark text-blue-400 font-medium' 
              : 'text-white/70 hover:text-white hover:bg-navy-dark/50'
          }`}
        >
          <Globe className="w-3 h-3 mr-1" />
          Cosmic
        </button>
      </div>

      {/* Mobile dropdown version */}
      <div className="lg:hidden relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-navy-light/90 backdrop-blur-md p-3 rounded-lg text-white border border-white/20 hover:border-white/30 transition-colors shadow-md"
        >
          <span>{currentSeriesInfo?.title || "Select Series"}</span>
          <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-navy-dark/95 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl z-20 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {filteredSeries.length === 0 ? (
              <div className="py-4 px-4 text-white/70 text-center">
                No series found in this category
              </div>
            ) : (
              filteredSeries.map(series => (
                <Link 
                  key={series.id}
                  to={`/series/${series.id}`}
                  className={`block py-3 px-4 hover:bg-navy-light/70 transition-colors ${
                    currentSeries === series.id 
                      ? 'bg-gold/20 text-white font-medium' 
                      : 'text-white/80 hover:text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    {series.category === 'jesus-focused' ? 
                      <Users className="w-3 h-3 mr-2 text-rose-400/70" /> : 
                      <Globe className="w-3 h-3 mr-2 text-blue-400/70" />
                    }
                    <span>{series.title}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {/* Desktop sidebar version */}
      <div className="hidden lg:block">
        <div className="bg-navy-light/30 border border-white/10 rounded-lg p-2">
          <div className="space-y-1 max-h-[calc(100vh-240px)] overflow-y-auto pr-1 custom-scrollbar">
            {filteredSeries.length === 0 ? (
              <div className="py-4 px-2 text-white/70 text-center">
                No series found in this category
              </div>
            ) : (
              filteredSeries.map(series => (
                <Link 
                  key={series.id}
                  to={`/series/${series.id}`}
                  className={`block py-2 px-3 rounded transition-colors ${
                    currentSeries === series.id 
                      ? 'bg-gold/20 text-white font-medium' 
                      : 'hover:bg-navy-light/70 text-white/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    {series.category === 'jesus-focused' ? 
                      <Users className="w-4 h-4 mr-2 text-rose-400/70" /> : 
                      <Globe className="w-4 h-4 mr-2 text-blue-400/70" />
                    }
                    <span>{series.title}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 