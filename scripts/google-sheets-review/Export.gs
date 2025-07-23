// Export.gs - Functions for exporting reviewed translations back to JSON

// Main export function
function exportTranslations() {
  const ui = SpreadsheetApp.getUi();
  const config = getConfig();
  
  // Ask user what to export
  const response = ui.alert(
    'Export Translations',
    'Export all approved translations to JSON files?',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) return;
  
  try {
    // Collect all translations
    const uiTranslations = collectUITranslations();
    const contentTranslations = collectContentTranslations();
    
    // Create export folder in Drive
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const folderName = `UBPod Export - ${config.language} - ${timestamp}`;
    const folder = DriveApp.createFolder(folderName);
    
    // Export UI files
    Object.entries(uiTranslations).forEach(([filename, content]) => {
      if (Object.keys(content).length > 0) {
        const blob = Utilities.newBlob(
          JSON.stringify(content, null, 2),
          'application/json',
          `${filename}.json`
        );
        folder.createFile(blob);
      }
    });
    
    // Export content.json
    if (Object.keys(contentTranslations).length > 0) {
      const contentBlob = Utilities.newBlob(
        JSON.stringify(contentTranslations, null, 2),
        'application/json',
        'content.json'
      );
      folder.createFile(contentBlob);
    }
    
    // Create summary report
    createExportReport(folder);
    
    // Show success message with folder link
    const html = HtmlService.createHtmlOutput(`
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h3>Export Complete!</h3>
        <p>Translations have been exported to Google Drive:</p>
        <p><a href="${folder.getUrl()}" target="_blank">Open Export Folder</a></p>
        <hr>
        <h4>Next Steps:</h4>
        <ol>
          <li>Download the JSON files from the folder</li>
          <li>Copy them to your local project's src/locales/${config.language}/ directory</li>
          <li>Test the translations in your local environment</li>
          <li>Commit and push the changes to GitHub</li>
        </ol>
      </div>
    `)
    .setWidth(500)
    .setHeight(400);
    
    ui.showModalDialog(html, 'Export Complete');
    
  } catch (error) {
    ui.alert('Error', 'Export failed: ' + error.toString(), ui.ButtonSet.OK);
  }
}

// Collect UI translations from sheet
function collectUITranslations() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('UI Translations');
  if (!sheet) return {};
  
  const data = sheet.getDataRange().getValues();
  const translations = {};
  
  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const path = row[0];
    const proposedTranslation = row[3];
    const status = row[4];
    
    // Only export approved translations with proposed values
    if (status === 'Approved' && proposedTranslation) {
      const parts = path.split('.');
      const filename = parts[0];
      const jsonPath = parts.slice(1);
      
      if (!translations[filename]) {
        translations[filename] = {};
      }
      
      setNestedValue(translations[filename], jsonPath, proposedTranslation);
    }
  }
  
  return translations;
}

// Collect content translations from all content sheets
function collectContentTranslations() {
  const contentTranslations = {};
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();
  
  sheets.forEach(sheet => {
    const name = sheet.getName();
    if (name.startsWith('Content -')) {
      const data = sheet.getDataRange().getValues();
      
      // Skip header row
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const path = row[0];
        const proposedTranslation = row[3];
        const status = row[4];
        
        // Only export approved translations with proposed values
        if (status === 'Approved' && proposedTranslation) {
          const parts = path.split('.');
          setNestedValue(contentTranslations, parts, proposedTranslation);
        }
      }
    }
  });
  
  return contentTranslations;
}

// Set nested value in object
function setNestedValue(obj, path, value) {
  const lastKey = path.pop();
  const target = path.reduce((curr, key) => {
    if (!curr[key]) curr[key] = {};
    return curr[key];
  }, obj);
  target[lastKey] = value;
}

// Create export report
function createExportReport(folder) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const config = getConfig();
  
  let report = `# UBPod Translation Export Report\n\n`;
  report += `**Language:** ${config.language}\n`;
  report += `**Date:** ${new Date().toLocaleString()}\n`;
  report += `**Reviewer:** ${Session.getActiveUser().getEmail()}\n\n`;
  
  report += `## Summary\n\n`;
  
  // Get statistics
  const stats = getTranslationStats();
  report += `| Sheet | Total | Approved | Pending | Rejected |\n`;
  report += `|-------|--------|----------|---------|----------|\n`;
  
  stats.forEach(stat => {
    report += `| ${stat.sheet} | ${stat.total} | ${stat.approved} | ${stat.pending} | ${stat.rejected} |\n`;
  });
  
  report += `\n## Files Exported\n\n`;
  
  // List exported files
  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    report += `- ${file.getName()}\n`;
  }
  
  // Save report
  const reportBlob = Utilities.newBlob(report, 'text/markdown', 'EXPORT_REPORT.md');
  folder.createFile(reportBlob);
}

// Get translation statistics
function getTranslationStats() {
  const stats = [];
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();
  
  sheets.forEach(sheet => {
    const name = sheet.getName();
    if (name.startsWith('UI Translations') || name.startsWith('Content -')) {
      const data = sheet.getDataRange().getValues();
      if (data.length > 1) {
        let pending = 0, approved = 0, rejected = 0;
        
        for (let i = 1; i < data.length; i++) {
          const status = data[i][4];
          if (status === 'Pending') pending++;
          else if (status === 'Approved') approved++;
          else if (status === 'Rejected') rejected++;
        }
        
        stats.push({
          sheet: name,
          total: data.length - 1,
          pending: pending,
          approved: approved,
          rejected: rejected
        });
      }
    }
  });
  
  return stats;
}

// Export only changed translations (for review)
function exportChangedOnly() {
  const ui = SpreadsheetApp.getUi();
  const config = getConfig();
  
  try {
    const changes = collectChangedTranslations();
    
    if (Object.keys(changes).length === 0) {
      ui.alert('No Changes', 'No approved changes found to export.', ui.ButtonSet.OK);
      return;
    }
    
    // Create export folder
    const folder = DriveApp.createFolder(`UBPod Changes - ${config.language} - ${new Date().toISOString()}`);
    
    // Export changes file
    const changesBlob = Utilities.newBlob(
      JSON.stringify(changes, null, 2),
      'application/json',
      'approved_changes.json'
    );
    folder.createFile(changesBlob);
    
    // Show success
    ui.alert('Export Complete', `Changes exported to:\n${folder.getUrl()}`, ui.ButtonSet.OK);
    
  } catch (error) {
    ui.alert('Error', 'Export failed: ' + error.toString(), ui.ButtonSet.OK);
  }
}

// Collect only changed translations
function collectChangedTranslations() {
  const changes = {};
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();
  
  sheets.forEach(sheet => {
    const name = sheet.getName();
    if (name.startsWith('UI Translations') || name.startsWith('Content -')) {
      const data = sheet.getDataRange().getValues();
      
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const path = row[0];
        const currentTranslation = row[2];
        const proposedTranslation = row[3];
        const status = row[4];
        
        // Only include if approved and different from current
        if (status === 'Approved' && proposedTranslation && proposedTranslation !== currentTranslation) {
          changes[path] = {
            original: row[1],
            current: currentTranslation,
            proposed: proposedTranslation,
            notes: row[5],
            modifiedBy: row[7],
            modifiedAt: row[6]
          };
        }
      }
    }
  });
  
  return changes;
}