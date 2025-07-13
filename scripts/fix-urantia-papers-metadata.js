import fs from 'fs';
import path from 'path';

// Read the urantia-papers.json file to get all the correct titles
const urantiaPapersPath = path.join(process.cwd(), 'src/locales/es/content/urantia-papers.json');
const seriesMetadataPath = path.join(process.cwd(), 'src/locales/es/content/series-metadata.json');

console.log('Reading urantia-papers.json...');
const urantiaPapers = JSON.parse(fs.readFileSync(urantiaPapersPath, 'utf8'));

console.log('Reading series-metadata.json...');
const seriesMetadata = JSON.parse(fs.readFileSync(seriesMetadataPath, 'utf8'));

// Create episodes array with all 197 papers
const episodes = [];
for (let i = 0; i <= 196; i++) {
  const paperKey = `paper_${i}`;
  const paperData = urantiaPapers[paperKey];
  
  if (paperData) {
    episodes.push({
      id: i + 1, // episode IDs start at 1
      title: paperData.title
    });
  } else {
    console.warn(`Warning: No data found for ${paperKey}`);
  }
}

// Update the urantia-papers entry in series-metadata.json
seriesMetadata['urantia-papers'] = {
  seriesTitle: "El Podcast de los Documentos de Urantia",
  seriesDescription: "Disfruta de un viaje narrativo a través del Libro de Urantia, un documento a la vez.",
  episodes: episodes
};

// Write the updated file
console.log(`Writing updated series-metadata.json with ${episodes.length} episodes...`);
fs.writeFileSync(seriesMetadataPath, JSON.stringify(seriesMetadata, null, 2), 'utf8');

console.log('Successfully updated series-metadata.json!');
console.log(`Added ${episodes.length} episodes to the urantia-papers series.`); 