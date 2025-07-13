#!/usr/bin/env node

/**
 * French Content Translation Script
 * 
 * This script translates content from English to French using the DeepL API.
 * It's designed to work with the current i18n structure.
 * 
 * Usage: 
 *   node scripts/translate-french-content.js [options]
 * 
 * Options:
 *   --test              Run in test mode (translate only first 3 items)
 *   --papers-only       Translate only Urantia papers
 *   --cosmic-only       Translate only Cosmic series content
 *   --help              Show help
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
  test: args.includes('--test'),
  papersOnly: args.includes('--papers-only'),
  cosmicOnly: args.includes('--cosmic-only'),
  help: args.includes('--help')
};

// Show help
if (options.help) {
  console.log(`
French Content Translation Script

Usage: node scripts/translate-french-content.js [options]

Options:
  --test              Run in test mode (translate only first 3 items)
  --papers-only       Translate only Urantia papers
  --cosmic-only       Translate only Cosmic series content
  --help              Show this help

Environment Variables:
  DEEPL_API_KEY       Your DeepL API key (required)
  `);
  process.exit(0);
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
const EN_CONTENT_DIR = path.join(__dirname, '..', 'src', 'locales', 'en', 'content');
const FR_CONTENT_DIR = path.join(__dirname, '..', 'src', 'locales', 'fr', 'content');

// Translation statistics
let stats = {
  totalStrings: 0,
  translatedStrings: 0,
  totalCharacters: 0,
  errors: []
};

async function translateText(text, context = '') {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return text;
  }

  try {
    const result = await translator.translateText(
      text,
      'en',
      'fr',
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

async function translateObject(obj, context = '') {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      stats.totalStrings++;
      console.log(`  📝 Translating ${key} (${stats.translatedStrings + 1}/${stats.totalStrings})`);
      result[key] = await translateText(value, context);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = await translateObject(value, context);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

async function translateUrantiaPapers() {
  console.log('\n📖 Translating Urantia Papers...');
  
  const sourcePath = path.join(EN_CONTENT_DIR, 'urantia-papers.json');
  const targetPath = path.join(FR_CONTENT_DIR, 'urantia-papers.json');
  
  try {
    const sourceContent = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    
    // In test mode, only translate first 3 papers
    let papersToTranslate = sourceContent;
    if (options.test) {
      const firstThreeKeys = Object.keys(sourceContent).slice(0, 3);
      papersToTranslate = {};
      firstThreeKeys.forEach(key => {
        papersToTranslate[key] = sourceContent[key];
      });
      console.log(`  🧪 TEST MODE: Translating only ${firstThreeKeys.length} papers`);
    }
    
    const translatedContent = {};
    
    for (const [paperId, paperData] of Object.entries(papersToTranslate)) {
      console.log(`\n  📄 Processing ${paperId}...`);
      
      translatedContent[paperId] = {
        title: await translateText(paperData.title, 'Urantia Book paper title'),
        episode_card: await translateText(paperData.episode_card, 'Short description for podcast episode card'),
        episode_page: await translateText(paperData.episode_page, 'Detailed description for podcast episode page')
      };
    }
    
    // Write translated content
    fs.writeFileSync(targetPath, JSON.stringify(translatedContent, null, 2) + '\n', 'utf8');
    console.log(`  ✅ Saved ${Object.keys(translatedContent).length} papers to ${targetPath}`);
    
  } catch (error) {
    console.error(`  ❌ Failed to translate Urantia papers: ${error.message}`);
    throw error;
  }
}

async function translateCosmicSeries() {
  console.log('\n🌌 Translating Cosmic Series content...');
  
  const sourcePath = path.join(EN_CONTENT_DIR, 'content.json');
  const targetPath = path.join(FR_CONTENT_DIR, 'content.json');
  
  try {
    const sourceContent = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    
    // Filter only cosmic series (cosmic-1 through cosmic-14)
    const cosmicSeries = {};
    Object.keys(sourceContent).forEach(key => {
      if (key.startsWith('cosmic-')) {
        cosmicSeries[key] = sourceContent[key];
      }
    });
    
    // In test mode, only translate first series
    let seriesToTranslate = cosmicSeries;
    if (options.test) {
      const firstKey = Object.keys(cosmicSeries)[0];
      seriesToTranslate = { [firstKey]: cosmicSeries[firstKey] };
      console.log(`  🧪 TEST MODE: Translating only ${firstKey}`);
    }
    
    const translatedContent = {};
    
    for (const [seriesId, seriesData] of Object.entries(seriesToTranslate)) {
      console.log(`\n  🎧 Processing ${seriesId}...`);
      
      translatedContent[seriesId] = {
        seriesTitle: await translateText(seriesData.seriesTitle, 'Podcast series title'),
        seriesDescription: await translateText(seriesData.seriesDescription, 'Podcast series description'),
        episodes: {}
      };
      
      // Translate each episode
      for (const [episodeId, episodeData] of Object.entries(seriesData.episodes)) {
        console.log(`    📼 Episode ${episodeId}...`);
        
        translatedContent[seriesId].episodes[episodeId] = {
          title: await translateText(episodeData.title, 'Episode title'),
          logline: await translateText(episodeData.logline, 'Episode short description'),
          episodeCard: episodeData.episodeCard, // Keep empty strings as-is
          summary: episodeData.summary // Keep empty strings as-is
        };
      }
    }
    
    // Read existing French content to preserve Jesus series (English only)
    let existingContent = {};
    if (fs.existsSync(targetPath)) {
      existingContent = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    }
    
    // Merge with existing content (preserving non-cosmic series)
    const finalContent = { ...existingContent, ...translatedContent };
    
    // Write translated content
    fs.writeFileSync(targetPath, JSON.stringify(finalContent, null, 2) + '\n', 'utf8');
    console.log(`  ✅ Saved ${Object.keys(translatedContent).length} series to ${targetPath}`);
    
  } catch (error) {
    console.error(`  ❌ Failed to translate Cosmic series: ${error.message}`);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting French content translation with DeepL API...\n');
  console.log(`📊 API Key: ${authKey.substring(0, 8)}...`);
  console.log(`🌍 Target Language: French (FR)`);
  console.log(`🎯 Mode: ${options.test ? 'TEST' : 'FULL'}`);
  
  try {
    // Check API usage first
    const usage = await translator.getUsage();
    if (usage.character.limit !== null) {
      const percentUsed = (usage.character.count / usage.character.limit) * 100;
      console.log(`\n💰 DeepL API Usage: ${usage.character.count.toLocaleString()} / ${usage.character.limit.toLocaleString()} characters (${percentUsed.toFixed(1)}%)`);
      
      if (percentUsed > 90) {
        console.warn('⚠️  Warning: API usage is above 90%!');
      }
    }
    
    const startTime = Date.now();
    
    // Translate based on options
    if (options.papersOnly) {
      await translateUrantiaPapers();
    } else if (options.cosmicOnly) {
      await translateCosmicSeries();
    } else {
      // Translate both
      await translateUrantiaPapers();
      await translateCosmicSeries();
    }
    
    // Final statistics
    const duration = Math.round((Date.now() - startTime) / 1000);
    const estimatedCost = (stats.totalCharacters / 1000000) * 20; // ~$20 per million chars
    
    console.log('\n✅ French content translation completed successfully!');
    console.log('\n📊 Statistics:');
    console.log(`   • Total strings translated: ${stats.translatedStrings}`);
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
    console.log('1. Review the translated files in src/locales/fr/content/');
    console.log('2. Test the French content by switching language in the app');
    console.log('3. Run npm run lint && npm run build to ensure everything works');
    
  } catch (error) {
    console.error('\n💥 Translation failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);