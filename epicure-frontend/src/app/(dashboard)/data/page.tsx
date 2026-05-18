"use client";

import React, { useState } from "react";
import { Upload, FileText, Database, CheckCircle2, XCircle, Search, Filter } from "lucide-react";

export default function DataManagementPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [searchActive, setSearchActive] = useState(false);
  
  const [datasets, setDatasets] = useState([
    { name: "transactional_data.csv", size: "102 KB", status: "Active" },
    { name: "external_factors.csv", size: "36 KB", status: "Active" },
    { name: "operational_inputs.csv", size: "27 KB", status: "Active" },
    { name: "marketing_inputs.csv", size: "24 KB", status: "Synced" },
  ]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      setUploadStatus("success");
      
      setDatasets(prev => [
        { name: file.name, size: `${Math.round(file.size / 1024)} KB`, status: "Active" },
        ...prev
      ]);

      setTimeout(() => setUploadStatus("idle"), 3000);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-outfit tracking-tight text-white/90">
          Data Management
        </h2>
        <p className="text-white/50 mt-1">
          Ingest new datasets and monitor raw input flows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Card */}
        <div className="col-span-1 md:col-span-2 rounded-2xl bg-white/5 border border-white/10 p-8 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/5 -z-10" />
          
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-2">
            <Upload className="w-8 h-8" />
          </div>
          
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-white/90">Upload New Dataset</h3>
            <p className="text-sm text-white/50 max-w-sm">
              Upload your CSV or Excel files (e.g., transactional_data.csv) to synchronize with the AI models.
            </p>
          </div>

          <div className="flex flex-col items-center w-full max-w-md space-y-4">
            <label className="w-full flex flex-col items-center px-4 py-8 bg-black/40 text-white/40 rounded-2xl border-2 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-black/60 transition-all cursor-pointer group">
              <FileText className="w-8 h-8 mb-2 group-hover:text-indigo-400 transition-colors" />
              <span className="text-sm font-medium">Click to browse or drag & drop</span>
              <span className="text-xs mt-1 opacity-50">CSV, XLSX, or JSON</span>
              <input type="file" className="hidden" onChange={handleUpload} accept=".csv,.xlsx,.json" />
            </label>

            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-indigo-400">
                <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                Processing dataset...
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-lg border border-emerald-400/20">
                <CheckCircle2 className="w-4 h-4" />
                Dataset successfully synchronized!
              </div>
            )}
          </div>
        </div>

        {/* Dataset Stats */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-6 overflow-y-auto max-h-[400px]">
          <h3 className="text-lg font-semibold text-white/90 font-outfit">Active Datasets</h3>
          
          <div className="space-y-4">
            {datasets.map((d, i) => (
              <div key={i} className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <Database className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div className="text-xs truncate">
                    <div className="text-white/90 font-medium truncate" title={d.name}>{d.name}</div>
                    <div className="text-white/40">{d.size}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded ml-2 shrink-0">
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
