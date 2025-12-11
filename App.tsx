import React, { useState } from 'react';
import { PatientData, AnalysisResult } from './types';
import { generateOrthopedicInsight } from './services/geminiService';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import { Stethoscope, User, Clock, Key, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  const handleAnalyze = async (data: PatientData) => {
    // Check if API key exists in environment
    if (!process.env.API_KEY) {
       setApiKeyMissing(true);
       return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null); // Reset previous result
    
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
              <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-900/80">
                 <div className="bg-red-500/10 p-6 rounded-full mb-6 border border-red-500/30">
                    <Key size={48} className="text-red-500" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-4">API Key Required</h3>
                 <div className="text-slate-400 max-w-lg space-y-4 text-left bg-slate-800 p-6 rounded-lg border border-slate-700">
                   <p className="flex items-start">
                     <span className="text-medical-accent mr-2 font-bold">1.</span>
                     Go to your Vercel Project Settings.
                   </p>
                   <p className="flex items-start">
                     <span className="text-medical-accent mr-2 font-bold">2.</span>
                     Navigate to <strong className="text-white mx-1">Environment Variables</strong> via the sidebar.
                   </p>
                   <p className="flex items-start">
                     <span className="text-medical-accent mr-2 font-bold">3.</span>
                     Add a new variable:
                   </p>
                   <div className="bg-black/50 p-3 rounded font-mono text-sm text-green-400 border border-slate-600">
                     Key: VITE_API_KEY<br/>
                     Value: AIza... (your Gemini API Key)
                   </div>
                   <p className="flex items-start text-sm text-slate-500 mt-4 border-t border-slate-700 pt-3">
                     <Settings size={14} className="mr-1 mt-0.5" />
                     Note: You must <strong>Redeploy</strong> your app after saving the variable.
                   </p>
                 </div>
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