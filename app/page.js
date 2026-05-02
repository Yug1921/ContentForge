"use client";

import { useState } from "react";
import GeneratorForm from "@/components/GeneratorForm";
import OutputCard from "@/components/OutputCard";
import ToneAnalyzer from "@/components/ToneAnalyzer";
import CampaignPlanner from "@/components/CampaignPlanner";

const TABS = [
  { id: "generator", label: "Generator", initial: "G", desc: "Single platform" },
  { id: "tone", label: "Tone Rewriter", initial: "T", desc: "Rewrite any copy" },
  { id: "campaign", label: "Campaign Planner", initial: "C", desc: "All platforms at once" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("generator");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastParams, setLastParams] = useState(null);
  const [history, setHistory] = useState([]);

  async function handleGenerate(params) {
    setLoading(true);
    setError(null);
    setLastParams(params);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setResult(data.result);
      setHistory(prev => [{ ...params, result: data.result, ts: Date.now() }, ...prev].slice(0, 5));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(105,100,247,0.09),transparent_60%)]" />

      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section id="home" className="mx-auto max-w-3xl pt-4 text-center sm:pt-8">
          <div className="mx-auto inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/6 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
              <svg className="h-5 w-5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 6.5h5.5c2.5 0 4.5 1.6 4.5 3.6s-2 3.6-4.5 3.6H5z" />
                <path d="M10.5 10.1H14c2.2 0 4 1.5 4 3.4s-1.8 3.4-4 3.4h-4" />
                <path d="M5 16.9h5.5" />
              </svg>
            </div>
            <div className="text-left leading-tight">
              <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">ContentForge</h1>
            </div>
          </div>

          <p className="mt-6 text-[17px] leading-8 text-slate-400 sm:text-[18px]">
            AI-powered marketing content — from brief to copy in seconds
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">✓ Powered by AI</span>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">7 content types</span>
            <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1 text-xs font-medium text-fuchsia-200">A/B variants</span>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TABS.map(tab => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-[18px] border px-5 py-5 text-left transition ${
                  active
                    ? "border-white/12 bg-[#6b63f6] text-white shadow-[0_16px_40px_rgba(107,99,246,0.28)]"
                    : "border-white/10 bg-white/3 text-slate-200 hover:bg-white/5"
                }`}
              >
                <div className="mb-8 flex items-start justify-between">
                  <span className={`grid h-7 w-7 place-items-center rounded-full text-[12px] font-semibold ${active ? "bg-white/15 text-white" : "bg-white/6 text-slate-300"}`}>
                    {tab.initial}
                  </span>
                  <span className={`text-[11px] ${active ? "text-indigo-100" : "text-slate-500"}`}>{tab.desc}</span>
                </div>
                <div className="text-sm font-medium">{tab.label}</div>
                <div className={`mt-1 text-sm ${active ? "text-indigo-100" : "text-slate-400"}`}>{tab.desc}</div>
              </button>
            );
          })}
        </section>

        <section id="generator" className="mt-6">
          {activeTab === "generator" && (
            <>
              <GeneratorForm onGenerate={handleGenerate} loading={loading} />

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                  <span className="mt-0.5 text-red-300">!</span>
                  <span>{error}</span>
                </div>
              )}

              {loading && !result && (
                <div className="mt-6 space-y-3 rounded-[20px] border border-white/10 bg-white/3 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.28)] animate-pulse">
                  <div className="flex gap-2">
                    <div className="h-6 w-20 rounded-full bg-white/10" />
                    <div className="h-6 w-24 rounded-full bg-white/10" />
                  </div>
                  <div className="h-4 w-full rounded bg-white/10" />
                  <div className="h-4 w-5/6 rounded bg-white/10" />
                  <div className="h-4 w-4/6 rounded bg-white/10" />
                </div>
              )}

              {result && !loading && (
                <div className="mt-6">
                  <OutputCard
                    result={result}
                    contentType={lastParams?.contentType}
                    tone={lastParams?.tone}
                    audience={lastParams?.audience}
                    onRegenerate={() => lastParams && handleGenerate(lastParams)}
                    loading={loading}
                  />
                </div>
              )}

              {history.length > 0 && (
                <div id="history" className="mt-8">
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Recent generations</h2>
                  <div className="space-y-2">
                    {history.map(h => (
                      <button
                        key={h.ts}
                        onClick={() => {
                          setResult(h.result);
                          setLastParams(h);
                        }}
                        className="group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-left transition hover:border-white/15 hover:bg-white/5"
                      >
                        <span className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-semibold capitalize text-slate-300">
                          {h.contentType}
                        </span>
                        <span className="truncate text-sm font-medium text-white">{h.brand}</span>
                        <span className="hidden flex-1 truncate text-xs text-slate-500 md:block">{h.result?.substring(0, 60)}...</span>
                        <span className="whitespace-nowrap text-xs text-[#6964f7] opacity-0 transition group-hover:opacity-100">Load →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "tone" && <ToneAnalyzer />}
          {activeTab === "campaign" && <CampaignPlanner />}
        </section>

        <footer id="footer" className="py-12 text-center text-xs text-slate-500">
          Built with Next.js · OpenRouter · Tailwind CSS
        </footer>
      </div>
    </main>
  );
}