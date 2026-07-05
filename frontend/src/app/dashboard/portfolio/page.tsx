"use client";

import { 
  Briefcase, TrendingUp, TrendingDown, MapPin, 
  Layers, BarChart2, PieChart, Activity, Building2,
  Brain, Crosshair, Filter, Download
} from "lucide-react";

export default function PortfolioModule() {
  return (
    <div className="flex flex-col h-full w-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-geist font-bold flex items-center gap-2">
              <Briefcase className="h-6 w-6"/> Fund I Portfolio
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">Performance and composition analysis.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-foreground rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors">
            <Filter className="h-4 w-4" /> Filters
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90">
            <Download className="h-4 w-4" /> Export LP Report
          </button>
        </div>
      </div>

      {/* Core Fund KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "AUM", val: "$150M", change: "+12%", trend: "up" },
          { label: "Net IRR", val: "24.8%", change: "+2.1%", trend: "up" },
          { label: "MOIC", val: "2.4x", change: "+0.3x", trend: "up" },
          { label: "TVPI", val: "2.1x", change: "-", trend: "neutral" },
          { label: "DPI", val: "0.8x", change: "+0.2x", trend: "up" },
        ].map((kpi, i) => (
          <div key={i} className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{kpi.label}</span>
            <div className="text-2xl font-bold font-geist">{kpi.val}</div>
            <div className={`text-[10px] font-medium mt-1 flex items-center gap-1 ${
              kpi.trend === 'up' ? 'text-emerald-500' : kpi.trend === 'down' ? 'text-rose-500' : 'text-zinc-500'
            }`}>
              {kpi.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : kpi.trend === 'down' ? <TrendingDown className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Col: Composition, Heatmap, Chart */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          
          {/* Sector & Geo Composition */}
          <div className="bg-card border border-border p-5 rounded-xl">
             <h3 className="font-semibold mb-4 flex items-center gap-2"><PieChart className="h-4 w-4" /> Allocation</h3>
             <div className="space-y-6">
               
               <div>
                 <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1"><Layers className="h-3 w-3"/> By Sector</h4>
                 <div className="space-y-2">
                   <div>
                     <div className="flex justify-between text-xs mb-1">
                       <span className="text-zinc-300">Fintech</span>
                       <span className="font-mono text-zinc-400">45%</span>
                     </div>
                     <div className="w-full h-2 bg-zinc-900 rounded-full"><div className="h-full bg-blue-500 w-[45%] rounded-full"></div></div>
                   </div>
                   <div>
                     <div className="flex justify-between text-xs mb-1">
                       <span className="text-zinc-300">AI / ML</span>
                       <span className="font-mono text-zinc-400">30%</span>
                     </div>
                     <div className="w-full h-2 bg-zinc-900 rounded-full"><div className="h-full bg-purple-500 w-[30%] rounded-full"></div></div>
                   </div>
                   <div>
                     <div className="flex justify-between text-xs mb-1">
                       <span className="text-zinc-300">Enterprise SaaS</span>
                       <span className="font-mono text-zinc-400">25%</span>
                     </div>
                     <div className="w-full h-2 bg-zinc-900 rounded-full"><div className="h-full bg-emerald-500 w-[25%] rounded-full"></div></div>
                   </div>
                 </div>
               </div>

               <div>
                 <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1"><MapPin className="h-3 w-3"/> By Geography</h4>
                 <div className="space-y-2">
                   <div>
                     <div className="flex justify-between text-xs mb-1">
                       <span className="text-zinc-300">North America</span>
                       <span className="font-mono text-zinc-400">70%</span>
                     </div>
                     <div className="w-full h-2 bg-zinc-900 rounded-full"><div className="h-full bg-blue-500 w-[70%] rounded-full"></div></div>
                   </div>
                   <div>
                     <div className="flex justify-between text-xs mb-1">
                       <span className="text-zinc-300">EMEA</span>
                       <span className="font-mono text-zinc-400">30%</span>
                     </div>
                     <div className="w-full h-2 bg-zinc-900 rounded-full"><div className="h-full bg-purple-500 w-[30%] rounded-full"></div></div>
                   </div>
                 </div>
               </div>

             </div>
          </div>

          {/* Risk vs Return Heatmap */}
          <div className="bg-card border border-border p-5 rounded-xl flex-1 flex flex-col">
             <h3 className="font-semibold mb-4 flex items-center gap-2"><Crosshair className="h-4 w-4" /> Portfolio Heatmap</h3>
             <div className="flex-1 border-l border-b border-zinc-800 relative min-h-[200px] flex items-center justify-center p-4">
               {/* Grid Fake */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_90%,#27272a_10%),linear-gradient(to_bottom,transparent_90%,#27272a_10%)] bg-[length:25%_25%] opacity-30"></div>
               
               {/* Data Points */}
               <div className="absolute left-[80%] bottom-[75%] h-6 w-6 rounded-full bg-emerald-500 border-2 border-card flex items-center justify-center group cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                 <span className="text-[10px] font-bold text-white">Ac</span>
                 <div className="absolute -top-8 bg-zinc-900 text-xs px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-10 border border-zinc-800">Acme Corp (High Return, Low Risk)</div>
               </div>
               
               <div className="absolute left-[60%] bottom-[40%] h-5 w-5 rounded-full bg-blue-500 border-2 border-card flex items-center justify-center group cursor-pointer">
                 <span className="text-[8px] font-bold text-white">Fs</span>
                 <div className="absolute -top-8 bg-zinc-900 text-xs px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-10 border border-zinc-800">FinSync</div>
               </div>

               <div className="absolute left-[30%] bottom-[20%] h-4 w-4 rounded-full bg-rose-500 border-2 border-card flex items-center justify-center group cursor-pointer">
                 <span className="text-[6px] font-bold text-white">Pd</span>
                 <div className="absolute -top-8 bg-zinc-900 text-xs px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-10 border border-zinc-800">PayData (High Risk, Low Return)</div>
               </div>

               {/* Axis Labels */}
               <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground">Expected Return (MOIC) &rarr;</span>
               <span className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-muted-foreground whitespace-nowrap">&uarr; Execution Risk</span>
             </div>
          </div>

        </div>

        {/* Right Col: Companies Table, Forecast, AI Insights */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          
          {/* Companies List */}
          <div className="bg-card border border-border p-5 rounded-xl overflow-x-auto">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Building2 className="h-4 w-4" /> Active Investments</h3>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase border-b border-border">
                <tr>
                  <th className="py-3 font-medium">Company</th>
                  <th className="py-3 font-medium">Sector</th>
                  <th className="py-3 font-medium text-right">Invested</th>
                  <th className="py-3 font-medium text-right">MOIC</th>
                  <th className="py-3 font-medium text-right">IRR</th>
                  <th className="py-3 font-medium text-right">Exit Prob.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="bg-blue-500/5 hover:bg-blue-500/10 transition-colors cursor-pointer">
                  <td className="py-3 font-semibold text-blue-400">Acme Corp</td>
                  <td className="py-3 text-zinc-400 text-xs">Fintech</td>
                  <td className="py-3 text-right font-mono">$5.0M</td>
                  <td className="py-3 text-right text-emerald-400 font-medium">4.2x</td>
                  <td className="py-3 text-right font-mono">45%</td>
                  <td className="py-3 text-right flex justify-end"><div className="bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded text-[10px] font-bold">85%</div></td>
                </tr>
                <tr className="hover:bg-zinc-900/50 transition-colors cursor-pointer">
                  <td className="py-3 font-medium">FinSync</td>
                  <td className="py-3 text-zinc-400 text-xs">Enterprise</td>
                  <td className="py-3 text-right font-mono">$12.0M</td>
                  <td className="py-3 text-right font-medium text-zinc-300">2.1x</td>
                  <td className="py-3 text-right font-mono">18%</td>
                  <td className="py-3 text-right flex justify-end"><div className="bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded text-[10px] font-bold">50%</div></td>
                </tr>
                <tr className="hover:bg-zinc-900/50 transition-colors cursor-pointer">
                  <td className="py-3 font-medium">PayData</td>
                  <td className="py-3 text-zinc-400 text-xs">AI / ML</td>
                  <td className="py-3 text-right font-mono">$3.5M</td>
                  <td className="py-3 text-right font-medium text-rose-400">0.8x</td>
                  <td className="py-3 text-right font-mono text-rose-400">-12%</td>
                  <td className="py-3 text-right flex justify-end"><div className="bg-rose-500/20 text-rose-500 px-2 py-0.5 rounded text-[10px] font-bold">15%</div></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Exit Forecast Chart */}
            <div className="bg-card border border-border p-5 rounded-xl flex flex-col">
               <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart2 className="h-4 w-4" /> Liquidity Forecast</h3>
               <div className="flex-1 flex items-end justify-between px-4 pb-2 pt-8 border-b border-l border-zinc-800 relative">
                 {[
                   { label: "Q1", h: 20 },
                   { label: "Q2", h: 45 },
                   { label: "Q3", h: 30 },
                   { label: "Q4", h: 85 },
                 ].map((bar, i) => (
                   <div key={i} className="flex flex-col items-center gap-2 w-12 group">
                     <div className="w-full bg-blue-500/80 hover:bg-blue-400 rounded-t-sm transition-colors relative" style={{height: `${bar.h}%`}}>
                       <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 border border-zinc-800 px-1 rounded">${bar.h}M</span>
                     </div>
                     <span className="absolute -bottom-6 text-[10px] text-muted-foreground">{bar.label}</span>
                   </div>
                 ))}
               </div>
            </div>

            {/* AI Portfolio Insights */}
            <div className="bg-gradient-to-b from-purple-900/20 to-transparent border border-purple-500/20 rounded-xl p-5 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <Brain className="h-5 w-5 text-purple-400" />
                <h3 className="font-semibold text-purple-50">AI Portfolio Insights</h3>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="text-sm bg-black/40 p-3 rounded-lg border border-white/5">
                  <p className="text-emerald-400 text-xs font-semibold mb-1">Exit Anticipated</p>
                  <p className="text-zinc-300 text-xs">Acme Corp is tracking toward a Q4 liquidity event. Predictive models indicate an 85% probability of M&A acquisition in the $150M-$200M range based on recent sector consolidation.</p>
                </div>
                <div className="text-sm bg-black/40 p-3 rounded-lg border border-white/5">
                  <p className="text-rose-400 text-xs font-semibold mb-1">Mark-down Risk</p>
                  <p className="text-zinc-300 text-xs">PayData&apos;s burn multiple has exceeded 3.5x. AI advises a 20% mark-down for Q3 reporting if bridge funding is not secured by month end.</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Brain className="h-32 w-32" /></div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
