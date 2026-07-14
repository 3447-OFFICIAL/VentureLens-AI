"use client";

import React from "react";
import { 
  BarChart3, Search, Filter, Plus, Calendar, CheckSquare, 
  ChevronRight, TrendingUp, TrendingDown, LayoutGrid, Download
} from "lucide-react";
import Link from "next/link";

export default function KPIsModule() {
  return (
    <div className="flex flex-col h-full w-full space-y-6 text-zinc-300 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-geist tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-500" /> KPIs & Metrics
          </h1>
          <p className="text-zinc-500 text-xs mt-1">Track key performance indicators across your portfolio.</p>
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
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: "ARR", val: "$45.2M", change: "+12.4%", trend: "up" },
          { label: "MRR", val: "$3.8M", change: "+10.7%", trend: "up" },
          { label: "Total Customers", val: "12,847", change: "+16.3%", trend: "up" },
          { label: "Gross Margin", val: "76.3%", change: "+2.1%", trend: "up" },
          { label: "Churn Rate", val: "2.1%", change: "0.0%", trend: "neutral" },
          { label: "Burn Multiple", val: "1.8x", change: "-0.2x", trend: "up" }
        ].map((kpi, i) => (
          <div key={i} className="bg-zinc-950/40 border border-border/40 p-4 rounded-xl flex flex-col justify-between hover:border-zinc-800 transition-colors">
            <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">{kpi.label}</span>
            <div className="text-xl font-bold font-geist text-white mt-2">{kpi.val}</div>
            <div className={`text-[9px] font-semibold mt-1 flex items-center gap-1 ${
              kpi.trend === 'up' ? 'text-emerald-500' : kpi.trend === 'down' ? 'text-rose-500' : 'text-zinc-500'
            }`}>
              {kpi.trend === 'up' ? <TrendingUp className="h-2.5 w-2.5" /> : kpi.trend === 'down' ? <TrendingDown className="h-2.5 w-2.5" /> : null}
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Growth Metrics Chart */}
        <div className="bg-zinc-950/40 border border-border/40 p-5 rounded-xl flex flex-col min-h-[350px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Growth Metrics</h3>
            <div className="flex items-center gap-3 text-[10px] font-medium text-zinc-500">
              <span className="flex items-center gap-1"><div className="size-1.5 rounded-full bg-blue-500"/> ARR</span>
              <span className="flex items-center gap-1"><div className="size-1.5 rounded-full bg-purple-500"/> MRR</span>
            </div>
          </div>
          
          <div className="flex-1 flex items-end gap-2.5 relative z-10 pb-6 border-b border-zinc-900">
            {/* Fake line chart bars/points */}
            {[
              { m: "Jan", arr: 30, mrr: 25 },
              { m: "Feb", arr: 42, mrr: 35 },
              { m: "Mar", arr: 50, mrr: 48 },
              { m: "Apr", arr: 65, mrr: 58 },
              { m: "May", arr: 78, mrr: 70 },
              { m: "Jun", arr: 95, mrr: 88 }
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end items-center h-full relative group">
                <div className="w-full flex gap-1 justify-center items-end h-full">
                  <div className="w-2.5 bg-blue-600/40 hover:bg-blue-500 transition-colors rounded-t-sm" style={{ height: `${d.arr}%` }} />
                  <div className="w-2.5 bg-purple-600/40 hover:bg-purple-500 transition-colors rounded-t-sm" style={{ height: `${d.mrr}%` }} />
                </div>
                <span className="absolute bottom-[-22px] text-[10px] text-zinc-500 font-bold">{d.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* KPIs by Category */}
        <div className="bg-zinc-950/40 border border-border/40 p-5 rounded-xl flex flex-col min-h-[350px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">KPIs by Category</h3>
            <span className="text-[10px] text-zinc-500 font-medium">vs Last Quarter</span>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-4">
            {[
              { label: "Revenue Growth", val: 85, color: "bg-blue-600 border-blue-500" },
              { label: "Customer Growth", val: 72, color: "bg-blue-600/80 border-blue-500/40" },
              { label: "Product Growth", val: 72, color: "bg-purple-600/80 border-purple-500/40" },
              { label: "Operational Efficiency", val: 68, color: "bg-indigo-600/80 border-indigo-500/40" },
              { label: "Financial Health", val: 75, color: "bg-emerald-600/80 border-emerald-500/40" }
            ].map((k, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-zinc-300">
                  <span>{k.label}</span>
                  <span className="font-mono text-zinc-400">{k.val}%</span>
                </div>
                <div className="w-full h-2.5 bg-zinc-900 border border-zinc-900 rounded-md overflow-hidden">
                  <div className={`h-full ${k.color} rounded-sm`} style={{ width: `${k.val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
