import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScrapedSummary {
  id: string;
  shortSummary: string;
  fullSummary: string;
}

export async function scrapeDiscoverJesusSummaries(url: string): Promise<ScrapedSummary> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Extract the ID from the URL
    const urlParts = url.split('/');
    const id = urlParts[urlParts.length - 1];
    
    // Get the short summary (under the title)
    const shortSummary = $('.entry-subtitle').first().text().trim();
    
    // Get the full summary (from the summary section)
    const fullSummary = $('.summary-section').first().text().trim();
    
    return {
      id,
      shortSummary,
      fullSummary
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    throw error;
  }
}

export async function scrapeAllDiscoverJesusSummaries(): Promise<ScrapedSummary[]> {
  // List of all URLs to scrape
  const urls = [
    'https://discoverjesus.com/person/abner',
    'https://discoverjesus.com/person/andrew',
    // Add more URLs here
  ];
  
  const summaries: ScrapedSummary[] = [];
  
  for (const url of urls) {
    try {
      const summary = await scrapeDiscoverJesusSummaries(url);
      summaries.push(summary);
      // Add a small delay to be respectful to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to scrape ${url}`);
    }
  }
  
  return summaries;
}

// Helper function to save the scraped data to a file
export async function saveSummariesToFile(summaries: ScrapedSummary[]): Promise<void> {
  const fs = require('fs');
  const path = require('path');
  
  const outputPath = path.join(__dirname, '../data/discoverJesusSummaries.ts');
  
  const fileContent = `
// Auto-generated from scrapeUtils.ts
export interface DiscoverJesusSummary {
  id: string;
  shortSummary: string;
  fullSummary: string;
}

export const discoverJesusSummaries: Record<string, DiscoverJesusSummary> = ${
    JSON.stringify(
      summaries.reduce((acc, summary) => ({
        ...acc,
        [summary.id]: summary
      }), {}),
      null,
      2
    )
  };
`;

  fs.writeFileSync(outputPath, fileContent);
} 