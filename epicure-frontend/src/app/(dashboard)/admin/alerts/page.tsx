"use client";

import React, { useState, useRef } from "react";
import { AlertTriangle, TrendingDown, Database, Cpu, Filter, ChevronDown, ChevronUp, Database as DatabaseIcon, Plus, ShieldAlert, RefreshCw } from "lucide-react";
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
  ArcElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useGlobalFilters } from "@/context/GlobalFiltersContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AlertsPage() {
  const { branch } = useGlobalFilters();

  const [showOutput, setShowOutput] = useState(false);
  const [alertType, setAlertType] = useState("All");
  const [severity, setSeverity] = useState("All");
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const [manualSeedTrigger, setManualSeedTrigger] = useState(0);

  const seedStr = alertType + severity + branch + manualSeedTrigger;
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

  // Chart: Alerts Over Time
  const timelineData = {
    labels: showOutput ? ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'] : [],
    datasets: [{
      label: 'System Alerts Logged',
      data: showOutput ? [2 * kpiMultiplier, 1 * kpiMultiplier, 5 * kpiMultiplier, 2 * kpiMultiplier, 8 * kpiMultiplier, 3 * kpiMultiplier, 1 * kpiMultiplier] : [],
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: true,
      borderDash: [5, 5],
    }]
  };

  // Chart: Alerts By Type (Grouped Horizontal Bar)
  const alertTypeData = {
    labels: showOutput ? ['Sales Drop', 'Inventory Risk', 'Model Drift', 'System Error'] : [],
    datasets: [
      {
        label: 'Current Week',
        data: showOutput ? [12 * kpiMultiplier, 25 * kpiMultiplier, 4 * kpiMultiplier, 1 * kpiMultiplier] : [],
        backgroundColor: '#3b82f6',
      },
      {
        label: 'Previous Week',
        data: showOutput ? [8 * kpiMultiplier, 20 * kpiMultiplier, 2 * kpiMultiplier, 3 * kpiMultiplier] : [],
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-outfit tracking-tight text-white/90">System Alerts Panel</h2>
        <p className="text-white/50 mt-1">Real-time monitoring of anomalies, stock risks, and AI model drift.</p>
      </div>

      {/* Manual Input Section (Always Open) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="w-full flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
              <DatabaseIcon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm text-white/50">Simulate system anomalies and generate risk detection events.</p>
            </div>
          </div>
        </div>

        <form ref={formRef} className="p-6 border-t border-white/10 space-y-8 bg-black/20" key={formKey} onSubmit={(e) => e.preventDefault()}>
          {/* Alert Inputs */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: 'Branch', type: 'select', options: ['Downtown Metro', 'Westside Mall', 'Airport Terminal'] },
                { label: 'Alert Type', type: 'select', options: ['Sales Drop', 'Inventory Risk', 'Model Drift', 'System Error'] },
                { label: 'Severity Level', type: 'select', options: ['Critical', 'High', 'Medium', 'Low'] },
                { label: 'Trigger Condition', type: 'text', placeholder: 'e.g. Sales < 50%' },
                { label: 'Timestamp', type: 'datetime-local' }
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-medium text-white/60 mb-1">{field.label}</label>
                  {field.type === 'select' ? (
                    <select required onChange={handleInputChange} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-red-500/50">
                      {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input required onChange={handleInputChange} type={field.type} defaultValue={field.type === 'number' ? "0" : undefined} placeholder={field.placeholder} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-red-500/50" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
            <button 
              onClick={handleGenerate}
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" /> Run Risk Detection
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



      {/* Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-red-500/30 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingDown className="w-16 h-16 text-red-500" /></div>
          <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center relative z-10"><TrendingDown className="w-6 h-6" /></div>
          <div className="relative z-10">
            <p className="text-white/50 text-sm font-medium">Sudden Sales Drop</p>
            <p className="text-xl font-bold text-white">{showOutput ? `Detected in ${branch}` : "0"}</p>
          </div>
        </div>

        <div className="bg-white/5 border border-amber-500/30 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5"><Database className="w-16 h-16 text-amber-500" /></div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center relative z-10"><Database className="w-6 h-6" /></div>
          <div className="relative z-10">
            <p className="text-white/50 text-sm font-medium">Stock-Out Risk</p>
            <p className="text-xl font-bold text-white">{showOutput ? `${Math.floor(4 * m)} Items Critical` : "0"}</p>
          </div>
        </div>

        <div className="bg-white/5 border border-purple-500/30 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5"><Cpu className="w-16 h-16 text-purple-500" /></div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center relative z-10"><Cpu className="w-6 h-6" /></div>
          <div className="relative z-10">
            <p className="text-white/50 text-sm font-medium">Model Drift Warning</p>
            <p className="text-xl font-bold text-white">{showOutput ? `XGBoost (R² < ${(0.8 * m).toFixed(2)})` : "0"}</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[350px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" /> Alerts Timeline
          </h3>
          <div className="flex-1 min-h-0"><Line data={timelineData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
        </div>
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[350px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/80 mb-6 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" /> Alerts by Type
          </h3>
          <div className="flex-1 flex flex-col justify-center gap-6">
             {['Sales Drop', 'Inventory Risk', 'Model Drift', 'System Error'].map((type, i) => {
               const vals = [12, 25, 4, 1];
               const max = 25;
               const width = showOutput ? (vals[i] / max) * 100 * m : 0;
               return (
                 <div key={type} className="space-y-1.5">
                   <div className="flex justify-between text-xs font-medium text-white/60">
                     <span>{type}</span>
                     <span>{showOutput ? Math.floor(vals[i] * m) : 0} alerts</span>
                   </div>
                   <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                     <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${width > 100 ? 100 : width}%` }}></div>
                   </div>
                 </div>
               );
             })}
          </div>
        </div>
      </div>

    </div>
  );
}
