"use client";

import { Search, Brain, Building2, Briefcase, Command, Clock, Pin, FileType, FileSpreadsheet, ArrowRight, PieChart, Sparkles, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export default function GlobalSearchModule() {
  const [query, setQuery] = useState("Acme");
  const [aiEnabled, setAiEnabled] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All Results" },
    { id: "companies", label: "Companies" },
    { id: "deals", label: "Deals" },
    { id: "documents", label: "Documents" },
    { id: "reports", label: "Reports" },
    { id: "commands", label: "Commands" }
  ];

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto space-y-6">
      
      {/* Omni-search Header */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-2xl flex flex-col gap-4">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-6 w-6 text-muted-foreground" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies, docs, commands..." 
            className="w-full bg-transparent border-none focus:outline-none text-2xl font-medium pl-14 pr-32 placeholder:text-zinc-700 text-foreground"
            autoFocus
          />
          <div className="absolute right-4 flex items-center gap-3">
             <button 
               onClick={() => setAiEnabled(!aiEnabled)}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                 aiEnabled ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-foreground'
               }`}
             >
               <Sparkles className="h-3 w-3" /> AI Semantic
             </button>
             <span className="text-xs font-mono text-zinc-600 bg-zinc-900 px-2 py-1 rounded">⌘K</span>
          </div>
        </div>

        {/* Filter Strip */}
        <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
          <div className="flex gap-2 overflow-x-auto">
            {filters.map(filter => (
              <button 
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeFilter === filter.id ? 'bg-blue-600 text-white' : 'bg-zinc-900 border border-zinc-800 text-muted-foreground hover:bg-zinc-800 hover:text-foreground'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <button className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-zinc-800 transition-colors">
             <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Col: Results */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {aiEnabled && (
            <div className="bg-gradient-to-r from-purple-900/20 to-transparent border border-purple-500/20 p-5 rounded-xl">
               <div className="flex items-center gap-2 mb-2">
                 <Brain className="h-4 w-4 text-purple-400" />
                 <span className="text-sm font-semibold text-purple-50">AI Answer</span>
               </div>
               <p className="text-sm text-zinc-300 leading-relaxed">
                 Acme Corp is currently a Series A prospect in the Deal Flow pipeline (Due Diligence stage). The last uploaded document was the Q3 Financials, showing a burn rate of $450k/mo. 
               </p>
            </div>
          )}

          <div className="bg-card border border-border rounded-xl flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border bg-zinc-900/50">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top Results</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              
              <div className="group flex items-center justify-between p-3 rounded-lg hover:bg-zinc-900/80 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-900/20 text-blue-400 rounded-lg flex items-center justify-center border border-blue-500/30 shrink-0">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground flex items-center gap-2">Acme Corp <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] rounded border border-blue-500/20">Company</span></h4>
                    <p className="text-xs text-muted-foreground">B2B Fintech • Series A • Pipeline: Due Diligence</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="group flex items-center justify-between p-3 rounded-lg hover:bg-zinc-900/80 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-emerald-900/20 text-emerald-400 rounded-lg flex items-center justify-center border border-emerald-500/30 shrink-0">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground flex items-center gap-2">Acme_Q3_Actuals.xlsx <span className="px-1.5 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] rounded border border-zinc-700">Document</span></h4>
                    <p className="text-xs text-muted-foreground">Uploaded 2 days ago • Financials • 240 KB</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="group flex items-center justify-between p-3 rounded-lg hover:bg-zinc-900/80 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-rose-900/20 text-rose-400 rounded-lg flex items-center justify-center border border-rose-500/30 shrink-0">
                    <FileType className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground flex items-center gap-2">Acme_IC_Memo_v2.pdf <span className="px-1.5 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] rounded border border-zinc-700">Report</span></h4>
                    <p className="text-xs text-muted-foreground">Generated today • Investment Committee Memo</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="group flex items-center justify-between p-3 rounded-lg hover:bg-zinc-900/80 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-amber-900/20 text-amber-400 rounded-lg flex items-center justify-center border border-amber-500/30 shrink-0">
                    <Command className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground flex items-center gap-2">Create New Deal <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] rounded border border-amber-500/20">Command</span></h4>
                    <p className="text-xs text-muted-foreground">Quick Action: Add a new company to the pipeline.</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

            </div>
          </div>
        </div>

        {/* Right Col: Pinned & Recent */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="bg-card border border-border p-5 rounded-xl">
             <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
               <Pin className="h-4 w-4" /> Pinned
             </h3>
             <div className="space-y-1">
               <div className="flex items-center gap-3 p-2 hover:bg-zinc-900/50 rounded-lg cursor-pointer group transition-colors">
                 <Briefcase className="h-4 w-4 text-zinc-500 group-hover:text-blue-400" />
                 <span className="text-sm text-zinc-300 font-medium">Fund I Master Portfolio</span>
               </div>
               <div className="flex items-center gap-3 p-2 hover:bg-zinc-900/50 rounded-lg cursor-pointer group transition-colors">
                 <PieChart className="h-4 w-4 text-zinc-500 group-hover:text-emerald-400" />
                 <span className="text-sm text-zinc-300 font-medium">Q3 LP Report Deck</span>
               </div>
             </div>
          </div>

          <div className="bg-card border border-border p-5 rounded-xl flex-1">
             <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
               <Clock className="h-4 w-4" /> Recent Searches
             </h3>
             <div className="space-y-1">
               <div className="flex items-center gap-3 p-2 hover:bg-zinc-900/50 rounded-lg cursor-pointer group transition-colors">
                 <Search className="h-3 w-3 text-zinc-600" />
                 <span className="text-sm text-muted-foreground group-hover:text-foreground">FinSync series B term sheet</span>
               </div>
               <div className="flex items-center gap-3 p-2 hover:bg-zinc-900/50 rounded-lg cursor-pointer group transition-colors">
                 <Search className="h-3 w-3 text-zinc-600" />
                 <span className="text-sm text-muted-foreground group-hover:text-foreground">LendAI tech debt DD</span>
               </div>
               <div className="flex items-center gap-3 p-2 hover:bg-zinc-900/50 rounded-lg cursor-pointer group transition-colors">
                 <Search className="h-3 w-3 text-zinc-600" />
                 <span className="text-sm text-muted-foreground group-hover:text-foreground">B2B SaaS benchmarks</span>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
