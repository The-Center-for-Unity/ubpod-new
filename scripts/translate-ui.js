#!/usr/bin/env node

/**
 * DeepL UI Translation Script
 * 
 * This script translates UI components from English to French
 * using the DeepL API.
 * 
 * Usage: 
 *   node scripts/translate-ui.js
 */

import fs from 'fs';
import path from 'path';
import { Translator } from 'deepl-node';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check for API key
const authKey = process.env.DEEPL_API_KEY;
if (!authKey) {
  console.error('❌ Error: DEEPL_API_KEY environment variable is required');
  console.error('   Set it with: export DEEPL_API_KEY="your-api-key-here"');
  process.exit(1);
}

// Initialize DeepL translator
const translator = new Translator(authKey);

// UI files to translate (excluding content files)
const UI_FILES = [
  'common.json',
  'contact.json',
  'debug.json',
  'disclaimer.json',
  'episode.json',
  'home.json',
  'series-collections.json',
  'series-detail.json',
  'series-page.json',
  'series.json'
];

async function translateObject(obj, sourceLang = 'en', targetLang = 'fr') {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      try {
        // Skip if already in target language or empty
        if (!value || value.trim() === '') {
          result[key] = value;
          continue;
        }
        
        // Translate the string
        const translation = await translator.translateText(
          value,
          sourceLang,
          targetLang,
          { preserveFormatting: true }
        );
        result[key] = translation.text;
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`  ⚠️  Failed to translate "${key}": ${error.message}`);
        result[key] = value; // Keep original on error
      }
    } else if (typeof value === 'object' && value !== null) {
      // Recursively translate nested objects
      result[key] = await translateObject(value, sourceLang, targetLang);
    } else {
      // Keep non-string values as-is
      result[key] = value;
    }
  }
  
  return result;
}

async function translateUIFile(filename) {
  console.log(`\n📄 Translating ${filename}...`);
  
  const sourcePath = path.join(__dirname, '..', 'src', 'locales', 'en', filename);
  const targetPath = path.join(__dirname, '..', 'src', 'locales', 'fr', filename);
  
  try {
    // Read English source file
    const sourceContent = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    
    // Translate the content
    const translatedContent = await translateObject(sourceContent);
    
    // Write to French locale
    fs.writeFileSync(targetPath, JSON.stringify(translatedContent, null, 2) + '\n', 'utf8');
    
    console.log(`  ✅ Successfully translated ${filename}`);
  } catch (error) {
    console.error(`  ❌ Failed to translate ${filename}: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 Starting French UI translation with DeepL API...\n');
  console.log(`📊 API Key: ${authKey.substring(0, 8)}...`);
  console.log(`🌍 Target Language: French (FR)`);
  console.log(`📋 Files to translate: ${UI_FILES.length}`);
  
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
    
    // Translate each UI file
    for (const file of UI_FILES) {
      await translateUIFile(file);
    }
    
    console.log('\n✅ French UI translation completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Review the translated files in src/locales/fr/');
    console.log('2. Test the French UI by switching language in the app');
    console.log('3. Run content translation with: npm run translate:fr');
    
  } catch (error) {
    console.error('\n💥 Translation failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);