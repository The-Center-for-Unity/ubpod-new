// src/components/framework/FrameworkDescription.tsx
import React from 'react';

interface FrameworkDescriptionProps {
  onLearnMore: () => void;
}

export function FrameworkDescription({ onLearnMore }: FrameworkDescriptionProps) {
  return (
    <div className="text-center mb-12">
      <h2 className="title-subtitle text-2xl tracking-wide mb-6">
        Understanding the Framework
      </h2>
      
      <div className="max-w-2xl mx-auto">
        <p className="body-lg text-white/80 mb-6">
          Our framework recognizes that authentic spiritual growth emerges through 
          the interplay of three essential elements: discovery through personal 
          experience, connection with fellow seekers, and engagement with timeless wisdom.
        </p>
        
        <button
          onClick={onLearnMore}
          className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors text-sm tracking-wide"
        >
          Learn more about our approach
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
}