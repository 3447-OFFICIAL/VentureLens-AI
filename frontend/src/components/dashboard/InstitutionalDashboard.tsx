"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  BarChart3, 
  Briefcase, 
  Clock, 
  FileText, 
  FolderOpen, 
  HelpCircle, 
  Bell, 
  Search, 
  ChevronRight, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Activity, 
  Layers, 
  CheckSquare, 
  Plus, 
  MoreVertical, 
  ChevronDown 
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/lib/store/use-auth-store";
import { useDashboardStore } from "@/lib/store/use-dashboard-store";

type Task = {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  due: string;
  completed: boolean;
};

type Alert = {
  id: string;
  title: string;
  company: string;
  score: string;
  severity: "High" | "Medium" | "Low";
  time: string;
};

type Startup = {
  id: string;
  name: string;
  domain?: string;
  vc_firm_id: string;
};

export default function InstitutionalDashboard() {
  const { isSignedIn, user, checkAuth, logout, loading } = useAuthStore();
  const { activeTab, setActiveTab } = useDashboardStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Chat Widget States
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!loading && !isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, loading, router]);

  // Fetch Tasks
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/tasks");
      return res.data;
    },
    enabled: isSignedIn
  });

  // Fetch Alerts
  const { data: alerts = [] } = useQuery<Alert[]>({
    queryKey: ["alerts"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/alerts");
      return res.data;
    },
    enabled: isSignedIn
  });

  // Fetch Startups List
  const { data: startups = [] } = useQuery<Startup[]>({
    queryKey: ["startups"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/startups");
      return res.data;
    },
    enabled: isSignedIn
  });

  // Toggle Task Completion Mutation
  const toggleTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const res = await apiClient.patch(`/api/v1/tasks/${taskId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });

  if (loading || !isSignedIn) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#080b11] text-slate-100 font-medium">
        Loading VentureLens Terminal...
      </div>
    );
  }

  // Sparkline data for charts
  const sparkData = [
    { value: 10 }, { value: 15 }, { value: 12 }, { value: 18 }, { value: 16 }, { value: 24 }
  ];

  // Streaming AI Chat handler
  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setIsChatLoading(true);
    setChatResponse("");
    const token = localStorage.getItem("user_token");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: chatInput })
      });

      if (!response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      setChatInput("");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        // Process SSE lines
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const word = line.replace("data: ", "");
            setChatResponse((prev) => prev + " " + word);
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setChatResponse("Error connecting to Gemini AI copilot.");
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#080b11] text-slate-100 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#161c28] bg-[#0b0e14] flex flex-col justify-between shrink-0">
        <div className="flex flex-col overflow-y-auto px-4 py-6 space-y-8">
          
          <div className="flex items-center space-x-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg">
              V
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-wide text-white">VentureLens AI</h1>
              <p className="text-[10px] text-slate-500">AI Due Diligence Copilot</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-600 tracking-wider px-2 mb-2">Deal Flow</p>
              <nav className="space-y-1">
                {[
                  { name: "Overview", icon: Layers },
                  { name: "Companies", icon: Briefcase },
                  { name: "Due Diligence", icon: Clock },
                  { name: "AI Reports", icon: FileText },
                  { name: "Investment Memos", icon: FolderOpen },
                  { name: "Tasks", icon: CheckSquare }
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                      activeTab === item.name 
                        ? "bg-[#181f30] text-indigo-400 font-medium" 
                        : "text-slate-400 hover:bg-[#0f141f] hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-600 tracking-wider px-2 mb-2">Portfolio</p>
              <nav className="space-y-1">
                {[
                  { name: "Portfolio Companies", icon: Briefcase },
                  { name: "KPIs & Metrics", icon: BarChart3 },
                  { name: "Analytics", icon: Activity },
                  { name: "Alerts", icon: AlertTriangle }
                ].map((item) => (
                  <button
                    key={item.name}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:bg-[#0f141f] hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#161c28]">
          <div className="bg-[#101520] p-3 rounded-lg border border-[#1d263b] flex items-center justify-between">
            <div>
              <h4 className="text-[11px] font-semibold text-white">VentureLens AI</h4>
              <p className="text-[9px] text-slate-500">Enterprise Plan</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header bar */}
        <header className="h-16 border-b border-[#161c28] bg-[#0b0e14] px-6 flex items-center justify-between shrink-0">
          <div className="w-96 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search companies, investors, documents, metrics..." 
              className="w-full bg-[#101522] border border-[#1c2438] rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-1.5 text-slate-400 hover:text-slate-200 cursor-pointer">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
            </button>
            <button className="p-1.5 text-slate-400 hover:text-slate-200 cursor-pointer">
              <HelpCircle className="w-4.5 h-4.5" />
            </button>
            <div className="flex items-center space-x-3 pl-2 border-l border-[#1c2438]">
              <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
                  alt="Arjun Mehta" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left shrink-0 hidden sm:block">
                <p className="text-xs font-semibold text-slate-200">Arjun Mehta</p>
                <p className="text-[10px] text-slate-500">Partner</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          
          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Good morning, Arjun 👋</h2>
                <p className="text-xs text-slate-400 mt-1">Here's what's happening with your portfolio and deal flow.</p>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { title: "Deal Flow", val: "24", sub: "New companies", rate: "+33%", color: "#6366f1" },
                { title: "Under Review", val: "12", sub: "Active diligences", rate: "+20%", color: "#3b82f6" },
                { title: "Portfolio Value", val: "$128.4M", sub: "Total portfolio value", rate: "▲ 18.7%", color: "#10b981" },
                { title: "IRR (Net)", val: "24.6%", sub: "Portfolio Net IRR", rate: "▲ 4.3%", color: "#f59e0b" },
                { title: "Dry Powder", val: "$45.2M", sub: "Available to invest", rate: "▲ 7.2%", color: "#ec4899" }
              ].map((m, i) => (
                <div key={i} className="bg-[#0b0e14] border border-[#161c28] rounded-xl p-4 flex flex-col justify-between h-36">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">{m.title}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">{m.rate}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-2">{m.val}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">{m.sub}</p>
                  </div>
                  <div className="h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparkData}>
                        <defs>
                          <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={m.color} stopOpacity={0.4}/>
                            <stop offset="95%" stopColor={m.color} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke={m.color} strokeWidth={1.5} fill={`url(#grad-${i})`} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Sections depending on active tab */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Pipeline Overview */}
              <div className="bg-[#0b0e14] border border-[#161c28] rounded-xl p-5 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">Pipeline Overview</h4>
                </div>
                
                <div className="flex items-center space-x-6 flex-1">
                  <div className="w-1/2 flex justify-center py-4">
                    <svg viewBox="0 0 200 160" className="w-48 h-auto">
                      <polygon points="10,10 190,10 165,30 35,30" fill="#4f46e5" opacity="0.9" />
                      <polygon points="35,33 165,33 140,55 60,55" fill="#3b82f6" opacity="0.9" />
                      <polygon points="60,58 140,58 120,80 80,80" fill="#10b981" opacity="0.9" />
                      <polygon points="80,83 120,83 105,105 95,105" fill="#f59e0b" opacity="0.9" />
                      <polygon points="95,108 105,108 102,125 98,125" fill="#ec4899" opacity="0.9" />
                    </svg>
                  </div>
                  
                  <div className="flex-1 space-y-2 text-xs">
                    {[
                      { name: "Total Incoming", count: 156, color: "bg-indigo-600" },
                      { name: "Initial Screening", count: 68, color: "bg-blue-500" },
                      { name: "Due Diligence", count: 24, color: "bg-emerald-500" },
                      { name: "Partner Review", count: 12, color: "bg-amber-500" },
                      { name: "IC Review", count: 6, color: "bg-pink-500" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                          <span className="text-slate-400 text-[10px]">{item.name}</span>
                        </div>
                        <span className="font-semibold text-[10px]">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Portfolio Health */}
              <div className="bg-[#0b0e14] border border-[#161c28] rounded-xl p-5 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">Portfolio Health</h4>
                </div>

                <div className="flex items-center justify-between flex-1">
                  <div className="relative w-1/2 flex justify-center py-4">
                    <svg viewBox="0 0 120 120" className="w-36 h-36">
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#ef4444" strokeWidth="8" strokeDasharray="280" strokeDashoffset="240" strokeLinecap="round" />
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#f59e0b" strokeWidth="8" strokeDasharray="280" strokeDashoffset="180" strokeLinecap="round" />
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#3b82f6" strokeWidth="8" strokeDasharray="280" strokeDashoffset="100" strokeLinecap="round" />
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="280" strokeDashoffset="0" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Overall Score</p>
                      <h3 className="text-2xl font-bold text-white mt-1">78</h3>
                      <p className="text-[9px] text-emerald-400 font-semibold mt-0.5">Good</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2.5 text-xs pl-4">
                    {[
                      { name: "Excellent (80-100)", count: 6, color: "bg-emerald-500" },
                      { name: "Good (60-79)", count: 8, color: "bg-blue-500" },
                      { name: "Average (40-59)", count: 3, color: "bg-amber-500" },
                      { name: "At Risk (20-39)", count: 2, color: "bg-orange-500" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                          <span className="text-slate-400 text-[10px]">{item.name}</span>
                        </div>
                        <span className="font-semibold text-[10px]">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Startups Table List */}
            <div className="bg-[#0b0e14] border border-[#161c28] rounded-xl p-5">
              <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-4">Startups Under Review</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#1c2438] text-slate-500">
                      <th className="py-3 font-semibold text-[10px] uppercase">Company</th>
                      <th className="py-3 font-semibold text-[10px] uppercase">Domain</th>
                      <th className="py-3 font-semibold text-[10px] uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#161c28]/50">
                    {startups.map((comp) => (
                      <tr key={comp.id} className="hover:bg-[#0f1421]/30">
                        <td className="py-3 font-semibold text-slate-200">{comp.name}</td>
                        <td className="py-3 text-slate-400">{comp.domain}</td>
                        <td className="py-3">
                          <button className="text-indigo-400 hover:text-indigo-300 cursor-pointer">Analyze Deck</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </main>

          {/* Right Sidebar - Live Tasks, Alerts & Streaming Chat */}
          <aside className="w-80 border-l border-[#161c28] bg-[#0b0e14] flex flex-col justify-between shrink-0 overflow-y-auto px-5 py-6 space-y-6">
            
            {/* My Tasks Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">My Tasks</h4>
              </div>
              <div className="space-y-2.5">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-[#101522] border border-[#1c2438] p-3 rounded-lg flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <input 
                        type="checkbox" 
                        checked={task.completed}
                        onChange={() => toggleTaskMutation.mutate(task.id)}
                        className="mt-1 rounded bg-[#101522] border-[#1c2438] text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                      />
                      <div>
                        <p className={`text-xs font-semibold ${task.completed ? "line-through text-slate-500" : "text-slate-200"}`}>{task.title}</p>
                        <p className="text-[9px] text-slate-500 mt-1">{task.due}</p>
                      </div>
                    </div>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded border bg-red-500/10 text-red-400 border-red-500/20">
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Alerts Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">AI Alerts</h4>
              </div>
              <div className="space-y-2.5">
                {alerts.map((alert) => (
                  <div key={alert.id} className="bg-[#101522] border border-[#1c2438] p-3 rounded-lg flex items-start space-x-3">
                    <div className="mt-0.5 p-1 rounded bg-[#1b1c24]">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-semibold text-slate-200">{alert.title}</p>
                        <span className="text-[8px] text-slate-500">{alert.time}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1 text-[9px]">
                        <span className="text-slate-400 font-medium">{alert.company}</span>
                        <span className="font-semibold text-red-400">{alert.score}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Streaming AI Chat Widget */}
            <div className="bg-gradient-to-tr from-slate-900 to-[#10141f] border border-[#1d263b] rounded-xl p-4 relative overflow-hidden shrink-0 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center font-bold text-[9px] text-white">
                    V
                  </div>
                  <h4 className="text-xs font-bold text-white">Ask VentureLens AI</h4>
                </div>
                <div className="text-[10px] text-slate-300 mt-2 leading-relaxed max-h-24 overflow-y-auto pr-1">
                  {chatResponse ? chatResponse : "Ask anything about companies, runway status, or concentration risks..."}
                  {isChatLoading && <span className="inline-block w-1.5 h-3.5 ml-1 bg-indigo-400 animate-pulse"></span>}
                </div>
              </div>
              
              <form onSubmit={handleChatSend} className="mt-4 relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask runway status..." 
                  disabled={isChatLoading}
                  className="w-full bg-[#080b11] border border-[#1c2438] rounded-lg pl-3 pr-8 py-2 text-[10px] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={isChatLoading || !chatInput.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-300 font-semibold text-xs cursor-pointer disabled:opacity-50"
                >
                  →
                </button>
              </form>
            </div>

          </aside>

        </div>

      </div>

    </div>
  );
}
