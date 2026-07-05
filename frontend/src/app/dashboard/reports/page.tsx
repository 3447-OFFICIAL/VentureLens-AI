"use client";

import { 
  FileText, Download, FileJson, FileType, 
  Presentation, LayoutGrid, FileSpreadsheet,
  Brain, CheckCircle2, Loader2, PlayCircle,
  FileBarChart, ShieldAlert, Users, FolderOpen
} from "lucide-react";
import { useState } from "react";

export default function ReportsModule() {
  const [generating, setGenerating] = useState(false);
  const [activeType, setActiveType] = useState("memo");
  const [activeFormat, setActiveFormat] = useState("pdf");

  const reportTypes = [
    { id: "memo", label: "Investment Memo", icon: FileText, desc: "Comprehensive IC deal memo." },
    { id: "board", label: "Board Report", icon: Users, desc: "Quarterly updates for board of directors." },
    { id: "lp", label: "LP Report", icon: FolderOpen, desc: "Fund performance and portfolio breakdown." },
    { id: "risk", label: "Risk Report", icon: ShieldAlert, desc: "Tech, compliance, and financial risks." },
    { id: "financial", label: "Financial Report", icon: FileBarChart, desc: "Cash flow, ARR, and valuations." }
  ];

  const formats = [
    { id: "pdf", label: "PDF Document", icon: FileType },
    { id: "docx", label: "Word (DOCX)", icon: FileText },
    { id: "xlsx", label: "Excel (XLSX)", icon: FileSpreadsheet },
    { id: "ppt", label: "Presentation", icon: Presentation }
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  return (
    <div className="flex flex-col h-full w-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-geist font-bold flex items-center gap-2">
              <FileJson className="h-6 w-6"/> Reports & Generation
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">Automated AI reporting and document generation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Col: Generator Config */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          
          <div className="bg-card border border-border p-6 rounded-xl flex-1 flex flex-col">
            <h3 className="font-semibold mb-6 flex items-center gap-2"><LayoutGrid className="h-4 w-4" /> Configure Report</h3>
            
            <div className="space-y-6 flex-1">
              
              {/* Report Type Selection */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">1. Select Report Type</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {reportTypes.map(type => (
                    <div 
                      key={type.id}
                      onClick={() => setActiveType(type.id)}
                      className={`flex flex-col gap-1 p-3 rounded-lg border cursor-pointer transition-colors ${
                        activeType === type.id 
                          ? 'bg-blue-500/10 border-blue-500/50' 
                          : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <type.icon className={`h-4 w-4 ${activeType === type.id ? 'text-blue-400' : 'text-muted-foreground'}`} />
                          <span className={`text-sm font-medium ${activeType === type.id ? 'text-blue-100' : 'text-zinc-300'}`}>{type.label}</span>
                        </div>
                        {activeType === type.id && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">{type.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Source Configuration */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">2. Target Data</h4>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Company / Fund</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded-md text-sm px-3 py-2 focus:outline-none focus:border-blue-500 text-zinc-300">
                      <option>Acme Corp</option>
                      <option>FinSync</option>
                      <option>Fund I (Global)</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Time Period</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded-md text-sm px-3 py-2 focus:outline-none focus:border-blue-500 text-zinc-300">
                      <option>Q3 2025</option>
                      <option>YTD 2025</option>
                      <option>Trailing 12 Months</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Export Format */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">3. Export Format</h4>
                <div className="flex flex-wrap gap-3">
                  {formats.map(fmt => (
                    <button
                      key={fmt.id}
                      onClick={() => setActiveFormat(fmt.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        activeFormat === fmt.id
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                          : 'bg-zinc-900/50 border-zinc-800 text-muted-foreground hover:bg-zinc-800 hover:text-zinc-300'
                      }`}
                    >
                      <fmt.icon className="h-4 w-4" />
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-border mt-6 flex justify-end">
               <button 
                 onClick={handleGenerate}
                 disabled={generating}
                 className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
               >
                 {generating ? (
                   <><Loader2 className="h-4 w-4 animate-spin" /> Generating AI Report...</>
                 ) : (
                   <><PlayCircle className="h-4 w-4" /> Generate Report</>
                 )}
               </button>
            </div>
          </div>

        </div>

        {/* Right Col: Recent Reports & AI Log */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          
          {/* AI Generation Log */}
          <div className="bg-gradient-to-b from-purple-900/20 to-transparent border border-purple-500/20 rounded-xl p-5 relative overflow-hidden h-[200px]">
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <Brain className="h-5 w-5 text-purple-400" />
              <h3 className="font-semibold text-purple-50">AI Compiler Status</h3>
            </div>
            
            <div className="space-y-3 relative z-10 text-sm font-mono mt-4">
              {generating ? (
                <>
                  <p className="text-xs text-purple-400 animate-pulse">Initializing LLM compiler...</p>
                  <p className="text-xs text-zinc-400">Fetching Acme Corp financials...</p>
                  <p className="text-xs text-zinc-400">Synthesizing IC notes...</p>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full text-zinc-500 py-6">
                  <p className="text-xs">System idle.</p>
                  <p className="text-[10px]">Select configuration to begin generation.</p>
                </div>
              )}
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Brain className="h-32 w-32" /></div>
          </div>

          {/* Recent Reports */}
          <div className="bg-card border border-border p-5 rounded-xl flex-1 flex flex-col">
             <h3 className="font-semibold mb-4 flex items-center gap-2">Recent Exports</h3>
             
             <div className="space-y-3 overflow-y-auto pr-2">
               {[
                 { title: "Acme Corp Memo", type: "Investment Memo", format: "PDF", date: "Oct 24", icon: FileType, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
                 { title: "Q3 Board Deck", type: "Board Report", format: "PPT", date: "Oct 20", icon: Presentation, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
                 { title: "Fund I LP Update", type: "LP Report", format: "PDF", date: "Oct 01", icon: FileType, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
                 { title: "FinSync Model", type: "Financial Report", format: "XLSX", date: "Sep 15", icon: FileSpreadsheet, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
               ].map((doc, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg group hover:border-zinc-700 transition-colors cursor-pointer">
                   <div className="flex items-center gap-3">
                     <div className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 border ${doc.bg}`}>
                       <doc.icon className={`h-4 w-4 ${doc.color}`} />
                     </div>
                     <div>
                       <p className="text-sm font-medium text-zinc-200 group-hover:text-blue-400 transition-colors">{doc.title}</p>
                       <div className="flex items-center gap-2 mt-0.5">
                         <span className="text-[10px] text-muted-foreground">{doc.type}</span>
                         <span className="text-[10px] text-zinc-500">•</span>
                         <span className="text-[10px] text-muted-foreground">{doc.date}</span>
                       </div>
                     </div>
                   </div>
                   <button className="text-zinc-500 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                     <Download className="h-4 w-4" />
                   </button>
                 </div>
               ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
