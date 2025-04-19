/**
 * generateMappings.ts - Utility to generate mappings from R2 objects
 * 
 * This script:
 * 1. Parses r2-objects.json to get all available files
 * 2. Matches them to series-episode combinations using episodes.json
 * 3. Generates the final mapping objects
 * 
 * Run with: npx ts-node scripts/generateMappings.ts
 */

import fs from 'fs';
import path from 'path';

// Load episodes.json and r2-objects.json 
const episodesJsonPath = path.resolve(__dirname, '../src/data/json/episodes.json');
const r2ObjectsPath = path.resolve(__dirname, '../synch-r2/r2-objects.json');

try {
  // Read and parse the files
  const episodesData = JSON.parse(fs.readFileSync(episodesJsonPath, 'utf8'));
  const r2Objects = JSON.parse(fs.readFileSync(r2ObjectsPath, 'utf8'));
  
  console.log(`Loaded episodes.json with ${Object.keys(episodesData).length} series`);
  console.log(`Loaded r2-objects.json with ${r2Objects.Contents?.length || 0} objects`);
  
  // Function to generate Jesus Series mappings
  function generateJesusMappings() {
    const jesusSeriesMapping: Record<string, { filename: string }> = {};
    let matchCount = 0;
    
    // Process each series in episodes.json
    Object.entries(episodesData).forEach(([seriesId, seriesData]: [string, any]) => {
      if (!seriesId.startsWith('jesus-')) return;
      
      // Process each episode in the series
      seriesData.episodes.forEach((episode: any, index: number) => {
        const episodeNumber = index + 1;
        const mappingKey = `${seriesId}-${episodeNumber}`;
        
        // Use the audioUrl from episodes.json
        const filename = episode.audioUrl;
        
        // Verify this file exists in r2-objects.json
        const fileExists = r2Objects.Contents?.some((item: any) => 
          item.Key === filename
        );
        
        if (fileExists) {
          jesusSeriesMapping[mappingKey] = { filename };
          matchCount++;
        } else {
          console.warn(`Warning: File not found in R2 bucket: ${filename} (${mappingKey})`);
        }
      });
    });
    
    console.log(`Generated ${matchCount} Jesus Series mappings`);
    return jesusSeriesMapping;
  }
  
  // Function to generate Cosmic Series mappings
  function generateCosmicMappings() {
    const cosmicSeriesMapping: Record<string, { filename: string }> = {};
    
    // Paper numbers used in cosmic series (from cosmic-series-urls.json or episodes.json)
    // This is a hard-coded mapping for now based on the episodes in the series
    const cosmicSeriesPaperMapping: Record<string, number> = {
      'cosmic-1-1': 1,   // The Universal Father
      'cosmic-1-2': 12,  // The Universe of Universes
      'cosmic-1-3': 13,  // The Sacred Spheres of Paradise
      'cosmic-1-4': 15,  // The Seven Superuniverses
      'cosmic-1-5': 42,  // Energy—Mind and Matter
      
      'cosmic-2-1': 6,   // The Eternal Son
      'cosmic-2-2': 8,   // The Infinite Spirit
      'cosmic-2-3': 10,  // The Paradise Trinity
      'cosmic-2-4': 20,  // The Paradise Sons of God
      'cosmic-2-5': 16,  // Ministering Spirits of Space
      
      'cosmic-3-1': 107, // Origin and Nature of Thought Adjusters
      'cosmic-3-2': 108, // Mission and Ministry of Thought Adjusters
      'cosmic-3-3': 110, // Relation of Adjusters to Individual Mortals
      'cosmic-3-4': 111, // The Adjuster and the Soul
      'cosmic-3-5': 112, // Personality Survival
      
      'cosmic-4-1': 32,  // The Evolution of Local Universes
      'cosmic-4-2': 33,  // Administration of the Local Universe
      'cosmic-4-3': 34,  // The Local Universe Mother Spirit
      'cosmic-4-4': 35,  // The Local Universe Sons of God
      'cosmic-4-5': 41,  // Physical Aspects of the Local Universe
      
      'cosmic-5-1': 38,  // Ministering Spirits of the Local Universe
      'cosmic-5-2': 39,  // The Seraphic Hosts
      'cosmic-5-3': 113, // Seraphic Guardians of Destiny
      'cosmic-5-4': 114, // Seraphic Planetary Government
      'cosmic-5-5': 77,  // The Midway Creatures
      
      'cosmic-6-1': 40,  // The Ascending Sons of God
      'cosmic-6-2': 47,  // The Seven Mansion Worlds
      'cosmic-6-3': 48,  // The Morontia Life
      'cosmic-6-4': 31,  // The Corps of the Finality
      'cosmic-6-5': 56,  // Universal Unity
      
      'cosmic-7-1': 57,  // The Origin of Urantia
      'cosmic-7-2': 65,  // Life Establishment on Urantia
      'cosmic-7-3': 62,  // The Dawn Races of Early Man
      'cosmic-7-4': 64,  // The Evolutionary Races of Color
      'cosmic-7-5': 66,  // The Planetary Prince of Urantia
      
      'cosmic-8-1': 53,  // The Lucifer Rebellion
      'cosmic-8-2': 54,  // Problems of the Lucifer Rebellion
      'cosmic-8-3': 67,  // The Planetary Rebellion
      'cosmic-8-4': 75,  // The Default of Adam and Eve
      'cosmic-8-5': 67,  // The Caligastia Betrayal
      
      'cosmic-9-1': 73,  // The Garden of Eden
      'cosmic-9-2': 74,  // Adam and Eve
      'cosmic-9-3': 76,  // The Second Garden
      'cosmic-9-4': 78,  // The Violet Race After the Days of Adam
      'cosmic-9-5': 75,  // The Default of Adam and Eve
      
      'cosmic-10-1': 93,  // Machiventa Melchizedek
      'cosmic-10-2': 94,  // The Melchizedek Teachings in the Orient
      'cosmic-10-3': 95,  // The Melchizedek Teachings in the Levant
      'cosmic-10-4': 96,  // Yahweh—God of the Hebrews
      'cosmic-10-5': 98,  // The Melchizedek Teachings in the Occident
      
      'cosmic-11-1': 85,  // The Origins of Worship
      'cosmic-11-2': 86,  // Early Evolution of Religion
      'cosmic-11-3': 87,  // The Ghost Cults
      'cosmic-11-4': 89,  // Sin, Sacrifice, and Atonement
      'cosmic-11-5': 92,  // The Later Evolution of Religion
      
      'cosmic-12-1': 100, // Religion in Human Experience
      'cosmic-12-2': 101, // The Real Nature of Religion
      'cosmic-12-3': 102, // The Foundations of Religious Faith
      'cosmic-12-4': 103, // The Reality of Religious Experience
      'cosmic-12-5': 196, // The Faith of Jesus
      
      'cosmic-13-1': 105, // Deity and Reality
      'cosmic-13-2': 106, // Universe Levels of Reality
      'cosmic-13-3': 115, // The Supreme Being
      'cosmic-13-4': 116, // The Almighty Supreme
      'cosmic-13-5': 117, // God the Supreme
      
      'cosmic-14-1': 3,   // God's Relation to the Universe
      'cosmic-14-2': 5,   // God's Relation to the Individual
      'cosmic-14-3': 7,   // Relation of the Eternal Son to the Universe
      'cosmic-14-4': 9,   // Relation of the Infinite Spirit to the Universe
      'cosmic-14-5': 104, // Trinity Union of Deity
    };
    
    // Create mappings based on the paper numbers
    Object.entries(cosmicSeriesPaperMapping).forEach(([mappingKey, paperNumber]) => {
      const filename = `paper-${paperNumber}.mp3`;
      cosmicSeriesMapping[mappingKey] = { filename };
    });
    
    console.log(`Generated ${Object.keys(cosmicSeriesMapping).length} Cosmic Series mappings`);
    return cosmicSeriesMapping;
  }
  
  // Generate the mappings
  const jesusSeriesMapping = generateJesusMappings();
  const cosmicSeriesMapping = generateCosmicMappings();
  
  // Write to files
  const outputDir = path.resolve(__dirname, '../src/data/json');
  
  fs.writeFileSync(
    path.join(outputDir, 'jesus-series-mappings.json'),
    JSON.stringify({ jesusSeriesMapping }, null, 2)
  );
  
  fs.writeFileSync(
    path.join(outputDir, 'cosmic-series-mappings.json'),
    JSON.stringify({ cosmicSeriesMapping }, null, 2)
  );
  
  console.log('Mapping files successfully generated.');
  
} catch (error) {
  console.error('Error generating mappings:', error);
} 