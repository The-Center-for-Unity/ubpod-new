# UrantiaBookPod i18n Implementation Recommendations

## Overview

After reviewing the existing i18n plan and examining the codebase, this document provides specific recommendations for implementing internationalization in the UrantiaBookPod application, with a focus on Spanish support for the Urantia Papers series.

## Current Plan Assessment

The existing plan in `i18n-plan.md` provides a good high-level approach to adding internationalization. However, given the focused scope (Urantia Papers in Spanish), we can streamline the implementation to minimize changes to the codebase while still providing a robust solution.

## Recommended Approach

### 1. Focused Implementation Scope

Rather than implementing a full-site internationalization immediately, we recommend a focused approach:

- Target only the Urantia Papers series initially
- Implement Spanish language support as the first priority
- Add language switching capabilities only where needed
- Defer French and Portuguese implementation to a later phase

This approach will minimize risk and provide a working Spanish version more quickly.

### 2. Specific Technical Recommendations

#### URL Structure

We recommend using a URL-based approach for language selection:

```
/es/series/urantia-papers/:episodeId  # Spanish version
/series/urantia-papers/:episodeId     # Default English version
```

Benefits:
- Clear language identification in URLs
- Better SEO for language-specific content
- Simpler redirects and bookmarking
- No complex state management needed

#### Audio File Organization

Since we already have the Spanish audio files for all 197 Urantia Papers episodes:

1. Create a predictable naming pattern:
   ```
   /audio/urantia-papers/paper-{number}.mp3           # English
   /audio/urantia-papers/es/paper-{number}.mp3        # Spanish
   ```

2. Update the `getAudioUrl` function in `config/audio.ts`:
   ```typescript
   export function getAudioUrl(series: string, id: number, lang: string = 'en'): string {
     if (series === 'urantia-papers') {
       const filename = id === 0 ? 'foreword' : `paper-${id}`;
       return lang === 'en' 
         ? `https://pub-69ae36e16d64438e9bb56350459d5c7d.r2.dev/${filename}.mp3`
         : `https://pub-69ae36e16d64438e9bb56350459d5c7d.r2.dev/${lang}/${filename}.mp3`;
     }
     // ...rest of function
   }
   ```

#### Translation Files

Create the following structure:

```
/public/locales/
  /en/
    common.json     # Shared UI strings
    episodes.json   # Episode-specific translations
  /es/
    common.json
    episodes.json
```

For Spanish episode titles and descriptions, two approaches are possible:
1. Store in JSON files (better for smaller amount of content)
2. Create a parallel data structure in `episodes.ts` (better for larger content)

Given that we have 197 episodes, the second approach is recommended:

```typescript
// In episodes.ts
const urantiaPaperTitles = {
  en: {
    0: "Foreword",
    1: "The Universal Father",
    // ...
  },
  es: {
    0: "Prólogo",
    1: "El Padre Universal",
    // ...
  }
};
```

#### Language Detection and Switching

1. Implement a minimal language context:

```typescript
// src/contexts/LanguageContext.tsx
export const LanguageContext = createContext({
  language: 'en',
  setLanguage: (lang: string) => {}
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
```

2. Add a simple language switcher component:

```typescript
// src/components/ui/LanguageSwitcher.tsx
export default function LanguageSwitcher() {
  const { language, setLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    
    // Update URL to reflect language change
    const pathWithoutLang = location.pathname.replace(/^\/(en|es)\//, '/');
    navigate(newLang === 'en' ? pathWithoutLang : `/${newLang}${pathWithoutLang}`);
  };

  return (
    <div className="flex space-x-2">
      <button 
        onClick={() => handleLanguageChange('en')}
        className={`px-2 py-1 rounded ${language === 'en' ? 'bg-primary text-white' : 'bg-gray-200'}`}
      >
        EN
      </button>
      <button 
        onClick={() => handleLanguageChange('es')}
        className={`px-2 py-1 rounded ${language === 'es' ? 'bg-primary text-white' : 'bg-gray-200'}`}
      >
        ES
      </button>
    </div>
  );
}
```

### 3. Routing Changes

Update `App.tsx` to handle language prefixes in routes:

```typescript
function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTopOnNavigate />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Default English routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/urantia-papers" element={<UrantiaPapersPage />} />
            <Route path="/series/:seriesId/:episodeId" element={<EpisodePage />} />
            {/* ...other existing routes */}
            
            {/* Spanish routes */}
            <Route path="/es" element={<HomePage />} />
            <Route path="/es/urantia-papers" element={<UrantiaPapersPage />} />
            <Route path="/es/series/:seriesId/:episodeId" element={<EpisodePage />} />
            {/* ...other routes with language prefix */}
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <Analytics />
      </BrowserRouter>
    </LanguageProvider>
  );
}
```

## Implementation Priority

We recommend the following implementation order:

1. Clean up the codebase as outlined in `podcast-cleanup-plan.md`
2. Set up the language context and URL-based routing
3. Implement the language switcher component
4. Create translation files and update the audio URL function
5. Test with Spanish audio files
6. Add translated content for UI elements
7. Add translated episode data

## Key Considerations

1. **Performance**: The URL-based approach avoids page reloads when switching languages
2. **SEO**: Language-specific URLs help search engines index content correctly
3. **Maintenance**: Separating translations into JSON files makes updates easier
4. **User Experience**: Users can bookmark language-specific pages
5. **Fallback**: Default to English when translations are missing

## Next Steps After Spanish Implementation

1. Review user feedback on the Spanish version
2. Implement analytics to track language usage
3. Prepare for French and Portuguese implementation using the same pattern
4. Consider adding language selection based on browser preferences