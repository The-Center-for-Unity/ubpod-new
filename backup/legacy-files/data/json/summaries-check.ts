// Debugging file to check the structure of the summaries.json file
import fs from 'fs';
import path from 'path';

// Try to load the summaries.json file directly using fs
try {
  const summariesPath = path.join(__dirname, 'summaries.json');
  console.log('Checking if file exists at:', summariesPath);
  
  const fileExists = fs.existsSync(summariesPath);
  console.log('File exists:', fileExists);
  
  if (fileExists) {
    const fileContent = fs.readFileSync(summariesPath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    
    console.log('File loaded successfully.');
    console.log('Data type:', Array.isArray(jsonData) ? 'Array' : typeof jsonData);
    console.log('Data length:', Array.isArray(jsonData) ? jsonData.length : Object.keys(jsonData).length);
    console.log('Sample data:', Array.isArray(jsonData) ? jsonData.slice(0, 1) : Object.entries(jsonData).slice(0, 1));
    
    // Check if the personality of god entry exists
    if (Array.isArray(jsonData)) {
      const entry = jsonData.find(item => item.id === 'topic/the-personality-of-god');
      console.log('Found personality of god entry:', !!entry);
      if (entry) {
        console.log('Entry data:', entry);
      }
    }
  }
} catch (error) {
  console.error('Error checking summaries.json:', error);
}

// This file is just for debugging purposes and won't be imported anywhere
export {}; 