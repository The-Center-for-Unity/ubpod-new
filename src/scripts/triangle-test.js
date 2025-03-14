import { getProjects } from './airtable-test.js';
import { writeFileSync } from 'fs';

// Calculate position using raw affinity values
function calculateAffinityPosition(affinities) {
  const total = affinities.discovery + affinities.connection + affinities.wisdom;
  
  const normalized = {
    discovery: affinities.discovery / total,
    connection: affinities.connection / total,
    wisdom: affinities.wisdom / total
  };

  // Triangle vertices in normalized space (0-1)
  const vertices = {
    discovery: { x: 0.5, y: 0 },    // Top
    connection: { x: 0, y: 1 },      // Bottom Left
    wisdom: { x: 1, y: 1 }          // Bottom Right
  };

  // Barycentric coordinates calculation
  const x = normalized.discovery * vertices.discovery.x + 
           normalized.connection * vertices.connection.x + 
           normalized.wisdom * vertices.wisdom.x;
  
  const y = normalized.discovery * vertices.discovery.y + 
           normalized.connection * vertices.connection.y + 
           normalized.wisdom * vertices.wisdom.y;

  return { x, y };
}

// Convert focus level to percentage
function getFocusPercentage(level) {
  switch (level) {
    case 'max': return 1;      // 100%
    case 'high': return 0.75;  // 75%
    case 'medium': return 0.5; // 50%
    case 'low': return 0.25;   // 25%
    case 'none': return 0;     // 0%
  }
}

// Calculate position using focus levels
function calculateFocusPosition(focus) {
  const affinities = {
    discovery: getFocusPercentage(focus.discovery),
    connection: getFocusPercentage(focus.connection),
    wisdom: getFocusPercentage(focus.wisdom)
  };

  return calculateAffinityPosition(affinities);
}

async function comparePositions() {
  try {
    const projects = await getProjects();
    const approvedProjects = projects.filter(p => p.permissionGranted);

    const results = {
      timestamp: new Date().toISOString(),
      projects: approvedProjects.map(project => ({
        name: project.name,
        affinityValues: project.affinities,
        focusLevels: project.focus,
        positions: {
          fromAffinity: calculateAffinityPosition(project.affinities),
          fromFocus: calculateFocusPosition(project.focus)
        }
      }))
    };

    // Create timestamped filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `triangle-comparison-${timestamp}.json`;
    
    // Write to file
    writeFileSync(filename, JSON.stringify(results, null, 2));
    console.log(`Results written to ${filename}`);
  } catch (error) {
    console.error('Error comparing positions:', error);
  }
}

// Run the comparison
comparePositions(); 