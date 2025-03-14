import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Play, Download } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';

// Define types for our data structure
interface UrantiaPaper {
  id: number;
  title: string;
  description: string;
  part: number;
  audioUrl: string;
  pdfUrl: string;
}

// Mock data for demonstration
const URANTIA_PARTS = [
  { id: 1, title: "The Central and Superuniverses", papers: [1, 31], color: "from-blue-500/20" },
  { id: 2, title: "The Local Universe", papers: [32, 56], color: "from-green-500/20" },
  { id: 3, title: "The History of Urantia", papers: [57, 119], color: "from-amber-500/20" },
  { id: 4, title: "The Life and Teachings of Jesus", papers: [120, 196], color: "from-rose-500/20" }
];

// Generate mock papers data
const generateMockPapers = (): UrantiaPaper[] => {
  const papers: UrantiaPaper[] = [];
  
  // Part 1: Papers 1-31
  for (let i = 1; i <= 31; i++) {
    papers.push({
      id: i,
      title: `Paper ${i}: ${i === 1 ? "The Universal Father" : `Sample Title ${i}`}`,
      description: `This paper discusses important concepts related to ${i === 1 ? "the nature of God" : "the universe structure and divine administration"}`,
      part: 1,
      audioUrl: `/audio/paper-${i}.mp3`,
      pdfUrl: `/pdfs/paper-${i}.pdf`
    });
  }
  
  // Part 2: Papers 32-56
  for (let i = 32; i <= 56; i++) {
    papers.push({
      id: i,
      title: `Paper ${i}: Sample Title ${i}`,
      description: "This paper explores the local universe of Nebadon, its creation, and administration.",
      part: 2,
      audioUrl: `/audio/paper-${i}.mp3`,
      pdfUrl: `/pdfs/paper-${i}.pdf`
    });
  }
  
  // Part 3: Papers 57-119
  for (let i = 57; i <= 119; i++) {
    papers.push({
      id: i,
      title: `Paper ${i}: Sample Title ${i}`,
      description: "This paper details the history of Urantia (Earth) from its formation to human civilization.",
      part: 3,
      audioUrl: `/audio/paper-${i}.mp3`,
      pdfUrl: `/pdfs/paper-${i}.pdf`
    });
  }
  
  // Part 4: Papers 120-196
  for (let i = 120; i <= 196; i++) {
    papers.push({
      id: i,
      title: `Paper ${i}: Sample Title ${i}`,
      description: "This paper presents details about the life and teachings of Jesus of Nazareth.",
      part: 4,
      audioUrl: `/audio/paper-${i}.mp3`,
      pdfUrl: `/pdfs/paper-${i}.pdf`
    });
  }
  
  return papers;
};

export default function UrantiaPapersPage() {
  const [activePart, setActivePart] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [papers, setPapers] = useState<UrantiaPaper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<UrantiaPaper[]>([]);
  
  // Initialize papers data
  useEffect(() => {
    const allPapers = generateMockPapers();
    setPapers(allPapers);
    setFilteredPapers(allPapers.filter(paper => paper.part === activePart));
  }, []);
  
  // Filter papers when active part or search query changes
  useEffect(() => {
    let filtered = papers.filter(paper => paper.part === activePart);
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        paper => 
          paper.title.toLowerCase().includes(query) || 
          paper.description.toLowerCase().includes(query) ||
          paper.id.toString() === query
      );
    }
    
    setFilteredPapers(filtered);
  }, [activePart, searchQuery, papers]);
  
  // Get the color for the active part
  const getActivePartColor = () => {
    const part = URANTIA_PARTS.find(p => p.id === activePart);
    return part ? part.color : "from-blue-500/20";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div 
          className={`rounded-xl p-8 mb-8 bg-gradient-to-r ${getActivePartColor()} to-transparent`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="title-main mb-4">The Urantia Papers</h1>
          <p className="body-lg max-w-3xl">
            Explore all 197 papers of the Urantia Book through AI-narrated episodes.
            Listen while reading along with the original text.
          </p>
        </motion.div>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-auto flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search papers by title, number, or keyword..."
              className="w-full pl-10 pr-4 py-2 bg-navy-light/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-white/50" size={18} />
          </div>
          
          {/* Part Tabs */}
          <div className="flex space-x-1 bg-navy-light/30 p-1 rounded-lg">
            {URANTIA_PARTS.map((part) => (
              <button
                key={part.id}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activePart === part.id 
                    ? 'bg-primary text-white' 
                    : 'text-white/70 hover:text-white/90'
                }`}
                onClick={() => setActivePart(part.id)}
              >
                Part {part.id}
              </button>
            ))}
          </div>
        </div>
        
        {/* Active Part Title */}
        <div className="mb-6">
          <h2 className="section-subtitle">
            Part {activePart}: {URANTIA_PARTS.find(p => p.id === activePart)?.title}
          </h2>
          <p className="text-white/50 text-sm">
            Papers {URANTIA_PARTS.find(p => p.id === activePart)?.papers[0]} - {URANTIA_PARTS.find(p => p.id === activePart)?.papers[1]}
          </p>
        </div>
        
        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper) => (
            <motion.div
              key={paper.id}
              className="bg-navy-light/30 rounded-lg overflow-hidden border border-white/5 hover:border-primary/30 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5, boxShadow: '0 10px 30px -15px rgba(0, 174, 239, 0.2)' }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-primary font-bold">{paper.id}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{paper.title}</h3>
                <p className="text-white/70 text-sm mb-4 line-clamp-2">{paper.description}</p>
                
                <div className="flex space-x-3 mt-auto">
                  <Link
                    to={`/listen/urantia-papers/${paper.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm"
                  >
                    <Play size={14} />
                    <span>Listen</span>
                  </Link>
                  
                  <a
                    href={paper.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-light text-white/80 rounded-md hover:bg-navy transition-colors text-sm"
                  >
                    <BookOpen size={14} />
                    <span>Read</span>
                  </a>
                  
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
          ))}
        </div>
        
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