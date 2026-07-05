"use client";

import { useState } from "react";
import { 
  Building2, Users, FileText, Brain, Github, Activity, 
  AlertTriangle, DollarSign, TrendingUp, Save, Search, 
  ExternalLink, CheckCircle2
} from "lucide-react";

export default function CompanyWorkspace({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Tabs configuration
  const tabs = [
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "financials", label: "Financials", icon: DollarSign },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "team", label: "Founders & Team", icon: Users },
    { id: "tech", label: "Tech & GitHub", icon: Github },
    { id: "risk", label: "Risk Analysis", icon: AlertTriangle }
  ];

  return (
    <div className="flex flex-col h-full w-full space-y-6">
      
      {/* Workspace Header (Editable Profile) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-card border border-border p-6 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5"><Building2 className="h-48 w-48" /></div>
        <div className="flex gap-6 items-center relative z-10 w-full">
          <div className="h-20 w-20 bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-blue-500">AC</span>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                defaultValue="Acme Corp" 
                className="text-3xl font-geist font-bold bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-blue-500 focus:outline-none transition-colors w-fit"
              />
              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-md uppercase tracking-wider border border-blue-500/20">Series A</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <input defaultValue="https://acme.com" className="bg-transparent border-b border-transparent hover:border-zinc-700 focus:outline-none w-32" />
              <span>•</span>
              <input defaultValue="San Francisco, CA" className="bg-transparent border-b border-transparent hover:border-zinc-700 focus:outline-none w-32" />
              <span>•</span>
              <input defaultValue="Fintech / AI" className="bg-transparent border-b border-transparent hover:border-zinc-700 focus:outline-none w-24" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
              <Save className="h-4 w-4" /> Save Changes
            </button>
            <div className="text-xs text-muted-foreground text-right">Last updated: Just now</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-zinc-700"
            }`}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto">
        
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI Summary */}
              <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-xl p-5 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-5 w-5 text-purple-400" />
                  <h3 className="font-semibold text-purple-50">AI Executive Summary</h3>
                </div>
                <textarea 
                  defaultValue="Acme is a fast-growing B2B fintech leveraging AI for predictive lending. Strong Q3 performance with 24% MoM ARR growth. Primary risk is dependency on a single banking partner."
                  className="w-full h-24 bg-transparent resize-none focus:outline-none text-sm text-zinc-300 leading-relaxed"
                />
              </div>

              {/* Funding & Cap Table */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold mb-4">Funding History & Cap Table</h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Raised</p>
                    <input defaultValue="$12.5M" className="text-xl font-bold bg-transparent focus:outline-none w-full" />
                  </div>
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Post-Money Val</p>
                    <input defaultValue="$65.0M" className="text-xl font-bold bg-transparent focus:outline-none w-full" />
                  </div>
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Ownership</p>
                    <input defaultValue="12.4%" className="text-xl font-bold bg-transparent focus:outline-none text-emerald-400 w-full" />
                  </div>
                </div>
                {/* Timeline */}
                <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-2 before:w-px before:bg-zinc-800 ml-2">
                  {[
                    {date: "Oct 2025", event: "Series A", amt: "$10M"},
                    {date: "Jan 2024", event: "Seed", amt: "$2.5M"}
                  ].map((evt, i) => (
                    <div key={i} className="flex gap-4 relative">
                      <div className="h-4 w-4 rounded-full bg-blue-500 border-2 border-card absolute -left-[7px] top-1"></div>
                      <div className="pl-6 w-full flex justify-between items-center bg-zinc-900/50 p-2 rounded-md">
                        <div>
                          <p className="text-sm font-semibold">{evt.event}</p>
                          <p className="text-xs text-muted-foreground">{evt.date}</p>
                        </div>
                        <span className="text-sm font-mono">{evt.amt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col */}
            <div className="space-y-6">
              {/* Activity Feed */}
              <div className="bg-card border border-border rounded-xl p-5 h-[300px] flex flex-col">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><Activity className="h-4 w-4" /> Recent Activity</h3>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {[
                    "Financial model updated (2h ago)",
                    "Partner meeting scheduled (1d ago)",
                    "Q3 Deck uploaded (2d ago)"
                  ].map((log, i) => (
                    <div key={i} className="text-sm text-muted-foreground border-l-2 border-zinc-800 pl-3">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitors & Customers */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold mb-3">Market Positioning</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 uppercase">Competitors</p>
                    <textarea defaultValue="Stripe, Square, Adyen" className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm focus:outline-none focus:border-blue-500 resize-none h-16" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 uppercase">Top Customers</p>
                    <textarea defaultValue="Shopify, Vercel, Figma" className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm focus:outline-none focus:border-blue-500 resize-none h-16" />
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        )}

        {/* FINANCIALS TAB */}
        {activeTab === "financials" && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-zinc-900/50">
              <h3 className="font-semibold text-foreground">Financial Metrics & KPIs</h3>
              <button className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90">Export to Excel</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-zinc-950 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Metric</th>
                    <th className="px-6 py-4 font-medium text-right">Q1 2025</th>
                    <th className="px-6 py-4 font-medium text-right">Q2 2025</th>
                    <th className="px-6 py-4 font-medium text-right">Q3 2025</th>
                    <th className="px-6 py-4 font-medium text-right">Q4 2025 (Proj)</th>
                    <th className="px-6 py-4 font-medium text-right">YoY Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    {name: "Annual Recurring Revenue (ARR)", q1: "$1.2M", q2: "$1.8M", q3: "$2.5M", q4: "$3.4M", yoy: "+183%"},
                    {name: "Monthly Cash Burn", q1: "$250K", q2: "$300K", q3: "$450K", q4: "$500K", yoy: "+100%"},
                    {name: "Gross Margin", q1: "65%", q2: "68%", q3: "72%", q4: "75%", yoy: "+15%"},
                    {name: "Net Dollar Retention (NDR)", q1: "115%", q2: "118%", q3: "124%", q4: "130%", yoy: "+13%"},
                    {name: "Customer Acquisition Cost (CAC)", q1: "$12K", q2: "$11K", q3: "$9.5K", q4: "$8K", yoy: "-33%"}
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-zinc-900/50 transition-colors group">
                      <td className="px-6 py-4 font-medium text-foreground">{row.name}</td>
                      <td className="px-6 py-4 text-right">
                        <input defaultValue={row.q1} className="w-full text-right bg-transparent border-b border-transparent group-hover:border-zinc-700 focus:border-blue-500 focus:outline-none" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <input defaultValue={row.q2} className="w-full text-right bg-transparent border-b border-transparent group-hover:border-zinc-700 focus:border-blue-500 focus:outline-none" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <input defaultValue={row.q3} className="w-full text-right bg-transparent border-b border-transparent group-hover:border-zinc-700 focus:border-blue-500 focus:outline-none" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <input defaultValue={row.q4} className="w-full text-right bg-transparent border-b border-transparent group-hover:border-zinc-700 focus:border-blue-500 focus:outline-none text-zinc-400" />
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-emerald-400">{row.yoy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other tabs omitted for brevity, but they follow the same editable structure */}
        
      </div>
    </div>
  );
}
