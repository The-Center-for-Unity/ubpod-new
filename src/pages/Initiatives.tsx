// src/pages/Initiatives.tsx
import React from 'react';
import { TriangleFramework } from '../components/framework/TriangleFramework';
import { ProjectList } from '../components/initiatives/ProjectList';

function InitiativesPage() {
  return (
    <main className="flex flex-col bg-navy text-white min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-navy">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h1 className="title-main text-3xl md:text-4xl tracking-[0.15em]">
            Our
            <br />
            Spiritual
            <br />
            Initiatives
          </h1>
          <p className="body-lg text-white/80 tracking-wide">
            Below you'll find projects and initiatives that support spiritual seekers 
            at different stages of their journey. Each project is positioned within our 
            framework based on its focus areas.
          </p>
        </div>
      </section>

      {/* Framework Visualization */}
      <section className="py-12 bg-navy-light/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="-mb-8">
            <TriangleFramework />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-16 space-y-8">
            <div className="space-y-4 text-center">
              <h2 className="title-subtitle tracking-wide">Using the filters</h2>
              <p className="body-lg text-white/70">
                Narrow down projects by domain focus, provider, or development status.
              </p>
            </div>
            
            <div className="space-y-4 text-center">
              <h2 className="title-subtitle tracking-wide">Reading the cards</h2>
              <p className="body-lg text-white/70">
                Each card shows a project's name, brief description, and its alignment 
                with our three domains. Click for more details.
              </p>
            </div>
          </div>

          <ProjectList />
        </div>
      </section>
    </main>
  );
}

export default InitiativesPage;