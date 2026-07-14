"use client";

import React, { useState } from "react";
import { 
  ClipboardList, Search, Filter, Plus, Calendar, CheckSquare, 
  ChevronRight, Users, Play, Clock, BarChart3, AlertCircle, X, CheckCircle
} from "lucide-react";
import Link from "next/link";

interface DDItem {
  id: string;
  company: string;
  stage: string;
  progress: number;
  owner: string;
  started: string;
  due: string;
  next: string;
  color: string;
  subtasks: { id: string; name: string; done: boolean }[];
}

export default function DueDiligenceDashboard() {
  const [activeTab, setActiveTab] = useState("in_progress");
  const [selectedDD, setSelectedDD] = useState<DDItem | null>(null);
  
  const [ddItems, setDdItems] = useState<DDItem[]>([
    {
      id: "synthai",
      company: "SynthAI",
      stage: "Financial DD",
      progress: 75,
      owner: "Riya Shah",
      started: "May 10, 2026",
      due: "Jun 10, 2026",
      next: "Review Financials",
      color: "from-blue-500 to-indigo-500",
      subtasks: [
        { id: "1", name: "Q1-Q3 Profit & Loss Audit", done: true },
        { id: "2", name: "Customer Concentration Ledger", done: true },
        { id: "3", name: "Tax Audit Compliance", done: true },
        { id: "4", name: "3-Year Projections Audit", done: false }
      ]
    },
    {
      id: "quantumdb",
      company: "QuantumDB",
      stage: "Technical DD",
      progress: 80,
      owner: "Karan Patel",
      started: "May 24, 2026",
      due: "Jun 11, 2026",
      next: "Code Review",
      color: "from-blue-500 to-emerald-500",
      subtasks: [
        { id: "1", name: "Database Scale Benchmarking", done: true },
        { id: "2", name: "Security Penetration Audit", done: true },
        { id: "3", name: "Open Source Licensing Audit", done: true },
        { id: "4", name: "Architecture & Code Review", done: false }
      ]
    },
    {
      id: "nemora",
      company: "Nemora Labs",
      stage: "Market DD",
      progress: 40,
      owner: "Neha Gupta",
      started: "May 22, 2026",
      due: "Jun 12, 2026",
      next: "Market Analysis",
      color: "from-blue-500 to-amber-500",
      subtasks: [
        { id: "1", name: "TAM Analysis", done: true },
        { id: "2", name: "Competitor Matrix Mapping", done: false },
        { id: "3", name: "Customer Interviews (x5)", done: false },
        { id: "4", name: "Pricing Model Benchmark", done: false }
      ]
    },
    {
      id: "ecomove",
      company: "EcoMove",
      stage: "Legal DD",
      progress: 25,
      owner: "Karan Patel",
      started: "May 20, 2026",
      due: "Jun 13, 2026",
      next: "Review Contacts",
      color: "from-blue-500 to-orange-500",
      subtasks: [
        { id: "1", name: "Articles of Incorporation", done: true },
        { id: "2", name: "Key Customer Contracts Review", done: false },
        { id: "3", name: "Employee IP Assignments", done: false },
        { id: "4", name: "Litigation Disclosure Verification", done: false }
      ]
    }
  ]);

  const handleToggleSubtask = (ddId: string, subtaskId: string) => {
    setDdItems(prev => prev.map(item => {
      if (item.id !== ddId) return item;
      
      const newSubtasks = item.subtasks.map(st => st.id === subtaskId ? { ...st, done: !st.done } : st);
      const doneCount = newSubtasks.filter(st => st.done).length;
      const newProgress = Math.round((doneCount / newSubtasks.length) * 100);
      
      const updatedItem = {
        ...item,
        subtasks: newSubtasks,
        progress: newProgress
      };
      
      if (selectedDD && selectedDD.id === ddId) {
        setSelectedDD(updatedItem);
      }
      
      return updatedItem;
    }));
  };

  return (
    <div className="flex flex-col h-full w-full space-y-6 text-zinc-300 font-sans relative">
      
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
        <div className="flex gap-4">
          <button className="pb-3 text-xs font-bold border-b-2 border-blue-500 text-blue-400">In Progress</button>
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
                    <button 
                      onClick={() => setSelectedDD(item)}
                      className="text-xs text-blue-400 font-semibold hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Due Diligence Checklist Modal */}
      {selectedDD && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedDD(null)} />
          
          <div className="relative bg-zinc-950 border border-zinc-800 p-6 rounded-xl shadow-2xl w-full max-w-lg z-10 space-y-5">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{selectedDD.company} - {selectedDD.stage}</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Toggle subtasks below to recalculate overall diligence progress.</p>
              </div>
              <button onClick={() => setSelectedDD(null)} className="text-zinc-500 hover:text-zinc-300"><X className="h-4.5 w-4.5" /></button>
            </div>
            
            {/* Progress indicator */}
            <div className="bg-zinc-900/30 border border-zinc-900 p-4 rounded-lg flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-semibold">Total Progress</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-zinc-950 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${selectedDD.color} rounded-full`} style={{ width: `${selectedDD.progress}%` }} />
                </div>
                <span className="text-xs font-bold font-mono text-white">{selectedDD.progress}%</span>
              </div>
            </div>

            {/* Checkable Subtasks list */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Subtask Checklist</h4>
              <div className="divide-y divide-zinc-900 border border-zinc-900 rounded-lg overflow-hidden bg-zinc-900/10">
                {selectedDD.subtasks.map(st => (
                  <div 
                    key={st.id} 
                    onClick={() => handleToggleSubtask(selectedDD.id, st.id)}
                    className="p-3.5 flex items-center gap-3 hover:bg-zinc-900/30 transition-colors cursor-pointer"
                  >
                    <input 
                      type="checkbox" 
                      checked={st.done}
                      readOnly
                      className="size-4 rounded border-zinc-800 bg-zinc-950 text-blue-500 focus:ring-0 cursor-pointer"
                    />
                    <span className={`text-xs font-semibold ${st.done ? "line-through text-zinc-500" : "text-zinc-200"}`}>
                      {st.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-900 flex justify-end">
              <button 
                onClick={() => setSelectedDD(null)}
                className="px-4 py-2 bg-blue-600 hover:opacity-90 text-white rounded-lg text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
