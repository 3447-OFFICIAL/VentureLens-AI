"use client";

import { CheckSquare, Calendar, User, Tag, Flag, MessageSquare, Zap, Bell, MoreHorizontal, Search, Filter, Plus, Send, Paperclip } from "lucide-react";
import { useState } from "react";

export default function TaskManagementModule() {
  const [activeTask, setActiveTask] = useState<number | null>(1);

  const tasks = [
    { id: 1, title: "Review Acme Corp Q3 Financials", priority: "high", status: "todo", due: "Today", assignee: "JD", company: "Acme Corp", comments: 3 },
    { id: 2, title: "Draft Investment Memo for LendAI", priority: "medium", status: "in_progress", due: "Nov 12", assignee: "ES", company: "LendAI", comments: 8 },
    { id: 3, title: "Schedule Partner Pitch with FinSync", priority: "low", status: "done", due: "Nov 10", assignee: "AK", company: "FinSync", comments: 0 },
    { id: 4, title: "Request AWS architecture diagram", priority: "high", status: "todo", due: "Nov 14", assignee: "JD", company: "Acme Corp", comments: 1 }
  ];

  return (
    <div className="flex flex-col h-full w-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-geist font-bold flex items-center gap-2">
              <CheckSquare className="h-6 w-6"/> Task Management
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">Deal flow action items and team collaboration.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search tasks..." className="bg-zinc-900 border border-zinc-800 rounded-md text-sm pl-9 pr-4 py-1.5 focus:outline-none focus:border-blue-500 text-zinc-300" />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-foreground rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors">
            <Filter className="h-4 w-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90">
            <Plus className="h-4 w-4" /> New Task
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        
        {/* Main Task List */}
        <div className={`flex flex-col gap-2 ${activeTask ? 'hidden lg:flex lg:w-[60%]' : 'w-full'}`}>
          
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
            <div className="w-6"></div>
            <div>Task</div>
            <div className="w-24">Company</div>
            <div className="w-20">Priority</div>
            <div className="w-20">Due</div>
            <div className="w-8"></div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-2">
            {tasks.map(task => (
              <div 
                key={task.id}
                onClick={() => setActiveTask(task.id)}
                className={`grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                  activeTask === task.id ? 'bg-zinc-900/80 border-zinc-700' : 'bg-card border-transparent hover:bg-zinc-900/40 hover:border-zinc-800'
                }`}
              >
                <div className="w-6 flex items-center justify-center">
                  <div className={`h-4 w-4 rounded border ${task.status === 'done' ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`}>
                    {task.status === 'done' && <CheckSquare className="h-3 w-3 text-white absolute" />}
                  </div>
                </div>
                <div>
                  <p className={`text-sm font-medium ${task.status === 'done' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{task.title}</p>
                  {task.comments > 0 && (
                     <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                       <MessageSquare className="h-3 w-3" /> {task.comments} Comments
                     </div>
                  )}
                </div>
                <div className="w-24">
                  <span className="text-[10px] px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-300 truncate block text-center">{task.company}</span>
                </div>
                <div className="w-20">
                  <span className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1 w-fit ${
                    task.priority === 'high' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                    task.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}>
                    <Flag className="h-3 w-3" /> {task.priority}
                  </span>
                </div>
                <div className="w-20">
                  <span className={`text-xs ${task.due === 'Today' ? 'text-rose-400 font-semibold' : 'text-muted-foreground'}`}>{task.due}</span>
                </div>
                <div className="w-8 flex justify-end">
                  <div className="h-6 w-6 rounded-full bg-blue-900 text-blue-400 flex items-center justify-center text-[10px] font-bold border border-blue-500/30">
                    {task.assignee}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Detail Pane */}
        {activeTask && (
          <div className="w-full lg:w-[40%] bg-card border border-border rounded-xl flex flex-col overflow-hidden">
            
            {/* Detail Header */}
            <div className="p-4 border-b border-border flex justify-between items-start bg-zinc-900/50">
              <div className="flex gap-3">
                <div className="mt-1 h-5 w-5 rounded border border-zinc-600 shrink-0"></div>
                <div>
                  <h2 className="font-semibold text-lg leading-tight">Review Acme Corp Q3 Financials</h2>
                  <div className="flex gap-2 mt-3">
                    <span className="text-[10px] flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-zinc-300"><Calendar className="h-3 w-3"/> Due Today</span>
                    <span className="text-[10px] flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded text-rose-500"><Flag className="h-3 w-3"/> High Priority</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 text-muted-foreground hover:text-foreground rounded"><Bell className="h-4 w-4" /></button>
                <button className="p-1.5 text-muted-foreground hover:text-foreground rounded"><MoreHorizontal className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Properties */}
              <div className="grid grid-cols-[100px_1fr] gap-y-4 text-sm">
                <div className="text-muted-foreground flex items-center gap-2"><User className="h-4 w-4" /> Assignee</div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-900 text-blue-400 flex items-center justify-center text-[10px] font-bold border border-blue-500/30">JD</div>
                  <span className="font-medium text-zinc-200">John Doe</span>
                </div>

                <div className="text-muted-foreground flex items-center gap-2"><Tag className="h-4 w-4" /> Labels</div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">Financial DD</span>
                  <span className="text-[10px] px-2 py-0.5 rounded border border-purple-500/20 bg-purple-500/10 text-purple-400">Pre-IC</span>
                  <button className="text-[10px] px-2 py-0.5 rounded border border-dashed border-zinc-600 text-muted-foreground hover:text-foreground hover:border-zinc-500 transition-colors">+ Add</button>
                </div>

                <div className="text-muted-foreground flex items-center gap-2"><Zap className="h-4 w-4" /> Automation</div>
                <div>
                  <span className="text-xs text-blue-400 flex items-center gap-1 bg-blue-500/10 w-fit px-2 py-1 rounded border border-blue-500/20">
                    <Zap className="h-3 w-3" fill="currentColor" /> When Done &rarr; Notify Partners
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Description</h4>
                <div className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/30 p-3 rounded-lg border border-zinc-800">
                  <p>Check the burn rate against the model projected in v2 of the pitch deck. Make sure to flag any discrepancies larger than 5%.</p>
                  <div className="flex items-center gap-2 mt-3 bg-card border border-border p-2 rounded w-fit text-xs text-blue-400 cursor-pointer hover:border-blue-500 transition-colors">
                    <Paperclip className="h-3 w-3" /> Acme_Q3_Actuals.xlsx
                  </div>
                </div>
              </div>

              {/* Mentions & Comments */}
              <div className="border-t border-border pt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Activity & Comments</h4>
                
                <div className="space-y-4 mb-4">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-900 text-emerald-400 flex items-center justify-center shrink-0 text-[10px] font-bold border border-emerald-500/30">ES</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold">Elena Smith</span>
                        <span className="text-[10px] text-muted-foreground">Yesterday, 4:22 PM</span>
                      </div>
                      <p className="text-sm text-zinc-300">Hey <span className="text-blue-400 font-medium">@JD</span>, I&apos;ve uploaded the actuals. Let me know if you need the raw bank extracts.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-2 flex flex-col gap-2">
                  <textarea rows={2} placeholder="Add a comment... (Type @ to mention)" className="bg-transparent border-none outline-none text-sm w-full text-zinc-300 resize-none placeholder:text-zinc-600" />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1 text-muted-foreground">
                      <button className="p-1 hover:text-foreground rounded"><Paperclip className="h-4 w-4" /></button>
                      <button className="p-1 hover:text-foreground rounded">@</button>
                    </div>
                    <button className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-xs font-medium hover:opacity-90 flex items-center gap-2">
                      <Send className="h-3 w-3" /> Send
                    </button>
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
