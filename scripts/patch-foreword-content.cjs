const fs = require('fs');
const path = require('path');

console.log('Patching content.json files to add missing Foreword...\n');

const LANGUAGES = ['en', 'es'];
const BACKUP_DIR = 'src/locales/backup/2025-06-22';
const CONTENT_DIR = 'src/locales';

function patchContentFile(language) {
  console.log(`--- Processing ${language.toUpperCase()} ---`);
  
  // Paths
  const contentFilePath = path.join(CONTENT_DIR, language, 'content/content.json');
  const backupUrantiaPath = path.join(BACKUP_DIR, language, 'content/urantia-papers.json');

  // 1. Read the necessary files
  if (!fs.existsSync(contentFilePath) || !fs.existsSync(backupUrantiaPath)) {
    console.error(`❌ ERROR: Necessary files not found for ${language}.`);
    return;
  }
  
  const content = JSON.parse(fs.readFileSync(contentFilePath, 'utf8'));
  const backupUrantiaPapers = JSON.parse(fs.readFileSync(backupUrantiaPath, 'utf8'));

  // 2. Get the Foreword data from the backup
  const forewordData = backupUrantiaPapers['paper_0'];

  if (!forewordData) {
    console.error(`❌ ERROR: Foreword (paper_0) not found in backup file for ${language}.`);
    return;
  }
  
  console.log('✅ Found Foreword data in backup.');

  // 3. Check if Foreword is already in content.json
  const urantiaPapersContent = content['urantia-papers'];
  if (urantiaPapersContent && urantiaPapersContent.episodes['0']) {
    console.log('👍 Foreword already exists in content.json. No patch needed.');
    return;
  }

  // 4. Prepare the new episode object
  const newEpisodeContent = {
    title: forewordData.title,
    logline: forewordData.episode_card || forewordData.episode_page || '', // Use episode_card as logline
    episodeCard: forewordData.episode_card || '',
    summary: forewordData.episode_page || ''
  };

  // 5. Add the Foreword to the content file
  if (urantiaPapersContent) {
    urantiaPapersContent.episodes['0'] = newEpisodeContent;
    console.log('✅ Patched Foreword into existing "urantia-papers" series.');
  } else {
    console.error('❌ ERROR: "urantia-papers" series not found in content.json.');
    return;
  }

  // 6. Write the updated file
  fs.writeFileSync(contentFilePath, JSON.stringify(content, null, 2));
  console.log(`✅ Successfully saved updated ${language}/content/content.json.\n`);
}

// Run the patch for both languages
LANGUAGES.forEach(patchContentFile);

console.log('🎉 Patching process completed!'); 