"use client";

import React, { useState, useRef } from "react";
import { BrainCircuit, Settings2, SlidersHorizontal, ArrowUpRight, CheckCircle2, ChevronDown, ChevronUp, Database, Play, Copy, Download, RefreshCw } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Scatter, Bar } from 'react-chartjs-2';
import { useDate } from "@/context/DateContext";
import { useGlobalFilters } from "@/context/GlobalFiltersContext";
import { CountUp } from "@/components/CountUp";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
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

export default function ForecastPage() {
  const { startDate, endDate } = useDate();
  const { branch, weather } = useGlobalFilters();

  // Left Panel Filters
  const [showOutput, setShowOutput] = useState(false);
  const [horizon, setHorizon] = useState("30 Days");
  const [modelType, setModelType] = useState("XGBoost");
  const [forecastType, setForecastType] = useState("Revenue Forecast");
  const [granularity, setGranularity] = useState("Daily");
  const [confidenceInterval, setConfidenceInterval] = useState(95);
  const [seasonality, setSeasonality] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [compareModels, setCompareModels] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [manualSeedTrigger, setManualSeedTrigger] = useState(0);

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
    setIsGenerating(true);
    setGenerateSuccess(false);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerateSuccess(true);
      setShowOutput(true);
      setManualSeedTrigger(prev => prev + 1);
      setTimeout(() => setGenerateSuccess(false), 3000);
    }, 2000);
  };

  const handleReset = () => {
    setShowOutput(false);
    setManualSeedTrigger(0);
    setFormKey(prev => prev + 1);
  };

  // Dynamic seed logic
  const seedStr = startDate + endDate + branch + weather + horizon + modelType + forecastType + granularity + confidenceInterval.toString() + String(seasonality) + String(promotions) + String(compareModels) + manualSeedTrigger;
  const seed = hashString(seedStr);
  const m = 1 + (seed % 30) / 100;

  const kpiMultiplier = showOutput ? m : 0;

  // Predicted Category Demand — rendered as HTML Demand Tiles (no Bar chart)
  const categoryDemand = [
    { label: 'Food', optimistic: Math.round(55*kpiMultiplier), conservative: Math.round(45*kpiMultiplier), color: 'indigo' },
    { label: 'Beverages', optimistic: Math.round(35*kpiMultiplier), conservative: Math.round(25*kpiMultiplier), color: 'blue' },
    { label: 'Desserts', optimistic: Math.round(25*kpiMultiplier), conservative: Math.round(15*kpiMultiplier), color: 'pink' },
    { label: 'Combos', optimistic: Math.round(25*kpiMultiplier), conservative: Math.round(15*kpiMultiplier), color: 'amber' },
  ];

  // Chart: Confidence Interval Band (Floating Bar Chart)
  const confidenceBandData = {
    labels: showOutput ? ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6'] : [],
    datasets: [
      {
        label: 'Confidence Interval',
        data: showOutput ? [
          [100*kpiMultiplier, 160*kpiMultiplier],
          [110*kpiMultiplier, 170*kpiMultiplier],
          [105*kpiMultiplier, 165*kpiMultiplier],
          [140*kpiMultiplier, 200*kpiMultiplier],
          [160*kpiMultiplier, 220*kpiMultiplier],
          [150*kpiMultiplier, 210*kpiMultiplier]
        ] : [],
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderRadius: 4,
        barPercentage: 0.5,
      }
    ]
  };

  // Chart: Actual vs Predicted Sales
  const actualVsPredictedData = {
    datasets: [
      {
        label: 'Actual Variance',
        data: showOutput ? [
          { x: 10, y: 12000 * kpiMultiplier },
          { x: 20, y: 15000 * kpiMultiplier },
          { x: 15, y: 13500 * kpiMultiplier },
          { x: 25, y: 18000 * kpiMultiplier },
          { x: 22, y: 17000 * kpiMultiplier },
        ] : [],
        backgroundColor: '#10b981',
      }
    ]
  };

  // Chart: Trend + Seasonality Decomposition
  const decompositionData = {
    labels: showOutput ? ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'] : [],
    datasets: [
      {
        label: 'Trend',
        data: showOutput ? [100, 110, 120, 130, 140, 150, 160].map(x => x * kpiMultiplier) : [],
        borderColor: '#a855f7',
        pointStyle: 'rectRot',
        pointRadius: 6,
        showLine: true,
        fill: false
      },
      {
        label: 'Seasonality',
        data: showOutput ? [20, -10, 30, -20, 40, -30, 50].map(x => x * kpiMultiplier) : [],
        borderColor: '#ec4899',
        pointStyle: 'triangle',
        pointRadius: 6,
        showLine: true,
        fill: false
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-outfit tracking-tight text-white/90">AI Sales Forecast</h2>
          <p className="text-white/50 mt-1">Advanced predictive modeling powered by {modelType}.</p>
        </div>
      </div>

      {/* Manual Input Section (Always Open) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="w-full flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm text-white/50">Supply specific historical data, events, and variables to the model.</p>
            </div>
          </div>
        </div>

        <form ref={formRef} className="p-6 border-t border-white/10 space-y-8 bg-black/20" key={formKey} onSubmit={(e) => e.preventDefault()}>
          {/* Forecast Data Inputs */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { label: 'Historical Revenue', type: 'number', placeholder: '0.00' },
                { label: 'Previous Month Sales', type: 'number', placeholder: '0' },
                { label: 'Seasonal Indicator', type: 'select', options: ['Summer', 'Winter', 'Spring', 'Fall'] },
                { label: 'Festival Indicator', type: 'select', options: ['None', 'Diwali', 'Christmas', 'New Year'] },
                { label: 'Weather Condition', type: 'select', options: ['Sunny', 'Rainy', 'Cloudy'] },
                { label: 'Marketing Spend (₹)', type: 'number', placeholder: '0.00' },
                { label: 'Expected Demand', type: 'select', options: ['High', 'Medium', 'Low'] },
                { label: 'Inventory Availability %', type: 'number', placeholder: '100' }
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-medium text-white/60 mb-1">{field.label}</label>
                  {field.type === 'select' ? (
                    <select required onChange={handleInputChange} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-pink-500/50">
                      {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input required onChange={handleInputChange} type={field.type} defaultValue={field.type === 'number' ? "0" : undefined} placeholder={field.placeholder} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-pink-500/50" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Forecast Controls */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Forecast Duration', type: 'select', options: ['1 Week', '1 Month', '3 Months', '6 Months'] },
                { label: 'Prediction Model Selector', type: 'select', options: ['XGBoost', 'ARIMA', 'LSTM', 'Prophet'] },
                { label: 'Confidence Level %', type: 'number', placeholder: '95' }
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-medium text-white/60 mb-1">{field.label}</label>
                  {field.type === 'select' ? (
                    <select required onChange={handleInputChange} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-amber-500/50">
                      {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input required onChange={handleInputChange} type={field.type} defaultValue={field.type === 'number' ? "0" : undefined} placeholder={field.placeholder} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-amber-500/50" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
            <button 
              onClick={handleGenerate}
              className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4" /> {isGenerating ? 'Generating...' : 'Run Forecast'}
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

      <div className="space-y-6">



        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center"><ArrowUpRight className="w-6 h-6" /></div>
            <div>
              <p className="text-white/50 text-sm font-medium">Predicted Growth</p>
              <p className="text-2xl font-bold text-white">
                <CountUp end={14.2 * kpiMultiplier} prefix="+" suffix="%" decimals={1} />
              </p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center"><CheckCircle2 className="w-6 h-6" /></div>
            <div>
              <p className="text-white/50 text-sm font-medium">Model Accuracy (MAE)</p>
              <p className="text-2xl font-bold text-white">
                <CountUp end={showOutput ? 94.2 / m : 0} suffix="%" decimals={1} />
              </p>
            </div>
          </div>
        </div>

        {/* Large Chart */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl h-[400px] flex flex-col">
          <h3 className="text-lg font-semibold text-white/90 mb-2">Confidence Interval Graph</h3>
          <p className="text-sm text-white/40 mb-6">Showing {confidenceInterval}% confidence bounds for {horizon}.</p>
          <div className="flex-1 min-h-0"><Bar data={confidenceBandData} options={{ maintainAspectRatio: false, plugins: { tooltip: { callbacks: { label: (ctx: any) => `Range: ${showOutput ? Math.round(ctx.raw[0]) : 0} - ${showOutput ? Math.round(ctx.raw[1]) : 0}` } } } }} /></div>
        </div>

        {/* Grid of charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[300px] flex flex-col">
            <h3 className="text-sm font-semibold text-white/80 mb-4">Actual vs Predicted</h3>
            <div className="flex-1 min-h-0"><Scatter data={actualVsPredictedData} options={{ maintainAspectRatio: false }} /></div>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[300px] flex flex-col">
            <h3 className="text-sm font-semibold text-white/80 mb-4">Predicted Category Demand</h3>
            <div className="flex-1 grid grid-cols-2 gap-3 overflow-hidden">
              {categoryDemand.map(cat => (
                <div key={cat.label} className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between">
                  <p className="text-xs text-white/50 font-semibold uppercase tracking-wider">{cat.label}</p>
                  <div>
                    <p className="text-xl font-bold text-white">{showOutput ? cat.optimistic : 0}<span className="text-xs text-white/40 ml-1">units</span></p>
                    <p className="text-xs text-white/40">Conservative: {showOutput ? cat.conservative : 0}</p>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full mt-1 border border-white/5">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${showOutput ? Math.min((cat.optimistic / 80) * 100, 100) : 0}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[300px] flex flex-col md:col-span-2">
            <h3 className="text-sm font-semibold text-white/80 mb-4 text-center">Trend + Seasonality Decomposition</h3>
            <div className="flex-1 min-h-0"><Line data={decompositionData} options={{ maintainAspectRatio: false }} /></div>
          </div>
        </div>

      </div>
    </div>
  );
}
