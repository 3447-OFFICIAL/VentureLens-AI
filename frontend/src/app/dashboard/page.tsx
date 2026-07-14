"use client";

import React, { useEffect, useState } from "react";
import { 
  TrendingUp, TrendingDown, Wallet, CheckSquare, Calendar, Bell, Brain, 
  BarChart3, Activity, Zap, FileText, LayoutGrid, Search, ArrowRight,
  ShieldAlert, AlertTriangle, AlertCircle, Building2, Flame, HelpCircle
} from "lucide-react";

export default function DashboardPage() {
  const [dealCount, setDealCount] = useState(24);
  const [userName, setUserName] = useState("Arjun");
  
  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;
        
        // Fetch profile
        const userRes = await fetch("http://localhost:8000/api/v1/auth/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData && userData.email) {
            const emailPrefix = userData.email.split("@")[0];
            setUserName(emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1));
          }
        }
        
        // Fetch deals
        const dealsRes = await fetch("http://localhost:8000/api/v1/deals/", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (dealsRes.ok) {
          const data = await dealsRes.json();
          if (data && data.length > 0) {
            setDealCount(data.length);
          }
        }
      } catch (err) {
        console.error("Failed to load overview data", err);
      }
    }
    fetchUserData();
  }, []);

  return (
    <div className="flex flex-col space-y-6 w-full pb-10 text-zinc-300 font-sans">
      
      {/* Header & Metric Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-geist tracking-tight text-white flex items-center gap-2">
            Good morning, {userName} <span className="animate-pulse">🖐️</span>
          </h1>
          <p className="text-zinc-500 text-xs mt-1">Here&apos;s what&apos;s happening with your portfolio and deal flow.</p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-950 p-1 border border-zinc-900 rounded-lg">
          {["7D", "30D", "90D", "1Y"].map((t) => (
            <button 
              key={t}
              className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                t === "30D" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {t}
            </button>
          ))}
          <button className="px-3 py-1 text-[11px] font-semibold text-zinc-500 hover:text-zinc-300 border-l border-zinc-900 ml-1">
            Customize
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Deal Flow", val: `${dealCount}`, sub: "New companies", change: "+33%", desc: "vs last 30 days", trend: "up", icon: LayoutGrid },
          { label: "Under Review", val: "12", sub: "Active diligences", change: "+20%", desc: "vs last 30 days", trend: "up", icon: Activity },
          { label: "Portfolio Value", val: "$128.4M", sub: "Total portfolio value", change: "+18.7%", desc: "vs last 30 days", trend: "up", icon: Wallet },
          { label: "IRR (Net)", val: "24.6%", sub: "Portfolio Net IRR", change: "+4.3%", desc: "vs last 30 days", trend: "up", icon: TrendingUp },
          { label: "Dry Powder", val: "$45.2M", sub: "Available to invest", change: "+7.2%", desc: "vs last 30 days", trend: "up", icon: Zap }
        ].map((kpi, i) => (
          <div key={i} className="p-4 bg-zinc-950/40 border border-border/40 rounded-xl flex flex-col justify-between hover:border-zinc-800 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">{kpi.label}</span>
                <kpi.icon className="h-3.5 w-3.5 text-zinc-500" />
              </div>
              <div className="text-2xl font-bold font-geist text-white">{kpi.val}</div>
              <span className="text-[10px] text-zinc-500 font-medium">{kpi.sub}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-[10px] font-semibold text-emerald-500">
              <TrendingUp className="h-3 w-3" />
              <span>{kpi.change}</span>
              <span className="text-zinc-500 font-normal">{kpi.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Dashboard Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Pipeline Overview Funnel */}
        <div className="lg:col-span-4 bg-zinc-950/40 border border-border/40 p-5 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Pipeline Overview</h3>
            <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400">30 Days</span>
          </div>
          
          <div className="flex flex-col gap-2.5 my-4">
            {[
              { stage: "Total Incoming", count: 156, color: "bg-blue-600/30 border-blue-500/40" },
              { stage: "Initial Screening", count: 68, color: "bg-blue-600/50 border-blue-500/60" },
              { stage: "Due Diligence", count: 24, color: "bg-blue-600/70 border-blue-500/80" },
              { stage: "Partner Review", count: 12, color: "bg-blue-600 border-blue-500" },
              { stage: "IC Review", count: 6, color: "bg-indigo-600 border-indigo-500" },
              { stage: "Term Sheet", count: 3, color: "bg-violet-600 border-violet-500" }
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4 text-xs">
                <span className="w-24 text-zinc-500 font-medium">{f.stage}</span>
                <div className="flex-1 h-5 bg-zinc-900 rounded-md overflow-hidden border border-zinc-900">
                  <div className={`h-full ${f.color} rounded-sm flex items-center px-2 transition-all duration-500`} style={{ width: `${(f.count / 156) * 100}%` }}>
                    <span className="text-[10px] font-mono text-white font-semibold">{f.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center border-t border-zinc-900 pt-3 mt-2 text-[10px] text-zinc-500 font-medium">
            <span>Conversion Rate</span>
            <span className="text-emerald-400 font-mono font-bold text-xs">1.92%</span>
          </div>
        </div>

        {/* Portfolio Health */}
        <div className="lg:col-span-4 bg-zinc-950/40 border border-border/40 p-5 rounded-xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Portfolio Health</h3>
            <button className="text-[10px] text-blue-400 font-medium hover:underline">View All</button>
          </div>

          <div className="flex items-center gap-6 my-auto">
            {/* Health Score Circular Gauge */}
            <div className="relative inline-flex items-center justify-center w-28 h-28 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="46" stroke="currentColor" strokeWidth="8" fill="none" className="text-zinc-900" />
                <circle cx="56" cy="56" r="46" stroke="currentColor" strokeWidth="8" fill="none" className="text-emerald-500" strokeDasharray="289" strokeDashoffset="63" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold font-geist text-white leading-none">78</span>
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider mt-1">Good</span>
              </div>
            </div>

            <div className="flex-1 space-y-2 text-[11px] font-medium text-zinc-400">
              {[
                { label: "Excellent (80-100)", count: 6, color: "bg-emerald-500" },
                { label: "Good (60-79)", count: 8, color: "bg-blue-500" },
                { label: "Average (40-59)", count: 3, color: "bg-amber-500" },
                { label: "At Risk (20-39)", count: 2, color: "bg-orange-500" },
                { label: "Critical (0-19)", count: 1, color: "bg-rose-500" }
              ].map((h, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className={`size-1.5 rounded-full ${h.color}`} />
                    <span>{h.label}</span>
                  </div>
                  <span className="font-mono text-zinc-300">{h.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Tasks Checklist */}
        <div className="lg:col-span-4 bg-zinc-950/40 border border-border/40 p-5 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">My Tasks</h3>
            <button className="text-[10px] text-blue-400 font-medium hover:underline">View All</button>
          </div>

          <div className="space-y-3 my-auto">
            {[
              { task: "Review FinModel - SynthAI", priority: "High", due: "Due today", checked: false, color: "text-rose-500 border-rose-500/20 bg-rose-500/10" },
              { task: "Technical DD - Nexora Labs", priority: "High", due: "Due in 1 day", checked: false, color: "text-rose-500 border-rose-500/20 bg-rose-500/10" },
              { task: "Market Analysis - Vectora", priority: "Medium", due: "Due in 2 days", checked: false, color: "text-amber-500 border-amber-500/20 bg-amber-500/10" },
              { task: "IC Memo - QuantumDB", priority: "High", due: "Due in 3 days", checked: false, color: "text-rose-500 border-rose-500/20 bg-rose-500/10" },
              { task: "Follow up - Greenlyst", priority: "Low", due: "Due in 5 days", checked: false, color: "text-zinc-400 border-zinc-800 bg-zinc-900" }
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-xs bg-zinc-900/20 border border-border/20 p-2.5 rounded-lg">
                <input type="checkbox" readOnly checked={t.checked} className="rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-0 focus:ring-offset-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-zinc-200 truncate">{t.task}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{t.due}</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${t.color}`}>{t.priority}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Third Dashboard Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Recent Due Diligence Reports */}
        <div className="lg:col-span-4 bg-zinc-950/40 border border-border/40 p-5 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Recent Diligence Reports</h3>
            <button className="text-[10px] text-blue-400 font-medium hover:underline font-geist">View All</button>
          </div>

          <div className="space-y-2.5 my-auto">
            {[
              { company: "SynthAI", stage: "Series A", score: 84, color: "text-emerald-400 border-emerald-400/20 bg-emerald-500/10", time: "2h ago" },
              { company: "Nexora Labs", stage: "Seed", score: 72, color: "text-emerald-400 border-emerald-400/20 bg-emerald-500/10", time: "5h ago" },
              { company: "QuantumDB", stage: "Series Seed", score: 88, color: "text-emerald-400 border-emerald-400/20 bg-emerald-500/10", time: "1d ago" },
              { company: "Vectora", stage: "Seed", score: 68, color: "text-blue-400 border-blue-400/20 bg-blue-500/10", time: "2d ago" },
              { company: "Greenlyst", stage: "Pre-Seed", score: 64, color: "text-blue-400 border-blue-400/20 bg-blue-500/10", time: "2d ago" }
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between text-xs border-b border-zinc-900 pb-2 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-white">{r.company.charAt(0)}</div>
                  <div>
                    <span className="font-semibold text-zinc-200">{r.company}</span>
                    <span className="text-[10px] text-zinc-500 ml-2 font-normal">{r.stage}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${r.color}`}>{r.score}</span>
                  <span className="text-[10px] text-zinc-500 w-12 text-right">{r.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Distribution and Top Risk Factors */}
        <div className="lg:col-span-4 bg-zinc-950/40 border border-border/40 p-5 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Risk Analysis</h3>
              <button className="text-[10px] text-blue-400 font-medium hover:underline">View All</button>
            </div>
            
            <div className="flex gap-4 items-center mb-6">
              <div className="relative inline-flex items-center justify-center w-20 h-20 shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="none" className="text-zinc-900" />
                  <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="none" className="text-rose-500" strokeDasharray="201" strokeDashoffset="150" strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-lg font-bold text-white leading-none">24</span>
                  <span className="text-[8px] text-zinc-500 mt-0.5">Companies</span>
                </div>
              </div>
              
              <div className="flex-1 grid grid-cols-2 gap-1.5 text-[10px] font-medium text-zinc-400">
                <div className="flex items-center justify-between"><span className="flex items-center gap-1"><div className="size-1.5 rounded-full bg-emerald-500"/>Low Risk</span><span className="font-mono">6</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-1"><div className="size-1.5 rounded-full bg-amber-500"/>Med Risk</span><span className="font-mono">9</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-1"><div className="size-1.5 rounded-full bg-rose-500"/>High Risk</span><span className="font-mono">6</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-1"><div className="size-1.5 rounded-full bg-red-600"/>Critical</span><span className="font-mono">3</span></div>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-900 pt-4 space-y-2">
            <h4 className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase mb-2">Top Risk Factors</h4>
            {[
              { name: "High Burn Rate", pct: 42, color: "bg-rose-500" },
              { name: "Customer Concentration", pct: 29, color: "bg-rose-500" },
              { name: "Weak Unit Economics", pct: 25, color: "bg-amber-500" },
              { name: "Founder Dependency", pct: 21, color: "bg-amber-500" },
              { name: "Market Competition", pct: 18, color: "bg-emerald-500" }
            ].map((risk, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[10px] font-semibold text-zinc-300">
                  <span>{risk.name}</span>
                  <span className="font-mono">{risk.pct}%</span>
                </div>
                <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                  <div className={`h-full ${risk.color}`} style={{ width: `${risk.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Alerts widget */}
        <div className="lg:col-span-4 bg-zinc-950/40 border border-border/40 p-5 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">AI Alerts</h3>
            <button className="text-[10px] text-blue-400 font-medium hover:underline">View All</button>
          </div>

          <div className="space-y-2.5 my-auto">
            {[
              { title: "High Customer Concentration", target: "EcoMove", risk: "High", time: "2h ago", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
              { title: "Runway < 12 Months", target: "SynthAI", risk: "High", time: "5h ago", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
              { title: "Negative Gross Margin", target: "UrbanStash", risk: "Medium", time: "1d ago", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
              { title: "Rapid Burn Increase", target: "HealthSync", risk: "Medium", time: "1d ago", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
              { title: "Unusual Revenue Spike", target: "PayFlow", risk: "Low", time: "2d ago", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" }
            ].map((a, i) => (
              <div key={i} className="flex gap-2 text-xs border-b border-zinc-900 pb-2 last:border-0 last:pb-0">
                <ShieldAlert className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-semibold text-zinc-200 truncate">{a.title}</p>
                    <span className="text-[8px] text-zinc-500 shrink-0">{a.time}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-zinc-400 font-medium">{a.target}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded border ${a.color}`}>Risk: {a.risk}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Table: Portfolio Companies */}
      <div className="bg-zinc-950/40 border border-border/40 p-5 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Portfolio Companies</h3>
          <div className="flex items-center gap-2">
            <button className="text-[10px] text-blue-400 font-medium hover:underline mr-4">View All</button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:opacity-90">
              <Zap className="h-3 w-3" /> Add Company
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-zinc-500 border-b border-zinc-900 pb-3 font-semibold">
                <th className="pb-3 pr-4">Company</th>
                <th className="pb-3 pr-4">Stage</th>
                <th className="pb-3 pr-4">Ownership</th>
                <th className="pb-3 pr-4">Health Score</th>
                <th className="pb-3 pr-4">ARR</th>
                <th className="pb-3 pr-4">Runway</th>
                <th className="pb-3 pr-4">Trend</th>
                <th className="pb-3">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "SynthAI", stage: "Series A", ownership: "12.5%", score: 84, scoreColor: "text-emerald-400 border-emerald-400/20 bg-emerald-500/10", arr: "$12.4M", runway: "14 months", trend: "up", updated: "2h ago" },
                { name: "QuantumDB", stage: "Seed", ownership: "8.7%", score: 88, scoreColor: "text-emerald-400 border-emerald-400/20 bg-emerald-500/10", arr: "$3.2M", runway: "18 months", trend: "up", updated: "1d ago" },
                { name: "EcoMove", stage: "Series A", ownership: "15.2%", score: 62, scoreColor: "text-blue-400 border-blue-400/20 bg-blue-500/10", arr: "$8.7M", runway: "10 months", trend: "up", updated: "1d ago" },
                { name: "HealthSync", stage: "Seed", ownership: "9.3%", score: 75, scoreColor: "text-emerald-400 border-emerald-400/20 bg-emerald-500/10", arr: "$2.1M", runway: "16 months", trend: "down", updated: "2d ago" },
                { name: "UrbanStash", stage: "Seed", ownership: "7.1%", score: 58, scoreColor: "text-amber-400 border-amber-400/20 bg-amber-500/10", arr: "$1.4M", runway: "8 months", trend: "up", updated: "2d ago" }
              ].map((c, i) => (
                <tr key={i} className="border-b border-zinc-900/60 hover:bg-zinc-900/20 last:border-0">
                  <td className="py-3.5 pr-4 flex items-center gap-2">
                    <div className="size-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-white">{c.name.charAt(0)}</div>
                    <span className="font-semibold text-white">{c.name}</span>
                  </td>
                  <td className="py-3.5 pr-4 text-zinc-400 font-medium">{c.stage}</td>
                  <td className="py-3.5 pr-4 text-zinc-400 font-mono font-medium">{c.ownership}</td>
                  <td className="py-3.5 pr-4">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${c.scoreColor}`}>{c.score}</span>
                  </td>
                  <td className="py-3.5 pr-4 text-zinc-200 font-mono font-medium">{c.arr}</td>
                  <td className="py-3.5 pr-4 text-zinc-400 font-medium">{c.runway}</td>
                  <td className="py-3.5 pr-4">
                    {c.trend === "up" ? (
                      <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
                    ) : (
                      <TrendingDown className="h-4.5 w-4.5 text-rose-500" />
                    )}
                  </td>
                  <td className="py-3.5 text-zinc-500 font-medium">{c.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
