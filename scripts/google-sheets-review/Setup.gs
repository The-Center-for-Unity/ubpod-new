// Setup.gs - Functions to initialize the spreadsheet structure

// Create all required sheets
function initializeSpreadsheet() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Initialize Spreadsheet',
    'This will create all required sheets for the translation review system. Continue?',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) return;
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // List of required sheets
  const requiredSheets = ['UI Translations'];
  
  // Add all Jesus series sheets (1-14)
  for (let i = 1; i <= 14; i++) {
    requiredSheets.push(`Content - Jesus ${i}`);
  }
  
  // Add all Cosmic series sheets (1-14)
  for (let i = 1; i <= 14; i++) {
    requiredSheets.push(`Content - Cosmic ${i}`);
  }
  
  // Add other required sheets
  requiredSheets.push(
    'Content - Urantia Papers',
    'Review Status',
    'Screenshot Reference'
  );
  
  // Create sheets if they don't exist
  requiredSheets.forEach(sheetName => {
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      
      // Format translation sheets
      if (sheetName.startsWith('UI Translations') || sheetName.startsWith('Content -')) {
        formatTranslationSheet(sheet);
      }
    }
  });
  
  // Create Settings sheet if it doesn't exist
  if (!spreadsheet.getSheetByName('Settings')) {
    createSettingsSheet();
  }
  
  // Remove default Sheet1 if it exists
  const sheet1 = spreadsheet.getSheetByName('Sheet1');
  if (sheet1 && spreadsheet.getSheets().length > 1) {
    spreadsheet.deleteSheet(sheet1);
  }
  
  ui.alert('Success', 'Spreadsheet initialized successfully! You can now import translations.', ui.ButtonSet.OK);
}

// Quick setup function to call from menu
function quickSetup() {
  initializeSpreadsheet();
}