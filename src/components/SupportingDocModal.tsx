import React from 'react';

interface SupportingDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportingDocModal: React.FC<SupportingDocModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-navy rounded-lg max-w-xl w-full max-h-[80vh] overflow-hidden relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white/70 hover:text-white/90 transition-colors z-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[80vh] space-y-3">
          <div className="space-y-0.5 text-center">
            <h2 className="text-base font-cinzel tracking-wide">
              Supporting the Search for God
            </h2>
            <h3 className="text-sm text-white/70">
              A Framework for Service
            </h3>
          </div>
          
          <div className="space-y-3 text-white/80">
            <div className="space-y-1">
              <h3 className="text-sm font-medium uppercase tracking-wider text-white/90">Introduction</h3>
              <p className="text-base">
                In today's rapidly evolving spiritual landscape, we face a unique challenge: how do we effectively support 
                those seeking a deeper connection with God while honoring their individual paths and modern context?
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium uppercase tracking-wider text-white/90">The Three Domains</h3>
              
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium text-gold">Discovery Domain</h4>
                  <p className="text-base">
                    The Discovery domain recognizes that many seekers begin their journey through informal, self-directed 
                    exploration. This might include podcasts, articles, videos, or interactive tools that allow them to 
                    explore spiritual concepts at their own pace. The key is accessibility without pressure, creating safe 
                    entry points for spiritual exploration.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gold">Connection Domain</h4>
                  <p className="text-base">
                    As seekers progress, they often need human connection to deepen their journey. The Connection domain 
                    provides safe, nurturing environments for authentic spiritual exploration. This includes small groups, 
                    mentoring relationships, and communities where seekers can share their questions and experiences without 
                    judgment.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gold">Wisdom Domain</h4>
                  <p className="text-base">
                    When seekers are ready, they naturally gravitate toward deeper spiritual teachings. The Wisdom domain 
                    makes profound spiritual teachings accessible in ways that respect both the teachings' integrity and 
                    the seeker's personal journey. This includes structured study programs, in-depth resources, and 
                    guidance from experienced spiritual companions.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium uppercase tracking-wider text-white/90">Integration and Movement</h3>
              <p className="text-base">
                While presented as distinct domains, these areas naturally overlap and interact. Seekers move between 
                them fluidly, often engaging with multiple domains simultaneously. Our framework recognizes this 
                natural movement, supporting various entry points and pathways while maintaining coherence and depth.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium uppercase tracking-wider text-white/90">Technology's Role</h3>
              <p className="text-base">
                Modern technology allows us to support these domains in unprecedented ways. Digital platforms can 
                create accessible entry points, facilitate meaningful connections, and make wisdom teachings available 
                when seekers are ready. However, technology should always serve the human and spiritual elements of 
                the journey, not replace them.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium uppercase tracking-wider text-white/90">Conclusion</h3>
              <p className="text-base">
                This framework provides a structure for developing and organizing initiatives that support spiritual 
                seekers effectively. By understanding how these domains interact and complement each other, we can 
                create a comprehensive ecosystem that supports authentic spiritual discovery while respecting each 
                person's unique journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 