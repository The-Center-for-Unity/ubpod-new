const fs = require('fs');
const path = require('path');

// Configuration
const LANGUAGES = ['en', 'es'];
const CONTENT_DIR = 'src/locales';
const OUTPUT_DIR = 'src/locales';

// File paths
const getContentPath = (lang, filename) => path.join(CONTENT_DIR, lang, 'content', filename);
const getOutputPath = (lang, filename) => path.join(OUTPUT_DIR, lang, 'content', filename);

console.log('Starting content consolidation...\n');

// Step 1: Create new metadata structure (non-localized)
console.log('Step 1: Creating consolidated metadata file...');

function createMetadataFile() {
  const metadata = {};
  
  // Read English series metadata as the base structure
  const enSeriesMetadata = JSON.parse(fs.readFileSync(getContentPath('en', 'series-metadata.json'), 'utf8'));
  
  for (const [seriesId, seriesData] of Object.entries(enSeriesMetadata)) {
    metadata[seriesId] = {
      seriesId,
      episodes: seriesData.episodes.map(ep => ({
        id: ep.id,
        // Add paperNumber for Urantia Papers series
        ...(seriesId === 'urantia-papers' && { paperNumber: ep.id })
      }))
    };
  }
  
  // Write consolidated metadata file
  const metadataPath = path.join(OUTPUT_DIR, 'series-metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log('Created: ' + metadataPath);
  
  return metadata;
}

// Step 2: Create consolidated content files for each language
console.log('\nStep 2: Creating consolidated content files for each language...');

function createContentFile(language) {
  console.log('\nProcessing ' + language.toUpperCase() + ' content...');
  
  const content = {};
  
  // Read all source files
  const seriesMetadata = JSON.parse(fs.readFileSync(getContentPath(language, 'series-metadata.json'), 'utf8'));
  const episodeTitles = JSON.parse(fs.readFileSync(getContentPath(language, 'episode-titles.json'), 'utf8'));
  const episodeLoglines = JSON.parse(fs.readFileSync(getContentPath(language, 'episode-loglines.json'), 'utf8'));
  
  // Read summaries files (they might be empty or have different structures)
  let generalSummaries = {};
  let jesusSummaries = {};
  let urantiaPapers = {};
  
  try {
    const generalSummariesContent = fs.readFileSync(getContentPath(language, 'general-summaries.json'), 'utf8');
    if (generalSummariesContent.trim() !== '{}') {
      generalSummaries = JSON.parse(generalSummariesContent);
    }
  } catch (error) {
    console.log('general-summaries.json is empty or missing for ' + language);
  }
  
  try {
    jesusSummaries = JSON.parse(fs.readFileSync(getContentPath(language, 'jesus-summaries.json'), 'utf8'));
  } catch (error) {
    console.log('jesus-summaries.json missing for ' + language);
  }
  
  try {
    urantiaPapers = JSON.parse(fs.readFileSync(getContentPath(language, 'urantia-papers.json'), 'utf8'));
  } catch (error) {
    console.log('urantia-papers.json missing for ' + language);
  }
  
  // Process each series
  for (const [seriesId, seriesData] of Object.entries(seriesMetadata)) {
    console.log('  Processing series: ' + seriesId);
    
    content[seriesId] = {
      seriesTitle: seriesData.seriesTitle,
      seriesDescription: seriesData.seriesDescription,
      episodes: {}
    };
    
    // Process each episode
    for (const episode of seriesData.episodes) {
      const episodeId = episode.id.toString();
      
      // Get title from episode-titles.json
      let title = episode.title; // fallback to series metadata
      if (episodeTitles[seriesId] && episodeTitles[seriesId][episode.id - 1]) {
        title = episodeTitles[seriesId][episode.id - 1];
      }
      
      // Get logline from episode-loglines.json
      let logline = '';
      if (episodeLoglines[seriesId] && episodeLoglines[seriesId][episode.id - 1]) {
        logline = episodeLoglines[seriesId][episode.id - 1];
      }
      
      // Get summary based on series type
      let summary = '';
      let episodeCard = '';
      
      if (seriesId.startsWith('jesus-')) {
        // Jesus series - look in jesus-summaries.json
        const summaryKey = 'topic/' + seriesId + '-' + episode.id;
        if (jesusSummaries[summaryKey]) {
          summary = jesusSummaries[summaryKey].fullSummary || '';
          episodeCard = jesusSummaries[summaryKey].shortSummary || '';
        }
      } else if (seriesId.startsWith('cosmic-')) {
        // Cosmic series - look in general-summaries.json
        const summaryKey = 'topic/' + seriesId + '-' + episode.id;
        if (generalSummaries[summaryKey]) {
          summary = generalSummaries[summaryKey].fullSummary || '';
          episodeCard = generalSummaries[summaryKey].shortSummary || '';
        }
      } else if (seriesId === 'urantia-papers') {
        // Urantia Papers - look in urantia-papers.json
        const paperKey = 'paper_' + episode.id;
        if (urantiaPapers[paperKey]) {
          title = urantiaPapers[paperKey].title;
          episodeCard = urantiaPapers[paperKey].episode_card;
          summary = urantiaPapers[paperKey].episode_page;
        }
      }
      
      content[seriesId].episodes[episodeId] = {
        title,
        logline,
        episodeCard,
        summary
      };
    }
  }
  
  // Write consolidated content file
  const contentPath = getOutputPath(language, 'content.json');
  fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));
  console.log('Created: ' + contentPath);
  
  return content;
}

// Step 3: Validation
console.log('\nStep 3: Validating consolidated files...');

function validateConsolidation(metadata, enContent, esContent) {
  console.log('\nValidating data integrity...');
  
  let errors = 0;
  let warnings = 0;
  
  // Check that all series exist in both metadata and content files
  const metadataSeries = Object.keys(metadata);
  const enSeries = Object.keys(enContent);
  const esSeries = Object.keys(esContent);
  
  // Check for missing series
  for (const seriesId of metadataSeries) {
    if (!enSeries.includes(seriesId)) {
      console.log('ERROR: Series ' + seriesId + ' missing from English content');
      errors++;
    }
    if (!esSeries.includes(seriesId)) {
      console.log('ERROR: Series ' + seriesId + ' missing from Spanish content');
      errors++;
    }
  }
  
  // Check for extra series in content files
  for (const seriesId of enSeries) {
    if (!metadataSeries.includes(seriesId)) {
      console.log('WARNING: Extra series ' + seriesId + ' in English content');
      warnings++;
    }
  }
  
  for (const seriesId of esSeries) {
    if (!metadataSeries.includes(seriesId)) {
      console.log('WARNING: Extra series ' + seriesId + ' in Spanish content');
      warnings++;
    }
  }
  
  // Check episode counts
  for (const seriesId of metadataSeries) {
    if (enContent[seriesId] && esContent[seriesId]) {
      const metadataEpisodes = metadata[seriesId].episodes.length;
      const enEpisodes = Object.keys(enContent[seriesId].episodes).length;
      const esEpisodes = Object.keys(esContent[seriesId].episodes).length;
      
      if (metadataEpisodes !== enEpisodes) {
        console.log('ERROR: Episode count mismatch for ' + seriesId + ' - metadata: ' + metadataEpisodes + ', en: ' + enEpisodes);
        errors++;
      }
      
      if (metadataEpisodes !== esEpisodes) {
        console.log('ERROR: Episode count mismatch for ' + seriesId + ' - metadata: ' + metadataEpisodes + ', es: ' + esEpisodes);
        errors++;
      }
    }
  }
  
  // Check for missing titles
  for (const [seriesId, seriesData] of Object.entries(enContent)) {
    for (const [episodeId, episodeData] of Object.entries(seriesData.episodes)) {
      if (!episodeData.title || episodeData.title.trim() === '') {
        console.log('WARNING: Missing title for ' + seriesId + '/' + episodeId + ' in English');
        warnings++;
      }
    }
  }
  
  for (const [seriesId, seriesData] of Object.entries(esContent)) {
    for (const [episodeId, episodeData] of Object.entries(seriesData.episodes)) {
      if (!episodeData.title || episodeData.title.trim() === '') {
        console.log('WARNING: Missing title for ' + seriesId + '/' + episodeId + ' in Spanish');
        warnings++;
      }
    }
  }
  
  console.log('\nValidation Results:');
  console.log('  Errors: ' + errors);
  console.log('  Warnings: ' + warnings);
  
  if (errors > 0) {
    console.log('\nValidation failed! Please fix errors before proceeding.');
    process.exit(1);
  } else if (warnings > 0) {
    console.log('\nValidation completed with warnings. Please review.');
  } else {
    console.log('\nValidation passed! All data consolidated successfully.');
  }
}

// Step 4: Create backup of original files
console.log('\nStep 4: Creating backup of original files...');

function createBackup() {
  const backupDir = path.join(OUTPUT_DIR, 'backup', new Date().toISOString().split('T')[0]);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  for (const lang of LANGUAGES) {
    const langBackupDir = path.join(backupDir, lang, 'content');
    fs.mkdirSync(langBackupDir, { recursive: true });
    
    const files = [
      'series-metadata.json',
      'episode-titles.json',
      'episode-loglines.json',
      'general-summaries.json',
      'jesus-summaries.json',
      'urantia-papers.json'
    ];
    
    for (const file of files) {
      const sourcePath = getContentPath(lang, file);
      const backupPath = path.join(langBackupDir, file);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, backupPath);
        console.log('  Backed up: ' + file + ' (' + lang + ')');
      }
    }
  }
  
  console.log('Backup created in: ' + backupDir);
}

// Main execution
try {
  // Create backup first
  createBackup();
  
  // Create consolidated metadata
  const metadata = createMetadataFile();
  
  // Create consolidated content files
  const enContent = createContentFile('en');
  const esContent = createContentFile('es');
  
  // Validate the consolidation
  validateConsolidation(metadata, enContent, esContent);
  
  console.log('\nContent consolidation completed successfully!');
  console.log('\nNew file structure:');
  console.log('  src/locales/series-metadata.json (non-localized structure)');
  console.log('  src/locales/en/content/content.json (English content)');
  console.log('  src/locales/es/content/content.json (Spanish content)');
  console.log('\nOriginal files backed up in src/locales/backup/');
  
} catch (error) {
  console.error('\nError during consolidation: ' + error.message);
  process.exit(1);
} 