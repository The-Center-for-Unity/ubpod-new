#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * ACTIVE USAGE ANALYSIS SCRIPT
 * 
 * Purpose: Identify which files are ACTUALLY USED vs. legacy content
 * Critical for avoiding wasted effort on translating unused content
 */

class UsageAnalyzer {
  constructor() {
    this.activeFiles = new Set();
    this.importMap = new Map(); // file -> files it imports
    this.reverseImportMap = new Map(); // file -> files that import it
    this.legacyFiles = new Set();
    this.entryPoints = [
      'src/main.tsx',
      'src/App.tsx',
      'index.html',
      'vite.config.ts'
    ];
    // Track i18n-related files
    this.i18nFiles = new Set();
    this.i18nUsageFound = false;
  }

  // Scan a file for import statements and references
  scanFileImports(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const imports = [];
      
      // Check for i18n usage in the file
      if (this.hasI18nUsage(content)) {
        this.i18nUsageFound = true;
      }
      
      // Match various import patterns
      const importPatterns = [
        // ES6 imports: import X from 'Y'
        /import\s+(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+['"`]([^'"`]+)['"`]/g,
        // Dynamic imports: import('Y')
        /import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
        // Require statements: require('Y')
        /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
        // React Router lazy: lazy(() => import('Y'))
        /lazy\s*\(\s*\(\s*\)\s*=>\s*import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)\s*\)/g
      ];

      importPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          imports.push(match[1]);
        }
      });

      // Also check for direct file references in strings
      const fileRefPatterns = [
        // Paths in src/ directory
        /['"`]\.?\.?\/?(src\/[^'"`\s]+)['"`]/g,
        // Public asset references
        /['"`]\.?\.?\/?public\/([^'"`\s]+)['"`]/g,
        // Relative file references
        /['"`](\.\/[^'"`\s]+\.(?:ts|tsx|js|jsx|json))['"`]/g,
        /['"`](\.\.\/[^'"`\s]+\.(?:ts|tsx|js|jsx|json))['"`]/g
      ];

      fileRefPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          imports.push(match[1]);
        }
      });

      return imports;
    } catch (error) {
      console.warn(`Warning: Could not read ${filePath}:`, error.message);
      return [];
    }
  }

  // Check if file contains i18n usage patterns
  hasI18nUsage(content) {
    const i18nPatterns = [
      /useTranslation/,
      /react-i18next/,
      /i18next/,
      /t\(['"`][^'"`]+['"`]/,  // t('some.key')
      /i18n\./,
      /initReactI18next/,
      /LanguageProvider/,
      /LanguageContext/,
      /changeLanguage/
    ];
    
    return i18nPatterns.some(pattern => pattern.test(content));
  }

  // Check if file is part of i18n system
  isI18nRelatedFile(filePath) {
    const i18nPatterns = [
      /public\/locales\//,
      /src\/i18n\//,
      /LanguageContext/,
      /LanguageSwitcher/,
      /LocalizedLink/,
      /i18n/
    ];
    
    return i18nPatterns.some(pattern => pattern.test(filePath));
  }

  // Resolve import path to actual file path
  resolveImportPath(importPath, fromFile) {
    const fromDir = path.dirname(fromFile);
    
    // Handle relative imports
    if (importPath.startsWith('.')) {
      let resolved = path.resolve(fromDir, importPath);
      
      // Try different extensions
      const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '.json'];
      for (const ext of extensions) {
        const withExt = resolved + ext;
        if (fs.existsSync(withExt)) {
          return path.relative(process.cwd(), withExt);
        }
      }
      
      // Try index files
      for (const ext of ['.ts', '.tsx', '.js', '.jsx']) {
        const indexFile = path.join(resolved, `index${ext}`);
        if (fs.existsSync(indexFile)) {
          return path.relative(process.cwd(), indexFile);
        }
      }
    }
    
    // Handle absolute imports from src/
    if (importPath.startsWith('src/') || importPath.startsWith('/src/')) {
      const resolved = importPath.replace(/^\//, '');
      const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '.json'];
      for (const ext of extensions) {
        const withExt = resolved + ext;
        if (fs.existsSync(withExt)) {
          return withExt;
        }
      }
    }

    return null;
  }

  // Recursively trace imports from entry points
  traceImports(filePath, visited = new Set()) {
    if (visited.has(filePath) || !fs.existsSync(filePath)) {
      return;
    }

    visited.add(filePath);
    this.activeFiles.add(filePath);

    // Mark i18n-related files
    if (this.isI18nRelatedFile(filePath)) {
      this.i18nFiles.add(filePath);
    }

    const imports = this.scanFileImports(filePath);
    this.importMap.set(filePath, imports);

    imports.forEach(importPath => {
      const resolvedPath = this.resolveImportPath(importPath, filePath);
      if (resolvedPath) {
        // Add to reverse map
        if (!this.reverseImportMap.has(resolvedPath)) {
          this.reverseImportMap.set(resolvedPath, new Set());
        }
        this.reverseImportMap.get(resolvedPath).add(filePath);

        // Recursively trace
        this.traceImports(resolvedPath, visited);
      }
    });
  }

  // Mark all i18n locale files as active if i18n is used
  markI18nFilesAsActive() {
    if (this.i18nUsageFound) {
      console.log('🌍 i18n usage detected - marking all locale files as active');
      
      // Scan for all locale files
      const localeDir = 'public/locales';
      if (fs.existsSync(localeDir)) {
        this.scanDirectoryForI18nFiles(localeDir);
      }
    }
  }

  // Recursively scan directory for i18n files
  scanDirectoryForI18nFiles(dir) {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        this.scanDirectoryForI18nFiles(fullPath);
      } else if (stat.isFile() && item.endsWith('.json')) {
        const relativePath = path.relative(process.cwd(), fullPath);
        this.activeFiles.add(relativePath);
        this.i18nFiles.add(relativePath);
      }
    });
  }

  // Get all source files
  getAllSourceFiles() {
    const allFiles = new Set();
    
    const scanDirectory = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scanDirectory(fullPath);
        } else if (stat.isFile() && /\.(ts|tsx|js|jsx|json)$/.test(item)) {
          allFiles.add(path.relative(process.cwd(), fullPath));
        }
      });
    };

    // Scan main source directories
    scanDirectory('src');
    scanDirectory('public/locales');
    scanDirectory('scripts');
    
    // Add root config files
    const rootFiles = ['vite.config.ts', 'package.json', 'tsconfig.json'];
    rootFiles.forEach(file => {
      if (fs.existsSync(file)) {
        allFiles.add(file);
      }
    });

    return allFiles;
  }

  // Analyze usage and categorize files
  analyze() {
    console.log('🔍 Starting Active Usage Analysis...\n');

    // Trace from entry points
    this.entryPoints.forEach(entryPoint => {
      if (fs.existsSync(entryPoint)) {
        console.log(`📍 Tracing from entry point: ${entryPoint}`);
        this.traceImports(entryPoint);
      }
    });

    // Mark i18n files as active if i18n is used
    this.markI18nFilesAsActive();

    // Get all files
    const allFiles = this.getAllSourceFiles();
    
    // Identify legacy files
    allFiles.forEach(file => {
      if (!this.activeFiles.has(file)) {
        this.legacyFiles.add(file);
      }
    });

    console.log(`\n✅ Analysis complete!`);
    console.log(`📊 Found ${this.activeFiles.size} active files`);
    console.log(`🌍 Found ${this.i18nFiles.size} i18n-related files`);
    console.log(`📦 Found ${this.legacyFiles.size} potentially legacy files`);
    console.log(`📁 Total files analyzed: ${allFiles.size}`);

    return {
      activeFiles: Array.from(this.activeFiles).sort(),
      legacyFiles: Array.from(this.legacyFiles).sort(),
      i18nFiles: Array.from(this.i18nFiles).sort(),
      importMap: Object.fromEntries(this.importMap),
      reverseImportMap: Object.fromEntries(
        Array.from(this.reverseImportMap.entries()).map(([file, importers]) => [
          file, Array.from(importers)
        ])
      )
    };
  }

  // Generate detailed report
  generateReport(results) {
    const report = {
      summary: {
        totalFiles: results.activeFiles.length + results.legacyFiles.length,
        activeFiles: results.activeFiles.length,
        legacyFiles: results.legacyFiles.length,
        i18nFiles: results.i18nFiles.length,
        analysisDate: new Date().toISOString()
      },
      activeFiles: results.activeFiles.map(file => ({
        path: file,
        imports: results.importMap[file] || [],
        importedBy: results.reverseImportMap[file] || [],
        size: this.getFileSize(file),
        isI18n: results.i18nFiles.includes(file)
      })),
      legacyFiles: results.legacyFiles.map(file => ({
        path: file,
        size: this.getFileSize(file),
        reason: this.getLegacyReason(file)
      })),
      contentFiles: {
        active: results.activeFiles.filter(f => this.isContentFile(f) && !results.i18nFiles.includes(f)),
        legacy: results.legacyFiles.filter(f => this.isContentFile(f))
      },
      i18nFiles: results.i18nFiles.map(file => ({
        path: file,
        size: this.getFileSize(file),
        type: this.getI18nFileType(file)
      }))
    };

    return report;
  }

  // Helper methods
  getFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch {
      return 0;
    }
  }

  getLegacyReason(filePath) {
    if (filePath.includes('test') || filePath.includes('spec')) {
      return 'Test file';
    }
    if (filePath.includes('backup') || filePath.includes('old')) {
      return 'Backup/old file';
    }
    if (filePath.includes('example') || filePath.includes('sample')) {
      return 'Example/sample file';
    }
    if (filePath.includes('scraper')) {
      return 'Scraper/development tool';
    }
    return 'No active imports found';
  }

  getI18nFileType(filePath) {
    if (filePath.includes('public/locales')) {
      return 'Translation file';
    }
    if (filePath.includes('src/i18n')) {
      return 'i18n configuration';
    }
    if (filePath.includes('Language')) {
      return 'Language component';
    }
    return 'i18n-related';
  }

  isContentFile(filePath) {
    const contentPatterns = [
      /src\/data\//,
      /src\/utils\/.*Utils\.ts$/,
      /summaries/i,
      /episodes/i,
      /series/i
    ];
    return contentPatterns.some(pattern => pattern.test(filePath));
  }
}

// CLI execution
async function main() {
  const analyzer = new UsageAnalyzer();
  const results = analyzer.analyze();
  const report = analyzer.generateReport(results);

  // Save detailed results
  const outputFile = 'docs/i18n/phase2a-step2-active-usage-analysis.json';
  fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));

  // Generate summary report
  const summaryFile = 'docs/i18n/phase2a-step2-active-usage-summary.md';
  const summary = generateSummaryReport(report);
  fs.writeFileSync(summaryFile, summary);

  console.log(`\n📄 Detailed report saved: ${outputFile}`);
  console.log(`📋 Summary report saved: ${summaryFile}`);
  
  // Print key findings
  console.log('\n🎯 KEY FINDINGS:');
  console.log(`├── Active content files: ${report.contentFiles.active.length} (require extraction)`);
  console.log(`├── Legacy content files: ${report.contentFiles.legacy.length} (move to backup)`);
  console.log(`├── Active i18n files: ${report.summary.i18nFiles} (already in use)`);
  console.log(`└── Total files to move to backup: ${report.summary.legacyFiles} files`);

  // Show critical content files
  if (report.contentFiles.active.length > 0) {
    console.log('\n📋 CRITICAL ACTIVE CONTENT FILES (Need Extraction):');
    report.contentFiles.active.forEach((file, i) => {
      const fileData = report.activeFiles.find(f => f.path === file);
      console.log(`${i + 1}. ${file} (${(fileData?.size / 1024).toFixed(1)}KB)`);
    });
  }

  if (report.contentFiles.legacy.length > 0) {
    console.log('\n🗂️ LEGACY CONTENT FILES (Move to Backup):');
    report.contentFiles.legacy.forEach((file, i) => {
      const fileData = report.legacyFiles.find(f => f.path === file);
      console.log(`${i + 1}. ${file} (${(fileData?.size / 1024).toFixed(1)}KB) - ${fileData?.reason}`);
    });
  }

  console.log('\n🌍 i18n SYSTEM STATUS:');
  console.log(`├── Translation files: ${report.i18nFiles.filter(f => f.type === 'Translation file').length}`);
  console.log(`├── i18n components: ${report.i18nFiles.filter(f => f.type === 'Language component').length}`);
  console.log(`└── i18n config files: ${report.i18nFiles.filter(f => f.type === 'i18n configuration').length}`);
}

function generateSummaryReport(report) {
  return `# Phase 2A Step 2: Active Usage Analysis (CORRECTED)

**Generated**: ${new Date().toLocaleString()}

## Executive Summary

This analysis identifies which files are **actively used** vs. **legacy content** that can be moved to backup, ensuring we only extract and localize content that impacts users.

**🚨 CORRECTION**: i18n files (public/locales/) are ACTIVE - they're loaded through i18next configuration, not direct imports.

### Key Metrics
- **Total Files Analyzed**: ${report.summary.totalFiles}
- **Active Files**: ${report.summary.activeFiles} (${Math.round(report.summary.activeFiles / report.summary.totalFiles * 100)}%)
- **Legacy Files**: ${report.summary.legacyFiles} (${Math.round(report.summary.legacyFiles / report.summary.totalFiles * 100)}%)
- **i18n Files (Active)**: ${report.summary.i18nFiles} translation files

### Content File Classification
- **Active Content Files**: ${report.contentFiles.active.length} (require extraction)
- **Legacy Content Files**: ${report.contentFiles.legacy.length} (move to backup)
- **Active i18n Files**: ${report.summary.i18nFiles} (already implemented)

## Active Content Files (Extraction Required)

${report.contentFiles.active.map((file, i) => {
  const fileData = report.activeFiles.find(f => f.path === file);
  return `${i + 1}. \`${file}\` (${(fileData?.size / 1024).toFixed(1)}KB)`;
}).join('\n')}

## Legacy Content Files (Move to Backup)

${report.contentFiles.legacy.length > 0 ? 
  report.contentFiles.legacy.map((file, i) => {
    const fileData = report.legacyFiles.find(f => f.path === file);
    return `${i + 1}. \`${file}\` (${(fileData?.size / 1024).toFixed(1)}KB) - ${fileData?.reason}`;
  }).join('\n') :
  'No legacy content files identified.'
}

## i18n System Status ✅

The i18n system is **ACTIVE** with ${report.summary.i18nFiles} translation files:

${report.i18nFiles.map((file, i) => {
  return `${i + 1}. \`${file.path}\` (${(file.size / 1024).toFixed(1)}KB) - ${file.type}`;
}).join('\n')}

## Revised Next Steps

1. **DO NOT move i18n files** - they are actively used
2. **Move only legacy files**: Create \`legacy-backup/\` directory and move ${report.summary.legacyFiles} unused files  
3. **Focus extraction**: Only extract content from ${report.contentFiles.active.length} active content files
4. **Proceed to Step 3**: Map data source relationships for active files only

## Critical Insight

The **Spanish translations already exist** in ${report.i18nFiles.filter(f => f.path.includes('/es/')).length} files! The focus should be on:
1. **Extracting hardcoded content** from ${report.contentFiles.active.length} active source files
2. **Integrating with existing i18n system** rather than rebuilding translations

*This focused approach will significantly reduce the scope of content extraction work since translations are already partially implemented.*
`;
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { UsageAnalyzer }; 