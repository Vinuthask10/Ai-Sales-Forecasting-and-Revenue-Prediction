"use client";

import React, { useRef, useState } from "react";
import { Bell, Calendar as CalendarIcon, Download, ChevronDown } from "lucide-react";
import { useDate } from "@/context/DateContext";
import { useRole } from "@/context/RoleContext";
import { useGlobalFilters } from "@/context/GlobalFiltersContext";

export default function TopBar() {
  const { startDate, setStartDate, endDate, setEndDate } = useDate();
  const { branch, setBranch, orderType, setOrderType, weather, setWeather, festivalMode, setFestivalMode } = useGlobalFilters();
  const { role, userName } = useRole();
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Format date for display (e.g., "Sep 24, 2024")
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDownload = () => {
    window.print();
  };

  // The search handles dynamically as user types, no need for Enter mock alert.
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="flex items-center justify-between h-16 px-8 bg-black/20 backdrop-blur-md border-b border-white/5 sticky top-0 z-10 w-full">
      {/* Left side: Path / Title */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-white/90 tracking-tight font-outfit">
          Dashboard
        </h1>
      </div>



      {/* Right side: Actions & Profile */}
      <div className="flex items-center space-x-4 relative">
        {/* Actions */}
        <button 
          onClick={handleDownload}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          title="Print / Save PDF"
        >
          <Download className="w-4 h-4" />
        </button>
        <button 
          onClick={toggleNotifications}
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full shadow-sm shadow-red-500/50 ring-2 ring-black"></span>
        </button>
        
        {showNotifications && (
          <div className="absolute top-12 right-12 w-64 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-4 z-50">
            <h3 className="text-sm font-semibold text-white mb-2">Notifications</h3>
            <div className="text-xs text-white/60 p-2 bg-white/5 rounded-lg mb-2">
              Low inventory alert: Fresh Basil at Downtown Branch.
            </div>
            <div className="text-xs text-white/60 p-2 bg-white/5 rounded-lg">
              Sales target exceeded for Q3!
            </div>
          </div>
        )}

        {/* Separator */}
        <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block"></div>

        {/* Profile */}
        <button className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-sm shadow-indigo-500/20">
            <div className="w-full h-full rounded-full bg-black/50 overflow-hidden flex items-center justify-center">
              <span className="text-white/90 text-sm font-semibold inline-block">
                {role === 'admin' ? 'AD' : 'MG'}
              </span>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-medium text-white/90 leading-none">
              {role === 'admin' ? 'System Admin' : (userName || 'Restaurant Manager')}
            </span>
            <span className="text-xs text-white/40 mt-1 leading-none uppercase">
              {role}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-white/40 hidden sm:block" />
        </button>
      </div>


    </header>
  );
}
