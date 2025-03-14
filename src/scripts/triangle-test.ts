import { Project, FocusLevel } from '../types';
import { getProjects } from '../services/airtable';

interface Position {
  x: number;
  y: number;
}

// Calculate position using raw affinity values
function calculateAffinityPosition(affinities: Project['affinities']): Position {
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
function getFocusPercentage(level: FocusLevel): number {
  switch (level) {
    case 'max': return 1;      // 100%
    case 'high': return 0.75;  // 75%
    case 'medium': return 0.5; // 50%
    case 'low': return 0.25;   // 25%
    case 'none': return 0;     // 0%
  }
}

// Calculate position using focus levels
function calculateFocusPosition(focus: Project['focus']): Position {
  const affinities = {
    discovery: getFocusPercentage(focus.discovery),
    connection: getFocusPercentage(focus.connection),
    wisdom: getFocusPercentage(focus.wisdom)
  };

  return calculateAffinityPosition(affinities);
}

interface ComparisonResult {
  name: string;
  affinityValues: {
    discovery: number;
    connection: number;
    wisdom: number;
  };
  focusLevels: {
    discovery: FocusLevel;
    connection: FocusLevel;
    wisdom: FocusLevel;
  };
  positions: {
    fromAffinity: Position;
    fromFocus: Position;
  };
}

async function comparePositions(): Promise<void> {
  try {
    const projects = await getProjects();
    const approvedProjects = projects.filter(p => p.permissionGranted);

    const results: ComparisonResult[] = approvedProjects.map(project => ({
      name: project.name,
      affinityValues: project.affinities,
      focusLevels: project.focus,
      positions: {
        fromAffinity: calculateAffinityPosition(project.affinities),
        fromFocus: calculateFocusPosition(project.focus)
      }
    }));

    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Error comparing positions:', error);
  }
}

// Run the comparison
comparePositions(); 