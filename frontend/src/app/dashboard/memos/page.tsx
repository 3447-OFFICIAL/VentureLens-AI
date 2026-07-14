"use client";

import React, { useState } from "react";
import { 
  FileJson, Search, Filter, Plus, FileText, CheckCircle, 
  ChevronRight, Users, Play, Clock, Sparkles
} from "lucide-react";
import Link from "next/link";

export default function InvestmentMemosModule() {
  const [activeTab, setActiveTab] = useState("all");
  
  const memos = [
    { title: "Investment Memo - SynthAI Series A", company: "SynthAI", status: "Final", score: 84, owner: "Arjun Mehta", updated: "2h ago", color: "text-emerald-400 border-emerald-400/20 bg-emerald-500/10" },
    { title: "Investment Memo - QuantumDB Seed", company: "QuantumDB", status: "In Review", score: 88, owner: "Riya Shah", updated: "1d ago", color: "text-emerald-400 border-emerald-400/20 bg-emerald-500/10" },
    { title: "Investment Memo - Nexora Labs Seed", company: "Nexora Labs", status: "Draft", score: 72, owner: "Neha Gupta", updated: "5h ago", color: "text-blue-400 border-blue-400/20 bg-blue-500/10" },
    { title: "Investment Memo - EcoMove Series A", company: "EcoMove", status: "Draft", score: 62, owner: "Karan Patel", updated: "1d ago", color: "text-amber-400 border-amber-400/20 bg-amber-500/10" },
    { title: "Investment Memo - Vectora Seed", company: "Vectora", status: "Draft", score: 68, owner: "Arjun Mehta", updated: "2d ago", color: "text-blue-400 border-blue-400/20 bg-blue-500/10" },
    { title: "Investment Memo - HealthSync Seed", company: "HealthSync", status: "Final", score: 75, owner: "Riya Shah", updated: "2d ago", color: "text-emerald-400 border-emerald-400/20 bg-emerald-500/10" }
  ];

  return (
    <div className="flex flex-col h-full w-full space-y-6 text-zinc-300 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-geist tracking-tight text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-500" /> Investment Memos
          </h1>
          <p className="text-zinc-500 text-xs mt-1">Create and manage investment memorandums.</p>
        </div>
      </div>

      {/* Navigation and Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-zinc-900 pb-2">
        {/* Tabs */}
        <div className="flex gap-4">
          {[
            { id: "all", label: "All Memos" },
            { id: "draft", label: "Draft" },
            { id: "in_review", label: "In Review" },
            { id: "final", label: "Final" },
            { id: "archived", label: "Archived" }
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

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search memos..." 
              className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs pl-9 pr-4 py-1.5 focus:outline-none focus:border-blue-500 text-white" 
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-zinc-800 bg-zinc-900 text-zinc-300 rounded-lg text-xs font-semibold hover:bg-zinc-800">
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:opacity-90">
            <Plus className="h-3.5 w-3.5" /> New Memo
          </button>
        </div>
      </div>

      {/* Memos Table */}
      <div className="bg-zinc-950/40 border border-border/40 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-zinc-500 border-b border-zinc-900/60 pb-3 font-semibold bg-zinc-950/20">
                <th className="py-3 px-5">Title</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {memos.map((memo, i) => (
                <tr key={i} className="border-b border-zinc-900/40 hover:bg-zinc-900/20 last:border-0">
                  <td className="py-3.5 px-5 font-semibold text-white flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-zinc-500" />
                    <span>{memo.title}</span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 font-medium">{memo.company}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      memo.status === "Final" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      memo.status === "In Review" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      "bg-zinc-800 text-zinc-400 border-zinc-700"
                    }`}>{memo.status}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${memo.color}`}>
                      {memo.score}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded-full bg-zinc-900 border border-zinc-800 text-[9px] font-bold text-zinc-400 flex items-center justify-center">
                        {memo.owner.split(" ").map(w => w[0]).join("")}
                      </div>
                      <span className="text-zinc-300 font-medium">{memo.owner}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-500 font-medium">{memo.updated}</td>
                  <td className="py-3.5 px-5 text-right">
                    <button className="text-xs text-blue-400 font-semibold hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
