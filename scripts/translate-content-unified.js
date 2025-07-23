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

// Create logs directory if it doesn't exist
const LOGS_DIR = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// Logger class for console and file output
class Logger {
  constructor(target) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.logFile = path.join(LOGS_DIR, `translate-${target}-${timestamp}.log`);
    this.startTime = Date.now();
    
    // Initialize log file
    this.writeToFile(`=== Translation Log Started ===`);
    this.writeToFile(`Target Language: ${target.toUpperCase()}`);
    this.writeToFile(`Start Time: ${new Date().toISOString()}`);
    this.writeToFile(`Log File: ${this.logFile}`);
    this.writeToFile(''.padEnd(50, '='));
  }
  
  writeToFile(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(this.logFile, logEntry, 'utf8');
  }
  
  log(message, writeToFile = true) {
    console.log(message);
    if (writeToFile) {
      this.writeToFile(message);
    }
  }
  
  info(message) {
    this.log(`ℹ️  ${message}`);
  }
  
  success(message) {
    this.log(`✅ ${message}`);
  }
  
  warn(message) {
    this.log(`⚠️  ${message}`);
  }
  
  error(message) {
    this.log(`❌ ${message}`);
  }
  
  progress(current, total, item) {
    const percent = Math.round((current / total) * 100);
    const message = `📊 Progress: ${current}/${total} (${percent}%) - ${item}`;
    this.log(message);
  }
  
  stats(statsObj) {
    this.log('\n📊 Translation Statistics:');
    Object.entries(statsObj).forEach(([key, value]) => {
      if (typeof value === 'number') {
        this.log(`   • ${key}: ${value.toLocaleString()}`);
      } else if (Array.isArray(value)) {
        this.log(`   • ${key}: ${value.length}`);
      } else {
        this.log(`   • ${key}: ${value}`);
      }
    });
  }
  
  finalize(finalStats) {
    const duration = Math.round((Date.now() - this.startTime) / 1000);
    const estimatedCost = (finalStats.totalCharacters / 1000000) * 20;
    
    this.log('\n' + ''.padEnd(50, '='));
    this.log('🎉 Translation Completed Successfully!');
    this.log('\n📊 Final Statistics:');
    this.log(`   • Duration: ${duration} seconds`);
    this.log(`   • Series translated: ${finalStats.translatedSeries}/${finalStats.totalSeries}`);
    this.log(`   • Episodes translated: ${finalStats.translatedEpisodes}/${finalStats.totalEpisodes}`);
    this.log(`   • Strings translated: ${finalStats.translatedStrings}/${finalStats.totalStrings}`);
    this.log(`   • Total characters: ${finalStats.totalCharacters.toLocaleString()}`);
    this.log(`   • Estimated cost: $${estimatedCost.toFixed(2)} USD`);
    this.log(`   • Errors: ${finalStats.errors.length}`);
    
    if (finalStats.errors.length > 0) {
      this.log('\n❌ Translation Errors:');
      finalStats.errors.forEach((error, index) => {
        this.log(`   ${index + 1}. "${error.text}..." - ${error.error}`);
      });
    }
    
    this.log('\n' + ''.padEnd(50, '='));
    this.log(`End Time: ${new Date().toISOString()}`);
    this.log(`Log File: ${this.logFile}`);
    this.writeToFile('=== Translation Log Ended ===');
  }
}

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
- Translates ALL content including Jesus, Cosmic, and Urantia series
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
    // Directory creation will be logged by caller
  }
}

// Backup existing file
function backupFile(filePath) {
  if (fs.existsSync(filePath)) {
    const backupPath = filePath + '.backup-' + new Date().toISOString().replace(/[:.]/g, '-');
    fs.copyFileSync(filePath, backupPath);
    // Backup creation will be logged by caller
    return backupPath;
  }
  return null;
}

// Translate text with rate limiting
async function translateText(text, context = '') {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return text;
  }

  // DeepL specific fix for Portuguese
  let deeplTargetLang = options.target.toUpperCase();
  if (deeplTargetLang === 'PT') {
    deeplTargetLang = 'PT-BR';
  }

  try {
    const result = await translator.translateText(
      text,
      'en',
      deeplTargetLang,
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
    // Add error to stats for later logging
    stats.errors.push({ text: text.substring(0, 50), error: error.message });
    return text; // Keep original on error
  }
}

// Translate episode data
async function translateEpisode(episode, seriesId, episodeId, logger) {
  stats.totalStrings += 4; // title, logline, episodeCard, summary
  
  // Log the translation details for debugging  
  logger.writeToFile(`        Translating episode ${seriesId}/${episodeId}: ${episode.title?.substring(0, 50)}...`);
  
  return {
    title: await translateText(episode.title, `Episode title for ${seriesId}`),
    logline: await translateText(episode.logline, `Episode short description`),
    episodeCard: await translateText(episode.episodeCard || episode.logline, `Episode card description`),
    summary: await translateText(episode.summary, `Episode detailed summary`)
  };
}

// Translate series data
async function translateSeries(seriesData, seriesId, logger) {
  logger.log(`\n  🎧 Translating ${seriesId}...`);
  stats.totalSeries++;
  stats.totalStrings += 2; // seriesTitle, seriesDescription
  
  logger.info(`Translating series title and description for ${seriesId}`);
  const translatedSeries = {
    seriesTitle: await translateText(seriesData.seriesTitle, `Series title for ${seriesId}`),
    seriesDescription: await translateText(seriesData.seriesDescription, `Series description`),
    episodes: {}
  };
  
  // Translate episodes
  const episodeIds = Object.keys(seriesData.episodes);
  const episodesToTranslate = options.test ? episodeIds.slice(0, 3) : episodeIds;
  
  logger.info(`Processing ${episodesToTranslate.length} episodes for ${seriesId}`);
  
  for (let i = 0; i < episodesToTranslate.length; i++) {
    const episodeId = episodesToTranslate[i];
    logger.log(`      📝 Episode ${episodeId}`);
    stats.totalEpisodes++;
    translatedSeries.episodes[episodeId] = await translateEpisode(
      seriesData.episodes[episodeId],
      seriesId,
      episodeId,
      logger
    );
    stats.translatedEpisodes++;
  }
  
  stats.translatedSeries++;
  logger.success(`Completed ${seriesId}: ${episodesToTranslate.length} episodes translated`);
  return translatedSeries;
}

async function main() {
  // Initialize logger
  const logger = new Logger(options.target);
  
  logger.log(`🚀 Starting ${options.target.toUpperCase()} content translation with DeepL API...\n`);
  logger.log(`📊 API Key: ${authKey.substring(0, 8)}...`);
  logger.log(`🌍 Target Language: ${options.target.toUpperCase()}`);
  if (options.target.toLowerCase() === 'pt') {
    logger.log(`   (Using PT-BR for DeepL translation)`);
  }
  logger.log(`🎯 Mode: ${options.test ? 'TEST' : 'FULL'}`);
  
  try {
    // Check API usage
    logger.info('Checking DeepL API usage...');
    const usage = await translator.getUsage();
    if (usage.character.limit !== null) {
      const percentUsed = (usage.character.count / usage.character.limit) * 100;
      logger.log(`\n💰 DeepL API Usage: ${usage.character.count.toLocaleString()} / ${usage.character.limit.toLocaleString()} characters (${percentUsed.toFixed(1)}%)`);
      
      if (percentUsed > 90) {
        logger.warn('API usage is above 90%!');
      }
    } else {
      logger.info('API usage: unlimited plan detected');
    }
    
    // Read English content
    logger.log('\n📖 Reading English content...');
    const enContent = JSON.parse(fs.readFileSync(EN_CONTENT_PATH, 'utf8'));
    logger.success(`Loaded English content with ${Object.keys(enContent).length} series`);
    
    // Ensure target directories exist
    logger.info('Ensuring target directories exist...');
    ensureDirectoryExists(TARGET_LOCALE_DIR);
    ensureDirectoryExists(TARGET_CONTENT_DIR);
    
    // Backup existing file if it exists
    logger.info('Creating backup of existing content...');
    const backupPath = backupFile(TARGET_CONTENT_PATH);
    if (backupPath) {
      logger.success(`Created backup: ${path.basename(backupPath)}`);
    }
    
    // Determine which series to translate
    let seriesToTranslate = [];
    
    if (options.urantiaOnly) {
      seriesToTranslate = ['urantia-papers'];
    } else if (options.cosmicOnly) {
      seriesToTranslate = Object.keys(enContent).filter(key => key.startsWith('cosmic-'));
    } else {
      // Translate ALL content including Jesus series
      seriesToTranslate = Object.keys(enContent);
    }
    
    logger.log(`\n📋 Series to translate: ${seriesToTranslate.length}`);
    logger.info(`Series list: ${seriesToTranslate.join(', ')}`);
    
    // Start with existing content or empty object
    let targetContent = {};
    if (fs.existsSync(TARGET_CONTENT_PATH)) {
      targetContent = JSON.parse(fs.readFileSync(TARGET_CONTENT_PATH, 'utf8'));
      logger.info('Loaded existing target content for merging');
    } else {
      logger.info('Creating new target content from scratch');
    }
    
    // Translate selected series
    logger.log('\n🔄 Starting translation process...');
    const translationStartTime = Date.now();
    
    for (let i = 0; i < seriesToTranslate.length; i++) {
      const seriesId = seriesToTranslate[i];
      logger.progress(i + 1, seriesToTranslate.length, `Starting ${seriesId}`);
      targetContent[seriesId] = await translateSeries(enContent[seriesId], seriesId, logger);
      logger.success(`Completed ${seriesId}`);
    }
    
    // Write translated content
    logger.log('\n💾 Writing translated content...');
    fs.writeFileSync(TARGET_CONTENT_PATH, JSON.stringify(targetContent, null, 2) + '\n', 'utf8');
    logger.success(`Saved translated content to: ${TARGET_CONTENT_PATH}`);
    
    // Use logger to finalize and show final statistics
    logger.finalize(stats);
    
    logger.log('\n📝 Next steps:');
    logger.log(`1. Copy the UI translation files from another language (e.g., cp -r src/locales/en/*.json src/locales/${options.target}/)`);
    logger.log(`2. Translate UI files using the translate-ui.js script`);
    logger.log(`3. Test the ${options.target.toUpperCase()} content by switching language in the app`);
    logger.log('4. Upload audio files for the new language using the appropriate script');
    
  } catch (error) {
    logger.error('Translation failed: ' + error.message);
    logger.writeToFile('Stack trace: ' + error.stack);
    logger.writeToFile('=== Translation Log Ended with Error ===');
    console.error('\n💥 Translation failed:', error.message);
    console.error(`📄 Check log file for details: ${logger.logFile}`);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);