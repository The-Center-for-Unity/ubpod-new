// UBPod Translation Review System - Main Script
// This script manages import/export of translations between JSON files and Google Sheets

// Configuration
const CONFIG = {
  // Update these with your actual values
  githubRepo: 'your-github-username/ubpod-new',
  githubToken: '', // Optional: for direct GitHub integration
  screenshotApiKey: '', // Optional: for screenshot service
  languages: {
    'es': 'Spanish',
    'fr': 'French', 
    'pt': 'Portuguese'
  }
};

// Menu setup
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('UBPod Translations')
    .addItem('🚀 Initialize Spreadsheet', 'initializeSpreadsheet')
    .addSeparator()
    .addItem('Import JSON Files', 'showImportDialog')
    .addItem('Export Reviewed', 'exportTranslations')
    .addItem('Update from GitHub', 'updateFromGitHub')
    .addSeparator()
    .addItem('Update Screenshots', 'updateScreenshots')
    .addItem('Generate Status Report', 'generateStatusReport')
    .addSeparator()
    .addItem('Settings', 'showSettings')
    .addItem('Help', 'showHelp')
    .addToUi();
}

// Get configuration from Settings sheet
function getConfig() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
  if (!sheet) {
    // Create settings sheet if it doesn't exist
    createSettingsSheet();
    return CONFIG;
  }
  
  const data = sheet.getDataRange().getValues();
  const config = {};
  
  data.forEach(row => {
    if (row[0]) config[row[0]] = row[1];
  });
  
  return Object.assign({}, CONFIG, config);
}

// Create settings sheet
function createSettingsSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.insertSheet('Settings');
  
  const settings = [
    ['Setting', 'Value', 'Description'],
    ['language', 'es', 'Language code (es, fr, pt)'],
    ['githubRepo', 'The-Center-for-Unity/ubpod-new', 'GitHub repository (username/repo)'],
    ['baseUrl', 'https://raw.githubusercontent.com/The-Center-for-Unity/ubpod-new/french-translation', 'Base URL for JSON files'],
    ['screenshotApiKey', '', 'API key for screenshot service (optional)']
  ];
  
  sheet.getRange(1, 1, settings.length, 3).setValues(settings);
  
  // Format headers
  sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 3);
}

// Show import dialog
function showImportDialog() {
  const html = HtmlService.createHtmlOutputFromFile('ImportDialog')
    .setWidth(400)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, 'Import Translations');
}

// Show help dialog
function showHelp() {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>UBPod Translation Review System</h2>
      <h3>Getting Started:</h3>
      <ol>
        <li>Configure settings in the Settings sheet</li>
        <li>Use "Import JSON Files" to load translations</li>
        <li>Review and edit translations in column D</li>
        <li>Update status to "Approved" when ready</li>
        <li>Use "Export Reviewed" to download JSON files</li>
      </ol>
      <h3>Tips:</h3>
      <ul>
        <li>Use Ctrl+F to search for specific strings</li>
        <li>Filter by status to see pending items</li>
        <li>Add notes for complex translations</li>
        <li>Screenshots update automatically if API key is configured</li>
      </ul>
    </div>
  `;
  
  const htmlOutput = HtmlService.createHtmlOutput(html)
    .setWidth(500)
    .setHeight(400);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Help');
}

// Apply formatting to translation sheets
function formatTranslationSheet(sheet) {
  // Set headers
  const headers = ['Path', 'English Original', 'Current Translation', 
                   'Proposed Translation', 'Status', 'Reviewer Notes', 
                   'Last Modified', 'Modified By'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  
  // Set column widths
  sheet.setColumnWidth(1, 250); // Path
  sheet.setColumnWidth(2, 300); // English
  sheet.setColumnWidth(3, 300); // Current Translation
  sheet.setColumnWidth(4, 300); // Proposed Translation
  sheet.setColumnWidth(5, 100); // Status
  sheet.setColumnWidth(6, 200); // Notes
  sheet.setColumnWidth(7, 120); // Last Modified
  sheet.setColumnWidth(8, 150); // Modified By
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Add data validation for Status column
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Pending', 'Approved', 'Rejected'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 5, sheet.getMaxRows() - 1, 1).setDataValidation(statusRule);
  
  // Add conditional formatting
  const rules = [];
  
  // Green for Approved
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Approved')
    .setBackground('#b7e1cd')
    .setRanges([sheet.getRange(2, 5, sheet.getMaxRows() - 1, 1)])
    .build());
  
  // Yellow for Pending
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Pending')
    .setBackground('#ffe599')
    .setRanges([sheet.getRange(2, 5, sheet.getMaxRows() - 1, 1)])
    .build());
  
  // Red for Rejected
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Rejected')
    .setBackground('#f4cccc')
    .setRanges([sheet.getRange(2, 5, sheet.getMaxRows() - 1, 1)])
    .build());
  
  sheet.setConditionalFormatRules(rules);
}

// Show settings
function showSettings() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('Settings');
  
  if (!sheet) {
    createSettingsSheet();
    sheet = spreadsheet.getSheetByName('Settings');
  }
  
  // Switch to settings sheet
  spreadsheet.setActiveSheet(sheet);
  
  SpreadsheetApp.getUi().alert(
    'Settings',
    'The Settings sheet is now active. Update the values as needed:\n\n' +
    '• language: The language code (es, fr, or pt)\n' +
    '• githubRepo: Your GitHub username/repo\n' +
    '• baseUrl: The URL to your JSON files\n' +
    '• screenshotApiKey: Optional API key for screenshots',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// Update from GitHub (placeholder for menu)
function updateFromGitHub() {
  // This just calls the import function for now
  importTranslations();
}

// Generate status report
function generateStatusReport() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    updateStatusSheet();
    
    // Switch to status sheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const statusSheet = spreadsheet.getSheetByName('Review Status');
    if (statusSheet) {
      spreadsheet.setActiveSheet(statusSheet);
    }
    
    ui.alert('Success', 'Status report has been generated!', ui.ButtonSet.OK);
  } catch (error) {
    ui.alert('Error', 'Failed to generate status report: ' + error.toString(), ui.ButtonSet.OK);
  }
}