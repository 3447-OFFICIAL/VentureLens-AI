"use client";

import React, { useEffect, useState } from "react";
import { 
  Building2, Search, Filter, Plus, CheckCircle2, ChevronRight, 
  ArrowRight, Sparkles, SlidersHorizontal, Loader2
} from "lucide-react";
import Link from "next/link";

export default function CompaniesModule() {
  const [companies, setCompanies] = useState([
    { id: "synthai", name: "SynthAI", stage: "Series A", status: "Active", health: 84, arr: "$12.4M", runway: "14 mo", owner: "Arjun Mehta", updated: "2h ago" },
    { id: "quantumdb", name: "QuantumDB", stage: "Series Seed", status: "Active", health: 88, arr: "$3.2M", runway: "18 mo", owner: "Riya Shah", updated: "1d ago" },
    { id: "nemora", name: "Nemora Labs", stage: "Seed", status: "DD", health: 72, arr: "$1.1M", runway: "12 mo", owner: "Karen Patel", updated: "2d ago" },
    { id: "vectora", name: "Vectora", stage: "Seed", status: "DD", health: 68, arr: "$2.4M", runway: "10 mo", owner: "Arjun Mehta", updated: "2d ago" },
    { id: "greenlyst", name: "Greenlyst", stage: "Pre-Seed", status: "Screening", health: 64, arr: "$0.7M", runway: "16 mo", owner: "Neha Gupta", updated: "2d ago" },
    { id: "healthsync", name: "HealthSync", stage: "Seed", status: "Active", health: 75, arr: "$2.1M", runway: "16 mo", owner: "Riya Shah", updated: "2d ago" },
    { id: "urbanstash", name: "UrbanStash", stage: "Seed", status: "DD", health: 58, arr: "$1.4M", runway: "8 mo", owner: "Neha Gupta", updated: "2d ago" },
    { id: "payflow", name: "PayFlow", stage: "Seed", status: "Active", health: 56, arr: "$1.8M", runway: "11 mo", owner: "Karen Patel", updated: "2d ago" },
    { id: "finflow", name: "FinFlow", stage: "Seed", status: "Screening", health: 60, arr: "$0.5M", runway: "7 mo", owner: "Riya Shah", updated: "2d ago" }
  ]);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadBackendData() {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;
        setLoading(true);
        const res = await fetch("http://localhost:8000/api/v1/deals/", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            // Map backend deals to company items
            const backendCompanies = data.map((d: any) => ({
              id: d.company_id,
              name: d.company_name,
              stage: d.stage,
              status: d.stage === "Closed" ? "Active" : "DD",
              health: Math.floor(Math.random() * 30) + 60, // random health for demo
              arr: `$${(d.amount / 1000000).toFixed(1)}M`,
              runway: "12 mo",
              owner: "Me",
              updated: "Just now"
            }));
            
            // Deduplicate companies by name
            const allCompanies = [...companies];
            backendCompanies.forEach((bc: any) => {
              if (!allCompanies.some(c => c.name.toLowerCase() === bc.name.toLowerCase())) {
                allCompanies.unshift(bc);
              }
            });
            setCompanies(allCompanies);
          }
        }
      } catch (err) {
        console.error("Failed to load backend deals", err);
      } finally {
        setLoading(false);
      }
    }
    loadBackendData();
  }, []);

  return (
    <div className="flex flex-col h-full w-full space-y-6 text-zinc-300 font-sans">
      
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

          <select className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 text-zinc-400 focus:outline-none focus:border-blue-500">
            <option>All Status</option>
            <option>Active</option>
            <option>DD</option>
            <option>Screening</option>
          </select>

          <button className="flex items-center gap-2 px-3 py-2 border border-zinc-800 bg-zinc-900 text-zinc-300 rounded-lg text-xs font-semibold hover:bg-zinc-800">
            <SlidersHorizontal className="h-3.5 w-3.5" /> More Filters
          </button>
        </div>

        <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
          <Plus className="h-3.5 w-3.5" /> Add Company
        </button>
      </div>

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
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c, i) => (
                  <tr key={i} className="border-b border-zinc-900/40 hover:bg-zinc-900/20 last:border-0">
                    <td className="py-3.5 px-5 font-semibold text-white flex items-center gap-2">
                      <div className="size-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-white">{c.name.charAt(0)}</div>
                      <Link href={`/dashboard/companies/${c.id}`} className="hover:underline hover:text-blue-400">
                        {c.name}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 font-medium">{c.stage}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        c.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        c.status === "DD" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        "bg-zinc-800 text-zinc-400 border-zinc-700"
                      }`}>{c.status}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        c.health >= 80 ? "text-emerald-400 border-emerald-400/20 bg-emerald-500/10" :
                        c.health >= 65 ? "text-blue-400 border-blue-400/20 bg-blue-500/10" :
                        "text-amber-400 border-amber-400/20 bg-amber-500/10"
                      }`}>{c.health}</span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-200 font-mono font-medium">{c.arr}</td>
                    <td className="py-3.5 px-4 text-zinc-400 font-medium">{c.runway}</td>
                    <td className="py-3.5 px-4 text-zinc-300 font-medium">{c.owner}</td>
                    <td className="py-3.5 px-4 text-zinc-500 font-medium">{c.updated}</td>
                    <td className="py-3.5 px-5 text-right">
                      <Link href={`/dashboard/companies/${c.id}`} className="inline-flex items-center gap-1 text-[11px] text-blue-400 font-semibold hover:underline">
                        Diligence <ChevronRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center text-xs text-zinc-500 font-medium bg-zinc-950/20 p-4 border border-zinc-900/60 rounded-xl">
        <span>Showing 1 to {companies.length} of 24 companies</span>
        <div className="flex items-center gap-1">
          <button className="px-2.5 py-1.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-300 font-bold hover:bg-zinc-800">1</button>
          <button className="px-2.5 py-1.5 rounded border border-transparent hover:bg-zinc-900/40 text-zinc-500 hover:text-zinc-300 font-bold">2</button>
          <button className="px-2.5 py-1.5 rounded border border-transparent hover:bg-zinc-900/40 text-zinc-500 hover:text-zinc-300 font-bold">3</button>
          <button className="px-2.5 py-1.5 rounded border border-transparent hover:bg-zinc-900/40 text-zinc-500 hover:text-zinc-300 font-bold">&gt;</button>
        </div>
      </div>

    </div>
  );
}
