"use client";

import React from "react";
import { Info, Shield, Users, TrendingUp, Zap, Globe, Cpu, Award } from "lucide-react";
import { useRole } from "@/context/RoleContext";

export default function AboutPage() {
  const { role } = useRole();

  const isSystemAdmin = role === "admin";

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
          <Info className="w-10 h-10" />
        </div>
        <h1 className="text-5xl font-bold font-outfit tracking-tight text-white/90">
          About <span className="text-indigo-400">Ai Sales Forecasting and Revenue Prediction</span>
        </h1>
        <p className="text-xl text-white/50 max-w-2xl mx-auto">
          Modernizing restaurant operations through prescriptive intelligence and predictive analytics.
        </p>
      </div>

      {/* Role-Specific Overview */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Zap className="w-32 h-32" />
        </div>
        
        <div className="relative z-10 space-y-6">
          <h2 className="text-2xl font-bold text-white/90">
            {isSystemAdmin ? "System Administrator Interface" : "Restaurant Manager Interface"}
          </h2>
          <p className="text-lg text-white/60 leading-relaxed">
            {isSystemAdmin 
              ? "The System Admin suite provides global oversight across all branches. It allows for cross-branch performance benchmarking and system-wide monitoring. Admins can oversee regional performance trends and monitor system-wide alerts to ensure operational stability."
              : "The Restaurant Manager suite is designed for daily operational excellence. It provides localized sales forecasts, inventory optimization alerts, and AI-driven staff scheduling. Managers can use prescriptive insights to make data-backed decisions that reduce waste and maximize branch profitability."
            }
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
             <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                   {isSystemAdmin ? <Globe className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                </div>
                <div>
                   <h4 className="font-bold text-white/90">{isSystemAdmin ? "Global Orchestration" : "Sales Growth"}</h4>
                   <p className="text-sm text-white/40 mt-1">
                      {isSystemAdmin ? "Manage multi-regional data flows and branch hierarchies." : "Boost revenue with AI-optimized pricing and bundles."}
                   </p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                   {isSystemAdmin ? <Shield className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                </div>
                <div>
                   <h4 className="font-bold text-white/90">{isSystemAdmin ? "Enterprise Security" : "Smart Operations"}</h4>
                   <p className="text-sm text-white/40 mt-1">
                      {isSystemAdmin ? "Granular role-based access control and audit trails." : "Automated inventory reordering and labor planning."}
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>


      {/* Footer / Version */}
      <div className="text-center border-t border-white/10 pt-8">
         <p className="text-xs text-white/20 uppercase tracking-[0.2em] font-black">
            Ai Sales Forecasting and Revenue Prediction
         </p>
      </div>
    </div>
  );
}
