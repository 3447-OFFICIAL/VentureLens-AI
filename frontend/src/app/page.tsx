import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute top-4 right-4">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>

      <div className="max-w-3xl space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          VentureLens AI
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto">
          Institutional-Grade Financial Due Diligence powered by Multi-Agent AI.
        </p>
        
        <div className="pt-8">
          <SignedIn>
            <Link 
              href="/dashboard" 
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-blue-500/25"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-blue-500/25">
                Get Started
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </main>
  );
}
