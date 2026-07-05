"use client";

import { TrendingUp, TrendingDown, BarChart3, RefreshCw, Brain, Target, FileSpreadsheet, Download } from "lucide-react";

export default function FinancialAnalysisModule() {
  return (
    <div className="flex flex-col h-full w-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-geist font-semibold">Acme Corp • Financial Analysis</h1>
          </div>
          <p className="text-sm text-muted-foreground">Advanced modeling and scenario planning.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md text-xs font-medium hover:opacity-90">
            <FileSpreadsheet className="h-3 w-3" /> Sync ERP
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:opacity-90">
            <Download className="h-3 w-3" /> Export Model
          </button>
        </div>
      </div>

      {/* Core KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: "ARR", val: "$2.5M", change: "+12%", trend: "up" },
          { label: "MRR", val: "$208K", change: "+1.2%", trend: "up" },
          { label: "CAC", val: "$9.5K", change: "-15%", trend: "up" },
          { label: "LTV", val: "$42K", change: "+5%", trend: "up" },
          { label: "Burn", val: "$450K/mo", change: "+4%", trend: "down" },
          { label: "Runway", val: "11 mo", change: "-1 mo", trend: "down" },
        ].map((kpi, i) => (
          <div key={i} className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{kpi.label}</span>
            <div className="text-xl font-bold font-geist">{kpi.val}</div>
            <div className={`text-[10px] font-medium mt-1 flex items-center gap-1 ${
              (kpi.trend === 'up' && kpi.label !== 'CAC' && kpi.label !== 'Burn') || 
              (kpi.trend === 'down' && (kpi.label === 'CAC' || kpi.label === 'Burn'))
                ? 'text-emerald-500' 
                : 'text-rose-500'
            }`}>
              {kpi.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left Col: Charts (Cash Flow & Forecast) */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          
          {/* Cash Flow & Forecast Chart Area */}
          <div className="bg-card border border-border rounded-xl p-5 flex-1 min-h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Cash Flow & Revenue Forecast</h3>
              <select className="bg-zinc-900 border border-zinc-800 rounded-md text-xs px-2 py-1 focus:outline-none">
                <option>24 Months</option>
                <option>36 Months</option>
              </select>
            </div>
            <div className="flex-1 border-b border-l border-zinc-800 relative flex items-end justify-between px-4 pb-2 pt-10">
              {/* Fake Chart Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_90%,#27272a_10%)] bg-[length:10%_100%] opacity-20"></div>
              {[30, 45, 40, 60, 75, 70, 90].map((h, i) => (
                <div key={i} className="w-8 flex gap-1 items-end h-full relative z-10">
                  <div className="w-full bg-rose-500/50 rounded-t-sm" style={{height: `${h/2}%`}}></div>
                  <div className="w-full bg-emerald-500 rounded-t-sm" style={{height: `${h}%`}}></div>
                </div>
              ))}
              {/* Trend line SVG fake */}
              <svg className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none">
                 <path d="M 0,200 Q 100,180 200,100 T 400,50" fill="none" stroke="#3b82f6" strokeWidth="2" className="drop-shadow-lg" />
              </svg>
            </div>
            <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500"></div> Revenue</span>
              <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-rose-500/50"></div> Expenses</span>
              <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-blue-500"></div> Cash Balance (Proj)</span>
            </div>
          </div>

          {/* Monte Carlo & Scenarios */}
          <div className="bg-card border border-border rounded-xl p-5">
             <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center gap-2"><RefreshCw className="h-4 w-4" /> Monte Carlo Simulation</h3>
              <button className="text-xs bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg hover:bg-zinc-800">Run 10,000 Iterations</button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <p className="text-xs text-muted-foreground mb-1">Base Case (P50)</p>
                <p className="font-semibold text-foreground">Runway: 11 mo</p>
                <p className="text-[10px] text-zinc-500 mt-1">Requires $5M bridge by Q3</p>
              </div>
              <div className="p-3 bg-rose-900/10 rounded-lg border border-rose-500/20">
                <p className="text-xs text-rose-400 mb-1">Downside (P10)</p>
                <p className="font-semibold text-rose-50">Runway: 6 mo</p>
                <p className="text-[10px] text-rose-400/70 mt-1">Assuming 15% churn increase</p>
              </div>
              <div className="p-3 bg-emerald-900/10 rounded-lg border border-emerald-500/20">
                <p className="text-xs text-emerald-400 mb-1">Upside (P90)</p>
                <p className="font-semibold text-emerald-50">Runway: 16 mo</p>
                <p className="text-[10px] text-emerald-400/70 mt-1">Assuming +2 enterprise logos</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: AI & Benchmarks */}
        <div className="space-y-6">
          
          {/* AI Recommendations */}
          <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <Brain className="h-5 w-5 text-purple-400" />
              <h3 className="font-semibold text-purple-50">AI Strategic Insights</h3>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="text-sm bg-black/40 p-3 rounded-lg border border-white/5">
                <p className="text-zinc-300"><strong className="text-purple-400">Burn Optimization:</strong> LTV/CAC ratio of 4.4x is exceptional, indicating room to increase marketing spend. Suggest reallocating $50k/mo from R&D to Sales.</p>
              </div>
              <div className="text-sm bg-black/40 p-3 rounded-lg border border-white/5">
                <p className="text-zinc-300"><strong className="text-amber-400">Capital Risk:</strong> Current burn ($450k) puts Q3 cash position below minimum operational threshold ($1M). Bridge round required within 90 days.</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Brain className="h-32 w-32" /></div>
          </div>

          {/* Industry Benchmarks */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold flex items-center gap-2 mb-4"><Target className="h-4 w-4" /> B2B SaaS Benchmarks</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Gross Margin</span>
                  <span className="font-medium text-emerald-400">72% (Top Quartile)</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 rounded-full">
                  <div className="h-full bg-emerald-500 w-[72%] rounded-full relative">
                    <div className="absolute right-0 -top-1 w-1 h-3.5 bg-white rounded-full shadow-lg"></div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">NDR</span>
                  <span className="font-medium text-amber-400">115% (Median)</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 rounded-full">
                  <div className="h-full bg-amber-500 w-[60%] rounded-full relative">
                    <div className="absolute right-0 -top-1 w-1 h-3.5 bg-white rounded-full shadow-lg"></div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Rule of 40</span>
                  <span className="font-medium text-emerald-400">45 (Top Quartile)</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 rounded-full">
                  <div className="h-full bg-emerald-500 w-[80%] rounded-full relative">
                    <div className="absolute right-0 -top-1 w-1 h-3.5 bg-white rounded-full shadow-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
