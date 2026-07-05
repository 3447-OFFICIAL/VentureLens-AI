"use client";

import { Globe2, Target, Crosshair, TrendingUp, Brain, Swords, Activity, ArrowUpRight, ArrowDownRight, AlertTriangle } from "lucide-react";

export default function MarketAnalysisModule() {
  return (
    <div className="flex flex-col h-full w-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border border-border p-5 rounded-xl">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-geist font-bold flex items-center gap-2"><Globe2 className="h-6 w-6"/> Market & Competitive Landscape</h1>
          </div>
          <p className="text-sm text-muted-foreground">B2B Fintech Infrastructure (North America focus)</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
             <div className="text-sm font-semibold text-emerald-400">High Growth Market</div>
             <div className="text-xs text-muted-foreground">18.4% Industry CAGR</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Col (Market Size, Competitors, Porter&apos;s Five Forces) */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          
          {/* Market Sizing (TAM/SAM/SOM) */}
          <div className="bg-card border border-border p-5 rounded-xl">
            <h3 className="font-semibold mb-6 flex items-center gap-2"><Target className="h-4 w-4" /> Market Sizing</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl flex flex-col items-center text-center relative overflow-hidden">
                <Globe2 className="h-16 w-16 text-blue-500/10 absolute -right-4 -bottom-4" />
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">TAM</span>
                <span className="text-3xl font-bold font-geist text-blue-50">$84B</span>
                <span className="text-[10px] text-muted-foreground mt-2 z-10">Global B2B Fintech</span>
              </div>
              <div className="bg-emerald-900/10 border border-emerald-500/20 p-4 rounded-xl flex flex-col items-center text-center relative overflow-hidden">
                <Target className="h-16 w-16 text-emerald-500/10 absolute -right-4 -bottom-4" />
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">SAM</span>
                <span className="text-3xl font-bold font-geist text-emerald-50">$12B</span>
                <span className="text-[10px] text-muted-foreground mt-2 z-10">US Predictive Lending</span>
              </div>
              <div className="bg-amber-900/10 border border-amber-500/20 p-4 rounded-xl flex flex-col items-center text-center relative overflow-hidden">
                <Crosshair className="h-16 w-16 text-amber-500/10 absolute -right-4 -bottom-4" />
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">SOM</span>
                <span className="text-3xl font-bold font-geist text-amber-50">$450M</span>
                <span className="text-[10px] text-muted-foreground mt-2 z-10">Captureable in 5 yrs</span>
              </div>
            </div>
          </div>

          {/* Competitor Landscape */}
          <div className="bg-card border border-border p-5 rounded-xl overflow-x-auto">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Swords className="h-4 w-4" /> Competitive Matrix</h3>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase border-b border-border">
                <tr>
                  <th className="py-3 font-medium">Company</th>
                  <th className="py-3 font-medium text-right">Funding</th>
                  <th className="py-3 font-medium text-right">Pricing (SaaS)</th>
                  <th className="py-3 font-medium text-right">Growth Rate</th>
                  <th className="py-3 font-medium text-right">Threat Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="bg-blue-500/5">
                  <td className="py-3 font-semibold text-blue-400">Acme Corp (Target)</td>
                  <td className="py-3 text-right font-mono">$12.5M</td>
                  <td className="py-3 text-right">$4,500/mo</td>
                  <td className="py-3 text-right text-emerald-400 font-medium">183% YoY</td>
                  <td className="py-3 text-right">-</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium">FinSync (Incumbent)</td>
                  <td className="py-3 text-right font-mono">$450M</td>
                  <td className="py-3 text-right">$12,000/mo</td>
                  <td className="py-3 text-right text-muted-foreground">15% YoY</td>
                  <td className="py-3 text-right flex justify-end"><div className="bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded text-[10px] font-bold">Medium</div></td>
                </tr>
                <tr>
                  <td className="py-3 font-medium">LendAI (Startup)</td>
                  <td className="py-3 text-right font-mono">$24M</td>
                  <td className="py-3 text-right">$2,000/mo</td>
                  <td className="py-3 text-right text-emerald-400">240% YoY</td>
                  <td className="py-3 text-right flex justify-end"><div className="bg-rose-500/20 text-rose-500 px-2 py-0.5 rounded text-[10px] font-bold">High</div></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Porter&apos;s Five Forces */}
          <div className="bg-card border border-border p-5 rounded-xl">
             <h3 className="font-semibold mb-4">Porter&apos;s Five Forces</h3>
             <div className="grid grid-cols-5 gap-2 text-center text-xs">
               <div className="bg-zinc-900/50 p-3 rounded-lg border border-border">
                 <p className="font-semibold mb-2">Rivalry</p>
                 <span className="bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded font-bold">Medium</span>
               </div>
               <div className="bg-zinc-900/50 p-3 rounded-lg border border-border">
                 <p className="font-semibold mb-2">New Entrants</p>
                 <span className="bg-rose-500/20 text-rose-500 px-2 py-0.5 rounded font-bold">High</span>
               </div>
               <div className="bg-zinc-900/50 p-3 rounded-lg border border-border">
                 <p className="font-semibold mb-2">Suppliers</p>
                 <span className="bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded font-bold">Low</span>
               </div>
               <div className="bg-zinc-900/50 p-3 rounded-lg border border-border">
                 <p className="font-semibold mb-2">Buyers</p>
                 <span className="bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded font-bold">Medium</span>
               </div>
               <div className="bg-zinc-900/50 p-3 rounded-lg border border-border">
                 <p className="font-semibold mb-2">Substitutes</p>
                 <span className="bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded font-bold">Low</span>
               </div>
             </div>
          </div>

        </div>

        {/* Right Col: SWOT, AI Recommendation, Trends */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Market Recommendation */}
          <div className="bg-gradient-to-b from-purple-900/20 to-transparent border border-purple-500/20 rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <Brain className="h-5 w-5 text-purple-400" />
              <h3 className="font-semibold text-purple-50">AI Strategic Insights</h3>
            </div>
            <div className="space-y-3 relative z-10 text-sm">
              <p className="text-zinc-300 leading-relaxed">
                The market is rapidly shifting towards embedded predictive models. Acme Corp holds a pricing advantage against incumbents like FinSync, but faces aggressive pricing pressure from LendAI.
              </p>
              <div className="p-3 bg-black/40 rounded border border-white/5 mt-2">
                <span className="font-semibold text-emerald-400 flex items-center gap-2"><ArrowUpRight className="h-4 w-4"/> Key Opportunity</span>
                <p className="text-xs text-zinc-400 mt-1">Cross-selling data infrastructure to Tier-2 banks currently ignored by FinSync.</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Brain className="h-32 w-32" /></div>
          </div>

          {/* SWOT Analysis */}
          <div className="bg-card border border-border p-5 rounded-xl">
             <h3 className="font-semibold mb-4">SWOT Matrix</h3>
             <div className="grid grid-cols-2 gap-3">
               <div className="bg-emerald-900/10 border border-emerald-500/20 p-3 rounded-lg">
                 <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1"><ArrowUpRight className="h-3 w-3"/> Strengths</p>
                 <ul className="text-xs text-muted-foreground list-disc pl-3 space-y-1">
                   <li>Proprietary ML models</li>
                   <li>High NDR (115%)</li>
                 </ul>
               </div>
               <div className="bg-rose-900/10 border border-rose-500/20 p-3 rounded-lg">
                 <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1"><ArrowDownRight className="h-3 w-3"/> Weaknesses</p>
                 <ul className="text-xs text-muted-foreground list-disc pl-3 space-y-1">
                   <li>High customer concentration</li>
                   <li>Small enterprise sales team</li>
                 </ul>
               </div>
               <div className="bg-blue-900/10 border border-blue-500/20 p-3 rounded-lg">
                 <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1"><TrendingUp className="h-3 w-3"/> Opportunities</p>
                 <ul className="text-xs text-muted-foreground list-disc pl-3 space-y-1">
                   <li>Expansion into EMEA</li>
                   <li>New API product line</li>
                 </ul>
               </div>
               <div className="bg-amber-900/10 border border-amber-500/20 p-3 rounded-lg">
                 <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1"><AlertTriangle className="h-3 w-3"/> Threats</p>
                 <ul className="text-xs text-muted-foreground list-disc pl-3 space-y-1">
                   <li>Incumbent price matching</li>
                   <li>Regulatory changes (GDPR)</li>
                 </ul>
               </div>
             </div>
          </div>

          {/* Market Trends */}
          <div className="bg-card border border-border p-5 rounded-xl">
             <h3 className="font-semibold mb-4 flex items-center gap-2"><Activity className="h-4 w-4" /> Market Trends</h3>
             <div className="space-y-3">
               <div className="flex items-start justify-between bg-zinc-900/50 p-2 rounded">
                 <span className="text-sm">Embedded Finance</span>
                 <span className="flex items-center text-xs text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded"><ArrowUpRight className="h-3 w-3 mr-1"/> High</span>
               </div>
               <div className="flex items-start justify-between bg-zinc-900/50 p-2 rounded">
                 <span className="text-sm">Open Banking APIs</span>
                 <span className="flex items-center text-xs text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded"><ArrowUpRight className="h-3 w-3 mr-1"/> High</span>
               </div>
               <div className="flex items-start justify-between bg-zinc-900/50 p-2 rounded">
                 <span className="text-sm">On-prem Deployments</span>
                 <span className="flex items-center text-xs text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded"><ArrowDownRight className="h-3 w-3 mr-1"/> Declining</span>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
