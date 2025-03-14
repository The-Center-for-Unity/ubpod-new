import React from 'react';
import { Domain, Provider } from '../types';

interface ProjectFiltersProps {
  selectedDomain: string | null;
  selectedProvider: string | null;
  selectedStatus: string | null;
  onDomainChange: (domain: string | null) => void;
  onProviderChange: (provider: string | null) => void;
  onStatusChange: (status: string | null) => void;
  domains: Domain[];
  providers: Provider[];
}

const PROJECT_STATUSES = [
  { id: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
  { id: 'development', label: 'In Development', color: 'bg-blue-100 text-blue-800' },
  { id: 'planning', label: 'Planning', color: 'bg-purple-100 text-purple-800' }
];

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  selectedDomain,
  selectedProvider,
  selectedStatus,
  onDomainChange,
  onProviderChange,
  onStatusChange,
  domains,
  providers,
}) => {
  return (
    <div className="flex flex-col gap-6 mb-8">
      {/* Domain filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Domain</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onDomainChange(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedDomain === null
                ? 'bg-gray-200 text-gray-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Domains
          </button>
          {domains.map((domain) => (
            <button
              key={domain.id}
              onClick={() => onDomainChange(domain.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedDomain === domain.id
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: selectedDomain === domain.id ? domain.color : undefined,
              }}
            >
              {domain.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Provider filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Provider</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onProviderChange(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedProvider === null
                ? 'bg-gray-200 text-gray-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Providers
          </button>
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => onProviderChange(provider.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedProvider === provider.id
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: selectedProvider === provider.id ? provider.color : undefined,
              }}
            >
              {provider.name}
            </button>
          ))}
        </div>
      </div>

      {/* Status filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Status</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onStatusChange(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedStatus === null
                ? 'bg-gray-200 text-gray-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Statuses
          </button>
          {PROJECT_STATUSES.map((status) => (
            <button
              key={status.id}
              onClick={() => onStatusChange(status.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedStatus === status.id
                  ? status.color
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 