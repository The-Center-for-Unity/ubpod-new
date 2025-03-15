// src/components/framework/DomainCards.tsx
import React from 'react';
import { Domain } from '../../types';

interface DomainCardsProps {
  domains: Domain[];
}

export function DomainCards({ domains }: DomainCardsProps) {
  return (
    <div className="section-spacing">
      <div className="text-center space-y-12">
        <div className="space-y-6">
          <h2 className="title-main text-3xl md:text-4xl tracking-[0.25em] text-center">
            A Framework for
            <br />
            Spiritual
            <br />
            Discovery
          </h2>
          <p className="body-lg max-w-2xl mx-auto text-white/90">
            Three essential elements that support authentic spiritual discovery, 
            working together to create a supportive ecosystem for growth.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
        {domains.map(domain => (
          <DomainCard key={domain.id} domain={domain} />
        ))}
      </div>
    </div>
  );
}

interface DomainCardProps {
  domain: Domain;
}

function DomainCard({ domain }: DomainCardProps) {
  return (
    <div className="bg-navy-light rounded-xl p-8 shadow-xl border border-white/5 hover:border-gold/20 transition-colors space-y-6">
      <div className="flex items-center justify-center">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: `${domain.color}15` 
          }}
        >
          <div 
            className="w-10 h-10 rounded-full"
            style={{ 
              backgroundColor: `${domain.color}30` 
            }} 
          />
        </div>
      </div>
      
      <h3 className="section-subtitle text-center" style={{ color: domain.color }}>
        {domain.name}
      </h3>
      
      <div className="body-lg text-center">
        {domain.description}
      </div>
    </div>
  );
}