"use client";

import React, { useEffect, useState } from "react";
import { 
  Briefcase, TrendingUp, TrendingDown, MapPin, 
  Layers, BarChart2, PieChart, Activity, Building2,
  Brain, Crosshair, Filter, Download, Loader2
} from "lucide-react";
import { api } from "@/lib/api";

interface PortfolioOverview {
  total_portfolio_companies: number;
  total_invested_capital: number;
  aggregate_arr: number;
  average_runway_months: number;
  average_gross_margin: number;
  top_performers: { name: string; arr: string; growth: string; health: number }[];
  sector_breakdown: { sector: string; percentage: number; capital: string }[];
}

export default function PortfolioModule() {
  const [data, setData] = useState<PortfolioOverview | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        setLoading(true);
        const res = await api.get<PortfolioOverview>("/portfolio/overview");
        setData(res);
      } catch (err) {
        console.error("Failed to load portfolio overview", err);
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, []);

  return (
    <div className="flex flex-col h-full w-full space-y-6 text-zinc-300 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-950/40 border border-border/40 p-6 rounded-xl">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-geist font-bold flex items-center gap-2 text-white">
              <Briefcase className="h-6 w-6 text-blue-500"/> Fund I Portfolio
            </h1>
          </div>
          <p className="text-xs text-zinc-500">Live fund-level performance, ARR growth, and sector allocation.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-semibold hover:opacity-90">
            <Download className="h-4 w-4" /> Export LP Quarterly Report
          </button>
        </div>
      </div>

      {/* Core Fund KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Aggregate ARR", val: data ? `$${(data.aggregate_arr / 1000000).toFixed(1)}M` : "$34.2M", change: "+142% YoY", trend: "up" },
          { label: "Invested Capital", val: data ? `$${(data.total_invested_capital / 1000000).toFixed(1)}M` : "$18.5M", change: "8 Companies", trend: "neutral" },
          { label: "Avg Runway", val: data ? `${data.average_runway_months} Mo` : "14.6 Mo", change: "+2.4 mo", trend: "up" },
          { label: "Gross Margin", val: data ? `${data.average_gross_margin}%` : "76.8%", change: "+3.2%", trend: "up" },
          { label: "Fund MOIC", val: "2.85x", change: "+0.45x", trend: "up" },
        ].map((kpi, i) => (
          <div key={i} className="bg-zinc-950/40 border border-border/40 p-4 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">{kpi.label}</span>
            <div className="text-xl font-bold font-geist text-white">{kpi.val}</div>
            <div className="text-[10px] font-bold mt-1 text-emerald-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Col: Allocation Breakdown */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          <div className="bg-zinc-950/40 border border-border/40 p-5 rounded-xl space-y-4">
             <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
               <PieChart className="h-4 w-4 text-blue-400" /> Sector Capital Allocation
             </h3>
             <div className="space-y-3">
               {(data?.sector_breakdown || [
                 { sector: "Enterprise AI / B2B SaaS", percentage: 48.0, capital: "$8.88M" },
                 { sector: "Fintech & Infrastructure", percentage: 26.0, capital: "$4.81M" },
                 { sector: "Cybersecurity & Identity", percentage: 16.0, capital: "$2.96M" },
                 { sector: "Developer Tooling & Cloud", percentage: 10.0, capital: "$1.85M" }
               ]).map((sec, idx) => (
                 <div key={idx} className="space-y-1">
                   <div className="flex justify-between text-xs font-medium">
                     <span className="text-zinc-300">{sec.sector}</span>
                     <span className="font-mono text-zinc-400">{sec.percentage}% ({sec.capital})</span>
                   </div>
                   <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                     <div 
                       className={`h-full rounded-full ${
                         idx === 0 ? "bg-purple-500" :
                         idx === 1 ? "bg-blue-500" :
                         idx === 2 ? "bg-emerald-500" : "bg-amber-500"
                       }`} 
                       style={{ width: `${sec.percentage}%` }}
                     />
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Right Col: Top Performers Table */}
        <div className="lg:col-span-7 bg-zinc-950/40 border border-border/40 p-5 rounded-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" /> Top Performing Assets
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-zinc-500 border-b border-zinc-900 pb-2 bg-zinc-950/40">
                  <th className="py-2.5 px-4">Company</th>
                  <th className="py-2.5 px-4">Current ARR</th>
                  <th className="py-2.5 px-4">YoY Growth</th>
                  <th className="py-2.5 px-4 text-right">Health Score</th>
                </tr>
              </thead>
              <tbody>
                {(data?.top_performers || [
                  { name: "Synthetix AI", arr: "$8.4M", growth: "+185% YoY", health: 94 },
                  { name: "FinSync Global", arr: "$6.2M", growth: "+140% YoY", health: 88 },
                  { name: "NovaScale Tech", arr: "$5.1M", growth: "+110% YoY", health: 85 }
                ]).map((p, i) => (
                  <tr key={i} className="border-b border-zinc-900/40 hover:bg-zinc-900/20 last:border-0">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <div className="size-6 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] text-blue-400 font-bold">
                        {p.name.charAt(0)}
                      </div>
                      <span>{p.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-200">{p.arr}</td>
                    <td className="py-3 px-4 font-bold text-emerald-400">{p.growth}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        {p.health}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
