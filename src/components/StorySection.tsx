// src/components/StorySection.tsx
import React from 'react';

export function StorySection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">A World Seeking Connection</h2>
        <div className="prose prose-lg max-w-none">
          <p className="mb-6">
            In today's fast-paced world, many find themselves successful by conventional 
            measures, yet feeling disconnected from their spiritual nature.
          </p>
          <div className="bg-white rounded-lg p-8 shadow-sm my-8">
            <p className="text-lg mb-4">
              Meet Sarah. She's 25, successful in her career, but feels something is missing. 
              She's not religious, but she's seeking meaning. Where does Sarah go? Who guides her?
            </p>
            <p className="text-lg">
              Sarah's story is not unique. In today's world, many young people find themselves 
              adrift, searching for purpose and connection in a sea of distractions and 
              superficial relationships.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}