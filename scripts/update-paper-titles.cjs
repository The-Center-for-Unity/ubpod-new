#!/usr/bin/env node
/*
 * update-paper-titles.cjs
 * ---------------------------------
 * Usage: node scripts/update-paper-titles.cjs <lang>
 *   <lang> must be one of: es, fr, pt
 *
 * This script:
 * 1. Reads the authoritative paper title map (src/data/paper-titles-<lang>.json)
 * 2. Reads English master episodes definition (src/data/json/episodes.json) to know which series/episode map to which paper.
 * 3. Loads the target locale content file (src/locales/<lang>/content/content.json)
 * 4. Replaces the `title` field for every episode that corresponds to a Urantia Paper.
 * 5. Creates a timestamped backup under legacy-bkp/content-json-backup-<timestamp>/<lang>/content.json
 * 6. Emits a simple log summary (total, updated, skipped).
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

const LANGS = ['es', 'fr', 'pt'];

function die(msg) {
  console.error(`❌ ${msg}`);
  process.exit(1);
}

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function main() {
  const lang = process.argv[2];
  if (!LANGS.includes(lang)) {
    die(`Invalid or missing <lang> argument. Expected one of: ${LANGS.join(', ')}`);
  }

  const t0 = performance.now();

  const mappingPath = path.join(__dirname, '..', 'src', 'data', `paper-titles-${lang}.json`);
  if (!fs.existsSync(mappingPath)) die(`Mapping file not found: ${mappingPath}`);
  const titleMap = loadJSON(mappingPath);

  const episodesPath = path.join(__dirname, '..', 'src', 'data', 'json', 'episodes.json');
  if (!fs.existsSync(episodesPath)) die(`episodes.json not found.`);
  const episodesMaster = loadJSON(episodesPath);

  const contentPath = path.join(__dirname, '..', 'src', 'locales', lang, 'content', 'content.json');
  if (!fs.existsSync(contentPath)) die(`content.json for lang '${lang}' not found.`);
  const content = loadJSON(contentPath);
  const original = deepClone(content);

  let totalCandidates = 0;
  let updatedCount = 0;

  // Iterate over all series to map paper numbers (cosmic-* and urantia-papers)
  for (const [seriesKey, seriesData] of Object.entries(episodesMaster)) {
    const localeSeries = content[seriesKey];
    if (!localeSeries || !localeSeries.episodes) continue;

    const masterEpisodes = seriesData.episodes;
    masterEpisodes.forEach((ep, idx) => {
      let paperNum = undefined;
      if (typeof ep.paperNumber === 'number') {
        paperNum = String(ep.paperNumber);
      } else if (typeof ep.summaryKey === 'string') {
        const match = /^paper_(\d+)/.exec(ep.summaryKey);
        if (match) paperNum = match[1];
      }
      if (!paperNum) return; // not a paper
      const newTitle = titleMap[paperNum];
      if (!newTitle) return; // mapping missing

      const epId = String(ep.id ?? idx + 1);
      const localeEpisode = localeSeries.episodes[epId];
      if (!localeEpisode) return;

      totalCandidates++;
      if (localeEpisode.title !== newTitle) {
        localeEpisode.title = newTitle;
        updatedCount++;
      }
    });
  }

  if (updatedCount === 0) {
    console.log(`ℹ️  No updates needed for '${lang}'.`);
    return;
  }

  // Backup
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '..', 'legacy-bkp', `content-json-backup-${timestamp}`, lang, 'content');
  fs.mkdirSync(backupDir, { recursive: true });
  fs.writeFileSync(path.join(backupDir, 'content.json'), JSON.stringify(original, null, 2), 'utf8');

  // Write updated content
  fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf8');

  const dt = ((performance.now() - t0) / 1000).toFixed(2);
  console.log(`✅ Updated ${updatedCount}/${totalCandidates} paper titles for '${lang}' in ${dt}s.`);
  console.log(`   Backup saved to ${backupDir}`);
}

if (require.main === module) {
  main();
} 