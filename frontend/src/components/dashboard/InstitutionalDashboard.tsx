"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { UploadDocument } from "@/components/UploadDocument";
import { InvestmentMemo } from "@/components/InvestmentMemo";

export default function InstitutionalDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for Monte Carlo
  const monteCarloData = Array.from({ length: 36 }).map((_, i) => ({
    month: i + 1,
    p90: 1000000 * Math.pow(1.10, i),
    p50: 1000000 * Math.pow(1.05, i),
    p10: 1000000 * Math.pow(1.01, i),
  }));

  // Mock data for Cap Table
  const capTableData = [
    { shareholder: "Founders", ownership: 60 },
    { shareholder: "Seed Investors", ownership: 20 },
    { shareholder: "Series A (New)", ownership: 15 },
    { shareholder: "Option Pool", ownership: 5 },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-50 p-6 space-y-6 overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-amber-500">VentureLens Terminal</h1>
          <p className="text-sm text-slate-400">Institutional Intelligence Layer</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant={activeTab === "overview" ? "default" : "outline"} onClick={() => setActiveTab("overview")}>Overview</Button>
          <Button variant={activeTab === "documents" ? "default" : "outline"} onClick={() => setActiveTab("documents")}>Documents</Button>
          <Button variant={activeTab === "memo" ? "default" : "outline"} onClick={() => setActiveTab("memo")}>Due Diligence</Button>
          <Button variant={activeTab === "financials" ? "default" : "outline"} onClick={() => setActiveTab("financials")}>Financials</Button>
          <Button variant={activeTab === "captable" ? "default" : "outline"} onClick={() => setActiveTab("captable")}>Cap Table</Button>
          <Button variant={activeTab === "montecarlo" ? "default" : "outline"} onClick={() => setActiveTab("montecarlo")}>Simulations</Button>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900 border-slate-800 text-slate-100">
            <CardHeader>
              <CardTitle className="text-slate-300">Watchlist</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="font-medium text-slate-200">Acme Corp</span>
                  <span className="text-emerald-500">Evaluating</span>
                </li>
                <li className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="font-medium text-slate-200">Stark Ind.</span>
                  <span className="text-amber-500">Monitoring</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-slate-200">Wayne Ent.</span>
                  <span className="text-rose-500">Passed</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 text-slate-100">
            <CardHeader>
              <CardTitle className="text-slate-300">Market Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-slate-800 p-3 rounded text-sm text-slate-300">
                  <span className="text-amber-500 font-bold">[CRUNCHBASE]</span> Acme Corp competitor just raised $50M Series B.
                </div>
                <div className="bg-slate-800 p-3 rounded text-sm text-slate-300">
                  <span className="text-sky-500 font-bold">[LINKEDIN]</span> Stark Ind. headcount dropped by 15% this quarter.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 text-slate-100">
            <CardHeader>
              <CardTitle className="text-slate-300">Risk Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-slate-300">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Burn Multiple</span>
                    <span className="text-rose-500">High Risk (3.5x)</span>
                  </div>
                  <div className="w-full bg-slate-850 h-2 rounded"><div className="bg-rose-500 h-2 rounded w-4/5"></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Runway</span>
                    <span className="text-amber-500">Medium (8 Months)</span>
                  </div>
                  <div className="w-full bg-slate-850 h-2 rounded"><div className="bg-amber-500 h-2 rounded w-1/2"></div></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="flex-1 flex items-center justify-center p-4">
          <UploadDocument />
        </div>
      )}

      {activeTab === "memo" && (
        <div className="flex-1 p-2">
          <InvestmentMemo />
        </div>
      )}

      {activeTab === "montecarlo" && (
        <Card className="bg-slate-900 border-slate-800 flex-1 text-slate-100">
          <CardHeader>
            <CardTitle className="text-slate-300">Monte Carlo ARR Forecast (10,000 Simulations)</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monteCarloData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorP90" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorP10" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#475569" />
                <YAxis stroke="#475569" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                  formatter={(value: number) => `$${(value / 1000000).toFixed(2)}M`}
                />
                <Legend />
                <Area type="monotone" dataKey="p90" stroke="#10b981" fillOpacity={1} fill="url(#colorP90)" name="Bull Case (90th %ile)" />
                <Area type="monotone" dataKey="p50" stroke="#f59e0b" fillOpacity={0} name="Base Case (50th %ile)" />
                <Area type="monotone" dataKey="p10" stroke="#f43f5e" fillOpacity={1} fill="url(#colorP10)" name="Bear Case (10th %ile)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {activeTab === "captable" && (
        <Card className="bg-slate-900 border-slate-800 flex-1 text-slate-100">
          <CardHeader>
            <CardTitle className="text-slate-300">Cap Table & Dilution Modeling</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4 text-slate-200">Post-Money Ownership</h3>
                <div className="space-y-4">
                  {capTableData.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.shareholder}</span>
                        <span>{item.ownership}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded">
                        <div 
                          className={`h-2 rounded ${index === 0 ? 'bg-sky-500' : index === 1 ? 'bg-indigo-500' : index === 2 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                          style={{ width: `${item.ownership}%` }}>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-950 p-6 rounded border border-slate-800">
                <h3 className="text-lg font-medium mb-4 text-slate-200">Scenario Builder</h3>
                <div className="space-y-4 text-sm text-slate-400">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span>Pre-Money Valuation</span>
                    <span className="text-slate-200 font-medium">$20,000,000</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span>New Investment</span>
                    <span className="text-emerald-500 font-medium">+$5,000,000</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span>Post-Money Valuation</span>
                    <span className="text-slate-200 font-medium">$25,000,000</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span>Effective Dilution</span>
                    <span className="text-rose-500 font-medium">20.0%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "financials" && (
        <Card className="bg-slate-900 border-slate-800 flex-1 flex items-center justify-center text-slate-100 min-h-[300px]">
          <p className="text-slate-500">Financial models loading...</p>
        </Card>
      )}

    </div>
  );
}
