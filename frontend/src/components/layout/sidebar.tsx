'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  Files, 
  Bot, 
  Settings 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { label: 'Pipeline', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Portfolio', href: '/portfolio', icon: Briefcase },
    { label: 'Documents', href: '/documents', icon: Files },
    { label: 'AI Copilot', href: '/ai', icon: Bot },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col z-20">
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 font-semibold text-lg tracking-tight"
        >
          <div className="size-6 bg-primary rounded-[6px] flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <span className="text-primary-foreground text-xs font-bold">V</span>
          </div>
          VentureLens AI
        </motion.div>
      </div>
      
      <motion.nav 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 py-6 px-3 space-y-1"
      >
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <motion.div key={item.href} variants={itemVariants}>
              <Link 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-primary/10 text-primary shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <item.icon className={`size-4 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </motion.nav>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 border-t border-border/50"
      >
        <div className="bg-muted/30 rounded-xl p-4 shadow-sm ring-1 ring-border/50 backdrop-blur-sm">
          <p className="font-semibold text-foreground text-sm mb-1 tracking-tight">Pro Plan</p>
          <p className="text-muted-foreground text-xs mb-3">4,500 / 10,000 AI Credits</p>
          <div className="w-full bg-background rounded-full h-1.5 ring-1 ring-border/50 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '45%' }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" 
            />
          </div>
        </div>
      </motion.div>
    </aside>
  );
}
