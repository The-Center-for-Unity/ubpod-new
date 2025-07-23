const fs = require('fs');
const path = require('path');

// File paths
const CONTENT_FILE = path.join(__dirname, '../src/locales/en/content/content.json');
const URANTIA_PAPERS_FILE = path.join(__dirname, '../src/locales/en/content/urantia-papers.json');
const JESUS_SUMMARIES_FILE = path.join(__dirname, '../src/locales/en/content/jesus-summaries.json');
const LEGACY_EPISODES_FILE = path.join(__dirname, '../src/data/json/episodes.json');

function createTimestampedBackup(filePath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${filePath}.backup-${timestamp}`;
  fs.copyFileSync(filePath, backupPath);
  console.log(`✅ Created backup: ${backupPath}`);
  return backupPath;
}

function loadJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error loading ${filePath}:`, error.message);
    return null;
  }
}

function consolidateEnglishContent() {
  console.log('🚀 Starting English content consolidation...');
  
  // Load all required files
  const currentContent = loadJsonFile(CONTENT_FILE);
  const urantiaContent = loadJsonFile(URANTIA_PAPERS_FILE);
  const jesusContent = loadJsonFile(JESUS_SUMMARIES_FILE);
  const legacyEpisodes = loadJsonFile(LEGACY_EPISODES_FILE);
  
  if (!currentContent || !urantiaContent || !jesusContent || !legacyEpisodes) {
    console.error('❌ Failed to load required files');
    return;
  }
  
  // Create backup
  const backupPath = createTimestampedBackup(CONTENT_FILE);
  
  // Process each series in the content
  let updatedSeries = 0;
  let updatedEpisodes = 0;
  
  for (const [seriesId, seriesData] of Object.entries(currentContent)) {
    if (!seriesData.episodes) continue;
    
    console.log(`\n📖 Processing series: ${seriesId}`);
    let seriesUpdated = false;
    
    // Process each episode in the series
    for (const [episodeId, episodeData] of Object.entries(seriesData.episodes)) {
      const episodeNum = parseInt(episodeId);
      
      // Get the summaryKey for this episode from legacy data
      const legacySeries = legacyEpisodes[seriesId];
      if (!legacySeries || !legacySeries.episodes) continue;
      
      const legacyEpisode = legacySeries.episodes.find(ep => ep.id === episodeNum);
      if (!legacyEpisode || !legacyEpisode.summaryKey) continue;
      
      const summaryKey = legacyEpisode.summaryKey;
      let updated = false;
      
      // Handle Urantia Papers (summaryKey starts with "paper_")
      if (summaryKey.startsWith('paper_')) {
        const urantiaEpisode = urantiaContent[summaryKey];
        if (urantiaEpisode) {
          // Update empty fields with content from urantia-papers.json
          if (!episodeData.summary && urantiaEpisode.episode_page) {
            episodeData.summary = urantiaEpisode.episode_page;
            updated = true;
          }
          if (!episodeData.episodeCard && urantiaEpisode.episode_card) {
            episodeData.episodeCard = urantiaEpisode.episode_card;
            updated = true;
          }
          
          if (updated) {
            console.log(`  ✅ Updated Urantia episode ${episodeId} (${summaryKey})`);
          }
        }
      }
      
      // Handle Jesus episodes (summaryKey starts with "topic/", "event/", "person/")
      else if (summaryKey.startsWith('topic/') || summaryKey.startsWith('event/') || summaryKey.startsWith('person/')) {
        const jesusEpisode = jesusContent[summaryKey];
        if (jesusEpisode) {
          // Update empty fields with content from jesus-summaries.json
          if (!episodeData.summary && jesusEpisode.fullSummary) {
            episodeData.summary = jesusEpisode.fullSummary;
            updated = true;
          }
          if (!episodeData.episodeCard && jesusEpisode.shortSummary) {
            episodeData.episodeCard = jesusEpisode.shortSummary;
            updated = true;
          }
          
          if (updated) {
            console.log(`  ✅ Updated Jesus episode ${episodeId} (${summaryKey})`);
          }
        }
      }
      
      if (updated) {
        updatedEpisodes++;
        seriesUpdated = true;
      }
    }
    
    if (seriesUpdated) {
      updatedSeries++;
    }
  }
  
  // Write the consolidated content back to file
  try {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(currentContent, null, 2));
    console.log(`\n🎉 Successfully consolidated English content!`);
    console.log(`📊 Updated ${updatedEpisodes} episodes across ${updatedSeries} series`);
    console.log(`💾 Backup created: ${path.basename(backupPath)}`);
  } catch (error) {
    console.error('❌ Error writing consolidated content:', error.message);
    
    // Restore backup on error
    fs.copyFileSync(backupPath, CONTENT_FILE);
    console.log('♻️  Restored backup due to error');
  }
}

// Run the consolidation
consolidateEnglishContent(); 