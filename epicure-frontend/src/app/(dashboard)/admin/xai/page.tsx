"use client";

import React, { useState, useRef } from "react";
import { Sparkles, Info, Filter, ChevronDown, ChevronUp, Database, Search, BarChart2, RefreshCw } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function XAIPage() {
  const [showOutput, setShowOutput] = useState(false);
  const [modelSelect, setModelSelect] = useState("XGBoost_v2");
  const [featureSelect, setFeatureSelect] = useState("All");
  const [timePeriod, setTimePeriod] = useState("Last 30 Days");
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const [manualSeedTrigger, setManualSeedTrigger] = useState(0);

  const seedStr = modelSelect + featureSelect + timePeriod + manualSeedTrigger;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    const char = seedStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const m = 1 + (Math.abs(hash) % 20) / 100;

  const kpiMultiplier = showOutput ? m : 0;

  const handleInputChange = () => {
    if (showOutput) {
      setManualSeedTrigger(prev => prev + 1);
    }
  };

  const handleGenerate = () => {
    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }
    setShowOutput(true);
    setManualSeedTrigger(prev => prev + 1);
  };

  const handleReset = () => {
    setShowOutput(false);
    setManualSeedTrigger(0);
    setFormKey(prev => prev + 1);
  };

  // Chart: Feature Importance (Bar chart acting as SHAP value plot)
  const shapData = {
    labels: showOutput ? ['Day of Week', 'Temperature', 'Is Holiday', 'Previous Day Sales', 'Rainfall', 'Promotion Active'] : [],
    datasets: [{
      label: 'Mean |SHAP Value| (Impact on Model Output)',
      data: showOutput ? [1.2 * kpiMultiplier, 0.85 * kpiMultiplier, 0.75 * kpiMultiplier, 0.6 * kpiMultiplier, 0.4 * kpiMultiplier, 0.3 * kpiMultiplier] : [],
      backgroundColor: '#6366f1',
    }]
  };

  const shapOptions = {
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
  };

  // Chart: Prediction Breakdown (Waterfall simulation using standard Bar)
  const waterfallData = {
    labels: showOutput ? ['Base Value', 'Day of Week (+)', 'Temperature (-)', 'Promotion (+)', 'Final Prediction'] : [],
    datasets: [{
      label: 'Contribution',
      data: showOutput ? [1000 * kpiMultiplier, 200 * kpiMultiplier, -50 * kpiMultiplier, 150 * kpiMultiplier, 1300 * kpiMultiplier] : [],
      backgroundColor: (context: any) => {
        const val = context.raw;
        if (context.dataIndex === 0 || context.dataIndex === 4) return '#6b7280'; // Gray for base/final
        return val > 0 ? '#10b981' : '#ef4444'; // Green for pos, Red for neg
      },
    }]
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-outfit tracking-tight text-white/90">Explainable AI (XAI)</h2>
        <p className="text-white/50 mt-1">Unbox the black box: understand exactly why the AI makes its predictions.</p>
      </div>

      {/* Manual Input Section (Always Open) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="w-full flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm text-white/50">Supply theoretical feature values to observe their impact on AI predictions.</p>
            </div>
          </div>
        </div>

        <form ref={formRef} className="p-6 border-t border-white/10 space-y-8 bg-black/20" key={formKey} onSubmit={(e) => e.preventDefault()}>
          {/* Explainability Inputs */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: 'Feature Name', type: 'select', options: ['Day of Week', 'Temperature', 'Is Holiday', 'Previous Day Sales'] },
                { label: 'Sales Impact %', type: 'number', placeholder: '0' },
                { label: 'Promotion Effectiveness', type: 'select', options: ['High', 'Medium', 'Low'] },
                { label: 'Weather Data', type: 'text', placeholder: 'e.g. Heavy Rain' },
                { label: 'Seasonal Factors', type: 'select', options: ['Summer Peak', 'Winter Slump', 'Holiday Rush'] }
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-medium text-white/60 mb-1">{field.label}</label>
                  {field.type === 'select' ? (
                    <select required onChange={handleInputChange} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-cyan-500/50">
                      {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input required onChange={handleInputChange} type={field.type} defaultValue={field.type === 'number' ? "0" : undefined} placeholder={field.placeholder} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-cyan-500/50" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
            <button 
              onClick={handleGenerate}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" /> Explain Prediction
            </button>
            <button 
              onClick={handleReset}
              className="px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border border-rose-500/20 ml-auto"
            >
              <RefreshCw className="w-4 h-4" /> Reset Form
            </button>
          </div>
        </form>
      </div>



      {/* Insight Examples */}
      {showOutput ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-xl flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white/90 font-semibold mb-1">Weather severely impacts weekend sales</h4>
              <p className="text-sm text-white/60">The SHAP analysis reveals that rainfall over 10mm reduces weekend dine-in predictions by 18%, causing the model to recommend higher delivery staffing.</p>
            </div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-xl flex items-start gap-4">
            <Info className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white/90 font-semibold mb-1">"Promotion Active" is the strongest feature for Combos</h4>
              <p className="text-sm text-white/60">When the 'Promotion' flag is true, the predicted volume for combo meals spikes by 35%, making it the top influencing factor in the current model.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-12 text-center text-white/20">
          Explain prediction to see AI insights
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[400px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/80 mb-4">Global Feature Importance (SHAP Values)</h3>
          <div className="flex-1 min-h-0"><Bar data={shapData} options={shapOptions} /></div>
        </div>

        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[400px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/80 mb-4">Local Prediction Breakdown</h3>
          <p className="text-xs text-white/40 mb-4">Explaining prediction for Today, Downtown Branch</p>
          <div className="flex-1 min-h-0"><Bar data={waterfallData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
        </div>
      </div>
    </div>

  );
}
