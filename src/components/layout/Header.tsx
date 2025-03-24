import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simplified to only include The Urantia Papers
  const navigationItems = [
    { path: '/urantia-papers', label: 'The Urantia Papers' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-navy/80 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="UrantiaBookPod Logo" 
                className="h-8 w-auto" 
              />
              <span className="title-subtitle text-sm tracking-[0.15em]">
                Urantia Book Podcast
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="body-lg text-sm text-white/70 hover:text-white/90 transition-colors tracking-wider"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/disclaimer"
                target="_blank"
                rel="noopener noreferrer"
                className="body-lg text-sm text-white/70 hover:text-white/90 transition-colors tracking-wider"
              >
                Disclaimer
              </Link>
              <a
                href="https://www.thecenterforunity.org/contribute"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-2 bg-gold text-navy rounded-full
                          hover:bg-gold-light transition-all duration-300 btn-text"
              >
                Pay It Forward
              </a>
            </nav>

            {/* Mobile Menu Button - Only show when menu is closed */}
            {!isMobileMenuOpen && (
              <button
                className="md:hidden text-white/70 hover:text-white/90 z-50 relative"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu - Separate from header to avoid z-index issues */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 md:hidden" 
          style={{ 
            backgroundColor: '#0c1631',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50
          }}
        >
          <div className="relative pt-16 px-6 pb-8">
            {/* Close Button - Positioned absolutely in the top right */}
            <button
              className="absolute top-4 right-4 text-white hover:text-gold transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-8 h-8" />
            </button>
            
            <nav className="flex flex-col space-y-8 mt-8">
              {/* Logo in mobile menu */}
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/logo.png" 
                  alt="UrantiaBookPod Logo" 
                  className="h-10 w-auto" 
                />
              </div>
              
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-2xl font-semibold text-white hover:text-gold transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/disclaimer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-semibold text-white hover:text-gold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Disclaimer
              </Link>
              <a
                href="https://www.thecenterforunity.org/contribute"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gold text-navy rounded-full
                          hover:bg-gold-light transition-all duration-300 text-lg font-medium mt-4 self-start"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pay It Forward
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
} 