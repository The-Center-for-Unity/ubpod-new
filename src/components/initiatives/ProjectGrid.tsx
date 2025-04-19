// src/components/initiatives/ProjectGrid.tsx
import React from 'react';
import { ProjectCard } from './ProjectCard';
import { Project, Provider, Domain } from '../../types';

interface ProjectGridProps {
  projects: Project[];
  providers: Provider[];
  domains: Domain[];
}

export function ProjectGrid({ projects, providers, domains }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No initiatives match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map(project => (
        <ProjectCard 
          key={project.id}
          project={project}
          provider={providers.find(p => p.id === project.providerId)}
          domains={domains}
        />
      ))}
    </div>
  );
}