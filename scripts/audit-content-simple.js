#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

/**
 * Simple Comprehensive Content Audit Script
 * Phase 2A Step 1: Analyze ALL files in the codebase
 */

console.log('🔍 Starting COMPREHENSIVE UrantiaBookPod Content Audit...\n');

const results = {
  summary: {
    totalFilesScanned: 0,
    totalHardcodedStrings: 0,
    totalTranslationKeys: 0,
    filesByType: {},
    filesByI18nStatus: {},
    filesByPriority: {}
  },
  files: [],
  hardcodedStrings: [],
  translationKeys: []
};

// Simple file analysis
function analyzeFile(filePath) {
  try {
    console.log(`📄 Analyzing: ${filePath}`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').length;
    const sizeKB = Math.round(content.length / 1024);
    const ext = path.extname(filePath);
    
    // Basic categorization
    let fileType = 'Other';
    if (filePath.includes('/components/')) fileType = 'Component';
    else if (filePath.includes('/pages/')) fileType = 'Page';
    else if (filePath.includes('/utils/')) fileType = 'Utility';
    else if (filePath.includes('/data/')) fileType = 'Data';
    else if (filePath.includes('locales/')) fileType = 'i18n Translation';
    else if (ext === '.json') fileType = 'JSON Data';
    
    // Priority assessment
    let priority = 'Low';
    if (filePath.includes('episodeUtils') || filePath.includes('seriesUtils') || 
        filePath.includes('episodes.json') || filePath.includes('summaries')) {
      priority = 'Critical';
    } else if (filePath.includes('/components/') || filePath.includes('/pages/')) {
      priority = 'High';
    } else if (filePath.includes('/utils/') || filePath.includes('locales/')) {
      priority = 'Medium';
    }
    
    // Content analysis
    const hasUseTranslation = content.includes('useTranslation');
    const hasTranslationKey = content.includes('t(');
    
    // Simple hardcoded string detection
    const hardcodedMatches = content.match(/["'][A-Z][^"']{10,}["']/g) || [];
    const hardcodedStrings = hardcodedMatches.filter(str => {
      const clean = str.replace(/^["']|["']$/g, '');
      return !clean.includes('/') && !clean.includes('.') && !clean.includes('=');
    });
    
    // Translation key detection
    const translationKeyMatches = content.match(/t\(['"`]([^'"`]+)['"`]\)/g) || [];
    
    // i18n status
    let i18nStatus = '➖ No user content';
    if (hasUseTranslation && hasTranslationKey) {
      i18nStatus = hardcodedStrings.length > 0 ? '⚠️ Partial i18n' : '✅ i18n implemented';
    } else if (hardcodedStrings.length > 0) {
      i18nStatus = '❌ Hardcoded';
    }
    
    const fileInfo = {
      path: filePath,
      type: fileType,
      priority,
      lines,
      sizeKB,
      i18nStatus,
      hasUseTranslation,
      hasTranslationKey,
      hardcodedCount: hardcodedStrings.length,
      translationKeyCount: translationKeyMatches.length
    };
    
    // Store results
    results.files.push(fileInfo);
    results.hardcodedStrings.push(...hardcodedStrings.map(str => ({ file: filePath, string: str })));
    results.translationKeys.push(...translationKeyMatches.map(key => ({ file: filePath, key })));
    results.summary.totalFilesScanned++;
    
    return fileInfo;
    
  } catch (error) {
    console.warn(`⚠️  Could not analyze ${filePath}: ${error.message}`);
    return null;
  }
}

// Simple directory scanning
function scanDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Directory not found: ${dirPath}`);
    return;
  }
  
  console.log(`📂 Scanning directory: ${dirPath}`);
  
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    if (item.startsWith('.')) continue; // Skip hidden files
    
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Skip certain directories
      if (['node_modules', '.git', 'dist', 'build'].includes(item)) {
        continue;
      }
      scanDirectory(itemPath);
    } else if (stat.isFile()) {
      const ext = path.extname(itemPath);
      if (['.ts', '.tsx', '.js', '.jsx', '.json'].includes(ext)) {
        analyzeFile(itemPath);
      }
    }
  }
}

// Generate summary
function generateSummary() {
  console.log('\n📊 Generating summary...');
  
  results.summary.totalHardcodedStrings = results.hardcodedStrings.length;
  results.summary.totalTranslationKeys = results.translationKeys.length;
  
  // Group by categories
  results.files.forEach(file => {
    results.summary.filesByType[file.type] = (results.summary.filesByType[file.type] || 0) + 1;
    results.summary.filesByI18nStatus[file.i18nStatus] = (results.summary.filesByI18nStatus[file.i18nStatus] || 0) + 1;
    results.summary.filesByPriority[file.priority] = (results.summary.filesByPriority[file.priority] || 0) + 1;
  });
}

// Save results
function saveResults() {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `docs/i18n/comprehensive-audit-${timestamp}.json`;
  
  console.log(`💾 Saving results to: ${filename}`);
  fs.writeFileSync(filename, JSON.stringify(results, null, 2));
  
  // Generate markdown report
  const reportFilename = `docs/i18n/phase2a-step1-comprehensive-audit.md`;
  const report = `# Phase 2A Step 1: Comprehensive Content Audit
*Generated: ${new Date().toISOString()}*

## Executive Summary

📊 **Complete Analysis**: ${results.summary.totalFilesScanned} files scanned
🔍 **Content Found**: ${results.summary.totalHardcodedStrings} hardcoded strings, ${results.summary.totalTranslationKeys} translation keys

## Files by Type

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
  .map(([priority, count]) => `- **${priority}**: ${count} files`)
  .join('\n')}

## Critical Files

${results.files
  .filter(f => f.priority === 'Critical')
  .map(f => `- **${f.path}**: ${f.hardcodedCount} hardcoded strings (${f.sizeKB}KB)`)
  .join('\n')}

## High Priority Files with Hardcoded Content

${results.files
  .filter(f => f.priority === 'High' && f.hardcodedCount > 0)
  .map(f => `- **${f.path}**: ${f.hardcodedCount} hardcoded strings`)
  .join('\n')}

---
*Detailed results in: comprehensive-audit-${timestamp}.json*
`;

  fs.writeFileSync(reportFilename, report);
  console.log(`📄 Report saved to: ${reportFilename}`);
}

// Print summary
function printSummary() {
  console.log('\n📊 COMPREHENSIVE AUDIT SUMMARY');
  console.log('=====================================');
  console.log(`📁 Total Files Scanned: ${results.summary.totalFilesScanned}`);
  console.log(`📝 Total Hardcoded Strings: ${results.summary.totalHardcodedStrings}`);
  console.log(`🌐 Total Translation Keys: ${results.summary.totalTranslationKeys}`);
  
  console.log('\n📂 Files by Type:');
  Object.entries(results.summary.filesByType)
    .sort(([,a], [,b]) => b - a)
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
  
  console.log('\n🌐 i18n Status:');
  Object.entries(results.summary.filesByI18nStatus)
    .sort(([,a], [,b]) => b - a)
    .forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
  
  console.log('\n⭐ Priority Levels:');
  Object.entries(results.summary.filesByPriority)
    .sort(([,a], [,b]) => b - a)
    .forEach(([priority, count]) => {
      console.log(`  ${priority}: ${count}`);
    });
}

// Main execution
async function main() {
  try {
    console.log('🚀 Starting comprehensive scan...\n');
    
    // Scan main directories
    scanDirectory('src');
    scanDirectory('public/locales');
    scanDirectory('scripts');
    
    // Analyze key root files
    const rootFiles = ['package.json', 'vite.config.ts', 'tsconfig.json'];
    rootFiles.forEach(file => {
      if (fs.existsSync(file)) {
        analyzeFile(file);
      }
    });
    
    generateSummary();
    saveResults();
    printSummary();
    
    console.log('\n✅ Comprehensive audit complete!');
    
  } catch (error) {
    console.error('❌ Error during audit:', error);
  }
}

// Run the audit
main(); 