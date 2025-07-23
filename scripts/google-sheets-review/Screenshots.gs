// Screenshots.gs - Functions for managing screenshots

// Update screenshots for current language
function updateScreenshots() {
  const ui = SpreadsheetApp.getUi();
  const config = getConfig();
  
  if (!config.screenshotApiKey) {
    ui.alert(
      'Configuration Required',
      'Please add a screenshot API key in the Settings sheet.\n\n' +
      'You can use:\n' +
      '- screenshotmachine.com\n' +
      '- apiflash.com\n' +
      '- screenshotapi.net',
      ui.ButtonSet.OK
    );
    return;
  }
  
  const response = ui.alert(
    'Update Screenshots',
    `This will update screenshots for ${config.language.toUpperCase()}. Continue?`,
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) return;
  
  try {
    const folder = getOrCreateScreenshotFolder();
    const pages = getPageList();
    
    pages.forEach((page, index) => {
      try {
        ui.showModalDialog(
          HtmlService.createHtmlOutput(`Capturing screenshot ${index + 1} of ${pages.length}: ${page.name}...`)
            .setWidth(300)
            .setHeight(100),
          'Processing'
        );
        
        captureAndSaveScreenshot(page, config.language, folder);
        
      } catch (error) {
        console.error(`Failed to capture ${page.name}:`, error);
      }
    });
    
    ui.alert('Success', 'Screenshots updated successfully!', ui.ButtonSet.OK);
    
  } catch (error) {
    ui.alert('Error', 'Screenshot update failed: ' + error.toString(), ui.ButtonSet.OK);
  }
}

// Get or create screenshot folder
function getOrCreateScreenshotFolder() {
  const config = getConfig();
  const folderName = `UBPod Screenshots - ${config.language}`;
  
  // Check if folder exists
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  
  // Create new folder
  return DriveApp.createFolder(folderName);
}

// Get list of pages to screenshot
function getPageList() {
  return [
    { name: 'Home', path: '' },
    { name: 'Series List', path: 'series' },
    { name: 'Jesus Series 1', path: 'series/jesus-1' },
    { name: 'Jesus Episode 1-1', path: 'series/jesus-1/1' },
    { name: 'General Series 1', path: 'series/general-1' },
    { name: 'Urantia Papers', path: 'series/urantia-papers-1' },
    { name: 'Contact', path: 'contact' },
    { name: 'Disclaimer', path: 'disclaimer' }
  ];
}

// Capture and save screenshot
function captureAndSaveScreenshot(page, language, folder) {
  const config = getConfig();
  const baseUrl = 'https://ubpod.vercel.app';
  const pageUrl = `${baseUrl}/${language}/${page.path}`;
  
  // Using screenshotmachine.com as example
  const apiUrl = `https://api.screenshotmachine.com/?key=${config.screenshotApiKey}&url=${encodeURIComponent(pageUrl)}&dimension=1280x800&format=png&cacheLimit=0`;
  
  try {
    const response = UrlFetchApp.fetch(apiUrl);
    const blob = response.getBlob();
    blob.setName(`${page.name}_${language}.png`);
    
    // Check if file already exists and update it
    const existingFiles = folder.getFilesByName(blob.getName());
    if (existingFiles.hasNext()) {
      const existingFile = existingFiles.next();
      Drive.Files.update(
        { title: blob.getName() },
        existingFile.getId(),
        blob
      );
    } else {
      folder.createFile(blob);
    }
    
  } catch (error) {
    console.error(`Screenshot capture failed for ${page.name}:`, error);
    throw error;
  }
}

// Create screenshot reference sheet
function createScreenshotReference() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('Screenshot Reference');
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Screenshot Reference');
  }
  
  sheet.clear();
  
  // Headers
  const headers = ['Page Name', 'URL Path', 'Screenshot Link', 'Last Updated'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  
  // Get screenshot folder
  const config = getConfig();
  const folderName = `UBPod Screenshots - ${config.language}`;
  const folders = DriveApp.getFoldersByName(folderName);
  
  if (!folders.hasNext()) {
    sheet.getRange(2, 1).setValue('No screenshots found. Run "Update Screenshots" first.');
    return;
  }
  
  const folder = folders.next();
  const pages = getPageList();
  const data = [];
  
  pages.forEach(page => {
    const filename = `${page.name}_${config.language}.png`;
    const files = folder.getFilesByName(filename);
    
    if (files.hasNext()) {
      const file = files.next();
      data.push([
        page.name,
        page.path || '(home)',
        file.getUrl(),
        file.getLastUpdated()
      ]);
    } else {
      data.push([
        page.name,
        page.path || '(home)',
        'Not captured',
        ''
      ]);
    }
  });
  
  // Write data
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, headers.length).setValues(data);
  }
  
  // Format
  sheet.autoResizeColumns(1, headers.length);
  sheet.setColumnWidth(3, 300); // URL column
}

// Insert screenshot in cell
function insertScreenshotInCell(sheetName, row, column) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return;
  
  const config = getConfig();
  const folderName = `UBPod Screenshots - ${config.language}`;
  const folders = DriveApp.getFoldersByName(folderName);
  
  if (!folders.hasNext()) return;
  
  const folder = folders.next();
  const path = sheet.getRange(row, 1).getValue(); // Get path from first column
  
  // Determine which screenshot to show based on path
  let screenshotName = 'Home';
  if (path.includes('home')) screenshotName = 'Home';
  else if (path.includes('series') && !path.includes('episodes')) screenshotName = 'Series List';
  else if (path.includes('contact')) screenshotName = 'Contact';
  else if (path.includes('disclaimer')) screenshotName = 'Disclaimer';
  else if (path.includes('episode')) screenshotName = 'Jesus Episode 1-1';
  
  const filename = `${screenshotName}_${config.language}.png`;
  const files = folder.getFilesByName(filename);
  
  if (files.hasNext()) {
    const file = files.next();
    const formula = `=IMAGE("${file.getUrl()}", 4, 200, 150)`;
    sheet.getRange(row, column).setFormula(formula);
  }
}