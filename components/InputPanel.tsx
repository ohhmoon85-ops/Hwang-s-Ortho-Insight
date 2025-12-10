import React, { useState } from 'react';
import { PatientData, Gender, PainDuration } from '../types';
import BodyChart from './BodyChart';
import { Plus, X, Search } from 'lucide-react';

interface InputPanelProps {
  onAnalyze: (data: PatientData) => void;
  isAnalyzing: boolean;
}

const COMMON_TAGS = [
  'Trauma(+)', 'Night Pain', 'Radiating Pain', 'Numbness', 
  'Swelling', 'Clicking Sound', 'Instability', 'Morning Stiffness'
];

const HISTORY_ITEMS = [
  'Diabetes (DM)', 'Hypertension (HTN)', 'Previous Surgery', 
  'Osteoporosis', 'Rheumatoid Arthritis'
];

const InputPanel: React.FC<InputPanelProps> = ({ onAnalyze, isAnalyzing }) => {
  const [data, setData] = useState<PatientData>({
    age: 45,
    gender: Gender.Male,
    symptomKeywords: [],
    painScore: 5,
    duration: PainDuration.Subacute,
    history: [],
    selectedBodyParts: [],
    mainComplaint: ''
  });

  const [customTag, setCustomTag] = useState('');

  const toggleBodyPart = (partId: string) => {
    setData(prev => ({
      ...prev,
      selectedBodyParts: prev.selectedBodyParts.includes(partId)
        ? prev.selectedBodyParts.filter(id => id !== partId)
        : [...prev.selectedBodyParts, partId]
    }));
  };

  const toggleTag = (tag: string) => {
    setData(prev => ({
      ...prev,
      symptomKeywords: prev.symptomKeywords.includes(tag)
        ? prev.symptomKeywords.filter(t => t !== tag)
        : [...prev.symptomKeywords, tag]
    }));
  };

  const addCustomTag = () => {
    if (customTag && !data.symptomKeywords.includes(customTag)) {
      setData(prev => ({
        ...prev,
        symptomKeywords: [...prev.symptomKeywords, customTag]
      }));
      setCustomTag('');
    }
  };

  const toggleHistory = (item: string) => {
    setData(prev => ({
      ...prev,
      history: prev.history.includes(item)
        ? prev.history.filter(h => h !== item)
        : [...prev.history, item]
    }));
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto pr-2 custom-scrollbar">
      
      {/* Patient Demographics */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Age</label>
          <input 
            type="number" 
            value={data.age}
            onChange={(e) => setData({...data, age: parseInt(e.target.value) || 0})}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 focus:border-medical-accent outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Gender</label>
          <div className="flex bg-slate-800 rounded p-1 border border-slate-700">
            <button 
              onClick={() => setData({...data, gender: Gender.Male})}
              className={`flex-1 rounded py-1 text-sm ${data.gender === Gender.Male ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Male
            </button>
            <button 
              onClick={() => setData({...data, gender: Gender.Female})}
              className={`flex-1 rounded py-1 text-sm ${data.gender === Gender.Female ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Female
            </button>
          </div>
        </div>
      </div>

      {/* Body Chart */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2">Pain Location (Click to Select)</label>
        <BodyChart selectedParts={data.selectedBodyParts} onTogglePart={toggleBodyPart} />
      </div>

      {/* Chief Complaint Text */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Chief Complaint (Detailed)</label>
        <textarea
          value={data.mainComplaint}
          onChange={(e) => setData({...data, mainComplaint: e.target.value})}
          placeholder="e.g. Sharp pain when lifting arm overhead..."
          className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 focus:border-medical-accent outline-none h-20 text-sm resize-none"
        />
      </div>

      {/* VAS Slider */}
      <div>
        <div className="flex justify-between mb-1">
          <label className="text-xs font-medium text-slate-400">Pain Scale (VAS)</label>
          <span className="text-sm font-bold text-medical-accent">{data.painScore} / 10</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="10" 
          value={data.painScore} 
          onChange={(e) => setData({...data, painScore: parseInt(e.target.value)})}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-medical-accent"
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>None</span>
          <span>Moderate</span>
          <span>Severe</span>
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2">Duration</label>
        <div className="flex flex-col space-y-2">
          {Object.values(PainDuration).map((dur) => (
            <label key={dur} className="flex items-center space-x-2 cursor-pointer group">
              <input 
                type="radio" 
                name="duration"
                checked={data.duration === dur}
                onChange={() => setData({...data, duration: dur})}
                className="hidden"
              />
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${data.duration === dur ? 'border-medical-accent' : 'border-slate-600'}`}>
                {data.duration === dur && <div className="w-2 h-2 rounded-full bg-medical-accent" />}
              </div>
              <span className={`text-sm ${data.duration === dur ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>{dur}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Symptom Tags */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2">Symptom Keywords</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {COMMON_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`text-xs px-2 py-1 rounded border transition-colors ${
                data.symptomKeywords.includes(tag) 
                  ? 'bg-medical-accent/20 border-medical-accent text-medical-accent' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
            placeholder="Add custom keyword..."
            className="flex-1 bg-slate-800 border border-slate-700 text-white rounded p-1.5 text-xs outline-none focus:border-medical-accent"
          />
          <button 
            onClick={addCustomTag}
            className="p-1.5 bg-slate-700 rounded hover:bg-slate-600 text-white"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* History */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2">Medical History</label>
        <div className="grid grid-cols-1 gap-2">
          {HISTORY_ITEMS.map(item => (
            <label key={item} className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={data.history.includes(item)}
                onChange={() => toggleHistory(item)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-medical-accent focus:ring-offset-slate-900"
              />
              <span className="text-sm text-slate-300">{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="sticky bottom-0 pt-4 pb-2 bg-slate-900 border-t border-slate-800">
        <button
          onClick={() => onAnalyze(data)}
          disabled={isAnalyzing || data.selectedBodyParts.length === 0}
          className={`w-full py-3 rounded-lg flex items-center justify-center font-bold text-lg transition-all ${
            isAnalyzing 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
              : data.selectedBodyParts.length === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-medical-accent hover:bg-sky-400 text-white shadow-lg shadow-sky-900/50'
          }`}
        >
          {isAnalyzing ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Case...
            </span>
          ) : (
            <>
              <Search className="mr-2" size={20} />
              Ask Ortho-Insight
            </>
          )}
        </button>
        {data.selectedBodyParts.length === 0 && (
          <p className="text-center text-xs text-medical-danger mt-2">Please select a pain location.</p>
        )}
      </div>

    </div>
  );
};

export default InputPanel;
