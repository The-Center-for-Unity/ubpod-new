import { useState, useEffect } from 'react';
import { Provider } from '../types';
import { getProviders } from '../services/airtable';

export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const providersData = await getProviders();
        setProviders(providersData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load providers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  return { providers, isLoading, error };
} 