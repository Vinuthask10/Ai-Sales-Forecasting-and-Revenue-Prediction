"use client";

import React, { useState } from "react";
import { Zap, Mail, Lock, ArrowRight, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import { useRole } from "@/context/RoleContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { setRole, registeredManager, setUserName } = useRole();
  const router = useRouter();
  const [selectedPersona, setSelectedPersona] = useState<"manager" | "admin" | null>(null);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("Password recovery link sent to your email.");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPersona) {
      alert("Please select a persona (Manager or Admin) before signing in.");
      return;
    }
    
    if (selectedPersona === 'admin') {
      if (email === "allbranches@admin.com" && password === "admin@123") {
        setRole('admin');
        router.push('/admin/dashboard');
      } else {
        alert("Invalid Admin credentials.");
        return;
      }
    } else {
      // Manager login validation against registeredManager
      if (registeredManager && email === registeredManager.email && password === registeredManager.password) {
        setUserName(registeredManager.name);
        setRole('manager');
        router.push('/');
      } else {
        alert("Invalid Manager credentials. Please make sure you have signed up and are using the correct email and password.");
        return;
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative p-6">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Logo */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <Zap className="w-10 h-10 fill-indigo-500" />
        </div>
        <h1 className="text-xl font-bold font-outfit text-white/90">
           Ai <span className="text-indigo-400">Sales Forecasting</span>
        </h1>
        <p className="text-white/40 text-sm font-medium uppercase tracking-[0.2em]">AI Intelligence Suite</p>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="p-8 space-y-8 bg-zinc-900/80 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white/90">Welcome Back</h2>
            <p className="text-sm text-white/40 leading-relaxed">
              Login to access high-accuracy sales forecasts and revenue optimizations.
            </p>
          </div>

          {/* Persona Selection */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
             <button 
               type="button"
               onClick={() => setSelectedPersona("manager")}
               className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${selectedPersona === "manager" ? 'bg-indigo-600/20 text-indigo-400 shadow-sm border border-indigo-500/20' : 'text-white/30 hover:text-white/50'}`}
             >
                <User className="w-3.5 h-3.5" /> Restaurant Manager
             </button>
             <button 
               type="button"
               onClick={() => setSelectedPersona("admin")}
               className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${selectedPersona === "admin" ? 'bg-indigo-600/20 text-indigo-400 shadow-sm border border-indigo-500/20' : 'text-white/30 hover:text-white/50'}`}
             >
                <ShieldCheck className="w-3.5 h-3.5" /> System Admin
             </button>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-3.5 h-3.5 rounded bg-white/5 border-white/10 checked:bg-indigo-500 transition-all" />
                <span className="text-white/40 group-hover:text-white/60">Remember device</span>
              </label>
              <button type="button" onClick={handleForgotPassword} className="text-white/30 hover:text-indigo-400 transition-colors">Forgot password?</button>
            </div>

            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-xl shadow-indigo-600/20 group"
            >
              Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          {selectedPersona === "manager" && (
            <div className="text-center pt-2">
              <span className="text-sm text-white/40">Don't have an account? </span>
              <Link href="/signup" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-xs text-white/30">
           Protected by <span className="text-white/50 font-bold">SHA-256 Encryption</span> & Local Hardware Key.
        </div>
      </div>
    </div>
  );
}
