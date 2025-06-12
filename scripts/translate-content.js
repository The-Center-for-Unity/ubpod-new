#!/usr/bin/env node

/**
 * DeepL Content Translation Script
 * 
 * This script translates all user-facing content from English to Spanish
 * using the DeepL API. It processes JSON files and TypeScript arrays
 * systematically while preserving structure.
 * 
 * Usage: 
 *   node scripts/translate-content.js [options]
 * 
 * Options:
 *   --test              Run in test mode (translate only first 3 papers)
 *   --papers-only       Translate only Urantia papers
 *   --jesus-only        Translate only Jesus summaries  
 *   --limit <number>    Limit number of papers to translate (for testing)
 *   --output <dir>      Custom output directory
 *   --help              Show help
 * 
 * Examples:
 *   node scripts/translate-content.js --test
 *   node scripts/translate-content.js --papers-only --limit 5
 *   node scripts/translate-content.js --jesus-only
 * 
 * Requirements:
 * - DEEPL_API_KEY environment variable
 * - npm install deepl-node
 */

import fs from 'fs';
import path from 'path';
import { Translator } from 'deepl-node';
import { fileURLToPath } from 'url';

// ES module equivalents for __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  test: args.includes('--test'),
  papersOnly: args.includes('--papers-only'),
  jesusOnly: args.includes('--jesus-only'),
  limit: null,
  outputDir: null,
  help: args.includes('--help')
};

// Parse limit option
const limitIndex = args.indexOf('--limit');
if (limitIndex !== -1 && args[limitIndex + 1]) {
  options.limit = parseInt(args[limitIndex + 1]);
}

// Parse output directory option
const outputIndex = args.indexOf('--output');
if (outputIndex !== -1 && args[outputIndex + 1]) {
  options.outputDir = args[outputIndex + 1];
}

// Show help
if (options.help) {
  console.log(`
DeepL Content Translation Script

Usage: node scripts/translate-content.js [options]

Options:
  --test              Run in test mode (translate only first 3 papers)
  --papers-only       Translate only Urantia papers
  --jesus-only        Translate only Jesus summaries  
  --limit <number>    Limit number of papers to translate (for testing)
  --output <dir>      Custom output directory
  --help              Show this help

Examples:
  node scripts/translate-content.js --test
  node scripts/translate-content.js --papers-only --limit 5
  node scripts/translate-content.js --jesus-only

Environment Variables:
  DEEPL_API_KEY       Your DeepL API key (required)
  `);
  process.exit(0);
}

// Initialize DeepL translator
const apiKey = process.env.DEEPL_API_KEY;
if (!apiKey) {
  console.error('❌ Error: DEEPL_API_KEY environment variable is required');
  console.error('   Set it with: export DEEPL_API_KEY="your-api-key-here"');
  process.exit(1);
}

const translator = new Translator(apiKey);

// Configure output directory and logging
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const OUTPUT_DIR = options.outputDir || 'public/locales/es/content';
const LOG_DIR = 'logs/translation';
const LOG_FILE = path.join(LOG_DIR, `translation-${timestamp}.log`);

// Rate limiting configuration (optimized for DeepL API)
const BATCH_SIZE = 10; // Optimal batch size for cost efficiency
const DELAY_MS = 1000; // Delay between batches to respect rate limits
const MAX_TEXT_LENGTH = 5000; // DeepL's recommended max per request

class ContentTranslator {
  constructor() {
    this.translatedCount = 0;
    this.totalCount = 0;
    this.errors = [];
    this.totalCharacters = 0;
    this.startTime = null;
    this.logBuffer = [];
    
    // Initialize logging
    this.ensureDirectoryExists(LOG_DIR);
    this.log(`🚀 Translation session started: ${new Date().toISOString()}`);
    this.log(`📋 Options: ${JSON.stringify(options, null, 2)}`);
  }

  // Logging function that writes to both console and file
  log(message) {
    console.log(message);
    this.logBuffer.push(`${new Date().toISOString()} | ${message}`);
    
    // Write to file every 10 messages to avoid excessive I/O
    if (this.logBuffer.length % 10 === 0) {
      this.flushLogs();
    }
  }

  // Write log buffer to file
  flushLogs() {
    if (this.logBuffer.length > 0) {
      fs.appendFileSync(LOG_FILE, this.logBuffer.join('\n') + '\n', 'utf8');
      this.logBuffer = [];
    }
  }

  // Utility to delay execution
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Translate a single text string with error handling
  async translateText(text, context = '') {
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return text;
    }

    // Optimize: Split very long texts to improve accuracy
    if (text.length > MAX_TEXT_LENGTH) {
      this.log(`⚠️  Text exceeds ${MAX_TEXT_LENGTH} chars, may need splitting: "${text.substring(0, 100)}..."`);
    }

    try {
      const result = await translator.translateText(
        text, 
        'en', 
        'es',
        {
          formality: 'default',
          preserveFormatting: true,
          context: context,
          // Optimize for spiritual/theological content
          tag_handling: 'html', // Handle any HTML tags properly
          split_sentences: 'nonewlines' // Preserve paragraph structure
        }
      );
      
      this.translatedCount++;
      this.totalCharacters += text.length;
      this.log(`✓ Translated (${this.translatedCount}/${this.totalCount}): "${text.substring(0, 50)}..." [${text.length} chars]`);
      return result.text;
    } catch (error) {
      this.log(`❌ Translation failed for: "${text.substring(0, 50)}..." - ${error.message}`);
      this.errors.push({ text: text.substring(0, 100), error: error.message });
      return text; // Return original text on failure
    }
  }

  // Translate an array of texts in batches
  async translateBatch(texts, contexts = []) {
    const results = [];
    
    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      const batch = texts.slice(i, i + BATCH_SIZE);
      const batchContexts = contexts.slice(i, i + BATCH_SIZE);
      
      this.log(`\n🔄 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(texts.length / BATCH_SIZE)}`);
      
      const batchPromises = batch.map((text, index) => 
        this.translateText(text, batchContexts[index] || '')
      );
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Rate limiting delay
      if (i + BATCH_SIZE < texts.length) {
        await this.delay(DELAY_MS);
      }
    }
    
    return results;
  }

  // Count total translatable strings for progress tracking
  countTranslatableStrings(obj, keys = []) {
    let count = 0;
    if (Array.isArray(obj)) {
      obj.forEach(item => count += this.countTranslatableStrings(item, keys));
    } else if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        if (keys.length === 0 || keys.includes(key)) {
          if (typeof value === 'string' && value.trim() !== '') {
            count++;
          } else if (typeof value === 'object') {
            count += this.countTranslatableStrings(value, keys);
          }
        }
      });
    }
    return count;
  }

  // 1. Translate Urantia Papers summaries
  async translateUrantiaSummaries() {
    this.log('\n📖 Translating Urantia Papers summaries...');
    
    const sourcePath = 'src/data/json/urantia_summaries.json';
    const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    
    // Apply test/limit restrictions
    let papersToProcess = sourceData;
    if (options.test) {
      papersToProcess = sourceData.slice(0, 3);
      this.log(`🧪 TEST MODE: Processing only first 3 papers`);
    } else if (options.limit) {
      papersToProcess = sourceData.slice(0, options.limit);
      this.log(`📊 LIMIT MODE: Processing only first ${options.limit} papers`);
    }
    
    const translatedData = {};
    
    for (const paper of papersToProcess) {
      const paperKey = `paper_${paper.paper_number}`;
      
      this.log(`\n📄 Processing Paper ${paper.paper_number}: ${paper.title}`);
      
      const [titleEs, cardEs, pageEs] = await this.translateBatch([
        paper.title,
        paper.episode_card,
        paper.episode_page
      ], [
        'Urantia Book paper title',
        'Short episode description for podcast',
        'Detailed episode summary for podcast'
      ]);
      
      // I18n-compatible format: Use nested structure for easy component integration
      translatedData[paperKey] = {
        title: titleEs,
        episode_card: cardEs,
        episode_page: pageEs
      };
    }
    
    // Save translated data
    this.ensureDirectoryExists(OUTPUT_DIR);
    const outputFile = path.join(OUTPUT_DIR, 'urantia-papers.json');
    fs.writeFileSync(
      outputFile,
      JSON.stringify(translatedData, null, 2),
      'utf8'
    );
    
    this.log(`✅ Urantia Papers translation completed: ${Object.keys(translatedData).length} papers`);
    this.log(`📁 Saved to: ${outputFile}`);
  }

  // 2. Translate Jesus summaries
  async translateJesusSummaries() {
    this.log('\n✨ Translating Jesus summaries...');
    
    const sourcePath = 'src/data/discoverJesusSummaries.ts';
    const sourceContent = fs.readFileSync(sourcePath, 'utf8');
    
    // Extract the discoverJesusSummaries object using regex
    const summariesMatch = sourceContent.match(/export const discoverJesusSummaries: Record<string, DiscoverJesusSummary> = ({[\s\S]*?});/);
    if (!summariesMatch) {
      throw new Error('Could not extract discoverJesusSummaries from TypeScript file');
    }
    
    // Parse the extracted object (this is a simplified approach)
    // For production, consider using a TypeScript parser
    const summariesData = eval(`(${summariesMatch[1]})`);
    
    const translatedData = {};
    
    for (const [key, summary] of Object.entries(summariesData)) {
      this.log(`\n📝 Processing: ${key}`);
      
      const [shortEs, fullEs] = await this.translateBatch([
        summary.shortSummary,
        summary.fullSummary
      ], [
        'Short summary of Jesus episode',
        'Detailed summary of Jesus episode'
      ]);
      
      // I18n-compatible format: Match the structure expected by components
      translatedData[key] = {
        shortSummary: shortEs,
        fullSummary: fullEs
      };
    }
    
    const outputFile = path.join(OUTPUT_DIR, 'jesus-summaries.json');
    fs.writeFileSync(
      outputFile,
      JSON.stringify(translatedData, null, 2),
      'utf8'
    );
    
    this.log(`✅ Jesus summaries translation completed: ${Object.keys(translatedData).length} summaries`);
    this.log(`📁 Saved to: ${outputFile}`);
  }

  // 3. Translate general summaries
  async translateGeneralSummaries() {
    this.log('\n📚 Translating general summaries...');
    
    const sourcePath = 'src/data/json/summaries.json';
    const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    
    const translatedData = {};
    
    for (const item of sourceData) {
      this.log(`\n📄 Processing: ${item.id}`);
      
      const [titleEs, shortEs, fullEs] = await this.translateBatch([
        item.title,
        item.shortSummary,
        item.fullSummary
      ], [
        'Episode title',
        'Short episode summary',
        'Detailed episode summary'
      ]);
      
      // I18n-compatible format
      translatedData[item.id] = {
        title: titleEs,
        shortSummary: shortEs,
        fullSummary: fullEs
      };
    }
    
    const outputFile = path.join(OUTPUT_DIR, 'general-summaries.json');
    fs.writeFileSync(
      outputFile,
      JSON.stringify(translatedData, null, 2),
      'utf8'
    );
    
    this.log(`✅ General summaries translation completed: ${Object.keys(translatedData).length} summaries`);
    this.log(`📁 Saved to: ${outputFile}`);
  }

  // 4. Translate series metadata from episodes.json
  async translateSeriesMetadata() {
    this.log('\n🎙️ Translating series metadata...');
    
    const sourcePath = 'src/data/json/episodes.json';
    const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    
    const translatedData = {};
    
    for (const [seriesId, seriesData] of Object.entries(sourceData)) {
      this.log(`\n🎧 Processing series: ${seriesId}`);
      
      // Translate series metadata
      const [titleEs, descEs] = await this.translateBatch([
        seriesData.seriesTitle,
        seriesData.seriesDescription
      ], [
        'Podcast series title',
        'Podcast series description'
      ]);
      
      // Translate episode titles
      const episodeTitles = seriesData.episodes.map(ep => ep.title);
      const episodeTitlesEs = await this.translateBatch(
        episodeTitles,
        episodeTitles.map(() => 'Podcast episode title')
      );
      
      // I18n-compatible format: Nested structure for easy lookup
      translatedData[seriesId] = {
        seriesTitle: titleEs,
        seriesDescription: descEs,
        episodes: seriesData.episodes.map((episode, index) => ({
          id: episode.id,
          title: episodeTitlesEs[index]
        }))
      };
    }
    
    const outputFile = path.join(OUTPUT_DIR, 'series-metadata.json');
    fs.writeFileSync(
      outputFile,
      JSON.stringify(translatedData, null, 2),
      'utf8'
    );
    
    this.log(`✅ Series metadata translation completed: ${Object.keys(translatedData).length} series`);
    this.log(`📁 Saved to: ${outputFile}`);
  }

  // 5. Translate episode titles and loglines from TypeScript arrays
  async translateEpisodeArrays() {
    this.log('\n🎯 Translating episode titles and loglines...');
    
    const sourcePath = 'src/utils/episodeUtils.ts';
    const sourceContent = fs.readFileSync(sourcePath, 'utf8');
    
    // Extract seriesEpisodeTitles and seriesEpisodeLoglines
    const titlesMatch = sourceContent.match(/const seriesEpisodeTitles: Record<string, string\[\]> = ({[\s\S]*?});/);
    const loglinesMatch = sourceContent.match(/const seriesEpisodeLoglines: Record<string, string\[\]> = ({[\s\S]*?});/);
    
    if (!titlesMatch || !loglinesMatch) {
      throw new Error('Could not extract episode arrays from TypeScript file');
    }
    
    const titlesData = eval(`(${titlesMatch[1]})`);
    const loglinesData = eval(`(${loglinesMatch[1]})`);
    
    // Translate titles
    const translatedTitles = {};
    for (const [seriesId, titles] of Object.entries(titlesData)) {
      this.log(`\n📋 Processing titles for: ${seriesId}`);
      const titlesEs = await this.translateBatch(
        titles,
        titles.map(() => 'Episode title')
      );
      translatedTitles[seriesId] = titlesEs;
    }
    
    // Translate loglines
    const translatedLoglines = {};
    for (const [seriesId, loglines] of Object.entries(loglinesData)) {
      this.log(`\n📝 Processing loglines for: ${seriesId}`);
      const loglinesEs = await this.translateBatch(
        loglines,
        loglines.map(() => 'Episode short description')
      );
      translatedLoglines[seriesId] = loglinesEs;
    }
    
    // Save in i18n-compatible format
    const titlesFile = path.join(OUTPUT_DIR, 'episode-titles.json');
    const loglinesFile = path.join(OUTPUT_DIR, 'episode-loglines.json');
    
    fs.writeFileSync(titlesFile, JSON.stringify(translatedTitles, null, 2), 'utf8');
    fs.writeFileSync(loglinesFile, JSON.stringify(translatedLoglines, null, 2), 'utf8');
    
    this.log(`✅ Episode arrays translation completed`);
    this.log(`📁 Titles saved to: ${titlesFile}`);
    this.log(`📁 Loglines saved to: ${loglinesFile}`);
  }

  // Utility to ensure directory exists
  ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Pre-count all content for progress tracking
  async countAllContent() {
    let totalCount = 0;
    
    // Count based on mode
    if (options.test) {
      // TEST MODE: Only count 3 Urantia papers
      const urantiaData = JSON.parse(fs.readFileSync('src/data/json/urantia_summaries.json', 'utf8'));
      const testPapers = urantiaData.slice(0, 3);
      totalCount += this.countTranslatableStrings(testPapers, ['title', 'episode_card', 'episode_page']);
    } else if (options.papersOnly || (!options.jesusOnly && !options.papersOnly)) {
      const urantiaData = JSON.parse(fs.readFileSync('src/data/json/urantia_summaries.json', 'utf8'));
      let papersToCount = urantiaData;
      
      if (options.limit) {
        papersToCount = urantiaData.slice(0, options.limit);
      }
      
      totalCount += this.countTranslatableStrings(papersToCount, ['title', 'episode_card', 'episode_page']);
      
      if (!options.papersOnly) {
        // Count general summaries
        const generalData = JSON.parse(fs.readFileSync('src/data/json/summaries.json', 'utf8'));
        totalCount += this.countTranslatableStrings(generalData, ['title', 'shortSummary', 'fullSummary']);
        
        // Count series metadata
        const episodesData = JSON.parse(fs.readFileSync('src/data/json/episodes.json', 'utf8'));
        totalCount += this.countTranslatableStrings(episodesData, ['seriesTitle', 'seriesDescription', 'title']);
        
        // Count Jesus summaries (approximate - requires parsing TS file)
        totalCount += 150; // Estimated based on file size
        
        // Count episode arrays (approximate)
        totalCount += 280; // Estimated: 28 series × ~10 items each
      }
    } else if (options.jesusOnly) {
      // Count general summaries
      const generalData = JSON.parse(fs.readFileSync('src/data/json/summaries.json', 'utf8'));
      totalCount += this.countTranslatableStrings(generalData, ['title', 'shortSummary', 'fullSummary']);
      
      // Count series metadata
      const episodesData = JSON.parse(fs.readFileSync('src/data/json/episodes.json', 'utf8'));
      totalCount += this.countTranslatableStrings(episodesData, ['seriesTitle', 'seriesDescription', 'title']);
      
      // Count Jesus summaries (approximate - requires parsing TS file)
      totalCount += 150; // Estimated based on file size
      
      // Count episode arrays (approximate)
      totalCount += 280; // Estimated: 28 series × ~10 items each
    }
    
    this.totalCount = totalCount;
    return totalCount;
  }

  // Main execution method
  async run() {
    this.startTime = Date.now();
    
    this.log('🚀 Starting content translation with DeepL API...\n');
    this.log(`📊 API Key: ${apiKey.substring(0, 8)}...`);
    this.log(`🎯 Mode: ${options.test ? 'TEST' : options.papersOnly ? 'PAPERS ONLY' : options.jesusOnly ? 'JESUS ONLY' : 'FULL'}`);
    
    try {
      // First pass: count all translatable strings
      this.log('📋 Counting translatable content...');
      await this.countAllContent();
      this.log(`📈 Total strings to translate: ${this.totalCount}`);
      
      // Reset counter for actual translation
      this.translatedCount = 0;
      
      // Execute translations based on mode
      if (options.test) {
        // TEST MODE: Only translate 3 Urantia papers
        this.log('🧪 TEST MODE: Translating only first 3 Urantia papers');
        await this.translateUrantiaSummaries();
      } else if (options.papersOnly || (!options.jesusOnly && !options.papersOnly)) {
        await this.translateUrantiaSummaries();
        
        if (!options.papersOnly) {
          await this.translateJesusSummaries(); 
          await this.translateGeneralSummaries();
          await this.translateSeriesMetadata();
          await this.translateEpisodeArrays();
        }
      } else if (options.jesusOnly) {
        await this.translateJesusSummaries(); 
        await this.translateGeneralSummaries();
        await this.translateSeriesMetadata();
        await this.translateEpisodeArrays();
      }
      
      const duration = Math.round((Date.now() - this.startTime) / 1000);
      const estimatedCost = (this.totalCharacters / 1000000) * 20; // ~$20 per million chars
      
      this.log('\n🎉 Translation completed successfully!');
      this.log(`📊 Statistics:`);
      this.log(`   • Total strings translated: ${this.translatedCount}`);
      this.log(`   • Total characters: ${this.totalCharacters.toLocaleString()}`);
      this.log(`   • Estimated cost: $${estimatedCost.toFixed(2)} USD`);
      this.log(`   • Total time: ${duration} seconds`);
      this.log(`   • Average: ${Math.round(this.translatedCount / duration * 60)} translations/minute`);
      this.log(`   • Errors: ${this.errors.length}`);
      
      if (this.errors.length > 0) {
        this.log('\n❌ Translation errors:');
        this.errors.forEach((error, index) => {
          this.log(`   ${index + 1}. "${error.text}..." - ${error.error}`);
        });
      }
      
      this.log(`\n📁 Translated files saved to: ${OUTPUT_DIR}/`);
      this.log(`📝 Session log saved to: ${LOG_FILE}`);
      
      // Flush remaining logs
      this.flushLogs();
      
    } catch (error) {
      this.log('\n💥 Translation process failed: ' + error.message);
      this.log('\n📚 Stack trace: ' + error.stack);
      this.flushLogs();
      process.exit(1);
    }
  }
}

// Execute the script (ES module equivalent of require.main === module)
// Check if this file is being run directly
// Need to handle URL encoding for paths with spaces
const currentFilePath = fileURLToPath(import.meta.url);
const scriptPath = process.argv[1];
const isMainModule = currentFilePath === scriptPath;

if (isMainModule) {
  const translator = new ContentTranslator();
  translator.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export default ContentTranslator; 