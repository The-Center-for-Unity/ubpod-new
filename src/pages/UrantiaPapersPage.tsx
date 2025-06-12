import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Book, Headphones, Download, ChevronDown, ChevronUp, Play, Pause, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Episode } from '../types/index';
import { getEpisodesForSeries, getUrantiaPaperPart } from '../utils/episodeUtils';
import Layout from '../components/layout/Layout';
import { LocalizedLink } from '../components/shared/LocalizedLink';
import { useLanguage } from '../i18n/LanguageContext';

// Paper Card Component
interface PaperCardProps {
  paper: Episode;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper }) => {
  const { t } = useTranslation('series');
  // Get part color based on paper ID
  const getPartColor = (paperId: number) => {
    const part = getUrantiaPaperPart(paperId);
    switch (part) {
      case 1: return 'border-blue-500/30';
      case 2: return 'border-green-500/30';
      case 3: return 'border-amber-500/30';
      case 4: return 'border-rose-500/30';
      default: return 'border-gray-500/30';
    }
  };

  // Determine which summary to display, with fallbacks
  const displaySummary = paper.cardSummary || paper.summary || paper.description || '';

  // Debug: Log summary info for the first few papers
  if (paper.id < 5) {
    console.log(`PaperCard ${paper.id} (${paper.title}):`, { 
      hasCardSummary: !!paper.cardSummary, 
      hasSummary: !!paper.summary,
      willDisplaySummary: !!displaySummary,
      displaySource: paper.cardSummary ? 'cardSummary' : (paper.summary ? 'summary' : 'description')
    });
  }

  return (
    <motion.div
      className={`bg-navy-light/30 rounded-lg overflow-hidden border ${getPartColor(paper.id)} hover:border-primary/30 transition-all`}
      whileHover={{ y: -5, boxShadow: '0 10px 30px -15px rgba(0, 174, 239, 0.2)' }}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className="text-primary font-bold">{paper.id}</span>
          <span className="text-xs text-white/50">{t('part_label', { id: getUrantiaPaperPart(paper.id) })}</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-white">{paper.title}</h3>
        <p className="text-white/70 text-sm mb-4 line-clamp-2">{displaySummary}</p>
        
        <div className="flex space-x-3 mt-auto">
          <LocalizedLink
            to={`/series/urantia-papers/${paper.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm"
          >
            <Play size={14} />
            <span>{t('listen_button')}</span>
          </LocalizedLink>
          
          {paper.pdfUrl && (
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-light text-white/80 rounded-md hover:bg-navy transition-colors text-sm"
            >
              <BookOpen size={14} />
              <span>{t('read_button')}</span>
            </a>
          )}
          
          <a
            href={paper.audioUrl}
            download
            className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-light text-white/80 rounded-md hover:bg-navy transition-colors text-sm"
          >
            <Download size={14} />
            <span>{t('download_button')}</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

// Main Page Component
export default function UrantiaPapersPage() {
  const { t } = useTranslation('series');
  const { language } = useLanguage();

  const URANTIA_PARTS = [
    { id: 0, title: t("foreword_title"), papers: [0, 0], color: "from-purple-500/20" },
    { id: 1, title: t("part_1_title"), papers: [1, 31], color: "from-blue-500/20" },
    { id: 2, title: t("part_2_title"), papers: [32, 56], color: "from-green-500/20" },
    { id: 3, title: t("part_3_title"), papers: [57, 119], color: "from-amber-500/20" },
    { id: 4, title: t("part_4_title"), papers: [120, 196], color: "from-rose-500/20" }
  ];

  const [papers, setPapers] = useState<Episode[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredPapers, setFilteredPapers] = useState<Episode[]>([]);
  const [expandedParts, setExpandedParts] = useState<number[]>([0, 1]); // Start with Foreword and Part 1 expanded
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Load papers on component mount
  useEffect(() => {
    const allPapers = getEpisodesForSeries('urantia-papers');
    if (language === 'en') {
      setPapers(allPapers);
      setFilteredPapers(allPapers);
    } else {
      const translatedPapers = allPapers.map((paper: Episode) => {
        const translation = paper.translations?.[language];
        if (translation) {
          return {
            ...paper,
            title: translation.title || paper.title,
            description: translation.description || paper.description,
            summary: translation.summary || paper.summary,
            cardSummary: translation.cardSummary || paper.cardSummary,
          };
        }
        return paper;
      });
      setPapers(translatedPapers);
      setFilteredPapers(translatedPapers);
    }
  }, [language]);
  
  // Filter papers when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPapers(papers);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = papers.filter(paper => 
      paper.title.toLowerCase().includes(query) || 
      (paper.description && paper.description.toLowerCase().includes(query)) ||
      paper.id.toString() === query
    );
    
    setFilteredPapers(filtered);
  }, [searchQuery, papers]);
  
  // Toggle part expansion
  const togglePartExpansion = (partId: number) => {
    if (expandedParts.includes(partId)) {
      setExpandedParts(expandedParts.filter(id => id !== partId));
    } else {
      setExpandedParts([...expandedParts, partId]);
    }
  };
  
  // Get papers for a specific part
  const getPapersForPart = (partId: number) => {
    return filteredPapers.filter(paper => getUrantiaPaperPart(paper.id) === partId);
  };
  
  // Check if search is active
  const isSearchActive = searchQuery.trim() !== '';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div 
          className="rounded-xl p-8 mb-8 bg-gradient-to-r from-blue-500/20 to-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="title-main text-xl md:text-2xl lg:text-3xl mb-4">{t('title')}</h1>
          <p className="body-lg max-w-3xl">
            {t('description')}
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mt-6">
            <input
              type="text"
              placeholder={t('search_placeholder')}
              className="w-full pl-10 pr-4 py-2 bg-navy-light/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-white/50" size={18} />
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex mt-4 space-x-2">
            <button 
              className={`px-3 py-1 rounded text-sm ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-navy-light/50 text-white/70'}`}
              onClick={() => setViewMode('grid')}
            >
              {t('grid_view')}
            </button>
            <button 
              className={`px-3 py-1 rounded text-sm ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-navy-light/50 text-white/70'}`}
              onClick={() => setViewMode('list')}
            >
              {t('list_view')}
            </button>
          </div>
        </motion.div>
        
        {/* Search Results Count */}
        {isSearchActive && (
          <div className="mb-6 text-white/70">
            {t('search_results', { count: filteredPapers.length, query: searchQuery })}
            <button 
              className="ml-2 text-primary hover:underline"
              onClick={() => setSearchQuery('')}
            >
              {t('clear_search')}
            </button>
          </div>
        )}
        
        {/* Papers by Part */}
        {!isSearchActive ? (
          // Organized by parts when not searching
          URANTIA_PARTS.map(part => (
            <div key={part.id} className="mb-8">
              {/* Part Header */}
              <div 
                className={`flex justify-between items-center p-4 rounded-lg bg-gradient-to-r ${part.color} to-transparent cursor-pointer mb-4`}
                onClick={() => togglePartExpansion(part.id)}
              >
                <h2 className="text-xl font-semibold text-white">
                  {part.id === 0 ? part.title : t('part_header', { id: part.id, title: part.title })}
                </h2>
                <button className="text-white/80 hover:text-white">
                  {expandedParts.includes(part.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              
              {/* Papers Grid/List */}
              {expandedParts.includes(part.id) && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}
                >
                  {getPapersForPart(part.id).map(paper => (
                    viewMode === 'grid' ? (
                      <PaperCard key={paper.id} paper={paper} />
                    ) : (
                      <PaperListItem key={paper.id} paper={paper} />
                    )
                  ))}
                </motion.div>
              )}
            </div>
          ))
        ) : (
          // Flat list when searching
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
            {filteredPapers.map(paper => (
              viewMode === 'grid' ? (
                <PaperCard key={paper.id} paper={paper} />
              ) : (
                <PaperListItem key={paper.id} paper={paper} />
              )
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {filteredPapers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-white/70">No papers found matching your search.</p>
            <button 
              className="mt-4 text-primary hover:underline"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

// Paper List Item Component
const PaperListItem: React.FC<PaperCardProps> = ({ paper }) => {
  const { t } = useTranslation('series');
  const displaySummary = paper.summary || paper.description || '';

  return (
    <LocalizedLink to={`/series/urantia-papers/${paper.id}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 bg-navy-light/30 rounded-lg border border-transparent hover:border-primary/30 transition-all flex items-center justify-between"
      >
        <div className="flex-grow">
          <div className="flex items-center gap-4">
            <span className="text-primary font-bold text-lg">{paper.id}</span>
            <h3 className="text-md font-semibold text-white">{paper.title}</h3>
          </div>
          <p className="text-white/70 text-sm mt-1 ml-9">{displaySummary}</p>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
          <LocalizedLink
            to={`/series/urantia-papers/${paper.id}`}
            className="p-2 bg-navy-light rounded-md hover:bg-navy transition-colors"
            title={t('listen_button')}
          >
            <Headphones size={18} className="text-white" />
          </LocalizedLink>
          {paper.pdfUrl && (
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-navy-light rounded-md hover:bg-navy transition-colors"
              title={t('read_button')}
            >
              <BookOpen size={18} className="text-white" />
            </a>
          )}
          <a
            href={paper.audioUrl}
            download
            className="p-2 bg-navy-light rounded-md hover:bg-navy transition-colors"
            title={t('download_button')}
          >
            <Download size={18} className="text-white" />
          </a>
        </div>
      </motion.div>
    </LocalizedLink>
  );
}; 