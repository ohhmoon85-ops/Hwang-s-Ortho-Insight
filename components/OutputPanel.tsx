import React from 'react';
import { AnalysisResult } from '../types';
import { AlertTriangle, Activity, ClipboardList, ScanLine } from 'lucide-react';

interface OutputPanelProps {
  result: AnalysisResult | null;
  loading: boolean;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ result, loading }) => {
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 animate-pulse">
        <Activity size={48} className="mb-4 text-medical-accent opacity-50" />
        <p className="text-lg">Analyzing clinical data...</p>
        <p className="text-sm">Consulting medical models</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-600">
        <ClipboardList size={48} className="mb-4 opacity-20" />
        <p>Patient data input required.</p>
        <p className="text-sm">Select symptoms and click "Ask Ortho-Insight".</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto pr-2 custom-scrollbar">
      
      {/* 1. Differential Diagnoses Cards */}
      <div>
        <h3 className="text-medical-accent text-sm font-bold uppercase tracking-wider mb-3 flex items-center">
          <Activity size={16} className="mr-2" /> 
          Top 3 Differential Diagnoses
        </h3>
        <div className="space-y-3">
          {result.differentialDiagnoses.map((diagnosis, idx) => (
            <div 
              key={idx}
              className={`bg-slate-800 border-l-4 rounded-r p-4 transition-all hover:translate-x-1 ${
                idx === 0 ? 'border-l-medical-success shadow-md shadow-emerald-900/20' : 'border-l-slate-600 opacity-90'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-lg font-bold text-white">{diagnosis.name}</h4>
                <span className={`text-xs font-mono py-1 px-2 rounded ${
                  idx === 0 ? 'bg-medical-success/20 text-medical-success' : 'bg-slate-700 text-slate-400'
                }`}>
                  {diagnosis.probability}%
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-2 italic border-t border-slate-700/50 pt-2">
                "{diagnosis.rationale}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Red Flags (High Priority) */}
      {result.redFlags && result.redFlags.length > 0 && (
        <div className="bg-red-950/30 border border-medical-danger/40 rounded-lg p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-medical-danger"></div>
          <h3 className="text-medical-danger text-sm font-bold uppercase tracking-wider mb-2 flex items-center">
            <AlertTriangle size={16} className="mr-2" />
            Red Flags & Warnings
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {result.redFlags.map((flag, idx) => (
              <li key={idx} className="text-sm text-red-200 font-medium">{flag}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 3. Critical Checkpoints (To-Do) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <h3 className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-3 flex items-center">
            <ClipboardList size={14} className="mr-2" />
            Physical Exam / History
          </h3>
          <ul className="space-y-2">
            {result.criticalCheckpoints.map((point, idx) => (
              <li key={idx} className="flex items-start">
                <input type="checkbox" className="mt-1 mr-2 bg-slate-700 border-slate-600 rounded text-medical-accent focus:ring-0" />
                <span className="text-sm text-slate-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Recommended Workup */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <h3 className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-3 flex items-center">
            <ScanLine size={14} className="mr-2" />
            Imaging & Labs
          </h3>
          <ul className="space-y-2">
            {result.recommendedWorkup.map((work, idx) => (
              <li key={idx} className="flex items-center text-sm text-sky-200/80">
                <span className="w-1.5 h-1.5 bg-sky-500 rounded-full mr-2"></span>
                {work}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Footer Disclaimer */}
      <div className="pt-4 border-t border-slate-800">
        <p className="text-[10px] text-slate-600 text-center">
          AI generated content. Not a final diagnosis. Review required by Dr. Hwang.
        </p>
      </div>

    </div>
  );
};

export default OutputPanel;
