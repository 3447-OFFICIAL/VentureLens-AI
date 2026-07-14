"use client";

import React, { useState } from "react";
import { 
  Users, Calendar, Clock, MinusCircle, FileText, Paperclip, 
  MessageSquare, History, Brain, ThumbsUp, ThumbsDown, FileCheck, Share2, Send
} from "lucide-react";

interface Comment {
  author: string;
  avatar: string;
  time: string;
  content: string;
  isSub?: boolean;
}

export default function InvestmentCommitteeModule() {
  const [userVote, setUserVote] = useState<string | null>(null);
  const [voteCount, setVoteCount] = useState(3);
  
  const [comments, setComments] = useState<Comment[]>([
    {
      author: "John Doe",
      avatar: "JD",
      time: "10:14 AM",
      content: "I'm comfortable with the valuation, but I want AK's read on the Series A term sheet regarding the anti-dilution provisions."
    },
    {
      author: "Alice Kim",
      avatar: "AK",
      time: "10:18 AM",
      content: "Standard broad-based weighted average. Nothing unusual. I've uploaded the marked-up copy to attachments.",
      isSub: true
    },
    {
      author: "Elena Smith",
      avatar: "ES",
      time: "10:22 AM",
      content: "Great. I'm a Yes. Voting now."
    }
  ]);
  
  const [commentText, setCommentText] = useState("");

  const handleVote = (type: string) => {
    if (userVote === null) {
      setVoteCount(prev => prev + 1);
    }
    setUserVote(type);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setComments(prev => [
      ...prev,
      {
        author: "Arjun Mehta",
        avatar: "AM",
        time: timeString,
        content: commentText
      }
    ]);
    
    setCommentText("");
  };

  return (
    <div className="flex flex-col h-full w-full space-y-6 text-zinc-300 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-950/40 border border-border/40 p-6 rounded-xl">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-geist font-bold flex items-center gap-2 text-white">
              <Users className="h-6 w-6 text-blue-500"/> Investment Committee
            </h1>
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-xs font-semibold rounded-md border border-amber-500/20 animate-pulse">Live</span>
          </div>
          <p className="text-xs text-zinc-500 flex items-center gap-2">
            <Calendar className="h-4 w-4"/> Q3 Deal Review • Nov 15, 2026 • <Clock className="h-4 w-4 ml-2"/> 10:00 AM PST
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-md text-xs font-semibold hover:bg-zinc-800">
            <Share2 className="h-4 w-4" /> Invite
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-semibold hover:opacity-90">
            <FileCheck className="h-4 w-4" /> Finalize Minutes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Col: Agenda, Voting, Decision History, Memo */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          
          {/* Agenda & Voting Card */}
          <div className="bg-zinc-950/40 border border-border/40 p-6 rounded-xl flex flex-col md:flex-row gap-6">
             <div className="flex-1">
               <h3 className="font-semibold mb-4 flex items-center gap-2 text-white text-sm">
                 <span className="bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded text-xs font-bold">1</span> 
                 Acme Corp ($5M Series A)
               </h3>
               <p className="text-xs text-zinc-400 mb-4">Lead Sponsor: JD • Predictive Lending Infrastructure.</p>
               
               <div className="flex items-center gap-2 text-[10px] font-bold">
                 <span className="bg-zinc-900 border border-zinc-850 px-2.5 py-1 rounded text-zinc-300">Valuation: $25M Pre</span>
                 <span className="bg-zinc-900 border border-zinc-850 px-2.5 py-1 rounded text-zinc-300">Ownership: 16.6%</span>
               </div>
             </div>
             
             {/* Live Voting Block */}
             <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-zinc-900 pt-4 md:pt-0 md:pl-6 flex flex-col gap-3">
               <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Cast Vote</h4>
               <div className="flex gap-2">
                 <button 
                   onClick={() => handleVote("approve")}
                   className={`flex-1 flex flex-col items-center gap-1 border p-2 rounded-lg transition-colors ${
                     userVote === 'approve' 
                       ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' 
                       : 'bg-emerald-900/10 hover:bg-emerald-900/20 border-emerald-500/20 text-emerald-500'
                   }`}
                 >
                   <ThumbsUp className="h-4 w-4" />
                   <span className="text-[10px] font-bold">Approve</span>
                 </button>
                 <button 
                   onClick={() => handleVote("pass")}
                   className={`flex-1 flex flex-col items-center gap-1 border p-2 rounded-lg transition-colors ${
                     userVote === 'pass' 
                       ? 'bg-rose-500/20 text-rose-400 border-rose-500' 
                       : 'bg-rose-900/10 hover:bg-rose-900/20 border-rose-500/20 text-rose-500'
                   }`}
                 >
                   <ThumbsDown className="h-4 w-4" />
                   <span className="text-[10px] font-bold">Pass</span>
                 </button>
                 <button 
                   onClick={() => handleVote("abstain")}
                   className={`flex-1 flex flex-col items-center gap-1 border p-2 rounded-lg transition-colors ${
                     userVote === 'abstain' 
                       ? 'bg-zinc-800 text-white border-zinc-700' 
                       : 'bg-zinc-900/50 hover:bg-zinc-800 border-zinc-800 text-zinc-400'
                   }`}
                 >
                   <MinusCircle className="h-4 w-4" />
                   <span className="text-[10px] font-bold">Abstain</span>
                 </button>
               </div>
               {/* Voting Status */}
               <div className="flex items-center justify-between text-xs mt-2">
                 <span className="text-zinc-500">Votes: {voteCount} / 5</span>
                 <div className="flex gap-1">
                   <div className="h-4 w-4 rounded-full bg-emerald-500 border border-emerald-600" title="JD (Approve)"></div>
                   <div className="h-4 w-4 rounded-full bg-emerald-500 border border-emerald-600" title="ES (Approve)"></div>
                   <div className="h-4 w-4 rounded-full bg-rose-500 border border-rose-600" title="AK (Pass)"></div>
                   {userVote && (
                     <div className={`h-4 w-4 rounded-full border ${
                       userVote === 'approve' ? 'bg-emerald-500 border-emerald-600' :
                       userVote === 'pass' ? 'bg-rose-500 border-rose-600' : 'bg-zinc-500 border-zinc-650'
                     }`} title="AM (Me)"></div>
                   )}
                   {(!userVote || voteCount < 5) && (
                     <div className="h-4 w-4 rounded-full bg-zinc-800 border border-zinc-700 animate-pulse"></div>
                   )}
                 </div>
               </div>
             </div>
          </div>

          {/* Memo & Attachments */}
          <div className="bg-zinc-950/40 border border-border/40 flex flex-col rounded-xl flex-1 min-h-[400px]">
             <div className="border-b border-border/40 p-4 flex justify-between items-center bg-zinc-900/20 rounded-t-xl">
               <h3 className="font-semibold text-xs text-white flex items-center gap-2"><FileText className="h-4 w-4 text-zinc-400" /> Investment Memo</h3>
               <div className="flex items-center gap-3 text-xs">
                 <span className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 cursor-pointer"><History className="h-3 w-3" /> v2.4 (Latest)</span>
                 <span className="flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 cursor-pointer hover:bg-blue-500/20 transition-colors"><Paperclip className="h-3 w-3" /> 4 Attachments</span>
               </div>
             </div>
             
             {/* Memo Content */}
             <div className="p-6 text-xs text-zinc-300 leading-relaxed overflow-y-auto flex-1 space-y-4">
                <h2 className="text-white text-sm font-bold border-b border-zinc-900 pb-1">Executive Summary</h2>
                <p>
                  Acme Corp provides predictive lending infrastructure for B2B fintechs. By analyzing real-time cash flow data, their models achieve a 40% reduction in default rates compared to traditional credit scoring. The company has reached $2.5M ARR with 183% YoY growth.
                </p>
                <h2 className="text-white text-sm font-bold border-b border-zinc-900 pb-1">Investment Thesis</h2>
                <p>
                  We are participating in a $5M Series A at a $25M pre-money valuation. The structural shift towards embedded finance necessitates modern risk models. Acme has proven their GTM motion with 12 enterprise logos.
                </p>
             </div>
          </div>

        </div>

        {/* Right Col: Discussion */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-950/40 border border-border/40 rounded-xl flex flex-col min-h-[500px]">
            <div className="border-b border-border/40 p-4 bg-zinc-900/20 rounded-t-xl flex justify-between items-center">
              <h3 className="font-semibold text-xs text-white flex items-center gap-2"><MessageSquare className="h-4 w-4 text-zinc-400" /> Discussion</h3>
              <span className="text-[10px] text-zinc-500 font-bold">{comments.length} Comments</span>
            </div>

            {/* Comments List */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[420px]">
              {comments.map((comment, i) => (
                <div key={i} className={`flex gap-3 ${comment.isSub ? 'pl-8 relative before:absolute before:left-3.5 before:top-[-20px] before:bottom-6 before:w-px before:bg-zinc-800' : ''}`}>
                  <div className={`rounded-full flex items-center justify-center shrink-0 font-bold text-xs border ${
                    comment.avatar === 'AM' 
                      ? 'h-8 w-8 bg-blue-600 text-white border-blue-500'
                      : comment.isSub ? 'h-6 w-6 bg-zinc-800 text-zinc-400 border-zinc-700 z-10 text-[10px]' : 'h-8 w-8 bg-zinc-900 text-zinc-400 border-zinc-800'
                  }`}>
                    {comment.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-white">{comment.author}</span>
                      <span className="text-[9px] text-zinc-500">{comment.time}</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Form Input */}
            <form onSubmit={handlePostComment} className="p-4 border-t border-zinc-900/60 bg-zinc-950/20">
              <div className="bg-zinc-900/50 border border-zinc-850 rounded-lg p-2.5 flex items-end gap-2.5">
                <textarea 
                  rows={2} 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment... (Type @ to mention)" 
                  className="bg-transparent border-none outline-none text-xs w-full text-zinc-300 resize-none placeholder:text-zinc-600 focus:ring-0" 
                />
                <button 
                  type="submit"
                  className="bg-blue-600 hover:opacity-90 text-white p-2 rounded-md transition-opacity"
                >
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
