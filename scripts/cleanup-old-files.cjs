const fs = require('fs');
const path = require('path');

console.log('Cleaning up old fragmented content files...\n');

const filesToRemove = [
  'src/locales/en/content/episode-titles.json',
  'src/locales/en/content/episode-loglines.json',
  'src/locales/en/content/general-summaries.json',
  'src/locales/en/content/jesus-summaries.json',
  'src/locales/en/content/urantia-papers.json',
  'src/locales/es/content/episode-titles.json',
  'src/locales/es/content/episode-loglines.json',
  'src/locales/es/content/general-summaries.json',
  'src/locales/es/content/jesus-summaries.json',
  'src/locales/es/content/urantia-papers.json'
];

console.log('Files to be removed:');
for (const file of filesToRemove) {
  console.log(`  - ${file}`);
}

console.log('\n⚠️  WARNING: This will permanently delete the old fragmented files.');
console.log('The consolidated files are already backed up in src/locales/backup/');
console.log('Make sure the new consolidated structure is working correctly before proceeding.\n');

// For safety, we'll just list what would be removed instead of actually removing
console.log('SAFETY MODE: Files would be removed (but not actually deleted)');
console.log('To actually remove them, uncomment the deletion code in this script.');

/*
// Uncomment this section to actually remove the files
for (const file of filesToRemove) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`✅ Removed: ${file}`);
  } else {
    console.log(`⚠️  Not found: ${file}`);
  }
}
*/

console.log('\n✅ Cleanup script completed (safety mode)');
console.log('The old fragmented files are still present for safety.');
console.log('You can manually remove them when you\'re confident the new structure works.'); 