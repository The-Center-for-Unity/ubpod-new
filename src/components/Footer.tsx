import React from 'react';

export function Footer() {
  return (
    <footer className="py-12 bg-navy border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <p className="body-lg text-white/70">
            The Divine Within is an initiative of{' '}
            <a 
              href="https://thecenterforunity.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gold hover:text-gold/80 transition-colors tracking-wider"
            >
              The Center for Unity
            </a>
          </p>
          <p className="body-lg text-white/50 tracking-wide">
            Supporting spiritual seekers through technology, human connection, and timeless wisdom
          </p>
        </div>
      </div>
    </footer>
  );
} 