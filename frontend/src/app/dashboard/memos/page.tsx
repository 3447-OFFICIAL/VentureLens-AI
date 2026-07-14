"use client";

import React, { useEffect, useState } from "react";
import { 
  FileText, Search, Filter, Plus, CheckCircle, 
  ChevronRight, Users, Clock, Sparkles, Loader2, X, Edit, Edit3, Trash2
} from "lucide-react";

interface Memo {
  id: string;
  title: string;
  company_name: string;
  status: string;
  score: number;
  owner: string;
}

export default function InvestmentMemosModule() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Create / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null);
  
  const [newTitle, setNewTitle] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newStatus, setNewStatus] = useState("Draft");
  const [newScore, setNewScore] = useState(70);
  const [newOwner, setNewOwner] = useState("Arjun Mehta");
  const [creating, setCreating] = useState(false);

  const fetchMemos = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Please login first.");
        return;
      }
      setLoading(true);
      setError("");
      
      const res = await fetch("http://127.0.0.1:8000/api/v1/memos/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to load memos.");
      
      const data = await res.json();
      setMemos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemos();
  }, []);

  const openEditModal = (memo: Memo) => {
    setEditingMemo(memo);
    setNewTitle(memo.title);
    setNewCompanyName(memo.company_name);
    setNewStatus(memo.status);
    setNewScore(memo.score);
    setNewOwner(memo.owner);
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingMemo(null);
    setNewTitle("");
    setNewCompanyName("");
    setNewStatus("Draft");
    setNewScore(70);
    setNewOwner("Arjun Mehta");
    setModalOpen(true);
  };

  const handleSaveMemo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompanyName.trim()) return;

    setCreating(true);
    try {
      const token = localStorage.getItem("access_token");
      let res;
      if (editingMemo) {
        // Update Memo (PATCH)
        res = await fetch(`http://127.0.0.1:8000/api/v1/memos/${editingMemo.id}`, {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            title: newTitle,
            company_name: newCompanyName,
            status: newStatus,
            score: parseFloat(newScore.toString()),
            owner: newOwner
          })
        });
      } else {
        // Create Memo (POST)
        res = await fetch("http://127.0.0.1:8000/api/v1/memos/", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            title: newTitle,
            company_name: newCompanyName,
            status: newStatus,
            score: parseFloat(newScore.toString()),
            owner: newOwner
          })
        });
      }

      if (!res.ok) throw new Error("Failed to save memo.");
      
      setModalOpen(false);
      await fetchMemos();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full space-y-6 text-zinc-300 font-sans relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-geist tracking-tight text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-500" /> Investment Memos
          </h1>
          <p className="text-zinc-500 text-xs mt-1">Create and manage investment memorandums.</p>
        </div>
      </div>

      {/* Navigation and Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-zinc-900 pb-2">
        <div className="flex gap-4">
          <button className="pb-3 text-xs font-bold border-b-2 border-blue-500 text-blue-400">All Memos</button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" /> New Memo
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg font-semibold">
          {error}
        </div>
      )}

      {/* Memos Table */}
      <div className="bg-zinc-950/40 border border-border/40 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-zinc-500 border-b border-zinc-900/60 pb-3 font-semibold bg-zinc-950/20">
                  <th className="py-3 px-5">Title</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {memos.map((memo, i) => (
                  <tr key={i} className="border-b border-zinc-900/40 hover:bg-zinc-900/20 last:border-0">
                    <td className="py-3.5 px-5 font-semibold text-white flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-zinc-500" />
                      <span>{memo.title}</span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 font-medium">{memo.company_name}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        memo.status === "Final" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        memo.status === "In Review" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        "bg-zinc-800 text-zinc-400 border-zinc-700"
                      }`}>{memo.status}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        memo.score >= 80 ? "text-emerald-400 border-emerald-400/20 bg-emerald-500/10" :
                        "text-blue-400 border-blue-400/20 bg-blue-500/10"
                      }`}>
                        {memo.score}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="size-5 rounded-full bg-zinc-900 border border-zinc-800 text-[9px] font-bold text-zinc-400 flex items-center justify-center">
                          {memo.owner.split(" ").map((w: string) => w[0]).join("")}
                        </div>
                        <span className="text-zinc-300 font-medium">{memo.owner}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button 
                        onClick={() => openEditModal(memo)}
                        className="inline-flex items-center gap-1 text-[11px] text-blue-400 font-semibold hover:underline"
                      >
                        <Edit3 className="h-3 w-3" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit Memo Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          
          <div className="relative bg-zinc-950 border border-zinc-800 p-6 rounded-xl shadow-2xl w-full max-w-md z-10 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {editingMemo ? "Edit Investment Memo" : "New Investment Memo"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-zinc-500 hover:text-zinc-300"><X className="h-4.5 w-4.5" /></button>
            </div>
            
            <form onSubmit={handleSaveMemo} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-500 font-bold">Memo Title</label>
                <input 
                  type="text" 
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Investment Memo - SynthAI Series A"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-500 font-bold">Company Name</label>
                  <input 
                    type="text" 
                    required
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="SynthAI"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-500 font-bold">Status</label>
                  <select 
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 text-zinc-400 focus:outline-none"
                  >
                    <option value="Draft">Draft</option>
                    <option value="In Review">In Review</option>
                    <option value="Final">Final</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-500 font-bold">Score (0-100)</label>
                  <input 
                    type="number" 
                    required
                    value={newScore}
                    onChange={(e) => setNewScore(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-500 font-bold">Owner</label>
                  <input 
                    type="text" 
                    required
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-900 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-blue-600 hover:opacity-90 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  {creating ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : null}
                  <span>Save Memo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
