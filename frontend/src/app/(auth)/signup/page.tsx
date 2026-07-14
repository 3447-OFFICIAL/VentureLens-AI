"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [tenantName, setTenantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password, 
          tenant_name: tenantName 
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Failed to create account");
      }
      
      localStorage.setItem("access_token", data.access_token);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden text-zinc-300 font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-background to-background"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 font-geist font-bold text-2xl tracking-tighter mb-2 text-white">
            VentureLens AI
          </div>
          <p className="text-zinc-500">Start your enterprise trial</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-2xl glass">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs p-3 rounded-lg mb-4 font-semibold">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Firm / Organization Name</label>
              <input 
                type="text" 
                required
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-white"
                placeholder="Acme Capital"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Work Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-white"
                placeholder="name@firm.com"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Password</label>
              <input 
                type="password"
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-white"
                placeholder="••••••••"
              />
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 mt-6"
            >
              {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-500">
            Already have an account? <Link href="/login" className="text-white hover:underline font-medium">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
