import React, { useEffect, useState } from 'react';
import { getProjects, getProviders, getDomains } from '../services/airtable';
import { Project, Provider, Domain } from '../types';

export const AirtableTest: React.FC = () => {
  const [data, setData] = useState<{
    projects: Project[];
    providers: Provider[];
    domains: Domain[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Environment variables:', {
          apiKey: import.meta.env.VITE_AIRTABLE_API_KEY ? 'Set' : 'Not set',
          baseId: import.meta.env.VITE_AIRTABLE_BASE_ID ? 'Set' : 'Not set',
          projectsTable: import.meta.env.VITE_AIRTABLE_PROJECTS_TABLE,
          providersTable: import.meta.env.VITE_AIRTABLE_PROVIDERS_TABLE,
          domainsTable: import.meta.env.VITE_AIRTABLE_DOMAINS_TABLE,
        });

        const [projects, providers, domains] = await Promise.all([
          getProjects(),
          getProviders(),
          getDomains()
        ]);
        
        setData({ projects, providers, domains });
        console.log('Fetched data:', { projects, providers, domains });
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? `${err.name}: ${err.message}` 
          : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#9370DB] border-t-transparent"></div>
          <span>Loading data...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
          <p className="text-red-600">{error}</p>
          <p className="mt-2 text-sm text-red-500">Check the console for more details.</p>
        </div>
      );
    }

    if (!data) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <p className="text-yellow-700">No data found. The connection may have succeeded but returned no records.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Projects ({data.projects.length})</h3>
          <ul className="list-disc pl-5 space-y-2">
            {data.projects.slice(0, 3).map(project => (
              <li key={project.id} className="text-gray-700">
                {project.name} 
                <span className="text-gray-500 text-sm ml-2">({project.status})</span>
              </li>
            ))}
            {data.projects.length > 3 && (
              <li className="text-gray-500">... and {data.projects.length - 3} more</li>
            )}
          </ul>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Providers ({data.providers.length})</h3>
          <ul className="list-disc pl-5 space-y-2">
            {data.providers.slice(0, 3).map(provider => (
              <li key={provider.id} className="text-gray-700">
                {provider.name}
                <div className="inline-block w-3 h-3 ml-2 rounded-full" style={{ backgroundColor: provider.color }}></div>
              </li>
            ))}
            {data.providers.length > 3 && (
              <li className="text-gray-500">... and {data.providers.length - 3} more</li>
            )}
          </ul>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Domains ({data.domains.length})</h3>
          <ul className="list-disc pl-5 space-y-2">
            {data.domains.map(domain => (
              <li key={domain.id} className="text-gray-700">
                {domain.name}
                <div className="inline-block w-3 h-3 ml-2 rounded-full" style={{ backgroundColor: domain.color }}></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Airtable Connection Test</h2>
      {renderContent()}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="font-mono text-sm text-gray-600">Check the browser console (F12) for detailed data output</p>
      </div>
    </div>
  );
}; 