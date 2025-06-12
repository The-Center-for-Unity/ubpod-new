# Legacy File Backup Manifest
*UrantiaBookPod i18n Implementation - Step 9*

## Backup Summary
**Date**: December 12, 2024  
**Reason**: Step 9 of i18n implementation - removing legacy files that could interfere with translation system  
**Total Moved**: ~950KB of legacy files, forcing pure translation system usage

## Files Moved to Backup

| Original Location | Backup Location | File Size | Reason Moved | Analysis Source |
|-------------------|-----------------|-----------|--------------|-----------------|
| `src/data/scraper/` (entire directory) | `backup/legacy-files/data/scraper/` | ~300KB total | Development tools, not runtime files | Phase 2A Step 2 analysis |
| `src/data/content.ts` | `backup/legacy-files/data/content.ts` | 1.7KB | No active imports found | Phase 2A Step 2 analysis |
| `src/data/json/summaries-check.ts` | `backup/legacy-files/data/json/summaries-check.ts` | 1.3KB | Debugging file, development tool only | Manual analysis |
| `src/data/episodes.ts` | `backup/legacy-files/data/episodes.ts` | 34KB | **REDUNDANT** - Hardcoded episode generation replaced by episodes.json + translation system | Step 9 cleanup |
| `src/data/discoverJesusSummaries.ts` | `backup/legacy-files/data/discoverJesusSummaries.ts` | 2.8KB | **REDUNDANT** - Replaced by translation system | Step 9 cleanup |
| `src/data/json/urantia_summaries.json` | `backup/legacy-files/data/json/urantia_summaries.json` | 151KB | **REDUNDANT** - Replaced by translation system | Step 9 cleanup |
| `src/data/json/urantia_summaries_es.json` | `backup/legacy-files/data/json/urantia_summaries_es.json` | 170KB | **REDUNDANT** - Replaced by translation system | Step 9 cleanup |
| `src/data/json/summaries.json` | `backup/legacy-files/data/json/summaries.json` | 253KB | **REDUNDANT** - Replaced by translation system | Step 9 cleanup |

## Scraper Directory Contents (Moved)
- `scrape_discover_jesus.py` (24KB) - Python scraper script
- `summaries.json` (253KB) - Duplicate of main summaries.json
- `valid_urls.json` (11KB) - Scraper validation data
- `requirements.txt` (61B) - Python dependencies
- `README.md` (1.1KB) - Scraper documentation

## Files Kept (Active/Required)
- `src/data/json/episodes.json` - **ACTIVE** (Jesus/cosmic episode data - core data source)
- `src/data/json/jesus-series-mappings.json` - **ACTIVE** (audio URL mapping)
- `src/data/json/cosmic-series-mappings.json` - **ACTIVE** (audio URL mapping)
- `src/data/series-availability.json` - **ACTIVE** (series availability metadata)

## Purpose of This Backup
This backup was created during Step 9 of the i18n implementation to:

1. **Eliminate interference** - Remove files that could be accessed by legacy hardcoded logic
2. **Clean environment** - Ensure only translation system files remain active
3. **Debug clarity** - Make it clear what files are actually being used
4. **Preserve history** - Keep development artifacts for future reference

## Verification Commands
To verify no active imports reference moved files:
```bash
grep -r "content\.ts" src/
grep -r "summaries-check" src/
grep -r "scraper/" src/
```

## Restoration Process
If any moved file is needed:
1. Copy from `backup/legacy-files/` back to original location
2. Update this manifest with restoration details
3. Test application functionality

## Implementation Changes Made
Beyond just moving files, we also had to fix broken imports:

### Code Changes Required:
1. **`src/utils/episodeUtils.ts`** - Complete rewrite to use only translation system and episodes.json
2. **`src/pages/UrantiaPapersPage.tsx`** - Fixed imports: `getUrantiaPapers` → `getEpisodesForSeries('urantia-papers')`
3. **`src/pages/EpisodePage.tsx`** - Fixed imports: `getEpisodeById` → legacy wrapper function added
4. **Added missing functions** - `getUrantiaPaperPart()` and `getEpisodeById()` to episodeUtils.ts for backward compatibility

### Architecture Achieved:
- **ZERO hardcoded episode data** - All episodes now load from `episodes.json`
- **PURE translation system** - All text content comes from i18n translation files  
- **Minimal data footprint** - Only 4 core data files remain (~100KB total vs. ~950KB before)
- **Backward compatibility** - Old function calls still work via wrapper functions

## Step 9 Status: ✅ COMPLETE
**Total cleanup**: 950KB of legacy files moved to backup, forcing pure translation system usage.

## Next Steps
**Ready for Step 11**: Integration testing + final validation
- Test all series loading (jesus-, cosmic-, urantia-papers)
- Verify Spanish translations display correctly  
- Test audio/PDF functionality
- Validate navigation between episodes works

---
*This manifest ensures complete traceability of all moved files during the i18n implementation process.* 