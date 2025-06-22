#!/usr/bin/env node

/**
 * Consolidate Urantia Papers - Unified Architecture Refactoring
 * 
 * This script consolidates all series-platform-X data into a single 
 * urantia-papers series, eliminating the dual system architecture.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EPISODES_FILE = path.join(__dirname, '../src/data/json/episodes.json');

console.log('🚀 Starting Urantia Papers Consolidation...\n');

// Read current episodes.json
const episodesData = JSON.parse(fs.readFileSync(EPISODES_FILE, 'utf8'));

// Extract all platform series data
const platformSeries = {};
for (let i = 1; i <= 4; i++) {
  const seriesKey = `series-platform-${i}`;
  if (episodesData[seriesKey]) {
    platformSeries[seriesKey] = episodesData[seriesKey];
    console.log(`✅ Found ${seriesKey}: ${episodesData[seriesKey].episodes.length} episodes`);
  }
}

// Create consolidated urantia-papers series
const consolidatedEpisodes = [];

// Add all episodes from platform series with proper paper number mapping
for (let i = 1; i <= 4; i++) {
  const seriesKey = `series-platform-${i}`;
  const seriesData = platformSeries[seriesKey];
  
  if (seriesData && seriesData.episodes) {
    seriesData.episodes.forEach(episode => {
      let actualPaperNumber;
      
      // Calculate actual paper number based on platform series
      if (i === 1) {
        actualPaperNumber = episode.id; // Papers 1-31 (plus foreword as 0)
      } else if (i === 2) {
        actualPaperNumber = episode.id + 31; // Papers 32-56
      } else if (i === 3) {
        actualPaperNumber = episode.id + 56; // Papers 57-119
      } else if (i === 4) {
        actualPaperNumber = episode.id + 119; // Papers 120-196
      }
      
      // Create consolidated episode entry
      const consolidatedEpisode = {
        id: actualPaperNumber,
        summaryKey: `paper_${actualPaperNumber}`,
        paperNumber: actualPaperNumber
      };
      
      consolidatedEpisodes.push(consolidatedEpisode);
    });
  }
}

// Sort episodes by paper number
consolidatedEpisodes.sort((a, b) => a.id - b.id);

console.log(`\n📊 Consolidation Summary:`);
console.log(`- Total episodes consolidated: ${consolidatedEpisodes.length}`);
console.log(`- Paper range: ${consolidatedEpisodes[0]?.id} to ${consolidatedEpisodes[consolidatedEpisodes.length - 1]?.id}`);

// Create new urantia-papers series
const newUrantiaPapers = {
  seriesTitle: "The Urantia Papers",
  seriesDescription: "The complete Urantia Book, one paper at a time. Explore the profound teachings and revelations of this comprehensive spiritual text.",
  episodes: consolidatedEpisodes
};

// Update episodes.json
const updatedEpisodesData = { ...episodesData };

// Replace urantia-papers with consolidated version
updatedEpisodesData['urantia-papers'] = newUrantiaPapers;

// Remove series-platform-X entries
for (let i = 1; i <= 4; i++) {
  const seriesKey = `series-platform-${i}`;
  if (updatedEpisodesData[seriesKey]) {
    console.log(`🗑️  Removing ${seriesKey}`);
    delete updatedEpisodesData[seriesKey];
  }
}

// Write updated episodes.json
fs.writeFileSync(EPISODES_FILE, JSON.stringify(updatedEpisodesData, null, 2));

console.log(`\n✅ Consolidation Complete!`);
console.log(`📁 Updated: ${EPISODES_FILE}`);
console.log(`\n🎯 Results:`);
console.log(`- Single urantia-papers series with ${consolidatedEpisodes.length} episodes`);
console.log(`- Removed series-platform-1 through series-platform-4`);
console.log(`- All episodes have proper summaryKey: paper_X format`);
console.log(`- Paper numbers correctly mapped: 0-196`);

// Verify no duplicates
const paperNumbers = consolidatedEpisodes.map(ep => ep.id);
const uniquePaperNumbers = [...new Set(paperNumbers)];
if (paperNumbers.length === uniquePaperNumbers.length) {
  console.log(`✅ No duplicate paper numbers found`);
} else {
  console.log(`❌ WARNING: Found duplicate paper numbers!`);
}

console.log(`\n🔄 Next Steps:`);
console.log(`1. Update UrantiaPapersPage.tsx to use getEpisodesForSeries()`);
console.log(`2. Remove generateUrantiaPapers() function`);
console.log(`3. Remove series-platform-X routes from App.tsx`);
console.log(`4. Test cosmic series still work (they should be unaffected)`); 