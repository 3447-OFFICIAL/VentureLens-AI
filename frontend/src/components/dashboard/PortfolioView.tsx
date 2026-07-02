"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { DollarSign, Percent, TrendingUp, ShieldAlert, BarChart3 } from "lucide-react";

type PortfolioItem = {
  id: string;
  name: string;
  initialInvestment: number;
  currentValue: number;
  ownership: number;
  arr: number;
  burnRate: number;
  runway: number;
};

export default function PortfolioView() {
  const samplePortfolio: PortfolioItem[] = [
    { id: "port-1", name: "SynthoAI", initialInvestment: 3000000, currentValue: 4500000, ownership: 12.5, arr: 12400000, burnRate: 250000, runway: 14.4 },
    { id: "port-2", name: "QuantumDB", initialInvestment: 2500000, currentValue: 3800000, ownership: 8.7, arr: 3200000, burnRate: 120000, runway: 26.6 },
    { id: "port-3", name: "EcoMove", initialInvestment: 4000000, currentValue: 3200000, ownership: 15.2, arr: 8700000, burnRate: 400000, runway: 8.0 },
    { id: "port-4", name: "HealthSync", initialInvestment: 1500000, currentValue: 2100000, ownership: 9.3, arr: 2100000, burnRate: 95000, runway: 22.1 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Portfolio Dashboard</h2>
        <p className="text-xs text-slate-400 mt-0.5">Aggregate performance metrics, capital valuations, and runway intelligence.</p>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Total Injected", val: "$11.0M", sub: "Initial capital cost", icon: DollarSign, color: "text-indigo-400" },
          { title: "Current Value", val: "$13.6M", sub: "Book valuation", icon: TrendingUp, color: "text-emerald-400" },
          { title: "Blended MOIC", val: "1.24x", sub: "Multiple on Invested Capital", icon: BarChart3, color: "text-amber-400" },
          { title: "Weighted Ownership", val: "11.4%", sub: "Average equity stake", icon: Percent, color: "text-purple-400" }
        ].map((c, i) => (
          <div key={i} className="bg-[#0b0e14] border border-[#161c28] rounded-xl p-4 flex items-center justify-between shadow-md">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">{c.title}</span>
              <h3 className="text-xl font-bold text-white mt-1">{c.val}</h3>
              <p className="text-[9px] text-slate-500 mt-0.5">{c.sub}</p>
            </div>
            <c.icon className={`w-8 h-8 ${c.color} opacity-80`} />
          </div>
        ))}
      </div>

      {/* Table view */}
      <div className="bg-[#0b0e14] border border-[#161c28] rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-[#1c2438] bg-[#0d121c]/30 flex justify-between items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Asset Performance Matrix</h3>
          <span className="text-[10px] text-slate-400">Values updated daily</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1c2438] text-slate-500 bg-[#0d121c]/10">
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Company</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Initial Investment</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Current Value</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Ownership %</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">ARR</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Monthly Burn</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Runway (Months)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161c28]/50">
              {samplePortfolio.map((item) => (
                <tr key={item.id} className="hover:bg-[#0f1421]/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{item.name}</td>
                  <td className="py-3.5 px-4 text-slate-300">${(item.initialInvestment / 1000000).toFixed(1)}M</td>
                  <td className="py-3.5 px-4 text-slate-300 font-semibold text-emerald-400">${(item.currentValue / 1000000).toFixed(1)}M</td>
                  <td className="py-3.5 px-4 text-slate-400">{item.ownership}%</td>
                  <td className="py-3.5 px-4 text-slate-300">${(item.arr / 1000000).toFixed(1)}M</td>
                  <td className="py-3.5 px-4 text-slate-400">${(item.burnRate / 1000).toFixed(0)}k</td>
                  <td className="py-3.5 px-4">
                    <span className={`font-semibold ${item.runway < 12 ? "text-red-400" : "text-slate-300"}`}>
                      {item.runway.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
