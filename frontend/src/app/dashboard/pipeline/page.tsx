"use client";

import { useState } from "react";
import { 
  Search, Plus, Filter, MoreHorizontal, MessageSquare, 
  Paperclip, Users, CheckCircle2, AlertCircle, Zap, Activity, Clock
} from "lucide-react";

export default function PipelinePage() {
  const [view, setView] = useState("kanban");
  
  const stages = [
    { id: "lead", name: "Sourcing", count: 24, color: "bg-zinc-800" },
    { id: "screen", name: "Screening", count: 12, color: "bg-blue-900/40" },
    { id: "dd", name: "Due Diligence", count: 4, color: "bg-purple-900/40" },
    { id: "ic", name: "Committee (IC)", count: 2, color: "bg-amber-900/40" },
    { id: "term", name: "Term Sheet", count: 1, color: "bg-emerald-900/40" }
  ];

  return (
    <div className="flex flex-col h-full w-full space-y-4">
      {/* Header & Metrics */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-geist font-semibold tracking-tight">Deal Pipeline</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1"><Activity className="h-4 w-4" /> 43 Active Deals</span>
            <span className="flex items-center gap-1"><Zap className="h-4 w-4 text-blue-400" /> 2 AI Automations Running</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-card border border-border rounded-lg p-1">
            <button className="px-3 py-1.5 text-sm font-medium bg-secondary rounded-md shadow-sm">Kanban</button>
            <button className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">List</button>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm">
            <Plus className="h-4 w-4" /> New Deal
          </button>
        </div>
      </div>

      {/* Toolbar: Filters & Approvals */}
      <div className="flex items-center justify-between bg-card border border-border p-2 rounded-lg">
        <div className="flex flex-1 items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground ml-2" />
          <input 
            type="text" 
            placeholder="Search deals, founders, or tags..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded-md hover:bg-secondary transition-colors text-muted-foreground">
            <Filter className="h-4 w-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-amber-500/30 bg-amber-500/10 text-amber-500 rounded-md hover:bg-amber-500/20 transition-colors">
            <CheckCircle2 className="h-4 w-4" /> 2 Pending Approvals
          </button>
        </div>
      </div>

      {/* Kanban Board Area (Supports Drag & Drop structurally) */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 pt-2">
        {stages.map(stage => (
          <div key={stage.id} className="min-w-[320px] max-w-[320px] flex flex-col bg-zinc-950/50 rounded-xl border border-border">
            
            {/* Stage Header */}
            <div className={`p-3 flex items-center justify-between border-b border-border rounded-t-xl ${stage.color}`}>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">{stage.name}</h3>
                <span className="bg-background border border-border text-xs px-2 py-0.5 rounded-full font-mono">{stage.count}</span>
              </div>
              <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4"/></button>
            </div>

            {/* Stage Content (Droppable Zone) */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[500px]">
              
              {/* Sample Draggable Deal Card */}
              <div className="p-4 bg-card border border-border rounded-lg shadow-sm hover:border-blue-500/50 cursor-grab active:cursor-grabbing transition-colors group relative">
                
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold">AC</div>
                    <h4 className="text-sm font-semibold text-foreground">Acme Corp</h4>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Series A</span>
                </div>
                
                <div className="text-xs text-muted-foreground mb-4">B2B Fintech Infrastructure</div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="h-6 w-6 rounded-full bg-emerald-500 border-2 border-card flex items-center justify-center text-[9px] font-bold text-white z-20">JD</div>
                      <div className="h-6 w-6 rounded-full bg-rose-500 border-2 border-card flex items-center justify-center text-[9px] font-bold text-white z-10">AK</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3" /> 4
                    </div>
                  </div>
                  <span className="text-xs font-mono font-medium">$5.0M</span>
                </div>

                {/* AI / Automation Indicator */}
                <div className="absolute -top-2 -right-2 h-5 w-5 bg-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Zap className="h-3 w-3 text-white" />
                </div>
              </div>

              {/* Sample Card 2 (Pending Approval) */}
              {stage.id === "ic" && (
                <div className="p-4 bg-card border border-amber-500/30 rounded-lg shadow-sm cursor-grab relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l-lg"></div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-semibold text-foreground">FinSync</h4>
                    <span className="text-[10px] text-amber-500 flex items-center gap-1"><AlertCircle className="h-3 w-3"/> IC Vote</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-4">AI Accounting Engine</div>
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <button className="text-xs bg-amber-500 text-black px-2 py-1 rounded font-medium hover:bg-amber-400">Approve</button>
                    <span className="text-xs font-mono font-medium">$2.5M</span>
                  </div>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
