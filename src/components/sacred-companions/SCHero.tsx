import React from 'react';
import { motion } from 'framer-motion';
import { scContent } from '../../data/sc-content';

export function SCHero() {
  const { hero } = scContent;
  
  return (
    <section 
      className="relative min-h-screen bg-navy"
      style={{
        backgroundImage: 'url("/images/sc/spiritual-companionship.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay with slightly more transparency for SC */}
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
                className="mt-8 px-8 py-4 bg-gold text-navy font-semibold rounded-full 
                         hover:bg-gold-light transition-colors duration-300 tracking-wide"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {hero.callToAction}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 