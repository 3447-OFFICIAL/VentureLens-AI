"use client";

import { 
  TrendingUp, Wallet, CheckSquare, Calendar, Bell, Brain, 
  BarChart3, Activity, Zap, FileText, LayoutGrid, Search 
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col space-y-6 h-full w-full">
      
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-geist font-semibold tracking-tight text-foreground">Overview</h1>
          <p className="text-muted-foreground text-sm">Welcome back. Here&apos;s what&apos;s happening across your firm.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 border border-border bg-card rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            <Search className="h-4 w-4" />
          </button>
          <button className="p-2 border border-border bg-card rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500"></span>
          </button>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Zap className="h-4 w-4" /> New Deal
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full pb-8">
        
        {/* Left Column (Main Stats & Portfolio) */}
        <div className="md:col-span-8 flex flex-col gap-6">
          
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total AUM", value: "$420.5M", change: "+12.4%", trend: "up", icon: Wallet },
              { label: "Active Deals", value: "34", change: "+4", trend: "up", icon: LayoutGrid },
              { label: "Tasks Due", value: "12", change: "-2", trend: "down", icon: CheckSquare },
              { label: "Avg IRR", value: "24.8%", change: "+1.2%", trend: "up", icon: TrendingUp }
            ].map((kpi, i) => (
              <div key={i} className="p-5 bg-card border border-border rounded-xl flex flex-col hover:border-zinc-700 transition-colors cursor-default group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
                  <kpi.icon className="h-4 w-4 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                </div>
                <div className="text-2xl font-bold font-geist">{kpi.value}</div>
                <div className={`text-xs font-medium mt-1 ${kpi.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {kpi.change} from last month
                </div>
              </div>
            ))}
          </div>

          {/* Charts (Portfolio & Pipeline) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-card border border-border rounded-xl min-h-[300px] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><BarChart3 className="h-32 w-32" /></div>
              <h3 className="text-sm font-semibold text-foreground mb-1 relative z-10">Portfolio Growth</h3>
              <p className="text-xs text-muted-foreground mb-4 relative z-10">MoM Valuation (Simulated)</p>
              <div className="flex-1 flex items-end gap-2 mt-auto relative z-10">
                 {/* Fake Chart Bars */}
                 {[40, 50, 45, 60, 75, 65, 80, 95].map((h, i) => (
                   <div key={i} className="flex-1 bg-blue-500/20 hover:bg-blue-500/50 transition-colors rounded-t-sm" style={{height: `${h}%`}}></div>
                 ))}
              </div>
            </div>
            
            <div className="p-5 bg-card border border-border rounded-xl min-h-[300px] flex flex-col">
              <h3 className="text-sm font-semibold text-foreground mb-1">Deal Funnel</h3>
              <p className="text-xs text-muted-foreground mb-6">Current active pipeline</p>
              <div className="flex flex-col gap-3 flex-1 justify-center">
                 {/* Funnel Rows */}
                 {[
                   {stage: "Sourcing", val: 145, w: "100%", c: "bg-zinc-800"},
                   {stage: "Screening", val: 56, w: "80%", c: "bg-zinc-700"},
                   {stage: "Due Diligence", val: 12, w: "60%", c: "bg-blue-900/50"},
                   {stage: "Term Sheet", val: 4, w: "40%", c: "bg-blue-700/50"},
                   {stage: "Closed", val: 2, w: "25%", c: "bg-blue-500"}
                 ].map((row, i) => (
                   <div key={i} className="flex items-center gap-4 text-xs font-medium">
                     <span className="w-24 text-muted-foreground">{row.stage}</span>
                     <div className="flex-1 h-6 bg-zinc-900 rounded-sm overflow-hidden">
                       <div className={`h-full ${row.c} rounded-sm flex items-center px-2`} style={{width: row.w}}>
                         <span className="text-[10px] text-white mix-blend-difference">{row.val}</span>
                       </div>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>

          {/* Sector Heatmap & Recent Reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Heatmap */}
             <div className="p-5 bg-card border border-border rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-foreground">Sector Heatmap</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {name: "AI/ML", v: "bg-emerald-500/80"}, {name: "Fintech", v: "bg-emerald-500/40"}, {name: "SaaS", v: "bg-zinc-800"},
                  {name: "Health", v: "bg-rose-500/40"}, {name: "Crypto", v: "bg-rose-500/80"}, {name: "Deeptech", v: "bg-emerald-500/60"}
                ].map((sec, i) => (
                  <div key={i} className={`${sec.v} h-16 rounded-md flex items-center justify-center text-xs font-semibold shadow-inner`}>
                    {sec.name}
                  </div>
                ))}
              </div>
             </div>

             {/* Recent Reports */}
             <div className="p-5 bg-card border border-border rounded-xl flex flex-col">
              <h3 className="text-sm font-semibold text-foreground mb-4">Recent Memos</h3>
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                {["Acme Series A Memo", "FinSync Tech DD", "HealthAI Market Analysis"].map((report, i) => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-zinc-900 rounded-md cursor-pointer transition-colors border border-transparent hover:border-border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-md text-blue-400"><FileText className="h-4 w-4"/></div>
                      <span className="text-sm text-foreground">{report}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">Today</span>
                  </div>
                ))}
              </div>
             </div>
          </div>

        </div>

        {/* Right Column (AI, Tasks, Calendar, Activity) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          
          {/* AI Diligence Assistant (Glassmorphism) */}
          <div className="p-1 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/10 h-auto">
            <div className="bg-card/80 backdrop-blur-md p-5 rounded-lg border border-white/5 h-full flex flex-col relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <Brain className="h-5 w-5 text-purple-400" />
                <h3 className="text-sm font-semibold font-geist text-purple-50">VentureLens AI</h3>
              </div>
              <div className="flex flex-col gap-3 relative z-10">
                <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                  <p className="text-xs text-zinc-300">New risk identified in <strong>Acme Corp</strong> data room. The ARR churn increased by 4% in Q3.</p>
                  <button className="text-[10px] text-purple-400 font-semibold mt-2 hover:underline uppercase tracking-wider">Review Findings →</button>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar & Tasks */}
          <div className="p-5 bg-card border border-border rounded-xl flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-zinc-500" /> Schedule & Tasks
              </h3>
            </div>
            
            <div className="space-y-4 flex-1">
              <div className="flex gap-3">
                <div className="flex flex-col items-center min-w-10">
                  <span className="text-xs font-bold text-foreground">10:00</span>
                  <span className="text-[10px] text-muted-foreground">AM</span>
                </div>
                <div className="flex-1 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm border-l-2 border-l-blue-500">
                  <p className="font-semibold text-blue-50">Partner Meeting</p>
                  <p className="text-xs text-blue-400 mt-1">Review Acme Term Sheet</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex flex-col items-center min-w-10">
                  <span className="text-xs font-bold text-foreground">1:30</span>
                  <span className="text-[10px] text-muted-foreground">PM</span>
                </div>
                <div className="flex-1 p-3 bg-zinc-900 border border-border rounded-lg text-sm border-l-2 border-l-zinc-700">
                  <p className="font-semibold">Founder Call</p>
                  <p className="text-xs text-muted-foreground mt-1">FinSync initial screen</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-5 bg-card border border-border rounded-xl h-64 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-zinc-500" /> Activity Log
              </h3>
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto">
              <div className="flex gap-3 items-start relative before:absolute before:left-3 before:top-6 before:bottom-[-16px] before:w-[1px] before:bg-border">
                <div className="h-6 w-6 rounded-full bg-zinc-800 border-2 border-card flex items-center justify-center shrink-0 z-10 text-[9px] font-bold text-zinc-400">JD</div>
                <div>
                  <p className="text-xs text-foreground"><span className="font-medium text-blue-400">Jane</span> moved Acme to <strong>Term Sheet</strong></p>
                  <p className="text-[10px] text-muted-foreground mt-1">10 mins ago</p>
                </div>
              </div>
              <div className="flex gap-3 items-start relative before:absolute before:left-3 before:top-6 before:bottom-[-16px] before:w-[1px] before:bg-border">
                <div className="h-6 w-6 rounded-full bg-zinc-800 border-2 border-card flex items-center justify-center shrink-0 z-10 text-[9px] font-bold text-zinc-400">AI</div>
                <div>
                  <p className="text-xs text-foreground"><span className="font-medium text-purple-400">Agent</span> completed tech diligence</p>
                  <p className="text-[10px] text-muted-foreground mt-1">1 hour ago</p>
                </div>
              </div>
              <div className="flex gap-3 items-start relative">
                <div className="h-6 w-6 rounded-full bg-zinc-800 border-2 border-card flex items-center justify-center shrink-0 z-10 text-[9px] font-bold text-zinc-400">MK</div>
                <div>
                  <p className="text-xs text-foreground"><span className="font-medium text-emerald-400">Mike</span> uploaded Q3 Financials</p>
                  <p className="text-[10px] text-muted-foreground mt-1">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
