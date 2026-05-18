"use client";

import React, { useState, useRef } from "react";
import { 
  Users, 
  UserPlus, 
  Search, 
  Shield, 
  Mail, 
  Building2, 
  MoreHorizontal, 
  Edit, 
  Trash,
  UserCheck,
  UserX,
  Database,
  RefreshCw
} from "lucide-react";

const mockUsers = [
  { id: 1, name: "Alexander Pierce", email: "alex@epicure.com", role: "Admin", branch: "Global", status: "Active", lastLogin: "3 mins ago" },
  { id: 2, name: "Sarah Jenkins", email: "sarah.j@epicure.com", role: "Manager", branch: "NY Central", status: "Active", lastLogin: "2 hours ago" },
  { id: 3, name: "Hiroshi Tanaka", email: "h.tanaka@epicure.com", role: "Manager", branch: "TYO Shibuya", status: "Inactive", lastLogin: "2 days ago" },
  { id: 4, name: "Elena Rodriguez", email: "elena.r@epicure.com", role: "Admin", branch: "Global", status: "Active", lastLogin: "Just now" },
  { id: 5, name: "Marco Vieri", email: "m.vieri@epicure.com", role: "Manager", branch: "PAR Marais", status: "Active", lastLogin: "5 hours ago" },
];

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const handleGenerate = () => {
    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }
    setShowOutput(true);
  };

  const handleReset = () => {
    setShowOutput(false);
    setFormKey(prev => prev + 1);
    setSearchTerm("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-outfit tracking-tight text-white/90">
            User Management
          </h2>
          <p className="text-white/50 mt-1">
            Manage system access, define roles, and monitor user activity across the platform.
          </p>
        </div>
        <button className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20">
          <UserPlus className="w-4 h-4 mr-2" />
          Create New User
        </button>
      </div>

      {/* Manual Input Section (Always Open) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="w-full flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm text-white/50">Configure filters and security parameters to access the user database.</p>
            </div>
          </div>
        </div>

        <form ref={formRef} className="p-6 border-t border-white/10 space-y-8 bg-black/20" key={formKey} onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { label: 'Access Level', type: 'select', options: ['All Levels', 'Super Admin', 'Admin', 'Manager'] },
              { label: 'Branch Association', type: 'select', options: ['Global', 'NY Central', 'TYO Shibuya', 'PAR Marais'] },
              { label: 'Security Protocol', type: 'select', options: ['Standard', 'High Security', 'OAuth Restricted'] },
              { label: 'Filter Query', type: 'text', placeholder: 'e.g. active managers' }
            ].map((field, idx) => (
              <div key={idx}>
                <label className="block text-xs font-medium text-white/60 mb-1">{field.label}</label>
                {field.type === 'select' ? (
                  <select required className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-indigo-500/50">
                    {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input required type={field.type} placeholder={field.placeholder} className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/90 focus:outline-none focus:border-indigo-500/50" />
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
            <button 
              onClick={handleGenerate}
              className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" /> Load User Database
            </button>
            <button 
              onClick={handleReset}
              className="px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border border-rose-500/20 ml-auto"
            >
              <RefreshCw className="w-4 h-4" /> Reset Filters
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="card p-6 flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Users className="w-6 h-6" />
           </div>
           <div>
              <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Total Users</p>
              <h4 className="text-2xl font-bold text-white/90 font-outfit">{showOutput ? "48" : "0"}</h4>
           </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <UserCheck className="w-6 h-6" />
           </div>
           <div>
              <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Online Now</p>
              <h4 className="text-2xl font-bold text-white/90 font-outfit">{showOutput ? "12" : "0"}</h4>
           </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
              <UserX className="w-6 h-6" />
           </div>
           <div>
              <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Suspended</p>
              <h4 className="text-2xl font-bold text-white/90 font-outfit">{showOutput ? "3" : "0"}</h4>
           </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.01]">
           <h3 className="font-semibold text-white/90 font-outfit">Access Control List</h3>
           <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="text" 
                placeholder="Search name, email, or role..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
           </div>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left text-sm">
              <thead>
                 <tr className="text-white/40 border-b border-white/5 bg-white/[0.02]">
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Identitiy</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Security Role</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Affiliation</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Status</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Last Activity</th>
                    <th className="px-6 py-4"></th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {showOutput ? mockUsers.map((user) => (
                   <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-white/10 to-indigo-500/20 p-0.5 border border-white/5">
                               <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center font-bold text-xs text-white/60">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                               </div>
                            </div>
                            <div>
                               <p className="text-sm font-semibold text-white/90">{user.name}</p>
                               <div className="flex items-center gap-1.5 text-xs text-white/40">
                                  <Mail className="w-3 h-3" />
                                  {user.email}
                               </div>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                            <Shield className={`w-3.5 h-3.5 ${user.role === 'Admin' ? 'text-indigo-400' : 'text-amber-400 opacity-60'}`} />
                            <span className={`font-medium ${user.role === 'Admin' ? 'text-indigo-400' : 'text-amber-400 opacity-80'}`}>
                               {user.role}
                            </span>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2 text-white/60">
                            <Building2 className="w-3.5 h-3.5 opacity-40" />
                            <span>{user.branch}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-zinc-600'}`}></div>
                            <span className={user.status === 'Active' ? 'text-emerald-400 font-medium' : 'text-white/30'}>
                               {user.status}
                            </span>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-white/40 tabular-nums">
                         {user.lastLogin}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-white/5 rounded-lg text-white/30 hover:text-white/90 transition-colors">
                               <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-red-500/10 rounded-lg text-white/30 hover:text-red-400 transition-colors">
                               <Trash className="w-4 h-4" />
                            </button>
                         </div>
                      </td>
                   </tr>
                 )) : (
                    <tr>
                       <td colSpan={6} className="px-6 py-12 text-center text-white/20 italic">
                          Please load user database to view records
                       </td>
                    </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
         <p className="text-sm text-white/50">
            System Administrators can override branch-level configurations and deploy critical model updates globally.
         </p>
         <button className="text-indigo-400 hover:text-indigo-300 text-sm font-bold flex items-center gap-2 group transition-colors">
            Audit Activity Logs <Shield className="w-4 h-4 group-hover:rotate-12 transition-transform" />
         </button>
      </div>
    </div>
  );
}
