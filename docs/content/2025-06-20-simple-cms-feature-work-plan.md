# Simple CMS Feature Work Plan - JSON Refactor & i18n Deploy

**Project:** UrantiaBookPod JSON Content Refactor  
**Date:** 2025-06-20  
**Approach:** Pure JSON + Zod Validation + Proper Structure  
**Estimated Timeline:** 1 week  

---

## Overview

This plan implements the **simplest CMS approach** from our analysis: keeping JSON files but refactoring them into a proper structure with validation. This eliminates the current bugs around hardcoded URLs, fixes the language parameter issues, and creates a solid foundation for deploying the first stable EN/ES bilingual version.

**Key Goals:**
- ✅ Eliminate hardcoded URLs once and for all
- ✅ Fix language parameter propagation issues  
- ✅ Create clean, validated content structure
- ✅ Deploy stable i18n EN/ES version
- ✅ Zero new dependencies or complexity

---

## Phase 1: Content Schema Design & Validation

### Step 1.1: Install Validation Dependencies
**Duration:** 15 minutes

```bash
# Install only Zod for schema validation
npm install zod
```

### Step 1.2: Define Content Schemas
**Duration:** 2 hours

Create `src/schemas/content.ts`:

```typescript
import { z } from 'zod';

// Series Schema - NO hardcoded URLs, only metadata
export const SeriesSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(['jesus-focused', 'parts-i-iii', 'platform', 'history']),
  totalEpisodes: z.number().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
  // NO imageUrl - will be derived from ID if needed
});

// Episode Schema - NO hardcoded URLs, only metadata  
export const EpisodeSchema = z.object({
  id: z.number(),
  seriesId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  summaryKey: z.string().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
  // NO audioUrl, pdfUrl, imageUrl - all derived from IDs
});

// Translation Block Schema for consolidated i18n
export const TranslationBlockSchema = z.object({
  key: z.string(),
  en: z.string(),
  es: z.string(),
  context: z.string().optional(),
});

export type Series = z.infer<typeof SeriesSchema>;
export type Episode = z.infer<typeof EpisodeSchema>;
export type TranslationBlock = z.infer<typeof TranslationBlockSchema>;

// Collection schemas for full validation
export const SeriesCollectionSchema = z.record(z.string(), SeriesSchema);
export const EpisodeCollectionSchema = z.record(z.string(), z.array(EpisodeSchema));
export const TranslationCollectionSchema = z.array(TranslationBlockSchema);
```

### Step 1.3: Create New Content Directory Structure
**Duration:** 30 minutes

```bash
mkdir -p content/{en,es}
mkdir -p content/shared
```

Expected structure:
```
content/
├── shared/
│   ├── series.json          # Series metadata (language-neutral)
│   └── episodes.json        # Episode metadata (language-neutral)
├── en/
│   └── translations.json    # English UI translations
└── es/
    └── translations.json    # Spanish UI translations
```

---

## Phase 2: Data Migration & Restructure

### Step 2.1: Create Migration Script
**Duration:** 4 hours

Create `scripts/migrate-to-simple-cms.ts`:

```typescript
import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import { 
  SeriesSchema, 
  EpisodeSchema, 
  SeriesCollectionSchema,
  EpisodeCollectionSchema 
} from '../src/schemas/content';
import episodesData from '../src/data/json/episodes.json';

interface LegacyEpisode {
  id: number;
  title: string;
  audioUrl: string | null;
  pdfUrl: string | null;
  summaryKey?: string;
  imageUrl?: string;
}

interface LegacySeries {
  seriesTitle: string;
  seriesDescription: string;
  episodes: LegacyEpisode[];
}

async function migrateContent() {
  console.log('🔄 Starting content migration...');
  
  // Create directories
  mkdirSync('content/shared', { recursive: true });
  mkdirSync('content/en', { recursive: true });
  mkdirSync('content/es', { recursive: true });

  // 1. Migrate Series Data (language-neutral metadata only)
  const seriesCollection: Record<string, any> = {};
  
  for (const [seriesId, seriesData] of Object.entries(episodesData as Record<string, LegacySeries>)) {
    // Determine category
    let category: string;
    if (seriesId.startsWith('jesus-')) category = 'jesus-focused';
    else if (seriesId.startsWith('cosmic-')) category = 'parts-i-iii';
    else if (seriesId.startsWith('series-platform')) category = 'platform';
    else category = 'history';

    const series = {
      id: seriesId,
      title: seriesData.seriesTitle,
      description: seriesData.seriesDescription,
      category,
      totalEpisodes: seriesData.episodes.length,
      sortOrder: getSortOrder(seriesId),
      isActive: true,
    };

    // Validate series schema
    const validatedSeries = SeriesSchema.parse(series);
    seriesCollection[seriesId] = validatedSeries;
  }

  // Write validated series collection
  const validatedSeriesCollection = SeriesCollectionSchema.parse(seriesCollection);
  writeFileSync(
    'content/shared/series.json',
    JSON.stringify(validatedSeriesCollection, null, 2)
  );

  // 2. Migrate Episodes Data (language-neutral metadata only)
  const episodeCollection: Record<string, any[]> = {};

  for (const [seriesId, seriesData] of Object.entries(episodesData as Record<string, LegacySeries>)) {
    const episodes = seriesData.episodes.map(episode => ({
      id: episode.id,
      seriesId,
      title: episode.title,
      description: undefined, // Will be filled from translations
      summaryKey: episode.summaryKey,
      sortOrder: episode.id,
      isActive: true,
    }));

    // Validate each episode
    const validatedEpisodes = episodes.map(ep => EpisodeSchema.parse(ep));
    episodeCollection[seriesId] = validatedEpisodes;
  }

  // Write validated episodes collection
  const validatedEpisodeCollection = EpisodeCollectionSchema.parse(episodeCollection);
  writeFileSync(
    'content/shared/episodes.json',
    JSON.stringify(validatedEpisodeCollection, null, 2)
  );

  console.log('✅ Content migration completed successfully!');
}

function getSortOrder(seriesId: string): number {
  // Define explicit sort order for series
  const sortMap: Record<string, number> = {
    'cosmic-1': 1,
    'cosmic-2': 2,
    'cosmic-3': 3,
    'jesus-1': 10,
    'jesus-2': 11,
    'jesus-3': 12,
    'series-platform': 20,
    'history-1': 30,
  };
  
  return sortMap[seriesId] || 99;
}

migrateContent().catch(console.error);
```

### Step 2.2: Migrate Translation Files
**Duration:** 3 hours

Create `scripts/migrate-translations.ts`:

```typescript
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

interface TranslationBlock {
  key: string;
  en: string;
  es: string;
  context?: string;
}

function migrateTranslations() {
  console.log('🌐 Starting translation migration...');
  
  const allTranslations: TranslationBlock[] = [];

  // Get all translation namespaces
  const namespaces = ['common', 'home', 'series', 'episode', 'contact', 'disclaimer'];
  
  for (const namespace of namespaces) {
    console.log(`Processing namespace: ${namespace}`);
    
    // Read EN and ES files
    const enPath = `src/locales/en/${namespace}.json`;
    const esPath = `src/locales/es/${namespace}.json`;
    
    let enContent: any = {};
    let esContent: any = {};
    
    try {
      enContent = JSON.parse(readFileSync(enPath, 'utf8'));
    } catch (error) {
      console.warn(`Warning: Could not read ${enPath}`);
    }
    
    try {
      esContent = JSON.parse(readFileSync(esPath, 'utf8'));
    } catch (error) {
      console.warn(`Warning: Could not read ${esPath}`);
    }

    // Process nested translations
    processTranslationObject(enContent, esContent, namespace, '', allTranslations);
  }

  // Write consolidated translations for each language
  const enTranslations: Record<string, string> = {};
  const esTranslations: Record<string, string> = {};

  allTranslations.forEach(block => {
    enTranslations[block.key] = block.en;
    esTranslations[block.key] = block.es;
  });

  writeFileSync(
    'content/en/translations.json',
    JSON.stringify(enTranslations, null, 2)
  );
  
  writeFileSync(
    'content/es/translations.json',
    JSON.stringify(esTranslations, null, 2)
  );

  console.log(`✅ Migration completed! Processed ${allTranslations.length} translation keys.`);
}

function processTranslationObject(
  enObj: any,
  esObj: any,
  namespace: string,
  prefix: string,
  output: TranslationBlock[]
) {
  for (const [key, enValue] of Object.entries(enObj)) {
    const fullKey = prefix ? `${namespace}.${prefix}.${key}` : `${namespace}.${key}`;
    const esValue = getNestedValue(esObj, key);

    if (typeof enValue === 'string') {
      output.push({
        key: fullKey,
        en: enValue,
        es: typeof esValue === 'string' ? esValue : enValue, // Fallback to EN if ES missing
        context: `${namespace} namespace`
      });
    } else if (typeof enValue === 'object' && enValue !== null) {
      const newPrefix = prefix ? `${prefix}.${key}` : key;
      processTranslationObject(
        enValue,
        esValue || {},
        namespace,
        newPrefix,
        output
      );
    }
  }
}

function getNestedValue(obj: any, key: string): any {
  return obj && obj[key];
}

migrateTranslations();
```

### Step 2.3: Execute Migration
**Duration:** 30 minutes

```bash
# Run migration scripts
npx tsx scripts/migrate-to-simple-cms.ts
npx tsx scripts/migrate-translations.ts

# Verify output
ls -la content/
cat content/shared/series.json | head -20
cat content/en/translations.json | head -20
```

---

## Phase 3: Update Application Code

### Step 3.1: Create Simple Content Loader
**Duration:** 2 hours

Create `src/utils/simpleContentLoader.ts`:

```typescript
import seriesData from '../../content/shared/series.json';
import episodesData from '../../content/shared/episodes.json';
import enTranslations from '../../content/en/translations.json';
import esTranslations from '../../content/es/translations.json';
import { getAudioUrl, getPdfUrl } from '../config/audio';
import { getTranscriptUrl } from './mediaUtils';
import type { Series, Episode } from '../schemas/content';

export interface EnrichedEpisode {
  id: number;
  title: string;
  description?: string;
  summary?: string;
  cardSummary?: string;
  series: string;
  audioUrl: string;
  pdfUrl?: string;
  transcriptUrl?: string;
  imageUrl?: string;
  sourceUrl?: string;
}

export interface EnrichedSeries {
  id: string;
  title: string;
  description: string;
  category: string;
  totalEpisodes?: number;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
}

class SimpleContentLoader {
  private translationCache: Map<string, Record<string, string>> = new Map();

  constructor() {
    // Cache translations
    this.translationCache.set('en', enTranslations);
    this.translationCache.set('es', esTranslations);
  }

  // Get all series with proper sorting
  getAllSeries(language: string = 'en'): EnrichedSeries[] {
    return Object.values(seriesData as Record<string, Series>)
      .filter(series => series.isActive)
      .map(series => ({
        ...series,
        imageUrl: this.getSeriesImageUrl(series.id),
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  // Get single series
  getSeries(seriesId: string, language: string = 'en'): EnrichedSeries | undefined {
    const series = (seriesData as Record<string, Series>)[seriesId];
    if (!series) return undefined;

    return {
      ...series,
      imageUrl: this.getSeriesImageUrl(series.id),
    };
  }

  // Get episodes for a series with proper URL generation
  getEpisodesForSeries(seriesId: string, language: string = 'en'): EnrichedEpisode[] {
    const episodes = (episodesData as Record<string, Episode[]>)[seriesId] || [];
    
    return episodes
      .filter(episode => episode.isActive)
      .map(episode => this.enrichEpisode(episode, language))
      .sort((a, b) => a.id - b.id);
  }

  // Get single episode
  getEpisode(seriesId: string, episodeId: number, language: string = 'en'): EnrichedEpisode | undefined {
    const episodes = this.getEpisodesForSeries(seriesId, language);
    return episodes.find(ep => ep.id === episodeId);
  }

  // Get translation
  getTranslation(key: string, language: string = 'en'): string {
    const translations = this.translationCache.get(language) || {};
    return translations[key] || key;
  }

  // Private helper methods
  private enrichEpisode(episode: Episode, language: string): EnrichedEpisode {
    return {
      id: episode.id,
      title: episode.title,
      description: episode.description,
      summary: episode.description,
      cardSummary: episode.description,
      series: episode.seriesId,
      audioUrl: getAudioUrl(episode.seriesId, episode.id, language),
      pdfUrl: getPdfUrl(episode.seriesId, episode.id, language),
      transcriptUrl: getTranscriptUrl(episode.seriesId, episode.id, language) || undefined,
      imageUrl: this.getEpisodeImageUrl(episode.seriesId, episode.id),
      sourceUrl: episode.summaryKey ? `https://discoverjesus.com/${episode.summaryKey}` : undefined,
    };
  }

  private getSeriesImageUrl(seriesId: string): string | undefined {
    // Define series image mapping if needed
    const imageMap: Record<string, string> = {
      'cosmic-1': '/images/cosmic-series.jpg',
      'jesus-1': '/images/jesus-series.jpg',
      // Add more as needed
    };
    
    return imageMap[seriesId];
  }

  private getEpisodeImageUrl(seriesId: string, episodeId: number): string | undefined {
    // Generate episode image URLs if needed
    return undefined; // For now, no episode-specific images
  }
}

export const simpleContentLoader = new SimpleContentLoader();
```

### Step 3.2: Update Episode Utils (Major Refactor)
**Duration:** 1.5 hours

Refactor `src/utils/episodeUtils.ts`:

```typescript
import { simpleContentLoader, type EnrichedEpisode } from './simpleContentLoader';

// Export the interface for compatibility
export type Episode = EnrichedEpisode;

// Main functions used throughout the app
export function getEpisodesForSeries(seriesId: string, language: string = 'en'): Episode[] {
  return simpleContentLoader.getEpisodesForSeries(seriesId, language);
}

export function getEpisode(seriesId: string, episodeId: number, language: string = 'en'): Episode | undefined {
  return simpleContentLoader.getEpisode(seriesId, episodeId, language);
}

export function getAllEpisodes(language: string = 'en'): Episode[] {
  const allSeries = simpleContentLoader.getAllSeries(language);
  const allEpisodes: Episode[] = [];
  
  for (const series of allSeries) {
    const episodes = simpleContentLoader.getEpisodesForSeries(series.id, language);
    allEpisodes.push(...episodes);
  }
  
  return allEpisodes;
}

// Helper function for episode counts
export function getEpisodeCount(seriesId: string): number {
  return simpleContentLoader.getEpisodesForSeries(seriesId).length;
}

// Series-related functions (moved here for consolidation)
export function getAllSeries(language: string = 'en') {
  return simpleContentLoader.getAllSeries(language);
}

export function getSeries(seriesId: string, language: string = 'en') {
  return simpleContentLoader.getSeries(seriesId, language);
}
```

### Step 3.3: Update Series Utils
**Duration:** 30 minutes

Simplify `src/utils/seriesUtils.ts`:

```typescript
// Re-export from episodeUtils for consistency
export { 
  getAllSeries, 
  getSeries,
  type EnrichedSeries as SeriesInfo 
} from './episodeUtils';
```

### Step 3.4: Update Translation Loading
**Duration:** 1 hour

Update `src/utils/translationLoaders.ts`:

```typescript
import { simpleContentLoader } from './simpleContentLoader';

// Simple translation function that works with new structure
export function getTranslation(key: string, language: string = 'en'): string {
  return simpleContentLoader.getTranslation(key, language);
}

// Helper for nested keys (backward compatibility)
export function getNestedTranslation(namespace: string, key: string, language: string = 'en'): string {
  const fullKey = `${namespace}.${key}`;
  return getTranslation(fullKey, language);
}

// Bulk translation loader for components
export function loadTranslationNamespace(namespace: string, language: string = 'en'): Record<string, string> {
  // This is less efficient but maintains compatibility
  // In practice, we should refactor components to use direct getTranslation calls
  console.warn('loadTranslationNamespace is deprecated, use getTranslation directly');
  return {};
}
```

---

## Phase 4: Fix Language Parameter Issues

### Step 4.1: Update Audio Config
**Duration:** 1 hour

Fix `src/config/audio.ts` to properly handle language parameters:

```typescript
import { R2_BASE_URL } from './assets';

// Fixed functions that properly propagate language parameter
export function getAudioUrl(seriesId: string, episodeId: number, language: string = 'en'): string {
  // For Spanish, use language suffix for Urantia Papers
  if (seriesId.startsWith('cosmic-') && language === 'es') {
    return `${R2_BASE_URL}/paper-${episodeId}-es.mp3`;
  }
  
  // Default pattern for other series or English
  if (seriesId.startsWith('cosmic-')) {
    return `${R2_BASE_URL}/paper-${episodeId}.mp3`;
  }
  
  if (seriesId.startsWith('jesus-')) {
    return `${R2_BASE_URL}/${seriesId}/${episodeId}.mp3`;
  }
  
  // Platform and history series
  return `${R2_BASE_URL}/${seriesId}/${episodeId}.mp3`;
}

export function getPdfUrl(seriesId: string, episodeId: number, language: string = 'en'): string | undefined {
  // Only Urantia Papers (cosmic series) have PDFs
  if (!seriesId.startsWith('cosmic-')) {
    return undefined;
  }
  
  // For Spanish, use language suffix
  if (language === 'es') {
    return `${R2_BASE_URL}/paper-${episodeId}-es.pdf`;
  }
  
  // Default English
  return `${R2_BASE_URL}/paper-${episodeId}.pdf`;
}

// Helper to check if a series has PDFs
export function seriesHasPdfs(seriesId: string): boolean {
  return seriesId.startsWith('cosmic-');
}
```

### Step 4.2: Update Media Utils
**Duration:** 30 minutes

Fix `src/utils/mediaUtils.ts`:

```typescript
import { R2_BASE_URL } from '../config/assets';

export function getTranscriptUrl(seriesId: string, episodeId: number, language: string = 'en'): string | null {
  // Only certain series have transcripts
  if (seriesId.startsWith('cosmic-') && language === 'es') {
    return `${R2_BASE_URL}/paper-${episodeId}-es.txt`;
  }
  
  if (seriesId.startsWith('cosmic-')) {
    return `${R2_BASE_URL}/paper-${episodeId}.txt`;
  }
  
  // For now, other series don't have transcripts
  return null;
}

export function getImageUrl(seriesId: string, episodeId?: number): string | undefined {
  // Series-level images
  if (!episodeId) {
    const seriesImages: Record<string, string> = {
      'cosmic-1': '/images/cosmic-series.jpg',
      'jesus-1': '/images/jesus-series.jpg',
    };
    
    return seriesImages[seriesId];
  }
  
  // Episode-level images (if any)
  return undefined;
}
```

---

## Phase 5: Testing & Validation

### Step 5.1: Create Validation Script
**Duration:** 1.5 hours

Create `scripts/validate-simple-cms.ts`:

```typescript
import { readFileSync } from 'fs';
import { 
  SeriesCollectionSchema, 
  EpisodeCollectionSchema 
} from '../src/schemas/content';

function validateContent() {
  console.log('🔍 Starting content validation...');
  let errors = 0;

  // Validate series
  try {
    const seriesContent = JSON.parse(readFileSync('content/shared/series.json', 'utf8'));
    SeriesCollectionSchema.parse(seriesContent);
    console.log('✅ Series validation passed');
  } catch (error) {
    console.error('❌ Series validation failed:', error);
    errors++;
  }

  // Validate episodes
  try {
    const episodesContent = JSON.parse(readFileSync('content/shared/episodes.json', 'utf8'));
    EpisodeCollectionSchema.parse(episodesContent);
    console.log('✅ Episodes validation passed');
  } catch (error) {
    console.error('❌ Episodes validation failed:', error);
    errors++;
  }

  // Validate translations exist
  try {
    const enTranslations = JSON.parse(readFileSync('content/en/translations.json', 'utf8'));
    const esTranslations = JSON.parse(readFileSync('content/es/translations.json', 'utf8'));
    
    console.log(`✅ EN translations: ${Object.keys(enTranslations).length} keys`);
    console.log(`✅ ES translations: ${Object.keys(esTranslations).length} keys`);
  } catch (error) {
    console.error('❌ Translation validation failed:', error);
    errors++;
  }

  // Test URL generation
  console.log('\n🔗 Testing URL generation...');
  testUrlGeneration();

  if (errors === 0) {
    console.log('\n🎉 All validations passed!');
  } else {
    console.error(`\n💥 ${errors} validation errors found!`);
    process.exit(1);
  }
}

function testUrlGeneration() {
  // Test the content loader
  const { simpleContentLoader } = require('../src/utils/simpleContentLoader');
  
  // Test series loading
  const series = simpleContentLoader.getAllSeries('en');
  console.log(`📚 Loaded ${series.length} series`);
  
  // Test episode loading and URL generation
  for (const seriesItem of series.slice(0, 2)) { // Test first 2 series
    const episodes = simpleContentLoader.getEpisodesForSeries(seriesItem.id, 'en');
    console.log(`📖 Series ${seriesItem.id}: ${episodes.length} episodes`);
    
    if (episodes.length > 0) {
      const firstEpisode = episodes[0];
      console.log(`🎵 Audio URL: ${firstEpisode.audioUrl}`);
      if (firstEpisode.pdfUrl) {
        console.log(`📄 PDF URL: ${firstEpisode.pdfUrl}`);
      }
    }
  }
  
  // Test translations
  const testKey = 'common.navigation.home';
  const enTranslation = simpleContentLoader.getTranslation(testKey, 'en');
  const esTranslation = simpleContentLoader.getTranslation(testKey, 'es');
  console.log(`🌐 Translation test - EN: "${enTranslation}", ES: "${esTranslation}"`);
}

validateContent();
```

### Step 5.2: Add Package.json Scripts
**Duration:** 15 minutes

Update `package.json`:

```json
{
  "scripts": {
    "migrate:simple-cms": "npx tsx scripts/migrate-to-simple-cms.ts && npx tsx scripts/migrate-translations.ts",
    "validate:content": "npx tsx scripts/validate-simple-cms.ts",
    "build:content": "npm run migrate:simple-cms && npm run validate:content",
    "dev": "npm run validate:content && vite",
    "build": "npm run validate:content && vite build"
  }
}
```

### Step 5.3: Local Testing
**Duration:** 2 hours

```bash
# Run full migration and validation
npm run build:content

# Test the application
npm run dev

# Test both languages
# Visit http://localhost:5173 (English)
# Visit http://localhost:5173/es (Spanish)
# Test episode pages and PDF downloads
```

---

## Phase 6: Deployment Preparation

### Step 6.1: Update CI/CD Pipeline
**Duration:** 1 hour

Create `.github/workflows/validate-content.yml`:

```yaml
name: Validate Content Structure

on:
  pull_request:
    paths:
      - 'content/**'
      - 'src/schemas/**'
  push:
    branches: [main, i18n-new]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run validate:content
      - name: Test build
        run: npm run build
```

### Step 6.2: Update Documentation
**Duration:** 1 hour

Update `README.md`:

```markdown
## Content Management

This project uses a simple JSON-based content management system with validation.

### Content Structure

- `content/shared/series.json` - Series metadata (language-neutral)
- `content/shared/episodes.json` - Episode metadata (language-neutral)  
- `content/en/translations.json` - English UI translations
- `content/es/translations.json` - Spanish UI translations

### Content Editing

1. Edit JSON files in the `content/` directory
2. Run `npm run validate:content` to check for errors
3. All URLs are generated dynamically - never hardcode media URLs
4. Test both languages before committing

### Development

```bash
# Validate content structure
npm run validate:content

# Run development server with validation
npm run dev

# Build for production
npm run build
```
```

### Step 6.3: Clean Up Legacy Files
**Duration:** 30 minutes

```bash
# Backup old structure (just in case)
mkdir -p backup/old-structure
cp -r src/data backup/old-structure/

# Remove old JSON files after successful migration
# (Only do this after thorough testing)
# rm src/data/json/episodes.json
# rm -rf src/locales (after translations are fully migrated)
```

---

## Phase 7: Go Live - i18n EN/ES Deploy

### Step 7.1: Final Testing Checklist
**Duration:** 3 hours

```bash
# Test content loading
npm run validate:content

# Test all series pages in both languages
# EN: /series/cosmic-1, /series/jesus-1, etc.
# ES: /es/series/cosmic-1, /es/series/jesus-1, etc.

# Test episode pages in both languages  
# EN: /episode/cosmic-1/1, /episode/jesus-1/1
# ES: /es/episode/cosmic-1/1, /es/episode/jesus-1/1

# Test PDF downloads specifically for Spanish
# Should work: /es/episode/cosmic-1/1 (Spanish PDF)
# Should work: /episode/cosmic-1/1 (English PDF)

# Test audio player functionality
# Test language switching
# Test responsive design
```

### Step 7.2: Deploy to Production
**Duration:** 1 hour

```bash
# Ensure we're on i18n-new branch
git status

# Final validation
npm run build:content
npm run build

# Deploy via Vercel
vercel --prod

# Test production URLs:
# https://ubpod.com
# https://ubpod.com/es
# https://ubpod.com/es/episode/cosmic-1/1 (test Spanish PDF)
```

### Step 7.3: Post-Deploy Monitoring
**Duration:** 1 hour

Monitor for:
- ✅ PDF download links working for both languages
- ✅ Audio playback working
- ✅ Language switching functional
- ✅ No hardcoded URLs in content
- ✅ All existing URLs still work
- ✅ Analytics tracking correctly

---

## Success Criteria

- [ ] **Zero hardcoded URLs** in content files
- [ ] **Language parameter propagation** working correctly  
- [ ] **Spanish PDF downloads** working: `/es/episode/cosmic-1/1`
- [ ] **Content validation** passes on every commit
- [ ] **Both languages** render correctly with proper content
- [ ] **All existing URLs** continue to work
- [ ] **Build process** is reliable and fast
- [ ] **Development workflow** is improved

---

## Benefits Achieved

1. **🐛 Bug Elimination**: No more hardcoded URL issues
2. **🌐 i18n Foundation**: Solid bilingual EN/ES support
3. **⚡ Performance**: Faster builds, no runtime dependencies
4. **🔒 Validation**: Content errors caught early
5. **🧹 Clean Structure**: Logical separation of concerns
6. **📈 Scalability**: Easy to add more languages later
7. **🔧 Maintainability**: Single source of truth for content

---

## Next Steps (Future)

After this foundation is stable:
1. Consider the full Decap CMS implementation for better editing UX
2. Add rich text support for episode descriptions
3. Implement content preview system
4. Add automated translation workflows
5. Create content contributor documentation

This simple approach gives us a **rock-solid foundation** while being **implementable in 1 week** and **deployable immediately**. 