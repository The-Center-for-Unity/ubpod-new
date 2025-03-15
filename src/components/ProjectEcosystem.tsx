import React, { useState, useEffect } from 'react';
import { getProjects, getProviders, getDomains } from '../services/airtable';
import { Project, Provider, Domain } from '../types';
import { ProjectFilters } from './ProjectFilters';
import { calculateProjectPositions } from './framework/triangleUtils';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'development':
      return 'bg-blue-100 text-blue-800';
    case 'planning':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const SeekerFriendlinessStars: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm text-gray-600 ml-1">Seeker Friendly</span>
    </div>
  );
};

const getAffinityDisplay = (value: number) => {
  const percentage = Math.round(value * 100);
  if (percentage >= 95) return { text: 'Maximal', value: percentage };
  if (percentage >= 82) return { text: 'Very High', value: percentage };
  if (percentage >= 70) return { text: 'High', value: percentage };
  if (percentage >= 57) return { text: 'Strong', value: percentage };
  if (percentage >= 45) return { text: 'Balanced', value: percentage };
  if (percentage >= 32) return { text: 'Moderate', value: percentage };
  if (percentage >= 20) return { text: 'Low', value: percentage };
  if (percentage >= 7) return { text: 'Barely', value: percentage };
  return { text: 'None', value: percentage };
};

export const ProjectEcosystem: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, providersData, domainsData] = await Promise.all([
          getProjects(),
          getProviders(),
          getDomains()
        ]);
        setProjects(projectsData);
        setProviders(providersData);
        setDomains(domainsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter published projects first
  const publishedProjects = projects.filter(project => project.permissionGranted);

  // Calculate positions for published projects
  const projectPositions = calculateProjectPositions(publishedProjects);

  // Update filtering logic for direct percentage values
  const filteredProjects = publishedProjects
    .filter(project => {
      const matchesDomain = selectedDomain === null || 
        (project.affinities[selectedDomain as keyof typeof project.affinities] * 100) >= 50; // Convert to percentage for comparison
      const matchesProvider = selectedProvider === null || 
        project.providerId === selectedProvider;
      const matchesStatus = selectedStatus === null || 
        project.status === selectedStatus;
      
      return matchesDomain && matchesProvider && matchesStatus;
    })
    .sort((a, b) => {
      // If a domain is selected, sort by that domain's affinity (highest first)
      if (selectedDomain) {
        return (b.affinities[selectedDomain as keyof typeof b.affinities] * 100) - 
               (a.affinities[selectedDomain as keyof typeof a.affinities] * 100);
      }
      // Otherwise sort alphabetically
      return a.name.localeCompare(b.name);
    });

  // Debug log for providers data
  useEffect(() => {
    if (providers.length > 0) {
      console.log('Available Providers:', providers.map(p => ({ id: p.id, name: p.name })));
    }
  }, [providers]);

  // Debug log for filtered projects
  useEffect(() => {
    if (selectedProvider) {
      console.log('Filtered Projects:', filteredProjects.map(p => ({ 
        name: p.name, 
        providerId: p.providerId 
      })));
    }
  }, [selectedProvider, filteredProjects]);

  if (isLoading) {
    return (
      <section className="py-24 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9370DB]"></div>
          </div>
          <p className="mt-4 text-[#4A4A4A]">Loading projects...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-800">Error: {error}</p>
            <p className="text-sm text-red-600 mt-2">Please try refreshing the page</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4">
            Active Initiatives
          </h2>
          <p className="text-xl text-[#4A4A4A] max-w-3xl mx-auto">
            Each project uniquely supports spiritual seekers through different aspects 
            of the Service Framework. The bars below show how each initiative 
            emphasizes or complements the different domains.
          </p>
        </div>

        {/* Add filters */}
        <div className="max-w-3xl mx-auto mb-12">
          <ProjectFilters
            selectedDomain={selectedDomain}
            selectedProvider={selectedProvider}
            selectedStatus={selectedStatus}
            onDomainChange={setSelectedDomain}
            onProviderChange={setSelectedProvider}
            onStatusChange={setSelectedStatus}
            domains={domains}
            providers={providers}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const provider = providers.find(p => p.id === project.providerId);
            return (
              <div 
                key={project.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                {/* Project Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-[#1A1A1A]">
                      {project.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-[#4A4A4A] mb-4">{project.shortDescription}</p>
                  {provider && (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: provider.color }}
                      />
                      <span className="text-sm text-gray-600">{provider.name}</span>
                    </div>
                  )}
                </div>

                {/* Domain Affinities */}
                <div className="p-6 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-600 mb-4">Domain Focus Areas</h4>
                  <div className="space-y-3">
                    {domains.map((domain) => {
                      const affinity = getAffinityDisplay(project.affinities[domain.id as keyof typeof project.affinities]);
                      return (
                        <div key={domain.id} className="flex items-center">
                          <div className="w-24 text-sm text-gray-600">{domain.name.split(' ')[0]}</div>
                          <div className="flex-1">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                  width: `${affinity.value}%`,
                                  backgroundColor: domain.color,
                                  opacity: affinity.value >= 25 ? 1 : 0.5
                                }}
                              />
                            </div>
                          </div>
                          <div className="w-24 text-right text-sm text-gray-600">
                            {affinity.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Seeker Friendliness and Website */}
                <div className="px-6 py-4 border-t border-gray-100">
                  <SeekerFriendlinessStars rating={project.seekerFriendliness} />
                  {project.websiteUrl && project.websiteUrl.trim() !== "" && (
                    <a 
                      href={project.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center text-[#9370DB] hover:text-[#B19CD9] transition-colors text-sm"
                    >
                      Visit Website
                      <svg 
                        className="w-4 h-4 ml-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>

                {/* Tags */}
                <div className="px-6 py-4 flex flex-wrap gap-2 border-t border-gray-100">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}; 