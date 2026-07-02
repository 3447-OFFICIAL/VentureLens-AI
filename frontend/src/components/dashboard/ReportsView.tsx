"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { FileText, Download, Eye, Sparkles, AlertCircle } from "lucide-react";

type Report = {
  id: string;
  name: string;
  type: string;
  companyName: string;
  date: string;
  score: number;
};

export default function ReportsView() {
  const [selectedReportId, setSelectedReportId] = useState<string>("");
  const [previewing, setPreviewing] = useState(false);

  const sampleReports: Report[] = [
    { id: "rep-1", name: "Due Diligence Report", type: "Full Audit", companyName: "SynthoAI", date: "2026-06-15", score: 84 },
    { id: "rep-2", name: "Investment Committee Memo", type: "IC Memo", companyName: "QuantumDB", date: "2026-06-20", score: 88 },
    { id: "rep-3", name: "Financial Risk Assessment", type: "Risk Audit", companyName: "EcoMove", date: "2026-06-28", score: 62 },
  ];

  const activeReport = sampleReports.find((r) => r.id === selectedReportId) || sampleReports[0];

  const handleExport = (format: "pdf" | "docx" | "md") => {
    alert(`Exporting ${activeReport.name} for ${activeReport.companyName} as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">AI Reports & Memos</h2>
          <p className="text-xs text-slate-400 mt-0.5">Generate, audit, and export institutional-grade due diligence materials.</p>
        </div>
        <button
          onClick={() => alert("Triggering multi-agent analysis to generate a new report...")}
          className="bg-gradient-to-tr from-indigo-600 to-purple-500 hover:from-indigo-500 hover:to-purple-400 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate New Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports Index list */}
        <div className="bg-[#0b0e14] border border-[#161c28] p-4 rounded-xl space-y-3 h-fit">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reports Repository</h4>
          <div className="space-y-2">
            {sampleReports.map((rep) => (
              <button
                key={rep.id}
                onClick={() => setSelectedReportId(rep.id)}
                className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-start space-x-3 cursor-pointer ${
                  activeReport.id === rep.id 
                    ? "bg-[#181f30] border-indigo-500/40 text-slate-100" 
                    : "bg-[#101522] border-[#1c2438] hover:bg-[#162030] text-slate-400"
                }`}
              >
                <FileText className={`w-4 h-4 mt-0.5 shrink-0 ${activeReport.id === rep.id ? "text-indigo-400" : "text-slate-500"}`} />
                <div className="min-w-0">
                  <h5 className="font-semibold text-slate-200 truncate">{rep.name}</h5>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-1">
                    <span>{rep.companyName}</span>
                    <span>•</span>
                    <span>{rep.date}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Report Preview & Details */}
        <div className="lg:col-span-2 bg-[#0b0e14] border border-[#161c28] p-6 rounded-xl space-y-6 shadow-lg">
          {activeReport ? (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#1c2438] pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">{activeReport.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Asset Profile: <strong className="text-slate-200">{activeReport.companyName}</strong> | Created: {activeReport.date}</p>
                </div>
                
                <div className="mt-3 sm:mt-0 flex space-x-2">
                  {(["pdf", "docx", "md"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => handleExport(fmt)}
                      className="bg-[#101522] hover:bg-[#162030] border border-[#1c2438] text-slate-300 text-[10px] font-medium px-2.5 py-1 rounded transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span className="uppercase">{fmt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Document Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#101522] border border-[#1c2438] p-3 rounded-lg">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">Assessment Type</span>
                  <span className="text-xs font-semibold text-white mt-1 block">{activeReport.type}</span>
                </div>
                <div className="bg-[#101522] border border-[#1c2438] p-3 rounded-lg">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">Target Asset</span>
                  <span className="text-xs font-semibold text-white mt-1 block">{activeReport.companyName}</span>
                </div>
                <div className="bg-[#101522] border border-[#1c2438] p-3 rounded-lg">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">Diligence Index</span>
                  <span className={`text-xs font-bold mt-1 block ${activeReport.score > 70 ? "text-emerald-400" : "text-amber-400"}`}>
                    {activeReport.score}/100
                  </span>
                </div>
                <div className="bg-[#101522] border border-[#1c2438] p-3 rounded-lg">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">Security Classification</span>
                  <span className="text-xs font-semibold text-red-400 mt-1 block">CONFIDENTIAL</span>
                </div>
              </div>

              {/* Markdown Content Preview */}
              <div className="bg-[#080b11] border border-[#1c2438] rounded-xl p-5 font-mono text-xs text-slate-300 space-y-4 max-h-[300px] overflow-y-auto leading-relaxed border-l-2 border-l-indigo-500">
                <p className="text-slate-400 uppercase tracking-widest text-[9px] font-bold border-b border-[#1c2438] pb-1">AI Report Snippet Preview</p>
                <p>
                  # EXECUTIVE ASSESSMENT SUMMARY FOR {activeReport.companyName.toUpperCase()}
                </p>
                <p>
                  VentureLens AI has finalized its comprehensive intelligence evaluation. Based on the consolidated input signals, we recommend a Buy positioning.
                </p>
                <p>
                  ## CORE METRICS SUMMARY
                  - **Net MRR**: $1.0M
                  - **Year-over-Year Growth**: +33.0%
                  - **Net Revenue Retention (NRR)**: 115%
                  - **Average Burn Rate**: $250k/month
                  - **Implied Runway**: ~14 months
                </p>
                <p>
                  ## CRITICAL RISK SIGNALS
                  Customer concentration remains elevated. The top 3 accounts aggregate 48% of monthly recurring revenues. Pay close attention to retention rates and contract terms in subsequent evaluation rounds.
                </p>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">No report selected.</div>
          )}
        </div>
      </div>
    </div>
  );
}
