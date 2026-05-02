"use client";
import { useState } from "react";

const TONES = ["Professional", "Casual", "Witty", "Urgent", "Inspirational", "Minimalist", "Empathetic", "Bold"];
const AUDIENCES = ["Young professionals", "Students", "Entrepreneurs", "Parents", "Gen Z", "General"];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }}
      className={`px-3 py-1 text-xs font-medium rounded-lg border transition ${copied ? "bg-green-50 text-green-600 border-green-300" : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"}`}>
      {copied ? "✓ Copied!" : "Copy"}
    </button>
  );
}

export default function ToneAnalyzer() {
  const [originalCopy, setOriginalCopy] = useState("");
  const [targetTone, setTargetTone] = useState("Professional");
  const [targetAudience, setTargetAudience] = useState("Young professionals");
  const [keepCTA, setKeepCTA] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleRewrite() {
    if (!originalCopy.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalCopy, targetTone: targetTone.toLowerCase(), targetAudience: targetAudience.toLowerCase(), keepCTA }),
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

  return (
    <div className="space-y-5 text-slate-100">
      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        <span className="text-fuchsia-300 text-lg">✦</span>
        <div>
          <p className="text-sm font-semibold text-white">Tone Rewriter</p>
          <p className="mt-0.5 text-xs text-slate-400">Paste any existing marketing copy — an email, social post, ad — and instantly rewrite it in a new tone while keeping the core message intact.</p>
        </div>
      </div>

      <div className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:p-6">
        {/* Original copy input */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            Paste Your Existing Copy
          </label>
          <textarea
            value={originalCopy}
            onChange={e => setOriginalCopy(e.target.value)}
            rows={5}
            placeholder="Paste any marketing copy here — email, Instagram caption, ad copy, product description..."
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-fuchsia-400/60 focus:ring-2 focus:ring-fuchsia-500/20"
          />
          <p className="mt-1 text-right text-xs text-slate-500">{originalCopy.length} characters</p>
        </div>

        {/* Target tone */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Rewrite in this tone</label>
          <div className="flex flex-wrap gap-2">
            {TONES.map(t => (
              <button type="button" key={t} onClick={() => setTargetTone(t)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${targetTone === t ? "border-fuchsia-400/30 bg-fuchsia-400/15 text-fuchsia-200 shadow-[0_10px_30px_rgba(232,121,249,0.14)]" : "border-white/10 bg-white/5 text-slate-300 hover:border-fuchsia-400/30 hover:text-fuchsia-200"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Target audience */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Target audience</label>
          <div className="flex flex-wrap gap-2">
            {AUDIENCES.map(a => (
              <button type="button" key={a} onClick={() => setTargetAudience(a)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${targetAudience === a ? "border-cyan-400/30 bg-cyan-400/15 text-cyan-200 shadow-[0_10px_30px_rgba(34,211,238,0.14)]" : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/30 hover:text-cyan-200"}`}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Keep CTA toggle */}
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3.5">
          <div>
            <p className="text-sm font-medium text-white">Preserve original CTA</p>
            <p className="text-xs text-slate-400">Keep the call-to-action from the original copy</p>
          </div>
          <button onClick={() => setKeepCTA(!keepCTA)} type="button"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${keepCTA ? "bg-cyan-500" : "bg-slate-600"}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${keepCTA ? "translate-x-6" : "translate-x-1"}`}/>
          </button>
        </div>

        {/* Submit */}
        <button onClick={handleRewrite} disabled={loading || !originalCopy.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 py-3 text-sm font-semibold text-white shadow-[0_16px_60px_rgba(79,70,229,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? (
            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Rewriting...</>
          ) : (
            <><span>✦</span> Rewrite Tone</>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">⚠ {error}</div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:p-6">
          {/* Tone detection */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
              <span className="text-xs text-slate-400">Original tone:</span>
              <span className="text-xs font-semibold text-slate-100">{result.originalTone}</span>
            </div>
            <span className="text-slate-500 text-sm">→</span>
            <div className="flex items-center gap-2 rounded-lg border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1.5">
              <span className="text-xs text-fuchsia-200">Rewritten as:</span>
              <span className="text-xs font-semibold text-fuchsia-100">{targetTone}</span>
            </div>
          </div>

          {/* Side by side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Original</p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{originalCopy}</p>
            </div>
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">Rewritten — {targetTone}</p>
                <CopyButton text={result.rewritten} />
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-100">{result.rewritten}</p>
            </div>
          </div>

          {/* What changed */}
          {result.whatChanged && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3">
              <span className="mt-0.5 text-amber-300">💡</span>
              <p className="text-xs text-amber-100"><span className="font-semibold">What changed: </span>{result.whatChanged}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}