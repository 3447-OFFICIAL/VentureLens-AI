"use client";

import React, { useState, useEffect } from "react";
import { 
  Settings, User, Building2, Key, Shield, Bell, Save, CheckCircle2, 
  Loader2, Globe, Database
} from "lucide-react";

export default function SettingsModule() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ email: "arjun@venturelens.ai", name: "Arjun Mehta" });
  
  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;
        const res = await fetch("http://localhost:8000/api/v1/auth/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile({ email: data.email, name: data.email.split("@")[0].toUpperCase() });
        }
      } catch (err) {
        console.error("Failed to load user profile in settings", err);
      }
    }
    loadProfile();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <div className="flex flex-col h-full w-full space-y-6 text-zinc-300 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-geist tracking-tight text-white flex items-center gap-2">
            <Settings className="h-6 w-6 text-blue-500" /> Settings
          </h1>
          <p className="text-zinc-500 text-xs mt-1">Configure your VentureLens workspace and preferences.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Sub-nav */}
        <div className="w-full lg:w-60 bg-zinc-950/40 border border-border/40 p-2.5 rounded-xl space-y-1">
          {[
            { id: "profile", label: "User Profile", icon: User },
            { id: "org", label: "Organization", icon: Building2 },
            { id: "keys", label: "API Configuration", icon: Key },
            { id: "security", label: "Security & MFA", icon: Shield }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === tab.id 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-600/20" 
                  : "border border-transparent hover:bg-zinc-900/40 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Settings Pane */}
        <div className="flex-1 bg-zinc-950/40 border border-border/40 p-6 rounded-xl w-full">
          <form onSubmit={handleSave} className="space-y-6 max-w-xl">
            
            {activeTab === "profile" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-2">User Profile Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500 font-bold">Full Name</label>
                    <input 
                      type="text" 
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-blue-500 text-white font-medium" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500 font-bold">Work Email</label>
                    <input 
                      type="email" 
                      readOnly
                      value={profile.email}
                      className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-lg text-xs px-3 py-2 text-zinc-500 focus:outline-none font-medium cursor-not-allowed" 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "org" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-2">Organization Workspace</h3>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500 font-bold">Firm Name</label>
                    <input 
                      type="text" 
                      defaultValue="VentureLens Capital" 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-blue-500 text-white font-medium" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500 font-bold">Domain Restriction</label>
                    <input 
                      type="text" 
                      defaultValue="venturelens.ai" 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-blue-500 text-white font-medium" 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "keys" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-2">External API Integration Keys</h3>
                <p className="text-zinc-500 text-[10px] leading-relaxed">Required for background data enrichment, OpenAI multi-agent analysis, and Qdrant vector store syncing.</p>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500 font-bold">OpenAI API Key</label>
                    <input 
                      type="password" 
                      placeholder="••••••••••••••••••••••••••••••••" 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-blue-500 text-white font-mono" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500 font-bold">Qdrant Host URL</label>
                    <input 
                      type="text" 
                      defaultValue="http://localhost:6333" 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-blue-500 text-white font-mono" 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-2">Security & Identity</h3>
                <div className="flex items-center justify-between p-3.5 bg-zinc-900/40 border border-zinc-850 rounded-lg">
                  <div>
                    <p className="text-xs font-bold text-zinc-200">Two-Factor Authentication (MFA)</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Enforce TOTP validation at login.</p>
                  </div>
                  <div className="relative inline-flex items-center h-5 rounded-full w-9 bg-zinc-800 border border-zinc-700 cursor-pointer">
                    <span className="translate-x-1 inline-block w-3.5 h-3.5 rounded-full bg-zinc-500" />
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-zinc-900/60 pt-4 flex items-center justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin h-3.5 w-3.5" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>

    </div>
  );
}
