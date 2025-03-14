import React from 'react';
import { Hero } from '../components/Hero';
import { ChallengeSection } from '../components/ChallengeSection';
import { TriangleFramework } from '../components/framework/TriangleFramework';
import { ProjectEcosystem } from '../components/ProjectEcosystem';

export default function Home() {
  return (
    <main>
      <Hero />
      <ChallengeSection />
      <TriangleFramework />
      <ProjectEcosystem />
    </main>
  );
} 