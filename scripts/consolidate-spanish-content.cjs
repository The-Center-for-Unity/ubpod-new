const fs = require('fs');
const path = require('path');

// File paths
const SPANISH_CONTENT_FILE = path.join(__dirname, '../src/locales/es/content/content.json');
const SPANISH_JESUS_SUMMARIES = path.join(__dirname, '../legacy-bkp/es/jesus-summaries.json');
const SPANISH_GENERAL_SUMMARIES = path.join(__dirname, '../legacy-bkp/es/general-summaries.json');
const ENGLISH_CONTENT_FILE = path.join(__dirname, '../src/locales/en/content/content.json');

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

function saveJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Saved: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error saving ${filePath}:`, error.message);
  }
}

function mapLegacyContentToSeries(legacyContent, seriesMapping) {
  const mappedContent = {};
  
  for (const [legacyKey, contentData] of Object.entries(legacyContent)) {
    const mapping = seriesMapping[legacyKey];
    if (mapping) {
      const { seriesId, episodeId } = mapping;
      
      if (!mappedContent[seriesId]) {
        mappedContent[seriesId] = {};
      }
      
      mappedContent[seriesId][episodeId] = {
        episodeCard: contentData.shortSummary || "",
        summary: contentData.fullSummary || ""
      };
    }
  }
  
  return mappedContent;
}

function consolidateSpanishContent() {
  console.log('🇪🇸 Starting Spanish Content Consolidation...\n');
  
  // Create backup
  createTimestampedBackup(SPANISH_CONTENT_FILE);
  
  // Load current Spanish content
  const spanishContent = loadJsonFile(SPANISH_CONTENT_FILE);
  if (!spanishContent) {
    console.error('❌ Failed to load Spanish content file');
    return;
  }
  
  // Load English content for reference structure
  const englishContent = loadJsonFile(ENGLISH_CONTENT_FILE);
  if (!englishContent) {
    console.error('❌ Failed to load English content file');
    return;
  }
  
  // Load legacy Spanish content
  const jesusLegacyContent = loadJsonFile(SPANISH_JESUS_SUMMARIES);
  const generalLegacyContent = loadJsonFile(SPANISH_GENERAL_SUMMARIES);
  
  if (!jesusLegacyContent) {
    console.error('❌ Failed to load Spanish Jesus legacy content');
    return;
  }
  
  console.log(`📊 Found ${Object.keys(jesusLegacyContent).length} Jesus legacy entries`);
  if (generalLegacyContent) {
    console.log(`📊 Found ${Object.keys(generalLegacyContent).length} general legacy entries`);
  }
  
  // Load the generated mapping file
  const mappingFile = path.join(__dirname, 'legacy-content-mapping.json');
  const mappingData = loadJsonFile(mappingFile);
  
  if (!mappingData) {
    console.error('❌ Failed to load legacy mapping file. Run generate-legacy-mapping.cjs first.');
    return;
  }
  
  const legacyMapping = {};
  for (const [legacyKey, mapping] of Object.entries(mappingData.mapping)) {
    legacyMapping[legacyKey] = {
      seriesId: mapping.seriesId,
      episodeId: mapping.episodeId
    };
  }
  
  console.log(`📊 Using ${Object.keys(legacyMapping).length} automatic mappings from legacy analysis`);
  
  // Map legacy content to series structure
  const mappedJesusContent = mapLegacyContentToSeries(jesusLegacyContent, legacyMapping);
  let mappedGeneralContent = {};
  
  if (generalLegacyContent) {
    mappedGeneralContent = mapLegacyContentToSeries(generalLegacyContent, legacyMapping);
  }
  
  // Merge mapped content
  const allMappedContent = { ...mappedJesusContent };
  
  // Merge general content (if any overlaps, general takes precedence)
  for (const [seriesId, episodes] of Object.entries(mappedGeneralContent)) {
    if (!allMappedContent[seriesId]) {
      allMappedContent[seriesId] = {};
    }
    Object.assign(allMappedContent[seriesId], episodes);
  }
  
  // Update Spanish content with migrated legacy content
  let updatedEpisodes = 0;
  let updatedSeries = 0;
  
  for (const [seriesId, episodes] of Object.entries(allMappedContent)) {
    if (spanishContent[seriesId]) {
      for (const [episodeId, content] of Object.entries(episodes)) {
        if (spanishContent[seriesId].episodes && spanishContent[seriesId].episodes[episodeId]) {
          // Update episodeCard and summary if they're currently empty
          if (!spanishContent[seriesId].episodes[episodeId].episodeCard && content.episodeCard) {
            spanishContent[seriesId].episodes[episodeId].episodeCard = content.episodeCard;
          }
          if (!spanishContent[seriesId].episodes[episodeId].summary && content.summary) {
            spanishContent[seriesId].episodes[episodeId].summary = content.summary;
          }
          updatedEpisodes++;
        }
      }
      updatedSeries++;
    }
  }
  
  console.log(`\n✅ Migration Results:`);
  console.log(`📊 Updated ${updatedEpisodes} episodes across ${updatedSeries} series`);
  
  // Identify what still needs translation
  const needsTranslation = [];
  
  for (const [seriesId, seriesData] of Object.entries(spanishContent)) {
    if (seriesData.episodes) {
      for (const [episodeId, episode] of Object.entries(seriesData.episodes)) {
        if (!episode.episodeCard || !episode.summary) {
          needsTranslation.push({
            seriesId,
            episodeId,
            title: episode.title,
            needsEpisodeCard: !episode.episodeCard,
            needsSummary: !episode.summary
          });
        }
      }
    }
  }
  
  console.log(`\n⚠️  Still Needs Translation: ${needsTranslation.length} episodes`);
  
  // Group by series for reporting
  const translationNeeds = {};
  needsTranslation.forEach(item => {
    if (!translationNeeds[item.seriesId]) {
      translationNeeds[item.seriesId] = [];
    }
    translationNeeds[item.seriesId].push(item);
  });
  
  for (const [seriesId, episodes] of Object.entries(translationNeeds)) {
    console.log(`   📝 ${seriesId}: ${episodes.length} episodes need translation`);
  }
  
  // Save updated Spanish content
  saveJsonFile(SPANISH_CONTENT_FILE, spanishContent);
  
  // Generate translation report
  const reportPath = path.join(__dirname, 'spanish-translation-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    migratedEpisodes: updatedEpisodes,
    migratedSeries: updatedSeries,
    needsTranslation: needsTranslation,
    summary: {
      totalEpisodes: needsTranslation.length,
      byCategory: translationNeeds
    }
  };
  
  saveJsonFile(reportPath, report);
  console.log(`\n📋 Translation report saved: ${reportPath}`);
  
  console.log(`\n🎉 Spanish content consolidation completed!`);
  console.log(`📁 Next step: Run DeepL translation script for remaining ${needsTranslation.length} episodes`);
}

// Run the consolidation
consolidateSpanishContent(); 