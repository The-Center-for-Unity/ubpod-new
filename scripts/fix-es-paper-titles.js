#!/usr/bin/env node

/**
 * Fix Urantia Papers Spanish Titles
 * 
 * This script fixes an issue where many Spanish titles in urantia-papers.json
 * are incorrect (e.g., "Documento 60" instead of the actual title).
 * It replaces these with the English title as a temporary fallback.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ES_TRANSLATIONS_FILE = path.join(__dirname, '../src/locales/es/content/urantia-papers.json');
const EN_TRANSLATIONS_FILE = path.join(__dirname, '../src/locales/en/content/urantia-papers.json');

console.log('🚀 Fixing Urantia Papers Spanish titles...\n');

// Read both translation files
const esTranslations = JSON.parse(fs.readFileSync(ES_TRANSLATIONS_FILE, 'utf8'));
const enTranslations = JSON.parse(fs.readFileSync(EN_TRANSLATIONS_FILE, 'utf8'));

let titlesFixed = 0;

// Iterate through all papers in the Spanish file
for (const paperKey in esTranslations) {
  if (paperKey.startsWith('paper_')) {
    const paperNumber = paperKey.substring(6);
    const esTitle = esTranslations[paperKey].title;
    const expectedTitlePrefix = `Documento ${paperNumber}`;

    // Check if the title is incorrect
    if (esTitle === expectedTitlePrefix) {
      const enTitle = enTranslations[paperKey]?.title;
      
      if (enTitle) {
        console.log(`- Fixing ${paperKey}: "${esTitle}" -> "${enTitle}"`);
        esTranslations[paperKey].title = enTitle;
        titlesFixed++;
      } else {
        console.log(`- WARNING: No English title found for ${paperKey}`);
      }
    }
  }
}

// Write the updated Spanish translation file
if (titlesFixed > 0) {
  fs.writeFileSync(ES_TRANSLATIONS_FILE, JSON.stringify(esTranslations, null, 2));
  console.log(`\n✅ Fixed ${titlesFixed} Spanish titles.`);
  console.log(`📁 Updated: ${ES_TRANSLATIONS_FILE}`);
} else {
  console.log('\n✅ No incorrect titles found.');
}

console.log(`\n🔄 Next Steps:`);
console.log(`1. Run the dev server to verify the fix.`);
console.log(`2. The Urantia Papers page should now display correct titles for all papers.`); 