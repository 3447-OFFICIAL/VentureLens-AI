"use client";

import { 
  Github, ShieldAlert, Cpu, GitBranch, GitCommit,
  CheckCircle2, AlertTriangle, AlertCircle, FileCode2,
  Box, Key, Zap, Brain, Activity, Clock
} from "lucide-react";

export default function TechAnalysisModule({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col h-full w-full space-y-6">
      
      {/* Header & Risk Score */}
      <div className="bg-card border border-border p-5 rounded-xl flex flex-col md:flex-row justify-between gap-6 items-center">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-geist font-semibold flex items-center gap-2"><Github className="h-6 w-6"/> Tech & Codebase DD</h1>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <GitBranch className="h-4 w-4"/> Scanned branch: <code className="text-blue-400 bg-blue-500/10 px-1 py-0.5 rounded">main</code>
            <span className="mx-2">•</span>
            <Clock className="h-4 w-4"/> Last scan: 10 mins ago
          </p>
        </div>
        
        {/* Risk Score */}
        <div className="flex items-center gap-6 border-l border-border pl-6">
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Tech Risk Score</span>
            <div className="flex items-baseline gap-1 text-amber-500">
              <span className="text-4xl font-bold font-geist">C+</span>
              <span className="text-sm font-medium">/ A</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-full border-4 border-amber-500/30 flex items-center justify-center relative">
             <AlertTriangle className="h-5 w-5 text-amber-500" />
             {/* Fake SVG ring */}
             <svg className="absolute inset-0 h-full w-full -rotate-90">
               <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="4" fill="none" className="text-amber-500" strokeDasharray="138" strokeDashoffset="55" />
             </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Col (Security, Architecture, Dependencies) */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          
          {/* Security & Secrets */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-rose-900/10 border border-rose-500/20 p-4 rounded-xl relative overflow-hidden">
              <ShieldAlert className="h-8 w-8 text-rose-500/20 absolute right-4 top-4" />
              <h3 className="text-sm font-semibold text-rose-500 flex items-center gap-2 mb-2"><Key className="h-4 w-4"/> Exposed Secrets</h3>
              <div className="text-2xl font-bold text-rose-50 mb-1">2 Critical</div>
              <p className="text-xs text-rose-400/80">AWS keys found in `tests/fixtures/config.json`.</p>
            </div>
            
            <div className="bg-emerald-900/10 border border-emerald-500/20 p-4 rounded-xl relative overflow-hidden">
              <ShieldAlert className="h-8 w-8 text-emerald-500/20 absolute right-4 top-4" />
              <h3 className="text-sm font-semibold text-emerald-500 flex items-center gap-2 mb-2"><AlertCircle className="h-4 w-4"/> CVE Vulnerabilities</h3>
              <div className="text-2xl font-bold text-emerald-50 mb-1">0 High</div>
              <p className="text-xs text-emerald-400/80">Dependencies are up to date and secure.</p>
            </div>
          </div>

          {/* Architecture & Dependencies */}
          <div className="bg-card border border-border p-5 rounded-xl">
            <h3 className="font-semibold flex items-center gap-2 mb-4"><Box className="h-4 w-4" /> Architecture & Dependencies</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Frontend", val: "React, Next.js" },
                { label: "Backend", val: "Python, FastAPI" },
                { label: "Database", val: "PostgreSQL, Redis" },
                { label: "Infra", val: "AWS ECS, Terraform" },
              ].map((stack, i) => (
                <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg">
                  <span className="text-xs text-muted-foreground block mb-1">{stack.label}</span>
                  <span className="text-sm font-medium">{stack.val}</span>
                </div>
              ))}
            </div>

            {/* Dependency Warning */}
            <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground font-medium">Vendor Lock-in Risk</p>
                <p className="text-xs text-muted-foreground mt-1">High coupling to AWS proprietary services (Cognito, DynamoDB). Migrating away would require significant rewrite of the auth and data access layers.</p>
              </div>
            </div>
          </div>

          {/* CI/CD & Code Quality */}
          <div className="grid grid-cols-2 gap-6">
            {/* CI/CD & Coverage */}
            <div className="bg-card border border-border p-5 rounded-xl">
              <h3 className="font-semibold flex items-center gap-2 mb-4"><GitCommit className="h-4 w-4" /> CI/CD & Coverage</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Test Coverage</span>
                    <span className="font-medium text-rose-400">42% (Low)</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full">
                    <div className="h-full bg-rose-500 w-[42%] rounded-full relative"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Build Success Rate</span>
                    <span className="font-medium text-emerald-400">94%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full">
                    <div className="h-full bg-emerald-500 w-[94%] rounded-full relative"></div>
                  </div>
                </div>
                <div className="pt-2">
                   <p className="text-xs text-muted-foreground"><strong className="text-foreground">Pipelines:</strong> GitHub Actions (Lint, Test, Docker Build).</p>
                </div>
              </div>
            </div>

            {/* Code Smells & Tech Debt */}
            <div className="bg-card border border-border p-5 rounded-xl">
              <h3 className="font-semibold flex items-center gap-2 mb-4"><FileCode2 className="h-4 w-4" /> Code Smells & Debt</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm p-2 bg-zinc-900/50 rounded border border-zinc-800">
                  <span className="flex items-center gap-2"><Cpu className="h-3 w-3 text-amber-500"/> High Complexity</span>
                  <span className="font-mono text-muted-foreground">app/engine/core.py</span>
                </div>
                <div className="flex items-center justify-between text-sm p-2 bg-zinc-900/50 rounded border border-zinc-800">
                  <span className="flex items-center gap-2"><FileCode2 className="h-3 w-3 text-rose-500"/> Duplicated Logic</span>
                  <span className="font-mono text-muted-foreground">app/utils/auth.py</span>
                </div>
                <div className="flex items-center justify-between text-sm p-2 bg-zinc-900/50 rounded border border-zinc-800">
                  <span className="flex items-center gap-2"><AlertCircle className="h-3 w-3 text-blue-500"/> Large PRs</span>
                  <span className="font-mono text-muted-foreground">Avg: 850 lines</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: AI Recommendations & Complexity */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Complexity Gauge */}
          <div className="bg-card border border-border rounded-xl p-5 text-center">
            <h3 className="font-semibold text-left mb-6">Codebase Complexity</h3>
            
            <div className="relative inline-flex items-center justify-center w-40 h-40">
              <svg className="w-full h-full transform -rotate-180">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="none" className="text-zinc-800" strokeDasharray="220" strokeDashoffset="0" strokeLinecap="round" />
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="none" className="text-amber-500" strokeDasharray="220" strokeDashoffset="60" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold font-geist">8.4</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">High</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-4 text-left leading-relaxed">
              The cyclomatic complexity is well above the median for Series A startups. Refactoring is required before scaling the engineering team.
            </p>
          </div>

          {/* AI Action Plan */}
          <div className="bg-gradient-to-b from-purple-900/20 to-transparent border border-purple-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-purple-400" />
              <h3 className="font-semibold text-purple-50">AI Action Plan</h3>
            </div>
            <div className="space-y-4">
              
              <div className="relative pl-4 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-rose-500 before:rounded-full">
                <p className="text-sm font-medium text-rose-100">Immediate Action</p>
                <p className="text-xs text-zinc-400 mt-1">Rotate AWS credentials found in fixtures and rewrite Git history.</p>
              </div>

              <div className="relative pl-4 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-amber-500 before:rounded-full">
                <p className="text-sm font-medium text-amber-100">Pre-Close Condition</p>
                <p className="text-xs text-zinc-400 mt-1">Implement strict testing requirements to raise coverage above 70%.</p>
              </div>

              <div className="relative pl-4 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-blue-500 before:rounded-full">
                <p className="text-sm font-medium text-blue-100">Post-Investment 100 Days</p>
                <p className="text-xs text-zinc-400 mt-1">Abstract the data layer to reduce vendor lock-in with AWS DynamoDB.</p>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
