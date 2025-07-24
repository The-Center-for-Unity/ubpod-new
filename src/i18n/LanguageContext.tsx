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

  // Initialize and update from URL whenever location changes
  useEffect(() => {
    const path = location.pathname;
    // Updated regex to match /es, /es/, /es/something
    const langMatch = path.match(/^\/([a-z]{2})(?:\/|$)/); 
    
    let detectedLanguage = 'en';
    if (langMatch && ['es', 'fr', 'pt', 'ru', 'ro'].includes(langMatch[1])) {
      detectedLanguage = langMatch[1];
    }
    
    setLanguage(detectedLanguage);
    i18n.changeLanguage(detectedLanguage);
    setIsInitialized(true);
    
  }, [location.pathname]); // Update whenever the pathname changes

  const changeLanguage = (lang: string) => {
    if (lang === language) return;

    const currentPath = location.pathname;
    
    // Strip any existing language prefix to get the base path
    // Handle both /es and /es/something cases
    let basePath = currentPath;
    const langPrefixMatch = currentPath.match(/^\/([a-z]{2})(?:\/(.*))?$/);
    
    if (langPrefixMatch && ['es', 'fr', 'pt', 'ru', 'ro'].includes(langPrefixMatch[1])) {
      // Extract the path after the language prefix
      basePath = langPrefixMatch[2] ? `/${langPrefixMatch[2]}` : '/';
    }
    
    // Build new path with language prefix (or without for English)
    const newPath = lang === 'en' 
      ? basePath === '/' ? '/' : basePath
      : `/${lang}${basePath}`;
      
    console.log(`[LANGUAGE SWITCHER DEBUG] Switching from ${language} to ${lang}`);
    console.log(`[LANGUAGE SWITCHER DEBUG] Current path: ${currentPath}`);
    console.log(`[LANGUAGE SWITCHER DEBUG] Base path: ${basePath}`);
    console.log(`[LANGUAGE SWITCHER DEBUG] New path: ${newPath}`);
  
    setLanguage(lang);
    i18n.changeLanguage(lang);
    navigate(newPath); // Remove replace: true to allow browser back/forward
  };

  return (
    <LanguageContext.Provider value={{ language, isInitialized, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);