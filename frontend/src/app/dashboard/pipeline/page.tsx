"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, Plus, Filter, MoreHorizontal, MessageSquare, CheckCircle2, 
  AlertCircle, Zap, Activity, Loader2, X, PlusCircle
} from "lucide-react";

interface Deal {
  id: string;
  company_id: string;
  company_name: string;
  stage: string;
  amount: number;
  probability: number;
}

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // New Deal Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newAmount, setNewAmount] = useState(1000000);
  const [newStage, setNewStage] = useState("Lead");
  const [creating, setCreating] = useState(false);

  const stages = [
    { id: "Lead", name: "Sourcing", color: "bg-zinc-800" },
    { id: "Screen", name: "Screening", color: "bg-blue-900/40" },
    { id: "DD", name: "Due Diligence", color: "bg-purple-900/40" },
    { id: "IC", name: "Committee (IC)", color: "bg-amber-900/40" },
    { id: "Term Sheet", name: "Term Sheet", color: "bg-emerald-900/40" },
    { id: "Closed", name: "Closed", color: "bg-blue-500/20" }
  ];

  const loadDeals = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Please login first.");
        return;
      }
      setLoading(true);
      setError("");
      
      const res = await fetch("http://127.0.0.1:8000/api/v1/deals/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!res.ok) {
        throw new Error("Failed to load deals from server.");
      }
      
      const data = await res.json();
      setDeals(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;

    setCreating(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://127.0.0.1:8000/api/v1/deals/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          company_name: newCompanyName,
          amount: newAmount,
          stage: newStage
        })
      });

      if (!res.ok) throw new Error("Failed to create deal.");

      setNewCompanyName("");
      setNewAmount(1000000);
      setModalOpen(false);
      
      // Reload deals
      await loadDeals();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleMoveStage = async (dealId: string, targetStage: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://127.0.0.1:8000/api/v1/deals/${dealId}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ stage: targetStage })
      });

      if (!res.ok) throw new Error("Failed to update deal stage.");
      
      // Update local state
      setDeals(prevDeals => prevDeals.map(d => d.id === dealId ? { ...d, stage: targetStage } : d));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col h-full w-full space-y-4 text-zinc-300 font-sans relative">
      
      {/* Header & Metrics */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-geist tracking-tight text-white flex items-center gap-2">
            Deal Pipeline
          </h1>
          <div className="flex items-center gap-4 text-xs text-zinc-500 mt-1">
            <span className="flex items-center gap-1"><Activity className="h-4.5 w-4.5" /> {deals.length} Active Deals</span>
            <span className="flex items-center gap-1"><Zap className="h-4.5 w-4.5 text-blue-400" /> 2 AI Automations Running</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity text-xs"
          >
            <Plus className="h-4 w-4" /> New Deal
          </button>
        </div>
      </div>

      {/* Toolbar: Filters */}
      <div className="flex items-center justify-between bg-zinc-950/40 border border-border/40 p-2.5 rounded-xl">
        <div className="flex flex-1 items-center gap-2">
          <Search className="h-4 w-4 text-zinc-500 ml-2" />
          <input 
            type="text" 
            placeholder="Search deals, founders, or tags..." 
            className="bg-transparent border-none focus:outline-none text-xs w-full max-w-sm text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs border border-zinc-800 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-300">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg font-semibold">
          {error}
        </div>
      )}

      {/* Kanban Board Area */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
        </div>
      ) : (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 pt-2 custom-scrollbar">
          {stages.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage.id);
            return (
              <div key={stage.id} className="min-w-[280px] max-w-[280px] flex flex-col bg-zinc-950/20 rounded-xl border border-border/40">
                
                {/* Stage Header */}
                <div className={`p-3 flex items-center justify-between border-b border-border/30 rounded-t-xl ${stage.color}`}>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-xs text-white">{stage.name}</h3>
                    <span className="bg-zinc-950/80 border border-zinc-800 text-[10px] px-2 py-0.5 rounded-full font-mono text-zinc-400 font-bold">{stageDeals.length}</span>
                  </div>
                  <button className="text-zinc-500 hover:text-zinc-300"><MoreHorizontal className="h-4 w-4"/></button>
                </div>

                {/* Stage Content */}
                <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[450px]">
                  {stageDeals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-10 opacity-30">
                      <span className="text-xl">📭</span>
                      <p className="text-[10px] mt-1 font-semibold">No deals</p>
                    </div>
                  ) : (
                    stageDeals.map(deal => (
                      <div 
                        key={deal.id} 
                        className="p-4 bg-zinc-950/40 border border-border/40 rounded-lg shadow-sm hover:border-zinc-800 transition-colors group relative"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-md bg-zinc-900 border border-zinc-850 flex items-center justify-center text-[10px] font-bold text-white">
                              {deal.company_name.charAt(0)}
                            </div>
                            <h4 className="text-xs font-bold text-white">{deal.company_name}</h4>
                          </div>
                        </div>
                        
                        <div className="text-[10px] text-zinc-500 font-semibold mt-1">Amount: ${(deal.amount / 1000000).toFixed(1)}M</div>
                        
                        {/* Quick stage selector */}
                        <div className="mt-3 pt-3 border-t border-zinc-900/60 flex items-center justify-between gap-2">
                          <select 
                            value={deal.stage}
                            onChange={(e) => handleMoveStage(deal.id, e.target.value)}
                            className="bg-zinc-900 border border-zinc-800 text-[10px] px-2 py-1 rounded text-zinc-400 focus:outline-none w-full"
                          >
                            {stages.map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Deal Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          
          <div className="relative bg-zinc-950 border border-zinc-800 p-6 rounded-xl shadow-2xl w-full max-w-md z-10 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2"><PlusCircle className="h-4 w-4 text-blue-500" /> Create New Deal</h3>
              <button onClick={() => setModalOpen(false)} className="text-zinc-500 hover:text-zinc-300"><X className="h-4.5 w-4.5" /></button>
            </div>
            
            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-500 font-bold">Company Name</label>
                <input 
                  type="text" 
                  required
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. SynthAI"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-500 font-bold">Deal Amount ($)</label>
                  <input 
                    type="number" 
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-500 font-bold">Stage</label>
                  <select 
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 text-zinc-400 focus:outline-none focus:border-blue-500"
                  >
                    {stages.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-900 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-blue-600 hover:opacity-90 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  {creating ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : null}
                  <span>Create Deal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
