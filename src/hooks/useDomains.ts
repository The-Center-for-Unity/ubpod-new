import { useState, useEffect } from 'react';
import { Domain } from '../types';
import { getDomains } from '../services/airtable';

export function useDomains() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const domainsData = await getDomains();
        setDomains(domainsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load domains');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDomains();
  }, []);

  return { domains, isLoading, error };
} 