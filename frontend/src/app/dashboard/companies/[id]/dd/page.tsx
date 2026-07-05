"use client";

import { useState } from "react";
import { ShieldCheck, DollarSign, Code2, Lock, Scale, Globe2, Leaf, CheckSquare, Clock, FileCheck, Brain, FileText, Paperclip, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

export default function DueDiligenceModule() {
  const [activeCategory, setActiveCategory] = useState("financial");

  const categories = [
    { id: "financial", label: "Financial", icon: DollarSign, status: "in_progress", progress: 65 },
    { id: "technical", label: "Technical", icon: Code2, status: "needs_review", progress: 90 },
    { id: "cyber", label: "Cybersecurity", icon: Lock, status: "done", progress: 100 },
    { id: "legal", label: "Legal", icon: Scale, status: "in_progress", progress: 40 },
    { id: "compliance", label: "Compliance", icon: ShieldCheck, status: "todo", progress: 0 },
    { id: "market", label: "Market", icon: Globe2, status: "done", progress: 100 },
    { id: "esg", label: "ESG", icon: Leaf, status: "todo", progress: 0 },
  ];

  return (
    <div className="flex flex-col h-full w-full space-y-6">
      
      {/* Header: Progress, Approvals, Timeline */}
      <div className="bg-card border border-border p-5 rounded-xl flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-geist font-semibold">Acme Corp • Due Diligence</h1>
            <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-xs font-semibold rounded-md border border-amber-500/20">In Progress</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Target IC Date: Nov 15, 2025 (14 days remaining)</p>
          
          {/* Global Progress Bar */}
          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-blue-500 w-[56%]"></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>56% Complete (42/75 Tasks)</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3"/> Last activity 2h ago</span>
          </div>
        </div>
        
        {/* Approvals Block */}
        <div className="flex flex-col gap-3 min-w-[250px] border-l border-border pl-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Final Approvals</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] border border-emerald-500/30">JD</div> Partner</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center text-[10px] border border-zinc-700">AK</div> Legal</span>
            <div className="h-4 w-4 rounded-full border border-zinc-600"></div>
          </div>
          <button className="mt-2 w-full bg-primary text-primary-foreground py-1.5 rounded-lg text-sm font-medium hover:opacity-90">
            Request Approval
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Sidebar: Categories Navigation */}
        <div className="w-full lg:w-64 flex flex-col gap-2">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCategory(cat.id)}
              className={`flex flex-col p-3 rounded-lg border text-left transition-colors ${
                activeCategory === cat.id ? "bg-zinc-900/80 border-zinc-700" : "bg-card border-transparent hover:bg-zinc-900/40 hover:border-zinc-800"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className="flex items-center gap-2">
                  <cat.icon className={`h-4 w-4 ${activeCategory === cat.id ? "text-blue-400" : "text-muted-foreground"}`} />
                  <span className={`font-medium text-sm ${activeCategory === cat.id ? "text-foreground" : "text-muted-foreground"}`}>{cat.label}</span>
                </div>
                {cat.status === "done" && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                {cat.status === "needs_review" && <AlertCircle className="h-3 w-3 text-amber-500" />}
              </div>
              <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden">
                <div className={`h-full ${cat.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{width: `${cat.progress}%`}}></div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content Area: Checklist, AI, Evidence */}
        <div className="flex-1 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
          
          <div className="p-4 border-b border-border flex justify-between items-center bg-zinc-900/50">
            <h2 className="font-semibold text-lg capitalize">{activeCategory} Diligence</h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded-md text-xs font-medium hover:bg-purple-600/30">
                <Brain className="h-3 w-3" /> AI Scan
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md text-xs font-medium hover:opacity-90">
                <FileText className="h-3 w-3" /> Generate Report
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* AI Findings (Dynamic based on category) */}
            <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-purple-400 flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4" /> AI Auto-Findings
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3 bg-black/40 p-3 rounded-lg border border-white/5">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-zinc-300">Found 3 undocumented API dependencies in `architecture_v2.pdf` that may pose a vendor lock-in risk.</p>
                    <p className="text-xs text-muted-foreground mt-1">Cross-referenced with Technical category requirements.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist & Evidence */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <CheckSquare className="h-4 w-4" /> Requirements Checklist
              </h3>
              
              <div className="space-y-3">
                {[
                  { task: "Review system architecture diagrams", status: "done", evidence: "arch_v2.pdf" },
                  { task: "Analyze tech debt and legacy dependencies", status: "in_progress", evidence: "2 files attached" },
                  { task: "Evaluate scalability of database schema", status: "todo", evidence: null },
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between p-3 bg-zinc-900/50 border border-border rounded-lg group hover:border-zinc-700 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center ${item.status === 'done' ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600 bg-transparent'}`}>
                        {item.status === 'done' && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <p className={`text-sm ${item.status === 'done' ? 'text-muted-foreground line-through' : 'text-foreground font-medium'}`}>{item.task}</p>
                        {item.evidence && (
                          <div className="flex items-center gap-1 text-xs text-blue-400 mt-2 bg-blue-500/10 w-fit px-2 py-0.5 rounded border border-blue-500/20 cursor-pointer">
                            <Paperclip className="h-3 w-3" /> {item.evidence}
                          </div>
                        )}
                      </div>
                    </div>
                    <button className="text-xs text-muted-foreground hover:text-foreground">Edit</button>
                  </div>
                ))}
                
                <button className="text-sm text-muted-foreground flex items-center gap-2 hover:text-foreground mt-4">
                  + Add Requirement
                </button>
              </div>
            </div>

            {/* Analyst Notes / Reports Section */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <FileCheck className="h-4 w-4" /> Analyst Assessment
              </h3>
              <textarea 
                className="w-full min-h-[150px] bg-zinc-900/50 border border-border rounded-lg p-4 text-sm focus:outline-none focus:border-blue-500 resize-y"
                placeholder="Write detailed assessment findings here. Mention any red flags or mitigations..."
              />
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}
