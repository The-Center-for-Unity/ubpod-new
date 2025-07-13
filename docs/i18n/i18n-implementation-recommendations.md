# Internationalization (i18n) Implementation Recommendations

## Library Selection

Recommendation: **react-i18next with i18next**

Rationale:
- Excellent React integration
- Active maintenance and community support
- Strong TypeScript support
- Supports dynamic loading of translations
- Comprehensive features including pluralization, formatting, etc.

## Implementation Approach

### 1. Language Context and Routing

Implement a React context to manage the current language and provide a mechanism for switching languages. Use URL prefixes to indicate the language:

```typescript
// src/i18n/LanguageContext.tsx
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
```

### 2. i18next Configuration

```typescript
// src/i18n/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend) // loads translations from /public/locales/{lng}/{ns}.json
  .use(LanguageDetector) // detects user language
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'fr', 'pt'],
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ['path', 'navigator'],
      lookupFromPathIndex: 0,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    ns: ['common', 'episode', 'home'],
    defaultNS: 'common',
  });

export default i18n;
```

### 3. Language Switcher Component

```typescript
// src/i18n/LanguageSwitcher.tsx
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
```

### 4. Adapting URL Utilities

Update the `mediaUtils.ts` file to handle language-specific audio paths:

```typescript
// Modified function in src/utils/mediaUtils.ts
export function getMediaUrl(
  seriesId: string,
  episodeNumber: number | string, 
  fileType: 'mp3' | 'pdf' = 'mp3',
  language: string = 'en'
): string {
  const baseUrl = 'https://cdn.example.com';
  
  // If language is English, use the default path structure
  if (language === 'en') {
    return `${baseUrl}/audio/${seriesId}/paper-${episodeNumber}.${fileType}`;
  }
  
  // For other languages, insert the language code
  return `${baseUrl}/audio/${seriesId}/${language}/paper-${episodeNumber}.${fileType}`;
}
```

## Translation File Structure

### UI Strings

```json
// public/locales/en/common.json
{
  "nav": {
    "home": "Home",
    "episodes": "Episodes",
    "about": "About",
    "contact": "Contact"
  },
  "footer": {
    "copyright": "© 2023 UBPod. All rights reserved.",
    "terms": "Terms of Service",
    "privacy": "Privacy Policy"
  }
}
```

```json
// public/locales/es/common.json
{
  "nav": {
    "home": "Inicio",
    "episodes": "Episodios",
    "about": "Acerca de",
    "contact": "Contacto"
  },
  "footer": {
    "copyright": "© 2023 UBPod. Todos los derechos reservados.",
    "terms": "Términos de Servicio",
    "privacy": "Política de Privacidad"
  }
}
```

### Episode Data

Consider updating the episode data structure to support translations:

```typescript
// Modified structure in src/data/episodes.ts
type EpisodeTranslations = {
  [language: string]: {
    title: string;
    description: string;
  };
};

type Episode = {
  id: string;
  number: number;
  translations: EpisodeTranslations;
  // other fields...
};

// Example usage
const episodes: Episode[] = [
  {
    id: 'paper-1',
    number: 1,
    translations: {
      en: {
        title: 'The Universal Father',
        description: 'Explores the nature of the Universal Father...',
      },
      es: {
        title: 'El Padre Universal',
        description: 'Explora la naturaleza del Padre Universal...',
      },
    },
    // other fields...
  },
  // other episodes...
];
```

## SEO Considerations

Update the MetaTags component to include language information:

```tsx
// src/components/layout/MetaTags.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../i18n/LanguageContext';

interface MetaTagsProps {
  title: string;
  description: string;
  // other props...
}

export const MetaTags: React.FC<MetaTagsProps> = ({ title, description, /* other props */ }) => {
  const { language } = useLanguage();
  
  return (
    <Helmet>
      <html lang={language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="alternate" hrefLang="en" href="https://ubpod.org/..." />
      <link rel="alternate" hrefLang="es" href="https://ubpod.org/es/..." />
      {/* other meta tags */}
    </Helmet>
  );
};
```

## Implementation Priority

1. Set up the basic i18n infrastructure
2. Implement the language switcher and URL-based routing
3. Extract and translate UI strings for core components
4. Update media utilities to handle language-specific paths
5. Implement translated episode data
6. Add SEO language meta tags
7. Test with Spanish audio files

## Recommended Testing Strategy

1. Test language switching via UI and URL
2. Verify correct loading of translated UI strings
3. Test audio playback for different languages
4. Check SEO meta tags
5. Test navigation between languages
6. Verify URLs maintain language preference during navigation