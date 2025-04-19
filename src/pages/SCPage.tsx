import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { SCHero, SCVision, SCCouncil, SCSafety, SCDevelopment, SCCTA } from '../components/sacred-companions';
import { 
  SCHeroSimple, 
  SCProblemSimple,
  SCVisionSimple, 
  SCDevelopmentSimple, 
  SCCTASimple 
} from '../components/sacred-companions-simple';

export default function SCPage() {
  const [searchParams] = useSearchParams();
  const useExtendedVersion = searchParams.get('version') === 'extended';

  if (useExtendedVersion) {
    return (
      <main className="flex flex-col bg-navy text-white">
        {/* Hero Section */}
        <section className="bg-navy">
          <SCHero />
        </section>

        {/* Vision Section */}
        <section className="py-12 bg-navy-light">
          <SCVision />
        </section>

        {/* Council Section */}
        <section className="py-12 bg-navy">
          <SCCouncil />
        </section>

        {/* Safety Framework Section */}
        <section className="py-12 bg-navy-light">
          <SCSafety />
        </section>

        {/* Development Journey Section */}
        <section className="py-12 bg-navy">
          <SCDevelopment />
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-navy-light">
          <SCCTA />
        </section>
      </main>
    );
  }

  // Default to simplified version
  return (
    <main className="flex flex-col bg-navy text-white">
      {/* Hero Section */}
      <section className="bg-navy">
        <SCHeroSimple />
      </section>

      {/* Problem Section */}
      <section className="py-12 bg-navy-light">
        <SCProblemSimple />
      </section>

      {/* Vision Section */}
      <section className="py-12 bg-navy">
        <SCVisionSimple />
      </section>

      {/* Development Journey Section */}
      <section className="py-12 bg-navy-light">
        <SCDevelopmentSimple />
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-navy">
        <SCCTASimple />
      </section>
    </main>
  );
} 