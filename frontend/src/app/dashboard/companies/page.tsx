"use client";

import React, { useEffect, useState } from "react";
import { 
  Building2, Search, Plus, CheckCircle2, ChevronRight, 
  Sparkles, SlidersHorizontal, Loader2, X
} from "lucide-react";
import Link from "next/link";

interface Company {
  id: string;
  name: string;
  stage: string;
  sector: string;
  website: string | null;
  description: string | null;
  metadata_blob: {
    runway?: string;
    owner?: string;
    health?: number;
  };
}

export default function CompaniesModule() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Add Company Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newStage, setNewStage] = useState("Seed");
  const [newSector, setNewSector] = useState("B2B SaaS / Fintech");
  const [newOwner, setNewOwner] = useState("Arjun Mehta");
  const [creating, setCreating] = useState(false);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Please login first.");
        return;
      }
      setLoading(true);
      setError("");
      
      const res = await fetch("http://127.0.0.1:8000/api/v1/companies/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to load companies.");
      
      const data = await res.json();
      setCompanies(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setCreating(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://127.0.0.1:8000/api/v1/companies/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newName,
          stage: newStage,
          sector: newSector,
          metadata_blob: {
            owner: newOwner,
            runway: "12 mo",
            health: 75
          }
        })
      });

      if (!res.ok) throw new Error("Failed to create company.");
      
      setNewName("");
      setModalOpen(false);
      await fetchCompanies();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full space-y-6 text-zinc-300 font-sans relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-geist tracking-tight text-white flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-500" /> Companies
          </h1>
          <p className="text-zinc-500 text-xs mt-1">Manage and track all companies in your pipeline and portfolio.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-zinc-950/40 border border-border/40 p-3 rounded-xl">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search companies..." 
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg text-xs pl-9 pr-4 py-2 focus:outline-none focus:border-blue-500 text-white" 
            />
          </div>
          
          <select className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 text-zinc-400 focus:outline-none focus:border-blue-500">
            <option>All Stages</option>
            <option>Series A</option>
            <option>Series Seed</option>
            <option>Seed</option>
            <option>Pre-Seed</option>
          </select>
        </div>

        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="h-3.5 w-3.5" /> Add Company
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg font-semibold">
          {error}
        </div>
      )}

      {/* Companies List Table */}
      <div className="bg-zinc-950/40 border border-border/40 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-zinc-500 border-b border-zinc-900/60 pb-3 font-semibold bg-zinc-950/20">
                  <th className="py-3 px-5">Company</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Health Score</th>
                  <th className="py-3 px-4">ARR</th>
                  <th className="py-3 px-4">Runway</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c, i) => {
                  const health = c.metadata_blob.health || 70;
                  return (
                    <tr key={i} className="border-b border-zinc-900/40 hover:bg-zinc-900/20 last:border-0">
                      <td className="py-3.5 px-5 font-semibold text-white flex items-center gap-2">
                        <div className="size-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-white">{c.name.charAt(0)}</div>
                        <Link href={`/dashboard/companies/${c.id}`} className="hover:underline hover:text-blue-400">
                          {c.name}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400 font-medium">{c.stage}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border bg-blue-500/10 text-blue-400 border-blue-500/20">Active</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          health >= 80 ? "text-emerald-400 border-emerald-400/20 bg-emerald-500/10" :
                          health >= 65 ? "text-blue-400 border-blue-400/20 bg-blue-500/10" :
                          "text-amber-400 border-amber-400/20 bg-amber-500/10"
                        }`}>{health}</span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-200 font-mono font-medium">$1.5M</td>
                      <td className="py-3.5 px-4 text-zinc-400 font-medium">{c.metadata_blob.runway || "12 mo"}</td>
                      <td className="py-3.5 px-4 text-zinc-300 font-medium">{c.metadata_blob.owner || "Unassigned"}</td>
                      <td className="py-3.5 px-5 text-right">
                        <Link href={`/dashboard/companies/${c.id}`} className="inline-flex items-center gap-1 text-[11px] text-blue-400 font-semibold hover:underline">
                          Diligence <ChevronRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Company Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          
          <div className="relative bg-zinc-950 border border-zinc-800 p-6 rounded-xl shadow-2xl w-full max-w-md z-10 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add New Company</h3>
              <button onClick={() => setModalOpen(false)} className="text-zinc-500 hover:text-zinc-300"><X className="h-4.5 w-4.5" /></button>
            </div>
            
            <form onSubmit={handleCreateCompany} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-500 font-bold">Company Name</label>
                <input 
                  type="text" 
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. SynthAI"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-500 font-bold">Stage</label>
                  <select 
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 text-zinc-400 focus:outline-none"
                  >
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B">Series B</option>
                    <option value="Pre-Seed">Pre-Seed</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-500 font-bold">Sector</label>
                  <input 
                    type="text"
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-500 font-bold">Lead Owner</label>
                <input 
                  type="text"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
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
                  <span>Create Company</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
