// src/components/FrameworkSection.tsx
import React from 'react';
import { motion } from 'framer-motion'; // Assuming you're already using framer-motion

export function FrameworkSection() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            A Framework for Spiritual Discovery
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Through Sarah's journey, we discovered three essential elements that 
            support authentic spiritual discovery, working together to create a 
            supportive ecosystem for growth.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {domains.map((domain) => (
            <DomainCard key={domain.title} {...domain} />
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <p className="text-lg text-gray-700">
            Like Sarah, who began with a podcast before finding her circle of trust 
            and eventually deeper teachings, seekers naturally progress through these 
            domains at their own pace.
          </p>
        </div>
      </div>
    </section>
  );
}

interface DomainProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

function DomainCard({ title, description, icon, color }: DomainProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`p-6 rounded-lg bg-white shadow-sm border-t-4 ${color}`}
    >
      <div className="mb-4 w-12 h-12 mx-auto">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 text-center">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

function DiscoveryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-blue-500">
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ConnectionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-purple-500">
      <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function WisdomIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-indigo-500">
      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const domains: DomainProps[] = [
  {
    title: "Discovery",
    description: "Begin your journey through accessible media and technology, exploring spiritual concepts at your own pace.",
    icon: <DiscoveryIcon />,
    color: "border-blue-500"
  },
  {
    title: "Connection",
    description: "Connect with fellow seekers and experienced guides in safe, nurturing environments designed for authentic spiritual exploration.",
    icon: <ConnectionIcon />,
    color: "border-purple-500"
  },
  {
    title: "Wisdom",
    description: "Access profound spiritual teachings and timeless wisdom when you're ready to deepen your understanding.",
    icon: <WisdomIcon />,
    color: "border-indigo-500"
  }
];