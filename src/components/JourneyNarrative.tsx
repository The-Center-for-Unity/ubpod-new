// src/components/JourneyNarrative.tsx
import React from 'react';
import { narrativeContent } from '../data/content';

export function JourneyNarrative() {
  return (
    <section className="py-20 bg-navy">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-16">
          <h2 className="title-main text-center">
            A Journey of Discovery
          </h2>
          
          <div className="bg-navy-light/50 rounded-lg p-8 space-y-6">
            <p className="body-lg">
              Meet Sarah. She's 28, works in tech, and by conventional standards, she's successful. 
              But lately, she's been feeling an inexplicable emptiness - what some might call a God-shaped 
              hole in her heart.
            </p>
            <p className="body-lg">
              Sarah represents millions of young people today. They're asking profound questions about 
              meaning, purpose, and their place in an increasingly complex world. They're seeking 
              authentic spiritual connection, but they don't know where to turn.
            </p>
          </div>

          <div className="space-y-12">
            {Object.values(narrativeContent.framework).map((section, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold font-cinzel font-semibold">
                    {index + 1}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="section-subtitle">
                    {section.title}
                  </h3>
                  <div className="body-lg">
                    {section.story}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}