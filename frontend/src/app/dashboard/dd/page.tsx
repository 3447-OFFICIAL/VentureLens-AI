"use client";

import React, { useState } from "react";
import { 
  ClipboardList, Search, Filter, Plus, Calendar, CheckSquare, 
  ChevronRight, Users, Play, Clock, BarChart3, AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function DueDiligenceDashboard() {
  const [activeTab, setActiveTab] = useState("in_progress");
  
  const ddItems = [
    { company: "SynthAI", stage: "Financial DD", status: "in_progress", progress: 78, owner: "Riya Shah", started: "May 10, 2026", due: "Jun 10, 2026", next: "Review Financials", color: "from-blue-500 to-indigo-500" },
    { company: "QuantumDB", stage: "Technical DD", status: "in_progress", progress: 89, owner: "Karan Patel", started: "May 24, 2026", due: "Jun 11, 2026", next: "Code Review", color: "from-blue-500 to-emerald-500" },
    { company: "Nemora Labs", stage: "Market DD", status: "in_progress", progress: 45, owner: "Neha Gupta", started: "May 22, 2026", due: "Jun 12, 2026", next: "Market Analysis", color: "from-blue-500 to-amber-500" },
    { company: "EcoMove", stage: "Legal DD", status: "in_progress", progress: 30, owner: "Karan Patel", started: "May 20, 2026", due: "Jun 13, 2026", next: "Review Contacts", color: "from-blue-500 to-orange-500" },
    { company: "Vectora", stage: "Financial DD", status: "in_progress", progress: 49, owner: "Arjun Mehta", started: "May 24, 2026", due: "Jun 14, 2026", next: "Unit Economics", color: "from-blue-500 to-indigo-500" },
    { company: "HealthSync", stage: "Technical DD", status: "in_progress", progress: 20, owner: "Karan Patel", started: "May 23, 2026", due: "Jun 15, 2026", next: "Security Review", color: "from-blue-500 to-emerald-500" }
  ];

  return (
    <div className="flex flex-col h-full w-full space-y-6 text-zinc-300 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-geist tracking-tight text-white flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-blue-500" /> Due Diligence
          </h1>
          <p className="text-zinc-500 text-xs mt-1">Track and manage our diligence processes.</p>
        </div>
      </div>

      {/* Navigation and Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-zinc-900 pb-2">
        {/* Tabs */}
        <div className="flex gap-4">
          {[
            { id: "pipeline", label: "Pipeline" },
            { id: "in_progress", label: "In Progress" },
            { id: "completed", label: "Completed" },
            { id: "on_held", label: "On Held" }
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
          <button className="text-[11px] text-blue-400 font-semibold hover:underline flex items-center gap-1.5 mr-2">
            <Calendar className="h-3.5 w-3.5" /> View Calendar
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-zinc-800 bg-zinc-900 text-zinc-300 rounded-lg text-xs font-semibold hover:bg-zinc-800">
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:opacity-90">
            <Plus className="h-3.5 w-3.5" /> New DD
          </button>
        </div>
      </div>

      {/* Due Diligence Table */}
      <div className="bg-zinc-950/40 border border-border/40 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-zinc-500 border-b border-zinc-900/60 pb-3 font-semibold bg-zinc-950/20">
                <th className="py-3 px-5">Company</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4 w-48">Progress</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Started</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Next Step</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ddItems.map((item, i) => (
                <tr key={i} className="border-b border-zinc-900/40 hover:bg-zinc-900/20 last:border-0">
                  <td className="py-3.5 px-5 font-semibold text-white flex items-center gap-2">
                    <div className="size-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-white">{item.company.charAt(0)}</div>
                    <span>{item.company}</span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 font-medium">{item.stage}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${item.color} rounded-full`} style={{ width: `${item.progress}%` }} />
                      </div>
                      <span className="font-mono font-bold text-zinc-300">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded-full bg-zinc-900 border border-zinc-800 text-[9px] font-bold text-zinc-400 flex items-center justify-center">
                        {item.owner.split(" ").map(w => w[0]).join("")}
                      </div>
                      <span className="text-zinc-300 font-medium">{item.owner}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 font-medium">{item.started}</td>
                  <td className="py-3.5 px-4 text-zinc-400 font-medium">{item.due}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] text-zinc-200 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded font-medium">{item.next}</span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button className="text-xs text-blue-400 font-semibold hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Metrics on bottom */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "In Progress", val: "6", desc: "Active diligence modules", color: "border-blue-500/20 bg-blue-500/5 text-blue-400" },
          { label: "Completed", val: "2", desc: "This quarter", color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" },
          { label: "On Held", val: "1", desc: "Requires founder info", color: "border-amber-500/20 bg-amber-500/5 text-amber-400" },
          { label: "Avg. Days to Complete", val: "18", desc: "From kickoff to IC memo", color: "border-zinc-800 bg-zinc-900/20 text-zinc-400" }
        ].map((m, i) => (
          <div key={i} className={`p-4 border rounded-xl flex flex-col justify-between ${m.color}`}>
            <span className="text-[10px] font-bold tracking-wider uppercase opacity-70">{m.label}</span>
            <div className="text-2xl font-extrabold font-geist mt-2 text-white">{m.val}</div>
            <p className="text-[10px] opacity-60 mt-1">{m.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
