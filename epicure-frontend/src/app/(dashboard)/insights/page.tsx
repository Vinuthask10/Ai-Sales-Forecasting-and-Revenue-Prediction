"use client";

import React, { useState, useRef } from "react";
import { Users, Heart, ArrowUpRight, ArrowDownRight, Sparkles, ChevronDown, ChevronUp, Database, PieChart, RefreshCw } from "lucide-react";
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
} from 'chart.js';
import { Bar, Doughnut, Bubble } from 'react-chartjs-2';
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

export default function InsightsPage() {
  const { startDate, endDate } = useDate();
  const { branch } = useGlobalFilters();

  // Local Filters
  const [showOutput, setShowOutput] = useState(false);
  const [customerSegment, setCustomerSegment] = useState("All");
  const [orderFrequency, setOrderFrequency] = useState("All");
  const [spendingRange, setSpendingRange] = useState("All");
  const [ageGroup, setAgeGroup] = useState("All");
  const [visitTime, setVisitTime] = useState("All");
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const [manualSeedTrigger, setManualSeedTrigger] = useState(0);

  const seed = hashString(startDate + endDate + branch + customerSegment + orderFrequency + spendingRange + ageGroup + visitTime + manualSeedTrigger);
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
  const ltv = 845 * kpiMultiplier;
  const retentionRate = 68 * kpiMultiplier > 100 ? 98 : 68 * kpiMultiplier;
  const churnRate = showOutput ? 12 / m : 0;
  const avgSpend = 42.5 * kpiMultiplier;
  const repeatRate = 45 * kpiMultiplier > 100 ? 85 : 45 * kpiMultiplier;

  const kpis = [
    { name: "Customer LTV", value: ltv, prefix: "₹", suffix: "", decimals: 0, change: 5.2 * kpiMultiplier, isPos: true },
    { name: "Retention Rate", value: retentionRate, prefix: "", suffix: "%", decimals: 1, change: 2.1 * kpiMultiplier, isPos: true },
    { name: "Churn Rate", value: churnRate, prefix: "", suffix: "%", decimals: 1, change: 1.5 * kpiMultiplier, isPos: false }, 
    { name: "Avg Spend/Customer", value: avgSpend, prefix: "₹", suffix: "", decimals: 2, change: 8.4 * kpiMultiplier, isPos: true },
    { name: "Repeat Order Rate", value: repeatRate, prefix: "", suffix: "%", decimals: 1, change: 4.1 * kpiMultiplier, isPos: true },
  ];

  // Charts
  const segmentationPie = {
    labels: showOutput ? ['Loyal', 'Returning', 'New'] : [],
    datasets: [{
      data: showOutput ? [35*kpiMultiplier, 25*kpiMultiplier, 40*kpiMultiplier] : [],
      backgroundColor: ['#6366f1', '#a855f7', '#ec4899'],
    }]
  };

  const retentionTrendData = {
    labels: showOutput ? ['Month 1', 'Month 2', 'Month 3', 'Month 4'] : [],
    datasets: [
      {
        label: 'Retained',
        data: showOutput ? [80*kpiMultiplier, 75*kpiMultiplier, 70*kpiMultiplier, 68*kpiMultiplier] : [],
        backgroundColor: '#10b981',
      },
      {
        label: 'Churned',
        data: showOutput ? [20*kpiMultiplier, 25*kpiMultiplier, 30*kpiMultiplier, 32*kpiMultiplier] : [],
        backgroundColor: '#ef4444',
      }
    ]
  };
 
  const spendingPerSegmentData = {
    datasets: [{
      label: 'Spending Profile (Visit Freq vs Avg Spend)',
      data: showOutput ? [
        { x: 10*kpiMultiplier, y: 85*kpiMultiplier, r: 15*kpiMultiplier },
        { x: 5*kpiMultiplier, y: 55*kpiMultiplier, r: 10*kpiMultiplier },
        { x: 2*kpiMultiplier, y: 35*kpiMultiplier, r: 5*kpiMultiplier },
      ] : [],
      backgroundColor: '#f59e0b',
    }]
  };

  const customerGrowthData = {
    labels: showOutput ? ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'] : [],
    datasets: [{
      label: 'New Customers Acquired',
      data: showOutput ? [120*kpiMultiplier, 145*kpiMultiplier, 130*kpiMultiplier, 180*kpiMultiplier] : [],
      borderColor: '#3b82f6',
      tension: 0.4,
    }]
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-outfit tracking-tight text-white/90">Customer Insights</h2>
        <p className="text-white/50 mt-1">Understand demographics, behaviors, and retention metrics.</p>
      </div>

      {/* Manual Input Section (Always Open) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="w-full flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm text-white/50">Input individual or batch customer profiles to generate behavior segments.</p>
            </div>
          </div>
        </div>

        <form ref={formRef} className="p-6 border-t border-white/10 space-y-8 bg-black/20" key={formKey} onSubmit={(e) => e.preventDefault()}>
          {/* Customer Data Inputs */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { label: 'Customer ID', type: 'text', placeholder: 'CUST-' },
                { label: 'Age Group', type: 'select', options: ['18-24', '25-34', '35-44', '45-54', '55+'] },
                { label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other', 'Prefer Not to Say'] },
                { label: 'Visit Frequency', type: 'select', options: ['Daily', 'Weekly', 'Monthly', 'Rarely'] },
                { label: 'Average Spending (₹)', type: 'number', placeholder: '0.00' },
                { label: 'Loyalty Membership', type: 'select', options: ['None', 'Silver', 'Gold', 'Platinum'] },
                { label: 'Feedback Rating', type: 'number', placeholder: '1-5' }
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-medium text-white/60 mb-1">{field.label}</label>
                  {field.type === 'select' ? (
                    <select required onChange={handleInputChange} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-blue-500/50">
                      {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input required onChange={handleInputChange} type={field.type} defaultValue={field.type === 'number' ? "0" : undefined} placeholder={field.placeholder} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-blue-500/50" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
            <button 
              onClick={handleGenerate}
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" /> Analyze Customers
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



      {/* AI Insight Box */}
      {showOutput && (
        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 p-5 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-10 h-10 shrink-0 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white/90 font-semibold mb-1">AI Behavioral Insight</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Based on the selected segment, <strong className="text-white">most loyal customers prefer the "Combos" category</strong>, particularly on weekends. Consider creating a loyalty-exclusive weekend combo to boost Lifetime Value further.
            </p>
          </div>
        </div>
      )}

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-2xl">
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2">{kpi.name}</p>
            <p className="text-2xl font-bold font-outfit text-white mb-2">
              <CountUp end={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} decimals={kpi.decimals} />
            </p>
            <div className={`flex items-center text-xs font-medium ${kpi.isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
              {kpi.isPos ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
              <CountUp end={kpi.change} prefix={kpi.isPos ? "+" : "-"} suffix="%" decimals={1} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[350px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/80 mb-4 text-center">Customer Segmentation</h3>
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <Doughnut data={segmentationPie} options={{ maintainAspectRatio: false, cutout: '70%' }} />
          </div>
        </div>
 
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[350px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/80 mb-4 text-center">Retention vs Churn</h3>
          <div className="flex-1 min-h-0"><Bar data={retentionTrendData} options={{ maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }} /></div>
        </div>

        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[350px] flex flex-col lg:col-span-2">
          <h3 className="text-sm font-semibold text-white/80 mb-4 text-center">Spending Behavior</h3>
          <div className="flex-1 min-h-0"><Bubble data={spendingPerSegmentData} options={{ maintainAspectRatio: false }} /></div>
        </div>
      </div>

      {/* Table: Top Customers */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white/90">Top Customers (Cohort Analysis)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-white/40 uppercase bg-black/20">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Segment</th>
                <th className="px-6 py-4 font-medium">Visits</th>
                <th className="px-6 py-4 font-medium">LTV</th>
                <th className="px-6 py-4 font-medium">Favorite Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {showOutput ? [
                { name: "Sarah Jenkins", seg: "Loyal", visits: 42, ltv: 1250, fav: "Combos" },
                { name: "Michael Chen", seg: "Loyal", visits: 38, ltv: 980, fav: "Mains" },
                { name: "Emily Davis", seg: "Returning", visits: 12, ltv: 450, fav: "Desserts" },
                { name: "David Wilson", seg: "Returning", visits: 8, ltv: 310, fav: "Beverages" },
              ].map((c, i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-medium text-white/90 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">{c.name.charAt(0)}</div>
                    {c.name}
                  </td>
                  <td className="px-6 py-4 text-white/70">
                    <span className={`px-2 py-1 rounded text-xs ${c.seg === 'Loyal' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {c.seg}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/70">{Math.floor(c.visits * m)}</td>
                  <td className="px-6 py-4 text-white/70">₹{(c.ltv * m).toFixed(2)}</td>
                  <td className="px-6 py-4 text-white/70">{c.fav}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-white/20">No data analyzed yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
