const fs = require('fs');
const path = require('path');

// Read the Spanish metadata
const spanishMetadataPath = path.join(process.cwd(), 'src/locales/es/content/series-metadata.json');

console.log('Reading Spanish metadata...');
const spanishMetadata = JSON.parse(fs.readFileSync(spanishMetadataPath, 'utf8'));

// Remove series-platform-X entries
const entriesToRemove = ['series-platform-1', 'series-platform-2', 'series-platform-3', 'series-platform-4'];

console.log('Removing old series-platform entries...');
for (const entry of entriesToRemove) {
  if (spanishMetadata[entry]) {
    delete spanishMetadata[entry];
    console.log('Removed: ' + entry);
  } else {
    console.log('Not found: ' + entry);
  }
}

// Write the cleaned metadata
fs.writeFileSync(spanishMetadataPath, JSON.stringify(spanishMetadata, null, 2));
console.log('✅ Spanish metadata cleaned successfully!');

// Show remaining series
console.log('\nRemaining series:');
Object.keys(spanishMetadata).forEach(series => {
  console.log('  - ' + series + ' (' + spanishMetadata[series].episodes.length + ' episodes)');
}); 