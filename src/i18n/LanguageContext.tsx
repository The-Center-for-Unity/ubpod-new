import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import i18n from './i18n';

type LanguageContextType = {
  language: string;
  changeLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  changeLanguage: () => {}
});

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [language, setLanguage] = useState('en');

  // Initialize from URL
  useEffect(() => {
    const path = location.pathname;
    const langMatch = path.match(/^\/([a-z]{2})\//); 
    if (langMatch && ['es', 'fr', 'pt'].includes(langMatch[1])) {
      setLanguage(langMatch[1]);
      i18n.changeLanguage(langMatch[1]);
    }
  }, [location]);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    
    // Update URL to reflect language change
    const path = location.pathname;
    const currentLangMatch = path.match(/^\/([a-z]{2})\//); 
    
    if (lang === 'en') {
      // Remove language prefix for English
      if (currentLangMatch) {
        navigate(path.replace(/^\/[a-z]{2}\//, '/'));
      }
    } else {
      // Add or replace language prefix
      if (currentLangMatch) {
        navigate(path.replace(/^\/[a-z]{2}\//, `/${lang}/`));
      } else {
        navigate(`/${lang}${path}`);
      }
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);