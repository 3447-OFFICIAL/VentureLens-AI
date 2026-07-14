"use client";

import React, { useEffect, useState } from "react";
import { 
  Building2, ArrowUpRight, TrendingUp, Sparkles, CheckCircle2, 
  Clock, ShieldAlert, BarChart3, ChevronRight, Play, Loader2
} from "lucide-react";
import Link from "next/link";

interface Deal {
  id: string;
  company_id: string;
  company_name: string;
  stage: string;
  amount: number;
}

interface Task {
  id: string;
  title: string;
  priority: string;
  due: string;
  company: string;
  status: string;
}

export default function OverviewDashboard() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ name: "User", email: "" });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;
        setLoading(true);

        // Fetch User Profile
        const profileRes = await fetch("http://127.0.0.1:8000/api/v1/auth/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile({
            name: profileData.email.split("@")[0].toUpperCase(),
            email: profileData.email
          });
        }

        // Fetch Active Deals
        const dealsRes = await fetch("http://127.0.0.1:8000/api/v1/deals/", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (dealsRes.ok) {
          const dealsData = await dealsRes.json();
          setDeals(dealsData);
        }

        // Fetch Active Tasks
        const tasksRes = await fetch("http://127.0.0.1:8000/api/v1/tasks/", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData);
        }

      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleToggleTask = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "done" ? "todo" : "done";
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: nextStatus } : t));

    try {
      const token = localStorage.getItem("access_token");
      await fetch(`http://127.0.0.1:8000/api/v1/tasks/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
    } catch (err) {
      console.error("Failed to toggle task", err);
    }
  };

  const activeDealsCount = deals.filter(d => d.stage !== "Closed").length;
  const pendingTasks = tasks.filter(t => t.status !== "done");

  return (
    <div className="flex flex-col h-full w-full space-y-6 text-zinc-300 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-geist tracking-tight text-white flex items-center gap-2">
            Welcome back, {profile.name} <Sparkles className="h-5 w-5 text-blue-500 animate-pulse" />
          </h1>
          <p className="text-zinc-500 text-xs mt-1">Here is a summary of active diligence reviews and portfolio health.</p>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Active Pipeline", val: activeDealsCount, trend: "+3 this wk", link: "/dashboard/pipeline" },
          { label: "Pending Tasks", val: pendingTasks.length, trend: "4 due today", link: "/dashboard/tasks" },
          { label: "Portfolio Companies", val: "14", trend: "0 warnings", link: "/dashboard/portfolio" },
          { label: "Total Assets Under Management (AUM)", val: "$240M", trend: "+$24M Q2", link: "/dashboard/kpis" },
          { label: "AI Auto-Sourced", val: "84", trend: "18% conversion", link: "/dashboard/analytics" }
        ].map((kpi, i) => (
          <div key={i} className="bg-zinc-950/40 border border-border/40 p-4 rounded-xl flex flex-col justify-between hover:border-zinc-800 transition-colors">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">{kpi.label}</span>
              <div className="text-xl font-bold font-geist text-white mt-1.5">{kpi.val}</div>
            </div>
            <div className="text-[9px] text-zinc-500 font-semibold mt-4 flex items-center justify-between">
              <span>{kpi.trend}</span>
              <Link href={kpi.link} className="text-blue-500 hover:underline flex items-center gap-0.5">
                View <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Diligence Checklist & Recent Actions */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Tasks checklist */}
          <div className="bg-zinc-950/40 border border-border/40 p-5 rounded-xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">My Active Checklists</h3>
              <Link href="/dashboard/tasks" className="text-[11px] text-blue-400 font-semibold hover:underline flex items-center gap-0.5">
                Manage Tasks <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            
            {loading ? (
              <div className="flex justify-center p-4"><Loader2 className="animate-spin h-5 w-5 text-blue-500" /></div>
            ) : pendingTasks.length === 0 ? (
              <p className="text-zinc-500 text-xs py-4 text-center">All caught up! No active tasks.</p>
            ) : (
              <div className="space-y-3">
                {pendingTasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="flex items-start justify-between bg-zinc-900/10 p-3 rounded-lg border border-zinc-900/60 hover:bg-zinc-900/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        checked={false} 
                        onChange={() => handleToggleTask(task.id, task.status)}
                        className="mt-0.5 rounded border-zinc-800 bg-zinc-950 text-blue-500 focus:ring-0 cursor-pointer size-4" 
                      />
                      <div>
                        <p className="text-xs font-semibold text-zinc-200">{task.title}</p>
                        <span className="text-[10px] text-zinc-500 font-medium block mt-0.5">{task.company} • {task.due}</span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                      task.priority === "High" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                      task.priority === "Medium" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      "bg-zinc-850 text-zinc-500 border-zinc-800"
                    }`}>{task.priority}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Deals Table */}
          <div className="bg-zinc-950/40 border border-border/40 p-5 rounded-xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Diligence Pipeline</h3>
              <Link href="/dashboard/pipeline" className="text-[11px] text-blue-400 font-semibold hover:underline flex items-center gap-0.5">
                Full Pipeline <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-zinc-500 font-semibold border-b border-zinc-900 pb-2">
                    <th className="pb-2">Company</th>
                    <th className="pb-2">Diligence Stage</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.slice(0, 4).map((deal, i) => (
                    <tr key={i} className="border-b border-zinc-900/20 hover:bg-zinc-900/10 last:border-0">
                      <td className="py-2.5 font-bold text-white flex items-center gap-2">
                        <div className="size-5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 font-bold">{deal.company_name.charAt(0)}</div>
                        {deal.company_name}
                      </td>
                      <td className="py-2.5 text-zinc-400 font-medium">{deal.stage}</td>
                      <td className="py-2.5 text-zinc-200 font-mono font-medium">${(deal.amount / 1000000).toFixed(1)}M</td>
                      <td className="py-2.5 text-right">
                        <Link href="/dashboard/pipeline" className="inline-flex items-center text-[10px] text-blue-400 font-semibold hover:underline">
                          View <ChevronRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Sidebar - Portfolio Health & Circular Gauge */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Portfolio Health Card with Circular Gauge */}
          <div className="bg-zinc-950/40 border border-border/40 p-5 rounded-xl flex flex-col items-center text-center space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider self-start border-b border-zinc-900 pb-2 w-full text-left">Portfolio Performance</h3>
            
            <div className="relative inline-flex items-center justify-center w-36 h-36 mt-2">
              {/* Outer gauge */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="8" fill="none" className="text-zinc-900" />
                <circle cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="8" fill="none" className="text-blue-500" strokeDasharray="389" strokeDashoffset="58" strokeLinecap="round" />
              </svg>
              {/* Inner score */}
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold font-geist text-white">85%</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-0.5 mt-0.5">
                  <TrendingUp className="h-3 w-3" /> On Track
                </span>
              </div>
            </div>

            <div className="w-full text-xs text-zinc-400 font-medium pt-2 border-t border-zinc-900/60 mt-2">
              <div className="flex justify-between items-center text-left py-1">
                <span>Active Reviews:</span>
                <span className="text-white font-bold">{activeDealsCount}</span>
              </div>
              <div className="flex justify-between items-center text-left py-1">
                <span>AUM Growth:</span>
                <span className="text-emerald-400 font-bold">+12.4% MoM</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
