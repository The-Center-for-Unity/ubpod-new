# Internationalization (i18n) Implementation Plan

## Overview

This document outlines the plan for implementing internationalization (i18n) in the UBPod application. The goal is to make the podcast content accessible in multiple languages, starting with Spanish for the Urantia Papers series.

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
      common.json
      episode.json
      home.json
    /es
      common.json
      episode.json
      home.json
/src
  /i18n
    index.ts       # i18n configuration
    LanguageContext.tsx  # React context for language state
    LanguageSwitcher.tsx # UI component for switching languages
```

### URL Patterns

We will implement URL-based language selection:

- Default (English): `/episode/urantia-papers/1`
- Spanish: `/es/episode/urantia-papers/1`

### Content Translation

- UI strings will be stored in JSON files
- Episode data will include translations for titles and descriptions
- Audio files will be organized by language: `/audio/urantia-papers/es/paper-1.mp3`

## Implementation Phases

### Phase 1: Setup

1. Install required dependencies:
   - i18next
   - react-i18next
   - i18next-http-backend (for loading translations)
   - i18next-browser-languagedetector (for detecting user language)

2. Create initial configuration
   - Setup i18n instance
   - Create language context
   - Add language detection

### Phase 2: Basic Implementation

1. Create language switcher component
2. Implement URL-based routing with language prefix
3. Extract and translate UI strings for core components
4. Update metadata components to include language tags

### Phase 3: Content Translation

1. Modify episode data structure to support translations
2. Update audio URL generation to handle language-specific paths
3. Implement transcript handling for multiple languages

### Phase 4: Testing and Refinement

1. Test with Spanish audio files
2. Ensure SEO meta tags are correctly implemented
3. Verify language switching works correctly
4. Fix any UI or layout issues that arise from translation

## Future Expansion

- Add support for French and Portuguese
- Implement automatic language detection based on browser settings
- Consider implementing RTL language support if needed

## Success Criteria

- Users can switch languages via UI and URL
- All UI elements display in the selected language
- Audio files play correctly for each language
- SEO benefits are maintained with proper language meta tags
- Analytics track language preferences