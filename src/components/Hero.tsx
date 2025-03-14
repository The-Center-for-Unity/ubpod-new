import React from 'react';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section 
      className="relative min-h-screen bg-navy"
      style={{
        backgroundImage: 'url("/images/not-thriving-in-closest-relationships.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-navy/80" />

      {/* Content */}
      <div className="relative pt-20 pb-4 sm:pt-24 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="/favicon_io/android-chrome-512x512.png" 
              alt="The Divine Within Logo" 
              className="h-32 w-32 mx-auto relative z-10"
            />
            <div className="space-y-6">
              <h1 className="title-main">
                The Divine Within
              </h1>
              <p className="section-subtitle">
                Bridging the gap between seeking and finding
              </p>
              <div className="body-lg">
                In a world where traditional paths to spirituality feel increasingly distant, 
                we're creating spaces for authentic connection with the divine. Through technology, 
                human relationships, and timeless wisdom, we're helping people discover their own 
                unique spiritual journey.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}