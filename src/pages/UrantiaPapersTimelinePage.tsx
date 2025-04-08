import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Play, Download, ChevronRight, ChevronLeft } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { getUrantiaPapers, getUrantiaPaperPart } from '../data/episodes';
import { Episode } from '../types/index';

// Define the parts of the Urantia Book
const URANTIA_PARTS = [
  { id: 1, title: "The Central and Superuniverses", papers: [1, 31], color: "bg-blue-500/20", textColor: "text-blue-400" },
  { id: 2, title: "The Local Universe", papers: [32, 56], color: "bg-green-500/20", textColor: "text-green-400" },
  { id: 3, title: "The History of Urantia", papers: [57, 119], color: "bg-amber-500/20", textColor: "text-amber-400" },
  { id: 4, title: "The Life and Teachings of Jesus", papers: [120, 196], color: "bg-rose-500/20", textColor: "text-rose-400" }
];

export default function UrantiaPapersTimelinePage() {
  const [papers, setPapers] = useState<Episode[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredPapers, setFilteredPapers] = useState<Episode[]>([]);
  const [activePart, setActivePart] = useState<number>(1);
  const [selectedPaper, setSelectedPaper] = useState<Episode | null>(null);
  const [timelinePosition, setTimelinePosition] = useState(0);
  
  // Load papers on component mount
  useEffect(() => {
    const allPapers = getUrantiaPapers();
    setPapers(allPapers);
    setFilteredPapers(allPapers.filter(paper => getUrantiaPaperPart(paper.id) === activePart));
    
    // Set first paper as selected by default
    if (allPapers.length > 0) {
      const firstPaperInActivePart = allPapers.find(paper => getUrantiaPaperPart(paper.id) === activePart);
      if (firstPaperInActivePart) {
        setSelectedPaper(firstPaperInActivePart);
      }
    }
  }, []);
  
  // Filter papers when active part changes
  useEffect(() => {
    let filtered = papers;
    
    // Filter by part
    filtered = filtered.filter(paper => getUrantiaPaperPart(paper.id) === activePart);
    
    // Filter by search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(paper => 
        paper.title.toLowerCase().includes(query) || 
        (paper.description && paper.description.toLowerCase().includes(query)) ||
        paper.id.toString() === query
      );
    }
    
    setFilteredPapers(filtered);
    
    // Update selected paper when changing parts
    if (filtered.length > 0 && (!selectedPaper || getUrantiaPaperPart(selectedPaper.id) !== activePart)) {
      setSelectedPaper(filtered[0]);
    }
    
    // Reset timeline position
    setTimelinePosition(0);
  }, [activePart, searchQuery, papers]);
  
  // Get part color
  const getPartColor = (partId: number) => {
    const part = URANTIA_PARTS.find(p => p.id === partId);
    return part ? part.color : "bg-gray-500/20";
  };
  
  const getPartTextColor = (partId: number) => {
    const part = URANTIA_PARTS.find(p => p.id === partId);
    return part ? part.textColor : "text-gray-400";
  };
  
  // Timeline navigation
  const moveTimeline = (direction: 'left' | 'right') => {
    const maxPosition = Math.max(0, filteredPapers.length - 5);
    if (direction === 'left') {
      setTimelinePosition(Math.max(0, timelinePosition - 1));
    } else {
      setTimelinePosition(Math.min(maxPosition, timelinePosition + 1));
    }
  };
  
  // Select a paper from the timeline
  const handlePaperSelect = (paper: Episode) => {
    setSelectedPaper(paper);
  };
  
  // Change active part
  const handlePartChange = (partId: number) => {
    setActivePart(partId);
  };

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
          <h1 className="title-main text-xl md:text-2xl lg:text-3xl mb-4">The Urantia Papers</h1>
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
        </motion.div>
        
        {/* Part Navigation Tabs */}
        <div className="flex mb-8 overflow-x-auto scrollbar-hide">
          {URANTIA_PARTS.map(part => (
            <button
              key={part.id}
              className={`px-4 py-3 whitespace-nowrap ${
                activePart === part.id 
                  ? 'border-b-2 border-primary text-white font-medium' 
                  : 'border-b border-white/10 text-white/60 hover:text-white/80'
              } transition-colors`}
              onClick={() => handlePartChange(part.id)}
            >
              Part {part.id}: {part.title}
            </button>
          ))}
        </div>
        
        {/* Timeline Navigation */}
        <div className="mb-8 relative">
          <div className="flex items-center">
            <button 
              className="p-2 bg-navy-light/50 rounded-full text-white/70 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => moveTimeline('left')}
              disabled={timelinePosition === 0}
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex-1 overflow-hidden mx-2">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${timelinePosition * 100}px)` }}
              >
                {filteredPapers.map(paper => (
                  <div 
                    key={paper.id}
                    className={`w-24 h-24 flex-shrink-0 mx-1 rounded-lg ${
                      selectedPaper?.id === paper.id 
                        ? 'border-2 border-primary' 
                        : 'border border-white/10'
                    } ${getPartColor(getUrantiaPaperPart(paper.id))} flex flex-col items-center justify-center cursor-pointer transition-all hover:border-primary/50`}
                    onClick={() => handlePaperSelect(paper)}
                  >
                    <span className={`text-lg font-bold ${getPartTextColor(getUrantiaPaperPart(paper.id))}`}>{paper.id}</span>
                    <span className="text-xs text-white/70 text-center px-1 truncate w-full">
                      {paper.title.replace(/^Paper \d+: /, '')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              className="p-2 bg-navy-light/50 rounded-full text-white/70 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => moveTimeline('right')}
              disabled={timelinePosition >= filteredPapers.length - 5}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          {/* Timeline Track */}
          <div className="h-1 bg-navy-light/50 mt-4 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all"
              style={{ 
                width: `${(selectedPaper ? filteredPapers.findIndex(p => p.id === selectedPaper.id) : 0) / Math.max(1, filteredPapers.length - 1) * 100}%` 
              }}
            ></div>
          </div>
        </div>
        
        {/* Selected Paper Details */}
        {selectedPaper && (
          <motion.div 
            className="bg-navy-light/30 rounded-xl border border-white/10 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            key={selectedPaper.id}
          >
            <div className={`p-1 ${getPartColor(getUrantiaPaperPart(selectedPaper.id))}`}></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center">
                    <span className="text-primary text-2xl font-bold mr-3">{selectedPaper.id}</span>
                    <h2 className="text-2xl font-semibold text-white">{selectedPaper.title}</h2>
                  </div>
                  <p className="text-white/70 mt-2">{selectedPaper.description}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-6">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                  <Play size={18} />
                  <span>Listen Now</span>
                </button>
                
                {selectedPaper.pdfUrl && (
                  <a
                    href={selectedPaper.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-navy-light/70 text-white/90 rounded-md hover:bg-navy transition-colors"
                  >
                    <BookOpen size={18} />
                    <span>Read PDF</span>
                  </a>
                )}
                
                <a
                  href={selectedPaper.audioUrl}
                  download
                  className="flex items-center gap-2 px-4 py-2 bg-navy-light/70 text-white/90 rounded-md hover:bg-navy transition-colors"
                >
                  <Download size={18} />
                  <span>Download Audio</span>
                </a>
              </div>
              
              {/* Paper Navigation */}
              <div className="flex justify-between mt-8 pt-4 border-t border-white/10">
                {filteredPapers.findIndex(p => p.id === selectedPaper.id) > 0 ? (
                  <button 
                    className="flex items-center text-white/70 hover:text-white"
                    onClick={() => {
                      const currentIndex = filteredPapers.findIndex(p => p.id === selectedPaper.id);
                      if (currentIndex > 0) {
                        handlePaperSelect(filteredPapers[currentIndex - 1]);
                      }
                    }}
                  >
                    <ChevronLeft size={20} className="mr-1" />
                    <span>Previous Paper</span>
                  </button>
                ) : (
                  <div></div>
                )}
                
                {filteredPapers.findIndex(p => p.id === selectedPaper.id) < filteredPapers.length - 1 && (
                  <button 
                    className="flex items-center text-white/70 hover:text-white"
                    onClick={() => {
                      const currentIndex = filteredPapers.findIndex(p => p.id === selectedPaper.id);
                      if (currentIndex < filteredPapers.length - 1) {
                        handlePaperSelect(filteredPapers[currentIndex + 1]);
                      }
                    }}
                  >
                    <span>Next Paper</span>
                    <ChevronRight size={20} className="ml-1" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
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