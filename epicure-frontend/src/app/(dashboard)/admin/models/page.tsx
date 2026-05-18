"use client";

import React, { useState, useRef } from "react";
import { BrainCircuit, Play, Activity, Save, CheckCircle2, History } from "lucide-react";
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
import { Line, Bar } from 'react-chartjs-2';

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

export default function ModelManagementPage() {
  const [modelType, setModelType] = useState("XGBoost");
  const [dataset, setDataset] = useState("Q1_Q2_2024_Sales");
  const [version, setVersion] = useState("v2.4.1 (Current)");
  
  // Hyperparameters
  const [learningRate, setLearningRate] = useState(0.01);
  const [maxDepth, setMaxDepth] = useState(6);
  const [estimators, setEstimators] = useState(100);

  const [showOutput, setShowOutput] = useState(false);
  const [isRetraining, setIsRetraining] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [manualSeedTrigger, setManualSeedTrigger] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = () => {
    if (showOutput) {
      setManualSeedTrigger(prev => prev + 1);
    }
  };

  const handleRetrain = () => {
    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }
    setIsRetraining(true);
    setShowOutput(true);
    setManualSeedTrigger(prev => prev + 1);
    setTimeout(() => setIsRetraining(false), 3000);
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => setIsDeploying(false), 2000);
  };

  const seedStr = modelType + dataset + version + learningRate + maxDepth + estimators + manualSeedTrigger;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    const char = seedStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const m = 1 + (Math.abs(hash) % 20) / 100;

  const kpiMultiplier = showOutput ? m : 0;

  // Charts
  const accuracyOverTime = {
    labels: showOutput ? ['v2.1', 'v2.2', 'v2.3', 'v2.4', 'v2.4.1'] : [],
    datasets: [{
      label: 'Model Accuracy (R²)',
      data: showOutput ? [0.85 * m, 0.88 * m, 0.89 * m, 0.92 * m, Math.min(0.94 * m, 0.99)] : [],
      borderColor: '#10b981',
      tension: 0.4,
    }]
  };

  const modelComparison = {
    labels: showOutput ? ['XGBoost', 'LSTM', 'ARIMA', 'Prophet'] : [],
    datasets: [
      { label: 'MAE', data: showOutput ? [12.5 / m, 15.2 / m, 22.4 / m, 18.6 / m] : [], backgroundColor: '#6366f1' },
      { label: 'RMSE', data: showOutput ? [16.8 / m, 19.5 / m, 28.1 / m, 24.3 / m] : [], backgroundColor: '#ec4899' },
    ]
  };

  const lossCurve = {
    labels: showOutput ? Array.from({length: 20}, (_, i) => `Epoch ${i*5}`) : [],
    datasets: [{
      label: 'Training Loss',
      data: showOutput ? [100/m, 80/m, 60/m, 45/m, 35/m, 28/m, 24/m, 21/m, 19/m, 17/m, 16/m, 15/m, 14.5/m, 14.2/m, 14.0/m, 13.9/m, 13.8/m, 13.8/m, 13.7/m, 13.7/m] : [],
      borderColor: '#f59e0b',
      tension: 0.4,
    }]
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-outfit tracking-tight text-white/90">Model Management Lab</h2>
          <p className="text-white/50 mt-1">Configure hyperparameters, retrain algorithms, and deploy to production.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Panel: Configuration */}
        <form ref={formRef} className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white/90">Model Configuration</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/50 uppercase font-bold mb-2 block">Algorithm</label>
              <select required value={modelType} onChange={e => { setModelType(e.target.value); handleInputChange(); }} className="w-full h-10 px-3 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none">
                <option value="XGBoost">XGBoost (Active)</option>
                <option value="LSTM">LSTM</option>
                <option value="ARIMA">ARIMA</option>
                <option value="Prophet">Prophet</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-white/50 uppercase font-bold mb-2 block">Training Dataset</label>
              <select required value={dataset} onChange={e => { setDataset(e.target.value); handleInputChange(); }} className="w-full h-10 px-3 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none">
                <option value="Q1_Q2_2024_Sales">Q1-Q2 2024 Historical</option>
                <option value="Full_2023">Full Year 2023</option>
                <option value="Custom_Import">Custom Data Source...</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-white/50 uppercase font-bold mb-2 block">Version Selector</label>
              <select required value={version} onChange={e => { setVersion(e.target.value); handleInputChange(); }} className="w-full h-10 px-3 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none">
                <option value="v2.4.1 (Current)">v2.4.1 (Current Production)</option>
                <option value="v2.4.0">v2.4.0 (Rollback)</option>
                <option value="v3.0.0-beta">v3.0.0-beta (Experimental)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <h4 className="text-xs text-white/50 uppercase font-bold">Hyperparameters</h4>
            
            <div>
              <div className="flex justify-between text-xs text-white/80 mb-1">
                <span>Learning Rate</span><span>{learningRate}</span>
              </div>
              <input type="range" min="0.001" max="0.1" step="0.001" value={learningRate} onChange={e => { setLearningRate(Number(e.target.value)); handleInputChange(); }} className="w-full accent-indigo-500" />
            </div>

            <div>
              <div className="flex justify-between text-xs text-white/80 mb-1">
                <span>Max Depth</span><span>{maxDepth}</span>
              </div>
              <input type="range" min="3" max="15" step="1" value={maxDepth} onChange={e => { setMaxDepth(Number(e.target.value)); handleInputChange(); }} className="w-full accent-indigo-500" />
            </div>

            <div>
              <div className="flex justify-between text-xs text-white/80 mb-1">
                <span>Estimators (Trees)</span><span>{estimators}</span>
              </div>
              <input type="range" min="50" max="500" step="10" value={estimators} onChange={e => { setEstimators(Number(e.target.value)); handleInputChange(); }} className="w-full accent-indigo-500" />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <button 
              onClick={handleRetrain} disabled={isRetraining}
              className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isRetraining ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isRetraining ? "Training in progress..." : "Initiate Retraining"}
            </button>
            <button 
              onClick={handleDeploy} disabled={isDeploying || isRetraining}
              className="w-full py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isDeploying ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              Deploy to Production
            </button>
          </div>
        </form>

        {/* Right Panel: Charts */}
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[300px] flex flex-col">
              <h3 className="text-sm font-semibold text-white/80 mb-4">Model Accuracy Over Time (R²)</h3>
              <div className="flex-1 min-h-0">
                {showOutput ? (
                  <Line data={accuracyOverTime} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-xs italic">Initiate retraining to see performance metrics</div>
                )}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[300px] flex flex-col">
              <h3 className="text-sm font-semibold text-white/80 mb-4">Model Comparison (MAE, RMSE)</h3>
              <div className="flex-1 min-h-0">
                {showOutput ? (
                  <Bar data={modelComparison} options={{ maintainAspectRatio: false }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-xs italic">Initiate retraining to see model comparisons</div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl h-[350px] flex flex-col">
            <h3 className="text-sm font-semibold text-white/80 mb-4">Training Loss Curve</h3>
            <div className="flex-1 min-h-0">
              {showOutput ? (
                <Line data={lossCurve} options={{ maintainAspectRatio: false }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20 text-xs italic">Initiate retraining to see loss progression</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
