import React from 'react';
import { motion } from 'framer-motion';
import { scContent } from '../../data/sc-content';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

interface SectionProps {
  title: string;
  description: string;
  points: string[];
}

function CouncilCard({ title, description, points }: SectionProps) {
  return (
    <motion.div 
      variants={itemVariants}
      className="bg-navy-light/30 rounded-lg p-8 border border-white/5 hover:border-gold/20 transition-colors"
    >
      <div className="space-y-6">
        <h3 className="title-subtitle text-xl text-white/90">
          {title}
        </h3>
        <p className="body-lg text-white/70">
          {description}
        </p>
        <ul className="space-y-3">
          {points.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
              </div>
              <span className="body-lg text-white/80">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function SCCouncil() {
  const { council } = scContent;
  
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <motion.div 
        className="text-center mb-16 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="title-main text-3xl md:text-4xl tracking-[0.15em]">
          {council.title}
        </h2>
        <p className="body-lg text-white/80 max-w-3xl mx-auto tracking-wide">
          {council.description}
        </p>
      </motion.div>

      {/* Council Cards */}
      <motion.div 
        className="grid md:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {council.sections.map((section, index) => (
          <CouncilCard
            key={index}
            title={section.title}
            description={section.description}
            points={section.points}
          />
        ))}
      </motion.div>
    </div>
  );
} 