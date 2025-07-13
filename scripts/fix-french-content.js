#!/usr/bin/env node

/**
 * Fix French Content Script
 * 
 * This script merges the translated urantia-papers content from the separate
 * urantia-papers.json file into the main content.json file.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const FR_CONTENT_DIR = path.join(__dirname, '..', 'src', 'locales', 'fr', 'content');
const URANTIA_PAPERS_PATH = path.join(FR_CONTENT_DIR, 'urantia-papers.json');
const CONTENT_PATH = path.join(FR_CONTENT_DIR, 'content.json');

// Backup the original file
function backupFile(filePath) {
  const backupPath = filePath + '.backup-' + new Date().toISOString().replace(/[:.]/g, '-');
  fs.copyFileSync(filePath, backupPath);
  console.log(`✅ Backed up ${path.basename(filePath)} to ${path.basename(backupPath)}`);
  return backupPath;
}

function main() {
  console.log('🚀 Fixing French content structure...\n');

  try {
    // Read the translated urantia-papers content
    console.log('📖 Reading translated urantia-papers content...');
    const urantiaPapersContent = JSON.parse(fs.readFileSync(URANTIA_PAPERS_PATH, 'utf8'));
    
    // Read the main content file
    console.log('📖 Reading main content.json file...');
    const contentData = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf8'));
    
    // Backup the original content.json
    const backupPath = backupFile(CONTENT_PATH);
    
    // Transform urantia-papers content to match content.json structure
    console.log('\n🔄 Transforming urantia-papers content...');
    
    // First, ensure we have the urantia-papers series structure
    if (!contentData['urantia-papers']) {
      contentData['urantia-papers'] = {
        seriesTitle: "Le podcast des fascicules d'Urantia",
        seriesDescription: "Profitez d'un voyage narratif à travers le Livre d'Urantia, un fascicule à la fois.",
        episodes: {}
      };
    } else {
      // Update series title and description to French
      contentData['urantia-papers'].seriesTitle = "Le podcast des fascicules d'Urantia";
      contentData['urantia-papers'].seriesDescription = "Profitez d'un voyage narratif à travers le Livre d'Urantia, un fascicule à la fois.";
    }
    
    // Transform each paper
    let paperCount = 0;
    for (const [paperId, paperData] of Object.entries(urantiaPapersContent)) {
      // Extract episode number from paper_X format
      const episodeNum = paperId === 'paper_0' ? '0' : paperId.replace('paper_', '');
      
      // Create episode entry in content.json format
      contentData['urantia-papers'].episodes[episodeNum] = {
        title: paperData.title,
        logline: paperData.episode_card,
        episodeCard: paperData.episode_card,
        summary: paperData.episode_page
      };
      
      paperCount++;
    }
    
    console.log(`✅ Transformed ${paperCount} papers`);
    
    // Write the updated content.json
    console.log('\n💾 Writing updated content.json...');
    fs.writeFileSync(CONTENT_PATH, JSON.stringify(contentData, null, 2) + '\n', 'utf8');
    
    console.log('✅ Successfully merged urantia-papers translations into content.json');
    
    // Show summary
    console.log('\n📊 Summary:');
    console.log(`   • Papers translated: ${paperCount}`);
    console.log(`   • Cosmic series: ${Object.keys(contentData).filter(k => k.startsWith('cosmic-')).length}`);
    console.log(`   • Jesus series (English): ${Object.keys(contentData).filter(k => k.startsWith('jesus-')).length}`);
    console.log(`   • Backup saved to: ${path.basename(backupPath)}`);
    
    console.log('\n📝 Next steps:');
    console.log('1. Test the French content in the application');
    console.log('2. If everything works, you can delete the separate urantia-papers.json file');
    console.log('3. Update the translation scripts to work with the consolidated structure');
    
  } catch (error) {
    console.error('\n💥 Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();