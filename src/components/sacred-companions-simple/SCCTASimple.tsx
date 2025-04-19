import React from 'react';
import { motion } from 'framer-motion';
import { scContentSimple } from '../../data/sc-content-simple';

// Lotus icon component for spiritual emphasis
function LotusIcon() {
  return (
    <svg 
      className="w-12 h-12 text-gold/60"
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5"
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 2c3 3 3 7 0 10-3-3-3-7 0-10z" />
      <path d="M19 9c-3 3-7 3-10 0 3-3 7-3 10 0z" />
      <path d="M5 9c3 3 7 3 10 0-3-3-7-3-10 0z" />
      <path d="M12 12c3 3 3 7 0 10-3-3-3-7 0-10z" />
    </svg>
  );
}

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

export function SCCTASimple() {
  const { cta } = scContentSimple;
  
  const handleContactClick = () => {
    window.location.href = `mailto:${cta.contactEmail}?subject=Sacred Companions Inquiry`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <motion.div 
        className="relative bg-navy-light/30 rounded-lg border border-gold/20 p-12 md:p-16 text-center overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-40 h-40 opacity-5">
          <LotusIcon />
        </div>
        <div className="absolute bottom-0 right-0 w-40 h-40 opacity-5 transform rotate-180">
          <LotusIcon />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          {/* Icon */}
          <motion.div 
            className="flex justify-center"
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center">
              <LotusIcon />
            </div>
          </motion.div>

          {/* Title & Description */}
          <div className="space-y-6">
            <h2 className="title-main text-3xl md:text-4xl tracking-[0.15em]">
              {cta.title}
            </h2>
            <p className="body-lg text-white/80 max-w-2xl mx-auto tracking-wide">
              {cta.description}
            </p>
          </div>

          {/* Contact Email */}
          <div className="text-gold/80 font-medium">
            {cta.contactEmail}
          </div>

          {/* Action Button */}
          <motion.button
            onClick={handleContactClick}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-navy font-semibold rounded-full 
                     hover:bg-gold-light transition-colors duration-300 tracking-wide group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{cta.buttonText}</span>
            <EmailIcon />
          </motion.button>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-white/10">
            {cta.trustIndicators.map((indicator, idx) => (
              <div key={idx} className="text-center px-4">
                <div className="text-gold font-cinzel text-lg mb-3">
                  {indicator.title}
                </div>
                <p className="text-white/60 text-sm max-w-xs mx-auto">
                  {indicator.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
} 