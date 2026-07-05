"use client";

import { Brain, Send, FileText, CheckCircle2, Loader2, Plus, BookOpen, Link2, Link, Hash, Building2 } from "lucide-react";
import { useState } from "react";

export default function PerplexityAIModule() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(true); // Default true to show the designed state

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="flex h-full w-full bg-background overflow-hidden">
      
      {/* Sidebar: Thread History & Memory */}
      <div className="w-64 border-r border-border bg-card flex flex-col hidden md:flex">
        <div className="p-4 flex items-center justify-between border-b border-border">
          <button className="flex items-center gap-2 text-sm font-medium hover:text-blue-400 transition-colors w-full">
            <Plus className="h-4 w-4" /> New Thread
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Today</h3>
            <div className="space-y-1">
              <button className="w-full text-left px-2 py-1.5 text-sm bg-zinc-900/80 text-foreground rounded-md truncate">Acme Corp Q3 Burn Rate</button>
              <button className="w-full text-left px-2 py-1.5 text-sm text-muted-foreground hover:bg-zinc-900/50 hover:text-foreground rounded-md truncate">Compare FinSync vs LendAI</button>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Previous 7 Days</h3>
            <div className="space-y-1">
              <button className="w-full text-left px-2 py-1.5 text-sm text-muted-foreground hover:bg-zinc-900/50 hover:text-foreground rounded-md truncate">Stripe Capital Market Size</button>
              <button className="w-full text-left px-2 py-1.5 text-sm text-muted-foreground hover:bg-zinc-900/50 hover:text-foreground rounded-md truncate">Tech Debt analysis script</button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full">
            <Brain className="h-4 w-4" /> Global AI Memory
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative bg-zinc-950/20">
        
        {/* Chat / Results Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8 pb-32">
            
            {showResults && (
              <div className="space-y-8 animate-in fade-in duration-500">
                
                {/* User Query */}
                <div className="text-2xl font-geist font-semibold">
                  What is Acme Corp&apos;s projected runway given their current Q3 burn rate, and how does this compare to FinSync?
                </div>

                {/* Processing Steps (Reasoning) */}
                <div className="flex items-start gap-3 bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 w-fit">
                  <div className="mt-0.5"><Loader2 className="h-4 w-4 animate-spin text-purple-500" /></div>
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-zinc-400">Synthesizing across 3 data rooms...</p>
                    <p className="text-xs font-mono text-emerald-500 flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Found Acme Q3 Financials (Burn: $450k/mo)</p>
                    <p className="text-xs font-mono text-emerald-500 flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Found FinSync Cap Table (Burn: $1.2M/mo)</p>
                  </div>
                </div>

                {/* Sources Strip */}
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-2 mb-3"><BookOpen className="h-4 w-4" /> Sources Cited</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    <div className="flex items-center gap-2 p-2 bg-card border border-border rounded-lg min-w-[200px] hover:border-blue-500 cursor-pointer transition-colors group">
                      <div className="h-8 w-8 bg-blue-500/10 text-blue-400 rounded flex items-center justify-center shrink-0"><FileText className="h-4 w-4"/></div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-medium truncate group-hover:text-blue-400">Acme_Q3_Financials.pdf</p>
                        <p className="text-[10px] text-muted-foreground">Pages 12-14</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-card border border-border rounded-lg min-w-[200px] hover:border-blue-500 cursor-pointer transition-colors group">
                      <div className="h-8 w-8 bg-amber-500/10 text-amber-400 rounded flex items-center justify-center shrink-0"><Link2 className="h-4 w-4"/></div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-medium truncate group-hover:text-amber-400">PitchBook Data</p>
                        <p className="text-[10px] text-muted-foreground">FinSync Profile</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main AI Answer */}
                <div>
                   <div className="flex items-center gap-3 mb-4">
                     <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
                       <Brain className="h-4 w-4 text-white" />
                     </div>
                     <div>
                       <h3 className="font-semibold text-foreground">Answer</h3>
                       <p className="text-xs text-emerald-400 font-medium">Confidence: 94%</p>
                     </div>
                   </div>
                   
                   <div className="prose prose-invert prose-sm max-w-none text-zinc-300 leading-relaxed">
                     <p>
                       Based on the Q3 2025 financial statements, <strong>Acme Corp</strong> has a monthly cash burn of <strong>$450,000</strong>. With their current cash reserves of $5.4M, their projected runway is approximately <strong>11 months</strong> <sup className="text-purple-400 cursor-pointer hover:underline">[1]</sup>.
                     </p>
                     <p>
                       In comparison, <strong>FinSync</strong> is operating at a much higher burn rate of <strong>$1.2M/mo</strong> <sup className="text-purple-400 cursor-pointer hover:underline">[2]</sup>. While FinSync has more absolute cash ($24M), their runway is significantly longer (20 months), primarily because they recently raised a $50M Series C round <sup className="text-purple-400 cursor-pointer hover:underline">[2]</sup>.
                     </p>
                     <p>
                       <strong>VentureLens Recommendation:</strong> Acme Corp is far more capital efficient, but will need to bridge or raise a Series B within the next 4-6 months to avoid a distressed valuation event as they approach the critical 6-month runway threshold.
                     </p>
                   </div>
                </div>

                {/* Related Context */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-border">
                   <div>
                     <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Related Companies</h4>
                     <div className="flex flex-col gap-2">
                       <button className="flex items-center gap-2 p-2 bg-card border border-border rounded-lg hover:border-zinc-700 transition-colors text-left">
                         <Building2 className="h-4 w-4 text-zinc-500" />
                         <div>
                           <p className="text-xs font-medium">LendAI</p>
                           <p className="text-[10px] text-muted-foreground">Series A • Competitor</p>
                         </div>
                       </button>
                     </div>
                   </div>
                   <div>
                     <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Follow-up Questions</h4>
                     <div className="flex flex-col gap-2">
                       <button className="text-xs text-left p-2 bg-zinc-900/50 hover:bg-zinc-800 rounded-lg text-blue-400 transition-colors">
                         What is Acme&apos;s CAC payback period compared to FinSync?
                       </button>
                       <button className="text-xs text-left p-2 bg-zinc-900/50 hover:bg-zinc-800 rounded-lg text-blue-400 transition-colors">
                         Show me the customer concentration risk for Acme.
                       </button>
                     </div>
                   </div>
                </div>

              </div>
            )}

            {searching && (
              <div className="flex flex-col items-center justify-center h-64 text-purple-400">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p className="animate-pulse">Searching across data rooms and global market intel...</p>
              </div>
            )}

          </div>
        </div>

        {/* Input Bar (Sticky Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pb-6 md:pb-8">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden focus-within:border-purple-500 transition-colors">
              <textarea 
                rows={2}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask VentureLens anything about your pipeline, portfolio, or the market..." 
                className="w-full bg-transparent p-4 pr-16 focus:outline-none resize-none text-sm placeholder:text-muted-foreground/50"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button type="button" className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Focus search">
                  <Hash className="h-4 w-4" />
                </button>
                <button type="button" className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Attach file">
                  <Link className="h-4 w-4" />
                </button>
                <button 
                  type="submit" 
                  disabled={searching}
                  className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-colors disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] text-muted-foreground">AI can make mistakes. Always verify claims against the original data room documents.</span>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
