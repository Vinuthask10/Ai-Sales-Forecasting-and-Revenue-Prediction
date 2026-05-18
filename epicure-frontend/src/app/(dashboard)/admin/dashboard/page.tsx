"use client";

import React, { useState, useRef } from "react";
import { Globe, MapPin, IndianRupee, TrendingUp, Filter, ChevronDown, ChevronUp, Database, Plus, Activity, RefreshCw } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useDate } from "@/context/DateContext";
import { useGlobalFilters } from "@/context/GlobalFiltersContext";
import { CountUp } from "@/components/CountUp";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export default function AdminDashboardPage() {
  const { startDate, endDate } = useDate();
  const { branch } = useGlobalFilters();
  const [showOutput, setShowOutput] = useState(false);
  const [regionFilter, setRegionFilter] = useState("All");
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const [manualSeedTrigger, setManualSeedTrigger] = useState(0);
  
  const seed = hashString(startDate + endDate + branch + regionFilter + manualSeedTrigger);
  const m = 1 + (seed % 30) / 100;

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

  // KPI Metrics
  const totalSystemRevenue = 452890 * kpiMultiplier;
  const bestBranch = showOutput ? (m > 1.15 ? "Downtown London" : "Tokyo Center") : "N/A";

  // Charts
  const multiLineRevenue = {
    labels: showOutput ? ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'] : [],
    datasets: [
      { label: 'London', data: showOutput ? [120*kpiMultiplier, 140*kpiMultiplier, 130*kpiMultiplier, 150*kpiMultiplier] : [], borderColor: '#6366f1', backgroundColor: 'rgba(99, 102, 241, 0.4)', fill: true },
      { label: 'New York', data: showOutput ? [110*kpiMultiplier, 130*kpiMultiplier, 140*kpiMultiplier, 160*kpiMultiplier] : [], borderColor: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.4)', fill: true },
    ]
  };

  const branchPerformanceData = {
    labels: showOutput ? ['Tokyo', 'London', 'NY', 'Paris', 'Berlin'] : [],
    datasets: [
      {
        label: 'Efficiency',
        data: showOutput ? [85*kpiMultiplier, 78*kpiMultiplier, 92*kpiMultiplier, 65*kpiMultiplier, 70*kpiMultiplier] : [],
        backgroundColor: '#10b981',
      },
      {
        label: 'Quality',
        data: showOutput ? [75*kpiMultiplier, 88*kpiMultiplier, 82*kpiMultiplier, 75*kpiMultiplier, 60*kpiMultiplier] : [],
        backgroundColor: 'rgba(16, 185, 129, 0.3)',
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-outfit tracking-tight text-white/90">System Admin Dashboard</h2>
        <p className="text-white/50 mt-1">High-level oversight of global operations, multi-branch performance, and AI health.</p>
      </div>

      {/* Manual Input Section (Always Open) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="w-full flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm text-white/50">Register new branches or update global performance metrics.</p>
            </div>
          </div>
        </div>

        <form ref={formRef} className="p-6 border-t border-white/10 space-y-8 bg-black/20" key={formKey} onSubmit={(e) => e.preventDefault()}>
          {/* Branch Information */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Branch Name', type: 'text', placeholder: 'e.g. Downtown Metro' },
                { label: 'Branch Location', type: 'select', options: ['North America', 'Europe', 'Asia Pacific', 'Middle East'] },
                { label: 'Total Revenue (₹)', type: 'number', placeholder: '0.00' },
                { label: 'Daily Orders', type: 'number', placeholder: '0' },
                { label: 'Customer Count', type: 'number', placeholder: '0' },
                { label: 'Operating Cost (₹)', type: 'number', placeholder: '0.00' }
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-medium text-white/60 mb-1">{field.label}</label>
                  {field.type === 'select' ? (
                    <select required onChange={handleInputChange} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-purple-500/50">
                      {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input required onChange={handleInputChange} type={field.type} defaultValue={field.type === 'number' ? "0" : undefined} placeholder={field.placeholder} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-purple-500/50" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
            <button 
              onClick={handleGenerate}
              className="px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Activity className="w-4 h-4" /> Generate System Analytics
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



      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-6 rounded-2xl flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <IndianRupee className="w-7 h-7" />
          </div>
          <div>
            <p className="text-white/50 text-sm font-medium uppercase tracking-wider">Total System Revenue</p>
            <p className="text-3xl font-bold font-outfit text-white">
              <CountUp end={totalSystemRevenue} prefix="₹" decimals={0} />
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-6 rounded-2xl flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-white/50 text-sm font-medium uppercase tracking-wider">Best Performing Branch</p>
            <p className="text-3xl font-bold font-outfit text-white">{bestBranch}</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[350px] flex flex-col xl:col-span-2">
          <h3 className="text-sm font-semibold text-white/80 mb-4">Cumulative Revenue Across Branches</h3>
          <div className="flex-1 min-h-0"><Line data={multiLineRevenue} options={{ maintainAspectRatio: false, plugins: { filler: { propagate: true } }, scales: { y: { stacked: true } } }} /></div>
        </div>

        {/* Geographic Map Mockup */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[350px] flex flex-col relative overflow-hidden">
          <h3 className="text-sm font-semibold text-white/80 mb-4 relative z-10">Geographic Performance</h3>
          <div className="absolute inset-0 opacity-20 flex items-center justify-center pointer-events-none">
            <Globe className="w-64 h-64 text-indigo-400" />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 gap-3">
             {showOutput ? (
               <>
                 <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                   <MapPin className="w-4 h-4 text-emerald-400" /> <span className="text-sm text-white/80">Tokyo: High Growth</span>
                 </div>
                 <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                   <MapPin className="w-4 h-4 text-amber-400" /> <span className="text-sm text-white/80">London: Stable</span>
                 </div>
                 <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                   <MapPin className="w-4 h-4 text-rose-400" /> <span className="text-sm text-white/80">Paris: Review Needed</span>
                 </div>
               </>
             ) : (
               <div className="text-center text-white/20">Analyze system to see geographic data</div>
             )}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[350px] flex flex-col xl:col-span-3">
          <h3 className="text-sm font-semibold text-white/80 mb-4 text-center">Branch Performance</h3>
          <div className="flex-1 min-h-0">
            <Bar data={branchPerformanceData} options={{ indexAxis: 'y' as const, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
}
