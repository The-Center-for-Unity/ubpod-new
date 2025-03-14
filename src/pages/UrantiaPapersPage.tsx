import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Book, Headphones, Download, ChevronDown, ChevronUp, Play, Pause, BookOpen } from 'lucide-react';
import { Episode } from '../types/index';
import { getUrantiaPapers, getUrantiaPaperPart } from '../data/episodes';
import Layout from '../components/layout/Layout';

// Define the parts of the Urantia Book
const URANTIA_PARTS = [
  { id: 1, title: "The Central and Superuniverses", papers: [1, 31], color: "from-blue-500/20" },
  { id: 2, title: "The Local Universe", papers: [32, 56], color: "from-green-500/20" },
  { id: 3, title: "The History of Urantia", papers: [57, 119], color: "from-amber-500/20" },
  { id: 4, title: "The Life and Teachings of Jesus", papers: [120, 196], color: "from-rose-500/20" }
];

// Paper Card Component
interface PaperCardProps {
  paper: Episode;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper }) => {
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

  return (
    <motion.div
      className={`bg-navy-light/30 rounded-lg overflow-hidden border ${getPartColor(paper.id)} hover:border-primary/30 transition-all`}
      whileHover={{ y: -5, boxShadow: '0 10px 30px -15px rgba(0, 174, 239, 0.2)' }}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className="text-primary font-bold">{paper.id}</span>
          <span className="text-xs text-white/50">Part {getUrantiaPaperPart(paper.id)}</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-white">{paper.title}</h3>
        <p className="text-white/70 text-sm mb-4 line-clamp-2">{paper.description}</p>
        
        <div className="flex space-x-3 mt-auto">
          <Link
            to={`/episode/${paper.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm"
          >
            <Play size={14} />
            <span>Listen</span>
          </Link>
          
          {paper.pdfUrl && (
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-light text-white/80 rounded-md hover:bg-navy transition-colors text-sm"
            >
              <BookOpen size={14} />
              <span>Read</span>
            </a>
          )}
          
          <a
            href={paper.audioUrl}
            download
            className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-light text-white/80 rounded-md hover:bg-navy transition-colors text-sm"
          >
            <Download size={14} />
            <span>Download</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

// Main Page Component
export default function UrantiaPapersPage() {
  const [papers, setPapers] = useState<Episode[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredPapers, setFilteredPapers] = useState<Episode[]>([]);
  const [expandedParts, setExpandedParts] = useState<number[]>([1]); // Start with Part 1 expanded
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Load papers on component mount
  useEffect(() => {
    const allPapers = getUrantiaPapers();
    setPapers(allPapers);
    setFilteredPapers(allPapers);
  }, []);
  
  // Filter papers when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPapers(papers);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = papers.filter(paper => 
      paper.title.toLowerCase().includes(query) || 
      paper.description.toLowerCase().includes(query) ||
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
          <h1 className="title-main mb-4">The Urantia Papers</h1>
          <p className="body-lg max-w-3xl">
            Explore all 197 papers of the Urantia Book through AI-narrated episodes.
            Listen while reading along with the original text.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mt-6">
            <input
              type="text"
              placeholder="Search papers by title, number, or keyword..."
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
              Grid View
            </button>
            <button 
              className={`px-3 py-1 rounded text-sm ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-navy-light/50 text-white/70'}`}
              onClick={() => setViewMode('list')}
            >
              List View
            </button>
          </div>
        </motion.div>
        
        {/* Search Results Count */}
        {isSearchActive && (
          <div className="mb-6 text-white/70">
            Found {filteredPapers.length} papers matching "{searchQuery}"
            <button 
              className="ml-2 text-primary hover:underline"
              onClick={() => setSearchQuery('')}
            >
              Clear
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
                  Part {part.id}: {part.title}
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
  return (
    <motion.div
      className="bg-navy-light/30 rounded-lg overflow-hidden border border-white/5 hover:border-primary/30 transition-all"
      whileHover={{ x: 5, boxShadow: '0 4px 20px -10px rgba(0, 174, 239, 0.2)' }}
    >
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="text-primary font-bold w-8">{paper.id}</span>
          <div>
            <h3 className="text-white font-medium">{paper.title}</h3>
            <p className="text-white/50 text-sm hidden md:block">{paper.description.substring(0, 60)}...</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Link
            to={`/episode/${paper.id}`}
            className="flex items-center gap-1 px-2 py-1 bg-primary text-white rounded hover:bg-primary-dark transition-colors text-sm"
          >
            <Play size={14} />
            <span className="hidden md:inline">Listen</span>
          </Link>
          
          {paper.pdfUrl && (
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-1 bg-navy-light text-white/80 rounded hover:bg-navy transition-colors text-sm"
            >
              <Book size={14} />
              <span className="hidden md:inline">Read</span>
            </a>
          )}
          
          <a
            href={paper.audioUrl}
            download
            className="flex items-center gap-1 px-2 py-1 bg-navy-light text-white/80 rounded hover:bg-navy transition-colors text-sm"
          >
            <Download size={14} />
            <span className="hidden md:inline">Download</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}; 