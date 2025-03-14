// src/components/framework/TriangleFramework.tsx
import React, { useState, useEffect } from 'react';
import { getProjects, getDomains, getProviders } from '../../services/airtable';
import { Project, Domain, Provider } from '../../types';
import { FrameworkDescription } from './FrameworkDescription';
import { TrianglePlot } from './TrianglePlot';
import { SupportingDocModal } from '../../components/SupportingDocModal';

export function TriangleFramework() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupportingDocOpen, setIsSupportingDocOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, domainsData, providersData] = await Promise.all([
          getProjects(),
          getDomains(),
          getProviders()
        ]);
        setProjects(projectsData);
        setDomains(domainsData);
        setProviders(providersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading || error) {
    return (
      <div className="py-8">
        <div className="max-w-3xl mx-auto px-4">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto"/>
              <p className="mt-4 text-white/70">Loading framework data...</p>
            </div>
          ) : (
            <div className="bg-navy-light/30 border border-white/10 rounded-lg p-4 text-center">
              <p className="text-white/70">Error: {error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-gold hover:text-gold/80 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <FrameworkDescription 
          onLearnMore={() => setIsSupportingDocOpen(true)} 
        />
        <TrianglePlot 
          projects={projects} 
          domains={domains}
          providers={providers}
        />
      </div>

      <SupportingDocModal 
        isOpen={isSupportingDocOpen}
        onClose={() => setIsSupportingDocOpen(false)}
      />
    </div>
  );
}