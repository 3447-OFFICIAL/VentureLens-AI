"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, Calendar, Clock, FileText, 
  MessageSquare, Brain, ThumbsUp, ThumbsDown, FileCheck, Share2, Send, CheckCircle2, AlertCircle, Loader2
} from "lucide-react";
import { api } from "@/lib/api";

interface VoteRecord {
  id: string;
  partner_name: string;
  partner_role: string;
  vote: string;
  conviction_score: number;
  covenants?: string;
  notes?: string;
}

interface ICSummary {
  company_id: string;
  company_name: string;
  total_votes: number;
  yes_votes: number;
  no_votes: number;
  conditional_votes: number;
  abstain_votes: number;
  average_conviction: number;
  quorum_met: boolean;
  final_status: string;
  votes: VoteRecord[];
}

export default function InvestmentCommitteeModule() {
  const [summary, setSummary] = useState<ICSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState("");
  const [covenants, setCovenants] = useState("");

  const loadICSummary = async () => {
    try {
      setLoading(true);
      const data = await api.get<ICSummary>("/ic/summary");
      setSummary(data);
    } catch (err) {
      console.error("Failed to load IC summary", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadICSummary();
  }, []);

  const handleVote = async (type: string) => {
    setUserVote(type);
    setSubmitting(true);
    try {
      await api.post("/ic/vote", {
        company_id: summary?.company_id || "target-id",
        partner_name: "Arjun Mehta",
        partner_role: "Managing Partner",
        vote: type.toUpperCase(),
        conviction_score: 9,
        covenants: covenants || "Standard 1x non-participating liquidation preference",
        notes: notes || "Strong partner conviction based on Q3 cohort acceleration."
      });
      await loadICSummary();
    } catch (err: any) {
      alert(err.message || "Failed to submit vote");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full space-y-6 text-zinc-300 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-950/40 border border-border/40 p-6 rounded-xl">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-geist font-bold flex items-center gap-2 text-white">
              <Users className="h-6 w-6 text-blue-500"/> Investment Committee
            </h1>
            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-md border border-emerald-500/20">
              {summary?.final_status || "In Session"}
            </span>
          </div>
          <p className="text-xs text-zinc-500 flex items-center gap-2">
            <Calendar className="h-4 w-4"/> Weekly Partner Meeting • Deal: {summary?.company_name || "Acme Corp"} • Quorum: {summary?.quorum_met ? "Met (3/3)" : "Pending"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-semibold hover:opacity-90">
            <FileCheck className="h-4 w-4" /> Finalize Committee Minutes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Col: Agenda, Voting, Decision History */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          
          {/* Agenda & Voting Card */}
          <div className="bg-zinc-950/40 border border-border/40 p-6 rounded-xl flex flex-col md:flex-row gap-6">
             <div className="flex-1">
               <h3 className="font-semibold mb-2 flex items-center gap-2 text-white text-sm">
                 <span className="bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded text-xs font-bold">1</span> 
                 {summary?.company_name || "Acme Corp"} ($5.0M Series A)
               </h3>
               <p className="text-xs text-zinc-400 mb-4">Proposed Terms: $25M Post-Money Valuation • 20.0% Target Ownership</p>
               
               <div className="flex items-center gap-2 text-[10px] font-bold">
                 <span className="bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded text-zinc-300">Avg Conviction: {summary?.average_conviction || 8.5}/10</span>
                 <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded">Yes: {summary?.yes_votes || 2}</span>
                 <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-1 rounded">Conditional: {summary?.conditional_votes || 1}</span>
               </div>
             </div>
             
             {/* Live Voting Block */}
             <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-zinc-900 pt-4 md:pt-0 md:pl-6 flex flex-col gap-3">
               <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Your Vote as Partner</h4>
               <div className="flex gap-2">
                 <button 
                   disabled={submitting}
                   onClick={() => handleVote("YES")}
                   className={`flex-1 flex flex-col items-center gap-1 border p-2 rounded-lg transition-colors ${
                     userVote === 'YES' 
                       ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' 
                       : 'bg-emerald-900/10 hover:bg-emerald-900/20 border-emerald-500/20 text-emerald-500'
                   }`}
                 >
                   <ThumbsUp className="h-4 w-4" />
                   <span className="text-[10px] font-bold">Approve</span>
                 </button>
                 <button 
                   disabled={submitting}
                   onClick={() => handleVote("NO")}
                   className={`flex-1 flex flex-col items-center gap-1 border p-2 rounded-lg transition-colors ${
                     userVote === 'NO' 
                       ? 'bg-rose-500/20 text-rose-400 border-rose-500' 
                       : 'bg-rose-900/10 hover:bg-rose-900/20 border-rose-500/20 text-rose-500'
                   }`}
                 >
                   <ThumbsDown className="h-4 w-4" />
                   <span className="text-[10px] font-bold">Pass</span>
                 </button>
                 <button 
                   disabled={submitting}
                   onClick={() => handleVote("CONDITIONAL")}
                   className={`flex-1 flex flex-col items-center gap-1 border p-2 rounded-lg transition-colors ${
                     userVote === 'CONDITIONAL' 
                       ? 'bg-amber-500/20 text-amber-300 border-amber-500' 
                       : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-400'
                   }`}
                 >
                   <span className="text-[10px] font-bold mt-1">Condition</span>
                 </button>
               </div>
             </div>
          </div>

          {/* Partner Deliberation Table */}
          <div className="bg-zinc-950/40 border border-border/40 p-6 rounded-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Partner Ballots & Recorded Covenants</h3>
            <div className="space-y-3">
              {(summary?.votes || []).map((v, i) => (
                <div key={i} className="p-3.5 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold text-blue-400">
                        {v.partner_name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white">{v.partner_name}</span>
                        <span className="text-[10px] text-zinc-500 ml-2">({v.partner_role})</span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                      v.vote === "YES" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                      v.vote === "CONDITIONAL" ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
                      "text-rose-400 bg-rose-500/10 border-rose-500/20"
                    }`}>
                      {v.vote} • Score: {v.conviction_score}/10
                    </span>
                  </div>
                  {v.covenants && (
                    <p className="text-[11px] text-zinc-300 font-mono bg-zinc-950/60 p-2 rounded border border-zinc-900">
                      <strong>Covenant:</strong> {v.covenants}
                    </p>
                  )}
                  {v.notes && <p className="text-xs text-zinc-400 italic">&ldquo;{v.notes}&rdquo;</p>}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: AI Summary & Synthesis */}
        <div className="lg:col-span-4 bg-zinc-950/40 border border-border/40 p-6 rounded-xl flex flex-col space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">AI Committee Synthesis</h3>
          </div>
          <div className="text-xs text-zinc-300 space-y-3 leading-relaxed">
            <p>
              The committee consensus is strongly positive on <strong>{summary?.company_name || "Acme Corp"}</strong> driven by top-decile CAC payback periods and exceptional founder velocity.
            </p>
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-300 space-y-1">
              <span className="font-bold text-[10px] uppercase tracking-wider block">Key Closing Condition:</span>
              <span>Finalize secondary founder transfer limitation clauses and secure board observer rights prior to wire execution.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
