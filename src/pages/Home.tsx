// src/pages/Home.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import { PlayCircle, Headphones, MessageCircle, Download, Sparkles } from 'lucide-react';
import SeriesCardGrid from '../components/ui/SeriesCardGrid';
import { LocalizedLink } from '../components/shared/LocalizedLink';

export default function HomePage() {
  const { t } = useTranslation('home');

  // Dynamic features array using translations
  const features: FeatureProps[] = [
    {
      icon: <MessageCircle className="w-10 h-10" />,
      title: t('features.items.aiAudio.title'),
      description: t('features.items.aiAudio.description')
    },
    {
      icon: <Sparkles className="w-10 h-10" />,
      title: t('features.items.simplified.title'),
      description: t('features.items.simplified.description')
    },
    {
      icon: <Download className="w-10 h-10" />,
      title: t('features.items.offline.title'),
      description: t('features.items.offline.description')
    }
  ];

  // Dynamic steps array using translations
  const steps: StepProps[] = [
    {
      title: t('howItWorks.steps.browse.title'),
      description: t('howItWorks.steps.browse.description')
    },
    {
      title: t('howItWorks.steps.select.title'),
      description: t('howItWorks.steps.select.description')
    },
    {
      title: t('howItWorks.steps.listen.title'),
      description: t('howItWorks.steps.listen.description')
    }
  ];

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
              <h1 className="title-main text-5xl md:text-6xl lg:text-7xl mb-6 text-white leading-tight drop-shadow-lg">
                {t('hero.title')}
              </h1>
              
              {/* Description text with improved visibility */}
              <p className="section-subtitle text-xl text-white mb-10 max-w-xl drop-shadow-md">
                {t('hero.subtitle')}
              </p>
              
              {/* Call to action buttons */}
              <div className="flex flex-col sm:flex-row gap-5">
                <LocalizedLink 
                  to="/urantia-papers"
                  className="inline-flex items-center px-8 py-4 bg-gold text-navy-dark rounded-full 
                            hover:bg-gold-light transition-all duration-300 font-bold text-lg shadow-xl group"
                >
                  <PlayCircle className="mr-2 h-6 w-6" />
                  {t('hero.buttons.startListening')}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </LocalizedLink>
                <a 
                  href="#series"
                  className="inline-flex items-center px-8 py-4 bg-white/15 backdrop-blur-sm border-2 border-white/40 
                            text-white rounded-full hover:bg-white/25 transition-all duration-300 font-bold text-lg shadow-xl"
                >
                  {t('hero.buttons.browseSeries')}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Series Section */}
        <section id="series" className="py-20 bg-navy">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="title-subtitle text-xl tracking-[0.15em] text-gold mb-3">
                {t('series.subtitle')}
              </h2>
              <h3 className="title-main text-3xl md:text-4xl tracking-[0.1em] mb-6">
                {t('series.title')}
              </h3>
              <p className="body-lg text-white/80 max-w-2xl mx-auto mb-10">
                {t('series.description')}
              </p>
            </div>

            <SeriesCardGrid />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-navy-dark">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="title-subtitle text-xl tracking-[0.15em] text-gold mb-3">
                {t('features.subtitle')}
              </h2>
              <h3 className="title-main text-3xl md:text-4xl tracking-[0.1em] mb-6">
                {t('features.title')}
              </h3>
              <p className="body-lg text-white/80 max-w-2xl mx-auto">
                {t('features.description')}
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
                {t('howItWorks.subtitle')}
              </h2>
              <h3 className="title-main text-3xl md:text-4xl tracking-[0.1em] mb-6">
                {t('howItWorks.title')}
              </h3>
              <p className="body-lg text-white/80 max-w-2xl mx-auto">
                {t('howItWorks.description')}
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
                {t('cta.title')}
              </h2>
              <p className="body-lg mb-12 text-white/80">
                {t('cta.description')}
              </p>
              
              <div className="space-y-6">
                <LocalizedLink 
                  to="/urantia-papers"
                  className="inline-flex items-center px-8 py-4 bg-gold text-navy-dark rounded-full 
                            hover:bg-gold-light transition-all duration-300 font-bold text-lg shadow-lg shadow-gold/20 group"
                >
                  {t('cta.button')}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </LocalizedLink>
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

