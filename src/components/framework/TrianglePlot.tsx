// src/components/framework/TrianglePlot.tsx
import React from 'react';
import { Project, Domain, Provider } from '../../types';
import { calculateProjectPositions } from './triangleUtils';

interface TrianglePlotProps {
  projects: Project[];
  domains: Domain[];
  providers: Provider[];
}

export function TrianglePlot({ projects, domains, providers }: TrianglePlotProps) {
  // Filter providers with permission
  const approvedProviders = providers.filter(provider => provider.permissionGranted);

  // Filter projects with permission and from approved providers
  const approvedProjects = projects.filter(project => 
    project.permissionGranted && 
    approvedProviders.some(provider => provider.id === project.providerId)
  );

  const projectPositions = calculateProjectPositions(approvedProjects);

  // SVG coordinate space
  const TRIANGLE_TOP = 2;
  const TRIANGLE_BOTTOM = 84.6;
  const TRIANGLE_LEFT = 2;
  const TRIANGLE_RIGHT = 98;

  // Function to map normalized coordinates to SVG space
  function mapToSVGSpace(normalizedPos: { x: number, y: number }) {
    return {
      x: TRIANGLE_LEFT + (normalizedPos.x * (TRIANGLE_RIGHT - TRIANGLE_LEFT)),
      y: TRIANGLE_TOP + (normalizedPos.y * (TRIANGLE_BOTTOM - TRIANGLE_TOP))
    };
  }

  return (
    <div className="mt-8">
      <div className="max-w-2xl mx-auto space-y-3">
        <p className="text-center body-lg text-white/70">
          Each dot represents a project's position based on its focus levels across the three domains:
        </p>
        <div className="flex justify-center items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-400"/>
            <span className="text-white/70">Project Focus</span>
          </div>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 mt-8">
        <div className="w-full aspect-[1.2] sm:aspect-[1.4] bg-navy-light/30 rounded-xl border border-white/10 p-4">
          <svg 
            viewBox="-5 -5 110 110" 
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <radialGradient id="dotGradientPurple">
                <stop offset="50%" stopColor="rgb(167, 139, 250)" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="rgb(167, 139, 250)" stopOpacity="0.4"/>
              </radialGradient>
            </defs>

            <g>
              {/* Base triangle */}
              <path 
                d={`M${TRIANGLE_LEFT},${TRIANGLE_BOTTOM} L${(TRIANGLE_LEFT + TRIANGLE_RIGHT) / 2},${TRIANGLE_TOP} L${TRIANGLE_RIGHT},${TRIANGLE_BOTTOM} Z`}
                fill="none" 
                stroke="currentColor" 
                className="text-white/20"
                strokeWidth="0.75"
              />
              
              {/* Grid lines */}
              <g stroke="currentColor" strokeWidth="0.35" className="text-white/10">
                <line 
                  x1={TRIANGLE_LEFT + (TRIANGLE_RIGHT - TRIANGLE_LEFT) * 0.25} 
                  y1={TRIANGLE_TOP + (TRIANGLE_BOTTOM - TRIANGLE_TOP) * 0.5}
                  x2={TRIANGLE_LEFT + (TRIANGLE_RIGHT - TRIANGLE_LEFT) * 0.75}
                  y2={TRIANGLE_TOP + (TRIANGLE_BOTTOM - TRIANGLE_TOP) * 0.5}
                />
                <line 
                  x1={TRIANGLE_LEFT + (TRIANGLE_RIGHT - TRIANGLE_LEFT) * 0.125}
                  y1={TRIANGLE_TOP + (TRIANGLE_BOTTOM - TRIANGLE_TOP) * 0.75}
                  x2={TRIANGLE_LEFT + (TRIANGLE_RIGHT - TRIANGLE_LEFT) * 0.875}
                  y2={TRIANGLE_TOP + (TRIANGLE_BOTTOM - TRIANGLE_TOP) * 0.75}
                />
                <line 
                  x1={(TRIANGLE_LEFT + TRIANGLE_RIGHT) / 2}
                  y1={TRIANGLE_TOP}
                  x2={TRIANGLE_LEFT}
                  y2={TRIANGLE_BOTTOM}
                />
                <line 
                  x1={(TRIANGLE_LEFT + TRIANGLE_RIGHT) / 2}
                  y1={TRIANGLE_TOP}
                  x2={TRIANGLE_RIGHT}
                  y2={TRIANGLE_BOTTOM}
                />
                <line 
                  x1={TRIANGLE_LEFT}
                  y1={TRIANGLE_BOTTOM}
                  x2={TRIANGLE_RIGHT}
                  y2={TRIANGLE_BOTTOM}
                />
              </g>

              {/* Domain labels */}
              <text 
                x={(TRIANGLE_LEFT + TRIANGLE_RIGHT) / 2}
                y={TRIANGLE_TOP - 4}
                textAnchor="middle"
                fill={domains.find(d => d.id === 'discovery')?.color}
                className="text-[3px] font-bold"
              >
                Discovery
              </text>
              <text 
                x={TRIANGLE_LEFT - 2}
                y={TRIANGLE_BOTTOM + 4}
                textAnchor="end"
                fill={domains.find(d => d.id === 'connection')?.color}
                className="text-[3px] font-bold"
              >
                Connection
              </text>
              <text 
                x={TRIANGLE_RIGHT + 2}
                y={TRIANGLE_BOTTOM + 4}
                textAnchor="start"
                fill={domains.find(d => d.id === 'wisdom')?.color}
                className="text-[3px] font-bold"
              >
                Wisdom
              </text>

              {/* Project dots */}
              {approvedProjects.map((project) => {
                const positions = projectPositions.get(project.id);
                if (!positions) return null;

                const svgPosFocus = mapToSVGSpace(positions.fromFocus);

                return (
                  <g key={project.id}>
                    {/* Focus dot */}
                    <g className="group">
                      <circle
                        cx={svgPosFocus.x}
                        cy={svgPosFocus.y}
                        r="1.8"
                        fill="url(#dotGradientPurple)"
                      />
                      {/* Background for better readability */}
                      <rect
                        x={svgPosFocus.x - 12}
                        y={svgPosFocus.y - 5}
                        width="24"
                        height="3.5"
                        rx="1"
                        className="fill-navy opacity-0 group-hover:opacity-95 transition-opacity"
                      />
                      <text
                        x={svgPosFocus.x}
                        y={svgPosFocus.y - 2.8}
                        textAnchor="middle"
                        className="text-[2.8px] font-medium fill-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      >
                        {project.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}