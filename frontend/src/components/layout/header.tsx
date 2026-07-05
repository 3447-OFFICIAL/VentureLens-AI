import React from 'react';
import { Search, Bell, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search deals, documents, or ask AI (Ctrl+K)..." 
            className="block w-full pl-10 pr-3 py-2 border border-input rounded-md leading-5 bg-muted/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-background transition-all sm:text-sm"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="inline-flex items-center border bg-background px-1.5 text-[10px] font-medium text-muted-foreground rounded h-5">
              Ctrl K
            </kbd>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 ml-4">
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
        </button>
        
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 cursor-pointer">
          <User className="h-4 w-4 text-primary" />
        </div>
      </div>
    </header>
  );
}
