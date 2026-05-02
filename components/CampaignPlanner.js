"use client";
import { useState } from "react";

const TONES = ["Professional", "Casual", "Witty", "Urgent", "Inspirational", "Minimalist"];
const AUDIENCES = ["Young professionals", "Students", "Entrepreneurs", "Parents", "Gen Z", "General"];

const PLATFORMS = [
  { key: "instagram", label: "Instagram", icon: "📸", color: "bg-pink-50 border-pink-200 text-pink-700", tag: "bg-pink-100 text-pink-700" },
  { key: "linkedin", label: "LinkedIn", icon: "💼", color: "bg-sky-50 border-sky-200 text-sky-700", tag: "bg-sky-100 text-sky-700" },
  { key: "twitter", label: "Twitter / X", icon: "𝕏", color: "bg-gray-50 border-gray-200 text-gray-700", tag: "bg-gray-100 text-gray-700" },
  { key: "emailSubject", label: "Email Subject", icon: "✉️", color: "bg-blue-50 border-blue-200 text-blue-700", tag: "bg-blue-100 text-blue-700" },
  { key: "emailBody", label: "Email Body", icon: "📧", color: "bg-indigo-50 border-indigo-200 text-indigo-700", tag: "bg-indigo-100 text-indigo-700" },
  { key: "productDescription", label: "Product Description", icon: "🏷️", color: "bg-amber-50 border-amber-200 text-amber-700", tag: "bg-amber-100 text-amber-700" },
  { key: "adCopy", label: "Ad Copy", icon: "📣", color: "bg-orange-50 border-orange-200 text-orange-700", tag: "bg-orange-100 text-orange-700" },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }}
      className={`shrink-0 rounded-lg border px-3 py-1 text-xs font-medium transition ${copied ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200" : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/25 hover:text-cyan-200"}`}>
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

export default function CampaignPlanner() {
  const [brand, setBrand] = useState("");
  const [brief, setBrief] = useState("");
  const [tone, setTone] = useState("Professional");
  const [audience, setAudience] = useState("Young professionals");
  const [cta, setCta] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  async function handleGenerate() {
    const e = {};
    if (!brand.trim()) e.brand = "Required";
    if (!brief.trim()) e.brief = "Required";
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, brief, tone: tone.toLowerCase(), audience: audience.toLowerCase(), cta }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function copyAll() {
    if (!result) return;
    const text = PLATFORMS.map(p => `--- ${p.label.toUpperCase()} ---\n${result[p.key]}`).join("\n\n");
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="space-y-5 text-slate-100">
      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        <span className="text-cyan-300 text-lg">🚀</span>
        <div>
          <p className="text-sm font-semibold text-white">Campaign Planner</p>
          <p className="mt-0.5 text-xs text-slate-400">Enter one brief and generate ready-to-publish content for all 7 platforms simultaneously — Instagram, LinkedIn, Twitter, Email, Product Description, and Ad Copy.</p>
        </div>
      </div>

      <div className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Brand / product</label>
            <input type="text" value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. Nike, BrewBox, Zara..."
              className={`w-full rounded-2xl border px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-500 ${errors.brand ? "border-red-400/60 bg-red-500/10 text-slate-100" : "border-white/10 bg-white/5 text-slate-100"} focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20`}/>
            {errors.brand && <p className="mt-1 text-xs text-red-300">{errors.brand}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Call to action (optional)</label>
            <input type="text" value={cta} onChange={e => setCta(e.target.value)} placeholder="Shop now, Sign up free..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"/>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Campaign brief</label>
          <textarea value={brief} onChange={e => setBrief(e.target.value)} rows={3}
            placeholder="e.g. Summer sale — 30% off all products. Targeting young professionals who care about sustainability..."
            className={`w-full resize-none rounded-2xl border px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-500 ${errors.brief ? "border-red-400/60 bg-red-500/10 text-slate-100" : "border-white/10 bg-white/5 text-slate-100"} focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20`}/>
          {errors.brief && <p className="mt-1 text-xs text-red-300">{errors.brief}</p>}
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Tone</label>
          <div className="flex flex-wrap gap-2">
            {TONES.map(t => (
              <button type="button" key={t} onClick={() => setTone(t)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${tone === t ? "border-cyan-400/30 bg-cyan-400/15 text-cyan-200 shadow-[0_10px_30px_rgba(34,211,238,0.14)]" : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/30 hover:text-cyan-200"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Target audience</label>
          <div className="flex flex-wrap gap-2">
            {AUDIENCES.map(a => (
              <button type="button" key={a} onClick={() => setAudience(a)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${audience === a ? "border-fuchsia-400/30 bg-fuchsia-400/15 text-fuchsia-200 shadow-[0_10px_30px_rgba(232,121,249,0.14)]" : "border-white/10 bg-white/5 text-slate-300 hover:border-fuchsia-400/30 hover:text-fuchsia-200"}`}>
                {a}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 py-3 text-sm font-semibold text-white shadow-[0_16px_60px_rgba(79,70,229,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? (
            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Generating all platforms...</>
          ) : (
            <>🚀 Generate Full Campaign</>
          )}
        </button>
      </div>

      {error && <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">⚠ {error}</div>}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.3)] backdrop-blur-xl animate-pulse">
          <div className="h-4 w-1/3 rounded bg-white/10"/>
          {[1,2,3,4].map(i => <div key={i} className="h-16 rounded-xl bg-white/10"/>) }
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Full Campaign — {brand}</h3>
              <p className="mt-0.5 text-xs text-slate-500">{PLATFORMS.length} platforms generated · {tone} tone · {audience}</p>
            </div>
            <button onClick={copyAll}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-cyan-400/25 hover:text-cyan-200">
              Copy all platforms
            </button>
          </div>

          <div className="space-y-3">
            {PLATFORMS.map(p => result[p.key] ? (
              <div key={p.key} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{p.icon}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.tag}`}>{p.label}</span>
                    <span className="text-xs text-slate-500">{result[p.key].length} chars</span>
                  </div>
                  <CopyButton text={result[p.key]} />
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{result[p.key]}</p>
              </div>
            ) : null)}
          </div>
        </div>
      )}
    </div>
  );
}