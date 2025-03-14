import React, { useState } from 'react';
import { FionaStoryModal } from './FionaStoryModal';

export const ChallengeSection: React.FC = () => {
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-purple-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1A1A1A] mb-6">
            A World Seeking Connection
          </h2>
          <p className="text-xl text-[#4A4A4A] max-w-3xl mx-auto">
            In today's fast-paced world, many find themselves successful by conventional measures, 
            yet feeling disconnected from their spiritual nature.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Story Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative">
            <div className="relative z-10">
              <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
                Meet Fiona. She's 32, a successful tech professional, and by all outward measures, she's thriving. 
                Yet beneath the surface, she feels an inexplicable emptiness - what some might call a God-shaped hole in the heart.
              </p>
              <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
                Like many of her generation, Fiona isn't drawn to traditional religious institutions, 
                but she knows she's searching for something deeper than her daily routine can provide.
              </p>
              
              {/* Read More Button */}
              <button
                onClick={() => setIsStoryModalOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-[#9370DB] text-white rounded-lg hover:bg-[#B19CD9] transition-colors gap-2 group"
              >
                Read Fiona's Story
                <svg 
                  className="w-5 h-5 transform transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="/images/fiona-sanchez.png"
                alt="Fiona, a spiritual seeker in the modern world"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Story Modal */}
      <FionaStoryModal 
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
      />
    </section>
  );
}; 