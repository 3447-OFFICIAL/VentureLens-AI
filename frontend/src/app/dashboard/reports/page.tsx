"use client";

import React, { useState } from "react";
import { 
  FileJson, Search, Filter, Sparkles, Plus, Clock, User, 
  FileText, ShieldAlert, BadgeAlert, CheckCircle2, ChevronRight, BarChart3
} from "lucide-react";
import Link from "next/link";

export default function AIReportsModule() {
  const [activeTab, setActiveTab] = useState("all");
  
  const reports = [
    { company: "SynthAI", type: "Investment Memo", time: "2h ago", score: 84, scoreLabel: "Thesis Fit", status: "Completed", color: "text-emerald-400 border-emerald-400/20 bg-emerald-500/10" },
    { company: "QuantumDB", type: "Financial Analysis", time: "1d ago", score: 88, scoreLabel: "Under Valued", status: "Completed", color: "text-emerald-400 border-emerald-400/20 bg-emerald-500/10" },
    { company: "Vectora", type: "Technical DD Report", time: "2d ago", score: 68, scoreLabel: "High Debt", status: "Completed", color: "text-blue-400 border-blue-400/20 bg-blue-500/10" },
    { company: "Nemora Labs", type: "Market Analysis", time: "2d ago", score: 72, scoreLabel: "Large TAM", status: "Completed", color: "text-blue-400 border-blue-400/20 bg-blue-500/10" },
    { company: "EcoMove", type: "Risk Assessment", time: "3d ago", score: 62, scoreLabel: "Key Risks", status: "Completed", color: "text-amber-400 border-amber-400/20 bg-amber-500/10" },
    { company: "HealthSync", type: "Competitive Analysis", time: "3d ago", score: 75, scoreLabel: "Moated", status: "Completed", color: "text-emerald-400 border-emerald-400/20 bg-emerald-500/10" },
    { company: "Greenlyst", type: "Founder Assessment", time: "3d ago", score: 64, scoreLabel: "High Velocity", status: "Completed", color: "text-blue-400 border-blue-400/20 bg-blue-500/10" },
    { company: "PayFlow", type: "Financial Projections", time: "3d ago", score: 56, scoreLabel: "Burn Risk", status: "Completed", color: "text-amber-400 border-amber-400/20 bg-amber-500/10" }
  ];

  return (
    <div className="flex flex-col h-full w-full space-y-6 text-zinc-300 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-geist tracking-tight text-white flex items-center gap-2">
            <FileJson className="h-6 w-6 text-blue-500" /> AI Reports
          </h1>
          <p className="text-zinc-500 text-xs mt-1">AI-generated reports and analyses.</p>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col xl:flex-row justify-between gap-4 border-b border-zinc-900 pb-2">
        <div className="flex gap-4 overflow-x-auto">
          {[
            { id: "all", label: "All Reports" },
            { id: "financial", label: "Financial" },
            { id: "technical", label: "Technical" },
            { id: "market", label: "Market" },
            { id: "legal", label: "Legal" },
            { id: "risk", label: "Risk" },
            { id: "custom", label: "Custom" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-xs font-bold border-b-2 transition-all shrink-0 ${
                activeTab === tab.id 
                  ? "border-blue-500 text-blue-400 font-bold" 
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search reports..." 
              className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs pl-9 pr-4 py-1.5 focus:outline-none focus:border-blue-500 text-white" 
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-zinc-800 bg-zinc-900 text-zinc-300 rounded-lg text-xs font-semibold hover:bg-zinc-800">
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reports.map((r, i) => (
          <div 
            key={i} 
            className="p-5 bg-zinc-950/40 border border-border/40 hover:border-zinc-800 transition-colors rounded-xl flex flex-col justify-between group relative overflow-hidden"
          >
            <div>
              <div className="flex justify-between items-start gap-2 mb-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{r.type}</span>
                <span className="text-[9px] text-zinc-500">{r.time}</span>
              </div>
              <h4 className="text-base font-bold text-white mb-1 tracking-tight">{r.company}</h4>
              <p className="text-zinc-500 text-[10px] leading-relaxed">Generated by VentureLens AI. Vetted against investment thesis parameters.</p>
            </div>
            
            <div className="flex items-center justify-between border-t border-zinc-900/60 pt-4 mt-6">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${r.color}`}>
                {r.score}
              </span>
              <span className="text-[10px] text-zinc-400 font-semibold">{r.scoreLabel}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
