import React from 'react';

interface BodyChartProps {
  selectedParts: string[];
  onTogglePart: (partId: string) => void;
}

const BodyChart: React.FC<BodyChartProps> = ({ selectedParts, onTogglePart }) => {
  // Simplified body regions for the prototype
  // In a real app, this would be a detailed SVG path set
  const regions = [
    { id: 'Neck (C-Spine)', x: 100, y: 30, r: 15 },
    { id: 'Shoulder (R)', x: 65, y: 55, r: 12 },
    { id: 'Shoulder (L)', x: 135, y: 55, r: 12 },
    { id: 'Back (T-Spine)', x: 100, y: 80, r: 15 },
    { id: 'Elbow (R)', x: 50, y: 90, r: 10 },
    { id: 'Elbow (L)', x: 150, y: 90, r: 10 },
    { id: 'Lower Back (L-Spine)', x: 100, y: 110, r: 15 },
    { id: 'Hip/Pelvis', x: 100, y: 140, r: 20 },
    { id: 'Wrist/Hand (R)', x: 30, y: 130, r: 10 },
    { id: 'Wrist/Hand (L)', x: 170, y: 130, r: 10 },
    { id: 'Knee (R)', x: 80, y: 200, r: 12 },
    { id: 'Knee (L)', x: 120, y: 200, r: 12 },
    { id: 'Ankle/Foot (R)', x: 80, y: 260, r: 10 },
    { id: 'Ankle/Foot (L)', x: 120, y: 260, r: 10 },
  ];

  return (
    <div className="relative w-full h-80 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
      <div className="absolute top-2 left-2 text-xs text-slate-500">Visual Selector</div>
      
      {/* Abstract Body Representation using SVG */}
      <svg viewBox="0 0 200 300" className="h-full w-auto">
        {/* Connection Lines (Skeleton abstraction) */}
        <path d="M100 30 L100 140" stroke="#334155" strokeWidth="4" /> {/* Spine */}
        <path d="M65 55 L135 55" stroke="#334155" strokeWidth="4" /> {/* Shoulders */}
        <path d="M65 55 L30 130" stroke="#334155" strokeWidth="4" /> {/* R Arm */}
        <path d="M135 55 L170 130" stroke="#334155" strokeWidth="4" /> {/* L Arm */}
        <path d="M100 140 L80 260" stroke="#334155" strokeWidth="4" /> {/* R Leg */}
        <path d="M100 140 L120 260" stroke="#334155" strokeWidth="4" /> {/* L Leg */}

        {/* Interactive Nodes */}
        {regions.map((region) => {
          const isSelected = selectedParts.includes(region.id);
          return (
            <g 
              key={region.id} 
              onClick={() => onTogglePart(region.id)} 
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <circle
                cx={region.x}
                cy={region.y}
                r={region.r}
                fill={isSelected ? '#0ea5e9' : '#1e293b'}
                stroke={isSelected ? '#ffffff' : '#475569'}
                strokeWidth="2"
              />
              {isSelected && (
                <text 
                  x={region.x} 
                  y={region.y} 
                  textAnchor="middle" 
                  dy={4} 
                  fontSize="8" 
                  fill="white"
                  className="pointer-events-none font-bold"
                >
                  ✓
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      <div className="absolute bottom-2 right-2 text-xs text-slate-400">
        Selected: {selectedParts.length > 0 ? selectedParts.join(', ') : 'None'}
      </div>
    </div>
  );
};

export default BodyChart;
