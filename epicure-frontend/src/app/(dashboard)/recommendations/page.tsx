"use client";

import React, { useState, useRef } from "react";
import { Zap, CheckCircle2, Loader2, ArrowRight, TrendingUp, ChevronDown, ChevronUp, Database, Wand2, ListOrdered, Megaphone, RefreshCw } from "lucide-react";
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
import { useGlobalFilters } from "@/context/GlobalFiltersContext";
import { CountUp } from "@/components/CountUp";

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

const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export default function RecommendationsPage() {
  const { startDate, endDate } = useDate();
  const { branch, weather } = useGlobalFilters();

  // Local Filters
  const [showOutput, setShowOutput] = useState(false);
  const [businessGoal, setBusinessGoal] = useState("Increase Revenue");
  const [timeContext, setTimeContext] = useState("Upcoming Week");
  const [profitMargin, setProfitMargin] = useState("Medium");
  const [demandLevel, setDemandLevel] = useState("High");
  const [riskLevel, setRiskLevel] = useState("Balanced");
  const [autoMode, setAutoMode] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const [applied, setApplied] = useState<Record<number, boolean>>({});
  const [applying, setApplying] = useState<number | null>(null);

  const [manualSeedTrigger, setManualSeedTrigger] = useState(0);

  const seed = hashString(startDate + endDate + branch + weather + businessGoal + timeContext + profitMargin + demandLevel + riskLevel + manualSeedTrigger);
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
    setApplied({});
  };

  const handleApply = (id: number) => {
    setApplying(id);
    setTimeout(() => {
      setApplying(null);
      setApplied(prev => ({ ...prev, [id]: true }));
    }, 1500);
  };

  const suggestions = [
    {
      id: 1,
      type: "Pricing Optimization",
      title: "Increase price of Truffle Pasta by 5%",
      description: "High demand during weekend evenings with inelastic pricing behavior detected.",
      impactScore: 92,
      expectedRevenue: `+₹${Math.round(450 * kpiMultiplier)}/wk`,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10"
    },
    {
      id: 2,
      type: "Menu Optimization",
      title: "Bundle Signature Burger + Cola",
      description: "Cola sales are dropping. Bundling it with our top seller will move inventory fast.",
      impactScore: 85,
      expectedRevenue: `+₹${Math.round(320 * kpiMultiplier)}/wk`,
      color: "text-indigo-400",
      bg: "bg-indigo-400/10"
    },
    {
      id: 3,
      type: "Marketing",
      title: "Promote Iced Lattes in Afternoon",
      description: "Weather forecast predicts high heat. Push notifications to loyalty members at 2 PM.",
      impactScore: 88,
      expectedRevenue: `+₹${Math.round(210 * kpiMultiplier)}/wk`,
      color: "text-amber-400",
      bg: "bg-amber-400/10"
    },
    {
      id: 4,
      type: "Inventory",
      title: "Reduce Fresh Salmon Order by 15%",
      description: "Historical data shows a 15% drop in seafood orders during heavy rain days.",
      impactScore: 78,
      expectedRevenue: `Save ₹${Math.round(180 * kpiMultiplier)}/wk`,
      color: "text-rose-400",
      bg: "bg-rose-400/10"
    },
    {
      id: 5,
      type: "Staffing",
      title: "Add 1 Server for Friday Dinner",
      description: "Expected footfall exceeds current staff capacity by 20%. Avoid service bottlenecks.",
      impactScore: 95,
      expectedRevenue: `+₹${Math.round(500 * kpiMultiplier)}/wk`,
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    }
  ];

  // Visualizations
  const beforeAfterData = {
    labels: showOutput ? ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4 (Action Taken)', 'Wk 5 (Est)', 'Wk 6 (Est)'] : [],
    datasets: [
      {
        label: 'Base Revenue',
        data: showOutput ? [12000, 12500, 12200, 12400, 12300, 12500] : [],
        borderColor: 'rgba(255,255,255,0.2)',
        borderDash: [5, 5]
      },
      {
        label: 'With Recommendations Applied',
        data: showOutput ? [null, null, null, 12400, 14000*kpiMultiplier, 15500*kpiMultiplier] : [],
        borderColor: '#10b981',
        tension: 0.4
      }
    ]
  };

  const recommendedItemsData = {
    labels: showOutput ? ['Truffle Pasta', 'Signature Burger', 'Iced Latte'] : [],
    datasets: [
      {
        label: 'Current Sales/Wk',
        data: showOutput ? [120*kpiMultiplier, 200*kpiMultiplier, 80*kpiMultiplier] : [],
        backgroundColor: 'rgba(255,255,255,0.2)',
      },
      {
        label: 'Expected Sales/Wk',
        data: showOutput ? [120*kpiMultiplier, 260*kpiMultiplier, 140*kpiMultiplier] : [], // Price increase doesn't change vol, bundle changes vol
        backgroundColor: '#6366f1',
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-outfit tracking-tight text-white/90">AI Action Center</h2>
          <p className="text-white/50 mt-1">Prescriptive analytics to optimize revenue, menu, and operations.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-xl">
          <span className="text-sm text-white/60 font-medium px-2">Smart Auto-Apply</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={autoMode} onChange={() => setAutoMode(!autoMode)} className="sr-only peer" />
            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>
      </div>

      {/* Manual Input Section (Always Open) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="w-full flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm text-white/50">Simulate parameters to generate targeted AI action plans.</p>
            </div>
          </div>
        </div>

        <form ref={formRef} className="p-6 border-t border-white/10 space-y-8 bg-black/20" key={formKey} onSubmit={(e) => e.preventDefault()}>
          {/* Recommendation Inputs */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { label: 'Slow Moving Items', type: 'number', placeholder: 'e.g. 5' },
                { label: 'High Selling Items', type: 'number', placeholder: 'e.g. 12' },
                { label: 'Customer Preferences', type: 'select', options: ['Spicy', 'Vegan', 'Gluten-Free', 'Mixed'] },
                { label: 'Inventory Cost (₹)', type: 'number', placeholder: '0.00' },
                { label: 'Promotion Budget (₹)', type: 'number', placeholder: '0.00' },
                { label: 'Peak Hours', type: 'select', options: ['Morning', 'Lunch', 'Evening', 'Late Night'] },
                { label: 'Staff Count', type: 'number', placeholder: '0' }
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-medium text-white/60 mb-1">{field.label}</label>
                  {field.type === 'select' ? (
                    <select required onChange={handleInputChange} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-indigo-500/50">
                      {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input required onChange={handleInputChange} type={field.type} defaultValue={field.type === 'number' ? "0" : undefined} placeholder={field.placeholder} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-indigo-500/50" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
            <button 
              onClick={handleGenerate}
              className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4" /> Generate AI Recommendations
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



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top 5 Suggestions List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-white/90">Top 5 Actionable Insights</h3>
          {showOutput ? suggestions.map((sug) => (
            <div key={sug.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col sm:flex-row gap-5 items-start sm:items-center hover:bg-white/10 transition-colors">
              <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center font-bold text-lg ${sug.bg} ${sug.color}`}>
                {sug.impactScore}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${sug.bg} ${sug.color}`}>
                    {sug.type}
                  </span>
                </div>
                <h4 className="text-base font-semibold text-white/90">{sug.title}</h4>
                <p className="text-sm text-white/50 mt-1">{sug.description}</p>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                <span className="text-emerald-400 font-bold bg-emerald-400/10 px-3 py-1 rounded-lg text-sm">{sug.expectedRevenue}</span>
                {applied[sug.id] || autoMode ? (
                  <button disabled className="px-6 py-2 bg-white/5 text-white/40 rounded-xl text-sm font-semibold flex items-center gap-2 border border-white/5">
                    <CheckCircle2 className="w-4 h-4" /> Applied
                  </button>
                ) : (
                  <button 
                    onClick={() => handleApply(sug.id)}
                    disabled={applying === sug.id}
                    className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center min-w-[120px]"
                  >
                    {applying === sug.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simulate / Apply"}
                  </button>
                )}
              </div>
            </div>
          )) : (
            <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-12 text-center text-white/20">
              Generate recommendations to see AI insights
            </div>
          )}
        </div>

        {/* Visualizations Panel */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-6 rounded-2xl">
            <h3 className="text-sm font-semibold text-indigo-400 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Global Uplift Potential
            </h3>
            <p className="text-4xl font-bold font-outfit text-white">
              <CountUp end={1660 * kpiMultiplier} prefix="+₹" decimals={0} />
              <span className="text-lg text-white/40 font-normal">/wk</span>
            </p>
            <p className="text-sm text-white/60 mt-2">If all Top 5 recommendations are applied.</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[250px] flex flex-col">
            <h3 className="text-sm font-semibold text-white/80 mb-4">Before vs After Impact</h3>
            <div className="flex-1 min-h-0"><Line data={beforeAfterData} options={{ maintainAspectRatio: false }} /></div>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[250px] flex flex-col">
            <h3 className="text-sm font-semibold text-white/80 mb-4">Recommended Items vs Current</h3>
            <div className="flex-1 min-h-0"><Bar data={recommendedItemsData} options={{ maintainAspectRatio: false }} /></div>
          </div>
        </div>

      </div>
    </div>
  );
}
