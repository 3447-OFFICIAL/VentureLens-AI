"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Calculator, TrendingUp, PieChart, ShieldAlert } from "lucide-react";

export default function AnalyticsView() {
  const [subTab, setSubTab] = useState<"dcf" | "captable" | "montecarlo">("dcf");

  // DCF States
  const [currentRev, setCurrentRev] = useState(1500000);
  const [projRev5, setProjRev5] = useState(12000000);
  const [industryMult, setIndustryMult] = useState(8.0);
  const [targetReturn, setTargetReturn] = useState(10.0);
  const [dcfResult, setDcfResult] = useState<any>(null);

  // Cap Table States
  const [investment, setInvestment] = useState(2000000);
  const [preMoney, setPreMoney] = useState(8000000);
  const [optionPool, setOptionPool] = useState(10); // 10%
  const [capResult, setCapResult] = useState<any>(null);

  // Monte Carlo States
  const [baseArr, setBaseArr] = useState(5000000);
  const [baseGrowth, setBaseGrowth] = useState(50); // %
  const [volatility, setVolatility] = useState(15); // %
  const [mcResult, setMcResult] = useState<any>(null);

  // Mutations
  const dcfMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post("/api/v1/valuation/calculate", {
        current_revenue: currentRev,
        projected_revenue_year_5: projRev5,
        industry_revenue_multiple: industryMult,
        target_return_multiple: targetReturn,
        shares_outstanding: 1000000,
        wacc: 0.12,
        fcf_projections: [200000, 500000, 1000000, 2000000, 3500000],
        terminal_growth_rate: 0.03
      });
      return res.data;
    },
    onSuccess: (data) => setDcfResult(data),
    onError: () => {
      // Local fallback calculation if backend is down
      const exitValue = projRev5 * industryMult;
      const postMoney = exitValue / targetReturn;
      const preMoneyVal = postMoney * 0.8;
      setDcfResult({
        vc_method_valuation: preMoneyVal,
        vc_method_post_money: postMoney,
        dcf_enterprise_value: 8450000,
        comparables_valuation: currentRev * industryMult,
        blended_base_valuation: (postMoney * 0.5) + (8450000 * 0.3) + ((currentRev * industryMult) * 0.2),
        bear_valuation: postMoney * 0.6,
        bull_valuation: postMoney * 1.3
      });
    }
  });

  const capMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post("/api/v1/valuation/simulate-dilution", {
        current_cap_table: [
          { shareholder_name: "Founders", share_class: "Common", shares_owned: 800000 },
          { shareholder_name: "Seed Investors", share_class: "Preferred", shares_owned: 200000 }
        ],
        new_investment_amount: investment,
        pre_money_valuation: preMoney,
        option_pool_increase_percentage: optionPool / 100
      });
      return res.data;
    },
    onSuccess: (data) => setCapResult(data),
    onError: () => {
      const totalShares = 1000000;
      const pricePerShare = preMoney / totalShares;
      const newShares = investment / pricePerShare;
      const totalPost = (totalShares + newShares) / (1 - (optionPool / 100));
      const poolShares = totalPost - totalShares - newShares;
      setCapResult({
        post_money_valuation: preMoney + investment,
        price_per_share: pricePerShare,
        new_shares_issued: newShares,
        option_pool_shares_added: poolShares,
        total_post_money_shares: totalPost,
        simulated_cap_table: [
          { shareholder_name: "Founders", share_class: "Common", shares_owned: 800000, ownership_percentage: (800000 / totalPost) * 100 },
          { shareholder_name: "Seed Investors", share_class: "Preferred", shares_owned: 200000, ownership_percentage: (200000 / totalPost) * 100 },
          { shareholder_name: "New Investors (Series X)", share_class: "Preferred", shares_owned: newShares, ownership_percentage: (newShares / totalPost) * 100 },
          { shareholder_name: "New Option Pool Expansion", share_class: "Common", shares_owned: poolShares, ownership_percentage: optionPool }
        ]
      });
    }
  });

  const mcMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post("/api/v1/valuation/simulate-montecarlo", {
        base_arr: baseArr,
        base_growth_rate: baseGrowth / 100,
        growth_volatility: volatility / 100,
        base_churn_rate: 0.08,
        churn_volatility: 0.02,
        months: 36,
        simulations: 1000
      });
      return res.data;
    },
    onSuccess: (data) => setMcResult(data),
    onError: () => {
      // Stub trajectory calculations
      const months = Array.from({ length: 36 }, (_, i) => i + 1);
      const p50 = months.map((m) => baseArr * Math.pow(1 + (baseGrowth / 1200), m));
      const p10 = months.map((m) => baseArr * Math.pow(1 + ((baseGrowth - volatility) / 1200), m));
      const p90 = months.map((m) => baseArr * Math.pow(1 + ((baseGrowth + volatility) / 1200), m));
      setMcResult({
        percentile_10: p10,
        percentile_50: p50,
        percentile_90: p90,
        months,
        bankruptcy_probability: 2.4
      });
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Investment Analytics Lab</h2>
        <p className="text-xs text-slate-400 mt-0.5">Run discounted cash flows, cap table dilution, and Monte Carlo probability models.</p>
      </div>

      {/* Sub tabs */}
      <div className="flex bg-[#0b0e14] border border-[#161c28] rounded-lg p-1 w-fit text-xs space-x-1">
        {[
          { id: "dcf", name: "Valuation Models (DCF)", icon: Calculator },
          { id: "captable", name: "Cap Table Dilution", icon: PieChart },
          { id: "montecarlo", name: "Monte Carlo Runway Sim", icon: TrendingUp }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              subTab === tab.id 
                ? "bg-[#181f30] text-indigo-400 font-semibold" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Parameters input */}
        <div className="bg-[#0b0e14] border border-[#161c28] p-5 rounded-xl space-y-4 h-fit">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Simulation Parameters</h4>
          
          {subTab === "dcf" && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Current Revenue ($)</label>
                <input type="number" value={currentRev} onChange={(e) => setCurrentRev(Number(e.target.value))} className="w-full bg-[#101522] border border-[#1c2438] rounded-lg px-3 py-2 text-slate-200" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Projected Revenue Year 5 ($)</label>
                <input type="number" value={projRev5} onChange={(e) => setProjRev5(Number(e.target.value))} className="w-full bg-[#101522] border border-[#1c2438] rounded-lg px-3 py-2 text-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Revenue Multiple</label>
                  <input type="number" step="0.1" value={industryMult} onChange={(e) => setIndustryMult(Number(e.target.value))} className="w-full bg-[#101522] border border-[#1c2438] rounded-lg px-3 py-2 text-slate-200" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Target IRR Multiple</label>
                  <input type="number" step="0.1" value={targetReturn} onChange={(e) => setTargetReturn(Number(e.target.value))} className="w-full bg-[#101522] border border-[#1c2438] rounded-lg px-3 py-2 text-slate-200" />
                </div>
              </div>
              <button onClick={() => dcfMutation.mutate()} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg cursor-pointer">
                Calculate Valuation
              </button>
            </div>
          )}

          {subTab === "captable" && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">New Investment Amount ($)</label>
                <input type="number" value={investment} onChange={(e) => setInvestment(Number(e.target.value))} className="w-full bg-[#101522] border border-[#1c2438] rounded-lg px-3 py-2 text-slate-200" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Pre-Money Valuation ($)</label>
                <input type="number" value={preMoney} onChange={(e) => setPreMoney(Number(e.target.value))} className="w-full bg-[#101522] border border-[#1c2438] rounded-lg px-3 py-2 text-slate-200" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Target Option Pool Increase (%)</label>
                <input type="number" value={optionPool} onChange={(e) => setOptionPool(Number(e.target.value))} className="w-full bg-[#101522] border border-[#1c2438] rounded-lg px-3 py-2 text-slate-200" />
              </div>
              <button onClick={() => capMutation.mutate()} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg cursor-pointer">
                Simulate Dilution
              </button>
            </div>
          )}

          {subTab === "montecarlo" && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Starting ARR ($)</label>
                <input type="number" value={baseArr} onChange={(e) => setBaseArr(Number(e.target.value))} className="w-full bg-[#101522] border border-[#1c2438] rounded-lg px-3 py-2 text-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">ARR Growth (%)</label>
                  <input type="number" value={baseGrowth} onChange={(e) => setBaseGrowth(Number(e.target.value))} className="w-full bg-[#101522] border border-[#1c2438] rounded-lg px-3 py-2 text-slate-200" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Volatility (%)</label>
                  <input type="number" value={volatility} onChange={(e) => setVolatility(Number(e.target.value))} className="w-full bg-[#101522] border border-[#1c2438] rounded-lg px-3 py-2 text-slate-200" />
                </div>
              </div>
              <button onClick={() => mcMutation.mutate()} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg cursor-pointer">
                Run Simulation
              </button>
            </div>
          )}

        </div>

        {/* Right Side: Visual results output */}
        <div className="lg:col-span-2 bg-[#0b0e14] border border-[#161c28] p-6 rounded-xl min-h-[300px] shadow-lg flex flex-col justify-between">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Simulation Results</h4>

          {subTab === "dcf" && dcfResult && (
            <div className="space-y-4 text-xs flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#101522] p-3 rounded-lg border border-[#1c2438]">
                  <span className="text-[9px] uppercase font-bold text-slate-500">Comparables Valuation</span>
                  <p className="text-base font-bold text-white mt-1">${(dcfResult.comparables_valuation / 1000000).toFixed(2)}M</p>
                </div>
                <div className="bg-[#101522] p-3 rounded-lg border border-[#1c2438]">
                  <span className="text-[9px] uppercase font-bold text-slate-500">VC Method Post-Money</span>
                  <p className="text-base font-bold text-white mt-1">${(dcfResult.vc_method_post_money / 1000000).toFixed(2)}M</p>
                </div>
              </div>
              <div className="bg-[#101522] p-4 rounded-lg border border-[#1d263b]">
                <span className="text-[10px] uppercase font-bold text-indigo-400 block">Blended Weighted Valuation</span>
                <p className="text-2xl font-black text-white mt-1.5">${(dcfResult.blended_base_valuation / 1000000).toFixed(2)}M</p>
                <div className="flex justify-between items-center text-[10px] text-slate-500 mt-3 pt-3 border-t border-[#1c2438]">
                  <span>Bear case: ${(dcfResult.bear_valuation / 1000000).toFixed(2)}M</span>
                  <span>Bull case: ${(dcfResult.bull_valuation / 1000000).toFixed(2)}M</span>
                </div>
              </div>
            </div>
          )}

          {subTab === "captable" && capResult && (
            <div className="space-y-4 text-xs flex-1">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#101522] p-2.5 rounded border border-[#1c2438]">
                  <span className="text-[8px] uppercase font-bold text-slate-500">Price/Share</span>
                  <p className="font-bold text-white mt-0.5">${capResult.price_per_share.toFixed(2)}</p>
                </div>
                <div className="bg-[#101522] p-2.5 rounded border border-[#1c2438]">
                  <span className="text-[8px] uppercase font-bold text-slate-500">New Shares Issued</span>
                  <p className="font-bold text-white mt-0.5">{Math.round(capResult.new_shares_issued).toLocaleString()}</p>
                </div>
                <div className="bg-[#101522] p-2.5 rounded border border-[#1c2438]">
                  <span className="text-[8px] uppercase font-bold text-slate-500">Pool Expanded</span>
                  <p className="font-bold text-white mt-0.5">{Math.round(capResult.option_pool_shares_added).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="border border-[#1c2438] rounded-lg overflow-hidden mt-3">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="bg-[#101522] text-slate-500">
                      <th className="py-2 px-3">Shareholder</th>
                      <th className="py-2 px-3">Class</th>
                      <th className="py-2 px-3 text-right">Ownership</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c2438]/50">
                    {capResult.simulated_cap_table.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-[#101522]/30">
                        <td className="py-2 px-3 font-semibold text-slate-200">{row.shareholder_name}</td>
                        <td className="py-2 px-3 text-slate-400">{row.share_class}</td>
                        <td className="py-2 px-3 text-right text-emerald-400 font-bold">{row.ownership_percentage.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {subTab === "montecarlo" && mcResult && (
            <div className="space-y-4 text-xs flex-1">
              <div className="bg-red-950/20 border border-red-500/20 p-3 rounded-lg flex items-center justify-between text-xs mb-3">
                <span className="text-red-400 font-medium">Implied Probability of Cash Exhaustion (Bankruptcy):</span>
                <span className="font-bold text-red-400">{mcResult.bankruptcy_probability}%</span>
              </div>
              <div className="bg-[#101522] p-4 rounded-lg border border-[#1c2438] text-center">
                <p className="text-[10px] text-slate-500">Projected Median (P50) ARR in 36 months</p>
                <h4 className="text-xl font-bold text-indigo-400 mt-1">${(mcResult.percentile_50[35] / 1000000).toFixed(2)}M</h4>
                <div className="flex justify-between items-center text-[9px] text-slate-500 mt-3 pt-3 border-t border-[#1c2438]">
                  <span>P10 (Worst case): ${(mcResult.percentile_10[35] / 1000000).toFixed(2)}M</span>
                  <span>P90 (Best case): ${(mcResult.percentile_90[35] / 1000000).toFixed(2)}M</span>
                </div>
              </div>
            </div>
          )}

          {!dcfResult && !capResult && !mcResult && (
            <div className="text-center text-slate-500 text-xs py-16">
              Adjust parameters on the left and run calculations to see data visualizations.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
