#!/usr/bin/env node

/**
 * Fix French Terminology Script
 * 
 * This script fixes French translation terminology issues identified during testing:
 * - Replace "papier", "document", "L'article" with "Fascicule"
 * - Change "Avant-propos" to "Introduction"
 * - Fix other terminology inconsistencies
 * 
 * Usage: node scripts/fix-french-terminology.js [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const isDryRun = process.argv.includes('--dry-run');

// Paths to French locale files
const FR_LOCALE_DIR = path.join(__dirname, '..', 'src', 'locales', 'fr');
const FR_CONTENT_DIR = path.join(FR_LOCALE_DIR, 'content');

// Files to process
const filesToProcess = [
  // UI files
  'common.json',
  'contact.json',
  'debug.json',
  'disclaimer.json',
  'episode.json',
  'home.json',
  'series-collections.json',
  'series-detail.json',
  'series-page.json',
  'series.json',
  // Content files
  'content/content.json',
  'content/series-metadata.json'
];

// Terminology replacements
const replacements = [
  // Paper terminology
  { pattern: /\bpapiers?\b/gi, replacement: 'fascicules', context: 'paper -> fascicule' },
  { pattern: /\bPapiers?\b/gi, replacement: 'Fascicules', context: 'Paper -> Fascicule' },
  { pattern: /\bdocuments?\b/gi, replacement: 'fascicules', context: 'document -> fascicule', checkContext: true },
  { pattern: /\bDocuments?\b/gi, replacement: 'Fascicules', context: 'Document -> Fascicule', checkContext: true },
  { pattern: /\bL'article\b/gi, replacement: 'Fascicule', context: "L'article -> Fascicule" },
  { pattern: /\bLe papier\b/gi, replacement: 'Le fascicule', context: 'Le papier -> Le fascicule' },
  { pattern: /\bau papier\b/gi, replacement: 'au fascicule', context: 'au papier -> au fascicule' },
  { pattern: /\bde papier\b/gi, replacement: 'de fascicule', context: 'de papier -> de fascicule' },
  { pattern: /\bdu papier\b/gi, replacement: 'du fascicule', context: 'du papier -> du fascicule' },
  
  // Foreword -> Introduction
  { pattern: /\bAvant-propos\b/g, replacement: 'Introduction', context: 'Avant-propos -> Introduction' },
  { pattern: /\bavant-propos\b/g, replacement: 'introduction', context: 'avant-propos -> introduction' },
  
  // Back to Papers
  { pattern: /\bRetour à Papiers\b/gi, replacement: 'Retour aux Fascicules', context: 'Retour à Papiers -> Retour aux Fascicules' },
  { pattern: /\bRetour aux papiers\b/gi, replacement: 'Retour aux fascicules', context: 'Retour aux papiers -> Retour aux fascicules' },
  
  // Template variables (should not be translated)
  { pattern: /{{titre}}/g, replacement: '{{title}}', context: '{{titre}} -> {{title}}' },
  { pattern: /{{nom}}/g, replacement: '{{name}}', context: '{{nom}} -> {{name}}' },
  { pattern: /{{série}}/g, replacement: '{{series}}', context: '{{série}} -> {{series}}' },
];

// Context-aware replacements (only replace if it's about Urantia papers)
const contextKeywords = ['urantia', 'fascicule', 'épisode', 'podcast'];

function shouldReplaceInContext(text, replacement) {
  if (!replacement.checkContext) return true;
  
  // Check if the text contains any context keywords
  const lowerText = text.toLowerCase();
  return contextKeywords.some(keyword => lowerText.includes(keyword));
}

// Backup file
function backupFile(filePath) {
  if (fs.existsSync(filePath) && !isDryRun) {
    const backupPath = filePath + '.backup-' + new Date().toISOString().replace(/[:.]/g, '-');
    fs.copyFileSync(filePath, backupPath);
    console.log(`  ✅ Backed up to ${path.basename(backupPath)}`);
    return backupPath;
  }
  return null;
}

// Process a single JSON file
function processJsonFile(filePath) {
  console.log(`\n📄 Processing ${path.relative(FR_LOCALE_DIR, filePath)}...`);
  
  if (!fs.existsSync(filePath)) {
    console.log('  ⚠️  File not found, skipping');
    return { found: 0, replaced: 0 };
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  let jsonData;
  
  try {
    jsonData = JSON.parse(content);
  } catch (error) {
    console.error(`  ❌ Failed to parse JSON: ${error.message}`);
    return { found: 0, replaced: 0 };
  }
  
  // Backup the file
  if (!isDryRun) {
    backupFile(filePath);
  }
  
  let stats = { found: 0, replaced: 0 };
  
  // Process the JSON object
  function processObject(obj, path = '') {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        let newValue = value;
        let hasChanges = false;
        
        for (const replacement of replacements) {
          if (replacement.pattern.test(value)) {
            if (shouldReplaceInContext(value, replacement)) {
              const matches = value.match(replacement.pattern);
              if (matches) {
                stats.found += matches.length;
                if (!isDryRun) {
                  newValue = newValue.replace(replacement.pattern, replacement.replacement);
                  hasChanges = true;
                  stats.replaced += matches.length;
                }
                console.log(`  🔍 Found "${matches[0]}" at ${path}.${key}`);
                console.log(`     → Will replace with "${replacement.replacement}" (${replacement.context})`);
              }
            }
          }
        }
        
        if (hasChanges) {
          obj[key] = newValue;
        }
      } else if (typeof value === 'object' && value !== null) {
        processObject(value, path ? `${path}.${key}` : key);
      }
    }
  }
  
  processObject(jsonData);
  
  // Write the updated content
  if (!isDryRun && stats.replaced > 0) {
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2) + '\n', 'utf8');
    console.log(`  💾 Saved with ${stats.replaced} replacements`);
  }
  
  return stats;
}

// Main function
function main() {
  console.log('🚀 French Terminology Fix Script');
  console.log(`📊 Mode: ${isDryRun ? 'DRY RUN (no changes will be made)' : 'LIVE (files will be modified)'}`);
  console.log(`📁 Directory: ${FR_LOCALE_DIR}\n`);
  
  let totalStats = { found: 0, replaced: 0, filesProcessed: 0, filesModified: 0 };
  
  for (const file of filesToProcess) {
    const filePath = path.join(FR_LOCALE_DIR, file);
    const stats = processJsonFile(filePath);
    
    totalStats.found += stats.found;
    totalStats.replaced += stats.replaced;
    totalStats.filesProcessed++;
    
    if (stats.replaced > 0) {
      totalStats.filesModified++;
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   • Files processed: ${totalStats.filesProcessed}`);
  console.log(`   • Files modified: ${totalStats.filesModified}`);
  console.log(`   • Terms found: ${totalStats.found}`);
  console.log(`   • Terms replaced: ${totalStats.replaced}`);
  
  if (isDryRun) {
    console.log('\n⚠️  This was a dry run. No files were modified.');
    console.log('   Run without --dry-run to apply changes.');
  } else if (totalStats.replaced > 0) {
    console.log('\n✅ Terminology fixes applied successfully!');
    console.log('   Backup files created for all modified files.');
  } else {
    console.log('\n✅ No terminology issues found.');
  }
  
  // Next steps
  console.log('\n📝 Next steps:');
  console.log('1. Review the changes in the application');
  console.log('2. Test that all French pages display correctly');
  console.log('3. Check for any template variable issues');
  console.log('4. If everything looks good, remove backup files');
}

// Run the script
main();