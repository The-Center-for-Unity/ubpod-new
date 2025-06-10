# Internationalization (i18n) Implementation Plan

## Overview

This document outlines the plan for implementing internationalization (i18n) in the UBPod application. The goal is to make the podcast content accessible in multiple languages, starting with Spanish for the Urantia Papers series.

## Current Status ✅

**Infrastructure Complete:**
- ✅ i18next and react-i18next dependencies installed
- ✅ Language context and switcher implemented
- ✅ Basic translation files structure created
- ✅ Media utilities support language-specific paths
- ✅ Spanish PDFs and audios uploaded to R2 bucket

**Progress (Updated: June 2025):**
- ✅ Header and Footer components updated to use translation hooks
- ✅ Translation files for common.json created and implemented
- ✅ Translation files for episode.json created and expanded
- ✅ Language switcher implemented and functioning
- ✅ URL routing with language prefixes implemented
- ✅ LocalizedLink component created for simplified route handling
- ✅ Basic layout improvements for multi-language support
- ✅ EpisodePage component updated to use translations
- ✅ SocialShareMenu component internationalized with namespaced translations
- ✅ Fixed namespace conflicts between component-specific translations

**Pending:**
- ⏳ Comprehensive translation files not completed for all pages
- ❌ Episode data not internationalized
- ❌ SEO meta tags not language-aware

## Requirements

- Support multiple languages (initially English and Spanish)
- URL-based language selection (e.g., /es/... for Spanish, default for English)
- Language switcher in the UI
- Maintain SEO benefits with proper language meta tags
- Support translated audio files and transcripts
- Ensure a seamless user experience across languages

## Technical Approach

### Framework Selection

We will use react-i18next with i18next for the implementation, as it provides:

- Integration with React components
- Dynamic loading of translations
- Context-based language switching
- Strong TypeScript support

### Directory Structure

```
/public
  /locales
    /en
      common.json      ✅ Basic structure exists
      episode.json     ✅ Basic structure exists  
      home.json        ❌ Needs creation
      contact.json     ❌ Needs creation
      series.json      ❌ Needs creation
      ui.json          ❌ Needs creation (shared UI elements)
      errors.json      ❌ Needs creation (error messages)
    /es
      common.json      ✅ Basic structure exists
      episode.json     ✅ Basic structure exists
      home.json        ❌ Needs creation
      contact.json     ❌ Needs creation
      series.json      ❌ Needs creation
      ui.json          ❌ Needs creation
      errors.json      ❌ Needs creation
/src
  /i18n
    index.ts         ✅ Complete
    LanguageContext.tsx  ✅ Complete
    LanguageSwitcher.tsx ✅ Complete
```

### URL Patterns

We will implement URL-based language selection:

- Default (English): `/episode/urantia-papers/1`
- Spanish: `/es/episode/urantia-papers/1`

### Content Translation

- UI strings will be stored in JSON files
- Episode data will include translations for titles and descriptions
- Audio files will be organized by language: `/audio/urantia-papers/es/paper-1.mp3` ✅

## Pragmatic Implementation Strategy

### Text Extraction Approach

1. **Component-by-Component Extraction**
   - Start with high-visibility components that users interact with first
   - Focus on layout components (Header, Footer, MetaTags) initially
   - Progressively translate components based on user impact

2. **Consistent Translation Structure**
   - Use nested key hierarchy matching UI organization (nav.home, buttons.play)
   - Group translations by functionality rather than UI position
   - Keep keys consistent across language files

3. **Automation for Efficiency**
   - Create a utility script to scan components for hardcoded strings
   - Extract text in logical groups (navigation, buttons, form labels, errors)
   - Generate baseline JSON files that can be sent for translation

4. **JSON Translation Files Best Practices**
   - Keep translation keys human-readable and semantically meaningful
   - Use consistent naming patterns (camelCase, namespaced with dots)
   - Add comments for context where needed with leading // in JSON

## Detailed Implementation Plan

### Phase 1: UI Translation Infrastructure (Priority 1)

#### Step 1.1: Translation Utilities and Shared UI (1-2 hours)
1. **Create translation extraction utility:**
   - Script to scan components for text strings
   - Generate baseline JSON files with English strings
   - Document patterns for translators to follow

2. **Create a shared UI strings file:**
   - Create `/public/locales/en/ui.json` for buttons, form elements, etc.
   - Create `/public/locales/en/errors.json` for error messages

#### Step 1.2: Core Layout Components (2-3 hours) ✅
1. **Add useTranslation hooks to core layout components:** ✅
   - `src/components/layout/Header.tsx` - Navigation labels ✅
   - `src/components/layout/Footer.tsx` - Footer text and links ✅
   - `src/components/layout/MetaTags.tsx` - Page titles and descriptions ⏳

2. **Implementation pattern for each component:** ✅
   ```typescript
   import { useTranslation } from 'react-i18next';
   
   function Component() {
     const { t } = useTranslation('common'); // or 'ui', 'errors', etc.
     
     return <div>{t('nav.home')}</div>
   }
   ```

#### Step 1.3: Episode Page Translation (3-4 hours) ✅
1. **Create episode-specific translations:** ✅
   - Expand `/public/locales/en/episode.json` ✅
   - Expand `/public/locales/es/episode.json` ✅

2. **Sections to translate in EpisodePage.tsx:** ✅
   - Audio player controls and labels ✅
   - Episode metadata (duration, date, etc.) ✅
   - Transcript toggle text ✅
   - Share buttons and text ✅
   - Related episodes section ✅
   - Download buttons and labels ✅
   - Error messages and loading states ✅

3. **Update `src/pages/EpisodePage.tsx`:** ✅
   - Add useTranslation hooks ✅
   - Replace hardcoded strings ✅
   - Handle dynamic content (episode titles/descriptions) ✅

#### Step 1.4: Home and Series Pages (3-4 hours)
1. **Create translations for main pages:**
   - `/public/locales/en/home.json`
   - `/public/locales/en/series.json`

2. **Update components:**
   - `src/pages/Home.tsx`
   - `src/pages/SeriesPage.tsx`
   - `src/pages/ListenPage.tsx`
   - `src/pages/UrantiaPapersPage.tsx`

3. **Translate high-impact UI elements:**
   - Hero section content
   - Call-to-action buttons
   - Series and episode cards
   - Navigation elements

#### Step 1.5: Remaining UI Components (2-3 hours)
1. **Complete translation of remaining components:**
   - Contact page
   - Error pages
   - UI utility components
   - Modals and popups
   - SocialShareMenu component ✅

2. **Ensure translation coverage:**
   - Use browser language tools to identify missing translations
   - Check for hardcoded strings in templates
   - Verify all user-facing text is translatable
   - Fix namespace conflicts between components ✅

### Phase 2: URL Routing with Language Prefixes (Priority 2) ✅

#### Step 2.1: Route Path Utility (1-2 hours) ✅
1. **Create routing utility functions:** ✅
   ```typescript
   // src/utils/i18nRouteUtils.ts
   
   // Get localized path for any route
   export function getLocalizedPath(path: string, language: string): string {
     if (language === 'en') return path;
     return `/${language}${path}`;
   }
   
   // Get current language from URL
   export function getLanguageFromPath(path: string): string {
     const match = path.match(/^\/([a-z]{2})\//);
     return match && ['es', 'fr', 'pt'].includes(match[1]) ? match[1] : 'en';
   }
   
   // Generate language alternates for SEO
   export function getLanguageAlternates(path: string): Record<string, string> {
     const basePath = path.replace(/^\/[a-z]{2}\//, '/');
     return {
       en: `https://ubpod.org${basePath}`,
       es: `https://ubpod.org/es${basePath}`,
       // Add more languages as needed
     };
   }
   ```

#### Step 2.2: Router Configuration (1-2 hours) ✅
1. **Update `src/App.tsx` routing:** ✅
   ```typescript
   <Routes>
     {/* English routes (default) */}
     <Route path="/" element={<HomePage />} />
     <Route path="/urantia-papers" element={<UrantiaPapersPage />} />
     <Route path="/episode/:id" element={<EpisodePage />} />
     {/* Add all English routes */}
     
     {/* Spanish routes */}
     <Route path="/es" element={<HomePage />} />
     <Route path="/es/urantia-papers" element={<UrantiaPapersPage />} />
     <Route path="/es/episode/:id" element={<EpisodePage />} />
     {/* Add all Spanish routes */}
   </Routes>
   ```

#### Step 2.3: Link Component Update (1-2 hours) ✅
1. **Create a wrapper for React Router's Link component:** ✅
   ```typescript
   // src/components/shared/LocalizedLink.tsx
   import { Link, LinkProps } from 'react-router-dom';
   import { useLanguage } from '../../i18n/LanguageContext';
   import { getLocalizedPath } from '../../utils/i18nRouteUtils';

   interface LocalizedLinkProps extends Omit<LinkProps, 'to'> {
     to: string;
     skipLocalization?: boolean;
   }

   export const LocalizedLink: React.FC<LocalizedLinkProps> = ({ 
     to, 
     skipLocalization = false,
     ...props 
   }) => {
     const { language } = useLanguage();
     const localizedTo = skipLocalization ? to : getLocalizedPath(to, language);
     
     return <Link to={localizedTo} {...props} />;
   };
   ```

2. **Update components to use LocalizedLink:** ✅
   - Footer.tsx has been updated to use LocalizedLink
   - Header.tsx implements route localization

### Phase 3: Episode Data Internationalization (Priority 3)

#### Step 3.1: Episode Data Structure Update (2-3 hours)
1. **Update episode data types:**
   ```typescript
   interface EpisodeTranslations {
     [language: string]: {
       title: string;
       description: string;
       summary?: string;
       cardSummary?: string;
     };
   }
   
   interface Episode {
     id: string;
     number: number;
     translations: EpisodeTranslations;
     // other fields...
   }
   ```

2. **Update episode retrieval functions to be language-aware:**
   ```typescript
   // src/utils/episodeUtils.ts
   
   export function getEpisode(
     seriesId: string, 
     episodeId: number, 
     language: string = 'en'
   ): Episode | undefined {
     const episode = getBaseEpisode(seriesId, episodeId);
     if (!episode) return undefined;
     
     // Apply translations if available
     if (language !== 'en' && episode.translations?.[language]) {
       return {
         ...episode,
         title: episode.translations[language].title || episode.title,
         description: episode.translations[language].description || episode.description,
         summary: episode.translations[language].summary || episode.summary,
         cardSummary: episode.translations[language].cardSummary || episode.cardSummary,
       };
     }
     
     return episode;
   }
   ```

#### Step 3.2: Translated Episode Data Creation (2-3 hours)
1. **Create Spanish translations for episode data:**
   - Start with the Urantia Papers series
   - Create a JSON structure with Spanish titles and descriptions
   - Consider using translation services for bulk translation

2. **Update components to use translated episode data:**
   ```typescript
   // In EpisodePage.tsx
   const { language } = useLanguage();
   const episode = getEpisode(seriesId, episodeId, language);
   ```

#### Step 3.3: Media Integration Verification (1 hour)
1. **Verify media utilities handle languages correctly:**
   - Test with actual Spanish audio files
   - Ensure proper fallback to English if Spanish not available
   - Add logging for debugging language-specific media loading

### Phase 4: SEO and Meta Tags (Priority 4)

#### Step 4.1: Meta Tags Component Update (1-2 hours)
1. **Update MetaTags component to be language-aware:**
   ```typescript
   // src/components/layout/MetaTags.tsx
   
   interface MetaTagsProps {
     title: string;
     description: string;
     url: string;
     imageUrl?: string;
     type?: string;
   }
   
   const MetaTags: React.FC<MetaTagsProps> = ({ title, description, url, imageUrl, type = 'website' }) => {
     const { language } = useLanguage();
     const { t } = useTranslation('meta');
     const alternates = getLanguageAlternates(url);
     
     return (
       <Helmet>
         <html lang={language} />
         <title>{title}</title>
         <meta name="description" content={description} />
         
         {/* Open Graph */}
         <meta property="og:title" content={title} />
         <meta property="og:description" content={description} />
         <meta property="og:url" content={url} />
         <meta property="og:type" content={type} />
         {imageUrl && <meta property="og:image" content={imageUrl} />}
         <meta property="og:locale" content={language === 'en' ? 'en_US' : `${language}_${language.toUpperCase()}`} />
         
         {/* Language alternates for SEO */}
         {Object.entries(alternates).map(([lang, href]) => (
           <link key={lang} rel="alternate" hrefLang={lang} href={href} />
         ))}
       </Helmet>
     );
   };
   ```

2. **Update page components to use translated meta content:**
   ```typescript
   // Example in EpisodePage.tsx
   
   <MetaTags 
     title={t('episode.meta.title', { title: episode.title })}
     description={t('episode.meta.description', { title: episode.title, description: episode.description.substring(0, 150) })}
     url={window.location.href}
     imageUrl={episode.imageUrl || "https://www.urantiabookpod.com/og-image.png"}
     type="article"
   />
   ```

### Phase 5: Testing and Quality Assurance (Priority 5)

#### Step 5.1: Component Testing (2 hours)
1. **Create tests for i18n components:**
   - Test language detection
   - Test language switching
   - Test URL pattern handling

2. **Test routing with language prefixes:**
   - Direct URL access with language prefix
   - Maintaining language when navigating
   - Switching language while on a page

#### Step 5.2: Manual Testing (2-3 hours)
1. **Create a comprehensive test plan:**
   - Test all pages in Spanish
   - Verify translations are complete and accurate
   - Check for layout issues with longer text
   - Test responsive design in different languages

2. **Media testing:**
   - Test Spanish audio playback
   - Test PDFs and transcripts
   - Verify language-specific download links

### Phase 6: Analytics and Monitoring (Priority 6)

#### Step 6.1: Analytics Integration (1 hour)
1. **Update analytics to track language:**
   ```typescript
   // src/utils/analytics.ts
   
   export function trackPageView(path: string) {
     const language = getLanguageFromPath(path);
     
     // Send to analytics provider
     window.gtag?.('event', 'page_view', {
       page_path: path,
       language: language,
     });
   }
   ```

2. **Add language-specific error tracking:**
   ```typescript
   export function trackError(errorType: string, details: any) {
     const { language } = useLanguage();
     
     // Send to error tracking
     window.gtag?.('event', 'error', {
       error_type: errorType,
       error_details: details,
       language: language,
     });
   }
   ```

## Translation File Organization

### Namespace Strategy
We'll use a clear namespace strategy to organize translations:

1. **common.json** - Navigation, footer, shared labels (✅ Basic done)
2. **ui.json** - UI components, buttons, form elements (❌ Needed)
3. **episode.json** - Episode player and related content (✅ Basic done)
4. **home.json** - Homepage content (❌ Needed)
5. **series.json** - Series listings and metadata (❌ Needed)
6. **errors.json** - Error messages and notifications (❌ Needed)
7. **meta.json** - SEO and meta content (❌ Needed)

### Key Structure Patterns
```json
{
  "nav": {
    "home": "Inicio",
    "episodes": "Episodios",
    "about": "Acerca de",
    "contact": "Contacto"
  },
  "buttons": {
    "play": "Reproducir",
    "pause": "Pausar",
    "download": "Descargar",
    "share": "Compartir"
  },
  "player": {
    "skipForward": "Avanzar 10 segundos",
    "skipBack": "Retroceder 10 segundos",
    "speed": "Velocidad: {{speed}}x"
  },
  "errors": {
    "audioLoad": "No se pudo cargar el audio. Intente de nuevo más tarde.",
    "episodeNotFound": "Episodio no encontrado"
  }
}
```

## Testing Strategy

### Manual Testing Checklist
- [x] Language switcher changes UI language
- [x] Language switcher updates URL
- [x] Direct URL access works (/es/episode/1)
- [x] Share menu translations working correctly
- [ ] Audio plays in selected language
- [ ] All UI text is translated (in progress)
- [x] Mobile responsive in both languages
- [ ] SEO meta tags include language info
- [ ] Analytics track language preference

### Automated Testing
- Unit tests for translation utilities
- Component tests with different languages
- Integration tests for language switching

## Success Criteria

- Users can switch languages via UI and URL
- All UI elements display in the selected language
- Audio files play correctly for each language
- SEO benefits are maintained with proper language meta tags
- Analytics track language preferences
- Spanish content is fully accessible and functional

## Timeline Estimate

**Total: 20-30 hours**
- Phase 1 (UI Translation): 8-12 hours
- Phase 2 (URL Routing): 3-6 hours
- Phase 3 (Episode Data): 4-5 hours
- Phase 4 (SEO): 2-3 hours
- Phase 5 (Testing): 2-3 hours
- Phase 6 (Analytics): 1 hour

## Future Expansion

- Add support for French and Portuguese
- Implement automatic language detection based on browser settings
- Create a translation management workflow for content creators
- Consider using a translation management system for larger scale