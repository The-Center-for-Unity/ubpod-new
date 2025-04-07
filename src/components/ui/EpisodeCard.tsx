import React, { useEffect } from 'react';
import { Play, FileText, Download, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Episode } from '../../types/index';

interface EpisodeCardProps {
  episode: Episode;
  onPlay?: () => void;
}

export default function EpisodeCard({ episode, onPlay }: EpisodeCardProps) {
  const { id, title, description, summary, cardSummary, audioUrl, pdfUrl, series, imageUrl } = episode;

  // Determine which summary to display, with fallbacks
  const displaySummary = cardSummary || summary;
  
  // Debug: Log detailed episode info when component mounts
  useEffect(() => {
    if (id < 5) {
      console.log(`EpisodeCard mounted for ${id} (${title}):`, { 
        id,
        title,
        hasCardSummary: !!cardSummary, 
        hasSummary: !!summary,
        cardSummaryType: cardSummary ? typeof cardSummary : 'undefined',
        summaryType: summary ? typeof summary : 'undefined',
        cardSummary: cardSummary ? cardSummary.substring(0, 30) + '...' : 'undefined',
        summary: summary ? summary.substring(0, 30) + '...' : 'undefined',
        displaySummary: displaySummary ? displaySummary.substring(0, 30) + '...' : 'undefined',
        description: description ? description.substring(0, 30) + '...' : 'undefined',
        fullEpisode: JSON.stringify(episode).substring(0, 100) + '...'
      });
    }
  }, [id, title, cardSummary, summary, description, episode]);
  
  // Debug: Log summary info for all episodes
  console.log(`EpisodeCard render ${id} (${title}):`, { 
    hasCardSummary: !!cardSummary, 
    hasSummary: !!summary,
    willDisplaySummary: !!displaySummary
  });

  // Determine read link properties based on series type
  const getReadLink = () => {
    // For Jesus-related series, link to DiscoverJesus.com
    if (series.startsWith('jesus-')) {
      return {
        url: 'https://discoverjesus.com',
        target: '_blank',
        rel: 'noopener noreferrer'
      };
    }
    
    // For Urantia Papers, link to the PDF if available
    if (series === 'urantia-papers' && pdfUrl) {
      return {
        url: pdfUrl,
        target: '_blank',
        rel: 'noopener noreferrer'
      };
    }
    
    // For other series, only show Read button if there's a PDF
    if (pdfUrl) {
      return {
        url: pdfUrl,
        target: '_blank',
        rel: 'noopener noreferrer'
      };
    }
    
    // Return null if no link should be shown
    return null;
  };
  
  // Get read link info
  const readLink = getReadLink();

  return (
    <div className="bg-navy-light/20 rounded-lg overflow-hidden border border-white/5 hover:border-white/20 transition-all shadow-md hover:shadow-lg h-full flex flex-col">
      {/* Content Section */}
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-semibold mb-3 text-white line-clamp-2 min-h-[3.5rem]">
          Episode {id}: {title}
        </h3>
        
        <div className="mb-4 flex-grow">
          {displaySummary ? (
            <p className="text-white/80 line-clamp-3 min-h-[4.5rem]">{displaySummary}</p>
          ) : (
            <p className="text-white/70 line-clamp-3 min-h-[4.5rem]">{description}</p>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-auto">
          <Link 
            to={`/listen/${series}/${id}`}
            className="flex items-center gap-1 px-4 py-2 bg-gold text-navy-dark rounded-md hover:bg-gold/90 transition-colors font-medium"
            onClick={onPlay}
          >
            <Play size={16} />
            <span>Listen</span>
          </Link>
          
          {readLink && (
            <a 
              href={readLink.url} 
              target={readLink.target} 
              rel={readLink.rel}
              className="flex items-center gap-1 px-3 py-2 bg-navy/50 text-white/90 rounded-md hover:bg-navy/70 transition-colors"
            >
              <FileText size={16} />
              <span>Read</span>
            </a>
          )}
          
          <a 
            href={audioUrl} 
            download
            className="flex items-center gap-1 px-3 py-2 bg-navy/50 text-white/90 rounded-md hover:bg-navy/70 transition-colors"
          >
            <Download size={16} />
            <span>Download</span>
          </a>
        </div>
      </div>
    </div>
  );
} 