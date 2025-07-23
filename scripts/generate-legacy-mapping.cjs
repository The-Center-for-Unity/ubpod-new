const fs = require('fs');
const path = require('path');

// File paths
const SPANISH_JESUS_SUMMARIES = path.join(__dirname, '../legacy-bkp/es/jesus-summaries.json');
const SPANISH_GENERAL_SUMMARIES = path.join(__dirname, '../legacy-bkp/es/general-summaries.json');
const ENGLISH_CONTENT_FILE = path.join(__dirname, '../src/locales/en/content/content.json');

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

function generateLegacyMapping() {
  console.log('🔍 Analyzing legacy content structure...\n');
  
  // Load files
  const englishContent = loadJsonFile(ENGLISH_CONTENT_FILE);
  const jesusLegacyContent = loadJsonFile(SPANISH_JESUS_SUMMARIES);
  const generalLegacyContent = loadJsonFile(SPANISH_GENERAL_SUMMARIES);
  
  if (!englishContent || !jesusLegacyContent) {
    console.error('❌ Failed to load required files');
    return;
  }
  
  // Extract all episode titles from current English content for matching
  const currentEpisodes = {};
  
  for (const [seriesId, seriesData] of Object.entries(englishContent)) {
    if (seriesData.episodes) {
      for (const [episodeId, episode] of Object.entries(seriesData.episodes)) {
        const normalizedTitle = episode.title.toLowerCase().trim();
        currentEpisodes[normalizedTitle] = {
          seriesId,
          episodeId,
          originalTitle: episode.title
        };
      }
    }
  }
  
  console.log(`📊 Found ${Object.keys(currentEpisodes).length} current episodes`);
  console.log(`📊 Found ${Object.keys(jesusLegacyContent).length} Jesus legacy entries`);
  if (generalLegacyContent) {
    console.log(`📊 Found ${Object.keys(generalLegacyContent).length} general legacy entries`);
  }
  
  // Analyze legacy content
  const legacyTopics = {};
  const unmatchedLegacy = [];
  
  // Process Jesus legacy content
  for (const [legacyKey, legacyData] of Object.entries(jesusLegacyContent)) {
    legacyTopics[legacyKey] = {
      source: 'jesus-summaries',
      hasShortSummary: !!legacyData.shortSummary,
      hasFullSummary: !!legacyData.fullSummary,
      shortSummaryLength: legacyData.shortSummary ? legacyData.shortSummary.length : 0,
      fullSummaryLength: legacyData.fullSummary ? legacyData.fullSummary.length : 0
    };
  }
  
  // Process general legacy content
  if (generalLegacyContent) {
    for (const [legacyKey, legacyData] of Object.entries(generalLegacyContent)) {
      if (!legacyTopics[legacyKey]) {
        legacyTopics[legacyKey] = {
          source: 'general-summaries',
          hasTitle: !!legacyData.title,
          hasShortSummary: !!legacyData.shortSummary,
          hasFullSummary: !!legacyData.fullSummary,
          title: legacyData.title || '',
          shortSummaryLength: legacyData.shortSummary ? legacyData.shortSummary.length : 0,
          fullSummaryLength: legacyData.fullSummary ? legacyData.fullSummary.length : 0
        };
      }
    }
  }
  
  // Create comprehensive mapping based on topic patterns and titles
  const mapping = {};
  const mappingStatistics = {
    mapped: 0,
    unmapped: 0,
    bySource: {},
    bySeries: {}
  };
  
  for (const [legacyKey, legacyData] of Object.entries(legacyTopics)) {
    let foundMatch = null;
    
    // Extract meaningful parts from legacy key
    const cleanKey = legacyKey.replace(/^(topic|event)\//, '').replace(/-/g, ' ');
    
    // Try exact title matching first
    if (legacyData.title) {
      const normalizedLegacyTitle = legacyData.title.toLowerCase().trim();
      if (currentEpisodes[normalizedLegacyTitle]) {
        foundMatch = currentEpisodes[normalizedLegacyTitle];
      }
    }
    
    // Try key-based matching if no title match
    if (!foundMatch) {
      // Look for partial matches in current episode titles
      for (const [currentTitle, episodeInfo] of Object.entries(currentEpisodes)) {
        if (currentTitle.includes(cleanKey) || cleanKey.includes(currentTitle.split(' ').slice(0, 3).join(' '))) {
          foundMatch = episodeInfo;
          break;
        }
      }
    }
    
    if (foundMatch) {
      mapping[legacyKey] = {
        seriesId: foundMatch.seriesId,
        episodeId: foundMatch.episodeId,
        currentTitle: foundMatch.originalTitle,
        source: legacyData.source,
        confidence: legacyData.title ? 'high' : 'medium'
      };
      
      mappingStatistics.mapped++;
      mappingStatistics.bySource[legacyData.source] = (mappingStatistics.bySource[legacyData.source] || 0) + 1;
      mappingStatistics.bySeries[foundMatch.seriesId] = (mappingStatistics.bySeries[foundMatch.seriesId] || 0) + 1;
    } else {
      unmatchedLegacy.push({
        key: legacyKey,
        cleanKey,
        title: legacyData.title || '',
        source: legacyData.source
      });
      mappingStatistics.unmapped++;
    }
  }
  
  console.log(`\n✅ Mapping Results:`);
  console.log(`📊 Mapped: ${mappingStatistics.mapped} entries`);
  console.log(`📊 Unmapped: ${mappingStatistics.unmapped} entries`);
  console.log(`\n📈 By Source:`);
  for (const [source, count] of Object.entries(mappingStatistics.bySource)) {
    console.log(`   ${source}: ${count} entries`);
  }
  console.log(`\n📈 By Series:`);
  for (const [series, count] of Object.entries(mappingStatistics.bySeries)) {
    console.log(`   ${series}: ${count} entries`);
  }
  
  // Save mapping file
  const mappingPath = path.join(__dirname, 'legacy-content-mapping.json');
  const mappingData = {
    metadata: {
      generated: new Date().toISOString(),
      statistics: mappingStatistics,
      description: "Mapping from legacy content keys to current series/episode structure"
    },
    mapping,
    unmapped: unmatchedLegacy
  };
  
  saveJsonFile(mappingPath, mappingData);
  
  // Generate manual mapping template for unmapped items
  if (unmatchedLegacy.length > 0) {
    console.log(`\n⚠️  ${unmatchedLegacy.length} unmapped entries need manual review:`);
    
    const manualMappingTemplate = {
      metadata: {
        description: "Manual mapping template for unmapped legacy content",
        instructions: "For each unmapped entry, add the correct seriesId and episodeId"
      },
      unmapped: {}
    };
    
    unmatchedLegacy.forEach(item => {
      console.log(`   📝 ${item.key} (${item.title || item.cleanKey})`);
      manualMappingTemplate.unmapped[item.key] = {
        title: item.title,
        cleanKey: item.cleanKey,
        source: item.source,
        suggestedMapping: {
          seriesId: "UPDATE_THIS",
          episodeId: "UPDATE_THIS",
          notes: "Manual mapping required"
        }
      };
    });
    
    const manualPath = path.join(__dirname, 'manual-mapping-template.json');
    saveJsonFile(manualPath, manualMappingTemplate);
    console.log(`\n📋 Manual mapping template saved: ${manualPath}`);
  }
  
  console.log(`\n🎉 Legacy mapping analysis completed!`);
  console.log(`📁 Main mapping file: ${mappingPath}`);
  
  return mappingPath;
}

// Run the analysis
generateLegacyMapping(); 