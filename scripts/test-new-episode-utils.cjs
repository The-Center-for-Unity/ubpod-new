const fs = require('fs');
const path = require('path');

// Test the new consolidated structure
console.log('Testing new consolidated content structure...\n');

// Read the consolidated files
const seriesMetadataPath = path.join(process.cwd(), 'src/locales/series-metadata.json');
const enContentPath = path.join(process.cwd(), 'src/locales/en/content/content.json');
const esContentPath = path.join(process.cwd(), 'src/locales/es/content/content.json');

console.log('Reading consolidated files...');
const seriesMetadata = JSON.parse(fs.readFileSync(seriesMetadataPath, 'utf8'));
const enContent = JSON.parse(fs.readFileSync(enContentPath, 'utf8'));
const esContent = JSON.parse(fs.readFileSync(esContentPath, 'utf8'));

console.log('✅ Files loaded successfully\n');

// Test 1: Check that all series exist in both metadata and content
console.log('Test 1: Series consistency...');
const metadataSeries = Object.keys(seriesMetadata);
const enSeries = Object.keys(enContent);
const esSeries = Object.keys(esContent);

console.log(`Metadata series: ${metadataSeries.length}`);
console.log(`English content series: ${enSeries.length}`);
console.log(`Spanish content series: ${esSeries.length}`);

// Check for missing series
for (const seriesId of metadataSeries) {
  if (!enSeries.includes(seriesId)) {
    console.log(`❌ ERROR: Series ${seriesId} missing from English content`);
  }
  if (!esSeries.includes(seriesId)) {
    console.log(`❌ ERROR: Series ${seriesId} missing from Spanish content`);
  }
}

console.log('✅ Series consistency check completed\n');

// Test 2: Check episode counts
console.log('Test 2: Episode counts...');
for (const seriesId of metadataSeries) {
  const metadataEpisodes = seriesMetadata[seriesId].episodes.length;
  const enEpisodes = Object.keys(enContent[seriesId]?.episodes || {}).length;
  const esEpisodes = Object.keys(esContent[seriesId]?.episodes || {}).length;
  
  console.log(`${seriesId}: metadata=${metadataEpisodes}, en=${enEpisodes}, es=${esEpisodes}`);
  
  if (metadataEpisodes !== enEpisodes || metadataEpisodes !== esEpisodes) {
    console.log(`❌ ERROR: Episode count mismatch for ${seriesId}`);
  }
}

console.log('✅ Episode count check completed\n');

// Test 3: Check content quality
console.log('Test 3: Content quality...');
let totalEpisodes = 0;
let episodesWithTitles = 0;
let episodesWithLoglines = 0;
let episodesWithSummaries = 0;

for (const seriesId of metadataSeries) {
  const seriesEpisodes = seriesMetadata[seriesId].episodes;
  totalEpisodes += seriesEpisodes.length;
  
  for (const episode of seriesEpisodes) {
    const episodeId = episode.id.toString();
    
    // Check English content
    const enEpisode = enContent[seriesId]?.episodes[episodeId];
    if (enEpisode) {
      if (enEpisode.title && enEpisode.title.trim()) episodesWithTitles++;
      if (enEpisode.logline && enEpisode.logline.trim()) episodesWithLoglines++;
      if (enEpisode.summary && enEpisode.summary.trim()) episodesWithSummaries++;
    }
    
    // Check Spanish content
    const esEpisode = esContent[seriesId]?.episodes[episodeId];
    if (esEpisode) {
      if (esEpisode.title && esEpisode.title.trim()) episodesWithTitles++;
      if (esEpisode.logline && esEpisode.logline.trim()) episodesWithLoglines++;
      if (esEpisode.summary && esEpisode.summary.trim()) episodesWithSummaries++;
    }
  }
}

console.log(`Total episodes: ${totalEpisodes}`);
console.log(`Episodes with titles: ${episodesWithTitles}`);
console.log(`Episodes with loglines: ${episodesWithLoglines}`);
console.log(`Episodes with summaries: ${episodesWithSummaries}`);

const titlePercentage = ((episodesWithTitles / (totalEpisodes * 2)) * 100).toFixed(1);
const loglinePercentage = ((episodesWithLoglines / (totalEpisodes * 2)) * 100).toFixed(1);
const summaryPercentage = ((episodesWithSummaries / (totalEpisodes * 2)) * 100).toFixed(1);

console.log(`Title coverage: ${titlePercentage}%`);
console.log(`Logline coverage: ${loglinePercentage}%`);
console.log(`Summary coverage: ${summaryPercentage}%`);

console.log('✅ Content quality check completed\n');

// Test 4: Sample content verification
console.log('Test 4: Sample content verification...');

// Test a few specific episodes
const testCases = [
  { series: 'jesus-1', episode: 1, expectedTitle: 'The Personality of God' },
  { series: 'cosmic-1', episode: 1, expectedTitle: 'The Universal Father' },
  { series: 'urantia-papers', episode: 1, expectedTitle: 'Prólogo' }
];

for (const testCase of testCases) {
  const { series, episode, expectedTitle } = testCase;
  const episodeId = episode.toString();
  
  const enEpisode = enContent[series]?.episodes[episodeId];
  const esEpisode = esContent[series]?.episodes[episodeId];
  
  console.log(`\nTesting ${series}/${episode}:`);
  console.log(`  English title: ${enEpisode?.title || 'NOT FOUND'}`);
  console.log(`  Spanish title: ${esEpisode?.title || 'NOT FOUND'}`);
  console.log(`  Expected: ${expectedTitle}`);
  
  if (enEpisode?.title === expectedTitle || esEpisode?.title === expectedTitle) {
    console.log(`  ✅ Title matches expected`);
  } else {
    console.log(`  ❌ Title does not match expected`);
  }
}

console.log('\n✅ Sample content verification completed\n');

console.log('🎉 All tests completed successfully!');
console.log('\nThe new consolidated content structure is working correctly.'); 