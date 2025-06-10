import React, { useState } from 'react';
import { ClipboardCopy, Rss } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../i18n/LanguageContext';
import { LocalizedLink } from '../shared/LocalizedLink';

export default function Footer() {
  const { t } = useTranslation('common');
  const { language } = useLanguage();
  const [rssNotification, setRssNotification] = useState<string | null>(null);

  const copyRssToClipboard = () => {
    const rssUrl = 'https://anchor.fm/s/fbec2574/podcast/rss';
    
    navigator.clipboard.writeText(rssUrl)
      .then(() => {
        setRssNotification(t('footer.rss_copied'));
        setTimeout(() => {
          setRssNotification(null);
        }, 3000);
      })
      .catch(() => {
        setRssNotification(t('footer.rss_copy_failed'));
        setTimeout(() => {
          setRssNotification(null);
        }, 3000);
      });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-navy-light/30 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <LocalizedLink to="/" className="flex items-center space-x-3">
              <span className="title-subtitle text-sm tracking-[0.15em]">
                {t('site.name')}
              </span>
            </LocalizedLink>
            <p className="body-lg text-white/70">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="title-subtitle text-lg font-semibold text-white">{t('footer.quick_links')}</h3>
            <ul className="space-y-2">
              <li>
                <LocalizedLink to="/urantia-papers" className="body-lg text-white/70 hover:text-white/90 transition-colors">
                  {t('nav.urantia_papers')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink to="/series" className="body-lg text-white/70 hover:text-white/90 transition-colors">
                  {t('nav.series_collections')}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink to="/disclaimer" className="body-lg text-white/70 hover:text-white/90 transition-colors">
                  {t('nav.disclaimer')}
                </LocalizedLink>
              </li>
            </ul>
          </div>

          {/* External Links */}
          <div className="space-y-4">
            <h3 className="title-subtitle text-lg font-semibold text-white">{t('footer.resources')}</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.urantia.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="body-lg text-white/70 hover:text-white/90 transition-colors"
                >
                  {t('footer.external_links.urantia_foundation')}
                </a>
              </li>
              <li>
                <a 
                  href="https://www.thecenterforunity.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="body-lg text-white/70 hover:text-white/90 transition-colors"
                >
                  {t('footer.external_links.center_for_unity')}
                </a>
              </li>
              <li>
                <a 
                  href="https://www.thecenterforunity.org/contribute" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="body-lg text-white/70 hover:text-white/90 transition-colors"
                >
                  {t('nav.pay_it_forward')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Podcast Platforms */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <h3 className="title-subtitle text-lg font-semibold text-white mb-4">{t('footer.also_available')}</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <a 
              href="https://www.youtube.com/playlist?list=PLgU-tjb05MakRB1XmcLKbshw5icSROylV" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
              aria-label={t('platforms.youtube')}
            >
              <img 
                src="/images/platforms/youtube-button3.png" 
                alt={t('platforms.youtube')} 
                className="h-10 w-auto"
              />
            </a>
            <a 
              href="https://podcasts.apple.com/us/podcast/the-urantia-book-podcast/id1774930896" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
              aria-label={t('platforms.apple_podcasts')}
            >
              <img 
                src="/images/platforms/apple-podcast-button.png" 
                alt={t('platforms.apple_podcasts')} 
                className="h-10 w-auto"
              />
            </a>
            <a 
              href="https://open.spotify.com/show/4CAEnHQh9MM2rKcxIvYn5V" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
              aria-label={t('platforms.spotify')}
            >
              <img 
                src="/images/platforms/spotify-button.png" 
                alt={t('platforms.spotify')} 
                className="h-10 w-auto"
              />
            </a>
            <a 
              href="https://music.amazon.com/podcasts/9ab545ad-4fa8-4678-9704-631f745439fb/the-urantia-book-podcast" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
              aria-label={t('platforms.amazon_music')}
            >
              <img 
                src="/images/platforms/amazon-music-button.png" 
                alt={t('platforms.amazon_music')} 
                className="h-10 w-auto"
              />
            </a>
            <button
              onClick={copyRssToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-navy-light/70 text-white/90 rounded-md hover:bg-navy transition-colors"
              aria-label={t('footer.copy_rss')}
            >
              <Rss size={18} className="text-gold" />
              <ClipboardCopy size={16} />
              <span>{t('footer.copy_rss')}</span>
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="body-lg text-white/50 text-sm">
            {t('footer.copyright', { year: currentYear })}
          </p>
        </div>
      </div>
      
      {/* RSS Notification */}
      {rssNotification && (
        <div className="fixed bottom-4 right-4 bg-navy-light text-white px-4 py-3 rounded-lg shadow-lg transition-opacity duration-300">
          {rssNotification}
        </div>
      )}
    </footer>
  );
} 