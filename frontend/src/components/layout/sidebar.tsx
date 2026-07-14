'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { 
  LayoutDashboard, 
  Building2, 
  CheckSquare, 
  FileText, 
  FileJson, 
  Calendar,
  Layers,
  BarChart3,
  Activity,
  Bell,
  Settings,
  Users,
  Database,
  Link2,
  Bot
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  
  const sections = [
    {
      title: 'DEAL FLOW',
      items: [
        { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
        { label: 'Companies', href: '/dashboard/companies', icon: Building2 },
        { label: 'Due Diligence', href: '/dashboard/dd', icon: CheckSquare },
        { label: 'AI Reports', href: '/dashboard/reports', icon: FileText },
        { label: 'Investment Memos', href: '/dashboard/memos', icon: FileJson },
        { label: 'Tasks', href: '/dashboard/tasks', icon: Calendar },
      ]
    },
    {
      title: 'PORTFOLIO',
      items: [
        { label: 'Portfolio Companies', href: '/dashboard/portfolio', icon: Layers },
        { label: 'KPIs & Metrics', href: '/dashboard/kpis', icon: BarChart3 },
        { label: 'Analytics', href: '/dashboard/analytics', icon: Activity },
        { label: 'Alerts', href: '/dashboard/alerts', icon: Bell },
      ]
    },
    {
      title: 'INVESTMENT COMMITTEE',
      items: [
        { label: 'Committee Decks', href: '/dashboard/ic?tab=decks', icon: FileJson },
        { label: 'Meetings', href: '/dashboard/ic?tab=meetings', icon: Calendar },
        { label: 'Decisions', href: '/dashboard/ic?tab=decisions', icon: CheckSquare },
      ]
    },
    {
      title: 'DATA & INTEGRATIONS',
      items: [
        { label: 'Data Rooms', href: '/dashboard/search?tab=rooms', icon: Database },
        { label: 'Integrations', href: '/dashboard/search?tab=integrations', icon: Link2 },
      ]
    },
    {
      title: 'ADMIN',
      items: [
        { label: 'Users & Teams', href: '/dashboard/settings?tab=users', icon: Users },
        { label: 'Settings', href: '/dashboard/settings', icon: Settings, exact: true },
      ]
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r border-border/40 bg-zinc-950 flex flex-col z-20 text-zinc-400 select-none">
      <div className="h-16 flex flex-col justify-center px-6 border-b border-border/40 bg-zinc-950/50">
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 font-geist font-bold text-base text-foreground tracking-tight"
        >
          <div className="size-6 bg-blue-600 rounded-[6px] flex items-center justify-center shadow-[0_0_12px_rgba(37,99,235,0.4)]">
            <span className="text-white text-xs font-bold font-mono">V</span>
          </div>
          <div className="flex flex-col">
            <span className="leading-tight text-zinc-100 font-semibold text-sm">VentureLens AI</span>
            <span className="text-[10px] text-zinc-500 font-medium tracking-wide">AI Due Diligence Copilot</span>
          </div>
        </motion.div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5 custom-scrollbar">
        <motion.nav 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-5"
        >
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="px-3 text-[10px] font-bold tracking-wider text-zinc-600 uppercase font-geist">
                {section.title}
              </h4>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = item.exact 
                    ? pathname === item.href 
                    : pathname?.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard');
                  
                  return (
                    <motion.div key={item.href} variants={itemVariants}>
                      <Link 
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 group ${
                          isActive 
                            ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                            : 'border border-transparent hover:text-zinc-200 hover:bg-zinc-900/40'
                        }`}
                      >
                        <item.icon className={`size-3.5 transition-transform duration-200 ${isActive ? 'scale-105 text-blue-400' : 'text-zinc-500 group-hover:scale-105'}`} />
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </motion.nav>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 border-t border-border/40 bg-zinc-950/80"
      >
        <div className="bg-zinc-900/40 border border-border/40 rounded-lg p-3 shadow-inner relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-zinc-200 text-xs tracking-tight">VentureLens AI</span>
          </div>
          <p className="text-zinc-500 text-[10px] leading-tight">Enterprise Plan Active</p>
        </div>
      </motion.div>
    </aside>
  );
}
