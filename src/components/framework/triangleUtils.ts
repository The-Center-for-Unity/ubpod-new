// src/components/framework/triangleUtils.ts
import { Project, Position, FocusLevel } from '../../types';

interface ProjectPositions {
  fromFocus: Position;
}

// Convert focus level to percentage
function getFocusPercentage(level: FocusLevel): number {
  switch (level) {
    case 'maximal': return 1;      // 100%
    case 'very high': return 0.875; // 87.5%
    case 'high': return 0.75;      // 75%
    case 'strong': return 0.625;   // 62.5%
    case 'balanced': return 0.5;   // 50%
    case 'moderate': return 0.375; // 37.5%
    case 'low': return 0.25;       // 25%
    case 'barely': return 0.125;   // 12.5%
    case 'none': return 0;         // 0%
  }
}

function calculatePosition(values: { discovery: number; connection: number; wisdom: number }): Position {
  const total = values.discovery + values.connection + values.wisdom;
  
  // Handle case where all values are 0
  if (total === 0) {
    return { x: 0.5, y: 0.5 }; // Center of triangle
  }

  const normalized = {
    discovery: values.discovery / total,
    connection: values.connection / total,
    wisdom: values.wisdom / total
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

function calculateFocusPosition(focus: Project['focus']): Position {
  const values = {
    discovery: getFocusPercentage(focus.discovery),
    connection: getFocusPercentage(focus.connection),
    wisdom: getFocusPercentage(focus.wisdom)
  };

  return calculatePosition(values);
}

export function calculateProjectPositions(
  projects: Project[],
  threshold: number = 0.05
): Map<string, ProjectPositions> {
  const basePositions = projects.map(project => ({
    id: project.id,
    position: calculateFocusPosition(project.focus)
  }));

  const positionGroups = new Map<string, Project[]>();
  
  projects.forEach(project => {
    const position = basePositions.find(p => p.id === project.id)!;
    const key = `${Math.round(position.position.x / threshold)},${Math.round(position.position.y / threshold)}`;
    
    const group = positionGroups.get(key) || [];
    group.push(project);
    positionGroups.set(key, group);
  });

  const finalPositions = new Map<string, ProjectPositions>();
  
  positionGroups.forEach((group, key) => {
    if (group.length === 1) {
      const position = basePositions.find(p => p.id === group[0].id)!;
      finalPositions.set(group[0].id, {
        fromFocus: position.position
      });
    } else {
      const basePosition = basePositions.find(p => p.id === group[0].id)!;
      const orbitRadius = 0.04;
      
      group.forEach((project, index) => {
        const angle = (2 * Math.PI * index) / group.length;
        const offset = {
          x: Math.cos(angle) * orbitRadius,
          y: Math.sin(angle) * orbitRadius
        };
        
        finalPositions.set(project.id, {
          fromFocus: {
            x: basePosition.position.x + offset.x,
            y: basePosition.position.y + offset.y
          }
        });
      });
    }
  });

  return finalPositions;
}