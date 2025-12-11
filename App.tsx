import React, { useState } from 'react';
import { PatientData, AnalysisResult } from './types';
import { generateOrthopedicInsight } from './services/geminiService';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import { Stethoscope, User, Clock, Key } from 'lucide-react';

// [중요] Vite 방식(import.meta.env)으로 키를 가져옵니다.
const API_KEY = import.meta.env.VITE_API_KEY;

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  const handleAnalyze = async (data: PatientData) => {
    // [수정] 위에서 가져온 API_KEY 변수를 검사합니다.
    if (!API_KEY) {
       setApiKeyMissing(true);
       return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null); 
    
    try {
      const result = await generateOrthopedicInsight(data);
      setAnalysisResult(result);
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-medical-900 text-slate-100 font-sans flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-medical-accent rounded-lg flex items-center justify-center text-white shadow shadow-sky-500/20">
            <Stethoscope size={20} />
          </div>
          <div>
             <h1 className="font-bold text-lg tracking-tight">Dr. Hwang's Ortho-Insight</h1>
             <span className="text-[10px] text-slate-500 uppercase font-medium tracking-wider block -mt-1">AI Clinical Assistant Ver 2.5</span>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-sm text-slate-400">
          <div className="flex items-center space-x-2">
            <User size={14} />
            <span>Prof. Hwang Il-Ung</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={14} />
            <span className="text-medical-success font-medium">System Ready</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Input */}
        <section className="w-[450px] bg-slate-900/50 flex flex-col border-r border-slate-800">
          <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Patient Intake</h2>
          </div>
          <div className="flex-1 p-4 overflow-hidden">
            <InputPanel onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
          </div>
        </section>

        {/* Right Panel: Output */}
        <section className="flex-1 bg-slate-900 flex flex-col">
          <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm flex justify-between items-center sticky top-0 z-10">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Clinical Analysis & Insights</h2>
            {analysisResult && (
               <button 
                  onClick={() => setAnalysisResult(null)}
                  className="text-xs text-slate-500 hover:text-slate-300"
               >
                  Clear Results
               </button>
            )}
          </div>
          <div className="flex-1 p-6 overflow-hidden">
            {apiKeyMissing ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="bg-red-500/10 p-4 rounded-full mb-4">
                     <Key size={32} className="text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">API Key Missing</h3>
                  <p className="text-slate-400 max-w-md">
                    To use this application, make sure you have added 
                    <span className="text-white font-mono mx-1">VITE_API_KEY</span> 
                    to your Vercel Environment Variables.
                  </p>
              </div>
            ) : (
              <OutputPanel result={analysisResult} loading={isAnalyzing} />
            )}
          </div>
        </section>

      </main>
    </div>
  );
};

export default App;
