import Airtable from 'airtable';
import { Project, Provider, Domain, FocusLevel } from '../types';

if (!import.meta.env.VITE_AIRTABLE_API_KEY || !import.meta.env.VITE_AIRTABLE_BASE_ID) {
  console.error('Missing required environment variables for Airtable configuration');
}

const base = new Airtable({
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY
}).base(import.meta.env.VITE_AIRTABLE_BASE_ID);

// Convert focus level to a percentage (0-1)
function getFocusPercentage(level: FocusLevel): number {
  switch (level) {
    case 'maximal': return 1.0;     // 100%
    case 'very high': return 0.875; // 87.5%
    case 'high': return 0.75;       // 75%
    case 'strong': return 0.625;    // 62.5%
    case 'balanced': return 0.5;    // 50%
    case 'moderate': return 0.375;  // 37.5%
    case 'low': return 0.25;        // 25%
    case 'barely': return 0.125;    // 12.5%
    case 'none': return 0;          // 0%
  }
}

export const getProjects = async (): Promise<Project[]> => {
  try {
    const records = await base(import.meta.env.VITE_AIRTABLE_PROJECTS_TABLE)
      .select({
        view: 'Grid view'
      })
      .all();

    // Get all providers to map record IDs to slugs
    const providers = await getProviders();
    const providerMap = new Map(providers.map(p => [p.recordId, p.id]));

    return records.map(record => {
      // Get the Airtable record ID from the linked record
      const providerRecordId = (record.get('providerId') as any[])?.[0];
      // Map it to the provider slug
      const providerId = providerMap.get(providerRecordId) || '';

      // Get the focus levels for display
      const focus = {
        discovery: (record.get('discoveryFocus') as FocusLevel) || 'none',
        connection: (record.get('connectionFocus') as FocusLevel) || 'none',
        wisdom: (record.get('wisdomFocus') as FocusLevel) || 'none',
      };

      // Get the raw affinity values for positioning
      const affinities = {
        discovery: record.get('discoveryAffinity') as number || 0,
        connection: record.get('connectionAffinity') as number || 0,
        wisdom: record.get('wisdomAffinity') as number || 0
      };

      return {
        id: record.get('id') as string,
        recordId: record.id,  // Airtable's internal record ID
        name: record.get('name') as string,
        shortDescription: record.get('shortDescription') as string,
        longDescription: record.get('longDescription') as string,
        affinities,
        focus,
        status: record.get('status') as 'development' | 'active' | 'planning',
        size: record.get('size') as number,
        tags: record.get('tags') as string[],
        providerId: providerId,
        seekerFriendliness: record.get('seekerFriendliness') as number,
        websiteUrl: record.get('websiteUrl') as string,
        permissionGranted: record.get('permissionGranted') as boolean || false,
      };
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const getProviders = async (): Promise<Provider[]> => {
  try {
    const records = await base(import.meta.env.VITE_AIRTABLE_PROVIDERS_TABLE)
      .select({
        view: 'Grid view'
      })
      .all();

    console.log('Raw provider records:', records);

    return records.map(record => ({
      id: record.get('id') as string,
      recordId: record.id,  // Airtable's internal record ID
      name: record.get('name') as string,
      description: record.get('description') as string,
      color: record.get('color') as string,
      permissionGranted: record.get('permissionGranted') as boolean || false,
    }));
  } catch (error) {
    console.error('Error fetching providers:', error);
    throw error;
  }
};

export const getDomains = async (): Promise<Domain[]> => {
  try {
    const records = await base(import.meta.env.VITE_AIRTABLE_DOMAINS_TABLE)
      .select({
        view: 'Grid view'
      })
      .all();

    console.log('Raw domain records:', records);

    return records.map(record => ({
      id: record.get('id') as string,
      recordId: record.id,  // Airtable's internal record ID
      name: record.get('name') as string,
      description: record.get('description') as string,
      color: record.get('color') as string,
    }));
  } catch (error) {
    console.error('Error fetching domains:', error);
    throw error;
  }
}; 