"use client";

import React, { useState, useRef } from "react";
import { IndianRupee, TrendingUp, Percent, Users, Filter, Search, ChevronDown, ChevronUp, Database, Save, RefreshCw, Zap } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Radar, PolarArea, Bar } from 'react-chartjs-2';
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
  RadialLinearScale,
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

export default function Home() {
  const { startDate, endDate } = useDate();
  const { branch, orderType, weather, festivalMode } = useGlobalFilters();

  // Local Page Filters
  const [showOutput, setShowOutput] = useState(false);
  const [salesCategory, setSalesCategory] = useState("All");
  const [revenueType, setRevenueType] = useState("Gross");
  const [customerSegment, setCustomerSegment] = useState("All");
  const [forecastPeriod, setForecastPeriod] = useState("Next 7 Days");
  const [paymentMethod, setPaymentMethod] = useState("All");
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const [manualSeedTrigger, setManualSeedTrigger] = useState(0);

  const seed = hashString(startDate + endDate + branch + orderType + weather + String(festivalMode) + salesCategory + revenueType + customerSegment + forecastPeriod + paymentMethod + manualSeedTrigger);
  const m = 1 + (seed % 50) / 100;
  
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

  const kpis = [
    { name: "Total Revenue", value: 45231.89 * kpiMultiplier, prefix: "₹", suffix: "", decimals: 2, icon: IndianRupee, color: "text-indigo-400", bg: "bg-indigo-400/10" },
    { name: "Predicted Revenue", value: 52100.00 * kpiMultiplier, prefix: "₹", suffix: "", decimals: 2, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { name: "Profit Margin", value: 24.5 * kpiMultiplier, prefix: "", suffix: "%", decimals: 1, icon: Percent, color: "text-amber-400", bg: "bg-amber-400/10" },
    { name: "Customer Growth", value: 12.4 * kpiMultiplier, prefix: "+", suffix: "%", decimals: 1, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
  ];

  // Chart Data Configurations
  const salesTrendData = {
    labels: showOutput ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : [],
    datasets: [{
      label: 'Sales Trend',
      data: showOutput ? [1200*kpiMultiplier, 1900*kpiMultiplier, 1500*kpiMultiplier, 2100*kpiMultiplier, 2800*kpiMultiplier, 3200*kpiMultiplier, 2900*kpiMultiplier] : [],
      borderColor: '#6366f1',
      tension: 0.4,
    }]
  };

  const revenuePredictionData = {
    labels: showOutput ? ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'] : [],
    datasets: [{
      label: 'Predicted Revenue',
      data: showOutput ? [3100*kpiMultiplier, 3200*kpiMultiplier, 3500*kpiMultiplier, 3400*kpiMultiplier, 3800*kpiMultiplier, 4500*kpiMultiplier, 4200*kpiMultiplier] : [],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      fill: true,
      tension: 0.4,
    }]
  };


  const orderVolumeData = {
    labels: showOutput ? ['11AM', '1PM', '3PM', '5PM', '7PM', '9PM'] : [],
    datasets: [{
      label: 'Order Volume',
      data: showOutput ? [45*kpiMultiplier, 100*kpiMultiplier, 60*kpiMultiplier, 50*kpiMultiplier, 110*kpiMultiplier, 70*kpiMultiplier] : [],
      backgroundColor: '#3b82f6',
    }]
  };

  const confidenceData = {
    labels: showOutput ? ['Speed', 'Revenue', 'Accuracy', 'Satisfaction', 'Volume'] : [],
    datasets: [{
      label: 'Performance Metrics',
      data: showOutput ? [85*kpiMultiplier, 90*kpiMultiplier, 78*kpiMultiplier, 92*kpiMultiplier, 88*kpiMultiplier] : [],
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
      borderColor: '#f59e0b',
      pointBackgroundColor: '#f59e0b',
    }]
  };

  const heatmapData = {
    labels: showOutput ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : [],
    datasets: [{
      label: 'Activity Intensity',
      data: showOutput ? [40*kpiMultiplier, 55*kpiMultiplier, 45*kpiMultiplier, 60*kpiMultiplier, 85*kpiMultiplier, 95*kpiMultiplier, 90*kpiMultiplier] : [],
      backgroundColor: [
        'rgba(99, 102, 241, 0.5)', 
        'rgba(168, 85, 247, 0.5)', 
        'rgba(236, 72, 153, 0.5)', 
        'rgba(245, 158, 11, 0.5)',
        'rgba(16, 185, 129, 0.5)',
        'rgba(59, 130, 246, 0.5)',
        'rgba(239, 68, 68, 0.5)'
      ],
    }]
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-outfit tracking-tight text-white/90">Manager Dashboard</h2>
        <p className="text-white/50 mt-1">Comprehensive overview of revenue, predictions, and sales volumes.</p>
      </div>

      {/* Manual Input Section (Always Open) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="w-full flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm text-white/50">Simulate data entry to update KPI cards and overview graphs.</p>
            </div>
          </div>
        </div>

        <form ref={formRef} className="p-6 border-t border-white/10 space-y-8 bg-black/20" key={formKey} onSubmit={(e) => e.preventDefault()}>
          {/* Sales Information */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {['Date', 'Total Orders', 'Dine-In Orders', 'Takeaway Orders', 'Online Orders', 'Total Revenue', 'Discount Amount', 'Tax Amount', 'Profit Earned'].map(field => (
                <div key={field}>
                  <label className="block text-xs font-medium text-white/60 mb-1">{field}</label>
                  <input required onChange={handleInputChange} type={field === 'Date' ? 'date' : 'number'} defaultValue={field === 'Date' ? undefined : "0"} placeholder={`Enter ${field}`} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-indigo-500/50" />
                </div>
              ))}
            </div>
          </div>

          {/* Customer Metrics */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['New Customers', 'Returning Customers', 'Total Customer Visits', 'Customer Satisfaction Score'].map(field => (
                <div key={field}>
                  <label className="block text-xs font-medium text-white/60 mb-1">{field}</label>
                  <input required onChange={handleInputChange} type="number" defaultValue="0" placeholder={`Enter ${field}`} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-emerald-500/50" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Category Sales */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['Beverages Sales', 'Main Course Sales', 'Desserts Sales', 'Combo Sales'].map(field => (
                <div key={field}>
                  <label className="block text-xs font-medium text-white/60 mb-1">{field}</label>
                  <input required onChange={handleInputChange} type="number" defaultValue="0" placeholder={`Enter ${field}`} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-amber-500/50" />
                </div>
              ))}
            </div>
          </div>

          {/* AI Prediction Inputs */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Expected Footfall</label>
                <input required onChange={handleInputChange} type="number" defaultValue="0" className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Weekend/Weekday</label>
                <select required onChange={handleInputChange} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none">
                  <option>Weekday</option>
                  <option>Weekend</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Festival/Event</label>
                <select required onChange={handleInputChange} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none">
                  <option>None</option>
                  <option>Local Event</option>
                  <option>Major Festival</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Promotion Running</label>
                <select required onChange={handleInputChange} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none">
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Weather Condition</label>
                <select required onChange={handleInputChange} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none">
                  <option>Sunny</option>
                  <option>Rainy</option>
                  <option>Cloudy</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Staff Availability %</label>
                <input required onChange={handleInputChange} type="number" defaultValue="100" placeholder="100" className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-purple-500/50" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
            <button 
              onClick={handleGenerate}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4" /> Generate Forecast
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.name} className="relative group overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/[0.07] transition-all duration-300">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${kpi.color}`}>
              <kpi.icon className="w-16 h-16" />
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${kpi.bg} ${kpi.color}`}>
              <kpi.icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-white/50">{kpi.name}</p>
            <p className="mt-1 text-3xl font-semibold font-outfit text-white/90">
              <CountUp end={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} decimals={kpi.decimals} />
            </p>
          </div>
        ))}
      </div>

      {/* 6x Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[350px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/80 mb-4">Sales Trend</h3>
          <div className="flex-1 min-h-0"><Line data={salesTrendData} options={{ maintainAspectRatio: false }} /></div>
        </div>
 
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[350px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/80 mb-4 text-center">Revenue Prediction</h3>
          <div className="flex-1 min-h-0"><Line data={revenuePredictionData} options={{ maintainAspectRatio: false }} /></div>
        </div>

        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[350px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/80 mb-6 text-center">Category Distribution</h3>
          <div className="flex-1 flex flex-col justify-center gap-4">
            {['Food', 'Beverage', 'Dessert', 'Combo'].map((cat, i) => {
              const vals = [50, 20, 15, 15];
              const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500'];
              return (
                <div key={cat} className="space-y-1.5">
                   <div className="flex justify-between text-xs font-medium text-white/60">
                     <span>{cat}</span>
                     <span>{showOutput ? Math.round(vals[i] * m) : 0}%</span>
                   </div>
                   <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                     <div className={`h-full ${colors[i]} rounded-full transition-all duration-500`} style={{ width: `${showOutput ? vals[i] * m : 0}%` }}></div>
                   </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[350px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/80 mb-4">Order Volume</h3>
          <div className="flex-1 min-h-0"><Bar data={orderVolumeData} options={{ maintainAspectRatio: false }} /></div>
        </div>

        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[350px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/80 mb-4 text-center">AI Confidence</h3>
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <Radar data={confidenceData} options={{ maintainAspectRatio: false, scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' }, angleLines: { color: 'rgba(255,255,255,0.05)' }, pointLabels: { color: 'rgba(255,255,255,0.5)' }, ticks: { display: false } } } }} />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[350px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/80 mb-4 text-center">Peak Activity</h3>
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <PolarArea data={heatmapData} options={{ maintainAspectRatio: false, scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { display: false } } } }} />
          </div>
        </div>
      </div>
    </div>
  );
}
