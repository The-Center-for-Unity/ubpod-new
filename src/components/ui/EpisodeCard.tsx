import React from 'react';
import { Play, FileText, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Episode } from '../../types';

interface EpisodeCardProps {
  episode: Episode;
  onPlay?: () => void;
}

export default function EpisodeCard({ episode, onPlay }: EpisodeCardProps) {
  const { id, title, description, audioUrl, pdfUrl, series, imageUrl } = episode;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      {imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{title}</h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
        
        <div className="flex flex-wrap gap-2 mt-auto">
          <Link 
            to={`/listen/${series}/${id}`}
            className="flex items-center gap-1 px-3 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            onClick={onPlay}
          >
            <Play size={16} />
            <span>Listen</span>
          </Link>
          
          {pdfUrl && (
            <a 
              href={pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
            >
              <FileText size={16} />
              <span>Read</span>
            </a>
          )}
          
          <a 
            href={audioUrl} 
            download
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Download size={16} />
            <span>Download</span>
          </a>
        </div>
      </div>
    </div>
  );
} 