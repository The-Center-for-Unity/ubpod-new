#!/usr/bin/env node

/**
 * Unified Content Translation Script
 * 
 * This script translates content for new languages using DeepL API.
 * It works with the consolidated content.json structure used by the i18n system.
 * 
 * Usage: 
 *   node scripts/translate-content-unified.js --target=<lang> [options]
 * 
 * Options:
 *   --target <lang>     Target language (es|fr|pt|de|it) - required
 *   --test              Run in test mode (translate only first 3 items)
 *   --urantia-only      Translate only Urantia papers
 *   --cosmic-only       Translate only Cosmic series
 *   --help              Show help
 * 
 * Examples:
 *   node scripts/translate-content-unified.js --target=pt --test
 *   node scripts/translate-content-unified.js --target=pt --urantia-only
 *   node scripts/translate-content-unified.js --target=pt
 */

import fs from 'fs';
import path from 'path';
import { Translator } from 'deepl-node';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  target: null,
  test: args.includes('--test'),
  urantiaOnly: args.includes('--urantia-only'),
  cosmicOnly: args.includes('--cosmic-only'),
  help: args.includes('--help')
};

// Parse target language
const targetIndex = args.findIndex(arg => arg.startsWith('--target'));
if (targetIndex !== -1) {
  const targetArg = args[targetIndex];
  if (targetArg.includes('=')) {
    options.target = targetArg.split('=')[1];
  } else if (args[targetIndex + 1]) {
    options.target = args[targetIndex + 1];
  }
}

// Show help
if (options.help || !options.target) {
  console.log(`
Unified Content Translation Script

This script translates content for new languages using the consolidated
content.json structure. It preserves the exact format expected by the application.

Usage: node scripts/translate-content-unified.js --target=<lang> [options]

Options:
  --target <lang>     Target language code (required)
                      Supported: es, fr, pt, de, it, nl, pl, ru, ja, zh
  --test              Run in test mode (translate only first 3 items)
  --urantia-only      Translate only Urantia papers
  --cosmic-only       Translate only Cosmic series
  --help              Show this help

Examples:
  node scripts/translate-content-unified.js --target=pt --test
  node scripts/translate-content-unified.js --target=pt --urantia-only
  node scripts/translate-content-unified.js --target=pt

Notes:
- Jesus series content remains in English for all languages
- Requires DEEPL_API_KEY environment variable
- Creates backup of existing files before modifying
  `);
  process.exit(options.help ? 0 : 1);
}

// Validate target language
const SUPPORTED_LANGUAGES = ['es', 'fr', 'pt', 'de', 'it', 'nl', 'pl', 'ru', 'ja', 'zh'];
if (!SUPPORTED_LANGUAGES.includes(options.target)) {
  console.error(`❌ Error: Unsupported target language '${options.target}'`);
  console.error(`   Supported languages: ${SUPPORTED_LANGUAGES.join(', ')}`);
  process.exit(1);
}

// Check for API key
const authKey = process.env.DEEPL_API_KEY;
if (!authKey) {
  console.error('❌ Error: DEEPL_API_KEY environment variable is required');
  console.error('   Set it with: export DEEPL_API_KEY="your-api-key-here"');
  process.exit(1);
}

// Initialize DeepL translator
const translator = new Translator(authKey);

// Paths
const EN_CONTENT_PATH = path.join(__dirname, '..', 'src', 'locales', 'en', 'content', 'content.json');
const TARGET_LOCALE_DIR = path.join(__dirname, '..', 'src', 'locales', options.target);
const TARGET_CONTENT_DIR = path.join(TARGET_LOCALE_DIR, 'content');
const TARGET_CONTENT_PATH = path.join(TARGET_CONTENT_DIR, 'content.json');

// Translation statistics
let stats = {
  totalSeries: 0,
  translatedSeries: 0,
  totalEpisodes: 0,
  translatedEpisodes: 0,
  totalStrings: 0,
  translatedStrings: 0,
  totalCharacters: 0,
  errors: []
};

// Create directories if they don't exist
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

// Backup existing file
function backupFile(filePath) {
  if (fs.existsSync(filePath)) {
    const backupPath = filePath + '.backup-' + new Date().toISOString().replace(/[:.]/g, '-');
    fs.copyFileSync(filePath, backupPath);
    console.log(`✅ Backed up existing file to ${path.basename(backupPath)}`);
    return backupPath;
  }
  return null;
}

// Translate text with rate limiting
async function translateText(text, context = '') {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return text;
  }

  try {
    const result = await translator.translateText(
      text,
      'en',
      options.target.toUpperCase(),
      {
        formality: 'default',
        preserveFormatting: true,
        context: context
      }
    );
    
    stats.translatedStrings++;
    stats.totalCharacters += text.length;
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return result.text;
  } catch (error) {
    console.error(`  ⚠️  Failed to translate: ${error.message}`);
    stats.errors.push({ text: text.substring(0, 50), error: error.message });
    return text; // Keep original on error
  }
}

// Translate episode data
async function translateEpisode(episode, seriesId, episodeId) {
  console.log(`      📝 Episode ${episodeId}`);
  stats.totalStrings += 4; // title, logline, episodeCard, summary
  
  return {
    title: await translateText(episode.title, `Episode title for ${seriesId}`),
    logline: await translateText(episode.logline, `Episode short description`),
    episodeCard: await translateText(episode.episodeCard || episode.logline, `Episode card description`),
    summary: await translateText(episode.summary, `Episode detailed summary`)
  };
}

// Translate series data
async function translateSeries(seriesData, seriesId) {
  console.log(`\n  🎧 Translating ${seriesId}...`);
  stats.totalSeries++;
  stats.totalStrings += 2; // seriesTitle, seriesDescription
  
  const translatedSeries = {
    seriesTitle: await translateText(seriesData.seriesTitle, `Series title for ${seriesId}`),
    seriesDescription: await translateText(seriesData.seriesDescription, `Series description`),
    episodes: {}
  };
  
  // Translate episodes
  const episodeIds = Object.keys(seriesData.episodes);
  const episodesToTranslate = options.test ? episodeIds.slice(0, 3) : episodeIds;
  
  for (const episodeId of episodesToTranslate) {
    stats.totalEpisodes++;
    translatedSeries.episodes[episodeId] = await translateEpisode(
      seriesData.episodes[episodeId],
      seriesId,
      episodeId
    );
    stats.translatedEpisodes++;
  }
  
  stats.translatedSeries++;
  return translatedSeries;
}

async function main() {
  console.log(`🚀 Starting ${options.target.toUpperCase()} content translation with DeepL API...\n`);
  console.log(`📊 API Key: ${authKey.substring(0, 8)}...`);
  console.log(`🌍 Target Language: ${options.target.toUpperCase()}`);
  console.log(`🎯 Mode: ${options.test ? 'TEST' : 'FULL'}`);
  
  try {
    // Check API usage
    const usage = await translator.getUsage();
    if (usage.character.limit !== null) {
      const percentUsed = (usage.character.count / usage.character.limit) * 100;
      console.log(`\n💰 DeepL API Usage: ${usage.character.count.toLocaleString()} / ${usage.character.limit.toLocaleString()} characters (${percentUsed.toFixed(1)}%)`);
      
      if (percentUsed > 90) {
        console.warn('⚠️  Warning: API usage is above 90%!');
      }
    }
    
    // Read English content
    console.log('\n📖 Reading English content...');
    const enContent = JSON.parse(fs.readFileSync(EN_CONTENT_PATH, 'utf8'));
    
    // Ensure target directories exist
    ensureDirectoryExists(TARGET_LOCALE_DIR);
    ensureDirectoryExists(TARGET_CONTENT_DIR);
    
    // Backup existing file if it exists
    backupFile(TARGET_CONTENT_PATH);
    
    // Determine which series to translate
    let seriesToTranslate = [];
    
    if (options.urantiaOnly) {
      seriesToTranslate = ['urantia-papers'];
    } else if (options.cosmicOnly) {
      seriesToTranslate = Object.keys(enContent).filter(key => key.startsWith('cosmic-'));
    } else {
      // Translate urantia-papers and cosmic series, keep Jesus series in English
      seriesToTranslate = Object.keys(enContent).filter(key => 
        key === 'urantia-papers' || key.startsWith('cosmic-')
      );
    }
    
    console.log(`\n📋 Series to translate: ${seriesToTranslate.length}`);
    
    // Start with existing content or empty object
    let targetContent = {};
    if (fs.existsSync(TARGET_CONTENT_PATH)) {
      targetContent = JSON.parse(fs.readFileSync(TARGET_CONTENT_PATH, 'utf8'));
    }
    
    // Copy Jesus series as-is (English)
    Object.keys(enContent).forEach(key => {
      if (key.startsWith('jesus-')) {
        targetContent[key] = enContent[key];
      }
    });
    
    // Translate selected series
    const startTime = Date.now();
    
    for (const seriesId of seriesToTranslate) {
      targetContent[seriesId] = await translateSeries(enContent[seriesId], seriesId);
    }
    
    // Write translated content
    console.log('\n💾 Writing translated content...');
    fs.writeFileSync(TARGET_CONTENT_PATH, JSON.stringify(targetContent, null, 2) + '\n', 'utf8');
    
    // Final statistics
    const duration = Math.round((Date.now() - startTime) / 1000);
    const estimatedCost = (stats.totalCharacters / 1000000) * 20; // ~$20 per million chars
    
    console.log(`\n✅ ${options.target.toUpperCase()} content translation completed successfully!`);
    console.log('\n📊 Statistics:');
    console.log(`   • Series translated: ${stats.translatedSeries}/${stats.totalSeries}`);
    console.log(`   • Episodes translated: ${stats.translatedEpisodes}/${stats.totalEpisodes}`);
    console.log(`   • Strings translated: ${stats.translatedStrings}/${stats.totalStrings}`);
    console.log(`   • Total characters: ${stats.totalCharacters.toLocaleString()}`);
    console.log(`   • Estimated cost: $${estimatedCost.toFixed(2)} USD`);
    console.log(`   • Total time: ${duration} seconds`);
    console.log(`   • Errors: ${stats.errors.length}`);
    
    if (stats.errors.length > 0) {
      console.log('\n❌ Translation errors:');
      stats.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. "${error.text}..." - ${error.error}`);
      });
    }
    
    console.log('\n📝 Next steps:');
    console.log(`1. Copy the UI translation files from another language (e.g., cp -r src/locales/en/*.json src/locales/${options.target}/)`);
    console.log(`2. Translate UI files using the translate-ui.js script`);
    console.log(`3. Test the ${options.target.toUpperCase()} content by switching language in the app`);
    console.log('4. Upload audio files for the new language using the appropriate script');
    
  } catch (error) {
    console.error('\n💥 Translation failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);