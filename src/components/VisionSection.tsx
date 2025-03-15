// src/components/VisionSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export function VisionSection() {
  return (
    <section className="py-20 bg-navy">
      <div className="max-w-6xl mx-auto px-4">
        {/* Vision Statement */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-6">
          <h2 className="title-main text-3xl md:text-4xl tracking-[0.15em]">
            Creating
            <br />
            Spaces for
            <br />
            Spiritual Growth
          </h2>
          <p className="body-lg text-white/80 tracking-wide">
            We're building more than a platform - we're creating an ecosystem where spiritual seekers 
            can explore, connect, and grow at their own pace.
          </p>
        </div>

        {/* Key Elements Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {visionElements.map((element, index) => (
            <VisionCard key={index} {...element} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-navy-light/30 rounded-lg p-12 text-center max-w-3xl mx-auto">
          <p className="body-lg mb-12">
            Together, we can create a future where more people can discover the 
            divine within themselves, supported by a community of fellow seekers 
            and experienced guides.
          </p>
          
          <div className="space-y-6">
            <p className="title-subtitle tracking-wide">
              Explore our growing ecosystem of spiritual initiatives
            </p>
            <Link 
              to="/initiatives"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-full 
                        hover:bg-opacity-90 transition-all duration-300 btn-text group"
            >
              Browse All Initiatives
              <span className="ml-2 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

interface VisionElementProps {
  title: string;
  description: string;
}

function VisionCard({ title, description }: VisionElementProps) {
  return (
    <div className="bg-navy-light/30 rounded-lg p-8">
      <h3 className="title-subtitle tracking-wide mb-4 text-white/90">
        {title}
      </h3>
      <p className="body-lg text-white/70">
        {description}
      </p>
    </div>
  );
}

const visionElements: VisionElementProps[] = [
  {
    title: "Safe Spaces for Growth",
    description: "We provide environments where seekers can be vulnerable, express their doubts and struggles, and receive guidance from those who have walked this path before."
  },
  {
    title: "Supportive Community",
    description: "Through Circles of Trust and experienced Spiritual Companions, we create connections that nurture authentic spiritual exploration."
  },
  {
    title: "Guided Discovery",
    description: "Our approach honors individual journeys while providing structured support through technology and human wisdom."
  },
  {
    title: "Ethical Foundation",
    description: "Built on clear principles of integrity and safety, ensuring every interaction supports genuine spiritual growth."
  }
];