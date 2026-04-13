import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { urlService } from "../services/urlService";
import { CopyButton } from "../components/ui/CopyButton";
import { Loader } from "../components/ui/Loader";
import { useAuth } from "../hooks/useAuth";
import { useLinks } from "../hooks/useLinks";

const BASE_URL = import.meta.env.VITE_API_URL;

const FEATURES = [
  { icon: "⚡", title: "Lightning fast", desc: "Redis-powered redirects in under 10ms. Your users never wait." },
  { icon: "📊", title: "Deep analytics", desc: "Track clicks, countries, devices and browsers in real-time." },
  { icon: "🔒", title: "Password protection", desc: "Secure any link with a password. Control who can access it." },
  { icon: "⏳", title: "Link expiry", desc: "Set links to expire after hours, days, or a set number of clicks." },
  { icon: "📷", title: "QR codes", desc: "Every short link gets a scannable QR code automatically generated." },
  { icon: "✏️", title: "Editable links", desc: "Change the destination, alias, or settings of any link anytime." },
];

const PRICING = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: ["50 links/month", "Basic analytics", "QR codes", "Link expiry"],
    cta: "Get started",
    to: "/register",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    features: ["Unlimited links", "Advanced analytics", "Custom aliases", "Password protection", "Bulk creation", "Priority support"],
    cta: "Start free trial",
    to: "/register",
    highlight: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    features: ["Everything in Pro", "Custom domain", "Team members", "API access", "SLA guarantee", "Dedicated support"],
    cta: "Contact sales",
    to: "/register",
    highlight: false,
  },
];

export default function Home() {
  const [inputUrl, setInputUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { addLink } = useLinks();
  const navigate = useNavigate();

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    if (!user) { navigate("/register"); return; }
    setLoading(true);
    setError("");
    try {
      const data = await urlService.shorten({ url: inputUrl });
      const linkRecord = {
        shortId: data.customAlias || data.shortUrl?.split("/").pop(),
        shortUrl: data.shortUrl,
        originalUrl: inputUrl,
        createdAt: new Date().toISOString(),
        expiresAt: data.expiresAt,
        totalClicks: 0,
        passwordProtected: data.passwordProtected,
        oneTime: data.oneTime,
        qrCode: data.qrCode,
      };
      addLink(linkRecord);
      setResult(data);
      setInputUrl("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to shorten URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 overflow-hidden">
        {/* BG effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-indigo-600/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Now with real-time analytics
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
            Short links that{" "}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              work harder
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Shorten, brand, and track every link you share. Built for teams that care about performance.
          </p>

          {/* URL Input */}
          <form onSubmit={handleShorten} className="w-full max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 p-2 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/40">
              <div className="flex-1 relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <input
                  type="url"
                  placeholder="Paste your long URL here…"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-zinc-600 outline-none text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 font-semibold text-white text-sm transition-all shadow-lg shadow-violet-600/30 whitespace-nowrap"
              >
                {loading ? <Loader size="sm" /> : null}
                {loading ? "Shortening…" : user ? "Shorten URL" : "Get started free"}
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          </form>

          {/* Result card */}
          {result && (
            <div className="mt-4 max-w-2xl mx-auto p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-between gap-4 animate-fade-in">
              <div className="min-w-0">
                <p className="text-xs text-emerald-400 font-semibold mb-0.5">✓ Link created!</p>
                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-medium hover:text-violet-300 transition-colors truncate block"
                >
                  {result.shortUrl}
                </a>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <CopyButton text={result.shortUrl} />
                <Link to="/dashboard" className="text-xs text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700">
                  Dashboard →
                </Link>
              </div>
            </div>
          )}

          <p className="mt-5 text-xs text-zinc-600">
            Free forever · No credit card · 100 req/15min rate limit
          </p>
        </div>
      </section>

      {/* Social proof numbers */}
      <section className="py-12 border-y border-zinc-800/60 bg-zinc-900/20">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          {[["10M+", "Links created"], ["500K+", "Monthly clicks"], ["99.9%", "Uptime SLA"]].map(([stat, label]) => (
            <div key={stat}>
              <p className="text-3xl sm:text-4xl font-black text-white mb-1">{stat}</p>
              <p className="text-sm text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything you need to manage links</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">A complete link management platform with enterprise-grade features.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="group p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-violet-700/40 hover:bg-zinc-900/80 transition-all duration-300">
                <div className="text-2xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 sm:px-6 bg-zinc-900/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Simple, transparent pricing</h2>
            <p className="text-zinc-500">Start free. Scale as you grow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-7 border transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-b from-violet-900/40 to-zinc-900 border-violet-600/50 shadow-2xl shadow-violet-900/20 scale-105"
                    : "bg-zinc-900 border-zinc-800"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-bold">
                    Most Popular
                  </div>
                )}
                <p className="font-semibold text-zinc-300 mb-2">{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-zinc-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-400">
                      <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.to}
                  className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlight
                      ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}