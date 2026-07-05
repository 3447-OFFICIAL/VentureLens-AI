import Link from "next/link";
import { ArrowRight, Shield, Brain, CheckCircle2, LayoutDashboard, Search, Lock, Code2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-geist font-bold text-xl tracking-tighter">
            VentureLens
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#ai" className="hover:text-foreground transition-colors">AI Intelligence</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#security" className="hover:text-foreground transition-colors">Security</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-foreground">Log in</Link>
            <Link href="/dashboard" className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
              Book Demo
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background"></div>
          <div className="container mx-auto px-4 relative z-10 max-w-5xl text-center">
            <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-400 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
              VentureLens 2.0 is now available
            </div>
            <h1 className="text-5xl md:text-7xl font-geist font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              The Operating System <br className="hidden md:block"/> for Venture Capital.
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Supercharge your deal flow, due diligence, and portfolio management with enterprise-grade AI. Make smarter investments, faster.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center">
                Start your free trial <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="#contact" className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors border border-border">
                Talk to Sales
              </Link>
            </div>
          </div>
        </section>

        {/* Dashboard Screenshot Preview */}
        <section className="container mx-auto px-4 pb-32">
          <div className="rounded-xl border border-border bg-card/50 p-2 glass mx-auto max-w-6xl shadow-2xl">
            <div className="rounded-lg overflow-hidden border border-border/50 bg-background aspect-video flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070')] bg-cover bg-center opacity-20 grayscale mix-blend-luminosity"></div>
              <div className="z-10 text-center">
                 <LayoutDashboard className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                 <p className="text-lg font-medium text-muted-foreground">Interactive Dashboard Preview</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-zinc-950/50 border-y border-border/50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-geist font-bold tracking-tight mb-4">Everything you need to deploy capital</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">From sourcing to exit, manage the entire investment lifecycle in one unified platform.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Search, title: "Deal Flow Pipeline", desc: "Track every startup. Custom stages, automated data enrichment, and seamless team collaboration." },
                { icon: Shield, title: "Technical DD", desc: "Automated GitHub analysis. Surface technical debt, security risks, and architecture flaws instantly." },
                { icon: Code2, title: "Financial Modeling", desc: "Extract metrics directly from data rooms. Automated IRR, MOIC, and Monte Carlo simulations." }
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-xl bg-card border border-border hover:border-border/80 transition-colors">
                  <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Intelligence Section */}
        <section id="ai" className="py-24">
          <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-400 mb-6">
                <Brain className="mr-2 h-4 w-4" /> Multi-Agent AI
              </div>
              <h2 className="text-3xl md:text-4xl font-geist font-bold tracking-tight mb-6">
                Your autonomous diligence team.
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Stop reading 100-page data rooms. Our specialist AI agents (Financial, Technical, Legal) instantly extract risks, synthesize metrics, and draft investment memos with verifiable citations.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "100% Evidence-based citations",
                  "Tenant-isolated vector databases",
                  "Automated red-flag detection"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full">
              <div className="rounded-xl border border-border bg-card p-4 shadow-2xl glass">
                <div className="space-y-4">
                  <div className="flex gap-4 p-3 rounded-lg bg-zinc-900/50">
                    <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">GP</div>
                    <div>
                      <p className="text-sm font-medium">What is the burn rate and runway for Acme Corp?</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center shrink-0"><Brain className="h-4 w-4 text-white"/></div>
                    <div>
                      <p className="text-sm text-purple-100 mb-2">Acme Corp&apos;s current burn rate is $450k/mo. With $5.2M in cash, runway is ~11.5 months.</p>
                      <span className="text-xs text-purple-400 font-mono bg-purple-500/20 px-2 py-1 rounded">Source: Q3_Financials.pdf (Page 4)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="py-24 bg-zinc-950 border-t border-border/50">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <Lock className="h-12 w-12 text-zinc-400 mx-auto mb-6" />
            <h2 className="text-3xl font-geist font-bold mb-6">Enterprise-grade Security</h2>
            <p className="text-muted-foreground mb-12 text-lg">Your proprietary deal data is isolated, encrypted, and never used to train public models.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm font-medium text-zinc-300">
              <div className="p-4 border border-border rounded-lg bg-card">SOC 2 Type II</div>
              <div className="p-4 border border-border rounded-lg bg-card">End-to-End Encryption</div>
              <div className="p-4 border border-border rounded-lg bg-card">Row-Level Security</div>
              <div className="p-4 border border-border rounded-lg bg-card">Single Sign-On (SSO)</div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-zinc-950/50 border-t border-border/50">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <h2 className="text-3xl font-geist font-bold mb-4">Transparent Enterprise Pricing</h2>
            <p className="text-muted-foreground mb-16 max-w-2xl mx-auto">Scale your firm with confidence. Simple pricing based on AUM and active deals.</p>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              <div className="p-8 rounded-xl border border-border bg-card">
                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                <p className="text-muted-foreground mb-6">For emerging managers and syndicates.</p>
                <div className="text-4xl font-bold mb-6">$999<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 text-sm">
                  <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-blue-500 mr-3" /> Up to 5 team members</li>
                  <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-blue-500 mr-3" /> 100 Active Deals</li>
                  <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-blue-500 mr-3" /> Basic AI Diligence</li>
                </ul>
                <Link href="/signup" className="block w-full py-3 text-center border border-border hover:bg-secondary rounded-lg font-medium transition-colors">Start Trial</Link>
              </div>
              <div className="p-8 rounded-xl border-2 border-primary bg-card relative">
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-full">RECOMMENDED</div>
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <p className="text-muted-foreground mb-6">For established VC funds and PE.</p>
                <div className="text-4xl font-bold mb-6">Custom</div>
                <ul className="space-y-4 mb-8 text-sm">
                  <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-primary mr-3" /> Unlimited team members</li>
                  <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-primary mr-3" /> Unlimited Deals & AUM</li>
                  <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-primary mr-3" /> Full Agentic AI Suite</li>
                  <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-primary mr-3" /> Dedicated Success Manager</li>
                </ul>
                <Link href="#contact" className="block w-full py-3 text-center bg-primary text-primary-foreground hover:opacity-90 rounded-lg font-medium transition-opacity">Contact Sales</Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-geist font-bold mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {q: "How does the AI Due Diligence work?", a: "Our proprietary agents use advanced RAG to read your uploaded data rooms (PDFs, Excel) in isolated environments. They extract key metrics and generate memos with exact page citations."},
                {q: "Is my data secure?", a: "Yes. We use SOC 2 compliant infrastructure, Row-Level Security in Postgres, and tenant-isolated vector databases. Your data is never used to train our base models."},
                {q: "Can I integrate with my existing CRM?", a: "VentureLens AI provides a robust REST API and native integrations for Salesforce, Affinity, and Hubspot available on the Enterprise tier."}
              ].map((faq, i) => (
                <div key={i} className="p-6 border border-border rounded-lg bg-card/50">
                  <h4 className="text-lg font-semibold mb-2">{faq.q}</h4>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/10"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl font-geist font-bold tracking-tight mb-6">Ready to upgrade your firm?</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join top-tier VCs who are closing better deals faster with VentureLens AI.
            </p>
            <Link href="/dashboard" className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity text-lg">
              Start Free Trial
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-geist font-bold text-lg">
            VentureLens
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 VentureLens AI Inc. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
