#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

/**
 * Comprehensive Content Audit Script for UrantiaBookPod i18n Implementation
 * Phase 2A: Complete Content Inventory - ALL 115 FILES
 */

console.log('🔍 Starting COMPREHENSIVE UrantiaBookPod Content Audit...\n');
console.log('📊 Analyzing ALL 115 files across the entire codebase\n');

// Scan ALL directories and file types
const SCAN_DIRECTORIES = [
  'src/components',
  'src/pages', 
  'src/utils',
  'src/data',
  'src/hooks',
  'src/types',
  'src/config',
  'src/constants',
  'src/i18n',
  'src/api',
  'src/styles',
  'public/locales',
  'scripts'
];

const SCAN_EXTENSIONS = ['.ts', '.tsx', '.json', '.js', '.jsx', '.css', '.md'];
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '__tests__',
  '.test.',
  '.spec.',
  'ai-digest',
  'codebase',
  '.DS_Store'
];

// Comprehensive results structure
const results = {
  summary: {
    totalFilesScanned: 0,
    filesByType: {},
    filesByDirectory: {},
    filesByI18nStatus: {},
    filesByPriority: {},
    totalHardcodedStrings: 0,
    totalTranslationKeys: 0,
    totalContentFiles: 0
  },
  fileAnalysis: [],
  hardcodedStrings: [],
  translationKeys: [],
  contentFiles: [],
  i18nCoverage: {
    english: { files: [], totalEntries: 0 },
    spanish: { files: [], totalEntries: 0 }
  },
  dependencyMap: {},
  extractionTasks: [],
  recommendations: []
};

// Enhanced file analysis
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').length;
    const sizeKB = Math.round(content.length / 1024);
    const ext = path.extname(filePath);
    
    // Determine file type and category
    const fileType = getFileType(filePath, content);
    const contentCategory = getContentCategory(filePath);
    const priority = getPriority(filePath, content);
    
    // Content analysis
    const hasUseTranslation = content.includes('useTranslation');
    const hasTranslationKey = /t\(['"`]/.test(content);
    const hardcodedStrings = extractHardcodedStrings(filePath, content);
    const translationKeys = extractTranslationKeys(filePath, content);
    
    // i18n status determination
    let i18nStatus = '➖ No user content';
    if (hasUseTranslation && hasTranslationKey) {
      i18nStatus = hardcodedStrings.length > 0 ? '⚠️ Partial i18n' : '✅ i18n implemented';
    } else if (hardcodedStrings.length > 0) {
      i18nStatus = '❌ Hardcoded';
    }

    // Content analysis for JSON files
    let contentAnalysis = null;
    if (ext === '.json' && (filePath.includes('locales') || isContentFile(filePath))) {
      contentAnalysis = analyzeJsonContent(filePath, content);
    }

    const fileInfo = {
      path: filePath,
      type: fileType,
      category: contentCategory,
      priority,
      extension: ext,
      lines,
      sizeKB,
      i18nStatus,
      hasUseTranslation,
      hasTranslationKey,
      hardcodedCount: hardcodedStrings.length,
      translationKeyCount: translationKeys.length,
      contentAnalysis,
      extractionNeeded: determineExtractionNeeded(filePath, content, hardcodedStrings.length),
      dependencies: findDependencies(filePath, content)
    };

    return { fileInfo, hardcodedStrings, translationKeys };
    
  } catch (error) {
    return {
      fileInfo: {
        path: filePath,
        type: 'Error',
        category: 'Error',
        priority: 'Low',
        extension: path.extname(filePath),
        lines: 0,
        sizeKB: 0,
        i18nStatus: '❌ Error',
        error: error.message
      },
      hardcodedStrings: [],
      translationKeys: []
    };
  }
}

// Enhanced file type detection
function getFileType(filePath, content) {
  if (filePath.includes('/components/')) return 'Component';
  if (filePath.includes('/pages/')) return 'Page';
  if (filePath.includes('/utils/')) return 'Utility';
  if (filePath.includes('/data/')) return 'Data';
  if (filePath.includes('/hooks/')) return 'Hook';
  if (filePath.includes('/types/')) return 'Type Definition';
  if (filePath.includes('/config/')) return 'Configuration';
  if (filePath.includes('/constants/')) return 'Constants';
  if (filePath.includes('/i18n/')) return 'i18n Config';
  if (filePath.includes('/api/')) return 'API';
  if (filePath.includes('/styles/')) return 'Styles';
  if (filePath.includes('locales/')) return 'i18n Translation';
  if (filePath.includes('scripts/')) return 'Build Script';
  if (filePath.endsWith('.json')) return 'JSON Data';
  if (filePath.endsWith('.css')) return 'Stylesheet';
  if (filePath.endsWith('.md')) return 'Documentation';
  return 'Other';
}

// Enhanced content category detection
function getContentCategory(filePath) {
  if (filePath.includes('episode')) return 'Episode Data';
  if (filePath.includes('series')) return 'Series Data';
  if (filePath.includes('audio') || filePath.includes('player')) return 'UI Controls';
  if (filePath.includes('navigation') || filePath.includes('header')) return 'UI Navigation';
  if (filePath.includes('layout')) return 'UI Layout';
  if (filePath.includes('urantia') || filePath.includes('summary')) return 'Content Data';
  if (filePath.includes('form') || filePath.includes('contact')) return 'UI Forms';
  if (filePath.includes('analytics')) return 'Analytics';
  if (filePath.includes('shared') || filePath.includes('common')) return 'Shared UI';
  if (filePath.includes('locales/')) return 'Translation Content';
  return 'UI Content';
}

// Enhanced priority assessment
function getPriority(filePath, content) {
  // Critical: Large content files with hardcoded data
  if (filePath.includes('episodeUtils') || 
      filePath.includes('seriesUtils') || 
      filePath.includes('episodes.json') ||
      filePath.includes('episodes.ts') ||
      filePath.includes('summaries') ||
      filePath.includes('urantia_summaries')) {
    return 'Critical';
  }
  
  // High: User-facing UI components with significant content
  if ((filePath.includes('/components/') || filePath.includes('/pages/')) &&
      content.length > 1000) {
    return 'High';
  }
  
  // Medium: Smaller UI components, utilities, config
  if (filePath.includes('/components/') || 
      filePath.includes('/pages/') ||
      filePath.includes('/utils/') || 
      filePath.includes('locales/')) {
    return 'Medium';
  }
  
  // Low: Types, constants, small files
  return 'Low';
}

// Enhanced hardcoded string extraction
function extractHardcodedStrings(filePath, content) {
  const strings = [];
  
  // Different patterns for different file types
  if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
    // JSX content patterns
    const jsxTextPattern = />([^<{]*[A-Za-z][^<{]*)</g;
    let match;
    while ((match = jsxTextPattern.exec(content)) !== null) {
      const text = match[1].trim();
      if (isUserFacingString(text)) {
        strings.push({
          text,
          pattern: 'jsx-content',
          line: getLineNumber(content, match.index)
        });
      }
    }
  }
  
  // String literals in quotes
  const quotedStringPattern = /["']([^"']*[A-Za-z][^"']*)["']/g;
  let match;
  while ((match = quotedStringPattern.exec(content)) !== null) {
    const text = match[1];
    if (isUserFacingString(text)) {
      strings.push({
        text,
        pattern: 'quoted-string',
        line: getLineNumber(content, match.index)
      });
    }
  }
  
  return strings;
}

// Enhanced translation key extraction
function extractTranslationKeys(filePath, content) {
  const keys = [];
  const tKeyPattern = /t\(['"`]([^'"`]+)['"`](?:,\s*\{[^}]*\})?\)/g;
  let match;

  while ((match = tKeyPattern.exec(content)) !== null) {
    keys.push({
      key: match[1],
      line: getLineNumber(content, match.index),
      fullMatch: match[0]
    });
  }
  
  return keys;
}

// JSON content analysis
function analyzeJsonContent(filePath, content) {
  try {
    const data = JSON.parse(content);
    let entryCount = 0;
    let contentType = 'Unknown';
    
    if (Array.isArray(data)) {
      entryCount = data.length;
      contentType = 'Array';
    } else if (typeof data === 'object') {
      entryCount = Object.keys(data).length;
      contentType = 'Object';
    }
    
    return {
      structure: contentType,
      entryCount,
      isTranslationFile: filePath.includes('locales/'),
      language: filePath.includes('/en/') ? 'English' : filePath.includes('/es/') ? 'Spanish' : 'Unknown'
    };
  } catch {
    return null;
  }
}

// Determine if extraction is needed
function determineExtractionNeeded(filePath, content, hardcodedCount) {
  if (hardcodedCount === 0) return false;
  
  // Always extract from critical files
  if (filePath.includes('episodeUtils') || filePath.includes('seriesUtils')) {
    return true;
  }
  
  // Extract from components with significant hardcoded content
  if ((filePath.includes('/components/') || filePath.includes('/pages/')) && hardcodedCount > 3) {
    return true;
  }
  
  return false;
}

// Find file dependencies
function findDependencies(filePath, content) {
  const deps = [];
  
  // Import statements
  const importPattern = /import.*from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importPattern.exec(content)) !== null) {
    deps.push({
      type: 'import',
      path: match[1]
    });
  }
  
  return deps;
}

// Check if file is a content data file
function isContentFile(filePath) {
  const contentPatterns = [
    'episodes.json',
    'summaries.json', 
    'urantia_summaries.json',
    'discoverJesusSummaries',
    'series-availability.json'
  ];
  return contentPatterns.some(pattern => filePath.includes(pattern));
}

// Utility functions
function isUserFacingString(str) {
  str = str.trim();
  if (str.length < 3) return false;
  
  const technicalPatterns = [
    /^[a-z]+([A-Z][a-z]*)*$/, // camelCase
    /^[A-Z_]+$/, // CONSTANTS
    /^\d+$/, // Numbers only
    /^[a-z-]+$/, // kebab-case
    /^\/|\.\/|\.\.\//, // Paths
    /^https?:\/\//, // URLs
    /^[a-z]+:/, // Protocols
    /className|onClick|onChange|onSubmit|href|src|alt|id|key|ref/i, // React props
    /console\.|import|export|from|require/i, // JS keywords
  ];
  
  return !technicalPatterns.some(pattern => pattern.test(str));
}

function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length;
}

// Recursive directory scanning
async function scanDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    
    if (EXCLUDE_PATTERNS.some(pattern => itemPath.includes(pattern))) {
      continue;
    }
    
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      await scanDirectory(itemPath);
    } else if (stat.isFile()) {
      const ext = path.extname(itemPath);
      if (SCAN_EXTENSIONS.includes(ext)) {
        const analysis = analyzeFile(itemPath);
        
        results.fileAnalysis.push(analysis.fileInfo);
        results.hardcodedStrings.push(...analysis.hardcodedStrings.map(s => ({
          file: itemPath,
          ...s
        })));
        results.translationKeys.push(...analysis.translationKeys.map(k => ({
          file: itemPath,
          ...k
        })));
        
        results.summary.totalFilesScanned++;
      }
    }
  }
}

// Main execution
async function runComprehensiveAudit() {
  console.log('🔍 Scanning all directories...');
  
  // Scan src directory completely
  await scanDirectory('src');
  
  // Scan public/locales
  if (fs.existsSync('public/locales')) {
    await scanDirectory('public/locales');
  }
  
  // Scan scripts
  if (fs.existsSync('scripts')) {
    await scanDirectory('scripts');
  }
  
  // Additional root files
  const rootFiles = ['package.json', 'vite.config.ts', 'tsconfig.json'];
  for (const file of rootFiles) {
    if (fs.existsSync(file)) {
      const analysis = analyzeFile(file);
      results.fileAnalysis.push(analysis.fileInfo);
    }
  }
  
  generateSummary();
  generateRecommendations();
  saveResults();
  
  console.log('\n✅ Comprehensive audit complete!');
  printSummary();
}

// Generate summary statistics
function generateSummary() {
  results.summary.totalHardcodedStrings = results.hardcodedStrings.length;
  results.summary.totalTranslationKeys = results.translationKeys.length;
  
  // Group by various categories
  results.summary.filesByType = groupBy(results.fileAnalysis, 'type');
  results.summary.filesByI18nStatus = groupBy(results.fileAnalysis, 'i18nStatus');
  results.summary.filesByPriority = groupBy(results.fileAnalysis, 'priority');
  
  // i18n coverage analysis
  results.fileAnalysis.forEach(file => {
    if (file.contentAnalysis?.isTranslationFile) {
      const target = file.contentAnalysis.language === 'English' ? 
        results.i18nCoverage.english : results.i18nCoverage.spanish;
      target.files.push(file);
      target.totalEntries += file.contentAnalysis.entryCount || 0;
    }
  });
}

// Generate recommendations
function generateRecommendations() {
  const criticalFiles = results.fileAnalysis.filter(f => f.priority === 'Critical');
  const hardcodedFiles = results.fileAnalysis.filter(f => f.extractionNeeded);
  
  results.recommendations = [
    `Extract content from ${criticalFiles.length} critical files first`,
    `Address ${hardcodedFiles.length} files with significant hardcoded content`,
    `Consolidate ${results.summary.totalHardcodedStrings} hardcoded strings`,
    `Leverage ${results.i18nCoverage.spanish.files.length} existing Spanish translation files`,
    `Create ${results.i18nCoverage.english.files.length} missing English content files`
  ];
}

function groupBy(array, property) {
  return array.reduce((groups, item) => {
    const key = item[property];
    groups[key] = (groups[key] || 0) + 1;
    return groups;
  }, {});
}

// Print summary to console
function printSummary() {
  console.log('\n📊 COMPREHENSIVE AUDIT SUMMARY');
  console.log('=====================================');
  console.log(`Total Files Scanned: ${results.summary.totalFilesScanned}`);
  console.log(`Total Hardcoded Strings: ${results.summary.totalHardcodedStrings}`);
  console.log(`Total Translation Keys: ${results.summary.totalTranslationKeys}`);
  
  console.log('\n📂 Files by Type:');
  Object.entries(results.summary.filesByType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
  
  console.log('\n🌐 i18n Status:');
  Object.entries(results.summary.filesByI18nStatus).forEach(([status, count]) => {
    console.log(`  ${status}: ${count}`);
  });
  
  console.log('\n⭐ Priority Levels:');
  Object.entries(results.summary.filesByPriority).forEach(([priority, count]) => {
    console.log(`  ${priority}: ${count}`);
  });
  
  console.log('\n🎯 Key Recommendations:');
  results.recommendations.forEach((rec, i) => {
    console.log(`  ${i + 1}. ${rec}`);
  });
}

// Save results
function saveResults() {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `docs/i18n/comprehensive-audit-${timestamp}.json`;
  
  fs.writeFileSync(filename, JSON.stringify(results, null, 2));
  
  // Generate markdown report
  generateMarkdownReport(timestamp);
  
  console.log(`\n📄 Results saved to: ${filename}`);
}

// Generate comprehensive markdown report
function generateMarkdownReport(timestamp) {
  const filename = `docs/i18n/phase2a-step1-comprehensive-audit.md`;
  
  const report = `# Phase 2A Step 1: Comprehensive Content Audit
*Generated: ${new Date().toISOString()}*

## Executive Summary

📊 **Complete Analysis**: ${results.summary.totalFilesScanned} files scanned across entire codebase
🔍 **Content Found**: ${results.summary.totalHardcodedStrings} hardcoded strings, ${results.summary.totalTranslationKeys} translation keys
🎯 **Strategy Ready**: Full picture analysis complete for informed extraction decisions

## Files by Type Analysis

${Object.entries(results.summary.filesByType)
  .sort(([,a], [,b]) => b - a)
  .map(([type, count]) => `- **${type}**: ${count} files`)
  .join('\n')}

## i18n Implementation Status

${Object.entries(results.summary.filesByI18nStatus)
  .sort(([,a], [,b]) => b - a)
  .map(([status, count]) => `- **${status}**: ${count} files`)
  .join('\n')}

## Priority Distribution

${Object.entries(results.summary.filesByPriority)
  .sort(([,a], [,b]) => b - a)
  .map(([priority, count]) => `- **${priority} Priority**: ${count} files`)
  .join('\n')}

## Critical Files Requiring Immediate Attention

${results.fileAnalysis
  .filter(f => f.priority === 'Critical')
  .map(f => `- **${f.path}** (${f.type}): ${f.hardcodedCount} hardcoded strings, ${f.sizeKB}KB`)
  .join('\n')}

## Files Requiring Content Extraction

${results.fileAnalysis
  .filter(f => f.extractionNeeded)
  .map(f => `- **${f.path}** (${f.category}): ${f.hardcodedCount} strings to extract`)
  .join('\n')}

## Translation Coverage Analysis

### English Content Organization
- **Files**: ${results.i18nCoverage.english.files.length}
- **Total Entries**: ${results.i18nCoverage.english.totalEntries}

### Spanish Content Organization  
- **Files**: ${results.i18nCoverage.spanish.files.length}
- **Total Entries**: ${results.i18nCoverage.spanish.totalEntries}

## Strategic Recommendations

${results.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

## Next Steps

Based on this comprehensive analysis:

1. **Phase 2B**: Design unified content schema using insights from all ${results.summary.totalFilesScanned} files
2. **Phase 2C**: Create extraction scripts prioritizing ${results.fileAnalysis.filter(f => f.priority === 'Critical').length} critical files
3. **Phase 2D**: Implement systematic content consolidation based on full dependency map

## Detailed Analysis

See comprehensive JSON results in: \`comprehensive-audit-${timestamp}.json\`

---
*This analysis provides the complete foundation for informed content localization decisions.*
`;

  fs.writeFileSync(filename, report);
  console.log(`📄 Markdown report saved to: ${filename}`);
}

// Execute the comprehensive audit
if (import.meta.url === `file://${process.argv[1]}`) {
  runComprehensiveAudit().catch(console.error);
}
