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
  // { code: 'fr', name: 'Français', flag: '🇫🇷' },
  // { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

export const LanguageSwitcher: React.FC<{compact?: boolean}> = ({ compact = false }) => {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="language-switcher">
      <select 
        value={language} 
        onChange={(e) => changeLanguage(e.target.value)}
        className={`border rounded-md ${compact ? 'py-1 px-1 text-xs' : 'py-1 px-2'} bg-white text-navy-dark`}
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {compact ? '' : lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};