"use client";

import React, { useState, useRef } from "react";
import { Search, Star, Puzzle, Edit, Filter, AlertTriangle, ChevronDown, ChevronUp, Database, LineChart, TrendingUp, RefreshCw } from "lucide-react";
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

import { useDate } from "@/context/DateContext";
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

const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export default function MenuPage() {
  const { startDate, endDate } = useDate();
  const { branch } = useGlobalFilters();

  const [showOutput, setShowOutput] = useState(false);
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [popularity, setPopularity] = useState("All");
  const [profitMargin, setProfitMargin] = useState("All");
  const [matrixFilter, setMatrixFilter] = useState("All");
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const [manualSeedTrigger, setManualSeedTrigger] = useState(0);

  const seed = hashString(startDate + endDate + branch + category + availability + popularity + profitMargin + matrixFilter + manualSeedTrigger);
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

  // Removed unused chartJS data definitions

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-outfit tracking-tight text-white/90">Menu Engineering</h2>
        <p className="text-white/50 mt-1">Optimize your menu profitability using the Star-Dog matrix.</p>
      </div>

      {/* Manual Input Section (Always Open) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="w-full flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm text-white/50">Enter menu item costs and sales metrics to update profitability analysis.</p>
            </div>
          </div>
        </div>

        <form ref={formRef} className="p-6 border-t border-white/10 space-y-8 bg-black/20" key={formKey} onSubmit={(e) => e.preventDefault()}>
          {/* Menu Data Inputs */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { label: 'Menu Item Name', type: 'text', placeholder: 'e.g. Avocado Toast' },
                { label: 'Category', type: 'select', options: ['Starter', 'Main', 'Dessert', 'Beverage'] },
                { label: 'Cost Price (₹)', type: 'number', placeholder: '0.00' },
                { label: 'Selling Price (₹)', type: 'number', placeholder: '0.00' },
                { label: 'Daily Orders', type: 'number', placeholder: '0' },
                { label: 'Preparation Time (mins)', type: 'number', placeholder: 'e.g. 15' },
                { label: 'Customer Rating', type: 'number', placeholder: '1-5' }
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-medium text-white/60 mb-1">{field.label}</label>
                  {field.type === 'select' ? (
                    <select required onChange={handleInputChange} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-orange-500/50">
                      {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input required onChange={handleInputChange} type={field.type} defaultValue={field.type === 'number' ? "0" : undefined} placeholder={field.placeholder} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-orange-500/50" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
            <button 
              onClick={handleGenerate}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              <LineChart className="w-4 h-4" /> Analyze Menu
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



      {/* 2x2 Graphs Grid Replacement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[400px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/80 mb-4 text-center">Profit vs Popularity</h3>
          <div className="flex-1 relative border-l-2 border-b-2 border-white/20 p-2">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 border-dashed border-l border-white/20"></div>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 border-dashed border-t border-white/20"></div>
            <div className="absolute top-0 right-0 p-2 text-xs text-amber-400 font-bold">Stars</div>
            <div className="absolute top-0 left-0 p-2 text-xs text-purple-400 font-bold">Puzzles</div>
            <div className="absolute bottom-0 right-0 p-2 text-xs text-blue-400 font-bold">Plow Horses</div>
            <div className="absolute bottom-0 left-0 p-2 text-xs text-red-400 font-bold">Dogs</div>
            {showOutput && (
              <>
                <div className="absolute w-3 h-3 bg-amber-400 rounded-full" style={{ left: `${Math.min(92*m, 100)}%`, top: `${100 - Math.min(64*m, 100)}%` }}></div>
                <div className="absolute w-3 h-3 bg-purple-400 rounded-full" style={{ left: `${Math.min(35*m, 100)}%`, top: `${100 - Math.min(73*m, 100)}%` }}></div>
                <div className="absolute w-3 h-3 bg-blue-400 rounded-full" style={{ left: `${Math.min(88*m, 100)}%`, top: `${100 - Math.min(25*m, 100)}%` }}></div>
                <div className="absolute w-3 h-3 bg-red-400 rounded-full" style={{ left: `${Math.min(20*m, 100)}%`, top: `${100 - Math.min(14*m, 100)}%` }}></div>
              </>
            )}
            <div className="absolute -left-6 top-1/2 -rotate-90 text-xs text-white/40 whitespace-nowrap">Profit Margin</div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/40">Popularity</div>
          </div>
        </div>
 
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[400px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/80 mb-6 text-center">Category Distribution</h3>
          <div className="flex-1 flex flex-col justify-center gap-6">
            {['Starters', 'Mains', 'Desserts', 'Beverages'].map((cat, i) => {
              const current = [15, 45, 20, 20][i];
              const projected = [20, 40, 25, 15][i];
              const barM = showOutput ? m : 0;
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-white/60">
                    <span>{cat}</span>
                  </div>
                  <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 flex">
                    <div className="h-full bg-indigo-500" style={{ width: `${current * barM}%` }}></div>
                    <div className="h-full bg-indigo-500/30" style={{ width: `${projected * barM}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-white/40">
                    <span>Current: {showOutput ? Math.round(current * m) : 0}%</span>
                    <span>Projected: {showOutput ? Math.round(projected * m) : 0}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu Grid Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white/90">Detailed Menu Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-white/40 uppercase bg-black/20">
              <tr>
                <th className="px-6 py-4 font-medium">Item Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Cost</th>
                <th className="px-6 py-4 font-medium">Profit Margin</th>
                <th className="px-6 py-4 font-medium">Pop. Score</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {showOutput ? [
                { name: "Truffle Pasta", cat: "Main", price: 34.0, cost: 12.0, margin: "64%", pop: 92, type: "Star", icon: Star, color: "text-amber-400" },
                { name: "Saffron Risotto", cat: "Main", price: 38.0, cost: 10.0, margin: "73%", pop: 35, type: "Puzzle", icon: Puzzle, color: "text-purple-400" },
                { name: "Fries", cat: "Starter", price: 6.0, cost: 4.5, margin: "25%", pop: 88, type: "Plow Horse", icon: () => '🐴', color: "text-blue-400" },
                { name: "Calamari", cat: "Starter", price: 14.0, cost: 12.0, margin: "14%", pop: 20, type: "Dog", icon: AlertTriangle, color: "text-red-400" },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-medium text-white/90 flex items-center gap-2">
                    <span className={item.color}>
                      {typeof item.icon === 'function' ? item.icon() : <item.icon className="w-4 h-4" />}
                    </span>
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-white/70">{item.cat}</td>
                  <td className="px-6 py-4 text-white/70">₹{item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-white/50">₹{item.cost.toFixed(2)}</td>
                  <td className="px-6 py-4 font-medium text-white/90">{item.margin}</td>
                  <td className="px-6 py-4 text-white/70">{Math.floor(item.pop * m)}/100</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-white/40 hover:text-indigo-400 transition-colors"><Edit className="w-4 h-4" /></button>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-white/20">No menu data analyzed yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
