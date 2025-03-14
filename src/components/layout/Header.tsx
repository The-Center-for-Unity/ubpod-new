import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { path: '/urantia-papers', label: 'The Urantia Papers' },
    { path: '/sadler-workbooks', label: 'Dr. Sadler\'s Workbooks' },
    { path: '/discover-jesus', label: 'Discover Jesus' },
    { path: '/history', label: 'A History of the Urantia Papers' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy/80 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
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
              className="text-white/70 hover:text-white/90 transition-colors text-sm"
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white/70 hover:text-white/90"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="md:hidden fixed inset-0 bg-navy z-40"
        initial={{ opacity: 0, x: '100%' }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          x: isMobileMenuOpen ? 0 : '100%'
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full pt-20 px-6">
          <nav className="space-y-6">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block text-xl text-white/70 hover:text-white/90 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/disclaimer"
              className="block text-xl text-white/70 hover:text-white/90 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Disclaimer
            </Link>
            <a
              href="https://www.thecenterforunity.org/contribute"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-2 bg-gold text-navy rounded-full
                        hover:bg-gold-light transition-all duration-300 btn-text mt-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pay It Forward
            </a>
          </nav>
        </div>
      </motion.div>
    </header>
  );
} 