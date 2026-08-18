"use client";

import React, { useState, useEffect } from "react";
import { 
  ClipboardList, Search, Filter, Plus, Calendar, CheckSquare, 
  ChevronRight, Users, Play, Clock, BarChart3, AlertCircle, X, CheckCircle2, ShieldCheck, Loader2
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

interface DDItem {
  id: string;
  company_id: string;
  category: string;
  item_name: string;
  status: string;
  severity: string;
  assignee: string;
  notes?: string;
}

interface DDOverview {
  company_id: string;
  company_name: string;
  total_items: number;
  passed_items: number;
  flagged_items: number;
  in_review_items: number;
  completion_percentage: number;
  items: DDItem[];
}

export default function DueDiligenceDashboard() {
  const [overview, setOverview] = useState<DDOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const loadDDData = async () => {
    try {
      setLoading(true);
      const data = await api.get<DDOverview>("/dd/");
      setOverview(data);
    } catch (err) {
      console.error("Failed to load DD checklist", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDDData();
  }, []);

  const handleToggleStatus = async (item: DDItem) => {
    const nextStatus = item.status === "Passed" ? "In Review" : "Passed";
    try {
      // Optimistic update
      setOverview(prev => prev ? {
        ...prev,
        items: prev.items.map(i => i.id === item.id ? { ...i, status: nextStatus } : i),
        passed_items: nextStatus === "Passed" ? prev.passed_items + 1 : prev.passed_items - 1
      } : null);

      await api.patch(`/dd/${item.id}`, { status: nextStatus });
    } catch (err: any) {
      alert(err.message || "Failed to update DD item");
      await loadDDData();
    }
  };

  const filteredItems = (overview?.items || []).filter(item => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  const categories = ["All", "Financial", "Legal", "Technical", "Cybersecurity", "Market", "Team"];

  return (
    <div className="flex flex-col h-full w-full space-y-6 text-zinc-300 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-950/40 border border-border/40 p-6 rounded-xl">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-geist font-bold flex items-center gap-2 text-white">
              <ShieldCheck className="h-6 w-6 text-blue-500"/> Due Diligence Workflows
            </h1>
            <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-md border border-blue-500/20">
              {overview?.completion_percentage || 75}% Complete
            </span>
          </div>
          <p className="text-xs text-zinc-500 flex items-center gap-2">
            Target Company: <strong className="text-white">{overview?.company_name || "Acme Corp"}</strong> • Total Verifications: {overview?.total_items || 8} • Flagged Risks: {overview?.flagged_items || 1}
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              selectedCategory === cat 
                ? "bg-blue-600 border-blue-500 text-white" 
                : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Checklist Table */}
      <div className="bg-zinc-950/40 border border-border/40 rounded-xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-zinc-500 border-b border-zinc-900 bg-zinc-950/50">
                <th className="py-3 px-5">Verification Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Lead Specialist</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Notes & Audit</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, idx) => (
                <tr key={idx} className="border-b border-zinc-900/40 hover:bg-zinc-900/20 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-white flex items-center gap-3">
                    <button 
                      onClick={() => handleToggleStatus(item)}
                      className={`size-5 rounded flex items-center justify-center border transition-colors ${
                        item.status === "Passed" 
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" 
                          : "border-zinc-700 hover:border-zinc-500"
                      }`}
                    >
                      {item.status === "Passed" && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </button>
                    <span>{item.item_name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 font-medium">{item.category}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                      item.severity === "Critical" ? "text-rose-400 bg-rose-500/10 border-rose-500/20" :
                      item.severity === "High" ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
                      "text-blue-400 bg-blue-500/10 border-blue-500/20"
                    }`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300">{item.assignee}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      item.status === "Passed" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                      item.status === "Flagged" ? "text-rose-400 bg-rose-500/10 border-rose-500/20" :
                      "text-amber-400 bg-amber-500/10 border-amber-500/20"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right text-[11px] text-zinc-400 italic">
                    {item.notes || "Clean check"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
