import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <Layout>
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          className="max-w-3xl mx-auto text-center space-y-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="title-main text-5xl tracking-[0.15em]">
            Urantia Book
            <br />
            Podcast
          </h1>
          <p className="section-subtitle text-xl text-gold tracking-wide">
            Experience AI-powered audio journeys through the Urantia Papers
          </p>
          <p className="body-lg max-w-2xl mx-auto tracking-wide">
            Explore the profound teachings of The Urantia Book through AI-narrated episodes.
            Listen while reading along with the original text.
          </p>
        </motion.div>

        {/* Coming Soon Message */}
        <div className="bg-navy-light/30 rounded-lg p-8 border border-white/5 text-center max-w-2xl mx-auto">
          <h2 className="title-subtitle mb-4">Coming Soon</h2>
          <p className="body-lg">
            We're currently working on migrating the UrantiaBookPod to this new platform.
            Please check back soon for the full experience!
          </p>
        </div>
      </div>
    </Layout>
  );
} 