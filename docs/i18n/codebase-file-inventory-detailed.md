# UrantiaBookPod Codebase File Inventory
*Generated for Content Localization Collection Workplan*

## Executive Summary

**Total Files Analyzed**: 115 source/data files across 30 directories
**Content Categories**: UI Components, Data Files, Utils, Pages, i18n Files
**Languages Supported**: English (complete), Spanish (partial)

## Complete Directory Structure

### Source Code (`src/` - 91 files)

```
src/
├── __tests__/
│   ├── components/
│   │   └── SeriesCard.test.tsx
│   ├── utils/
│   │   ├── test-utils.test.tsx
│   │   └── test-utils.tsx
│   └── setup.test.ts
├── api/
│   └── send.ts
├── components/
│   ├── analytics/
│   │   ├── GoogleAnalytics.tsx
│   │   ├── GoogleTagManager.tsx
│   │   ├── HotjarAnalytics.tsx
│   │   └── OptinMonster.tsx
│   ├── audio/
│   │   └── AudioPlayer.tsx
│   ├── contact/
│   ├── layout/
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   ├── MetaTags.tsx
│   │   └── ScrollToTop.tsx
│   ├── series/
│   │   └── SeriesContent.tsx
│   ├── shared/
│   │   ├── ErrorBoundary.tsx
│   │   ├── Icons.tsx
│   │   └── LocalizedLink.tsx
│   ├── ui/
│   │   ├── EpisodeCard.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── SeriesCard.tsx
│   │   ├── SeriesCardGrid.tsx
│   │   ├── SeriesNavigation.tsx
│   │   └── SocialShareMenu.tsx
│   ├── utils/
│   │   └── ScrollToTopOnNavigate.tsx
│   └── ScrollToTop.tsx
├── config/
│   ├── assets.ts
│   └── audio.ts
├── constants/
│   └── animations.ts
├── data/
│   ├── json/
│   │   ├── cosmic-series-mappings.json
│   │   ├── episodes.json
│   │   ├── jesus-series-mappings.json
│   │   ├── summaries-check.ts
│   │   ├── summaries.json
│   │   ├── urantia_summaries_es.json
│   │   └── urantia_summaries.json
│   ├── scraper/
│   │   ├── README.md
│   │   ├── requirements.txt
│   │   ├── scrape_discover_jesus.py
│   │   ├── summaries.json
│   │   └── valid_urls.json
│   ├── content.ts
│   ├── discoverJesusSummaries.ts
│   ├── episodes.ts
│   └── series-availability.json
├── hooks/
│   └── useAudioAnalytics.ts
├── i18n/
│   ├── i18n.ts
│   ├── LanguageContext.tsx
│   └── LanguageSwitcher.tsx
├── pages/
│   ├── ContactPage.tsx
│   ├── Debug.tsx
│   ├── DisclaimerPage.tsx
│   ├── EpisodePage.tsx
│   ├── Home.tsx
│   ├── ListenPage.tsx
│   ├── SeriesPage.tsx
│   └── UrantiaPapersPage.tsx
├── styles/
│   ├── globals.css
│   └── typography.css
├── types/
│   ├── global.d.ts
│   ├── index.ts
│   ├── json.d.ts
│   ├── r2.ts
│   └── sacred-companions.ts
├── utils/
│   ├── analytics.ts
│   ├── emailService.ts
│   ├── episodeUtils.ts
│   ├── i18nRouteUtils.ts
│   ├── mediaIntegration.ts
│   ├── mediaUtils.ts
│   ├── scrapeUtils.ts
│   ├── seriesAvailabilityUtils.ts
│   ├── seriesCollectionsUtils.ts
│   ├── seriesUtils.ts
│   └── urlUtils.ts
├── App.tsx
├── codebase-src.md
├── index.css
├── main.tsx
└── vite-env.d.ts
```

### Localization Files (`public/locales/` - 22 files)

```
public/locales/
├── en/
│   ├── common.json
│   ├── contact.json
│   ├── debug.json
│   ├── disclaimer.json
│   ├── episode.json
│   ├── home.json
│   ├── series-collections.json
│   ├── series-detail.json
│   ├── series-page.json
│   └── series.json
└── es/
    ├── content/
    │   ├── episode-loglines.json
    │   ├── episode-titles.json
    │   ├── general-summaries.json
    │   ├── jesus-summaries.json
    │   ├── series-metadata.json
    │   └── urantia-papers.json
    ├── common.json
    ├── contact.json
    ├── content.json
    ├── debug.json
    ├── disclaimer.json
    ├── episode.json
    ├── home.json
    ├── series-collections.json
    ├── series-detail.json
    ├── series-page.json
    └── series.json
```

### Scripts (`scripts/` - 7 files)

```
scripts/
├── convert-translations.js
├── generateMappings.ts
├── push-pdfs.sh
├── README.md
├── rename-and-push.sh
├── test-i18n-format.js
└── translate-content.js
```

## Content Analysis by Category

### 🔴 Critical Priority - Content Data (11 files)

| File | Size | Content Type | i18n Status | Description |
|------|------|--------------|-------------|-------------|
| `src/utils/episodeUtils.ts` | Large | Episode Logic | ❌ Hardcoded | Complete episode title arrays for all series (Jesus 1-14, Cosmic 1-14) |
| `src/utils/seriesUtils.ts` | Large | Series Logic | ❌ Hardcoded | Series titles, descriptions, categories (Lines 14-329) |
| `src/data/episodes.ts` | 41KB | Episode Data | ❌ Hardcoded | Paper titles (196 papers), episode metadata (Lines 141-289) |
| `src/data/json/episodes.json` | 93KB | Episode Data | ❌ English only | 400+ episode titles and descriptions |
| `src/data/json/urantia_summaries.json` | 151KB | Content Data | ❌ English only | 196 paper summaries |
| `src/data/json/summaries.json` | 253KB | Content Data | ❌ English only | General episode summaries |
| `src/data/discoverJesusSummaries.ts` | 228KB | Content Data | ❌ English only | Jesus-focused content |
| `src/data/json/urantia_summaries_es.json` | Small | Content Data | ✅ Spanish | Existing Spanish translations (partial) |
| `public/locales/es/content/*.json` | Various | Content Data | ⚠️ Partial | 6 files with partial Spanish translations |

### 🟡 High Priority - UI Components (15+ files)

| File | Content Type | i18n Status | Description |
|------|--------------|-------------|-------------|
| `src/components/layout/Header.tsx` | UI Navigation | ❌ Hardcoded | Navigation menu items, language switcher |
| `src/components/audio/AudioPlayer.tsx` | UI Controls | ❌ Hardcoded | Play/pause buttons, speed controls, error messages |
| `src/components/ui/EpisodeCard.tsx` | UI Component | ❌ Hardcoded | Episode display components |
| `src/components/ui/SeriesCard.tsx` | UI Component | ❌ Hardcoded | Series display components |
| `src/components/ui/SeriesNavigation.tsx` | UI Component | ❌ Hardcoded | Series navigation elements |
| `src/components/shared/ErrorBoundary.tsx` | UI Component | ❌ Hardcoded | Error messages and fallbacks |
| `public/locales/en/*.json` | UI Strings | ✅ English | Complete English UI translations (10 files) |
| `public/locales/es/*.json` | UI Strings | ✅ Spanish | Complete Spanish UI translations (10 files) |

### 🟢 Medium Priority - Pages (8 files)

| File | Content Type | i18n Status | Description |
|------|--------------|-------------|-------------|
| `src/pages/Home.tsx` | Page Content | ✅ i18n implemented | Hero text, feature descriptions, CTAs |
| `src/pages/ContactPage.tsx` | Page Content | ✅ i18n implemented | Contact form and labels |
| `src/pages/EpisodePage.tsx` | Page Content | ⚠️ Partial | Episode display page |
| `src/pages/ListenPage.tsx` | Page Content | ⚠️ Partial | Series listening page |
| `src/pages/SeriesPage.tsx` | Page Content | ⚠️ Partial | Series overview page |
| `src/pages/UrantiaPapersPage.tsx` | Page Content | ⚠️ Partial | Urantia papers listing |
| `src/pages/DisclaimerPage.tsx` | Page Content | ✅ i18n implemented | Legal disclaimer content |

### 🔵 Low Priority - Configuration (10+ files)

| File | Content Type | i18n Status | Description |
|------|--------------|-------------|-------------|
| `src/config/*.ts` | Configuration | ❌ N/A | Technical configuration files |
| `src/types/*.ts` | Type Definitions | ❌ N/A | TypeScript interfaces |
| `src/constants/*.ts` | Constants | ❌ N/A | Animation and styling constants |
| `src/hooks/*.ts` | React Hooks | ❌ N/A | Custom React hooks |

## Content Volume Analysis

### English Content (Estimated Word Count)
- **Episode Titles**: ~1,500 titles × 5 words = ~7,500 words
- **Episode Descriptions**: ~1,500 descriptions × 20 words = ~30,000 words  
- **Series Metadata**: ~28 series × 50 words = ~1,400 words
- **Paper Summaries**: 196 papers × 100 words = ~19,600 words
- **UI Strings**: ~500 strings × 3 words = ~1,500 words
- **Total Estimated**: ~60,000 words

### Spanish Translation Status
- ✅ **Complete**: UI strings (~1,500 words)
- ⚠️ **Partial**: Content translations (~25,000 words)
- ❌ **Missing**: Hardcoded content (~33,500 words)

## File Dependencies & Relationships

### Content Flow Architecture
```
JSON Data Files → Utils Functions → React Components → Pages
     ↓               ↓                ↓             ↓
episodes.json → episodeUtils.ts → EpisodeCard → EpisodePage
summaries.json → seriesUtils.ts → SeriesCard → SeriesPage
```

### Translation Dependencies
```
English Source → Translation Scripts → Spanish i18n Files
     ↓                    ↓                   ↓
Content Data → translate-content.js → public/locales/es/
Utils Logic → extract-hardcoded.js → Converted Components
```

## Identified Issues & Risks

### 🚨 Critical Issues
1. **Data Fragmentation**: Episode titles exist in 4+ different locations
2. **Hardcoded Logic**: Core functionality depends on hardcoded English strings
3. **Mixed Architecture**: Some content uses i18n, others use direct imports
4. **Incomplete Integration**: Language switching doesn't affect all content

### ⚠️ Technical Debt
1. **Maintenance Overhead**: Updates require changes in multiple files
2. **Inconsistent Patterns**: Different components handle content differently
3. **Performance Impact**: Multiple data sources increase bundle size
4. **Testing Complexity**: Content changes affect multiple test scenarios

### 🔧 Consolidation Opportunities
1. **Unified Content Schema**: Single source of truth for all content
2. **Consistent i18n Integration**: All content through translation system
3. **Automated Translation Pipeline**: Streamlined update process
4. **Centralized Content Management**: Easier maintenance and updates

## Next Steps Reference

This inventory will be used throughout the localization plan for:
- **Step 2**: Data source mapping and relationship analysis
- **Step 4**: Content schema design and namespace planning
- **Step 5**: Script development for consolidation
- **Step 7**: Component integration and content replacement
- **Step 10**: Comprehensive testing and validation

---

*This inventory provides the foundation for systematic content localization and will be updated as the project progresses.* 