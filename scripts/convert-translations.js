#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔄 Converting i18n translations to legacy format...');

// Read our new translation format
const urantiaTranslations = JSON.parse(
  fs.readFileSync('public/locales/es/content/urantia-papers.json', 'utf8')
);

// Convert to legacy array format
const legacyFormat = [];

// Process each paper
for (const [key, value] of Object.entries(urantiaTranslations)) {
  const paperNumber = parseInt(key.replace('paper_', ''));
  
  legacyFormat.push({
    paper_number: paperNumber,
    title: value.title,
    filename: paperNumber === 0 ? 'foreword.pdf' : `paper-${paperNumber}.pdf`,
    episode_card: value.episode_card,
    episode_page: value.episode_page
  });
}

// Sort by paper number
legacyFormat.sort((a, b) => a.paper_number - b.paper_number);

// Write to the expected location
const outputPath = 'src/data/json/urantia_summaries_es.json';
fs.writeFileSync(outputPath, JSON.stringify(legacyFormat, null, 2), 'utf8');

console.log(`✅ Converted ${legacyFormat.length} papers to legacy format`);
console.log(`📁 Saved to: ${outputPath}`);
console.log(`📊 File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)}KB`); 