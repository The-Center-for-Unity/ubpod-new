// src/components/initiatives/ProjectList.tsx
import React, { useState } from 'react';
import { ProjectFilters } from './ProjectFilters';
import { ProjectCard } from './ProjectCard';
import { useProjects } from '../../hooks/useProjects';
import { useDomains } from '../../hooks/useDomains';
import { useProviders } from '../../hooks/useProviders';
import { TriangleAffinity } from '../../types';

export function ProjectList() {
  const { projects, isLoading: projectsLoading, error: projectsError } = useProjects();
  const { domains, isLoading: domainsLoading, error: domainsError } = useDomains();
  const { providers, isLoading: providersLoading, error: providersError } = useProviders();
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const isLoading = projectsLoading || domainsLoading || providersLoading;
  const error = projectsError || domainsError || providersError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="body-lg text-white/70 mb-4">Error loading data: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-navy-light/30 hover:bg-navy-light/50 rounded-full transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Filter providers with permission
  const approvedProviders = providers.filter(provider => provider.permissionGranted);

  // Filter projects with permission and from approved providers
  const approvedProjects = projects.filter(project => 
    project.permissionGranted && 
    approvedProviders.some(provider => provider.id === project.providerId)
  );

  // Then apply other filters
  const filteredProjects = approvedProjects.filter(project => {
    const matchesDomain = !selectedDomain || 
      (selectedDomain in project.affinities && project.affinities[selectedDomain as keyof TriangleAffinity] > 0);
    const matchesProvider = !selectedProvider || project.providerId === selectedProvider;
    const matchesStatus = !selectedStatus || project.status === selectedStatus;
    return matchesDomain && matchesProvider && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <ProjectFilters
        selectedDomain={selectedDomain}
        selectedProvider={selectedProvider}
        selectedStatus={selectedStatus}
        onDomainChange={setSelectedDomain}
        onProviderChange={setSelectedProvider}
        onStatusChange={setSelectedStatus}
        domains={domains}
        providers={approvedProviders}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map(project => (
          <ProjectCard 
            key={project.id}
            project={project}
            provider={approvedProviders.find(p => p.id === project.providerId)}
            domains={domains}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/70">No initiatives match your current filters.</p>
        </div>
      )}
    </div>
  );
}