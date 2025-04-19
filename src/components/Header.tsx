// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy/80 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/favicon_io/favicon-32x32.png"
              alt="The Divine Within"
              className="w-6 h-6"
            />
            <span className="title-subtitle text-sm tracking-[0.15em]">
              The Divine Within
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="body-lg text-sm text-white/70 hover:text-white/90 transition-colors tracking-wider"
            >
              Overview
            </Link>
            <Link 
              to="/initiatives" 
              className="body-lg text-sm text-white/70 hover:text-white/90 transition-colors tracking-wider"
            >
              Initiatives
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}