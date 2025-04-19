// src/components/initiatives/ProjectCard.tsx
import React from 'react';
import { Project, Provider, Domain, FocusLevel } from '../../types';

interface ProjectCardProps {
  project: Project;
  provider: Provider | undefined;
  domains: Domain[];
}

function getFocusPercentage(level: FocusLevel): number {
  switch (level) {
    case 'maximal': return 100;     // 100%
    case 'very high': return 87.5;  // 87.5%
    case 'high': return 75;         // 75%
    case 'strong': return 62.5;     // 62.5%
    case 'balanced': return 50;     // 50%
    case 'moderate': return 37.5;   // 37.5%
    case 'low': return 25;          // 25%
    case 'barely': return 12.5;     // 12.5%
    case 'none': return 0;          // 0%
  }
}

const SeekerFriendlinessStars: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-gold' : 'text-white/20'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm text-white/60 ml-1">Seeker Friendly</span>
    </div>
  );
};

export function ProjectCard({ project, provider, domains }: ProjectCardProps) {
  return (
    <div className="bg-navy-light/30 rounded-lg overflow-hidden hover:bg-navy-light/40 transition-colors">
      {/* Header Section */}
      <div className="p-8 border-b border-white/10 space-y-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="title-subtitle tracking-wide">
            {project.name}
          </h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            project.status === 'active' ? 'bg-green-500/20 text-green-300' :
            project.status === 'development' ? 'bg-blue-500/20 text-blue-300' :
            'bg-gray-500/20 text-gray-300'
          }`}>
            {project.status}
          </span>
        </div>
        <p className="body-lg text-white/70">
          {project.shortDescription}
        </p>
        {provider && (
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: provider.color }}
            />
            <span className="text-sm text-white/60">{provider.name}</span>
          </div>
        )}
      </div>

      {/* Domain Focus Areas */}
      <div className="p-6 bg-navy-light/50">
        <h4 className="text-sm font-medium text-white/60 mb-4">Domain Focus</h4>
        <div className="space-y-3">
          {domains.map((domain) => {
            const focusLevel = project.focus[domain.id as keyof typeof project.focus];
            const percentage = getFocusPercentage(focusLevel);
            return (
              <div key={domain.id} className="flex items-center gap-3">
                <div className="w-20 text-sm text-white/70">{domain.name.split(' ')[0]}</div>
                <div className="w-20">
                  <div className="h-2 bg-navy-light rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: domain.color,
                        opacity: percentage > 0 ? 1 : 0.5
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1 text-sm text-white/70">
                  {focusLevel}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <div className="flex flex-col gap-3">
          <SeekerFriendlinessStars rating={project.seekerFriendliness} />
          {project.websiteUrl && project.websiteUrl.trim() !== "" && (
            <a 
              href={project.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-white/70 hover:text-white/90 transition-colors text-sm group"
            >
              Visit Website
              <svg 
                className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}