#!/usr/bin/env node

/**
 * Fix French Menu and Footer Script
 * 
 * This script:
 * 1. Shortens menu items to be more concise
 * 2. Keeps "The Center for Unity" in English in the footer
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMMON_PATH = path.join(__dirname, '..', 'src', 'locales', 'fr', 'common.json');

// Backup file
function backupFile(filePath) {
  const backupPath = filePath + '.backup-' + new Date().toISOString().replace(/[:.]/g, '-');
  fs.copyFileSync(filePath, backupPath);
  console.log(`✅ Backed up to ${path.basename(backupPath)}`);
  return backupPath;
}

function main() {
  console.log('🚀 Fixing French menu and footer text...\n');
  
  try {
    // Read the file
    console.log('📖 Reading common.json...');
    const content = fs.readFileSync(COMMON_PATH, 'utf8');
    const data = JSON.parse(content);
    
    // Backup the file
    backupFile(COMMON_PATH);
    
    // Update menu items to be shorter
    console.log('\n🔄 Updating menu items...');
    
    const menuUpdates = {
      'nav.urantia_papers': 'Les Fascicules d\'Urantia', // Keep as is - it's already good
      'nav.series_collections': 'Collections', // Shorter
      'nav.disclaimer': 'Avertissement', // Much shorter than "Clause de non-responsabilité"
      'nav.pay_it_forward': 'Contribuer' // Much shorter than "Payer pour faire avancer les choses"
    };
    
    // Apply menu updates
    for (const [path, newValue] of Object.entries(menuUpdates)) {
      const parts = path.split('.');
      let current = data;
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      const oldValue = current[parts[parts.length - 1]];
      current[parts[parts.length - 1]] = newValue;
      console.log(`  📝 ${path}: "${oldValue}" → "${newValue}"`);
    }
    
    // Update footer to keep "The Center for Unity" in English
    console.log('\n🔄 Updating footer...');
    const oldCopyright = data.footer.copyright;
    data.footer.copyright = '© {{year}} The Center for Unity. Tous droits réservés.';
    console.log(`  📝 footer.copyright: "${oldCopyright}" → "${data.footer.copyright}"`);
    
    const oldCenterName = data.footer.external_links.center_for_unity;
    data.footer.external_links.center_for_unity = 'The Center for Unity';
    console.log(`  📝 footer.external_links.center_for_unity: "${oldCenterName}" → "${data.footer.external_links.center_for_unity}"`);
    
    // Write the updated content
    console.log('\n💾 Writing updated common.json...');
    fs.writeFileSync(COMMON_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
    
    console.log('\n✅ Successfully updated French menu and footer!');
    console.log('\n📊 Summary of changes:');
    console.log('  • Menu items shortened for better display');
    console.log('  • "The Center for Unity" kept in English (matching Spanish)');
    console.log('\n📝 Next steps:');
    console.log('1. Test the menu display in the application');
    console.log('2. Verify footer shows "The Center for Unity" in English');
    console.log('3. If everything looks good, remove the backup file');
    
  } catch (error) {
    console.error('\n💥 Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();