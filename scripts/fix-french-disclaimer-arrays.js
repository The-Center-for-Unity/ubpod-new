#!/usr/bin/env node

/**
 * Fix French Disclaimer Arrays Script
 * 
 * Converts object-style arrays ({"0": "...", "1": "..."}) to proper arrays
 * in the French disclaimer.json file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DISCLAIMER_PATH = path.join(__dirname, '..', 'src', 'locales', 'fr', 'disclaimer.json');

// Backup file
function backupFile(filePath) {
  const backupPath = filePath + '.backup-' + new Date().toISOString().replace(/[:.]/g, '-');
  fs.copyFileSync(filePath, backupPath);
  console.log(`✅ Backed up to ${path.basename(backupPath)}`);
  return backupPath;
}

// Convert object with numeric keys to array
function objectToArray(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  // Check if it's an object with numeric keys (0, 1, 2, etc.)
  const keys = Object.keys(obj);
  const isNumericObject = keys.every(key => /^\d+$/.test(key));
  
  if (isNumericObject && keys.length > 0) {
    // Convert to array
    const maxIndex = Math.max(...keys.map(k => parseInt(k)));
    const array = new Array(maxIndex + 1);
    
    keys.forEach(key => {
      array[parseInt(key)] = obj[key];
    });
    
    return array;
  }
  
  // Recursively process nested objects
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = objectToArray(value);
  }
  
  return result;
}

function main() {
  console.log('🚀 Fixing French disclaimer array structure...\n');
  
  try {
    // Read the file
    console.log('📖 Reading disclaimer.json...');
    const content = fs.readFileSync(DISCLAIMER_PATH, 'utf8');
    const data = JSON.parse(content);
    
    // Backup the file
    backupFile(DISCLAIMER_PATH);
    
    // Convert object-style arrays to proper arrays
    console.log('🔄 Converting object arrays to proper arrays...');
    const fixed = objectToArray(data);
    
    // Count conversions
    let conversions = 0;
    
    // Check specific paths that should be arrays
    const arrayPaths = [
      'sections.copyright.items',
      'sections.aiContent.limitations',
      'sections.technical.issues',
      'sections.responsibility.restrictions'
    ];
    
    arrayPaths.forEach(path => {
      const parts = path.split('.');
      let current = fixed;
      for (const part of parts) {
        if (current && current[part]) {
          current = current[part];
        }
      }
      if (Array.isArray(current)) {
        console.log(`  ✅ ${path} is now an array with ${current.length} items`);
        conversions++;
      }
    });
    
    // Write the fixed content
    console.log('\n💾 Writing fixed disclaimer.json...');
    fs.writeFileSync(DISCLAIMER_PATH, JSON.stringify(fixed, null, 2) + '\n', 'utf8');
    
    console.log(`\n✅ Successfully fixed ${conversions} object arrays!`);
    console.log('\n📝 Next steps:');
    console.log('1. Test the disclaimer page at /fr/disclaimer');
    console.log('2. Verify all content displays correctly');
    console.log('3. If everything works, remove the backup file');
    
  } catch (error) {
    console.error('\n💥 Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();