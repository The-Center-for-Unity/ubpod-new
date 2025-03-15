// src/components/initiatives/ProjectFilters.tsx
import React, { useState } from 'react';
import { Domain, Provider } from '../../types';

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

const STATUSES: FilterOption[] = [
  { id: 'active', label: 'Active' },
  { id: 'development', label: 'In Development' },
  { id: 'planning', label: 'Planning' }
];

type FilterType = 'domain' | 'provider' | 'status';

interface FilterOption {
  id: string;
  name?: string;
  label?: string;
  color?: string;
}

const FILTER_LABELS = {
  domain: { singular: 'Domain', plural: 'Domains' },
  provider: { singular: 'Provider', plural: 'Providers' },
  status: { singular: 'Status', plural: 'Statuses' }
} as const;

const MobileFilterDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: FilterOption[];
  selectedValue: string | null;
  onSelect: (value: string | null) => void;
  filterType: FilterType;
}> = ({ isOpen, onClose, title, options, selectedValue, onSelect, filterType }) => {
  if (!isOpen) return null;

  const getOptionLabel = (option: FilterOption) => {
    if (option.label) return option.label;
    if (option.name) return option.name;
    return option.id;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="fixed bottom-0 left-0 right-0 bg-navy rounded-t-2xl max-h-[80vh] overflow-auto border-t border-white/10">
        <div className="sticky top-0 bg-navy border-b border-white/10 px-4 py-3 flex justify-between items-center">
          <h3 className="title-subtitle text-lg">{title}</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white/90">
            Done
          </button>
        </div>
        <div className="p-2">
          <button
            className={`w-full px-4 py-3 text-left text-lg ${
              !selectedValue ? 'text-gold font-medium' : 'text-white/70'
            }`}
            onClick={() => {
              onSelect(null);
              onClose();
            }}
          >
            All {FILTER_LABELS[filterType].plural}
          </button>
          {[...options].sort((a, b) => {
            const aLabel = a.label || a.name || a.id;
            const bLabel = b.label || b.name || b.id;
            return aLabel.localeCompare(bLabel);
          }).map(option => (
            <button
              key={option.id}
              className={`w-full px-4 py-3 text-left text-lg flex items-center space-x-2 ${
                selectedValue === option.id ? 'text-gold font-medium' : 'text-white/70'
              }`}
              onClick={() => {
                onSelect(option.id);
                onClose();
              }}
            >
              {option.color && (
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: option.color }}
                />
              )}
              <span>{getOptionLabel(option)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const FilterButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full px-4 py-3 rounded-lg border text-left text-base tracking-wide
      flex items-center justify-between
      ${isActive 
        ? 'border-gold text-gold bg-gold/5'
        : 'border-white/10 text-white/70 bg-navy-light/30'
      }
      hover:bg-opacity-80 transition-colors
    `}
  >
    {label}
    <svg 
      className={`w-5 h-5 ${isActive ? 'text-gold' : 'text-white/40'}`} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>
);

export function ProjectFilters({
  selectedDomain,
  selectedProvider,
  selectedStatus,
  onDomainChange,
  onProviderChange,
  onStatusChange,
  domains,
  providers,
}: ProjectFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);

  const getSelectedLabel = (
    type: FilterType,
    value: string | null,
    options: FilterOption[]
  ) => {
    if (!value) return `All ${FILTER_LABELS[type].plural}`;
    const option = options.find(opt => opt.id === value);
    return option ? (option.label || option.name || '') : `All ${FILTER_LABELS[type].plural}`;
  };

  const closeDialog = () => setActiveFilter(null);

  return (
    <div className="mb-12">
      {/* Mobile/Desktop Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FilterButton
          label={getSelectedLabel('domain', selectedDomain, domains)}
          isActive={!!selectedDomain}
          onClick={() => setActiveFilter('domain')}
        />
        <FilterButton
          label={getSelectedLabel('provider', selectedProvider, providers)}
          isActive={!!selectedProvider}
          onClick={() => setActiveFilter('provider')}
        />
        <FilterButton
          label={getSelectedLabel('status', selectedStatus, STATUSES)}
          isActive={!!selectedStatus}
          onClick={() => setActiveFilter('status')}
        />
      </div>

      {/* Clear Filters */}
      {(selectedDomain || selectedProvider || selectedStatus) && (
        <button
          onClick={() => {
            onDomainChange(null);
            onProviderChange(null);
            onStatusChange(null);
          }}
          className="text-base text-gold hover:text-gold/80 self-center py-2 tracking-wide mt-4 mx-auto block"
        >
          Clear all filters
        </button>
      )}

      {/* Mobile Filter Dialogs */}
      <MobileFilterDialog
        isOpen={activeFilter === 'domain'}
        onClose={closeDialog}
        title="Filter by Domain"
        options={domains}
        selectedValue={selectedDomain}
        onSelect={onDomainChange}
        filterType="domain"
      />
      <MobileFilterDialog
        isOpen={activeFilter === 'provider'}
        onClose={closeDialog}
        title="Filter by Provider"
        options={providers}
        selectedValue={selectedProvider}
        onSelect={onProviderChange}
        filterType="provider"
      />
      <MobileFilterDialog
        isOpen={activeFilter === 'status'}
        onClose={closeDialog}
        title="Filter by Status"
        options={STATUSES}
        selectedValue={selectedStatus}
        onSelect={onStatusChange}
        filterType="status"
      />
    </div>
  );
}