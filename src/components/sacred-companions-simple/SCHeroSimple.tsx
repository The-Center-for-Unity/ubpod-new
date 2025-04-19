import React from 'react';
import { motion } from 'framer-motion';
import { scContentSimple } from '../../data/sc-content-simple';

// Email icon for the button
function EmailIcon() {
  return (
    <svg 
      className="w-5 h-5"
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  );
}

export function SCHeroSimple() {
  const { hero, cta } = scContentSimple;
  
  const handleContactClick = () => {
    window.location.href = `mailto:${cta.contactEmail}?subject=Sacred Companions Inquiry`;
  };
  
  return (
    <section 
      className="relative min-h-screen bg-navy"
      style={{
        backgroundImage: 'url("/images/sc/spiritual-companionship.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-navy/70" />

      {/* Content */}
      <div className="relative pt-20 pb-4 sm:pt-24 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo */}
            <img 
              src="/images/sc/sc-logo.png"
              alt="Sacred Companions Logo" 
              className="h-32 w-32 mx-auto relative z-10"
            />

            {/* Title and Content */}
            <div className="space-y-6">
              <h1 className="title-main text-4xl md:text-5xl lg:text-6xl font-cinzel tracking-wider text-white">
                {hero.title}
              </h1>
              
              <p className="section-subtitle text-xl md:text-2xl text-gold tracking-widest font-cinzel">
                {hero.subtitle}
              </p>

              <div className="body-lg text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
                {hero.description}
              </div>

              {/* CTA Button */}
              <motion.button
                onClick={handleContactClick}
                className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-gold text-navy font-semibold rounded-full 
                         hover:bg-gold-light transition-colors duration-300 tracking-wide group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{hero.callToAction}</span>
                <EmailIcon />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 