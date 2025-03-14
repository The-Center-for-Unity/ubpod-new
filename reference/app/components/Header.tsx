'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md relative">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left section - Logo and Series Dropdown */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="Urantia Book Podcast Logo" 
              width={40} 
              height={40} 
              className="mr-3"
            />
            <span className="text-xl font-bold text-primary">Urantia Book Podcast</span>
          </Link>
          
          {/* Series Dropdown Menu - Desktop Only */}
          <div className="relative group ml-8 hidden md:block">
            <button className="flex items-center space-x-1 text-gray-700 hover:text-primary">
              <span>Series</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1">
                <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  The Urantia Papers
                </Link>
                <Link href="/sadler-workbooks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Dr. Sadler's Workbooks
                </Link>
                <Link href="/discover-jesus" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Discover Jesus
                </Link>
                <Link href="/history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  A History of the Urantia Papers
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Center section - Pay It Forward Button */}
        <div className="hidden md:flex items-center space-x-4">
          <Link 
            href="/disclaimer" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-700 hover:text-primary font-medium underline"
          >
            Disclaimer
          </Link>
          <a 
            href="https://www.thecenterforunity.org/contribute" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-primary text-white px-4 py-2 rounded-full font-fira-sans font-bold hover:bg-primary-dark transition duration-300 flex items-center justify-center text-center whitespace-nowrap"
          >
            Pay It Forward
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden z-50" 
          aria-label="Menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>

        {/* Mobile Menu Overlay */}
        <div className={`
          fixed inset-0 bg-white z-40 md:hidden
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="pt-20 px-4">
            <nav className="space-y-6">
              <Link 
                href="/" 
                className="block text-lg text-gray-700 hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                The Urantia Papers
              </Link>
              <Link 
                href="/sadler-workbooks" 
                className="block text-lg text-gray-700 hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dr. Sadler's Workbooks
              </Link>
              <Link href="/discover-jesus" className="block text-lg text-gray-700 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                Discover Jesus
              </Link>
              <Link href="/history" className="block text-lg text-gray-700 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                A History of the Urantia Papers
              </Link>
              <Link 
                href="/disclaimer" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-lg text-gray-700 hover:text-primary font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Disclaimer
              </Link>
              <a 
                href="https://www.thecenterforunity.org/contribute" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block bg-primary text-white px-4 py-2 rounded-full font-fira-sans font-bold hover:bg-primary-dark transition duration-300 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pay It Forward
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
