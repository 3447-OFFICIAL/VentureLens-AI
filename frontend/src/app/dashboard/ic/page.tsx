"use client";

import { 
  Users, Calendar, Clock, CheckCircle2, XCircle, 
  MinusCircle, FileText, Paperclip, MessageSquare, 
  History, Brain, ThumbsUp, ThumbsDown, ChevronRight,
  MoreVertical, FileCheck, Share2
} from "lucide-react";

export default function InvestmentCommitteeModule() {
  return (
    <div className="flex flex-col h-full w-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border border-border p-6 rounded-xl">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-geist font-bold flex items-center gap-2">
              <Users className="h-6 w-6"/> Investment Committee
            </h1>
            <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-xs font-semibold rounded-md border border-amber-500/20 animate-pulse">Live</span>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4"/> Q3 Deal Review • Nov 15, 2025 • <Clock className="h-4 w-4 ml-2"/> 10:00 AM PST
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:opacity-90">
            <Share2 className="h-4 w-4" /> Invite
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90">
            <FileCheck className="h-4 w-4" /> Finalize Minutes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Col: Agenda, Voting, Decision History, Memo */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          
          {/* Agenda & Voting Card */}
          <div className="bg-card border border-border p-6 rounded-xl flex flex-col md:flex-row gap-6">
             <div className="flex-1">
               <h3 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
                 <span className="bg-blue-500 text-white w-5 h-5 flex items-center justify-center rounded text-xs">1</span> 
                 Acme Corp ($5M Series A)
               </h3>
               <p className="text-sm text-muted-foreground mb-4">Lead Sponsor: JD • Predictive Lending Infrastructure.</p>
               
               <div className="flex items-center gap-2 text-xs">
                 <span className="bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-zinc-300">Valuation: $25M Pre</span>
                 <span className="bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-zinc-300">Ownership: 16.6%</span>
               </div>
             </div>
             
             {/* Live Voting Block */}
             <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 flex flex-col gap-3">
               <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cast Vote</h4>
               <div className="flex gap-2">
                 <button className="flex-1 flex flex-col items-center gap-1 bg-emerald-900/10 hover:bg-emerald-900/20 border border-emerald-500/30 p-2 rounded-lg text-emerald-500 transition-colors">
                   <ThumbsUp className="h-4 w-4" />
                   <span className="text-[10px] font-bold">Approve</span>
                 </button>
                 <button className="flex-1 flex flex-col items-center gap-1 bg-rose-900/10 hover:bg-rose-900/20 border border-rose-500/30 p-2 rounded-lg text-rose-500 transition-colors">
                   <ThumbsDown className="h-4 w-4" />
                   <span className="text-[10px] font-bold">Pass</span>
                 </button>
                 <button className="flex-1 flex flex-col items-center gap-1 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 p-2 rounded-lg text-zinc-400 transition-colors">
                   <MinusCircle className="h-4 w-4" />
                   <span className="text-[10px] font-bold">Abstain</span>
                 </button>
               </div>
               {/* Voting Status */}
               <div className="flex items-center justify-between text-xs mt-2">
                 <span className="text-muted-foreground">Votes: 3 / 5</span>
                 <div className="flex gap-1">
                   <div className="h-4 w-4 rounded-full bg-emerald-500 border border-emerald-600" title="JD (Approve)"></div>
                   <div className="h-4 w-4 rounded-full bg-emerald-500 border border-emerald-600" title="ES (Approve)"></div>
                   <div className="h-4 w-4 rounded-full bg-rose-500 border border-rose-600" title="AK (Pass)"></div>
                   <div className="h-4 w-4 rounded-full bg-zinc-800 border border-zinc-700 animate-pulse"></div>
                   <div className="h-4 w-4 rounded-full bg-zinc-800 border border-zinc-700 animate-pulse"></div>
                 </div>
               </div>
             </div>
          </div>

          {/* Memo & Attachments */}
          <div className="bg-card border border-border flex flex-col rounded-xl flex-1 min-h-[400px]">
             <div className="border-b border-border p-4 flex justify-between items-center bg-zinc-900/50 rounded-t-xl">
               <h3 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4" /> Investment Memo</h3>
               <div className="flex items-center gap-3 text-xs">
                 <span className="flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer"><History className="h-3 w-3" /> v2.4 (Latest)</span>
                 <span className="flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 cursor-pointer hover:bg-blue-500/20 transition-colors"><Paperclip className="h-3 w-3" /> 4 Attachments</span>
               </div>
             </div>
             
             {/* Memo Content Editor view */}
             <div className="p-8 prose prose-invert max-w-none text-sm text-zinc-300 leading-loose overflow-y-auto flex-1">
               <h2 className="text-foreground">Executive Summary</h2>
               <p>
                 Acme Corp provides predictive lending infrastructure for B2B fintechs. By analyzing real-time cash flow data, their models achieve a 40% reduction in default rates compared to traditional credit scoring. The company has reached $2.5M ARR with 183% YoY growth.
               </p>
               <h2 className="text-foreground">Investment Thesis</h2>
               <p>
                 We are participating in a $5M Series A at a $25M pre-money valuation. The structural shift towards embedded finance necessitates modern risk models. Acme has proven their GTM motion with 12 enterprise logos.
               </p>
               <h3 className="text-foreground">Key Risks & Mitigations</h3>
               <ul>
                 <li><strong>Customer Concentration:</strong> Top 3 customers account for 45% of revenue. <em>Mitigation:</em> Series A funds will aggressively expand the outbound enterprise sales team.</li>
                 <li><strong>Vendor Lock-in:</strong> Heavy reliance on AWS proprietary infra. <em>Mitigation:</em> 100-day post-close plan mandates abstraction layer development.</li>
               </ul>
             </div>
          </div>

          {/* Decision History */}
          <div className="bg-card border border-border p-5 rounded-xl">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><History className="h-4 w-4" /> Past Decisions</h3>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground border-b border-border">
                <tr>
                  <th className="py-2 font-medium">Date</th>
                  <th className="py-2 font-medium">Company</th>
                  <th className="py-2 font-medium">Round</th>
                  <th className="py-2 font-medium">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-2 text-muted-foreground font-mono text-xs">Oct 12, 2025</td>
                  <td className="py-2 font-medium">LendAI</td>
                  <td className="py-2">Seed</td>
                  <td className="py-2"><span className="text-rose-500 font-medium text-xs bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Passed</span></td>
                </tr>
                <tr>
                  <td className="py-2 text-muted-foreground font-mono text-xs">Sep 28, 2025</td>
                  <td className="py-2 font-medium">FinSync</td>
                  <td className="py-2">Series B</td>
                  <td className="py-2"><span className="text-emerald-500 font-medium text-xs bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Approved ($2M)</span></td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Col: AI Assistant, Comments */}
        <div className="lg:col-span-4 space-y-6 flex flex-col h-full">
          
          {/* AI Meeting Assistant */}
          <div className="bg-gradient-to-b from-purple-900/20 to-transparent border border-purple-500/20 rounded-xl flex flex-col h-[300px]">
            <div className="p-4 border-b border-purple-500/20 flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              <h3 className="font-semibold text-purple-50">IC Copilot</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm">
              <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                <p className="text-purple-300 text-xs font-semibold mb-1">Meeting Context Synthesized</p>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  I've reviewed the v2.4 memo and all 4 attachments. Notably, the revised financial model (Attachment 3) updated the runway projection from 9 months to 11 months based on lower CAC assumptions.
                </p>
              </div>
              <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                <p className="text-emerald-400 text-xs font-semibold mb-1">Suggested Question for Founder</p>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  "How does the engineering team plan to execute the AWS abstraction layer without disrupting the Q1 feature roadmap?"
                </p>
              </div>
            </div>
            <div className="p-3 border-t border-purple-500/20">
               <div className="bg-black/50 border border-purple-500/30 rounded-lg p-2 flex items-center gap-2">
                 <input type="text" placeholder="Ask AI about this deal..." className="bg-transparent border-none outline-none text-sm w-full text-zinc-300 placeholder:text-zinc-600" />
                 <Brain className="h-4 w-4 text-purple-500" />
               </div>
            </div>
          </div>

          {/* Threaded Comments */}
          <div className="bg-card border border-border rounded-xl flex flex-col flex-1 min-h-[300px]">
            <div className="p-4 border-b border-border flex justify-between items-center bg-zinc-900/50">
               <h3 className="font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Discussion</h3>
               <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">8 Comments</span>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
               
               <div className="flex gap-3">
                 <div className="h-8 w-8 rounded-full bg-emerald-900 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold border border-emerald-500/30">JD</div>
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <span className="text-sm font-semibold">John Doe</span>
                     <span className="text-[10px] text-muted-foreground">10:14 AM</span>
                   </div>
                   <p className="text-sm text-zinc-300">I'm comfortable with the valuation, but I want AK's read on the Series A term sheet regarding the anti-dilution provisions.</p>
                 </div>
               </div>

               <div className="flex gap-3 pl-8 relative before:absolute before:left-3.5 before:top-[-20px] before:bottom-6 before:w-px before:bg-zinc-800">
                 <div className="h-6 w-6 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center shrink-0 text-[10px] font-bold border border-zinc-700 z-10">AK</div>
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <span className="text-sm font-semibold">Alice Kim</span>
                     <span className="text-[10px] text-muted-foreground">10:18 AM</span>
                   </div>
                   <p className="text-sm text-zinc-300">Standard broad-based weighted average. Nothing unusual. I've uploaded the marked-up copy to attachments.</p>
                 </div>
               </div>

               <div className="flex gap-3">
                 <div className="h-8 w-8 rounded-full bg-blue-900 text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold border border-blue-500/30">ES</div>
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <span className="text-sm font-semibold">Elena Smith</span>
                     <span className="text-[10px] text-muted-foreground">10:22 AM</span>
                   </div>
                   <p className="text-sm text-zinc-300">Great. I'm a Yes. Voting now.</p>
                 </div>
               </div>

            </div>
            
            <div className="p-4 border-t border-border">
               <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-2 flex items-end gap-2">
                 <textarea rows={2} placeholder="Add a comment... (Type @ to mention)" className="bg-transparent border-none outline-none text-sm w-full text-zinc-300 resize-none placeholder:text-zinc-600" />
                 <button className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-xs font-medium hover:opacity-90">Post</button>
               </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
