"use client";

import { 
  Bell, Check, Settings, Mail, Smartphone, 
  MessageSquare, Circle, AlertCircle, FileText,
  Clock, Hash, MoreHorizontal, CheckCircle2, SlidersHorizontal
} from "lucide-react";
import { useState } from "react";

export default function NotificationCenterModule() {
  const [activeTab, setActiveTab] = useState("inbox");

  const notifications = [
    { id: 1, type: "mention", title: "Elena Smith mentioned you in Acme Corp", desc: "@JD, I've uploaded the actuals. Let me know if you need the raw bank extracts.", time: "10m ago", read: false, icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-500/10" },
    { id: 2, type: "system", title: "AI Due Diligence Complete", desc: "The automated scan for FinSync is complete. 2 high-risk vendor lock-in items found.", time: "1h ago", read: false, icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-500/10" },
    { id: 3, type: "deal", title: "Deal Moved: LendAI", desc: "LendAI was moved to 'IC Review' by Alice Kim.", time: "3h ago", read: true, icon: FileText, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { id: 4, type: "system", title: "Daily Digest", desc: "You have 3 tasks due today and 1 upcoming IC meeting.", time: "Yesterday", read: true, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="flex flex-col h-full w-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border border-border p-6 rounded-xl">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-geist font-bold flex items-center gap-2">
              <Bell className="h-6 w-6"/> Notification Center
            </h1>
            <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full">2 New</span>
          </div>
          <p className="text-sm text-muted-foreground">Manage your realtime alerts and routing preferences.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            <button 
              onClick={() => setActiveTab("inbox")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'inbox' ? 'bg-zinc-800 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Inbox
            </button>
            <button 
              onClick={() => setActiveTab("preferences")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'preferences' ? 'bg-zinc-800 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Preferences
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-card border border-border rounded-xl flex overflow-hidden">
        
        {activeTab === "inbox" ? (
          <div className="flex flex-col w-full h-full">
            {/* Inbox Toolbar */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-zinc-900/50">
               <div className="flex gap-2">
                 <button className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-md hover:bg-zinc-700 transition-colors">All</button>
                 <button className="text-xs text-muted-foreground px-3 py-1.5 rounded-md hover:bg-zinc-800 hover:text-foreground transition-colors">Unread</button>
                 <button className="text-xs text-muted-foreground px-3 py-1.5 rounded-md hover:bg-zinc-800 hover:text-foreground transition-colors">Mentions</button>
               </div>
               <button className="text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                 <CheckCircle2 className="h-4 w-4" /> Mark all as read
               </button>
            </div>

            {/* Notification Stream */}
            <div className="flex-1 overflow-y-auto">
              <div className="divide-y divide-border">
                {notifications.map(notif => (
                  <div key={notif.id} className={`flex gap-4 p-5 hover:bg-zinc-900/50 transition-colors cursor-pointer group ${!notif.read ? 'bg-blue-500/[0.02]' : ''}`}>
                    <div className="mt-1 relative shrink-0">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center border ${notif.bg} border-border`}>
                        <notif.icon className={`h-4 w-4 ${notif.color}`} />
                      </div>
                      {!notif.read && (
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full border-2 border-card"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm ${!notif.read ? 'font-bold text-foreground' : 'font-medium text-zinc-300'}`}>{notif.title}</h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{notif.time}</span>
                      </div>
                      <p className={`text-sm ${!notif.read ? 'text-zinc-300' : 'text-muted-foreground'}`}>{notif.desc}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-zinc-800">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row w-full h-full">
            
            {/* Preferences Sidebar */}
            <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-border p-4 bg-zinc-900/30">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Routing Channels</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-2 rounded-lg bg-zinc-800 text-sm font-medium">
                  <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> Email</span>
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                </button>
                <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <span className="flex items-center gap-2"><Smartphone className="h-4 w-4" /> Push</span>
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                </button>
                <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <span className="flex items-center gap-2"><Hash className="h-4 w-4" /> Slack</span>
                  <span className="text-[10px] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700">Connect</span>
                </button>
                <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <span className="flex items-center gap-2"><Users className="h-4 w-4" /> MS Teams</span>
                  <span className="text-[10px] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700">Connect</span>
                </button>
              </div>
            </div>

            {/* Preferences Main */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-2xl">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2"><SlidersHorizontal className="h-5 w-5" /> Email Notification Rules</h2>
                
                <div className="space-y-6">
                  
                  {/* Category Group */}
                  <div className="border border-border rounded-xl overflow-hidden">
                    <div className="bg-zinc-900/50 p-4 border-b border-border">
                      <h4 className="font-semibold text-sm">Deal Flow & Pipeline</h4>
                      <p className="text-xs text-muted-foreground mt-1">Alerts regarding stage changes and approvals.</p>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Stage changes</span>
                        <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 bg-white w-3 h-3 rounded-full"></div></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">IC Approvals required</span>
                        <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 bg-white w-3 h-3 rounded-full"></div></div>
                      </div>
                    </div>
                  </div>

                  {/* Category Group */}
                  <div className="border border-border rounded-xl overflow-hidden">
                    <div className="bg-zinc-900/50 p-4 border-b border-border">
                      <h4 className="font-semibold text-sm">Collaboration</h4>
                      <p className="text-xs text-muted-foreground mt-1">Mentions, task assignments, and comments.</p>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Direct Mentions (@)</span>
                        <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 bg-white w-3 h-3 rounded-full"></div></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Task assignments</span>
                        <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 bg-white w-3 h-3 rounded-full"></div></div>
                      </div>
                    </div>
                  </div>

                  {/* Digest Settings */}
                  <div className="border border-border rounded-xl overflow-hidden">
                    <div className="bg-zinc-900/50 p-4 border-b border-border">
                      <h4 className="font-semibold text-sm">Daily Digest</h4>
                      <p className="text-xs text-muted-foreground mt-1">Receive a daily summary of all activity instead of realtime alerts.</p>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Enable Daily Digest</span>
                        <div className="w-10 h-5 bg-zinc-800 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 bg-zinc-500 w-3 h-3 rounded-full"></div></div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border">
                        <label className="text-xs text-muted-foreground block mb-2">Digest Delivery Time</label>
                        <select className="bg-zinc-900 border border-zinc-800 rounded-md text-sm px-3 py-2 focus:outline-none focus:border-blue-500 text-zinc-300 w-full max-w-[200px]" disabled>
                          <option>8:00 AM Local</option>
                        </select>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
