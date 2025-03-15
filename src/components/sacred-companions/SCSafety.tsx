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

// Shield icon component for safety emphasis
function ShieldIcon() {
  return (
    <svg 
      className="w-6 h-6 text-gold"
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

// Check icon component for points
function CheckIcon() {
  return (
    <svg 
      className="w-5 h-5 text-gold"
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

interface SafetyCardProps {
  title: string;
  description: string;
  points: string[];
}

function SafetyCard({ title, description, points }: SafetyCardProps) {
  return (
    <motion.div 
      variants={itemVariants}
      className="bg-navy-light/30 rounded-lg p-8 border border-white/5 hover:border-gold/20 transition-colors"
    >
      {/* Card Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
          <ShieldIcon />
        </div>
        <div>
          <h3 className="title-subtitle text-xl text-white/90">
            {title}
          </h3>
          <p className="text-white/70 mt-1">
            {description}
          </p>
        </div>
      </div>

      {/* Safety Points */}
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
    </motion.div>
  );
}

export function SCSafety() {
  const { safety } = scContent;
  
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Section Header with Enhanced Trust Elements */}
      <motion.div 
        className="text-center mb-20 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
            <ShieldIcon />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-6">
          <h2 className="title-main text-3xl md:text-4xl tracking-[0.15em]">
            {safety.title}
          </h2>
          <p className="body-lg text-white/80 max-w-3xl mx-auto tracking-wide">
            {safety.description}
          </p>
        </div>
      </motion.div>

      {/* Safety Framework Cards */}
      <motion.div 
        className="grid md:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {safety.sections.map((section, index) => (
          <SafetyCard
            key={index}
            title={section.title}
            description={section.description}
            points={section.points}
          />
        ))}
      </motion.div>

      {/* Trust Statement */}
      <motion.div 
        className="mt-16 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <p className="body-lg text-white/70 max-w-2xl mx-auto italic">
          Our commitment to safety and ethics forms the foundation of every interaction 
          within the Sacred Companions community.
        </p>
      </motion.div>
    </div>
  );
} 