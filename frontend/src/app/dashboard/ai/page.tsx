"use client";

import { 
  Brain, Send, FileText, CheckCircle2, Loader2, Plus, 
  BookOpen, Link2, Link, Hash, Building2, Sparkles, AlertCircle 
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";

interface StepLog {
  id: string;
  message: string;
  done: boolean;
}

interface Citation {
  filename: string;
  score?: number;
  snippet?: string;
}

export default function PerplexityAIModule() {
  const [query, setQuery] = useState("");
  const [currentQuery, setCurrentQuery] = useState("What is the projected runway and burn efficiency for our pipeline companies?");
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [steps, setSteps] = useState<StepLog[]>([
    { id: "1", message: "Synthesizing across connected data rooms...", done: true },
    { id: "2", message: "Evaluated unit economics and burn efficiency.", done: true }
  ]);
  const [citations, setCitations] = useState<Citation[]>([
    { filename: "Acme_Q3_Financials.pdf" },
    { filename: "FinSync_Cap_Table.pdf" }
  ]);
  const [answer, setAnswer] = useState<string>(
    "Based on current data room submissions, portfolio burn efficiency averages **$420,000/month** with an average runway of **12.4 months**. Companies with a Rule of 40 score exceeding 40% are showing 3.8x LTV:CAC ratios."
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searching) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [searching, answer]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || searching) return;

    const userQuery = query.trim();
    setQuery("");
    setCurrentQuery(userQuery);
    setSearching(true);
    setShowResults(true);
    setAnswer("");
    setSteps([{ id: "init", message: "Connecting to multi-agent specialist network...", done: false }]);

    try {
      const response = await fetchWithAuth("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ query: userQuery })
      });

      if (!response.ok) {
        throw new Error(`AI Gateway responded with ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let done = false;
        let streamedText = "";

        while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (let i = 0; i < lines.length; i++) {
              const line = lines[i].trim();
              if (line.startsWith("event: step")) {
                const nextLine = lines[i + 1]?.trim();
                if (nextLine?.startsWith("data: ")) {
                  try {
                    const stepData = JSON.parse(nextLine.replace("data: ", ""));
                    setSteps(prev => [
                      ...prev.map(s => ({ ...s, done: true })),
                      { id: stepData.step || Math.random().toString(), message: stepData.message, done: false }
                    ]);
                  } catch {}
                }
              } else if (line.startsWith("data: ") && line !== "data: [DONE]") {
                const token = line.replace("data: ", "");
                streamedText += token;
                setAnswer(streamedText);
              }
            }
          }
        }
      }
      setSteps(prev => prev.map(s => ({ ...s, done: true })));
    } catch (err: any) {
      setAnswer(`Encountered an issue executing multi-agent reasoning: ${err.message || "Network Error"}`);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-background overflow-hidden font-sans">
      
      {/* Sidebar: Thread History & Memory */}
      <div className="w-64 border-r border-border bg-card flex flex-col hidden md:flex">
        <div className="p-4 flex items-center justify-between border-b border-border">
          <button 
            onClick={() => {
              setAnswer("");
              setShowResults(false);
              setQuery("");
            }}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800"
          >
            <Plus className="h-4 w-4 text-blue-500" /> New Copilot Thread
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          <div>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 px-2">Active Inquiries</h3>
            <div className="space-y-1">
              <button className="w-full text-left px-2 py-1.5 text-xs bg-zinc-900/80 text-foreground rounded-md truncate font-medium">Acme Corp Q3 Burn Rate</button>
              <button className="w-full text-left px-2 py-1.5 text-xs text-muted-foreground hover:bg-zinc-900/50 hover:text-foreground rounded-md truncate">Compare FinSync vs LendAI</button>
            </div>
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 px-2">Recent Due Diligence</h3>
            <div className="space-y-1">
              <button className="w-full text-left px-2 py-1.5 text-xs text-muted-foreground hover:bg-zinc-900/50 hover:text-foreground rounded-md truncate">Series A Term Sheet Benchmarks</button>
              <button className="w-full text-left px-2 py-1.5 text-xs text-muted-foreground hover:bg-zinc-900/50 hover:text-foreground rounded-md truncate">Technical Architecture Debt Scan</button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Brain className="h-4 w-4 text-purple-400" />
            <span>Multi-Agent RAG Online</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative bg-zinc-950/20">
        
        {/* Chat / Results Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6 pb-36">
            
            {showResults && (
              <div className="space-y-6 animate-in fade-in duration-500">
                
                {/* User Query */}
                <div className="text-xl md:text-2xl font-geist font-bold text-white tracking-tight">
                  {currentQuery}
                </div>

                {/* Processing Steps (Reasoning) */}
                {steps.length > 0 && (
                  <div className="flex flex-col gap-1.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3.5 max-w-xl shadow-lg">
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-1">
                      {searching ? <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-400" /> : <Sparkles className="h-3.5 w-3.5 text-purple-400" />}
                      <span>Autonomous Agent Reasoning</span>
                    </div>
                    {steps.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                        {s.done ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-400 shrink-0" />
                        )}
                        <span className={s.done ? "text-zinc-300" : "text-purple-300"}>{s.message}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sources Strip */}
                {citations.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                      <BookOpen className="h-3.5 w-3.5 text-blue-400" /> Grounded Evidence & Sources
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {citations.map((c, i) => (
                        <div key={i} className="flex items-center gap-2 p-2.5 bg-card border border-border rounded-xl min-w-[210px] hover:border-blue-500/50 cursor-pointer transition-colors group">
                          <div className="h-8 w-8 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center shrink-0">
                            <FileText className="h-4 w-4"/>
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-medium text-zinc-200 truncate group-hover:text-blue-400">{c.filename}</p>
                            <p className="text-[10px] text-zinc-500">Grounded Vector Node</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Main AI Answer */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-xl space-y-4">
                   <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                     <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                         <Brain className="h-4.5 w-4.5 text-purple-400" />
                       </div>
                       <div>
                         <h3 className="text-sm font-bold text-white">Synthesized Agent Findings</h3>
                         <p className="text-[10px] text-emerald-400 font-medium">10 Specialists Synchronized</p>
                       </div>
                     </div>
                   </div>
                   
                   <div className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                     {answer || (searching ? "Streaming multi-agent analysis..." : "")}
                   </div>
                </div>

                <div ref={scrollRef} />

              </div>
            )}

          </div>
        </div>

        {/* Input Bar (Sticky Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent pb-6">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden focus-within:border-purple-500 transition-colors">
              <textarea 
                rows={2}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSearch(e);
                  }
                }}
                placeholder="Ask VentureLens Copilot anything about pipeline metrics, founders, tech debt, or memos..." 
                className="w-full bg-transparent p-4 pr-16 focus:outline-none resize-none text-xs text-white placeholder:text-zinc-500"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button 
                  type="submit" 
                  disabled={searching || !query.trim()}
                  className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-colors disabled:opacity-50"
                  title="Send Inquiry"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
