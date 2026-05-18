"use client";

import React, { useState, useRef } from "react";
import { Map, Filter, Building2, MapPin, ChevronDown, ChevronUp, Database, Scale, Trophy, RefreshCw } from "lucide-react";
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
import { Bar, Line } from 'react-chartjs-2';
import { useDate } from "@/context/DateContext";

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

export default function MultiBranchPage() {
  const { startDate, endDate } = useDate();
  
  const [showOutput, setShowOutput] = useState(false);
  const [region, setRegion] = useState("All");
  const [compareToggle, setCompareToggle] = useState(true);
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const [manualSeedTrigger, setManualSeedTrigger] = useState(0);

  const seedStr = region + String(compareToggle) + startDate + endDate + manualSeedTrigger;
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

  // Chart: Revenue Ranking
  const revenueRankingData = {
    labels: showOutput ? ['Tokyo', 'London', 'NY', 'Paris', 'Berlin'] : [],
    datasets: [
      {
        label: 'Gross Revenue',
        data: showOutput ? [150000 * kpiMultiplier, 142000 * kpiMultiplier, 138000 * kpiMultiplier, 95000 * kpiMultiplier, 88000 * kpiMultiplier] : [],
        backgroundColor: '#10b981',
      },
      {
        label: 'Operating Cost',
        data: showOutput ? [90000 * kpiMultiplier, 85000 * kpiMultiplier, 95000 * kpiMultiplier, 70000 * kpiMultiplier, 65000 * kpiMultiplier] : [],
        backgroundColor: '#3b82f6',
      }
    ]
  };

  // Chart: Trend Comparison
  const trendComparisonData = {
    labels: showOutput ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] : [],
    datasets: [
      {
        label: 'Tokyo',
        data: showOutput ? [40, 50, 45, 60, 55, 70].map(x => x * kpiMultiplier) : [],
        borderColor: '#8b5cf6',
        tension: 0.4
      },
      {
        label: 'London',
        data: showOutput ? [35, 45, 40, 55, 50, 65].map(x => x * kpiMultiplier) : [],
        borderColor: '#10b981',
        tension: 0.4
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-outfit tracking-tight text-white/90">Multi-Branch Analytics</h2>
        <p className="text-white/50 mt-1">Compare performance, identify underperforming locations, and analyze geographic trends.</p>
      </div>

      {/* Manual Input Section (Always Open) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="w-full flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm text-white/50">Supply branch-specific KPIs to compare performance and generate rankings.</p>
            </div>
          </div>
        </div>

        <form ref={formRef} className="p-6 border-t border-white/10 space-y-8 bg-black/20" key={formKey} onSubmit={(e) => e.preventDefault()}>
          {/* Multi-Branch Inputs */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: 'Branch Name', type: 'text', placeholder: 'e.g. Paris Central' },
                { label: 'Revenue ($)', type: 'number', placeholder: '0.00' },
                { label: 'Sales Growth %', type: 'number', placeholder: '0' },
                { label: 'Customer Growth %', type: 'number', placeholder: '0' },
                { label: 'Inventory Health', type: 'select', options: ['Excellent', 'Good', 'Warning', 'Critical'] }
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-medium text-white/60 mb-1">{field.label}</label>
                  {field.type === 'select' ? (
                    <select required onChange={handleInputChange} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-emerald-500/50">
                      {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input required onChange={handleInputChange} type={field.type} defaultValue={field.type === 'number' ? "0" : undefined} placeholder={field.placeholder} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-emerald-500/50" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
            <button 
              onClick={handleGenerate}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Scale className="w-4 h-4" /> Compare Branches
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



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Map Visualization Box */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[400px] flex flex-col relative overflow-hidden lg:col-span-2">
          <h3 className="text-sm font-semibold text-white/80 mb-4 relative z-10 flex items-center gap-2">
            <Map className="w-4 h-4 text-indigo-400" /> Geographic Performance Map
          </h3>
          <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center pointer-events-none">
             <GlobeGraphic />
          </div>
          <div className="flex-1 flex flex-wrap items-start justify-end relative z-10 p-4 gap-2 overflow-y-auto max-h-[250px] scrollbar-hide">
             {showOutput ? (
               <>
                 <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   <div>
                     <p className="text-[11px] font-bold text-white">Tokyo, APAC</p>
                     <p className="text-[9px] text-white/50">+{Math.round(15 * m)}% YoY</p>
                   </div>
                 </div>
                 <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   <div>
                     <p className="text-[11px] font-bold text-white">London, EU</p>
                     <p className="text-[9px] text-white/50">+{Math.round(12 * m)}% YoY</p>
                   </div>
                 </div>
                 <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   <div>
                     <p className="text-[11px] font-bold text-white">NY, NA</p>
                     <p className="text-[9px] text-white/50">+{Math.round(8 * m)}% YoY</p>
                   </div>
                 </div>
                 <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                   <div>
                     <p className="text-[11px] font-bold text-white">Paris, EU</p>
                     <p className="text-[9px] text-white/50">-{Math.round(8 / m)}% YoY</p>
                   </div>
                 </div>
                 <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                   <div>
                     <p className="text-[11px] font-bold text-white">Berlin, EU</p>
                     <p className="text-[9px] text-white/50">+{Math.round(2 * m)}% YoY</p>
                   </div>
                 </div>
                 <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                   <div>
                     <p className="text-[11px] font-bold text-white">Dubai, MEA</p>
                     <p className="text-[9px] text-white/50">+{Math.round(4 * m)}% YoY</p>
                   </div>
                 </div>
               </>
             ) : (
               <div className="text-center text-white/20">Compare branches to see geographic data</div>
             )}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[350px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/80 mb-4 text-center">Revenue Ranking</h3>
          <div className="flex-1 min-h-0">
            <Bar data={revenueRankingData} options={{ indexAxis: 'y' as const, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }} />
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[350px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/80 mb-4 text-center">Trend Comparison</h3>
          <div className="flex-1 min-h-0">
            <Line data={trendComparisonData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

    </div>
  );
}

// Simple decorative globe to simulate the map
function GlobeGraphic() {
  return (
    <div className="relative w-64 h-64 rounded-full border border-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.1)] flex items-center justify-center opacity-30">
      <div className="absolute w-full h-[1px] bg-indigo-500/30"></div>
      <div className="absolute w-[1px] h-full bg-indigo-500/30"></div>
      <div className="absolute w-full h-full rounded-full border border-indigo-500/20 scale-75"></div>
      <div className="absolute w-full h-full rounded-full border border-indigo-500/20 scale-50"></div>
      <div className="absolute w-full h-full border border-indigo-500/20 rounded-[100%] scale-x-50"></div>
    </div>
  );
}
