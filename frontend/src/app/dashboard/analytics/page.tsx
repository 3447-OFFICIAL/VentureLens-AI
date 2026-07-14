"use client";

import React, { useState } from "react";
import { 
  Activity, Search, Filter, Plus, Calendar, CheckSquare, 
  ChevronRight, TrendingUp, TrendingDown, LayoutGrid, Globe, Compass
} from "lucide-react";
import Link from "next/link";

export default function AnalyticsModule() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-col h-full w-full space-y-6 text-zinc-300 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-geist tracking-tight text-white flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-500" /> Analytics
          </h1>
          <p className="text-zinc-500 text-xs mt-1">Deep insights and analytics.</p>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex gap-4 border-b border-zinc-900 pb-2">
        {[
          { id: "overview", label: "Overview" },
          { id: "deal_flow", label: "Deal Flow" },
          { id: "performance", label: "Performance" },
          { id: "benchmarks", label: "Benchmarks" },
          { id: "trends", label: "Trends" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-xs font-bold border-b-2 transition-all relative ${
              activeTab === tab.id 
                ? "border-blue-500 text-blue-400 font-bold" 
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Deal Flow Velocity", val: "2.3x", desc: "vs last quarter", trend: "up" },
          { label: "Win Rate", val: "18.7%", desc: "vs last quarter", trend: "up" },
          { label: "Time to Close", val: "45 days", desc: "vs last quarter", trend: "down" },
          { label: "Avg. Deck Size", val: "$2.4M", desc: "vs last quarter", trend: "up" }
        ].map((kpi, i) => (
          <div key={i} className="bg-zinc-950/40 border border-border/40 p-4 rounded-xl flex flex-col justify-between hover:border-zinc-800 transition-colors">
            <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">{kpi.label}</span>
            <div className="text-2xl font-bold font-geist text-white mt-2">{kpi.val}</div>
            <div className="text-[9px] text-zinc-500 mt-1">{kpi.desc}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Deal Flow by Stage (Donut Chart representation) */}
        <div className="lg:col-span-5 bg-zinc-950/40 border border-border/40 p-5 rounded-xl flex flex-col justify-between">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-6">Deal Flow by Stage</h3>
          
          <div className="flex items-center gap-6 my-auto">
            {/* Donut Chart Ring */}
            <div className="relative inline-flex items-center justify-center w-28 h-28 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="46" stroke="currentColor" strokeWidth="8" fill="none" className="text-zinc-900" />
                <circle cx="56" cy="56" r="46" stroke="currentColor" strokeWidth="8" fill="none" className="text-blue-500" strokeDasharray="289" strokeDashoffset="120" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Top Stage</span>
                <span className="text-sm font-extrabold text-white mt-0.5">Screening</span>
              </div>
            </div>

            <div className="flex-1 space-y-2 text-[11px] font-medium text-zinc-400">
              {[
                { label: "Initial Screening", pct: "45.2%", color: "bg-blue-500" },
                { label: "Due Diligence", pct: "28.1%", color: "bg-blue-600" },
                { label: "Partner Review", pct: "12.3%", color: "bg-indigo-600" },
                { label: "IC Review", pct: "7.2%", color: "bg-purple-600" },
                { label: "Term Sheet", pct: "3.2%", color: "bg-emerald-600" }
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className={`size-1.5 rounded-full ${s.color}`} />
                    <span>{s.label}</span>
                  </div>
                  <span className="font-mono text-zinc-300">{s.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="lg:col-span-7 bg-zinc-950/40 border border-border/40 p-5 rounded-xl flex flex-col justify-between min-h-[300px]">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Geographic Distribution</h3>
          
          <div className="flex-1 flex items-center justify-center p-4 bg-zinc-900/10 border border-zinc-900 rounded-lg relative overflow-hidden my-2">
            <Globe className="h-28 w-28 text-zinc-800/40 animate-spin-slow absolute" />
            
            <div className="z-10 w-full space-y-3">
              {[
                { region: "North America", pct: 68, count: 18, color: "bg-blue-600" },
                { region: "Europe", pct: 18, count: 4, color: "bg-indigo-600" },
                { region: "Asia", pct: 10, count: 2, color: "bg-purple-600" },
                { region: "Others", pct: 4, count: 1, color: "bg-zinc-600" }
              ].map((reg, i) => (
                <div key={i} className="flex items-center gap-4 text-xs">
                  <span className="w-24 text-zinc-300 font-semibold">{reg.region}</span>
                  <div className="flex-1 h-2 bg-zinc-950 rounded-full overflow-hidden">
                    <div className={`h-full ${reg.color} rounded-full`} style={{ width: `${reg.pct}%` }} />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono w-16 text-right">{reg.count} deals ({reg.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
