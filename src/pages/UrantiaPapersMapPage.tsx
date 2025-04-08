import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Play, Download, Plus, Minus, Info } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { getUrantiaPapers, getUrantiaPaperPart } from '../data/episodes';
import { Episode } from '../types/index';

// Define the parts of the Urantia Book
const URANTIA_PARTS = [
  { id: 1, title: "The Central and Superuniverses", papers: [1, 31], color: "from-blue-600/30 to-blue-900/30", borderColor: "border-blue-500/50" },
  { id: 2, title: "The Local Universe", papers: [32, 56], color: "from-green-600/30 to-green-900/30", borderColor: "border-green-500/50" },
  { id: 3, title: "The History of Urantia", papers: [57, 119], color: "from-amber-600/30 to-amber-900/30", borderColor: "border-amber-500/50" },
  { id: 4, title: "The Life and Teachings of Jesus", papers: [120, 196], color: "from-rose-600/30 to-rose-900/30", borderColor: "border-rose-500/50" }
];

export default function UrantiaPapersMapPage() {
  const [papers, setPapers] = useState<Episode[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredPapers, setFilteredPapers] = useState<Episode[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<Episode | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  
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
      (paper.description && paper.description.toLowerCase().includes(query)) ||
      paper.id.toString() === query
    );
    
    setFilteredPapers(filtered);
  }, [searchQuery, papers]);
  
  // Get part color based on paper ID
  const getPartGradient = (paperId: number) => {
    const part = getUrantiaPaperPart(paperId);
    const partConfig = URANTIA_PARTS.find(p => p.id === part);
    return partConfig ? partConfig.color : "from-gray-600/30 to-gray-900/30";
  };
  
  const getPartBorder = (paperId: number) => {
    const part = getUrantiaPaperPart(paperId);
    const partConfig = URANTIA_PARTS.find(p => p.id === part);
    return partConfig ? partConfig.borderColor : "border-gray-500/50";
  };
  
  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 0.25, 2));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 0.25, 0.5));
  };
  
  // Select a paper
  const handlePaperSelect = (paper: Episode) => {
    setSelectedPaper(paper);
    setShowInfo(true);
  };
  
  // Close info panel
  const handleCloseInfo = () => {
    setShowInfo(false);
  };
  
  // Calculate paper position in the map
  const getPaperPosition = (paperId: number) => {
    const part = getUrantiaPaperPart(paperId);
    const paperIndex = paperId - (part === 1 ? 0 : (part === 2 ? 31 : (part === 3 ? 56 : 119)));
    
    // Calculate position based on part and paper index
    let x, y;
    
    switch (part) {
      case 1: // Top left quadrant
        x = 20 + (paperIndex % 6) * 15;
        y = 20 + Math.floor(paperIndex / 6) * 15;
        break;
      case 2: // Top right quadrant
        x = 55 + (paperIndex % 5) * 15;
        y = 20 + Math.floor(paperIndex / 5) * 15;
        break;
      case 3: // Bottom left quadrant
        x = 20 + (paperIndex % 8) * 10;
        y = 55 + Math.floor(paperIndex / 8) * 10;
        break;
      case 4: // Bottom right quadrant
        x = 55 + (paperIndex % 8) * 10;
        y = 55 + Math.floor(paperIndex / 8) * 10;
        break;
      default:
        x = 50;
        y = 50;
    }
    
    return { x, y };
  };
  
  // Get paper size based on zoom level
  const getPaperSize = () => {
    return 8 * zoomLevel;
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
            Explore all 197 papers of the Urantia Book through this visual map.
            Each dot represents a paper, color-coded by part.
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
        
        {/* Map Legend */}
        <div className="mb-6 flex flex-wrap gap-4">
          {URANTIA_PARTS.map(part => (
            <div key={part.id} className="flex items-center">
              <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${part.color.split(' ')[0]} mr-2`}></div>
              <span className="text-white/80 text-sm">Part {part.id}: {part.title}</span>
            </div>
          ))}
        </div>
        
        {/* Map Controls */}
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <button 
              className="p-2 bg-navy-light/50 rounded-full text-white/70 hover:text-white"
              onClick={handleZoomIn}
            >
              <Plus size={20} />
            </button>
            <button 
              className="p-2 bg-navy-light/50 rounded-full text-white/70 hover:text-white"
              onClick={handleZoomOut}
            >
              <Minus size={20} />
            </button>
          </div>
          
          <div className="text-white/50 text-sm">
            {filteredPapers.length} papers shown
          </div>
        </div>
        
        {/* Visual Map */}
        <div className="relative bg-navy-dark/50 border border-white/10 rounded-xl overflow-hidden mb-8" style={{ height: '600px' }}>
          {/* Quadrant Dividers */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10"></div>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10"></div>
          
          {/* Quadrant Labels */}
          <div className="absolute left-4 top-4 text-white/50 text-xs">Part I: The Central and Superuniverses</div>
          <div className="absolute right-4 top-4 text-white/50 text-xs">Part II: The Local Universe</div>
          <div className="absolute left-4 bottom-4 text-white/50 text-xs">Part III: The History of Urantia</div>
          <div className="absolute right-4 bottom-4 text-white/50 text-xs">Part IV: The Life and Teachings of Jesus</div>
          
          {/* Papers */}
          <div 
            className="absolute inset-0 transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
          >
            {filteredPapers.map(paper => {
              const position = getPaperPosition(paper.id);
              const size = getPaperSize();
              
              return (
                <motion.div
                  key={paper.id}
                  className={`absolute rounded-full cursor-pointer border ${getPartBorder(paper.id)} bg-gradient-to-br ${getPartGradient(paper.id)} hover:border-primary transition-all`}
                  style={{ 
                    left: `${position.x}%`, 
                    top: `${position.y}%`, 
                    width: `${size}px`, 
                    height: `${size}px`,
                    marginLeft: `-${size/2}px`,
                    marginTop: `-${size/2}px`,
                    zIndex: selectedPaper?.id === paper.id ? 10 : 1
                  }}
                  whileHover={{ scale: 1.5 }}
                  onClick={() => handlePaperSelect(paper)}
                  title={`${paper.id}: ${paper.title}`}
                >
                  {zoomLevel > 1 && (
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                      {paper.id}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Selected Paper Info Panel */}
        {selectedPaper && showInfo && (
          <motion.div 
            className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-navy-dark/95 border-l border-white/10 p-6 z-50 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3 }}
          >
            <button 
              className="absolute top-4 right-4 text-white/50 hover:text-white"
              onClick={handleCloseInfo}
            >
              ✕
            </button>
            
            <div className={`h-2 w-16 rounded-full bg-gradient-to-r ${getPartGradient(selectedPaper.id)} mb-6`}></div>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <span className="text-primary text-xl font-bold mr-2">{selectedPaper.id}</span>
                <h3 className="text-xl font-semibold text-white">{selectedPaper.title}</h3>
              </div>
              <p className="text-white/70">{selectedPaper.description}</p>
            </div>
            
            <div className="flex flex-col space-y-3">
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
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 className="text-white font-medium mb-2 flex items-center">
                <Info size={16} className="mr-2" />
                Paper Information
              </h4>
              <div className="text-white/70 text-sm space-y-2">
                <p>Part: {getUrantiaPaperPart(selectedPaper.id)}</p>
                <p>Paper Number: {selectedPaper.id}</p>
                <p>Audio Format: MP3</p>
                <p>PDF Available: {selectedPaper.pdfUrl ? 'Yes' : 'No'}</p>
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