import React from 'react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Deal Pipeline</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage and evaluate your active investment opportunities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric Cards */}
        {[
          { label: 'Active Deals', value: '24', change: '+3 this week' },
          { label: 'Avg AI Conviction', value: '78%', change: '+5% vs last month' },
          { label: 'Total Capital Deployed', value: '$12.4M', change: 'Fund I' }
        ].map((metric, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(59,130,246,0.3)" }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="bg-card border border-border/50 rounded-xl p-5 shadow-sm transition-colors"
          >
            <h3 className="text-sm font-medium text-muted-foreground">{metric.label}</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-foreground">{metric.value}</span>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full ring-1 ring-primary/20">{metric.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-background border rounded-xl shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-4 border-b bg-muted/20">
          <h3 className="font-semibold text-foreground">Recent Activity</h3>
        </div>
        <div className="p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="text-xl">📊</span>
          </div>
          <h4 className="text-sm font-medium text-foreground">No deals found in pipeline</h4>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Connect your email or manually upload a pitch deck to let the AI Copilot begin evaluation.
          </p>
          <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm">
            Upload Pitch Deck
          </button>
        </div>
      </div>
    </div>
  );
}
