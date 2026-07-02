"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/use-auth-store";

export default function Home() {
  const { isSignedIn, user, checkAuth, login, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        {isSignedIn ? (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-300 font-medium">{user?.email}</span>
            <button 
              onClick={() => logout()} 
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button 
            onClick={() => login("analyst@vc.com")} 
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>

      <div className="max-w-3xl space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-300">
          VentureLens Terminal
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto">
          Institutional-Grade Multi-Agent AI Due Diligence & Financial Simulator.
        </p>
        
        <div className="pt-8">
          {isSignedIn ? (
            <Link 
              href="/dashboard" 
              className="inline-block bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-amber-500/25"
            >
              Go to Dashboard
            </Link>
          ) : (
            <button 
              onClick={() => login("analyst@vc.com")} 
              className="inline-block bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-amber-500/25 cursor-pointer"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
