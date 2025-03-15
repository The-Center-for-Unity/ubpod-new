import React from 'react';

interface FionaStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FionaStoryModal: React.FC<FionaStoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[90vh]">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-6">Finding God in the Age of Uncertainty</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="mb-4">
              Meet Fiona. She's 32, works in tech, and by conventional standards, she's successful. 
              But lately, she's been feeling an inexplicable emptiness - what some might call a God-shaped 
              hole in her heart. She's not interested in traditional religion, but she knows she's searching 
              for something deeper than her daily routine can provide.
            </p>

            <p className="mb-4">
              Fiona represents millions of young professionals today. They're asking profound questions about meaning, 
              purpose, and their place in an increasingly complex world. They're seeking authentic spiritual 
              connection, but they don't know where to turn.
            </p>

            <p className="mb-4">
              One evening, while searching online for answers, Fiona discovers a podcast that speaks to her 
              experience. The hosts aren't pushing any particular belief system. Instead, they're having honest 
              conversations about the spiritual journey, featuring people who've walked similar paths. For the 
              first time, Fiona feels understood. She's not alone in her searching.
            </p>

            <p className="mb-4">
              Through the podcast platform, Fiona finds a community of fellow seekers. She's invited to join 
              a small "circle of trust" - a group of people at similar stages in their spiritual journey. Here, 
              she can share her questions and doubts without judgment. The circle is guided by someone who's 
              further along the path, but who speaks from experience rather than authority.
            </p>

            <p className="mb-4">
              As Fiona grows more comfortable in her exploration, she's connected with Elena, an experienced 
              spiritual companion. Their relationship isn't about following a prescribed path. Instead, Elena 
              helps Fiona recognize and trust her own inner spiritual compass. Through their conversations, 
              Fiona begins to sense a personal connection with the divine that she never thought possible.
            </p>

            <p>
              This is a journey that countless others are ready to begin. Through our framework and projects, 
              we're creating the spaces where stories like Fiona's can unfold naturally, supporting each 
              person's unique path to spiritual discovery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 