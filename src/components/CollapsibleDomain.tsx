import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleDomainProps {
  domain: string;
  color: string;
  projects: Array<{ id: string; name: string }>;
}

export const CollapsibleDomain: React.FC<CollapsibleDomainProps> = ({ domain, color, projects }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-6 flex items-center justify-between text-left"
      >
        <h3 className={`text-lg sm:text-xl font-semibold`} style={{ color }}>
          {domain} Domain
        </h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-2">
          {projects.map(project => (
            <div 
              key={project.id}
              className="flex items-center gap-2 text-xs sm:text-sm p-2 hover:bg-white rounded transition-colors"
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[#4A4A4A]">{project.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 