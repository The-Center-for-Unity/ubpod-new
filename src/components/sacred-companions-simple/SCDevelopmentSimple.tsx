import React from 'react';
import { motion } from 'framer-motion';
import { scContentSimple } from '../../data/sc-content-simple';

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

interface StageCardProps {
  title: string;
  description: string;
  points: string[];
  index: number;
  isLast: boolean;
}

function StageCard({ title, description, points, index, isLast }: StageCardProps) {
  return (
    <motion.div 
      variants={itemVariants}
      className="relative"
    >
      {/* Connection Line */}
      {!isLast && (
        <div className="absolute top-24 bottom-0 left-6 w-px bg-gold/20 z-0" />
      )}

      <div className="relative z-10 bg-navy-light/30 rounded-lg p-8 border border-white/5 hover:border-gold/20 transition-colors">
        {/* Stage Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
              <span className="text-gold font-cinzel font-semibold">{index + 1}</span>
            </div>
          </div>
          <div>
            <h3 className="title-subtitle text-xl mb-2 text-white/90">
              {title}
            </h3>
            <p className="body-lg text-white/70">
              {description}
            </p>
          </div>
        </div>

        {/* Points */}
        <div className="space-y-4 ml-16">
          <h4 className="text-sm font-medium text-gold/80 uppercase tracking-wider">
            Key Requirements
          </h4>
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
      </div>
    </motion.div>
  );
}

export function SCDevelopmentSimple() {
  const { development } = scContentSimple;
  
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Section Header */}
      <motion.div 
        className="text-center mb-20 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="title-main text-3xl md:text-4xl tracking-[0.15em]">
          {development.title}
        </h2>
        <p className="body-lg text-white/80 max-w-3xl mx-auto tracking-wide">
          {development.description}
        </p>
      </motion.div>

      {/* Development Stages */}
      <motion.div 
        className="space-y-8 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {development.sections.map((section, index) => (
          <StageCard
            key={index}
            index={index}
            title={section.title}
            description={section.description}
            points={section.points}
            isLast={index === development.sections.length - 1}
          />
        ))}
      </motion.div>

      {/* Growth Statement */}
      <motion.div 
        className="mt-16 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <p className="body-lg text-white/70 max-w-2xl mx-auto italic">
          Your journey as a Sacred Companion is one of continuous growth, 
          supported by our community every step of the way.
        </p>
      </motion.div>
    </div>
  );
} 