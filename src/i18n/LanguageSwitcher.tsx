import React from 'react';
import { useLanguage } from './LanguageContext';

type Language = {
  code: string;
  name: string;
  flag: string;
};

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

export const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="language-switcher">
      <select 
        value={language} 
        onChange={(e) => changeLanguage(e.target.value)}
        className="border rounded-md py-1 px-2 bg-white"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};