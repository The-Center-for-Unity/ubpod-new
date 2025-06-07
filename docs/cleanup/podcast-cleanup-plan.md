# UrantiaBookPod Podcast-Focused Cleanup Plan

## Overview

Before implementing the i18n functionality as outlined in `docs/i18n/i18n-plan.md`, we need to streamline the codebase to focus exclusively on podcast-related functionality. This document outlines the specific components to keep, modify, or remove in preparation for adding Spanish language support for the Urantia Papers series.

## Branch Management Strategy

1. **Current Status**: We're on the `code-only` branch, which is deployed to production.

2. **Cleanup Branch**:
   ```bash
   git checkout -b cleanup code-only
   ```
   - Implement all cleanup changes on this branch
   - Test thoroughly to ensure all functionality is preserved
   - Create a PR to merge back to `code-only` when complete

3. **Future i18n Work**:
   - After cleanup is merged and confirmed stable in production
   - Create a new branch for i18n implementation:
   ```bash
   git checkout -b i18n code-only
   ```

## Core Podcast Components to Keep

### 1. Audio and Episode Related
- `src/components/audio/AudioPlayer.tsx` - Core audio player component
- `src/components/ui/EpisodeCard.tsx` - Episode display cards
- `src/components/ui/SeriesCard.tsx` - Series display cards
- `src/components/ui/SeriesCardGrid.tsx` - Grid layout for series
- `src/components/ui/SeriesNavigation.tsx` - Navigation between episodes

### 2. Page Components
- `src/pages/EpisodePage.tsx` - Single episode display and playback
- `src/pages/SeriesPage.tsx` - Series listing page
- `src/pages/UrantiaPapersPage.tsx` - Specific page for Urantia Papers
- `src/pages/Home.tsx` - Landing page
- `src/pages/ListenPage.tsx` - Series episodes listing

### 3. Data and Configuration
- `src/data/episodes.ts` - Core episode data
- `src/data/json/urantia_summaries.json` - Episode summaries
- `src/config/audio.ts` - Audio file configuration

### 4. Utilities
- `src/utils/episodeUtils.ts` - Episode utilities
- `src/utils/urlUtils.ts` - URL manipulation utilities
- `src/utils/mediaUtils.ts` - Media handling utilities
- `src/utils/seriesUtils.ts` - Series-related utilities

## Components to Remove

### 1. Non-Podcast Related Components
- `src/components/framework/` - Triangle framework components
- `src/components/sacred-companions/` - Sacred companions components
- `src/components/initiatives/` - Initiatives components

### 2. Unused Utilities
- `src/services/airtable.ts` - Airtable integration (not used for podcast)
- `src/scripts/` - Non-essential scripts

## Modifications Needed

### 1. Types
- Update `src/types/index.ts` to keep only podcast-related types
- Keep `Episode`, `SeriesType`, and `AudioPlayerState` interfaces
- Remove unused types like `Domain`, `Project`, etc.

### 2. Routes
- Simplify `App.tsx` to include only podcast-related routes
- Keep routes for home, series, episodes, and Urantia Papers

### 3. Data Structure
- Update `src/data/episodes.ts` to simplify the episode data structure
- Keep episode data focused on Urantia Papers series for Spanish i18n

## Implementation Steps

1. Create the cleanup branch
   ```bash
   git checkout -b cleanup code-only
   ```

2. Remove unused components and directories:
   - Non-podcast related framework components
   - Sacred companions components
   - Initiatives components

3. Clean up types in `src/types/index.ts`:
   - Remove unused types and interfaces
   - Keep only podcast-related types

4. Update data structures:
   - Simplify episode data in `src/data/episodes.ts`
   - Focus on podcast-relevant data

5. Test application thoroughly:
   - Verify all pages load correctly
   - Ensure audio player functions properly
   - Test navigation and routing
   - Check for any console errors

6. Create a PR to merge cleanup branch back to `code-only`

## Testing Checklist

After cleanup, verify that:

- [ ] Home page loads correctly
- [ ] Series page displays all series properly
- [ ] Urantia Papers page shows all papers
- [ ] Episode pages load for all series
- [ ] Audio player functions (play, pause, seek, volume)
- [ ] Navigation between episodes works
- [ ] Episode cards display correctly
- [ ] All links work properly
- [ ] No console errors are present
- [ ] Build completes without errors
- [ ] Application loads in production environment

## After Cleanup: Next Steps

1. Deploy cleaned-up version to production
2. Verify everything works in the production environment
3. Create the i18n branch and begin internationalization implementation