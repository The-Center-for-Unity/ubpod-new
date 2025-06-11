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

**Progress (Updated: January 2025):**
- ✅ Header and Footer components updated to use translation hooks
- ✅ Translation files for common.json created and implemented
- ✅ Translation files for episode.json created and expanded
- ✅ Language switcher implemented and functioning
- ✅ URL routing with language prefixes implemented
- ✅ LocalizedLink component created for simplified route handling
- ✅ Basic layout improvements for multi-language support
- ✅ EpisodePage component updated to use translations
- ✅ SocialShareMenu component internationalized with namespaced translations
- ✅ Episode data internationalization framework fully implemented
- ✅ Fixed language-aware navigation for Next/Previous episode links
- ✅ **Series Collections Internationalization Complete** (NEW)
  - ✅ Created comprehensive translation files for series collections (`series-collections.json`)
  - ✅ Implemented language-aware series filtering (Jesus series hidden in Spanish)
  - ✅ Updated SeriesCardGrid and SeriesCard components with full translation support
  - ✅ Created translation utilities for series data and UI labels
  - ✅ Enhanced series utilities with language parameters

**Pending:**
- ⏳ Comprehensive translation files not completed for all pages (Series Collections ✅)
- ⏳ Automated script for full-site content translation
- ❌ SEO meta tags not language-aware
- ⏳ Home page series section integration with new translation system

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
   - `/public/locales/en/series.json` ✅

2. **Update components:**
   - `src/pages/Home.tsx`
   - `src/pages/SeriesPage.tsx`
   - `src/pages/ListenPage.tsx`
   - `src/pages/UrantiaPapersPage.tsx` ✅

3. **Translate high-impact UI elements:**
   - Hero section content ✅
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

#### Step 1.6: Conditional Series Display based on Language Availability ✅
A new requirement has been identified: not all series will be available in every language at launch. For example, the "Jesus Series" audio has not been produced for Spanish yet. The UI must be updated to only display series that are available for the selected language.

**Technical Solution:** ✅
We implemented a declarative, data-driven approach to control series visibility.

1.  **Created a Series Availability Manifest:** ✅
    -   Created `src/data/series-availability.json`.
    -   This file explicitly defines which series collections are available for each supported language.
    -   Final implementation structure:
        ```json
        {
          "en": [
            "jesus-1", "jesus-2", ..., "jesus-14",
            "cosmic-1", "cosmic-2", ..., "cosmic-14"
          ],
          "es": [
            "cosmic-1", "cosmic-2", ..., "cosmic-14"
          ]
        }
        ```

2.  **Created Filtering Utilities:** ✅
    -   `getAvailableSeriesIds(language)` - Returns array of available series IDs
    -   `filterSeriesByLanguage(series, language)` - Filters series arrays by availability
    -   `getAvailableCategories(language)` - Returns category availability flags

3.  **Updated UI Components:** ✅
    -   `SeriesCardGrid.tsx` updated to filter series by language availability
    -   Category buttons (Jesus Series/Cosmic Series) show/hide based on availability
    -   Automatic fallback when user switches to language without current category
    -   Status messages show correct series count for the language

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

### Phase 3: Episode Data Internationalization (Priority 3) ✅

#### Step 3.1: Episode Data Structure Update (2-3 hours) ✅
1. **Update episode data types:** ✅
   ```typescript
   interface EpisodeTranslations {
     [language: string]: {
       title: string;
       description?: string;
       summary?: string;
       cardSummary?: string;
       shortSummary?: string;
     };
   }
   
   interface Episode {
     id: number;
     title: string;
     description?: string;
     // ... other fields
     translations?: EpisodeTranslations;
   }
   ```

2. **Update episode retrieval functions to be language-aware:** ✅
   ```typescript
   // src/utils/episodeUtils.ts
   
   export function getEpisode(
     seriesId: string, 
     episodeId: number, 
     language: string = 'en'
   ): Episode | undefined {
     // Get base episode data
     const episodes = getEpisodesForSeries(seriesId);
     const episode = episodes.find(ep => ep.id === episodeId);
     if (!episode) return undefined;
     
     // Apply translations if available and not English
     if (language !== 'en' && episode.translations && episode.translations[language]) {
       const translation = episode.translations[language];
       
       // Create a new object with translations applied
       const translatedEpisode: Episode = {
         ...episode,
         title: translation.title || episode.title,
         description: translation.description || episode.description,
         summary: translation.summary || episode.summary,
         cardSummary: translation.cardSummary || episode.cardSummary,
         
         // For audio and PDF URLs, we need to adjust for language
         audioUrl: getAudioPath(episode.audioUrl, language),
         pdfUrl: episode.pdfUrl ? getPdfPath(episode.pdfUrl, language) : undefined,
         transcriptUrl: episode.transcriptUrl ? getTranscriptPath(episode.transcriptUrl, language) : undefined
       };
       
       return translatedEpisode;
     }
     
     return episode;
   }
   ```

2. **Update components to use translated episode data:** ✅
   ```typescript
   // In EpisodePage.tsx
   const { language } = useLanguage();
   const episode = getEpisode(seriesId, episodeId, language);
   ```

#### Step 3.3: Media Integration Verification (1 hour) ✅
1. **Verify media utilities handle languages correctly:** ✅
   - Updated URL generation for all media to use filename localization (e.g., `file-es.mp3`). ✅
   - Removed faulty client-side existence checks. ✅
   - Added proper fallback to English if Spanish translations not available. ✅
   - Added logging for debugging language-specific media loading. ✅
   - Updated EpisodePage component to pass language to episode retrieval functions. ✅

#### Step 3.4: File Existence Check (Deferred) ✅
A key challenge identified during i18n implementation is the need to dynamically check for the existence of media files (especially transcripts) on the R2 bucket before displaying a download link. The original method for this is not compatible with cross-origin requests from a client-side application.

**Decision:** ✅
- A robust, server-side file checking mechanism will be implemented. ✅
- This is a significant task that is separate from the primary i18n effort.
- A detailed work plan has been created in `docs/development/R2-file-check-work-plan.md`.
- This task will be addressed **after** the completion of the i18n feature. ✅

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

### Phase 7: Automated Content Translation (Future Priority)

#### Step 7.1: Create Master Translation Script (2-3 hours)
1. **Develop a Node.js script for automated translation:**
   - Reads source JSON files (e.g., `urantia_summaries.json`).
   - Iterates through each entry and specified text fields.
   - Connects to a translation API (e.g., Google Translate, DeepL) to translate content.
   - Writes the translated content to a new language-specific JSON file (e.g., `urantia_summaries_es.json`).

2. **Note on Timing:**
   - This script will be developed towards the end of the i18n project.
   - This ensures all content structures and translation requirements across the entire site are finalized before performing a bulk translation.

## Series Collections Internationalization Implementation ✅

### Architecture Overview
A comprehensive internationalization system has been implemented for series collections with the following components:

**Translation Files:**
- `public/locales/en/series-collections.json` - Complete English translations for all 28 series
- `public/locales/es/series-collections.json` - Spanish translations for cosmic series only

**Utilities:**
- `src/utils/seriesCollectionsUtils.ts` - Translation functions and UI label management
- `src/utils/seriesAvailabilityUtils.ts` - Language-based series filtering
- Enhanced `src/utils/seriesUtils.ts` - Language-aware series data functions

**Components Updated:**
- `src/components/ui/SeriesCardGrid.tsx` - Full translation support with language filtering
- `src/components/ui/SeriesCard.tsx` - Translated badges and action labels

**Configuration:**
- `src/i18n/i18n.ts` - Added `series-collections` namespace
- `src/data/series-availability.json` - Defines series availability per language

### Translation Coverage
**English:** All 28 series (jesus-1 through jesus-14, cosmic-1 through cosmic-14)
**Spanish:** 14 cosmic series only (cosmic-1 through cosmic-14)

**UI Elements Translated:**
- Category buttons ("All Series", "Jesus Series", "Cosmic Series")
- Status messages ("Showing X series", "No series found")
- Action labels ("View Episodes", "Ver Episodios")
- Category badges ("Jesus Series", "Serie de Jesús")

### Key Features
- **Language-aware filtering**: Jesus series automatically hidden in Spanish
- **Graceful fallbacks**: Missing translations default to English
- **Dynamic UI adaptation**: Buttons show/hide based on language availability
- **Extensible architecture**: Easy to add new languages or series

## Translation File Organization

### Namespace Strategy
We'll use a clear namespace strategy to organize translations:

1. **common.json** - Navigation, footer, shared labels (✅ Basic done)
2. **ui.json** - UI components, buttons, form elements (❌ Needed)
3. **episode.json** - Episode player and related content (✅ Basic done)
4. **home.json** - Homepage content (❌ Needed)
5. **series.json** - Series listings and metadata (✅ Basic done)
6. **series-collections.json** - Thematic series data and UI (✅ Complete)
7. **errors.json** - Error messages and notifications (❌ Needed)
8. **meta.json** - SEO and meta content (❌ Needed)

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

**Total: 22-33 hours**
- Phase 1 (UI Translation): 8-12 hours
- Phase 2 (URL Routing): 3-6 hours
- Phase 3 (Episode Data): 4-5 hours
- Phase 4 (SEO): 2-3 hours
- Phase 5 (Testing): 2-3 hours
- Phase 6 (Analytics): 1 hour
- Phase 7 (Scripting): 2-3 hours

## Future Expansion

- Add support for French and Portuguese
- Implement automatic language detection based on browser settings
- Create a translation management workflow for content creators
- Consider using a translation management system for larger scale