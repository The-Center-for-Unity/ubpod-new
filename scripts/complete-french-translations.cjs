const fs = require('fs');
const path = require('path');

// DeepL configuration
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = 'https://api.deepl.com/v2/translate';

// File paths
const ENGLISH_CONTENT = path.join(__dirname, '../src/locales/en/content/content.json');
const FRENCH_CONTENT = path.join(__dirname, '../src/locales/fr/content/content.json');

function createTimestampedBackup(filePath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${filePath}.backup-${timestamp}`;
  fs.copyFileSync(filePath, backupPath);
  console.log(`✅ Created backup: ${path.basename(backupPath)}`);
  return backupPath;
}

async function translateWithDeepL(text, targetLang = 'FR') {
  if (!DEEPL_API_KEY) {
    throw new Error('DEEPL_API_KEY environment variable is required');
  }

  if (!text || text.trim() === '') {
    return text;
  }

  try {
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: text,
        target_lang: targetLang,
        source_lang: 'EN'
      })
    });

    if (!response.ok) {
      throw new Error(`DeepL API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error(`❌ Translation error for text: "${text.substring(0, 50)}..."`, error.message);
    return text; // Return original text if translation fails
  }
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isEnglishContent(text) {
  if (!text || typeof text !== 'string') return false;
  
  // Check for common English words that wouldn't appear in French
  const englishIndicators = [
    'Jesus was', 'Joseph and Mary', 'Understanding Jesus', 'When Jesus',
    'the', 'and', 'was', 'that', 'with', 'for', 'they', 'have', 'this',
    'from', 'were', 'been', 'their', 'said', 'each', 'which', 'what'
  ];
  
  const lowercaseText = text.toLowerCase();
  const englishMatches = englishIndicators.filter(indicator => 
    lowercaseText.includes(indicator.toLowerCase())
  ).length;
  
  // If more than 3 English indicators found, likely English content
  return englishMatches >= 3;
}

async function completeFrenchTranslations() {
  console.log('🚀 Starting French Jesus and Cosmic series translations...');

  // Load content files
  const englishContent = JSON.parse(fs.readFileSync(ENGLISH_CONTENT, 'utf8'));
  const frenchContent = JSON.parse(fs.readFileSync(FRENCH_CONTENT, 'utf8'));

  // Create backup
  createTimestampedBackup(FRENCH_CONTENT);

  let translationCount = 0;
  let seriesProcessed = 0;

  // Process Jesus series (jesus-1 through jesus-14) and Cosmic series (cosmic-1 through cosmic-14)
  const allSeries = [];
  for (let i = 1; i <= 14; i++) {
    allSeries.push(`jesus-${i}`);
    allSeries.push(`cosmic-${i}`);
  }

  for (const seriesId of allSeries) {
    
    if (!englishContent[seriesId] || !frenchContent[seriesId]) {
      console.log(`⚠️  Skipping ${seriesId} - not found in both files`);
      continue;
    }

    console.log(`\n📖 Processing ${seriesId}...`);
    
    const englishSeries = englishContent[seriesId];
    const frenchSeries = frenchContent[seriesId];

    // Process episodes
    for (const episodeId in englishSeries.episodes) {
      const englishEpisode = englishSeries.episodes[episodeId];
      const frenchEpisode = frenchSeries.episodes[episodeId];

      if (!frenchEpisode) {
        console.log(`⚠️  Episode ${episodeId} not found in French`);
        continue;
      }

      let needsTranslation = false;

      // Check if episodeCard needs translation (empty or English content)
      if (!frenchEpisode.episodeCard || frenchEpisode.episodeCard.trim() === '' || 
          isEnglishContent(frenchEpisode.episodeCard)) {
        console.log(`  📝 Translating episodeCard for episode ${episodeId}...`);
        frenchEpisode.episodeCard = await translateWithDeepL(englishEpisode.episodeCard, 'FR');
        needsTranslation = true;
        await delay(100); // Rate limiting
      }

      // Check if summary needs translation (empty or English content)
      if (!frenchEpisode.summary || frenchEpisode.summary.trim() === '' || 
          isEnglishContent(frenchEpisode.summary)) {
        console.log(`  📝 Translating summary for episode ${episodeId}...`);
        frenchEpisode.summary = await translateWithDeepL(englishEpisode.summary, 'FR');
        needsTranslation = true;
        await delay(100); // Rate limiting
      }

      if (needsTranslation) {
        translationCount++;
      }
    }

    seriesProcessed++;
  }

  // Save updated content
  fs.writeFileSync(FRENCH_CONTENT, JSON.stringify(frenchContent, null, 2), 'utf8');

  console.log('\n🎉 French Jesus and Cosmic series translation completed!');
  console.log(`📊 Results:`);
  console.log(`   • Series processed: ${seriesProcessed}`);
  console.log(`   • Episodes translated: ${translationCount}`);
  console.log(`   • File updated: ${FRENCH_CONTENT}`);
}

// Check for DeepL API key and run
if (!DEEPL_API_KEY) {
  console.error('❌ Error: DEEPL_API_KEY environment variable is required');
  console.log('Please set your DeepL API key:');
  console.log('export DEEPL_API_KEY="your-api-key-here"');
  process.exit(1);
}

completeFrenchTranslations().catch(error => {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
}); 