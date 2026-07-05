"use client";

import { GraduationCap, Briefcase, Award, MessageSquare, Brain, AlertTriangle, Network, TrendingUp, History, UserCheck, Activity, Globe, AlertCircle, CheckCircle2 } from "lucide-react";

export default function FounderAnalysisModule() {
  return (
    <div className="flex flex-col h-full w-full space-y-6">
      
      {/* Header & Founder Selection */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border border-border p-6 rounded-xl relative overflow-hidden">
        <div className="flex gap-6 items-center w-full z-10">
          <div className="h-20 w-20 rounded-full bg-blue-900/50 border-2 border-blue-500/50 flex items-center justify-center shrink-0">
             <span className="text-2xl font-bold text-blue-400">ES</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-geist font-bold">Elena Smith</h1>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-md border border-emerald-500/20">Serial Founder</span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              CEO & Co-founder <span className="mx-1">•</span> <Globe className="h-3 w-3" /> San Francisco, CA
            </p>
          </div>
          <div className="flex flex-col gap-2">
             <select className="bg-zinc-900 border border-zinc-800 rounded-md text-sm px-3 py-1.5 focus:outline-none focus:border-blue-500">
                <option>Elena Smith (CEO)</option>
                <option>Marcus Doe (CTO)</option>
             </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Col (Experience, Timeline, Network) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2"><Briefcase className="h-3 w-3"/> Yrs Exp</span>
               <div className="text-2xl font-bold font-geist">14</div>
            </div>
            <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2"><Award className="h-3 w-3"/> Exits</span>
               <div className="text-2xl font-bold font-geist">1</div>
            </div>
            <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2"><UserCheck className="h-3 w-3"/> Direct Hires</span>
               <div className="text-2xl font-bold font-geist">45+</div>
            </div>
            <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between">
               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2"><TrendingUp className="h-3 w-3"/> Raised</span>
               <div className="text-2xl font-bold font-geist">$32M</div>
            </div>
          </div>

          {/* Background & Timeline */}
          <div className="bg-card border border-border p-5 rounded-xl">
            <h3 className="font-semibold flex items-center gap-2 mb-6"><History className="h-4 w-4" /> Career Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-zinc-800 ml-2">
              
              <div className="flex gap-6 relative">
                <div className="h-6 w-6 rounded-full bg-blue-500 border-4 border-card absolute -left-2 top-0 flex items-center justify-center shrink-0"></div>
                <div className="pl-4 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-foreground">CEO & Co-founder</h4>
                      <p className="text-sm text-blue-400">Acme Corp</p>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">2023 - Present</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Built predictive AI lending infrastructure. Scaled to $2.5M ARR in 24 months.</p>
                </div>
              </div>

              <div className="flex gap-6 relative">
                <div className="h-6 w-6 rounded-full bg-emerald-500 border-4 border-card absolute -left-2 top-0 flex items-center justify-center shrink-0"></div>
                <div className="pl-4 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-foreground">VP of Product</h4>
                      <p className="text-sm text-zinc-400">Stripe</p>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">2018 - 2022</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Led the Stripe Capital product team from 0 to 1.</p>
                </div>
              </div>

              <div className="flex gap-6 relative">
                <div className="h-6 w-6 rounded-full bg-zinc-700 border-4 border-card absolute -left-2 top-0 flex items-center justify-center shrink-0"></div>
                <div className="pl-4 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-foreground">Founder</h4>
                      <p className="text-sm text-zinc-400">PayData</p>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">2014 - 2018</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">Acquired by Square</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 relative">
                <div className="h-6 w-6 rounded-full bg-zinc-800 border-4 border-card absolute -left-2 top-0 flex items-center justify-center shrink-0"></div>
                <div className="pl-4 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-foreground">B.S. Computer Science</h4>
                      <p className="text-sm text-zinc-400 flex items-center gap-2"><GraduationCap className="h-3 w-3"/> Stanford University</p>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">2010 - 2014</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Network & Talent Magnetism */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border p-5 rounded-xl">
               <h3 className="font-semibold flex items-center gap-2 mb-4"><Network className="h-4 w-4" /> Talent Magnetism</h3>
               <div className="space-y-4">
                 <div>
                   <div className="flex justify-between text-xs mb-1">
                     <span className="text-muted-foreground">Ex-Colleague Hires</span>
                     <span className="font-medium text-emerald-400">12 (Strong)</span>
                   </div>
                   <div className="w-full h-1.5 bg-zinc-900 rounded-full"><div className="h-full bg-emerald-500 w-[75%] rounded-full"></div></div>
                 </div>
                 <div>
                   <div className="flex justify-between text-xs mb-1">
                     <span className="text-muted-foreground">Executive Retention</span>
                     <span className="font-medium text-emerald-400">92%</span>
                   </div>
                   <div className="w-full h-1.5 bg-zinc-900 rounded-full"><div className="h-full bg-emerald-500 w-[92%] rounded-full"></div></div>
                 </div>
                 <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">Elena has successfully recruited 4 senior engineers from Stripe and Square to join Acme Corp.</p>
               </div>
            </div>

            <div className="bg-card border border-border p-5 rounded-xl">
               <h3 className="font-semibold flex items-center gap-2 mb-4"><Activity className="h-4 w-4" /> Public Reputation</h3>
               <div className="flex flex-col gap-3">
                 <div className="flex items-center gap-3 p-2 bg-zinc-900/50 rounded-lg">
                   <MessageSquare className="h-4 w-4 text-blue-400 shrink-0"/>
                   <div>
                     <p className="text-xs font-medium text-foreground">Thought Leader</p>
                     <p className="text-[10px] text-muted-foreground">Active fintech discussions, highly regarded.</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3 p-2 bg-zinc-900/50 rounded-lg">
                   <Briefcase className="h-4 w-4 text-blue-600 shrink-0"/>
                   <div>
                     <p className="text-xs font-medium text-foreground">Extensive Network</p>
                     <p className="text-[10px] text-muted-foreground">Connected to 15+ top-tier VC partners.</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>

        </div>

        {/* Right Col: AI Summary, Leadership, Risk */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* AI Diligence Summary */}
          <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <Brain className="h-5 w-5 text-purple-400" />
              <h3 className="font-semibold text-purple-50">AI Founder Assessment</h3>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="text-sm bg-black/40 p-4 rounded-lg border border-white/5 leading-relaxed text-zinc-300">
                Elena demonstrates exceptional product-market intuition, validated by her prior exit (PayData) and scale at Stripe. She indexes high on execution and talent magnetism, drawing heavily from a top-tier network.
                <br/><br/>
                <strong className="text-purple-400">Key Strength:</strong> Go-to-market speed and enterprise sales navigation.
              </div>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Brain className="h-32 w-32" /></div>
          </div>

          {/* Leadership Profile */}
          <div className="bg-card border border-border p-5 rounded-xl">
             <h3 className="font-semibold mb-4">Leadership Radar</h3>
             <div className="flex items-center justify-center p-4">
               {/* CSS Radar Chart Placeholder */}
               <div className="relative w-48 h-48 rounded-full border border-zinc-800 flex items-center justify-center">
                 <div className="absolute w-32 h-32 rounded-full border border-zinc-800"></div>
                 <div className="absolute w-16 h-16 rounded-full border border-zinc-800"></div>
                 
                 {/* Crosshairs */}
                 <div className="absolute w-full h-px bg-zinc-800"></div>
                 <div className="absolute h-full w-px bg-zinc-800"></div>
                 <div className="absolute w-full h-px bg-zinc-800 rotate-45"></div>
                 <div className="absolute h-full w-px bg-zinc-800 rotate-45"></div>
                 
                 {/* Data Polygon fake */}
                 <svg className="absolute inset-0 w-full h-full text-blue-500/30 fill-current stroke-blue-500 stroke-2">
                   <polygon points="96,20 160,50 170,120 96,160 40,110 30,50" />
                 </svg>
                 
                 {/* Labels */}
                 <span className="absolute -top-4 text-[10px] text-muted-foreground">Product</span>
                 <span className="absolute -bottom-4 text-[10px] text-muted-foreground">Sales</span>
                 <span className="absolute -left-6 text-[10px] text-muted-foreground">Tech</span>
                 <span className="absolute -right-6 text-[10px] text-muted-foreground">Ops</span>
               </div>
             </div>
          </div>

          {/* Founder Risks */}
          <div className="bg-card border border-border p-5 rounded-xl">
             <h3 className="font-semibold flex items-center gap-2 mb-4"><AlertTriangle className="h-4 w-4 text-amber-500" /> Red Flags & Risks</h3>
             <div className="space-y-3">
               <div className="flex gap-3 items-start bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
                 <div className="mt-0.5">
                   <AlertCircle className="h-4 w-4 text-amber-500" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-foreground">Burnout Risk</p>
                   <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Operating as both CEO and acting Head of Sales. Needs to recruit a seasoned CRO in the next 6 months to sustain current growth vectors.</p>
                 </div>
               </div>
               <div className="flex gap-3 items-start bg-zinc-900/50 border border-border p-3 rounded-lg">
                 <div className="mt-0.5">
                   <CheckCircle2 className="h-4 w-4 text-zinc-500" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-zinc-400">Background Check</p>
                   <p className="text-xs text-zinc-500 mt-1">Clear. No litigation or compliance flags found.</p>
                 </div>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
