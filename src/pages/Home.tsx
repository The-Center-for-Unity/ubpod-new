// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { PlayCircle, Headphones, MessageCircle, Download, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <Layout>
      <main className="flex flex-col bg-navy text-white">
        {/* Hero Section */}
        <section className="min-h-[90vh] bg-black relative overflow-hidden flex items-center">
          {/* Background image */}
          <img 
            src="/images/youtube-thumbnail.png" 
            alt="Urantia Book background" 
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          
          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/50 z-10"></div>
          
          {/* Content container */}
          <div className="container mx-auto px-4 relative z-20">
            <div className="max-w-3xl ml-4 md:ml-12">
              {/* Main heading with improved contrast */}
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-6 text-white leading-tight drop-shadow-lg">
                The Urantia<br />Book Podcast
              </h1>
              
              {/* Description text with improved visibility */}
              <p className="text-xl text-white mb-10 max-w-xl drop-shadow-md">
                AI-generated discussions exploring cosmic wisdom
              </p>
              
              {/* Call to action buttons */}
              <div className="flex flex-col sm:flex-row gap-5">
                <Link 
                  to="/urantia-papers"
                  className="inline-flex items-center px-8 py-4 bg-gold text-navy-dark rounded-full 
                            hover:bg-gold-light transition-all duration-300 font-bold text-lg shadow-xl group"
                >
                  <PlayCircle className="mr-2 h-6 w-6" />
                  Start Listening
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
                <a 
                  href="#features"
                  className="inline-flex items-center px-8 py-4 bg-white/15 backdrop-blur-sm border-2 border-white/40 
                            text-white rounded-full hover:bg-white/25 transition-all duration-300 font-bold text-lg shadow-xl"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-navy">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="title-subtitle text-xl tracking-[0.15em] text-gold mb-3">
                FEATURES
              </h2>
              <h3 className="title-main text-3xl md:text-4xl tracking-[0.1em] mb-6">
                A New Way to Experience<br />The Urantia Book
              </h3>
              <p className="body-lg text-white/80 max-w-2xl mx-auto">
                UrantiaBookPod brings the cosmic teachings to life through AI-generated 
                discussions that make complex concepts accessible and engaging.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-navy-light">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="title-subtitle text-xl tracking-[0.15em] text-gold mb-3">
                HOW IT WORKS
              </h2>
              <h3 className="title-main text-3xl md:text-4xl tracking-[0.1em] mb-6">
                Simple & Accessible
              </h3>
              <p className="body-lg text-white/80 max-w-2xl mx-auto">
                We've designed UrantiaBookPod to be intuitive and accessible for everyone, 
                whether you're at home or on the go.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {steps.map((step, index) => (
                <StepCard key={index} number={index + 1} {...step} />
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-navy">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-navy-light/30 rounded-lg p-12 text-center max-w-3xl mx-auto">
              <h2 className="title-main text-3xl md:text-4xl tracking-[0.1em] mb-6">
                Begin Your Journey
              </h2>
              <p className="body-lg mb-12 text-white/80">
                The Urantia Book offers profound insights into our universe, our world, 
                and our spiritual destiny. Start exploring these cosmic teachings through 
                our engaging podcast discussions today.
              </p>
              
              <div className="space-y-6">
                <Link 
                  to="/urantia-papers"
                  className="inline-flex items-center px-8 py-4 bg-gold text-navy-dark rounded-full 
                            hover:bg-gold-light transition-all duration-300 font-bold text-lg shadow-lg shadow-gold/20 group"
                >
                  Explore The Papers
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureProps) {
  return (
    <div className="bg-navy-light/30 rounded-lg p-8 hover:bg-navy-light/50 transition-colors">
      <div className="text-gold mb-4">
        {icon}
      </div>
      <h3 className="title-subtitle tracking-wide mb-4 text-white/90">
        {title}
      </h3>
      <p className="body-lg text-white/70">
        {description}
      </p>
    </div>
  );
}

interface StepProps {
  title: string;
  description: string;
}

function StepCard({ number, title, description }: StepProps & { number: number }) {
  return (
    <div className="bg-navy-light/30 rounded-lg p-8 hover:bg-navy-light/50 transition-colors">
      <div className="w-10 h-10 rounded-full bg-gold text-navy-dark flex items-center justify-center font-bold mb-4">
        {number}
      </div>
      <h3 className="title-subtitle tracking-wide mb-4 text-white/90">
        {title}
      </h3>
      <p className="body-lg text-white/70">
        {description}
      </p>
    </div>
  );
}

const features: FeatureProps[] = [
  {
    icon: <MessageCircle className="w-10 h-10" />,
    title: "AI-Generated Discussions",
    description: "Listen to engaging podcast-style discussions that explore the Urantia Book's concepts with fresh perspectives and insights."
  },
  {
    icon: <Sparkles className="w-10 h-10" />,
    title: "Complex Concepts Simplified",
    description: "Difficult cosmic teachings broken down into accessible conversations that anyone can understand and appreciate."
  },
  {
    icon: <Download className="w-10 h-10" />,
    title: "Offline Access",
    description: "Download episodes for offline listening, perfect for commutes, walks, or times without internet access."
  }
];

const steps: StepProps[] = [
  {
    title: "Browse Episodes",
    description: "Navigate through our collection of podcast episodes, organized by Urantia Book papers and topics."
  },
  {
    title: "Select a Discussion",
    description: "Choose a podcast episode that interests you and click to access the audio discussion."
  },
  {
    title: "Listen & Engage",
    description: "Play the podcast on any device, download for offline listening, or share with friends."
  }
];