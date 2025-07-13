import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the current episodes.json file
const episodesPath = path.join(__dirname, '../src/data/json/episodes.json');
const episodesData = JSON.parse(fs.readFileSync(episodesPath, 'utf8'));

console.log('🧹 Starting aggressive episodes.json streamlining...');

// Function to streamline episode entries
function streamlineEpisode(episode, seriesId) {
  const streamlined = {
    id: episode.id,
    summaryKey: episode.summaryKey
  };
  
  // For Urantia Papers series, add paperNumber field
  if (seriesId === 'urantia-papers' || seriesId.startsWith('series-platform-')) {
    // For urantia-papers, paperNumber equals id
    // For platform series, we need to calculate the actual paper number
    if (seriesId === 'urantia-papers') {
      streamlined.paperNumber = episode.id;
    } else if (seriesId === 'series-platform-1') {
      streamlined.paperNumber = episode.id; // Papers 1-31
    } else if (seriesId === 'series-platform-2') {
      streamlined.paperNumber = episode.id + 31; // Papers 32-56
    } else if (seriesId === 'series-platform-3') {
      streamlined.paperNumber = episode.id + 56; // Papers 57-119
    } else if (seriesId === 'series-platform-4') {
      streamlined.paperNumber = episode.id + 119; // Papers 120-196
    }
  }
  
  return streamlined;
}

// Process each series
const streamlinedData = {};
let totalEpisodes = 0;
let seriesCount = 0;

for (const [seriesId, seriesData] of Object.entries(episodesData)) {
  console.log(`📁 Processing series: ${seriesId}`);
  
  streamlinedData[seriesId] = {
    seriesTitle: seriesData.seriesTitle,
    seriesDescription: seriesData.seriesDescription,
    episodes: seriesData.episodes.map(episode => streamlineEpisode(episode, seriesId))
  };
  
  totalEpisodes += seriesData.episodes.length;
  seriesCount++;
  console.log(`   ✅ Streamlined ${seriesData.episodes.length} episodes`);
}

// Write the streamlined data back to the file
fs.writeFileSync(episodesPath, JSON.stringify(streamlinedData, null, 2), 'utf8');

console.log('\n🎉 Episodes.json streamlining completed!');
console.log(`📊 Summary:`);
console.log(`   - Series processed: ${seriesCount}`);
console.log(`   - Total episodes streamlined: ${totalEpisodes}`);
console.log(`   - Fields removed per episode: title, audioUrl, pdfUrl, imageUrl`);
console.log(`   - Fields kept per episode: id, summaryKey`);
console.log(`   - Special field for Urantia Papers: paperNumber`);
console.log('\n🔧 All URLs will now be generated dynamically with language support!'); 