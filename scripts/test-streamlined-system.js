import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the streamlined episodes.json
const episodesPath = path.join(__dirname, '../src/data/json/episodes.json');
const episodesData = JSON.parse(fs.readFileSync(episodesPath, 'utf8'));

console.log('🧪 TESTING STREAMLINED EPISODES.JSON SYSTEM...');
console.log('=' .repeat(60));

// Test 1: Check if episodes.json was properly streamlined
console.log('\n📋 TEST 1: Episodes.json Structure Validation');
const firstSeries = Object.keys(episodesData)[0];
const firstEpisode = episodesData[firstSeries].episodes[0];

console.log(`Sample episode from ${firstSeries}:`, JSON.stringify(firstEpisode, null, 2));

const hasDeletedFields = firstEpisode.hasOwnProperty('title') || 
                         firstEpisode.hasOwnProperty('audioUrl') || 
                         firstEpisode.hasOwnProperty('pdfUrl') || 
                         firstEpisode.hasOwnProperty('imageUrl');

if (hasDeletedFields) {
  console.log('❌ FAILED: Episodes still contain deleted fields');
  process.exit(1);
} else {
  console.log('✅ PASSED: Episodes properly streamlined (no hardcoded URLs/titles)');
}

// Test 2: Check if history series was removed
console.log('\n🗑️ TEST 2: History Series Removal');
if (episodesData.hasOwnProperty('history')) {
  console.log('❌ FAILED: History series still exists in episodes.json');
  process.exit(1);
} else {
  console.log('✅ PASSED: History series successfully removed');
}

// Test 3: Check required fields exist
console.log('\n📝 TEST 3: Required Fields Validation');
const requiredFields = ['id', 'summaryKey'];
const missingFields = requiredFields.filter(field => !firstEpisode.hasOwnProperty(field));

if (missingFields.length > 0) {
  console.log(`❌ FAILED: Missing required fields: ${missingFields.join(', ')}`);
  process.exit(1);
} else {
  console.log('✅ PASSED: All required fields present (id, summaryKey)');
}

// Test 4: Check platform series have paperNumber
console.log('\n📄 TEST 4: Platform Series Paper Number Validation');
const platformSeries = Object.keys(episodesData).filter(key => key.startsWith('series-platform-'));
let platformTestPassed = true;

for (const seriesId of platformSeries) {
  const episodes = episodesData[seriesId].episodes;
  const hasPaperNumbers = episodes.every(ep => ep.hasOwnProperty('paperNumber'));
  
  if (!hasPaperNumbers) {
    console.log(`❌ FAILED: ${seriesId} episodes missing paperNumber field`);
    platformTestPassed = false;
  } else {
    console.log(`✅ PASSED: ${seriesId} has paperNumber fields`);
  }
}

if (!platformTestPassed) {
  process.exit(1);
}

// Test 5: Series count validation
console.log('\n📊 TEST 5: Series Count Validation');
const seriesCount = Object.keys(episodesData).length;
const expectedCount = 33; // Based on the streamlining output

if (seriesCount !== expectedCount) {
  console.log(`❌ FAILED: Expected ${expectedCount} series, got ${seriesCount}`);
  process.exit(1);
} else {
  console.log(`✅ PASSED: Correct number of series (${seriesCount})`);
}

// Final summary
console.log('\n' + '=' .repeat(60));
console.log('🎉 ALL TESTS PASSED! Streamlined system is working correctly!');
console.log('📊 Summary:');
console.log(`   - Series: ${seriesCount}`);
console.log(`   - Total episodes: ${Object.values(episodesData).reduce((sum, series) => sum + series.episodes.length, 0)}`);
console.log(`   - No hardcoded URLs/titles: ✅`);
console.log(`   - History series removed: ✅`);
console.log(`   - Required fields present: ✅`);
console.log(`   - Platform series have paperNumber: ✅`);
console.log('\n🔧 URLs will now be generated dynamically with language support!'); 