"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Zap,
  Users,
  Menu,
  Box,
  Database,
  LogOut,
  ChevronRight,
  ShieldCheck,
  BrainCircuit,
  BarChart3,
  Bell,
  Map,
  Receipt,
  Info,
} from "lucide-react";
import clsx from "clsx";
import { useRole } from "@/context/RoleContext";

const managerNav = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Transactions", icon: Receipt, href: "/transactions" },
  { name: "Forecast", icon: TrendingUp, href: "/forecast" },
  { name: "AI Recommendation", icon: Zap, href: "/recommendations" },
  { name: "Customer Insights", icon: Users, href: "/insights" },
  { name: "Menu", icon: Menu, href: "/menu" },
  { name: "Inventory & Staffing", icon: Box, href: "/inventory" },
  { name: "About", icon: Info, href: "/about" },
];

const adminNav = [
  { name: "Admin Dashboard", icon: ShieldCheck, href: "/admin/dashboard" },
  { name: "Explainable AI", icon: BarChart3, href: "/admin/xai" },
  { name: "Alerts Panel", icon: Bell, href: "/admin/alerts" },
  { name: "Multi-Branch View", icon: Map, href: "/admin/branches" },
  { name: "About", icon: Info, href: "/about" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setRole } = useRole();

  const currentNav = role === "manager" ? managerNav : adminNav;

  const handleLogout = () => {
    setRole(null);
    router.push("/login");
  };

  return (
    <div
      className={clsx(
        "group flex flex-col h-full bg-black/40 backdrop-blur-xl border-r border-white/10 transition-all duration-300 ease-in-out",
        "w-[260px]"
      )}
    >
      {/* Logo Area */}
      <div className="flex items-center h-16 px-6 border-b border-white/5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-500 mr-3">
          <Zap className="w-5 h-5 fill-indigo-500" />
        </div>
        <span className="font-outfit font-bold text-lg tracking-tight text-white/90">
          Ai <span className="text-indigo-400">Sales Forecasting</span>
        </span>
      </div>



      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <p className="px-2 text-[10px] font-bold tracking-widest text-white/30 uppercase mb-3">
          {role === "manager" ? "Operational Interface" : "Central Oversight"}
        </p>
        
        {currentNav.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center w-full px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 group/item",
                isActive
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-white/50 hover:bg-white/5 hover:text-white/90"
              )}
            >
              <item.icon
                className={clsx(
                  "flex-shrink-0 w-4 h-4 mr-3 transition-colors duration-200",
                  isActive
                    ? "text-indigo-400"
                    : "text-white/30 group-hover/item:text-white/60"
                )}
              />
              <span className="truncate">{item.name}</span>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-400/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-white/40 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200"
        >
          <LogOut className="flex-shrink-0 w-4 h-4 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
