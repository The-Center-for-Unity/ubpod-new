import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, BookOpen, Library } from 'lucide-react';
import { LanguageSwitcher } from '../../i18n/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../i18n/LanguageContext';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation('common');
  const { language } = useLanguage();

  // Main navigation items
  const navigationItems = [
    { 
      path: '/urantia-papers', 
      label: t('nav.urantia_papers'), 
      icon: <BookOpen className="h-4 w-4 mr-2" /> 
    },
    { 
      path: '/series', 
      label: t('nav.series_collections'), 
      icon: <Library className="h-4 w-4 mr-2" /> 
    },
    { 
      path: '/contact', 
      label: t('nav.contact') 
    },
  ];

  // Function to localize URLs
  const getLocalizedPath = (path: string): string => {
    if (language === 'en') return path;
    return `/${language}${path}`;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-navy/80 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Language Switcher (Left Side) */}
            <div className="flex items-center space-x-4">
              <Link to={getLocalizedPath("/")} className="flex items-center space-x-2">
                <img 
                  src="/logo.png" 
                  alt={t('site.logo_alt')} 
                  className="h-7 w-auto" 
                />
                <div className="flex flex-col hidden sm:block">
                  <span className="title-subtitle text-xs tracking-[0.1em] leading-tight text-white/90">
                    {language === 'es' ? 'PODCAST DEL' : 'THE URANTIA'}
                  </span>
                  <span className="title-subtitle text-xs tracking-[0.1em] leading-tight text-white/90">
                    {language === 'es' ? 'LIBRO DE URANTIA' : 'BOOK PODCAST'}
                  </span>
                </div>
              </Link>
              
              {/* Language Switcher next to logo on mobile, hidden on desktop */}
              <div className="md:hidden">
                <LanguageSwitcher compact={true} />
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {/* Main navigation items */}
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={getLocalizedPath(item.path)}
                  className="body-lg flex items-center text-sm text-white/70 hover:text-white/90 transition-colors tracking-wider whitespace-nowrap"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              <Link
                to={getLocalizedPath("/disclaimer")}
                target="_blank"
                rel="noopener noreferrer"
                className="body-lg text-sm text-white/70 hover:text-white/90 transition-colors tracking-wider whitespace-nowrap"
              >
                {t('nav.disclaimer')}
              </Link>
              
              {/* Action button and language switcher in a separate container */}
              <div className="flex items-center space-x-3">
                <a
                  href="https://www.thecenterforunity.org/contribute"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 bg-gold text-navy rounded-full
                            hover:bg-gold-light transition-all duration-300 text-xs font-medium"
                >
                  {t('nav.pay_it_forward')}
                </a>
                
                <LanguageSwitcher compact={true} />
              </div>
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
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="/logo.png" 
                  alt={t('site.logo_alt')} 
                  className="h-10 w-auto" 
                />
                <div className="flex flex-col">
                  <span className="title-subtitle text-sm tracking-[0.1em] leading-tight text-white/90">
                    {language === 'es' ? 'PODCAST DEL' : 'THE URANTIA'}
                  </span>
                  <span className="title-subtitle text-sm tracking-[0.1em] leading-tight text-white/90">
                    {language === 'es' ? 'LIBRO DE URANTIA' : 'BOOK PODCAST'}
                  </span>
                </div>
              </div>
              
              {/* Main navigation items in mobile menu */}
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={getLocalizedPath(item.path)}
                  className="flex items-center text-2xl font-semibold text-white hover:text-gold transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              
              <Link
                to={getLocalizedPath("/disclaimer")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-semibold text-white hover:text-gold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.disclaimer')}
              </Link>
              <a
                href="https://www.thecenterforunity.org/contribute"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gold text-navy rounded-full
                          hover:bg-gold-light transition-all duration-300 text-lg font-medium mt-4 self-start"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.pay_it_forward')}
              </a>
              
              <div className="mt-6">
                <LanguageSwitcher compact={false} />
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
} 