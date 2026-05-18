"use client";

import React, { useState, useRef } from "react";
import { Search, IndianRupee, ShoppingCart, TrendingUp, Filter, CreditCard, ChevronDown, ChevronUp, Database, Save, FileText, RefreshCw } from "lucide-react";
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
import { Line } from 'react-chartjs-2';
import { useGlobalFilters } from "@/context/GlobalFiltersContext";
import { useDate } from "@/context/DateContext";
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

// Hash function
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export default function TransactionsPage() {
  const { startDate, endDate } = useDate();
  const { branch, orderType } = useGlobalFilters();

  // Local Filters
  const [showOutput, setShowOutput] = useState(false);
  const [timeSlot, setTimeSlot] = useState("All");
  const [paymentMethod, setPaymentMethod] = useState("All");
  const [category, setCategory] = useState("All");
  const [discountApplied, setDiscountApplied] = useState("All");
  const [customerType, setCustomerType] = useState("All");
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const [manualSeedTrigger, setManualSeedTrigger] = useState(0);

  const seed = hashString(startDate + endDate + branch + orderType + timeSlot + category + paymentMethod + customerType + discountApplied + manualSeedTrigger);
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

  // KPIs
  const totalSales = 125430 * kpiMultiplier;
  const totalOrders = Math.floor(3240 * kpiMultiplier);
  const avgOrderValue = showOutput ? totalSales / totalOrders : 0;
  const totalRevenue = totalSales * 1.2;

  // Charts Data
  const lineChartData = {
    labels: showOutput ? ['9 AM', '11 AM', '1 PM', '3 PM', '5 PM', '7 PM', '9 PM'] : [],
    datasets: [{
      label: 'Sales Over Time',
      data: showOutput ? [1200*kpiMultiplier, 2400*kpiMultiplier, 4500*kpiMultiplier, 2100*kpiMultiplier, 1800*kpiMultiplier, 5600*kpiMultiplier, 3200*kpiMultiplier] : [],
      borderColor: '#6366f1',
      stepped: true,
      tension: 0,
    }]
  };





  const heatmapData = {
    labels: showOutput ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : [],
    datasets: [{
      label: 'Peak Intensity',
      data: showOutput ? [30*kpiMultiplier, 45*kpiMultiplier, 40*kpiMultiplier, 55*kpiMultiplier, 80*kpiMultiplier, 90*kpiMultiplier, 85*kpiMultiplier] : [],
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
      borderColor: '#6366f1',
      borderWidth: 1,
      fill: true,
    }]
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-outfit tracking-tight text-white/90">Transactions & Sales</h2>
          <p className="text-white/50 mt-1">Deep dive into order data, revenue breakdowns, and historical trends.</p>
        </div>
      </div>

      {/* Manual Transaction Entry (Always Open) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="w-full flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm text-white/50">Log new transactions manually to update charts and tables.</p>
            </div>
          </div>
        </div>

        <form ref={formRef} className="p-6 border-t border-white/10 space-y-8 bg-black/20" key={formKey} onSubmit={(e) => e.preventDefault()}>
          {/* Transaction Details */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { label: 'Invoice ID', type: 'text', placeholder: '#INV-' },
                { label: 'Date & Time', type: 'datetime-local' },
                { label: 'Order Type', type: 'select', options: ['Dine-In', 'Takeaway', 'Online'] },
                { label: 'Table Number', type: 'number', placeholder: 'e.g. 12' },
                { label: 'Customer Name', type: 'text', placeholder: 'Enter Name' },
                { label: 'Payment Method', type: 'select', options: ['Card', 'UPI', 'Cash'] },
                { label: 'Order Status', type: 'select', options: ['Completed', 'Pending', 'Cancelled'] }
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

          {/* Sales Entry */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Menu Item', type: 'text', placeholder: 'e.g. Truffle Pasta' },
                { label: 'Quantity', type: 'number', placeholder: '1' },
                { label: 'Price (₹)', type: 'number', placeholder: '0.00' },
                { label: 'Discount (₹)', type: 'number', placeholder: '0.00' },
                { label: 'Tax (₹)', type: 'number', placeholder: '0.00' },
                { label: 'Final Amount (₹)', type: 'number', placeholder: '0.00' }
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-medium text-white/60 mb-1">{field.label}</label>
                  <input required onChange={handleInputChange} type={field.type} defaultValue={field.type === 'number' ? "0" : undefined} placeholder={field.placeholder} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-blue-500/50" />
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
              <Database className="w-4 h-4" /> Generation
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



      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center"><IndianRupee className="w-6 h-6" /></div>
          <div>
            <p className="text-white/50 text-sm font-medium">Total Sales</p>
            <p className="text-2xl font-bold text-white">
              <CountUp end={totalSales} prefix="₹" decimals={0} />
            </p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center"><ShoppingCart className="w-6 h-6" /></div>
          <div>
            <p className="text-white/50 text-sm font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-white">
              <CountUp end={totalOrders} />
            </p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center"><TrendingUp className="w-6 h-6" /></div>
          <div>
            <p className="text-white/50 text-sm font-medium">Avg Order Value</p>
            <p className="text-2xl font-bold text-white">
              <CountUp end={avgOrderValue} prefix="₹" decimals={2} />
            </p>
          </div>
        </div>
      </div>

      {/* Graph Grid (2x2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[300px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/80 mb-4 text-center">Sales over time</h3>
          <div className="flex-1 min-h-0"><Line data={lineChartData} options={{ maintainAspectRatio: false }} /></div>
        </div>
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[300px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/80 mb-6 text-center">Revenue by Category</h3>
          <div className="flex-1 flex flex-col justify-center gap-4">
            {['Main', 'Beverage', 'Starter', 'Dessert'].map((cat, i) => {
              const vals = [65000, 33430, 15000, 12000];
              const max = 65000;
              const width = (vals[i] / max) * 100;
              return (
                <div key={cat} className="space-y-1.5">
                   <div className="flex justify-between text-xs font-medium text-white/60">
                     <span>{cat}</span>
                     <span className="text-emerald-400 font-bold">₹{showOutput ? Math.round(vals[i] * m).toLocaleString() : 0}</span>
                   </div>
                   <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                     <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${showOutput ? width * m : 0}%` }}></div>
                   </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[300px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/80 mb-6 text-center">Order Type Distribution</h3>
          <div className="flex-1 flex items-center justify-center gap-8">
            <div className="grid grid-cols-10 gap-1">
              {Array.from({ length: 100 }).map((_, i) => {
                let colorClass = 'bg-white/5';
                if (showOutput) {
                  if (i < 45) colorClass = 'bg-indigo-500';
                  else if (i < 70) colorClass = 'bg-purple-500';
                  else if (i < 100) colorClass = 'bg-pink-500';
                }
                return <div key={i} className={`w-3 h-3 rounded-sm ${colorClass} transition-colors duration-500`}></div>;
              })}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-indigo-500"></div>
                <span className="text-xs text-white/60">Dine-In ({showOutput ? '45%' : '0%'})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-purple-500"></div>
                <span className="text-xs text-white/60">Takeaway ({showOutput ? '25%' : '0%'})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-pink-500"></div>
                <span className="text-xs text-white/60">Delivery ({showOutput ? '30%' : '0%'})</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[300px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/80 mb-6 text-center">Payment Distribution</h3>
          <div className="flex-1 flex flex-col justify-center gap-8">
            <div className="h-6 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 flex">
              <div className="h-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white/90 transition-all duration-500" style={{ width: `${showOutput ? 60 : 0}%` }}>{showOutput ? '60%' : ''}</div>
              <div className="h-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white/90 transition-all duration-500" style={{ width: `${showOutput ? 30 : 0}%` }}>{showOutput ? '30%' : ''}</div>
              <div className="h-full bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white/90 transition-all duration-500" style={{ width: `${showOutput ? 10 : 0}%` }}>{showOutput ? '10%' : ''}</div>
            </div>
            <div className="flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-white/80 font-medium">Card</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-white/80 font-medium">UPI</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-xs text-white/80 font-medium">Cash</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Area */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <h3 className="text-lg font-semibold text-white/90">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-white/40 uppercase bg-black/20">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Items</th>
                  <th className="px-6 py-4 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {showOutput ? [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-mono text-indigo-400">#ORD-{8000 + i}</td>
                    <td className="px-6 py-4 text-white/70">2026-05-1{i}</td>
                    <td className="px-6 py-4 text-white/70">{i+1} items</td>
                    <td className="px-6 py-4 text-emerald-400 font-medium text-right">₹{(45.50 * i * m).toFixed(2)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-white/20">No data generated yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats Right Side */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white/90 px-1">Quick Stats</h3>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Total Sales</p>
            <p className="text-2xl font-bold text-white"><CountUp end={totalSales} prefix="₹" /></p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Avg Order Value</p>
            <p className="text-2xl font-bold text-white"><CountUp end={avgOrderValue} prefix="₹" decimals={2} /></p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-white"><CountUp end={totalOrders} /></p>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl">
            <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">Total Revenue Card</p>
            <p className="text-3xl font-bold text-white"><CountUp end={totalRevenue} prefix="₹" /></p>
          </div>
        </div>
      </div>
    </div>
  );
}
