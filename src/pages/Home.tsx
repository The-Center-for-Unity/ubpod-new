// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { JourneyNarrative } from '../components/JourneyNarrative';
import { DomainCards } from '../components/framework/DomainCards';
import { VisionSection } from '../components/VisionSection';
import { getDomains } from '../services/airtable';
import { Domain } from '../types';

export default function HomePage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDomains() {
      try {
        const domainsData = await getDomains();
        setDomains(domainsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load domains');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDomains();
  }, []);

  return (
    <main className="flex flex-col bg-navy text-white">
      {/* Hero Section */}
      <section className="bg-navy bg-hero-pattern bg-cover bg-center bg-no-repeat">
        <div className="max-w-6xl mx-auto px-4">
          <Hero />
        </div>
      </section>

      {/* Journey Narrative Section */}
      <section className="py-20 bg-navy-light">
        <div className="max-w-6xl mx-auto px-4">
          <JourneyNarrative />
        </div>
      </section>

      {/* Domain Cards Section */}
      <section className="py-20 bg-navy">
        <div className="max-w-6xl mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400">Error loading domains: {error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-navy-light hover:bg-opacity-80 rounded-md transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <DomainCards domains={domains} />
          )}
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-navy-light">
        <div className="max-w-6xl mx-auto px-4">
          <VisionSection />
        </div>
      </section>
    </main>
  );
}