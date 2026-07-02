"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { CheckSquare, Square, Calendar, Plus, Filter, Trash2, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

type Task = {
  id: string;
  title: string;
  priority: string;
  due: string | null;
  completed: boolean;
};

const taskSchema = z.object({
  title: z.string().min(3, "Task description must be at least 3 characters"),
  priority: z.enum(["High", "Medium", "Low"]),
  due: z.string().min(1, "Due date description is required"),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export default function TasksView() {
  const queryClient = useQueryClient();
  const [filterPriority, setFilterPriority] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Completed">("All");

  // Fetch Tasks
  const { data: tasks = [], isLoading, isError } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/tasks");
      return res.data;
    }
  });

  // Create Task Mutation
  const createTaskMutation = useMutation({
    mutationFn: async (data: TaskFormValues) => {
      const res = await apiClient.post("/api/v1/tasks", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      reset();
    },
    onError: () => {
      alert("Failed to add task.");
    }
  });

  // Toggle Task Mutation
  const toggleTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const res = await apiClient.patch(`/api/v1/tasks/${taskId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: "", priority: "Medium", due: "Due today" }
  });

  const onSubmit = (data: TaskFormValues) => {
    createTaskMutation.mutate(data);
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesPriority = filterPriority === "All" || task.priority === filterPriority;
    const matchesStatus = 
      filterStatus === "All" || 
      (filterStatus === "Active" && !task.completed) || 
      (filterStatus === "Completed" && task.completed);
    return matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Action Items & Tasks</h2>
        <p className="text-xs text-slate-400 mt-0.5">Organize daily workflows, checklist evaluations, and investment schedule milestones.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form to add tasks */}
        <div className="bg-[#0b0e14] border border-[#161c28] p-5 rounded-xl space-y-4 h-fit">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Create New Task</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Description</label>
              <input
                type="text"
                {...register("title")}
                className="w-full bg-[#101522] border border-[#1c2438] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. Audit Acme Cap Table"
              />
              {errors.title && <p className="text-red-400 mt-1 text-[10px]">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Priority</label>
                <select
                  {...register("priority")}
                  className="w-full bg-[#101522] border border-[#1c2438] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Due Schedule</label>
                <input
                  type="text"
                  {...register("due")}
                  className="w-full bg-[#101522] border border-[#1c2438] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Due today"
                />
                {errors.due && <p className="text-red-400 mt-1 text-[10px]">{errors.due.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={createTaskMutation.isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>{createTaskMutation.isPending ? "Creating..." : "Create Task"}</span>
            </button>
          </form>
        </div>

        {/* List of Tasks */}
        <div className="lg:col-span-2 bg-[#0b0e14] border border-[#161c28] p-5 rounded-xl space-y-4">
          
          {/* Filters Row */}
          <div className="flex flex-wrap gap-2 items-center justify-between border-b border-[#1c2438] pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">My Task Board</h3>
            
            <div className="flex gap-2 text-[10px]">
              {/* Status Filters */}
              <div className="flex bg-[#101522] border border-[#1c2438] rounded-lg p-0.5">
                {(["All", "Active", "Completed"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                      filterStatus === st 
                        ? "bg-[#1c2438] text-indigo-400 font-semibold" 
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Priority Filters */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-[#101522] border border-[#1c2438] rounded-lg px-2 py-1 text-slate-300 focus:outline-none"
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Task Board Items */}
          {isLoading ? (
            <div className="text-center text-slate-400 text-xs py-8">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center text-slate-500 text-xs py-12 italic">
              No tasks found. Create some action items to stay on track.
            </div>
          ) : (
            <div className="divide-y divide-[#1c2438]/50 max-h-[400px] overflow-y-auto pr-1">
              {filteredTasks.map((task) => (
                <div key={task.id} className="py-3 flex items-start justify-between group transition-colors">
                  <div className="flex items-start space-x-3.5 min-w-0">
                    <button
                      onClick={() => toggleTaskMutation.mutate(task.id)}
                      className="mt-0.5 text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer shrink-0"
                    >
                      {task.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold ${task.completed ? "line-through text-slate-500" : "text-slate-200"}`}>
                        {task.title}
                      </p>
                      {task.due && (
                        <span className="flex items-center text-[9px] text-slate-500 mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{task.due}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${
                    task.priority === "High" 
                      ? "bg-red-950/30 text-red-400 border-red-500/20" 
                      : task.priority === "Medium"
                      ? "bg-amber-950/30 text-amber-400 border-amber-500/20"
                      : "bg-slate-900 text-slate-400 border-slate-700/20"
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
