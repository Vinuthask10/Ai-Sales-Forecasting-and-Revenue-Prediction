"use client";

import React, { useState, useRef } from "react";
import { AlertCircle, TrendingDown, Box, ShieldCheck, Zap, Database, Package, RefreshCw } from "lucide-react";
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
import { useDate } from "@/context/DateContext";
import { useGlobalFilters } from "@/context/GlobalFiltersContext";

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

export default function InventoryPage() {
  const { startDate, endDate } = useDate();
  const { branch } = useGlobalFilters();

  const [showOutput, setShowOutput] = useState(false);
  const [autoReorder, setAutoReorder] = useState(true);
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const [restocked, setRestocked] = useState(false);
  const [poAdjusted, setPoAdjusted] = useState(false);
  const [manualSeedTrigger, setManualSeedTrigger] = useState(0);

  const seed = hashString(startDate + endDate + branch + manualSeedTrigger);
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

  const handleRestock = () => setRestocked(true);
  const handleAdjustPO = () => setPoAdjusted(true);

  const handleReset = () => {
    setShowOutput(false);
    setManualSeedTrigger(0);
    setRestocked(false);
    setPoAdjusted(false);
    setFormKey(prev => prev + 1);
  };

  const mixedInventoryData = {
    labels: showOutput ? ['Tomatoes', 'Cheese', 'Flour', 'Beef'] : [],
    datasets: [
      {
        type: 'bar' as const,
        label: 'Current Stock (kg)',
        data: showOutput ? [50 * kpiMultiplier, 30 * kpiMultiplier, 120 * kpiMultiplier, 40 * kpiMultiplier] : [],
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
      },
      {
        type: 'line' as const,
        label: 'Consumption Trend',
        data: showOutput ? [60 * kpiMultiplier, 25 * kpiMultiplier, 140 * kpiMultiplier, 35 * kpiMultiplier] : [],
        borderColor: '#ec4899',
        borderWidth: 2,
        fill: false,
      }
    ]
  };

  const inventoryFields = [
    { label: 'Ingredient Name', type: 'text', placeholder: 'e.g. Tomato Paste' },
    { label: 'Current Stock', type: 'number', placeholder: '0' },
    { label: 'Daily Consumption', type: 'number', placeholder: '0' },
    { label: 'Supplier Delay (Days)', type: 'number', placeholder: '0' },
    { label: 'Reorder Level', type: 'number', placeholder: '0' },
  ];

  const staffingFields = [
    { label: 'Staff Count', type: 'number', placeholder: '0' },
    { label: 'Shift Timing', type: 'select', options: ['Morning', 'Afternoon', 'Evening', 'Night'] },
    { label: 'Peak Hour Staff', type: 'number', placeholder: '0' },
    { label: 'Overtime Hours', type: 'number', placeholder: '0' },
  ];

  const stockItems = [
    { name: "Roma Tomatoes", stock: `${Math.round(14 * m)} kg`, min: "20 kg", sup: "FreshFarms Inc", exp: "2 Days", stat: "Low", color: "text-red-400 bg-red-400/10" },
    { name: "Cheddar Cheese", stock: `${Math.round(45 * m)} kg`, min: "10 kg", sup: "Global Meats", exp: "14 Days", stat: "Overstock", color: "text-amber-400 bg-amber-400/10" },
    { name: "AP Flour", stock: `${Math.round(120 * m)} kg`, min: "50 kg", sup: "DryGoods Corp", exp: "6 Months", stat: "Healthy", color: "text-emerald-400 bg-emerald-400/10" },
    { name: "Fresh Salmon", stock: `${Math.round(12 * m)} kg`, min: "10 kg", sup: "SeaCatch Ltd", exp: "3 Days", stat: "Expiring", color: "text-indigo-400 bg-indigo-400/10" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-outfit tracking-tight text-white/90">Inventory &amp; Staffing</h2>
          <p className="text-white/50 mt-1">AI-driven predictive restocks, waste reduction, and supplier tracking.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-xl">
          <Zap className={`w-4 h-4 ${autoReorder ? 'text-indigo-400' : 'text-white/40'}`} />
          <span className="text-sm text-white/60 font-medium px-2">Auto-Reorder</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={autoReorder} onChange={() => setAutoReorder(!autoReorder)} className="sr-only peer" />
            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
          </label>
        </div>
      </div>

      {/* Manual Input Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="w-full flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm text-white/50">Simulate stock levels and staff schedules to generate optimization plans.</p>
            </div>
          </div>
        </div>

        <form
          ref={formRef}
          key={formKey}
          onSubmit={(e) => e.preventDefault()}
          className="p-6 border-t border-white/10 space-y-8 bg-black/20"
        >
          {/* Inventory Inputs */}
          <div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Inventory Data</p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {inventoryFields.map((field, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-medium text-white/60 mb-1">{field.label}</label>
                  <input
                    required
                    onChange={handleInputChange}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-teal-500/50"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Staffing Inputs */}
          <div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Staffing Data</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {staffingFields.map((field, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-medium text-white/60 mb-1">{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      required
                      onChange={handleInputChange}
                      className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-blue-500/50"
                    >
                      {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input
                      required
                      onChange={handleInputChange}
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-blue-500/50"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleGenerate}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Package className="w-4 h-4" /> Generate Inventory Forecast
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border border-rose-500/20 ml-auto"
            >
              <RefreshCw className="w-4 h-4" /> Reset Form
            </button>
          </div>
        </form>
      </div>

      {/* Alerts & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Alerts & AI Suggestions Panel */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white/90">Alerts &amp; AI Suggestions</h3>

          {showOutput ? (
            <>
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <div>
                  <p className="text-red-400 font-bold text-sm">Low Stock Warning</p>
                  <p className="text-white/70 text-xs mt-1 leading-relaxed">Tomatoes will run out in 2 days based on current consumption rate.</p>
                  <button
                    onClick={handleRestock}
                    className={`mt-2 text-xs text-white px-3 py-1 rounded transition-colors ${restocked ? 'bg-emerald-500' : 'bg-red-500 hover:bg-red-600'}`}
                  >
                    {restocked ? 'Restocked!' : 'Restock Now'}
                  </button>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
                <TrendingDown className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-amber-400 font-bold text-sm">Overstock Detected</p>
                  <p className="text-white/70 text-xs mt-1 leading-relaxed">Cheese stock exceeds 14-day projection. Reduce next purchase order.</p>
                  <button
                    onClick={handleAdjustPO}
                    className={`mt-2 text-xs px-3 py-1 rounded transition-colors ${poAdjusted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'}`}
                  >
                    {poAdjusted ? 'PO Adjusted!' : 'Adjust PO'}
                  </button>
                </div>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-indigo-400 font-bold text-sm">Expiring Soon</p>
                  <p className="text-white/70 text-xs mt-1 leading-relaxed">Batch #104 (Fresh Salmon) expires in 3 days. Move to priority use.</p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-12 text-center text-white/20">
              Generate forecast to see alerts and suggestions
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[400px] flex flex-col">
            <h3 className="text-sm font-semibold text-white/80 mb-4 text-center">Stock Levels vs Consumption Trend</h3>
            <div className="flex-1 min-h-0">
              <Bar data={mixedInventoryData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white/90">Current Stock Levels</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-white/40 uppercase bg-black/20">
              <tr>
                <th className="px-6 py-4 font-medium">Item Name</th>
                <th className="px-6 py-4 font-medium">Current Stock</th>
                <th className="px-6 py-4 font-medium">Min. Threshold</th>
                <th className="px-6 py-4 font-medium">Supplier</th>
                <th className="px-6 py-4 font-medium">Expiry Date</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {showOutput ? stockItems.map((item, i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-medium text-white/90 flex items-center gap-2">
                    <Box className="w-4 h-4 text-white/40" /> {item.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-white/70">{item.stock}</td>
                  <td className="px-6 py-4 text-white/50">{item.min}</td>
                  <td className="px-6 py-4 text-white/70">{item.sup}</td>
                  <td className="px-6 py-4 text-white/70">{item.exp}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${item.color}`}>
                      {item.stat}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-white/20">No data forecast yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
