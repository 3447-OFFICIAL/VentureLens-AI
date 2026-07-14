"use client";

import React, { useState } from "react";
import { 
  Bell, Search, Filter, ShieldAlert, Sparkles, Check, 
  Trash2, AlertTriangle, AlertCircle, RefreshCw
} from "lucide-react";

export default function AlertsModule() {
  const [alerts, setAlerts] = useState([
    { id: 1, title: "High Customer Concentration", target: "EcoMove", risk: "High", time: "2 hours ago", desc: "Top 3 customers account for over 55% of annualized recurring revenue (ARR). Recommend structural contract length analysis.", color: "text-rose-400 border-rose-500/20 bg-rose-500/5" },
    { id: 2, title: "Runway < 12 Months", target: "SynthAI", risk: "High", time: "5 hours ago", desc: "Cash reserves dropped below 12x of Q3 average burn rate. High risk prior to Series B execution.", color: "text-rose-400 border-rose-500/20 bg-rose-500/5" },
    { id: 3, title: "Negative Gross Margin", target: "UrbanStash", risk: "Medium", time: "1 day ago", desc: "Gross margins dropped to -4.2% due to increased distribution and third-party logistics overhead.", color: "text-amber-400 border-amber-500/20 bg-amber-500/5" },
    { id: 4, title: "Rapid Burn Increase", target: "HealthSync", risk: "Medium", time: "1 day ago", desc: "Monthly cash burn rate expanded by 22% MoM. Principal driver identified as marketing spend expansion.", color: "text-amber-400 border-amber-500/20 bg-amber-500/5" },
    { id: 5, title: "Unusual Revenue Spike", target: "PayFlow", risk: "Low", time: "2 days ago", desc: "ARR jumped by 14% within 14 days, triggered by expansion of 3 major customer contracts. Positive signal.", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" }
  ]);

  const handleDismiss = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div className="flex flex-col h-full w-full space-y-6 text-zinc-300 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-geist tracking-tight text-white flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-500" /> AI Alerts & Notifications
          </h1>
          <p className="text-zinc-500 text-xs mt-1">Autonomous risk identification and operational signals.</p>
        </div>
        <button 
          onClick={() => setAlerts([])}
          className="flex items-center gap-2 px-3 py-1.5 border border-zinc-800 bg-zinc-900 text-zinc-400 rounded-lg text-xs font-semibold hover:bg-zinc-800"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear All
        </button>
      </div>

      {/* List of Alerts */}
      <div className="space-y-4 max-w-4xl">
        {alerts.length === 0 ? (
          <div className="bg-zinc-950/40 border border-zinc-900/60 p-12 rounded-xl text-center">
            <Check className="h-10 w-10 text-emerald-500 mx-auto mb-3 opacity-60" />
            <h3 className="text-zinc-200 font-bold text-sm">All clear!</h3>
            <p className="text-zinc-500 text-xs mt-1">No active AI alerts or risk triggers found across the portfolio.</p>
          </div>
        ) : (
          alerts.map(a => (
            <div 
              key={a.id} 
              className={`p-5 border rounded-xl flex gap-4 items-start ${a.color} relative group transition-colors`}
            >
              <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-zinc-100 text-sm tracking-tight">{a.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-white bg-black/40 px-2 py-0.5 rounded border border-white/5">{a.target}</span>
                      <span className="text-[10px] text-zinc-500">{a.time}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-black/30 border border-white/10">Risk: {a.risk}</span>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed max-w-2xl">{a.desc}</p>
              </div>
              <button 
                onClick={() => handleDismiss(a.id)}
                className="opacity-0 group-hover:opacity-100 absolute top-4 right-4 p-1 text-zinc-500 hover:text-zinc-300 transition-opacity"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
