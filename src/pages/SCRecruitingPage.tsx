import React from 'react';
import { SCHero } from '../components/sacred-companions/SCHero';
import { SCVision } from '../components/sacred-companions/SCVision';
import { SCCouncil } from '../components/sacred-companions/SCCouncil';
import { SCSafety } from '../components/sacred-companions/SCSafety';
import { SCDevelopment } from '../components/sacred-companions/SCDevelopment';
import { SCCTA } from '../components/sacred-companions/SCCTA';

export default function SCRecruitingPage() {
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