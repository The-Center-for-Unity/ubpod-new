// Import.gs - Functions for importing JSON translations into Google Sheets

// Main import function
function importTranslations(language = null) {
  const config = getConfig();
  const lang = language || config.language || 'es';
  
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Import Translations',
    `This will import ${lang.toUpperCase()} translations and overwrite existing data. Continue?`,
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) return;
  
  try {
    // Import UI translations
    importUITranslations(lang);
    
    // Import content translations
    importContentTranslations(lang);
    
    // Update status sheet
    updateStatusSheet();
    
    ui.alert('Success', 'Translations imported successfully!', ui.ButtonSet.OK);
  } catch (error) {
    ui.alert('Error', 'Import failed: ' + error.toString(), ui.ButtonSet.OK);
  }
}

// Import UI translations (home, series, episode, etc.)
function importUITranslations(language) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('UI Translations');
  if (!sheet) throw new Error('UI Translations sheet not found');
  
  // Clear existing data (keep headers)
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 8).clear();
  }
  
  const config = getConfig();
  const baseUrl = config.baseUrl || `https://raw.githubusercontent.com/${config.githubRepo}/main`;
  
  // UI files to import
  const uiFiles = ['home', 'series', 'series-page', 'series-detail', 'episode', 
                   'common', 'contact', 'disclaimer', 'series-collections'];
  
  let rowIndex = 2;
  const allRows = [];
  
  uiFiles.forEach(file => {
    try {
      // Fetch English version
      const enUrl = `${baseUrl}/src/locales/en/${file}.json`;
      const enData = fetchJsonFromUrl(enUrl);
      
      if (!enData) {
        console.warn(`Skipping ${file} - English file not found`);
        return;
      }
      
      // Fetch translated version
      const langUrl = `${baseUrl}/src/locales/${language}/${file}.json`;
      const langData = fetchJsonFromUrl(langUrl) || {};
      
      // Flatten and create rows
      const rows = flattenJson(enData, langData, file);
      allRows.push(...rows);
      
    } catch (error) {
      console.error(`Failed to import ${file}:`, error);
    }
  });
  
  // Write all rows at once
  if (allRows.length > 0) {
    sheet.getRange(2, 1, allRows.length, 8).setValues(allRows);
  }
  
  // Format the sheet
  formatTranslationSheet(sheet);
}

// Import content translations (episode content)
function importContentTranslations(language) {
  const config = getConfig();
  const baseUrl = config.baseUrl || `https://raw.githubusercontent.com/${config.githubRepo}/main`;
  
  try {
    // Fetch content.json
    const enUrl = `${baseUrl}/src/locales/en/content/content.json`;
    const langUrl = `${baseUrl}/src/locales/${language}/content/content.json`;
    
    const enContent = fetchJsonFromUrl(enUrl);
    const langContent = fetchJsonFromUrl(langUrl);
    
    // Process all series dynamically
    Object.entries(enContent).forEach(([seriesId, seriesData]) => {
      // Generate sheet name based on series ID
      let sheetName = '';
      
      if (seriesId.startsWith('jesus-')) {
        const num = seriesId.split('-')[1];
        sheetName = `Content - Jesus ${num}`;
      } else if (seriesId.startsWith('cosmic-')) {
        const num = seriesId.split('-')[1];
        sheetName = `Content - Cosmic ${num}`;
      } else if (seriesId === 'urantia-papers') {
        sheetName = 'Content - Urantia Papers';
      } else {
        // Handle any other series types
        sheetName = `Content - ${seriesId}`;
      }
      
      console.log(`Importing ${seriesId} to sheet: ${sheetName}`);
      importSeriesContent(sheetName, seriesId, seriesData, langContent[seriesId] || {});
    });
    
  } catch (error) {
    console.error('Failed to import content:', error);
    throw error;
  }
}

// Import content for a specific series
function importSeriesContent(sheetName, seriesId, enData, langData) {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
  }
  
  // Clear existing data
  sheet.clear();
  
  const allRows = [];
  
  // Add series title and description
  allRows.push([
    `${seriesId}.seriesTitle`,
    enData.seriesTitle,
    langData.seriesTitle || '',
    '', // Proposed translation
    'Pending',
    '', // Notes
    new Date(),
    Session.getActiveUser().getEmail()
  ]);
  
  allRows.push([
    `${seriesId}.seriesDescription`,
    enData.seriesDescription,
    langData.seriesDescription || '',
    '',
    'Pending',
    '',
    new Date(),
    Session.getActiveUser().getEmail()
  ]);
  
  // Add episodes
  if (enData.episodes) {
    Object.entries(enData.episodes).forEach(([episodeNum, enEpisode]) => {
      const langEpisode = langData.episodes?.[episodeNum] || {};
      
      // Add each field
      ['title', 'logline', 'episodeCard', 'summary'].forEach(field => {
        if (enEpisode[field]) {
          allRows.push([
            `${seriesId}.episodes.${episodeNum}.${field}`,
            enEpisode[field],
            langEpisode[field] || '',
            '',
            'Pending',
            '',
            new Date(),
            Session.getActiveUser().getEmail()
          ]);
        }
      });
    });
  }
  
  // Write all rows
  if (allRows.length > 0) {
    // Add headers first
    formatTranslationSheet(sheet);
    // Then add data
    sheet.getRange(2, 1, allRows.length, 8).setValues(allRows);
  }
}

// Flatten JSON object into rows
function flattenJson(enObj, langObj, prefix = '', rows = []) {
  for (const key in enObj) {
    const path = prefix ? `${prefix}.${key}` : key;
    
    if (typeof enObj[key] === 'object' && !Array.isArray(enObj[key]) && enObj[key] !== null) {
      flattenJson(enObj[key], langObj?.[key] || {}, path, rows);
    } else {
      rows.push([
        path,
        enObj[key] || '',
        langObj?.[key] || '',
        '', // Proposed translation
        'Pending',
        '', // Notes
        new Date(),
        Session.getActiveUser().getEmail()
      ]);
    }
  }
  return rows;
}

// Fetch JSON from URL
function fetchJsonFromUrl(url) {
  try {
    const response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() === 404) {
      console.warn(`File not found: ${url}`);
      return null;
    }
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`HTTP ${response.getResponseCode()}: ${response.getContentText()}`);
    }
    
    const content = response.getContentText();
    return JSON.parse(content);
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    throw new Error(`Failed to fetch from ${url}: ${error.message}`);
  }
}

// Update status sheet with import summary
function updateStatusSheet() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Review Status');
  
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Review Status');
  }
  
  sheet.clear();
  
  // Headers
  const headers = ['Sheet Name', 'Total Strings', 'Pending', 'Approved', 'Rejected', 'Progress %'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  
  // Get all sheets
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();
  const statusData = [];
  
  sheets.forEach(s => {
    const name = s.getName();
    if (name.startsWith('UI Translations') || name.startsWith('Content -')) {
      const data = s.getDataRange().getValues();
      if (data.length > 1) {
        let pending = 0, approved = 0, rejected = 0;
        
        for (let i = 1; i < data.length; i++) {
          const status = data[i][4]; // Status column
          if (status === 'Pending') pending++;
          else if (status === 'Approved') approved++;
          else if (status === 'Rejected') rejected++;
        }
        
        const total = data.length - 1; // Exclude header
        const progress = total > 0 ? Math.round((approved / total) * 100) : 0;
        
        statusData.push([name, total, pending, approved, rejected, progress + '%']);
      }
    }
  });
  
  // Write status data
  if (statusData.length > 0) {
    sheet.getRange(2, 1, statusData.length, headers.length).setValues(statusData);
  }
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
  
  // Add conditional formatting for progress
  const progressRule = SpreadsheetApp.newConditionalFormatRule()
    .setGradientMaxpoint('#00ff00')
    .setGradientMidpointWithValue('#ffff00', SpreadsheetApp.InterpolationType.PERCENT, '50')
    .setGradientMinpoint('#ff0000')
    .setRanges([sheet.getRange(2, 6, sheet.getLastRow() - 1, 1)])
    .build();
  
  sheet.setConditionalFormatRules([progressRule]);
}