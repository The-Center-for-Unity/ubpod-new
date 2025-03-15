// src/components/initiatives/InitiativesHeader.tsx
import React from 'react';

export function InitiativesHeader() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Our Initiatives</h1>
          <p className="text-xl text-gray-600">
            These initiatives represent concrete ways we're supporting spiritual seekers. 
            Each project serves a unique role in our ecosystem, often spanning multiple 
            domains of our framework.
          </p>
        </div>
      </div>
    </div>
  );
}