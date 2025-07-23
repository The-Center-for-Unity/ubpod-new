const fs = require('fs');
const path = require('path');

// Configuration
const LANGUAGES = ['es', 'fr', 'pt'];
const EN_CONTENT_PATH = path.join(__dirname, '../src/locales/en/content/content.json');

function createTimestampedBackup(filePath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${filePath}.backup-${timestamp}`;
  fs.copyFileSync(filePath, backupPath);
  console.log(`✅ Created backup: ${path.basename(backupPath)}`);
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

function saveJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Saved: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error saving ${filePath}:`, error.message);
  }
}

function patchLanguageContent(language) {
  console.log(`\n🔧 Patching ${language.toUpperCase()} content...`);
  
  const targetContentPath = path.join(__dirname, `../src/locales/${language}/content/content.json`);
  
  // Load files
  const enContent = loadJsonFile(EN_CONTENT_PATH);
  const targetContent = loadJsonFile(targetContentPath);
  
  if (!enContent || !targetContent) {
    console.error(`❌ Failed to load required files for ${language}`);
    return { success: false };
  }
  
  // Create backup
  const backupPath = createTimestampedBackup(targetContentPath);
  
  let stats = {
    jesusSeriesPatched: 0,
    cosmicSeriesPreserved: 0,
    urantiaSeriesPreserved: 0,
    episodesPatched: 0
  };
  
  // Process each series
  for (const [seriesId, enSeriesData] of Object.entries(enContent)) {
    if (seriesId.startsWith('jesus-')) {
      // Jesus series: Copy complete English content (fills missing fields)
      console.log(`  📝 Copying Jesus series: ${seriesId}`);
      targetContent[seriesId] = JSON.parse(JSON.stringify(enSeriesData)); // Deep copy
      stats.jesusSeriesPatched++;
      stats.episodesPatched += Object.keys(enSeriesData.episodes).length;
      
    } else if (seriesId.startsWith('cosmic-')) {
      // Cosmic series: Preserve existing translations
      if (targetContent[seriesId]) {
        console.log(`  🌌 Preserving existing Cosmic series: ${seriesId}`);
        stats.cosmicSeriesPreserved++;
      } else {
        console.log(`  ⚠️  Cosmic series ${seriesId} missing in ${language} - keeping as-is`);
      }
      
    } else if (seriesId === 'urantia-papers') {
      // Urantia papers: Preserve existing translations
      if (targetContent[seriesId]) {
        console.log(`  📖 Preserving existing Urantia papers`);
        stats.urantiaSeriesPreserved++;
      } else {
        console.log(`  ⚠️  Urantia papers missing in ${language} - keeping as-is`);
      }
    }
  }
  
  // Save patched content
  saveJsonFile(targetContentPath, targetContent);
  
  console.log(`\n📊 ${language.toUpperCase()} Statistics:`);
  console.log(`   • Jesus series patched: ${stats.jesusSeriesPatched}`);
  console.log(`   • Cosmic series preserved: ${stats.cosmicSeriesPreserved}`);
  console.log(`   • Urantia papers preserved: ${stats.urantiaSeriesPreserved}`);
  console.log(`   • Episodes patched: ${stats.episodesPatched}`);
  console.log(`   • Backup: ${path.basename(backupPath)}`);
  
  return { success: true, stats };
}

function main() {
  console.log('🚀 Starting multilingual content patching...');
  console.log('🎯 Strategy: Copy Jesus series from English, preserve existing translations');
  
  // Load English content to verify
  const enContent = loadJsonFile(EN_CONTENT_PATH);
  if (!enContent) {
    console.error('❌ Failed to load English content - aborting');
    return;
  }
  
  const jesusSeriesCount = Object.keys(enContent).filter(key => key.startsWith('jesus-')).length;
  console.log(`📋 Found ${jesusSeriesCount} Jesus series in English content`);
  
  let totalResults = {
    languagesProcessed: 0,
    totalJesusSeriesPatched: 0,
    totalEpisodesPatched: 0
  };
  
  // Process each language
  for (const language of LANGUAGES) {
    const result = patchLanguageContent(language);
    if (result.success) {
      totalResults.languagesProcessed++;
      totalResults.totalJesusSeriesPatched += result.stats.jesusSeriesPatched;
      totalResults.totalEpisodesPatched += result.stats.episodesPatched;
    }
  }
  
  console.log('\n🎉 Multilingual content patching completed!');
  console.log('\n📊 Final Summary:');
  console.log(`   • Languages processed: ${totalResults.languagesProcessed}/${LANGUAGES.length}`);
  console.log(`   • Total Jesus series patched: ${totalResults.totalJesusSeriesPatched}`);
  console.log(`   • Total episodes patched: ${totalResults.totalEpisodesPatched}`);
  
  console.log('\n✅ What was accomplished:');
  console.log('   • Jesus series: Complete English content copied (fills missing episodeCard/summary)');
  console.log('   • Cosmic series: Existing translations preserved');
  console.log('   • Urantia papers: Existing translations preserved');
  console.log('   • All original files backed up with timestamps');
  
  console.log('\n📝 Next steps:');
  console.log('1. Test the app by switching languages');
  console.log('2. Verify Jesus series content appears correctly');
  console.log('3. Check that Cosmic and Urantia content is preserved');
}

// Run the script
main(); 