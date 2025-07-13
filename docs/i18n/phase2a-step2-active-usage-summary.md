# Phase 2A Step 2: Active Usage Analysis (CORRECTED)

**Generated**: 6/12/2025, 9:36:53 AM

## Executive Summary

This analysis identifies which files are **actively used** vs. **legacy content** that can be moved to backup, ensuring we only extract and localize content that impacts users.

**🚨 CORRECTION**: i18n files (public/locales/) are ACTIVE - they're loaded through i18next configuration, not direct imports.

### Key Metrics
- **Total Files Analyzed**: 112
- **Active Files**: 79 (71%)
- **Legacy Files**: 33 (29%)
- **i18n Files (Active)**: 32 translation files

### Content File Classification
- **Active Content Files**: 19 (require extraction)
- **Legacy Content Files**: 7 (move to backup)
- **Active i18n Files**: 32 (already implemented)

## Active Content Files (Extraction Required)

1. `src/components/ui/SeriesCard.tsx` (2.7KB)
2. `src/components/ui/SeriesCardGrid.tsx` (4.1KB)
3. `src/components/ui/SeriesNavigation.tsx` (8.4KB)
4. `src/data/discoverJesusSummaries.ts` (228.0KB)
5. `src/data/episodes.ts` (40.9KB)
6. `src/data/json/cosmic-series-mappings.json` (3.5KB)
7. `src/data/json/episodes.json` (93.5KB)
8. `src/data/json/jesus-series-mappings.json` (5.3KB)
9. `src/data/json/summaries.json` (253.0KB)
10. `src/data/json/urantia_summaries.json` (150.9KB)
11. `src/data/json/urantia_summaries_es.json` (170.5KB)
12. `src/data/series-availability.json` (0.6KB)
13. `src/pages/SeriesPage.tsx` (25.5KB)
14. `src/utils/episodeUtils.ts` (35.2KB)
15. `src/utils/mediaUtils.ts` (14.2KB)
16. `src/utils/seriesAvailabilityUtils.ts` (1.6KB)
17. `src/utils/seriesCollectionsUtils.ts` (2.6KB)
18. `src/utils/seriesUtils.ts` (16.9KB)
19. `src/utils/urlUtils.ts` (2.8KB)

## Legacy Content Files (Move to Backup)

1. `src/__tests__/components/SeriesCard.test.tsx` (2.7KB) - Test file
2. `src/components/series/SeriesContent.tsx` (5.7KB) - No active imports found
3. `src/data/content.ts` (1.7KB) - No active imports found
4. `src/data/json/summaries-check.ts` (1.3KB) - No active imports found
5. `src/data/scraper/summaries.json` (253.0KB) - Scraper/development tool
6. `src/data/scraper/valid_urls.json` (10.7KB) - Scraper/development tool
7. `src/utils/scrapeUtils.ts` (2.2KB) - No active imports found

## i18n System Status ✅

The i18n system is **ACTIVE** with 32 translation files:

1. `public/locales/en/common.json` (1.8KB) - Translation file
2. `public/locales/en/contact.json` (3.9KB) - Translation file
3. `public/locales/en/debug.json` (0.3KB) - Translation file
4. `public/locales/en/disclaimer.json` (4.0KB) - Translation file
5. `public/locales/en/episode.json` (1.5KB) - Translation file
6. `public/locales/en/home.json` (2.4KB) - Translation file
7. `public/locales/en/series-collections.json` (9.9KB) - Translation file
8. `public/locales/en/series-detail.json` (0.9KB) - Translation file
9. `public/locales/en/series-page.json` (1.9KB) - Translation file
10. `public/locales/en/series.json` (0.8KB) - Translation file
11. `public/locales/es/common.json` (2.0KB) - Translation file
12. `public/locales/es/contact.json` (4.3KB) - Translation file
13. `public/locales/es/content.json` (0.3KB) - Translation file
14. `public/locales/es/content/episode-loglines.json` (21.4KB) - Translation file
15. `public/locales/es/content/episode-titles.json` (5.8KB) - Translation file
16. `public/locales/es/content/general-summaries.json` (247.9KB) - Translation file
17. `public/locales/es/content/jesus-summaries.json` (240.7KB) - Translation file
18. `public/locales/es/content/series-metadata.json` (37.9KB) - Translation file
19. `public/locales/es/content/urantia-papers.json` (161.9KB) - Translation file
20. `public/locales/es/debug.json` (0.3KB) - Translation file
21. `public/locales/es/disclaimer.json` (4.4KB) - Translation file
22. `public/locales/es/episode.json` (1.7KB) - Translation file
23. `public/locales/es/home.json` (2.6KB) - Translation file
24. `public/locales/es/series-collections.json` (5.8KB) - Translation file
25. `public/locales/es/series-detail.json` (1.0KB) - Translation file
26. `public/locales/es/series-page.json` (2.1KB) - Translation file
27. `public/locales/es/series.json` (0.9KB) - Translation file
28. `src/components/shared/LocalizedLink.tsx` (0.9KB) - i18n-related
29. `src/i18n/LanguageContext.tsx` (2.3KB) - i18n configuration
30. `src/i18n/LanguageSwitcher.tsx` (1.0KB) - i18n configuration
31. `src/i18n/i18n.ts` (0.9KB) - i18n configuration
32. `src/utils/i18nRouteUtils.ts` (1.9KB) - i18n-related

## Revised Next Steps

1. **DO NOT move i18n files** - they are actively used
2. **Move only legacy files**: Create `legacy-backup/` directory and move 33 unused files  
3. **Focus extraction**: Only extract content from 19 active content files
4. **Proceed to Step 3**: Map data source relationships for active files only

## Critical Insight

The **Spanish translations already exist** in 17 files! The focus should be on:
1. **Extracting hardcoded content** from 19 active source files
2. **Integrating with existing i18n system** rather than rebuilding translations

*This focused approach will significantly reduce the scope of content extraction work since translations are already partially implemented.*
