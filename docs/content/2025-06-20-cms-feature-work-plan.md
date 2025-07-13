# CMS Feature Implementation Work Plan

**Project:** UrantiaBookPod CMS Integration  
**Date:** 2025-06-20  
**Approach:** Git-based Headless CMS (Decap CMS)  
**Estimated Timeline:** 2-3 weeks  

---

## Overview

This plan implements a Git-based headless CMS using Decap CMS to replace the current fragmented JSON content management system. The solution maintains the static-first architecture while providing a user-friendly editorial interface.

---

## Phase 1: Foundation & Schema Design

### Step 1.1: Install Dependencies
**Duration:** 30 minutes

```bash
# Install Decap CMS and validation dependencies
npm install decap-cms-app zod @types/js-yaml js-yaml
npm install -D @types/uuid uuid
```

### Step 1.2: Define Content Schemas
**Duration:** 2 hours

Create `src/schemas/content.ts`:

```typescript
import { z } from 'zod';

// Base schemas
export const SeriesSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(['jesus-focused', 'parts-i-iii', 'platform', 'history']),
  totalEpisodes: z.number().optional(),
  imageUrl: z.string().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const EpisodeSchema = z.object({
  id: z.number(),
  seriesId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  summaryKey: z.string().optional(),
  imageUrl: z.string().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
  // Note: audioUrl and pdfUrl will be generated, not stored
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const TranslationSchema = z.object({
  key: z.string(),
  namespace: z.string(),
  language: z.enum(['en', 'es']),
  value: z.string(),
  context: z.string().optional(),
  updatedAt: z.string().datetime()
});

export type Series = z.infer<typeof SeriesSchema>;
export type Episode = z.infer<typeof EpisodeSchema>;
export type Translation = z.infer<typeof TranslationSchema>;
```

### Step 1.3: Create Content Directory Structure
**Duration:** 30 minutes

```bash
mkdir -p content/{series,episodes,translations}/{en,es}
mkdir -p public/admin
```

Expected structure:
```
content/
├── series/
│   ├── en/
│   └── es/
├── episodes/
│   ├── en/
│   └── es/
└── translations/
    ├── en/
    └── es/
```

---

## Phase 2: Decap CMS Setup

### Step 2.1: Create Admin Interface
**Duration:** 1 hour

Create `public/admin/index.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>UrantiaBookPod Content Management</title>
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
</head>
<body>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
  <script>
    // Custom preview templates if needed
    CMS.registerPreviewStyle("/admin/preview.css");
  </script>
</body>
</html>
```

### Step 2.2: Configure Decap CMS
**Duration:** 3 hours

Create `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: The-Center-for-Unity/ubpod-new
  branch: cms-integration
  base_url: https://api.netlify.com
  auth_endpoint: auth

local_backend: true

media_folder: "public/images"
public_folder: "/images"

i18n:
  structure: multiple_folders
  locales: [en, es]
  default_locale: en

collections:
  - name: "series"
    label: "Podcast Series"
    folder: "content/series"
    create: true
    slug: "{{slug}}"
    i18n: true
    fields:
      - { label: "ID", name: "id", widget: "string", i18n: duplicate }
      - { label: "Title", name: "title", widget: "string", i18n: true }
      - { label: "Description", name: "description", widget: "text", i18n: true }
      - { label: "Category", name: "category", widget: "select", 
          options: ["jesus-focused", "parts-i-iii", "platform", "history"], i18n: duplicate }
      - { label: "Total Episodes", name: "totalEpisodes", widget: "number", required: false, i18n: duplicate }
      - { label: "Image URL", name: "imageUrl", widget: "string", required: false, i18n: duplicate }
      - { label: "Sort Order", name: "sortOrder", widget: "number", default: 0, i18n: duplicate }
      - { label: "Active", name: "isActive", widget: "boolean", default: true, i18n: duplicate }
      - { label: "Created At", name: "createdAt", widget: "datetime", i18n: duplicate }
      - { label: "Updated At", name: "updatedAt", widget: "datetime", i18n: duplicate }

  - name: "episodes"
    label: "Episodes"
    folder: "content/episodes"
    create: true
    slug: "{{seriesId}}-{{id}}"
    i18n: true
    fields:
      - { label: "Episode ID", name: "id", widget: "number", i18n: duplicate }
      - { label: "Series ID", name: "seriesId", widget: "string", i18n: duplicate }
      - { label: "Title", name: "title", widget: "string", i18n: true }
      - { label: "Description", name: "description", widget: "text", required: false, i18n: true }
      - { label: "Summary Key", name: "summaryKey", widget: "string", required: false, i18n: duplicate }
      - { label: "Image URL", name: "imageUrl", widget: "string", required: false, i18n: duplicate }
      - { label: "Sort Order", name: "sortOrder", widget: "number", default: 0, i18n: duplicate }
      - { label: "Active", name: "isActive", widget: "boolean", default: true, i18n: duplicate }
      - { label: "Created At", name: "createdAt", widget: "datetime", i18n: duplicate }
      - { label: "Updated At", name: "updatedAt", widget: "datetime", i18n: duplicate }

  - name: "translations"
    label: "UI Translations"
    folder: "content/translations"
    create: true
    slug: "{{namespace}}-{{key}}"
    i18n: true
    fields:
      - { label: "Key", name: "key", widget: "string", i18n: duplicate }
      - { label: "Namespace", name: "namespace", widget: "string", i18n: duplicate }
      - { label: "Language", name: "language", widget: "select", options: ["en", "es"], i18n: duplicate }
      - { label: "Value", name: "value", widget: "text", i18n: true }
      - { label: "Context", name: "context", widget: "string", required: false, i18n: true }
      - { label: "Updated At", name: "updatedAt", widget: "datetime", i18n: duplicate }
```

### Step 2.3: Setup GitHub OAuth
**Duration:** 45 minutes

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App:
   - Application name: `UrantiaBookPod CMS`
   - Homepage URL: `https://ubpod-new-git-cms-integration-cfu.vercel.app`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
3. Note Client ID and Client Secret
4. Add to Vercel environment variables:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`

---

## Phase 3: Data Migration

### Step 3.1: Create Migration Script
**Duration:** 4 hours

Create `scripts/migrate-to-cms.ts`:

```typescript
import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';
import { SeriesSchema, EpisodeSchema } from '../src/schemas/content';
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

async function migrateSeries() {
  const now = new Date().toISOString();
  
  for (const [seriesId, seriesData] of Object.entries(episodesData as Record<string, LegacySeries>)) {
    // Determine category
    let category: string;
    if (seriesId.startsWith('jesus-')) category = 'jesus-focused';
    else if (seriesId.startsWith('cosmic-')) category = 'parts-i-iii';
    else if (seriesId.startsWith('series-platform')) category = 'platform';
    else category = 'history';

    // Create series object
    const series = {
      id: seriesId,
      title: seriesData.seriesTitle,
      description: seriesData.seriesDescription,
      category,
      totalEpisodes: seriesData.episodes.length,
      sortOrder: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now
    };

    // Validate and write series
    const validatedSeries = SeriesSchema.parse(series);
    
    // Write EN version
    mkdirSync(`content/series/en`, { recursive: true });
    writeFileSync(
      `content/series/en/${seriesId}.json`,
      JSON.stringify(validatedSeries, null, 2)
    );

    // Copy to ES (for now, same content)
    mkdirSync(`content/series/es`, { recursive: true });
    writeFileSync(
      `content/series/es/${seriesId}.json`,
      JSON.stringify(validatedSeries, null, 2)
    );

    // Migrate episodes
    for (const episode of seriesData.episodes) {
      const episodeObj = {
        id: episode.id,
        seriesId,
        title: episode.title,
        description: undefined,
        summaryKey: episode.summaryKey,
        imageUrl: episode.imageUrl,
        sortOrder: episode.id,
        isActive: true,
        createdAt: now,
        updatedAt: now
      };

      const validatedEpisode = EpisodeSchema.parse(episodeObj);

      // Write EN version
      mkdirSync(`content/episodes/en`, { recursive: true });
      writeFileSync(
        `content/episodes/en/${seriesId}-${episode.id}.json`,
        JSON.stringify(validatedEpisode, null, 2)
      );

      // Copy to ES
      mkdirSync(`content/episodes/es`, { recursive: true });
      writeFileSync(
        `content/episodes/es/${seriesId}-${episode.id}.json`,
        JSON.stringify(validatedEpisode, null, 2)
      );
    }
  }
}

migrateSeries().catch(console.error);
```

### Step 3.2: Execute Migration
**Duration:** 30 minutes

```bash
npm run build
npx tsx scripts/migrate-to-cms.ts
```

### Step 3.3: Migrate Translation Files
**Duration:** 2 hours

Create `scripts/migrate-translations.ts`:

```typescript
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join } from 'path';

function migrateTranslationFiles() {
  const locales = ['en', 'es'];
  
  for (const locale of locales) {
    const localeDir = `src/locales/${locale}`;
    const files = readdirSync(localeDir);
    
    for (const file of files) {
      if (file.endsWith('.json') && file !== 'content') {
        const namespace = file.replace('.json', '');
        const content = JSON.parse(readFileSync(join(localeDir, file), 'utf8'));
        
        processTranslationObject(content, namespace, locale, '');
      }
    }
  }
}

function processTranslationObject(obj: any, namespace: string, locale: string, prefix: string) {
  const now = new Date().toISOString();
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'string') {
      const translation = {
        key: fullKey,
        namespace,
        language: locale,
        value,
        updatedAt: now
      };
      
      mkdirSync(`content/translations/${locale}`, { recursive: true });
      writeFileSync(
        `content/translations/${locale}/${namespace}-${fullKey.replace(/\./g, '-')}.json`,
        JSON.stringify(translation, null, 2)
      );
    } else if (typeof value === 'object' && value !== null) {
      processTranslationObject(value, namespace, locale, fullKey);
    }
  }
}

migrateTranslationFiles();
```

---

## Phase 4: Update Application Code

### Step 4.1: Create Content Loader
**Duration:** 3 hours

Create `src/utils/contentLoader.ts`:

```typescript
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { Series, Episode, Translation } from '../schemas/content';

class ContentLoader {
  private seriesCache: Map<string, Map<string, Series>> = new Map();
  private episodesCache: Map<string, Map<string, Episode[]>> = new Map();
  private translationsCache: Map<string, Map<string, string>> = new Map();

  loadSeries(language: string = 'en'): Series[] {
    if (!this.seriesCache.has(language)) {
      const seriesDir = `content/series/${language}`;
      const files = readdirSync(seriesDir);
      const seriesMap = new Map<string, Series>();
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const content = JSON.parse(readFileSync(join(seriesDir, file), 'utf8'));
          seriesMap.set(content.id, content);
        }
      }
      
      this.seriesCache.set(language, seriesMap);
    }
    
    return Array.from(this.seriesCache.get(language)!.values());
  }

  loadEpisodesBySeries(seriesId: string, language: string = 'en'): Episode[] {
    const cacheKey = `${seriesId}-${language}`;
    if (!this.episodesCache.has(cacheKey)) {
      const episodesDir = `content/episodes/${language}`;
      const files = readdirSync(episodesDir);
      const episodes: Episode[] = [];
      
      for (const file of files) {
        if (file.startsWith(`${seriesId}-`) && file.endsWith('.json')) {
          const content = JSON.parse(readFileSync(join(episodesDir, file), 'utf8'));
          episodes.push(content);
        }
      }
      
      episodes.sort((a, b) => a.sortOrder - b.sortOrder);
      this.episodesCache.set(cacheKey, new Map([[seriesId, episodes]]));
    }
    
    return this.episodesCache.get(cacheKey)!.get(seriesId) || [];
  }

  loadTranslations(namespace: string, language: string = 'en'): Record<string, string> {
    const cacheKey = `${namespace}-${language}`;
    if (!this.translationsCache.has(cacheKey)) {
      const translationsDir = `content/translations/${language}`;
      const files = readdirSync(translationsDir);
      const translations: Record<string, string> = {};
      
      for (const file of files) {
        if (file.startsWith(`${namespace}-`) && file.endsWith('.json')) {
          const content: Translation = JSON.parse(readFileSync(join(translationsDir, file), 'utf8'));
          translations[content.key] = content.value;
        }
      }
      
      this.translationsCache.set(cacheKey, new Map([[namespace, translations]]));
    }
    
    return this.translationsCache.get(cacheKey)!.get(namespace) || {};
  }
}

export const contentLoader = new ContentLoader();
```

### Step 4.2: Update Episode Utils
**Duration:** 2 hours

Refactor `src/utils/episodeUtils.ts`:

```typescript
import { contentLoader } from './contentLoader';
import { getAudioUrl, getPdfUrl } from '../config/audio';
import { getTranscriptUrl } from './mediaUtils';
import { Episode as CMSEpisode, Series as CMSSeries } from '../schemas/content';

export interface Episode {
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

export function getEpisodesForSeries(seriesId: string, language: string = 'en'): Episode[] {
  const cmsEpisodes = contentLoader.loadEpisodesBySeries(seriesId, language);
  
  return cmsEpisodes.map(episode => ({
    id: episode.id,
    title: episode.title,
    description: episode.description,
    summary: episode.description,
    cardSummary: episode.description,
    series: episode.seriesId,
    audioUrl: getAudioUrl(episode.seriesId, episode.id, language),
    pdfUrl: getPdfUrl(episode.seriesId, episode.id, language),
    transcriptUrl: getTranscriptUrl(episode.seriesId, episode.id, language) || undefined,
    imageUrl: episode.imageUrl,
    sourceUrl: episode.summaryKey ? `https://discoverjesus.com/${episode.summaryKey}` : undefined
  }));
}

export function getEpisode(seriesId: string, episodeId: number, language: string = 'en'): Episode | undefined {
  const episodes = getEpisodesForSeries(seriesId, language);
  return episodes.find(ep => ep.id === episodeId);
}
```

### Step 4.3: Update Series Utils
**Duration:** 1 hour

Update `src/utils/seriesUtils.ts`:

```typescript
import { contentLoader } from './contentLoader';

export interface SeriesInfo {
  id: string;
  title: string;
  description: string;
  category: string;
  totalEpisodes?: number;
  imageUrl?: string;
  logline?: string;
}

export function getAllSeries(language: string = 'en'): SeriesInfo[] {
  const cmsSeries = contentLoader.loadSeries(language);
  
  return cmsSeries
    .filter(series => series.isActive)
    .map(series => ({
      id: series.id,
      title: series.title,
      description: series.description,
      category: series.category,
      totalEpisodes: series.totalEpisodes,
      imageUrl: series.imageUrl,
      logline: series.description // Use description as logline for now
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}
```

---

## Phase 5: Testing & Validation

### Step 5.1: Create Validation Scripts
**Duration:** 2 hours

Create `scripts/validate-content.ts`:

```typescript
import { readdirSync, readFileSync } from 'fs';
import { SeriesSchema, EpisodeSchema, TranslationSchema } from '../src/schemas/content';

function validateContent() {
  const languages = ['en', 'es'];
  let errors = 0;

  for (const lang of languages) {
    console.log(`Validating ${lang} content...`);
    
    // Validate series
    const seriesFiles = readdirSync(`content/series/${lang}`);
    for (const file of seriesFiles) {
      try {
        const content = JSON.parse(readFileSync(`content/series/${lang}/${file}`, 'utf8'));
        SeriesSchema.parse(content);
        console.log(`✓ Series ${file}`);
      } catch (error) {
        console.error(`✗ Series ${file}:`, error);
        errors++;
      }
    }

    // Validate episodes
    const episodeFiles = readdirSync(`content/episodes/${lang}`);
    for (const file of episodeFiles) {
      try {
        const content = JSON.parse(readFileSync(`content/episodes/${lang}/${file}`, 'utf8'));
        EpisodeSchema.parse(content);
        console.log(`✓ Episode ${file}`);
      } catch (error) {
        console.error(`✗ Episode ${file}:`, error);
        errors++;
      }
    }

    // Validate translations
    const translationFiles = readdirSync(`content/translations/${lang}`);
    for (const file of translationFiles) {
      try {
        const content = JSON.parse(readFileSync(`content/translations/${lang}/${file}`, 'utf8'));
        TranslationSchema.parse(content);
        console.log(`✓ Translation ${file}`);
      } catch (error) {
        console.error(`✗ Translation ${file}:`, error);
        errors++;
      }
    }
  }

  if (errors > 0) {
    console.error(`\n${errors} validation errors found!`);
    process.exit(1);
  } else {
    console.log('\n✓ All content validated successfully!');
  }
}

validateContent();
```

### Step 5.2: Setup CI Validation
**Duration:** 1 hour

Add to `.github/workflows/validate-content.yml`:

```yaml
name: Validate Content

on:
  pull_request:
    paths:
      - 'content/**'
  push:
    branches: [main, cms-integration]

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
      - run: npx tsx scripts/validate-content.ts
```

### Step 5.3: Local Testing
**Duration:** 3 hours

1. Start local development:
   ```bash
   npm run dev
   npx decap-server
   ```
2. Visit `http://localhost:5173/admin`
3. Test creating/editing series and episodes
4. Verify content appears correctly on frontend
5. Test language switching

---

## Phase 6: Documentation & Deployment

### Step 6.1: Update README
**Duration:** 1 hour

Add CMS section to README.md:

```markdown
## Content Management

This project uses Decap CMS for content management. 

### For Editors

1. Visit `/admin` on the live site
2. Login with GitHub account
3. Edit series, episodes, or translations
4. Changes are saved as Git commits

### For Developers

Content is stored in `content/` directory:
- `content/series/` - Podcast series metadata
- `content/episodes/` - Individual episode data  
- `content/translations/` - UI text translations

Run validation: `npx tsx scripts/validate-content.ts`
```

### Step 6.2: Create User Guide
**Duration:** 2 hours

Create `docs/content/cms-user-guide.md` with screenshots and step-by-step instructions for content editors.

### Step 6.3: Deploy to Staging
**Duration:** 1 hour

1. Create `cms-integration` branch
2. Push all changes
3. Deploy to Vercel preview environment
4. Test admin interface with GitHub OAuth
5. Verify content loading correctly

---

## Phase 7: Go-Live

### Step 7.1: Final Testing
**Duration:** 4 hours

1. Complete end-to-end testing of CMS workflow
2. Test content editing in production environment
3. Verify all existing URLs still work
4. Performance testing with new content loader

### Step 7.2: Migration to Main
**Duration:** 2 hours

1. Create PR from `cms-integration` to `main`
2. Review and merge
3. Deploy to production
4. Monitor for any issues

### Step 7.3: Cleanup
**Duration:** 1 hour

1. Remove old `src/data/json/episodes.json`
2. Update import statements
3. Remove unused utility functions
4. Clean up temporary migration scripts

---

## Success Criteria

- [ ] Content editors can manage series and episodes through web UI
- [ ] All existing URLs continue to work
- [ ] Content is properly validated on commit
- [ ] Multi-language support works correctly
- [ ] Site performance is maintained or improved
- [ ] PDF and audio URLs are generated correctly
- [ ] No hardcoded media URLs in content files

---

## Risk Mitigation

1. **Data Loss Prevention**: Create full backup of existing JSON files before migration
2. **Rollback Plan**: Maintain old episodeUtils.ts as fallback during transition
3. **Gradual Migration**: Start with one series type, expand incrementally
4. **Testing**: Comprehensive testing on staging environment before production
5. **Documentation**: Clear user guides for content editors

---

## Post-Implementation

1. **Monitor Performance**: Track build times and page load speeds
2. **User Training**: Schedule training sessions for content editors
3. **Feedback Collection**: Gather editor feedback for UI improvements
4. **Maintenance Plan**: Regular content validation and backup procedures 