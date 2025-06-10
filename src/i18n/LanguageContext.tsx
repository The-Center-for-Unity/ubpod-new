import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import i18n from './i18n';

type LanguageContextType = {
  language: string;
  isInitialized: boolean;
  changeLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  isInitialized: false,
  changeLanguage: () => {}
});

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [language, setLanguage] = useState('en');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from URL on first load
  useEffect(() => {
    const path = location.pathname;
    const langMatch = path.match(/^\/([a-z]{2})\//); 
    
    let initialLanguage = 'en';
    if (langMatch && ['es', 'fr', 'pt'].includes(langMatch[1])) {
      initialLanguage = langMatch[1];
    }
    
    setLanguage(initialLanguage);
    i18n.changeLanguage(initialLanguage);
    setIsInitialized(true);
    
  }, []); // Run only once on initial mount

  const changeLanguage = (lang: string) => {
    if (lang === language) return;

    const currentPath = location.pathname;
    
    // Strip the current language prefix to get the base path
    const basePath = currentPath.startsWith(`/${language}/`) 
      ? currentPath.substring(`/${language}`.length) 
      : currentPath;
  
    // Prepend the new language prefix. Ensure the base path starts with a /
    const newPath = lang === 'en' 
      ? basePath 
      : `/${lang}${basePath.startsWith('/') ? basePath : '/' + basePath}`;
  
    setLanguage(lang);
    i18n.changeLanguage(lang);
    navigate(newPath, { replace: true });
  };

  return (
    <LanguageContext.Provider value={{ language, isInitialized, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);