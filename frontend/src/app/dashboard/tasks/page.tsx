"use client";

import React, { useEffect, useState } from "react";
import { 
  CheckSquare, Search, Plus, Filter, Calendar, Users, 
  Play, Clock, Trash2, Loader2, Sparkles, AlertCircle
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  priority: string;
  due: string | null;
  assignee: string | null;
  company: string | null;
  status: string;
}

export default function TaskManagementModule() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Create Task Form State
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDue, setNewDue] = useState("Due in 2 days");
  const [newCompany, setNewCompany] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Please login first.");
        return;
      }
      setLoading(true);
      setError("");
      
      const res = await fetch("http://127.0.0.1:8000/api/v1/tasks/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to load tasks.");
      
      const data = await res.json();
      setTasks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleTask = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "done" ? "todo" : "done";
    
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: nextStatus } : t));

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://127.0.0.1:8000/api/v1/tasks/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });

      if (!res.ok) throw new Error("Failed to update status.");
    } catch (err: any) {
      // Revert optimistic update
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: currentStatus } : t));
      alert(err.message);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setCreating(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://127.0.0.1:8000/api/v1/tasks/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTitle,
          priority: newPriority,
          due: newDue,
          company: newCompany || "Global",
          assignee: "JD",
          status: "todo"
        })
      });

      if (!res.ok) throw new Error("Failed to create task.");
      
      setNewTitle("");
      setNewCompany("");
      await fetchTasks();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    // Optimistic update
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://127.0.0.1:8000/api/v1/tasks/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete task.");
    } catch (err: any) {
      await fetchTasks();
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col h-full w-full space-y-6 text-zinc-300 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-geist tracking-tight text-white flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-blue-500" /> Task Management
          </h1>
          <p className="text-zinc-500 text-xs mt-1">Track checklist items and due diligence tasks.</p>
        </div>
      </div>

      {/* Task input form */}
      <form onSubmit={handleCreateTask} className="bg-zinc-950/40 border border-border/40 p-4 rounded-xl flex flex-col md:flex-row gap-3 items-end md:items-center">
        <div className="flex-1 space-y-1 w-full">
          <input 
            type="text" 
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add new diligence task..." 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <input 
          type="text" 
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
          placeholder="Company Name (optional)" 
          className="w-44 bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        />

        <select 
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 text-zinc-400 focus:outline-none"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <button 
          type="submit"
          disabled={creating}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:opacity-90 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shrink-0"
        >
          {creating ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          Add Task
        </button>
      </form>

      {/* Error state */}
      {error && (
        <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg font-semibold">
          {error}
        </div>
      )}

      {/* Checklist list */}
      <div className="bg-zinc-950/40 border border-border/40 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs font-medium">No tasks found. Create one above!</div>
        ) : (
          <div className="divide-y divide-zinc-900/40">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={`p-4 flex items-center justify-between gap-4 hover:bg-zinc-900/20 transition-colors ${
                  task.status === "done" ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={task.status === "done"}
                    onChange={() => handleToggleTask(task.id, task.status)}
                    className="size-4 rounded border-zinc-800 bg-zinc-900 text-blue-500 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <p className={`text-xs font-semibold text-white ${task.status === "done" ? "line-through text-zinc-500" : ""}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-850 px-1.5 py-0.5 rounded font-bold">{task.company}</span>
                      <span className="text-[10px] text-zinc-500 font-medium">{task.due}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                    task.priority === "High" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                    task.priority === "Medium" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                    "bg-zinc-800 text-zinc-400 border-zinc-700"
                  }`}>{task.priority}</span>
                  
                  <button 
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-zinc-600 hover:text-rose-500 transition-colors p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
