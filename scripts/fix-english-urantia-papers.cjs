const fs = require('fs');
const path = require('path');

// Read the Spanish metadata to get the correct structure
const spanishMetadataPath = path.join(process.cwd(), 'src/locales/es/content/series-metadata.json');
const englishMetadataPath = path.join(process.cwd(), 'src/locales/en/content/series-metadata.json');

console.log('Reading Spanish metadata...');
const spanishMetadata = JSON.parse(fs.readFileSync(spanishMetadataPath, 'utf8'));

console.log('Reading English metadata...');
const englishMetadata = JSON.parse(fs.readFileSync(englishMetadataPath, 'utf8'));

// Get the urantia-papers episodes from Spanish metadata
const spanishUrantiaPapers = spanishMetadata['urantia-papers'];
if (!spanishUrantiaPapers) {
  console.error('ERROR: urantia-papers not found in Spanish metadata');
  process.exit(1);
}

console.log('Found ' + spanishUrantiaPapers.episodes.length + ' papers in Spanish metadata');

// Update the English urantia-papers entry
englishMetadata['urantia-papers'] = {
  seriesTitle: "The Urantia Papers Podcast",
  seriesDescription: "Enjoy a narrative journey through the Urantia Book, one paper at a time.",
  episodes: spanishUrantiaPapers.episodes.map(episode => ({
    id: episode.id,
    title: episode.title
  }))
};

// Write the updated English metadata
fs.writeFileSync(englishMetadataPath, JSON.stringify(englishMetadata, null, 2));
console.log('Updated English metadata with ' + englishMetadata['urantia-papers'].episodes.length + ' papers');

console.log('✅ English urantia-papers metadata updated successfully!'); 