# Simple CMS Feature Work Plan - COMPREHENSIVE REVISION

**Project:** UrantiaBookPod JSON Content Aggressive Streamlining  
**Date:** 2025-06-20 (Complete Revision Based on Deep Analysis)  
**Approach:** Radical episodes.json Streamlining + Comprehensive Bug Fixes  
**Estimated Timeline:** 4-5 days (increased due to comprehensive scope)  

---

## 🚨 CRITICAL FINDINGS FROM DEEP ANALYSIS

Gabriel's observations revealed **major oversights** in the original analysis:

### **1. Missing Foreword Support (Episode 0)** ❌
- **CRITICAL BUG**: `getAudioUrl()` and `getPdfUrl()` don't handle episode 0 (Foreword)
- **Impact**: Broken URLs for Foreword in all platform series
- **Evidence**: `mediaUtils.ts` has foreword logic, but `audio.ts` doesn't use language parameter

### **2. Deprecated History Series Still Active** ❌
- **LEGACY DEBT**: History series appears in multiple files but was "deprecated long ago"
- **Cleanup Needed**: Remove from `episodes.json`, `types/index.ts`, `urlUtils.ts`, `mediaUtils.ts`, `EpisodePage.tsx`, etc.
- **Translation Files**: Still exists in `series-metadata.json` for both EN/ES

### **3. Missing Language Parameter in URL Generation** ❌
- **BUG**: `getAudioUrl()` and `getPdfUrl()` in `audio.ts` don't accept language parameter
- **Impact**: Spanish URLs always default to English
- **Required**: Add language parameter to all URL generation functions

### **4. Sloppy i18n Implementation** ❌
- **HARDCODED TEXT**: EpisodeCard has hardcoded "Episode" text instead of i18n
- **NON-I18N TITLES**: Episode titles in `episodes.json` are English-only
- **INCONSISTENT**: Some components use i18n, others don't

### **5. Bogus Fields in episodes.json** ❌
- **UNUSED FIELDS**: `audioUrl` and `imageUrl` fields are not dynamically generated
- **CONFUSION**: These fields create false impression of being "source of truth"
- **AGGRESSIVE CLEANUP**: Delete these fields entirely after confirming no usage

### **6. English-Only Title Problem** ❌
- **QUESTION**: What is the English-only "title" field used for?
- **I18N GAP**: Titles should come from i18n system, not hardcoded in episodes.json
- **SOLUTION**: Move titles to translation files, keep only metadata in episodes.json

---

## 🔥 ARCHITECTURAL CRISIS: DUAL URANTIA PAPERS SYSTEM

**CRITICAL DISCOVERY**: The codebase has **two competing systems** for accessing Urantia Papers, creating massive confusion and bugs.

### **The Dual System Problem**

**System 1: Legacy `urantia-papers` Series**
- Contains only papers 0-5 in `episodes.json`
- Uses special `generateUrantiaPapers()` function that **completely ignores episodes.json**
- Generates all 197 papers (0-196) programmatically
- Has its own translation system via `getSpanishPaperTitle()`, `getSpanishPaperCard()`, etc.
- Accessible via `/urantia-papers` route and `UrantiaPapersPage`
- **Bypasses the entire streamlined CMS system**

**System 2: New `series-platform-1` through `series-platform-4`**
- Contains ALL papers 1-196 properly organized by parts in `episodes.json`
- Uses the new streamlined `getEpisode()` function with `summaryKey` system
- Relies on episodes.json data + translation files
- Accessible via `/series/series-platform-X/Y` routes
- **Uses the proper streamlined CMS system**

### **Why This Is a Disaster**

1. **Schizophrenic Codebase**: Same paper accessible via two different systems with different behaviors
2. **Inconsistent Data**: Paper 2 behaves differently depending on route used
3. **Maintenance Nightmare**: Changes need to be made in multiple places
4. **Translation Chaos**: Two different translation systems for identical content
5. **URL Confusion**: Multiple URLs for same content (`/urantia-papers/2` vs `/series/series-platform-1/2`)
6. **Bug Multiplication**: The `generateUrantiaPapers()` function creates a parallel universe of episode data

### **Current Bug Manifestation**

The Spanish summary bug we just encountered happened because:
1. User accessed `/es/series/urantia-papers/2`
2. This triggered `getEpisode('urantia-papers', 2, 'es')`
3. Which looked in the incomplete `urantia-papers` section of episodes.json
4. Found `"summaryKey": null` (which we patched)
5. But the **real issue** is that `urantia-papers` shouldn't exist in episodes.json at all!

### **Gabriel's Vision: Unified Series Architecture**

Gabriel's insight is correct: **`urantia-papers` should be just another series** like Jesus and Cosmic series:

- **Jesus Series**: Takes curated content from DiscoverJesus.com
- **Cosmic Series**: Takes curated selections from Urantia Papers  
- **Urantia Papers Series**: Takes the complete, sequential Urantia Papers

All three should use the **same streamlined CMS system**.

### **Gabriel's Refined Requirements (Updated)**

After discovering the dual system crisis, Gabriel has clarified the ideal architecture:

1. **Treat all series equally**: `urantia-papers`, `jesus`, and `cosmic` should use identical CMS architecture
2. **Eliminate cryptic naming**: Remove confusing `series-platform-X` construct entirely  
3. **Preserve special UI**: Keep unique UrantiaPapersPage design (grid/list view, search, parts organization)
4. **Maintain simple URLs**: Keep `/urantia-papers/X` route structure for user familiarity
5. **Single source of truth**: All papers use same streamlined CMS system

**Key Insight**: The `series-platform-X` naming was always meant to be temporary - it's cryptic and user-unfriendly. The goal is clean, semantic series names that users understand.

---

## 🚀 PROPOSED REFACTORING SOLUTION - GABRIEL'S UNIFIED APPROACH

### **Recommended Solution: Unified Series Architecture**

**Consolidate everything into a single, clean `urantia-papers` series:**

```typescript
// 1. Merge all series-platform-X data into single urantia-papers series
// 2. Remove cryptic series-platform-X entirely
// 3. Keep clean, user-friendly URLs:

// BEFORE (Confusing):
/series/series-platform-1/2 → Paper 2
/series/series-platform-2/1 → Paper 32
/series/series-platform-3/15 → Paper 71
/series/series-platform-4/77 → Paper 196

// AFTER (Clean):
/urantia-papers/2 → Paper 2
/urantia-papers/32 → Paper 32  
/urantia-papers/71 → Paper 71
/urantia-papers/196 → Paper 196
```

**Benefits:**
- ✅ Single source of truth for all Urantia Papers
- ✅ Clean, semantic URLs that users understand
- ✅ Preserves special UrantiaPapersPage design
- ✅ Uses streamlined CMS system throughout
- ✅ Eliminates cryptic `series-platform-X` naming
- ✅ Consistent with `jesus` and `cosmic` series architecture

**Implementation:**
```json
// src/data/json/episodes.json - Consolidate into single urantia-papers series
{
  "urantia-papers": {
    "seriesTitle": "The Urantia Papers",
    "seriesDescription": "The complete Urantia Book, one paper at a time.",
    "episodes": [
      { "id": 0, "summaryKey": "paper_0", "paperNumber": 0 },
      { "id": 1, "summaryKey": "paper_1", "paperNumber": 1 },
      { "id": 2, "summaryKey": "paper_2", "paperNumber": 2 },
      // ... continue for ALL 197 papers
      { "id": 196, "summaryKey": "paper_196", "paperNumber": 196 }
    ]
  },
  // Remove series-platform-1, series-platform-2, series-platform-3, series-platform-4 entirely
  "jesus": { /* existing jesus series unchanged */ },
  "cosmic": { /* existing cosmic series unchanged */ }
}
```

```typescript
// src/pages/UrantiaPapersPage.tsx - Use standard CMS functions
export default function UrantiaPapersPage() {
  // Replace generateUrantiaPapers() with standard getEpisodesForSeries()
  const allPapers = getEpisodesForSeries('urantia-papers', language);
  
  // Keep all existing UI features:
  // - Grid/list view toggle
  // - Search functionality  
  // - Parts organization
  // - Color-coded sections
  
  // URLs remain clean: /urantia-papers/2, /es/urantia-papers/196
}
```

### **Migration Strategy**

**Step 1: Data Consolidation**
- Merge all `series-platform-X` episode data into single `urantia-papers` series
- Ensure all 197 papers have correct `summaryKey` values
- Remove `series-platform-1` through `series-platform-4` entirely

**Step 2: Function Updates**  
- Remove `generateUrantiaPapers()` function completely
- Update `UrantiaPapersPage.tsx` to use `getEpisodesForSeries('urantia-papers')`
- Remove all platform-series-specific logic

**Step 3: Route Cleanup**
- Remove `/series/series-platform-X/Y` routes from App.tsx
- Keep clean `/urantia-papers/X` routes
- Ensure proper language support: `/es/urantia-papers/X`

**Step 4: UI Preservation**
- Maintain all special UrantiaPapersPage features (grid/list, search, parts)
- Keep color-coding and organization by parts
- Preserve user experience while using streamlined backend

---

## 🎯 RECOMMENDED IMPLEMENTATION PLAN

### **Phase 0: Urantia Papers Refactoring (New - 1 day)**

**Step 0.1: Create Paper-to-Platform Mapping**
```typescript
// src/utils/paperMapping.ts
export const PAPER_TO_PLATFORM_MAP = {
  0: { series: 'series-platform-1', episode: 0 }, // Foreword special case
  1: { series: 'series-platform-1', episode: 1 },
  2: { series: 'series-platform-1', episode: 2 },
  // ... continue for all papers
  31: { series: 'series-platform-1', episode: 31 },
  32: { series: 'series-platform-2', episode: 1 },
  // ... etc
  196: { series: 'series-platform-4', episode: 77 }
};

export function getPlatformMapping(paperNumber: number) {
  return PAPER_TO_PLATFORM_MAP[paperNumber];
}
```

**Step 0.2: Add Redirect Logic**
```typescript
// src/pages/EpisodePage.tsx - Handle urantia-papers redirects
if (series === 'urantia-papers') {
  const paperNumber = parseInt(id, 10);
  const mapping = getPlatformMapping(paperNumber);
  
  if (!mapping) {
    setError(`Invalid paper number: ${paperNumber}`);
    return;
  }
  
  const basePath = language === 'en' ? '' : `/${language}`;
  const newUrl = `${basePath}/series/${mapping.series}/${mapping.episode}`;
  
  console.log(`Redirecting urantia-papers/${paperNumber} → ${newUrl}`);
  navigate(newUrl, { replace: true });
  return;
}
```

**Step 0.3: Update UrantiaPapersPage to Use Platform Series**
```typescript
// src/pages/UrantiaPapersPage.tsx - Rewrite to use platform series
export default function UrantiaPapersPage() {
  const { language } = useLanguage();
  
  // Get all papers from platform series instead of generateUrantiaPapers()
  const allPapers = useMemo(() => {
    const papers: Episode[] = [];
    
    // Collect from all platform series
    for (let i = 1; i <= 4; i++) {
      const seriesEpisodes = getEpisodesForSeries(`series-platform-${i}`, language);
      papers.push(...seriesEpisodes);
    }
    
    return papers.sort((a, b) => a.id - b.id);
  }, [language]);

  // Update all links to use platform series URLs
  const getPaperUrl = (paper: Episode) => {
    const mapping = getPlatformMapping(paper.id);
    const basePath = language === 'en' ? '' : `/${language}`;
    return `${basePath}/series/${mapping.series}/${mapping.episode}`;
  };
  
  // ... rest of component uses platform series logic
}
```

**Step 0.4: Remove generateUrantiaPapers() Function**
```typescript
// src/utils/episodeUtils.ts - Delete entire generateUrantiaPapers function
// Remove special case in getEpisodesForSeries:

export function getEpisodesForSeries(seriesId: string, language: string = 'en'): Episode[] {
  // DELETE THIS BLOCK:
  // if (seriesId === 'urantia-papers') {
  //   episodes = generateUrantiaPapers();
  // }
  
  // Now all series use the same streamlined system
  if (episodesData[seriesId as keyof typeof episodesData]) {
    const seriesData = episodesData[seriesId as keyof typeof episodesData];
    // ... standard processing
  }
}
```

**Step 0.5: Delete urantia-papers from episodes.json**
```json
// episodes.json - Remove entire urantia-papers section
{
  "jesus-1": { ... },
  "cosmic-1": { ... },
  // DELETE: "urantia-papers": { ... },
  "series-platform-1": { ... }
}
```

**Step 0.6: Update Navigation and Links**
```typescript
// Update all files that reference /urantia-papers:
// - src/components/layout/Header.tsx
// - src/components/layout/Footer.tsx  
// - src/pages/Home.tsx
// - src/pages/ContactPage.tsx
// - src/App.tsx (routes)

// BEFORE:
<LocalizedLink to="/urantia-papers">

// AFTER:
<LocalizedLink to="/series/series-platform-1">
```

### **Testing the Refactoring**

```javascript
// Test script to verify all urantia-papers URLs redirect correctly
const testCases = [
  { old: '/urantia-papers/0', new: '/series/series-platform-1/0' },
  { old: '/urantia-papers/1', new: '/series/series-platform-1/1' },
  { old: '/urantia-papers/31', new: '/series/series-platform-1/31' },
  { old: '/urantia-papers/32', new: '/series/series-platform-2/1' },
  { old: '/urantia-papers/196', new: '/series/series-platform-4/77' },
  { old: '/es/urantia-papers/2', new: '/es/series/series-platform-1/2' }
];

testCases.forEach(({ old, new: expected }) => {
  console.log(`Testing redirect: ${old} → ${expected}`);
  // Verify redirect logic works correctly
});
```

---

## REVISED AGGRESSIVE STREAMLINING PLAN

**Philosophy**: Minimize `episodes.json` to **pure metadata only**, eliminate all hardcoded URLs, fix all i18n gaps, remove deprecated series entirely.

---

## PHASE 1: Comprehensive Cleanup (2 days)

### Step 1.1: Remove Deprecated History Series Completely
**Duration:** 1 hour
**Files:** Multiple files need cleanup

**A. Remove from episodes.json:**
```json
// DELETE this entire section from episodes.json
"history": {
  "seriesTitle": "History of the Urantia Papers",
  "seriesDescription": "The fascinating story behind the Urantia Papers and how they came to be.",
  "episodes": [...]
}
```

**B. Remove from TypeScript types:**
```typescript
// src/types/index.ts - Remove 'history' from LegacySeriesType
export type LegacySeriesType = 
  'urantia-papers' | 
  'discover-jesus' | 
  // 'history' |  // DELETE THIS LINE
  'sadler-workbooks';
```

**C. Remove from URL utilities:**
```typescript
// src/utils/urlUtils.ts - Remove history mapping
export const legacySeriesMap: Record<string, string> = {
  'urantia-papers': 'urantia-papers',
  'jesus-1': 'jesus-1',
  'discover-jesus': 'jesus-1',
  // 'history': 'series-platform-3', // DELETE THIS LINE
  'sadler-workbooks': 'series-platform-1',
};
```

**D. Remove from media utilities:**
```typescript
// src/utils/mediaUtils.ts - Remove entire history section (lines 83-96)
// DELETE:
// if (seriesId === 'history') {
//   ... entire block
// }
```

**E. Remove from EpisodePage.tsx:**
```typescript
// Remove 'history' from validLegacySeries array
const validLegacySeries = ['urantia-papers', 'discover-jesus', 'sadler-workbooks'];
```

**F. Remove translation files:**
```bash
# Remove history sections from:
# src/locales/en/content/series-metadata.json
# src/locales/es/content/series-metadata.json
```

### Step 1.2: Aggressive episodes.json Streamlining
**Duration:** 2 hours
**Goal:** Remove ALL hardcoded URLs and English-only content

**BEFORE (Current Structure):**
```json
{
  "id": 1,
  "title": "The Universal Father",           // ❌ English-only
  "audioUrl": "cosmic-1-1.mp3",              // ❌ Hardcoded
  "pdfUrl": "/pdfs/cosmic-1/1.pdf",          // ❌ Hardcoded
  "summaryKey": "paper_1",
  "imageUrl": "/images/cosmic-1/card-1.jpg"   // ❌ Hardcoded
}
```

**AFTER (Streamlined Structure):**
```json
{
  "id": 1,
  "summaryKey": "paper_1",
  "paperNumber": 1  // For Urantia Papers only
}
```

**Fields to DELETE entirely:**
- `title` → Move to i18n translation files
- `audioUrl` → Generate dynamically with language support
- `pdfUrl` → Generate dynamically with language support 
- `imageUrl` → Generate dynamically or use default pattern

**Fields to KEEP:**
- `id` → Episode number within series
- `summaryKey` → Link to translation content
- `paperNumber` → For Urantia Papers series only (maps to actual paper number)

### Step 1.3: Verify No Code Dependencies on Deleted Fields
**Duration:** 1 hour

**Search for usage of deleted fields:**
```bash
# Check if audioUrl is used directly (should only be in EpisodeCard)
grep -r "audioUrl" src/ --include="*.tsx" --include="*.ts"

# Check if imageUrl is used directly
grep -r "imageUrl" src/ --include="*.tsx" --include="*.ts"

# Check if episode.title is used directly
grep -r "episode\.title" src/ --include="*.tsx" --include="*.ts"
```

**Update EpisodeCard.tsx to not destructure deleted fields:**
```typescript
// BEFORE:
const { id, title, description, summary, cardSummary, audioUrl, pdfUrl, series, imageUrl, sourceUrl } = episode;

// AFTER:
const { id, summaryKey, paperNumber } = episode;
// Get title, audioUrl, pdfUrl, imageUrl dynamically
```

---

## PHASE 2: Fix URL Generation with Language Support (1 day)

### Step 2.1: Add Language Parameter to audio.ts
**Duration:** 30 minutes
**Files:** `src/config/audio.ts`

```typescript
/**
 * Get the audio URL for an episode with language support
 * 
 * @param series The series ID
 * @param id The episode ID within the series
 * @param language The language code (default: 'en')
 * @returns URL to the audio file
 */
export function getAudioUrl(series: string, id: number, language: string = 'en'): string {
  try {
    // Use mediaUtils as the single source of truth with language
    const url = getMediaUrl(series, id, 'mp3', language);
    if (!url) {
      console.error(`[audio] No audio URL found for ${series}-${id} (${language})`);
      throw new Error(`No audio URL found for ${series}-${id} (${language})`);
    }
    return url;
  } catch (error) {
    console.error(`[ERROR] Error generating audio URL: ${error}`);
    throw error;
  }
}

/**
 * Get the PDF URL for a paper with language support
 * @param series The series ID
 * @param id The episode ID
 * @param language The language code (default: 'en')
 * @returns URL to the PDF file or undefined if none exists
 */
export function getPdfUrl(series: string, id: number, language: string = 'en'): string | undefined {
  try {
    // Use mediaUtils as the single source of truth with language
    const url = getMediaUrl(series, id, 'pdf', language);
    return url || undefined;
  } catch (error) {
    console.error(`[ERROR] Error generating PDF URL: ${error}`);
    return undefined;
  }
}
```

### Step 2.2: Fix Foreword (Episode 0) Support
**Duration:** 45 minutes
**Files:** `src/utils/mediaUtils.ts`

**Ensure mediaUtils handles episode 0 correctly:**
```typescript
// In getMediaUrl function, add explicit foreword handling:
if (episodeNumber === 0) {
  // Handle Foreword for all series that support it
  const baseFilename = `foreword.${fileType}`;
  
  if (language === 'es') {
    return `${R2_BASE_URL}/foreword-es.${fileType}`;
  }
  return `${R2_BASE_URL}/${baseFilename}`;
}
```

**Test foreword URLs:**
```javascript
// Test script to verify foreword URLs
console.log('Foreword EN Audio:', getAudioUrl('series-platform-1', 0, 'en'));
console.log('Foreword ES Audio:', getAudioUrl('series-platform-1', 0, 'es'));
console.log('Foreword EN PDF:', getPdfUrl('series-platform-1', 0, 'en'));
console.log('Foreword ES PDF:', getPdfUrl('series-platform-1', 0, 'es'));
```

### Step 2.3: Update episodeUtils.ts with Language Support
**Duration:** 1 hour
**Files:** `src/utils/episodeUtils.ts`

```typescript
// Update getEpisode function to accept language and generate URLs dynamically
export function getEpisode(seriesId: string, episodeId: number, language: string = 'en'): Episode | undefined {
  // Get episode metadata from episodes.json
  const episodeData = getEpisodeMetadata(seriesId, episodeId);
  if (!episodeData) return undefined;

  // Generate all URLs dynamically with language support
  const audioUrl = getAudioUrl(seriesId, episodeId, language);
  const pdfUrl = getPdfUrl(seriesId, episodeId, language);
  const imageUrl = getImageUrl(seriesId, episodeId); // Language-neutral
  
  // Get title from i18n system
  const title = getEpisodeTitle(seriesId, episodeId, language);
  
  // Get summary content from i18n system
  const summaryContent = getSummaryContent(episodeData.summaryKey, language);

  return {
    id: episodeId,
    title,
    audioUrl,
    pdfUrl,
    imageUrl,
    series: seriesId,
    ...summaryContent, // cardSummary, summary, description
    summaryKey: episodeData.summaryKey,
    paperNumber: episodeData.paperNumber // For Urantia Papers only
  };
}

// New helper functions
function getEpisodeMetadata(seriesId: string, episodeId: number) {
  // Read from streamlined episodes.json
  const seriesData = getSeriesData(seriesId);
  return seriesData?.episodes.find(ep => ep.id === episodeId);
}

function getEpisodeTitle(seriesId: string, episodeId: number, language: string): string {
  // Get title from i18n translation files
  const titleKey = `series.${seriesId}.episodes.${episodeId}.title`;
  return t(titleKey, { defaultValue: `Episode ${episodeId}` });
}

function getImageUrl(seriesId: string, episodeId: number): string {
  // Generate image URL using consistent pattern
  return `/images/${seriesId}/card-${episodeId}.jpg`;
}
```

---

## PHASE 3: Fix i18n Implementation (1 day)

### Step 3.1: Move Titles to Translation Files
**Duration:** 2 hours
**Files:** `src/locales/en/content/episode-titles.json`, `src/locales/es/content/episode-titles.json`

**Create comprehensive episode title files:**
```json
// src/locales/en/content/episode-titles.json
{
  "cosmic-1": {
    "1": "The Universal Father",
    "2": "The Universe of Universes",
    "3": "The Sacred Spheres of Paradise",
    // ... all episodes
  },
  "jesus-1": {
    "1": "The Personality of God",
    "2": "Sojourn in Alexandria",
    // ... all episodes
  },
  "series-platform-1": {
    "0": "Foreword",
    "1": "The Universal Father",
    // ... all papers
  }
}
```

### Step 3.2: Fix EpisodeCard i18n Implementation
**Duration:** 1 hour
**Files:** `src/components/ui/EpisodeCard.tsx`

**BEFORE (Sloppy Implementation):**
```typescript
<h3 className="text-xl font-semibold mb-3 text-white line-clamp-2 min-h-[3.5rem]">
  {t('series-detail:episodeCard.episodePrefix')} {id}: {title}
</h3>
```

**AFTER (Proper Implementation):**
```typescript
// Get episode data with proper language support
const episodeWithUrls = useMemo(() => {
  return getEpisode(seriesId, episode.id, language);
}, [seriesId, episode.id, language]);

// Use proper i18n for episode prefix
const episodePrefix = t('series-detail:episodeCard.episodePrefix', { defaultValue: 'Episode' });

<h3 className="text-xl font-semibold mb-3 text-white line-clamp-2 min-h-[3.5rem]">
  {episodePrefix} {id}: {episodeWithUrls?.title}
</h3>
```

**Fix download button to use correct URL:**
```typescript
// BEFORE (Wrong - uses audioUrl for download):
<a href={audioUrl} download>

// AFTER (Correct - uses pdfUrl for download):
{episodeWithUrls?.pdfUrl && (
  <a 
    href={episodeWithUrls.pdfUrl} 
    download
    className="flex items-center gap-1 px-3 py-2 bg-navy/50 text-white/90 rounded-md hover:bg-navy/70 transition-colors"
  >
    <Download size={16} />
    <span>{t('series-detail:episodeCard.actions.download')}</span>
  </a>
)}
```

### Step 3.3: Add Missing Translation Keys
**Duration:** 30 minutes
**Files:** `src/locales/en/*.json`, `src/locales/es/*.json`

**Add missing keys to series-detail.json:**
```json
{
  "episodeCard": {
    "episodePrefix": "Episode",
    "actions": {
      "listen": "Listen",
      "read": "Read",
      "download": "Download PDF"
    }
  }
}
```

---

## PHASE 4: Automated Testing & Validation (1 day)

### Step 4.1: Unit Tests for URL Generation Functions
**Duration:** 1 hour

```javascript
// src/__tests__/utils/urlGeneration.test.ts
import { getEpisode } from '../../utils/episodeUtils';
import { getAudioUrl, getPdfUrl } from '../../config/audio';
import { getMediaUrl } from '../../utils/mediaUtils';

describe('URL Generation with Language Support', () => {
  
  describe('Foreword Support (Episode 0)', () => {
    test('should generate correct English foreword URLs', () => {
      const episode = getEpisode('urantia-papers', 0, 'en');
      expect(episode?.title).toBe('Foreword');
      expect(episode?.audioUrl).toContain('foreword.mp3');
      expect(episode?.pdfUrl).toContain('foreword.pdf');
    });

    test('should generate correct Spanish foreword URLs', () => {
      const episode = getEpisode('urantia-papers', 0, 'es');
      expect(episode?.title).toBe('Prólogo');
      expect(episode?.audioUrl).toContain('foreword-es.mp3');
      expect(episode?.pdfUrl).toContain('foreword-es.pdf');
    });
  });

  describe('Cosmic Series URL Generation', () => {
    test('should generate English URLs without language suffix', () => {
      const episode = getEpisode('cosmic-1', 1, 'en');
      expect(episode?.audioUrl).toContain('paper-1.mp3');
      expect(episode?.pdfUrl).toContain('paper-1.pdf');
      expect(episode?.audioUrl).not.toContain('-en');
    });

    test('should generate Spanish URLs with -es suffix', () => {
      const episode = getEpisode('cosmic-1', 1, 'es');
      expect(episode?.audioUrl).toContain('paper-1-es.mp3');
      expect(episode?.pdfUrl).toContain('paper-1-es.pdf');
      expect(episode?.audioUrl).not.toContain('/es/');
    });
  });

  describe('Jesus Series URL Generation', () => {
    test('should generate audio URLs but no PDF URLs', () => {
      const episode = getEpisode('jesus-1', 1, 'en');
      expect(episode?.audioUrl).toBeDefined();
      expect(episode?.pdfUrl).toBeUndefined();
      expect(episode?.sourceUrl).toContain('discoverjesus.com');
    });

    test('should generate Spanish Jesus URLs with language suffix', () => {
      const episode = getEpisode('jesus-1', 1, 'es');
      expect(episode?.audioUrl).toContain('-es.mp3');
      expect(episode?.pdfUrl).toBeUndefined();
    });
  });

  describe('Deprecated Series Removal', () => {
    test('should not return episodes for deprecated history series', () => {
      const episode = getEpisode('history', 1, 'en');
      expect(episode).toBeUndefined();
    });
  });

  describe('Episode Title Translation', () => {
    test('should return proper English titles', () => {
      const episode = getEpisode('cosmic-1', 1, 'en');
      expect(episode?.title).toBe('The Universal Father');
    });

    test('should return proper Spanish titles', () => {
      const episode = getEpisode('cosmic-1', 1, 'es');
      expect(episode?.title).toBe('El Padre Universal');
    });
  });
});
```

### Step 4.2: Integration Tests for Episode Components
**Duration:** 1.5 hours

```javascript
// src/__tests__/components/EpisodeCard.test.tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import EpisodeCard from '../../components/ui/EpisodeCard';
import i18n from '../../i18n/i18n';
import { LanguageProvider } from '../../i18n/LanguageContext';

const renderWithProviders = (component: React.ReactElement, language = 'en') => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <LanguageProvider initialLanguage={language}>
          {component}
        </LanguageProvider>
      </I18nextProvider>
    </BrowserRouter>
  );
};

describe('EpisodeCard Component', () => {
  const mockEpisode = {
    id: 1,
    series: 'cosmic-1' as const,
    summaryKey: 'paper_1'
  };

  test('should display correct episode title in English', () => {
    renderWithProviders(<EpisodeCard episode={mockEpisode} />, 'en');
    expect(screen.getByText(/The Universal Father/)).toBeInTheDocument();
  });

  test('should display correct episode title in Spanish', () => {
    renderWithProviders(<EpisodeCard episode={mockEpisode} />, 'es');
    expect(screen.getByText(/El Padre Universal/)).toBeInTheDocument();
  });

  test('should show Read button for Jesus series', () => {
    const jesusEpisode = { ...mockEpisode, series: 'jesus-1' as const, summaryKey: 'topic/the-personality-of-god' };
    renderWithProviders(<EpisodeCard episode={jesusEpisode} />);
    expect(screen.getByText(/Read/)).toBeInTheDocument();
  });

  test('should show Download button for series with PDFs', () => {
    renderWithProviders(<EpisodeCard episode={mockEpisode} />);
    const downloadButton = screen.getByText(/Download/);
    expect(downloadButton.closest('a')).toHaveAttribute('href', expect.stringContaining('.pdf'));
  });

  test('should not show Download button for Jesus series', () => {
    const jesusEpisode = { ...mockEpisode, series: 'jesus-1' as const };
    renderWithProviders(<EpisodeCard episode={jesusEpisode} />);
    expect(screen.queryByText(/Download/)).not.toBeInTheDocument();
  });
});
```

### Step 4.3: End-to-End Tests with Playwright
**Duration:** 2 hours

```javascript
// tests/e2e/episodePages.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Episode Pages End-to-End', () => {
  
  test('Foreword pages load correctly in both languages', async ({ page }) => {
    // Test English foreword
    await page.goto('/series/urantia-papers/0');
    await expect(page.locator('h1')).toContainText('Foreword');
    await expect(page.locator('[data-testid="audio-player"]')).toBeVisible();
    
    // Test Spanish foreword
    await page.goto('/es/series/urantia-papers/0');
    await expect(page.locator('h1')).toContainText('Prólogo');
    await expect(page.locator('[data-testid="audio-player"]')).toBeVisible();
  });

  test('Cosmic series pages work with correct PDF downloads', async ({ page }) => {
    // Test English cosmic episode
    await page.goto('/series/cosmic-1/1');
    await expect(page.locator('h1')).toContainText('The Universal Father');
    
    const pdfButton = page.locator('text=Read PDF');
    await expect(pdfButton).toBeVisible();
    const pdfHref = await pdfButton.getAttribute('href');
    expect(pdfHref).toContain('paper-1.pdf');
    expect(pdfHref).not.toContain('-es');

    // Test Spanish cosmic episode
    await page.goto('/es/series/cosmic-1/1');
    await expect(page.locator('h1')).toContainText('El Padre Universal');
    
    const spanishPdfButton = page.locator('text=Leer PDF');
    await expect(spanishPdfButton).toBeVisible();
    const spanishPdfHref = await spanishPdfButton.getAttribute('href');
    expect(spanishPdfHref).toContain('paper-1-es.pdf');
  });

  test('Jesus series pages show DiscoverJesus link but no PDF', async ({ page }) => {
    await page.goto('/series/jesus-1/1');
    await expect(page.locator('h1')).toContainText('The Personality of God');
    
    // Should have DiscoverJesus link
    const djLink = page.locator('text=Read on DiscoverJesus.com');
    await expect(djLink).toBeVisible();
    const djHref = await djLink.getAttribute('href');
    expect(djHref).toContain('discoverjesus.com');
    
    // Should NOT have PDF download
    await expect(page.locator('text=Download PDF')).not.toBeVisible();
  });

  test('Language switching updates URLs correctly', async ({ page }) => {
    await page.goto('/series/cosmic-1/1');
    
    // Switch to Spanish
    await page.locator('[data-testid="language-switcher"]').click();
    await page.locator('text=Español').click();
    
    // Check URL changed
    await expect(page).toHaveURL('/es/series/cosmic-1/1');
    
    // Check content changed
    await expect(page.locator('h1')).toContainText('El Padre Universal');
  });

  test('Deprecated history series returns 404', async ({ page }) => {
    const response = await page.goto('/series/history/1');
    expect(response?.status()).toBe(404);
  });

  test('Download button downloads correct file type', async ({ page, context }) => {
    await page.goto('/series/cosmic-1/1');
    
    // Set up download handling
    const downloadPromise = page.waitForEvent('download');
    
    // Click download button
    await page.locator('text=Download Audio').click();
    
    const download = await downloadPromise;
    const filename = download.suggestedFilename();
    expect(filename).toContain('.mp3');
  });
});
```

### Step 4.4: Automated Performance & Accessibility Tests
**Duration:** 30 minutes

```javascript
// tests/performance/lighthouse.spec.ts
import { test, expect } from '@playwright/test';

test('Episode pages meet performance benchmarks', async ({ page }) => {
  const episodes = [
    '/series/urantia-papers/0',
    '/es/series/cosmic-1/1', 
    '/series/jesus-1/1'
  ];

  for (const episodeUrl of episodes) {
    await page.goto(episodeUrl);
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Check that audio player loads within reasonable time
    await expect(page.locator('[data-testid="audio-player"]')).toBeVisible({ timeout: 5000 });
    
    // Check that images load (or have proper alt text)
    const images = page.locator('img');
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy(); // All images should have alt text
    }
  }
});
```

### Step 4.5: Automated Test Suite Execution
**Duration:** 30 minutes

```bash
# package.json - Add test scripts
{
  "scripts": {
    "test:unit": "jest",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:comprehensive": "npm run test:unit && npm run test:e2e",
    "test:urls": "node scripts/test-url-generation.js",
    "test:ci": "npm run test:unit && npm run test:e2e -- --reporter=junit"
  }
}
```

```javascript
// scripts/test-url-generation.js - Comprehensive URL validation
const { getEpisode } = require('../src/utils/episodeUtils');

const testCases = [
  // Format: [seriesId, episodeId, language, expectedPatterns]
  ['urantia-papers', 0, 'en', { title: 'Foreword', audio: 'foreword.mp3', pdf: 'foreword.pdf' }],
  ['urantia-papers', 0, 'es', { title: 'Prólogo', audio: 'foreword-es.mp3', pdf: 'foreword-es.pdf' }],
  ['cosmic-1', 1, 'en', { title: 'The Universal Father', audio: 'paper-1.mp3', pdf: 'paper-1.pdf' }],
  ['cosmic-1', 1, 'es', { title: 'El Padre Universal', audio: 'paper-1-es.mp3', pdf: 'paper-1-es.pdf' }],
  ['jesus-1', 1, 'en', { title: 'The Personality of God', audio: '.mp3', pdf: null }],
  ['jesus-1', 1, 'es', { title: 'La Personalidad de Dios', audio: '-es.mp3', pdf: null }],
];

console.log('🧪 AUTOMATED URL GENERATION TESTING...\n');

let passed = 0;
let failed = 0;

testCases.forEach(([seriesId, episodeId, language, expected]) => {
  const episode = getEpisode(seriesId, episodeId, language);
  
  console.log(`Testing: ${seriesId}/${episodeId} (${language})`);
  
  // Test title
  if (episode?.title === expected.title) {
    console.log(`  ✅ Title: ${episode.title}`);
    passed++;
  } else {
    console.log(`  ❌ Title: Expected "${expected.title}", got "${episode?.title}"`);
    failed++;
  }
  
  // Test audio URL
  if (episode?.audioUrl?.includes(expected.audio)) {
    console.log(`  ✅ Audio: ${episode.audioUrl}`);
    passed++;
  } else {
    console.log(`  ❌ Audio: Expected pattern "${expected.audio}", got "${episode?.audioUrl}"`);
    failed++;
  }
  
  // Test PDF URL
  if (expected.pdf === null) {
    if (!episode?.pdfUrl) {
      console.log(`  ✅ PDF: Correctly undefined`);
      passed++;
    } else {
      console.log(`  ❌ PDF: Expected undefined, got "${episode.pdfUrl}"`);
      failed++;
    }
  } else if (episode?.pdfUrl?.includes(expected.pdf)) {
    console.log(`  ✅ PDF: ${episode.pdfUrl}`);
    passed++;
  } else {
    console.log(`  ❌ PDF: Expected pattern "${expected.pdf}", got "${episode?.pdfUrl}"`);
    failed++;
  }
  
  console.log('');
});

console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
```

### Step 4.6: Minimal Manual Verification
**Duration:** 30 minutes

After automated tests pass, manually verify:

1. **Visual Regression**: Screenshots of key pages look correct
2. **Audio Playback**: Audio actually plays (can't easily automate audio testing)
3. **File Downloads**: Downloads actually initiate (browser behavior)
4. **Cross-browser**: Test in Chrome, Firefox, Safari
5. **Mobile Responsive**: Test on actual mobile device

```bash
# Quick manual verification script
echo "🔍 Manual Verification Checklist:"
echo "1. Open http://localhost:5174/series/cosmic-1/1"
echo "2. Click audio play button - should start playing"
echo "3. Click Download Audio - should download MP3"
echo "4. Switch to Spanish - URLs should update"
echo "5. Test on mobile device"
```

---

## PHASE 5: Final Cleanup & Documentation (30 minutes)

### Step 5.1: Update Documentation
**Duration:** 15 minutes

```markdown
# episodes.json Structure (Post-Streamlining)

## Philosophy
- **Metadata Only**: Contains only essential episode metadata
- **No Hardcoded URLs**: All URLs generated dynamically with language support
- **No English Content**: All user-facing content in i18n translation files
- **Minimal Risk**: Fewer fields = fewer opportunities for bugs

## Structure
```json
{
  "seriesId": {
    "seriesTitle": "Series Title", // Kept for backward compatibility
    "seriesDescription": "Description", // Kept for backward compatibility
    "episodes": [
      {
        "id": 1,
        "summaryKey": "paper_1",
        "paperNumber": 1 // Only for Urantia Papers series
      }
    ]
  }
}
```

## Deleted Fields
- `title` → Moved to `src/locales/{lang}/content/episode-titles.json`
- `audioUrl` → Generated by `getAudioUrl(series, id, language)`
- `pdfUrl` → Generated by `getPdfUrl(series, id, language)`
- `imageUrl` → Generated by pattern `/images/{series}/card-{id}.jpg`

## Deprecated Series Removed
- `history` → Completely removed from codebase
```

### Step 5.2: Commit Strategy
**Duration:** 15 minutes

```bash
# Commit in logical chunks
git add src/data/json/episodes.json
git commit -m "feat: streamline episodes.json - remove hardcoded URLs and English-only content

- Delete audioUrl, pdfUrl, imageUrl, title fields
- Keep only id, summaryKey, paperNumber (for Urantia Papers)
- All URLs now generated dynamically with language support"

git add src/config/audio.ts src/utils/episodeUtils.ts
git commit -m "feat: add language parameter support to URL generation

- Add language parameter to getAudioUrl() and getPdfUrl()
- Fix foreword (episode 0) support in all series
- Update episodeUtils to generate URLs dynamically"

git add src/components/ui/EpisodeCard.tsx
git commit -m "fix: improve EpisodeCard i18n implementation

- Fix hardcoded 'Episode' text to use i18n
- Fix download button to use pdfUrl instead of audioUrl
- Add proper language context for URL generation"

git add src/types/index.ts src/utils/urlUtils.ts src/utils/mediaUtils.ts src/pages/EpisodePage.tsx
git commit -m "feat: remove deprecated history series completely

- Remove history from TypeScript types
- Remove history from URL mapping
- Remove history from media utilities
- Remove history from episode page validation"

git add src/locales/
git commit -m "feat: move episode titles to i18n translation files

- Create episode-titles.json for EN and ES
- Remove English-only titles from episodes.json
- Support proper title translation by language"
```

---

## SUCCESS CRITERIA (Comprehensive)

### Functional Requirements
- [ ] **Foreword Support**: Episode 0 works for all platform series in EN/ES
- [ ] **History Series Removed**: No references to history series anywhere
- [ ] **Language URL Generation**: All URLs properly support EN/ES with correct suffixes
- [ ] **No Hardcoded URLs**: Zero hardcoded URLs in episodes.json
- [ ] **Proper i18n**: All user-facing text uses translation system
- [ ] **Streamlined JSON**: episodes.json contains only essential metadata
- [ ] **PDF Downloads Work**: Download button uses pdfUrl, not audioUrl
- [ ] **Spanish PDF Downloads**: URLs include -es suffix for Spanish content
- [ ] **Jesus Series No PDFs**: Jesus series correctly shows no PDF download option
- [ ] **Backward Compatibility**: Existing URLs continue to work
- [ ] **No Broken Links**: All episode pages load without 404s
- [ ] **Language Switching**: URLs update correctly when language changes

### Automated Testing Requirements
- [ ] **Unit Tests Pass**: All URL generation functions tested with Jest
- [ ] **Integration Tests Pass**: EpisodeCard component tests with React Testing Library
- [ ] **E2E Tests Pass**: End-to-end user flows tested with Playwright
- [ ] **Performance Tests Pass**: Page load times under acceptable thresholds
- [ ] **Accessibility Tests Pass**: All pages meet WCAG guidelines
- [ ] **Cross-browser Tests Pass**: Works in Chrome, Firefox, Safari
- [ ] **Mobile Tests Pass**: Responsive design works on mobile devices
- [ ] **URL Validation Script Pass**: Comprehensive URL generation validation
- [ ] **CI/CD Integration**: Tests run automatically on commits
- [ ] **Test Coverage >90%**: High test coverage for critical functions
- [ ] **Visual Regression Tests**: Screenshots match expected appearance

---

## TIMELINE SUMMARY

- **Day 1**: Comprehensive cleanup (remove history, streamline episodes.json)
- **Day 2**: Fix URL generation with language support and foreword
- **Day 3**: Fix i18n implementation and move titles to translation files
- **Day 4**: Automated testing suite implementation and validation
- **Day 5**: Final cleanup, documentation, and deployment

**Total: 4-5 days** (realistic timeline for comprehensive overhaul)

### Testing Approach Benefits
- **Faster Feedback**: Automated tests run in minutes vs hours of manual testing
- **Regression Prevention**: Tests catch regressions automatically on future changes
- **Comprehensive Coverage**: Can test many more scenarios than manual testing
- **CI/CD Ready**: Tests can run automatically on every commit
- **Maintenance Friendly**: Tests serve as living documentation of expected behavior

This aggressive streamlining approach minimizes future bugs by reducing the surface area for errors while fixing all current issues comprehensively. 