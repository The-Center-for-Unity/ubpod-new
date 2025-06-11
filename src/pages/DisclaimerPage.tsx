import React from 'react';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../i18n/LanguageContext';

export default function DisclaimerPage() {
  const { t } = useTranslation('disclaimer');
  const { language } = useLanguage();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="title-main text-4xl mb-8 text-center">{t('title')}</h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center text-gold">{t('subtitle')}</h2>
        
        <div className="bg-navy-light/30 rounded-lg p-8 border border-white/5 space-y-6">
          <p className="body-lg">
            {t('introduction')}
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-gold">{t('sections.copyright.title')}</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            {(t('sections.copyright.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index} className="body-lg">{item}</li>
            ))}
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4 text-gold">{t('sections.aiContent.title')}</h2>
          <p className="body-lg"><strong>{t('sections.aiContent.warning')}</strong></p>
          <p className="body-lg">{t('sections.aiContent.description')}</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            {(t('sections.aiContent.limitations', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index} className="body-lg">{item}</li>
            ))}
          </ul>
          <p className="body-lg">{t('sections.aiContent.disclaimer')}</p>
          <p className="body-lg">{t('sections.aiContent.requirement')}</p>
          <p className="body-lg">{t('sections.aiContent.purpose')}</p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-gold">{t('sections.fairUse.title')}</h2>
          <p className="body-lg">
            {t('sections.fairUse.content')}
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-gold">{t('sections.technical.title')}</h2>
          <p className="body-lg">{t('sections.technical.description')}</p>
          <p className="body-lg">{t('sections.technical.feedback')}</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            {(t('sections.technical.issues', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index} className="body-lg">{item}</li>
            ))}
          </ul>
          <p className="body-lg">{t('sections.technical.inherent')}</p>
          <p className="body-lg">{t('sections.technical.acknowledgment')}</p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-gold">{t('sections.responsibility.title')}</h2>
          <p className="body-lg">{t('sections.responsibility.acknowledgment')}</p>
          <p className="body-lg">{t('sections.responsibility.acceptance')}</p>
          <p className="body-lg">{t('sections.responsibility.neverUse')}</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            {(t('sections.responsibility.restrictions', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index} className="body-lg">{item}</li>
            ))}
          </ul>
          <p className="body-lg">{t('sections.responsibility.recommendation')}</p>

          <h2 className="text-xl font-bold mt-8 mb-4 text-gold">{t('sections.contact.title')}</h2>
          <p className="body-lg">
            {t('sections.contact.content')}{' '}
            <a href={`mailto:${t('sections.contact.email')}`} className="text-gold hover:text-gold-light">
              {t('sections.contact.email')}
            </a>.
          </p>

          <p className="text-sm text-white/60 mt-8 italic">{t('lastUpdated')}</p>
        </div>
        
        <div className="mt-10 text-center">
          <Link 
            to={language === 'en' ? '/' : `/${language}`}
            className="inline-flex items-center px-8 py-4 bg-gold text-navy-dark rounded-full 
                      hover:bg-gold-light transition-all duration-300 font-bold text-lg shadow-lg shadow-gold/20"
          >
            {t('returnButton')}
          </Link>
        </div>
      </div>
    </Layout>
  );
} 