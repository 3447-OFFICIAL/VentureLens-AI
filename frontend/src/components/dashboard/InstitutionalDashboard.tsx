"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  Briefcase, 
  Clock, 
  FileText, 
  FolderOpen, 
  HelpCircle, 
  Bell, 
  Search, 
  ChevronRight, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Activity, 
  Layers, 
  CheckSquare, 
  MessageSquare,
  ArrowUpRight,
  Filter,
  Plus,
  MoreVertical,
  ChevronDown
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

type Task = {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  due: string;
  completed: boolean;
};

type Alert = {
  id: string;
  title: string;
  company: string;
  score: string;
  severity: "High" | "Medium" | "Low";
  time: string;
};

export default function InstitutionalDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  
  // Sparkline data for metrics cards
  const sparkData = [
    { value: 10 }, { value: 15 }, { value: 12 }, { value: 18 }, { value: 16 }, { value: 24 }
  ];

  const tasks: Task[] = [
    { id: "1", title: "Review FinModel - SynthoAI", priority: "High", due: "Due today", completed: false },
    { id: "2", title: "Technical DD - Nexora Labs", priority: "High", due: "Due in 1 day", completed: false },
    { id: "3", title: "Market Analysis - Vectora", priority: "Medium", due: "Due in 2 days", completed: false },
    { id: "4", title: "IC Memo - QuantumDB", priority: "High", due: "Due in 3 days", completed: false },
    { id: "5", title: "Follow up - Greenlyst", priority: "Low", due: "Due in 5 days", completed: false }
  ];

  const alerts: Alert[] = [
    { id: "1", title: "High Customer Concentration", company: "EcoMove", score: "Risk Score: High", severity: "High", time: "2h ago" },
    { id: "2", title: "Runway < 12 Months", company: "SynthoAI", score: "Risk Score: High", severity: "High", time: "5h ago" },
    { id: "3", title: "Negative Gross Margin", company: "UrbanStash", score: "Risk Score: Medium", severity: "Medium", time: "1d ago" },
    { id: "4", title: "Rapid Burn Increase", company: "HealthSync", score: "Risk Score: Medium", severity: "Medium", time: "1d ago" },
    { id: "5", title: "Unusual Revenue Spike", company: "PayFlow", score: "Risk Score: Low", severity: "Low", time: "2d ago" }
  ];

  return (
    <div className="flex h-screen bg-[#080b11] text-slate-100 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#161c28] bg-[#0b0e14] flex flex-col justify-between shrink-0">
        <div className="flex flex-col overflow-y-auto px-4 py-6 space-y-8">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg">
              V
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-wide text-white">VentureLens AI</h1>
              <p className="text-[10px] text-slate-500">AI Due Diligence Copilot</p>
            </div>
          </div>

          {/* Nav groups */}
          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-600 tracking-wider px-2 mb-2">Deal Flow</p>
              <nav className="space-y-1">
                {[
                  { name: "Overview", icon: Layers },
                  { name: "Companies", icon: Briefcase },
                  { name: "Due Diligence", icon: Clock },
                  { name: "AI Reports", icon: FileText },
                  { name: "Investment Memos", icon: FolderOpen },
                  { name: "Tasks", icon: CheckSquare }
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                      activeTab === item.name 
                        ? "bg-[#181f30] text-indigo-400 font-medium" 
                        : "text-slate-400 hover:bg-[#0f141f] hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-600 tracking-wider px-2 mb-2">Portfolio</p>
              <nav className="space-y-1">
                {[
                  { name: "Portfolio Companies", icon: Briefcase },
                  { name: "KPIs & Metrics", icon: BarChart3 },
                  { name: "Analytics", icon: Activity },
                  { name: "Alerts", icon: AlertTriangle }
                ].map((item) => (
                  <button
                    key={item.name}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:bg-[#0f141f] hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-600 tracking-wider px-2 mb-2">Investment Committee</p>
              <nav className="space-y-1">
                {["Committee Decks", "Meetings", "Decisions"].map((item) => (
                  <button
                    key={item}
                    className="w-full flex items-center px-3 py-2 text-xs text-slate-400 hover:bg-[#0f141f] hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>{item}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Footer info card */}
        <div className="p-4 border-t border-[#161c28]">
          <div className="bg-[#101520] p-3 rounded-lg border border-[#1d263b] flex items-center justify-between">
            <div>
              <h4 className="text-[11px] font-semibold text-white">VentureLens AI</h4>
              <p className="text-[9px] text-slate-500">Enterprise Plan</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header bar */}
        <header className="h-16 border-b border-[#161c28] bg-[#0b0e14] px-6 flex items-center justify-between shrink-0">
          <div className="w-96 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search companies, investors, documents, metrics..." 
              className="w-full bg-[#101522] border border-[#1c2438] rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-1.5 text-slate-400 hover:text-slate-200 cursor-pointer">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
            </button>
            <button className="p-1.5 text-slate-400 hover:text-slate-200 cursor-pointer">
              <HelpCircle className="w-4.5 h-4.5" />
            </button>
            <div className="flex items-center space-x-3 pl-2 border-l border-[#1c2438]">
              <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
                  alt="Arjun Mehta" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left shrink-0 hidden sm:block">
                <p className="text-xs font-semibold text-slate-200">Arjun Mehta</p>
                <p className="text-[10px] text-slate-500">Partner</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content workspace wrapper */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left/Middle Content Dashboard */}
          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* User welcome section */}
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Good morning, Arjun 👋</h2>
                <p className="text-xs text-slate-400 mt-1">Here's what's happening with your portfolio and deal flow.</p>
              </div>
              <div className="flex items-center bg-[#0d121c] border border-[#161c28] p-1 rounded-lg text-xs">
                {["7D", "30D", "90D", "1Y"].map((filter) => (
                  <button 
                    key={filter} 
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${filter === "30D" ? "bg-[#182136] text-indigo-400 font-semibold" : "text-slate-400 hover:text-slate-200"}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { title: "Deal Flow", val: "24", sub: "New companies", rate: "+33%", trend: "up", color: "#6366f1" },
                { title: "Under Review", val: "12", sub: "Active diligences", rate: "+20%", trend: "up", color: "#3b82f6" },
                { title: "Portfolio Value", val: "$128.4M", sub: "Total portfolio value", rate: "▲ 18.7%", trend: "up", color: "#10b981" },
                { title: "IRR (Net)", val: "24.6%", sub: "Portfolio Net IRR", rate: "▲ 4.3%", trend: "up", color: "#f59e0b" },
                { title: "Dry Powder", val: "$45.2M", sub: "Available to invest", rate: "▲ 7.2%", trend: "up", color: "#ec4899" }
              ].map((m, i) => (
                <div key={i} className="bg-[#0b0e14] border border-[#161c28] rounded-xl p-4 flex flex-col justify-between h-36">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">{m.title}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">{m.rate}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-2">{m.val}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">{m.sub}</p>
                  </div>
                  <div className="h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparkData}>
                        <defs>
                          <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={m.color} stopOpacity={0.4}/>
                            <stop offset="95%" stopColor={m.color} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke={m.color} strokeWidth={1.5} fill={`url(#grad-${i})`} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Pipeline Overview */}
              <div className="bg-[#0b0e14] border border-[#161c28] rounded-xl p-5 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">Pipeline Overview</h4>
                  <button className="flex items-center space-x-1 text-[10px] text-slate-400 border border-[#1c2438] px-2.5 py-1 rounded bg-[#0f1420] cursor-pointer">
                    <span>30 Days</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-6 flex-1">
                  {/* Mock Funnel SVG */}
                  <div className="w-1/2 flex justify-center py-4">
                    <svg viewBox="0 0 200 160" className="w-48 h-auto">
                      <polygon points="10,10 190,10 165,30 35,30" fill="#4f46e5" opacity="0.9" />
                      <polygon points="35,33 165,33 140,55 60,55" fill="#3b82f6" opacity="0.9" />
                      <polygon points="60,58 140,58 120,80 80,80" fill="#10b981" opacity="0.9" />
                      <polygon points="80,83 120,83 105,105 95,105" fill="#f59e0b" opacity="0.9" />
                      <polygon points="95,108 105,108 102,125 98,125" fill="#ec4899" opacity="0.9" />
                      <polygon points="98,128 102,128 100,140 100,140" fill="#ef4444" opacity="0.9" />
                    </svg>
                  </div>
                  
                  <div className="flex-1 space-y-2 text-xs">
                    {[
                      { name: "Total Incoming", count: 156, color: "bg-indigo-600" },
                      { name: "Initial Screening", count: 68, color: "bg-blue-500" },
                      { name: "Due Diligence", count: 24, color: "bg-emerald-500" },
                      { name: "Partner Review", count: 12, color: "bg-amber-500" },
                      { name: "IC Review", count: 6, color: "bg-pink-500" },
                      { name: "Term Sheet", count: 3, color: "bg-red-500" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                          <span className="text-slate-400 text-[10px]">{item.name}</span>
                        </div>
                        <span className="font-semibold text-[10px]">{item.count}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-[#1c2438] flex justify-between items-center text-[10px]">
                      <span className="text-slate-500">Conversion Rate</span>
                      <span className="text-emerald-400 font-bold">1.92%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio Health */}
              <div className="bg-[#0b0e14] border border-[#161c28] rounded-xl p-5 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">Portfolio Health</h4>
                  <button className="text-[10px] text-indigo-400 font-semibold cursor-pointer">View All</button>
                </div>

                <div className="flex items-center justify-between flex-1">
                  <div className="relative w-1/2 flex justify-center py-4">
                    <svg viewBox="0 0 120 120" className="w-36 h-36">
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#ef4444" strokeWidth="8" strokeDasharray="280" strokeDashoffset="240" strokeLinecap="round" />
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#f59e0b" strokeWidth="8" strokeDasharray="280" strokeDashoffset="180" strokeLinecap="round" />
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#3b82f6" strokeWidth="8" strokeDasharray="280" strokeDashoffset="100" strokeLinecap="round" />
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="280" strokeDashoffset="0" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Overall Score</p>
                      <h3 className="text-2xl font-bold text-white mt-1">78</h3>
                      <p className="text-[9px] text-emerald-400 font-semibold mt-0.5">Good</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2.5 text-xs pl-4">
                    {[
                      { name: "Excellent (80-100)", count: 6, color: "bg-emerald-500" },
                      { name: "Good (60-79)", count: 8, color: "bg-blue-500" },
                      { name: "Average (40-59)", count: 3, color: "bg-amber-500" },
                      { name: "At Risk (20-39)", count: 2, color: "bg-orange-500" },
                      { name: "Critical (0-19)", count: 1, color: "bg-red-500" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                          <span className="text-slate-400 text-[10px]">{item.name}</span>
                        </div>
                        <span className="font-semibold text-[10px]">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* DD Reports & Risks Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Due Diligence Reports list */}
              <div className="bg-[#0b0e14] border border-[#161c28] rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">Recent Due Diligence Reports</h4>
                  <button className="text-[10px] text-indigo-400 font-semibold cursor-pointer">View All</button>
                </div>
                <div className="space-y-3.5">
                  {[
                    { company: "SynthoAI", stage: "Series A", score: 84, scoreColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", time: "2h ago" },
                    { company: "Nexora Labs", stage: "Seed", score: 72, scoreColor: "bg-amber-500/20 text-amber-400 border-amber-500/30", time: "5h ago" },
                    { company: "QuantumDB", stage: "Series Seed", score: 88, scoreColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", time: "1d ago" },
                    { company: "Vectora", stage: "Seed", score: 68, scoreColor: "bg-amber-500/20 text-amber-400 border-amber-500/30", time: "2d ago" },
                    { company: "Greenlyst", stage: "Pre-Seed", score: 64, scoreColor: "bg-amber-500/20 text-amber-400 border-amber-500/30", time: "2d ago" }
                  ].map((rep, idx) => (
                    <div key={idx} className="flex items-center justify-between pb-3 border-b border-[#161c28]/50 last:border-b-0 last:pb-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs">
                          {rep.company[0]}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-200">{rep.company}</p>
                          <p className="text-[9px] text-slate-500 mt-0.5">{rep.stage}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold border ${rep.scoreColor}`}>
                          {rep.score}
                        </div>
                        <span className="text-[10px] text-slate-500">{rep.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Distribution Chart */}
              <div className="bg-[#0b0e14] border border-[#161c28] rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">Risk Distribution</h4>
                  <button className="text-[10px] text-indigo-400 font-semibold cursor-pointer">View All</button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="relative w-1/2 flex justify-center">
                    <svg viewBox="0 0 100 100" className="w-28 h-28">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#38bdf8" strokeWidth="8" strokeDasharray="250" strokeDashoffset="180" strokeLinecap="round" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="250" strokeDashoffset="120" strokeLinecap="round" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="8" strokeDasharray="250" strokeDashoffset="60" strokeLinecap="round" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="8" strokeDasharray="250" strokeDashoffset="0" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-[7px] text-slate-500 uppercase tracking-widest font-bold">Total</p>
                      <h3 className="text-xl font-bold text-white mt-0.5">24</h3>
                      <p className="text-[7px] text-slate-500 uppercase font-bold tracking-widest mt-0.5">Companies</p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2 text-xs pl-3">
                    {[
                      { name: "Low Risk", val: "6 (25%)", color: "bg-emerald-500" },
                      { name: "Medium Risk", val: "9 (37.5%)", color: "bg-sky-400" },
                      { name: "High Risk", val: "6 (25%)", color: "bg-amber-500" },
                      { name: "Critical Risk", val: "3 (12.5%)", color: "bg-red-500" }
                    ].map((risk, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${risk.color}`}></span>
                          <span className="text-slate-400 text-[10px]">{risk.name}</span>
                        </div>
                        <span className="font-semibold text-[10px]">{risk.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Risk Factors list */}
              <div className="bg-[#0b0e14] border border-[#161c28] rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">Top Risk Factors</h4>
                  <button className="text-[10px] text-indigo-400 font-semibold cursor-pointer">View All</button>
                </div>
                <div className="space-y-4 pt-1">
                  {[
                    { factor: "High Burn Rate", pct: 42, color: "bg-red-500" },
                    { factor: "Customer Concentration", pct: 29, color: "bg-amber-500" },
                    { factor: "Weak Unit Economics", pct: 25, color: "bg-amber-500" },
                    { factor: "Founder Dependency", pct: 21, color: "bg-emerald-500" },
                    { factor: "Market Competition", pct: 18, color: "bg-blue-500" }
                  ].map((risk, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-300 font-medium">{risk.factor}</span>
                        <span className="text-slate-200 font-bold">{risk.pct}%</span>
                      </div>
                      <div className="w-full bg-[#161c28] h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${risk.color}`} style={{ width: `${risk.pct}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Portfolio Companies Table */}
            <div className="bg-[#0b0e14] border border-[#161c28] rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">Portfolio Companies</h4>
                <div className="flex items-center space-x-3">
                  <button className="text-[10px] text-indigo-400 font-semibold cursor-pointer">View All</button>
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[10px] px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow transition-colors cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Company</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#1c2438] text-slate-500">
                      <th className="py-3 font-semibold text-[10px] uppercase">Company</th>
                      <th className="py-3 font-semibold text-[10px] uppercase">Stage</th>
                      <th className="py-3 font-semibold text-[10px] uppercase">Ownership</th>
                      <th className="py-3 font-semibold text-[10px] uppercase text-center">Health Score</th>
                      <th className="py-3 font-semibold text-[10px] uppercase">ARR</th>
                      <th className="py-3 font-semibold text-[10px] uppercase">Runway</th>
                      <th className="py-3 font-semibold text-[10px] uppercase">Trend</th>
                      <th className="py-3 font-semibold text-[10px] uppercase">Last Updated</th>
                      <th className="py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#161c28]/50">
                    {[
                      { name: "SynthoAI", stage: "Series A", own: "12.5%", score: 84, scoreColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", arr: "$12.4M", runway: "14 months", time: "2h ago", trendColor: "#10b981" },
                      { name: "QuantumDB", stage: "Seed", own: "8.7%", score: 88, scoreColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", arr: "$3.2M", runway: "18 months", time: "1d ago", trendColor: "#10b981" },
                      { name: "EcoMove", stage: "Series A", own: "15.2%", score: 62, scoreColor: "text-amber-400 bg-amber-500/10 border-amber-500/20", arr: "$8.7M", runway: "10 months", time: "1d ago", trendColor: "#f59e0b" },
                      { name: "HealthSync", stage: "Seed", own: "9.3%", score: 75, scoreColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", arr: "$2.1M", runway: "16 months", time: "2d ago", trendColor: "#10b981" },
                      { name: "UrbanStash", stage: "Seed", own: "7.1%", score: 58, scoreColor: "text-amber-400 bg-amber-500/10 border-amber-500/20", arr: "$1.4M", runway: "8 months", time: "2d ago", trendColor: "#f59e0b" }
                    ].map((comp, idx) => (
                      <tr key={idx} className="hover:bg-[#0f1421]/30">
                        <td className="py-3 font-semibold flex items-center space-x-3 text-slate-200">
                          <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center font-bold text-[10px]">
                            {comp.name[0]}
                          </div>
                          <span>{comp.name}</span>
                        </td>
                        <td className="py-3 text-slate-400">{comp.stage}</td>
                        <td className="py-3 text-slate-300">{comp.own}</td>
                        <td className="py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${comp.scoreColor}`}>
                            {comp.score}
                          </span>
                        </td>
                        <td className="py-3 text-slate-200">{comp.arr}</td>
                        <td className="py-3 text-slate-300">{comp.runway}</td>
                        <td className="py-3">
                          <div className="w-16 h-6">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={sparkData}>
                                <Area type="monotone" dataKey="value" stroke={comp.trendColor} strokeWidth={1} fill="none" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </td>
                        <td className="py-3 text-slate-500">{comp.time}</td>
                        <td className="py-3 text-right">
                          <button className="text-slate-500 hover:text-slate-300 cursor-pointer">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>

          {/* Right Sidebar - Tasks, Alerts & Chat */}
          <aside className="w-80 border-l border-[#161c28] bg-[#0b0e14] flex flex-col justify-between shrink-0 overflow-y-auto px-5 py-6 space-y-6">
            
            {/* My Tasks Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">My Tasks</h4>
                <button className="text-[10px] text-indigo-400 font-semibold cursor-pointer">View All</button>
              </div>
              <div className="space-y-2.5">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-[#101522] border border-[#1c2438] p-3 rounded-lg flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <input 
                        type="checkbox" 
                        className="mt-1 rounded bg-[#101522] border-[#1c2438] text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{task.title}</p>
                        <p className="text-[9px] text-slate-500 mt-1">{task.due}</p>
                      </div>
                    </div>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                      task.priority === "High" 
                        ? "bg-red-500/10 text-red-400 border-red-500/20" 
                        : task.priority === "Medium"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Alerts Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">AI Alerts</h4>
                <button className="text-[10px] text-indigo-400 font-semibold cursor-pointer">View All</button>
              </div>
              <div className="space-y-2.5">
                {alerts.map((alert) => (
                  <div key={alert.id} className="bg-[#101522] border border-[#1c2438] p-3 rounded-lg flex items-start space-x-3">
                    <div className="mt-0.5 p-1 rounded bg-[#1b1c24]">
                      <AlertTriangle className={`w-3.5 h-3.5 ${
                        alert.severity === "High" 
                          ? "text-red-400" 
                          : alert.severity === "Medium" 
                          ? "text-amber-400" 
                          : "text-emerald-400"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-semibold text-slate-200">{alert.title}</p>
                        <span className="text-[8px] text-slate-500">{alert.time}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1 text-[9px]">
                        <span className="text-slate-400 font-medium">{alert.company}</span>
                        <span className={`font-semibold ${
                          alert.severity === "High" 
                            ? "text-red-400" 
                            : alert.severity === "Medium" 
                            ? "text-amber-400" 
                            : "text-emerald-400"
                        }`}>{alert.score}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ask VentureLens AI Chat widget */}
            <div className="bg-gradient-to-tr from-slate-900 to-[#10141f] border border-[#1d263b] rounded-xl p-4 relative overflow-hidden shrink-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center font-bold text-[9px] text-white">
                    V
                  </div>
                  <h4 className="text-xs font-bold text-white">Ask VentureLens AI</h4>
                </div>
                <button className="text-slate-500 hover:text-slate-400 text-xs cursor-pointer">×</button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                Ask anything about companies, markets, financials, or due diligence...
              </p>
              <div className="mt-4 relative">
                <input 
                  type="text" 
                  placeholder="Ask anything..." 
                  className="w-full bg-[#080b11] border border-[#1c2438] rounded-lg pl-3 pr-8 py-2 text-[10px] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-300 font-semibold text-xs cursor-pointer">
                  →
                </button>
              </div>
            </div>

          </aside>

        </div>

      </div>

    </div>
  );
}
