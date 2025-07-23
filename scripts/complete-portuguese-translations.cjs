const fs = require('fs');
const path = require('path');

// DeepL configuration
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = 'https://api.deepl.com/v2/translate';

// File paths
const ENGLISH_CONTENT = path.join(__dirname, '../src/locales/en/content/content.json');
const PORTUGUESE_CONTENT = path.join(__dirname, '../src/locales/pt/content/content.json');

function createTimestampedBackup(filePath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${filePath}.backup-${timestamp}`;
  fs.copyFileSync(filePath, backupPath);
  console.log(`✅ Created backup: ${path.basename(backupPath)}`);
  return backupPath;
}

async function translateWithDeepL(text, targetLang = 'PT-BR') {
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
  
  // Check for common English words that wouldn't appear in Portuguese
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

async function completePortugueseTranslations() {
  console.log('🚀 Starting Portuguese translations...');

  // Load content files
  const englishContent = JSON.parse(fs.readFileSync(ENGLISH_CONTENT, 'utf8'));
  const portugueseContent = JSON.parse(fs.readFileSync(PORTUGUESE_CONTENT, 'utf8'));

  // Create backup
  createTimestampedBackup(PORTUGUESE_CONTENT);

  let translationCount = 0;
  let seriesProcessed = 0;

  // Process Jesus series (jesus-1 through jesus-14) - missing episodeCard and summary
  console.log('\n📖 Processing Jesus series...');
  for (let i = 1; i <= 14; i++) {
    const seriesId = `jesus-${i}`;
    
    if (!englishContent[seriesId] || !portugueseContent[seriesId]) {
      console.log(`⚠️  Skipping ${seriesId} - not found in both files`);
      continue;
    }

    console.log(`\n📖 Processing ${seriesId}...`);
    
    const englishSeries = englishContent[seriesId];
    const portugueseSeries = portugueseContent[seriesId];

    // Process episodes
    for (const episodeId in englishSeries.episodes) {
      const englishEpisode = englishSeries.episodes[episodeId];
      const portugueseEpisode = portugueseSeries.episodes[episodeId];

      if (!portugueseEpisode) {
        console.log(`⚠️  Episode ${episodeId} not found in Portuguese`);
        continue;
      }

      let needsTranslation = false;

      // Check if episodeCard needs translation (empty or English content)
      if (!portugueseEpisode.episodeCard || portugueseEpisode.episodeCard.trim() === '' || 
          isEnglishContent(portugueseEpisode.episodeCard)) {
        console.log(`  📝 Translating Jesus episodeCard for episode ${episodeId}...`);
        portugueseEpisode.episodeCard = await translateWithDeepL(englishEpisode.episodeCard, 'PT-BR');
        needsTranslation = true;
        await delay(100); // Rate limiting
      }

      // Check if summary needs translation (empty or English content)
      if (!portugueseEpisode.summary || portugueseEpisode.summary.trim() === '' || 
          isEnglishContent(portugueseEpisode.summary)) {
        console.log(`  📝 Translating Jesus summary for episode ${episodeId}...`);
        portugueseEpisode.summary = await translateWithDeepL(englishEpisode.summary, 'PT-BR');
        needsTranslation = true;
        await delay(100); // Rate limiting
      }

      if (needsTranslation) {
        translationCount++;
      }
    }

    seriesProcessed++;
  }

  // Process Cosmic series (cosmic-1 through cosmic-14) - missing summary fields
  console.log('\n📖 Processing Cosmic series...');
  for (let i = 1; i <= 14; i++) {
    const seriesId = `cosmic-${i}`;
    
    if (!englishContent[seriesId] || !portugueseContent[seriesId]) {
      console.log(`⚠️  Skipping ${seriesId} - not found in both files`);
      continue;
    }

    console.log(`\n📖 Processing ${seriesId}...`);
    
    const englishSeries = englishContent[seriesId];
    const portugueseSeries = portugueseContent[seriesId];

    // Process episodes
    for (const episodeId in englishSeries.episodes) {
      const englishEpisode = englishSeries.episodes[episodeId];
      const portugueseEpisode = portugueseSeries.episodes[episodeId];

      if (!portugueseEpisode) {
        console.log(`⚠️  Episode ${episodeId} not found in Portuguese`);
        continue;
      }

      let needsTranslation = false;

      // Check if episodeCard needs translation (some might be missing)
      if (!portugueseEpisode.episodeCard || portugueseEpisode.episodeCard.trim() === '') {
        console.log(`  📝 Translating Cosmic episodeCard for episode ${episodeId}...`);
        portugueseEpisode.episodeCard = await translateWithDeepL(englishEpisode.episodeCard, 'PT-BR');
        needsTranslation = true;
        await delay(100); // Rate limiting
      }

      // Check if summary needs translation (empty or English content)
      if (!portugueseEpisode.summary || portugueseEpisode.summary.trim() === '' || 
          isEnglishContent(portugueseEpisode.summary)) {
        console.log(`  📝 Translating Cosmic summary for episode ${episodeId}...`);
        portugueseEpisode.summary = await translateWithDeepL(englishEpisode.summary, 'PT-BR');
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
  fs.writeFileSync(PORTUGUESE_CONTENT, JSON.stringify(portugueseContent, null, 2), 'utf8');

  console.log('\n🎉 Portuguese translations completed!');
  console.log(`📊 Results:`);
  console.log(`   • Series processed: ${seriesProcessed}`);
  console.log(`   • Episodes translated: ${translationCount}`);
  console.log(`   • File updated: ${PORTUGUESE_CONTENT}`);
}

// Check for DeepL API key and run
if (!DEEPL_API_KEY) {
  console.error('❌ Error: DEEPL_API_KEY environment variable is required');
  console.log('Please set your DeepL API key:');
  console.log('export DEEPL_API_KEY="your-api-key-here"');
  process.exit(1);
}

completePortugueseTranslations().catch(error => {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
}); 