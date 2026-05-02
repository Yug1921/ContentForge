"use client";
import { useState } from "react";

const TONES = ["Professional", "Casual", "Witty", "Urgent", "Inspirational", "Minimalist"];
const AUDIENCES = ["Young professionals", "Students", "Entrepreneurs", "Parents", "Gen Z", "General"];
const CONTENT_TYPES = [
  { value: "email", label: "Email campaign" },
  { value: "instagram", label: "Instagram caption" },
  { value: "linkedin", label: "LinkedIn post" },
  { value: "twitter", label: "Twitter / X post" },
  { value: "product", label: "Product description" },
  { value: "ad", label: "Ad copy (short)" },
  { value: "tagline", label: "Tagline / slogan" },
];

export default function GeneratorForm({ onGenerate, loading }) {
  const [brand, setBrand] = useState("");
  const [contentType, setContentType] = useState("email");
  const [brief, setBrief] = useState("");
  const [tone, setTone] = useState("Professional");
  const [audience, setAudience] = useState("Young professionals");
  const [variants, setVariants] = useState(2);
  const [cta, setCta] = useState("");
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!brand.trim()) e.brand = "Brand name is required";
    if (!brief.trim()) e.brief = "Campaign brief is required";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    onGenerate({ brand, contentType, brief, tone: tone.toLowerCase(), audience: audience.toLowerCase(), variants, cta });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:p-6">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Brand / product</label>
          <input
            type="text"
            value={brand}
            onChange={e => setBrand(e.target.value)}
            placeholder="e.g. BrewBox, Nike, Zara..."
            className={`w-full rounded-2xl border px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-500 ${errors.brand ? "border-red-400/60 bg-red-500/10 text-slate-100" : "border-white/10 bg-white/5 text-slate-100"} focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20`}
          />
          {errors.brand && <p className="mt-1 text-xs text-red-300">{errors.brand}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Content type</label>
          <select
            value={contentType}
            onChange={e => setContentType(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
          >
            {CONTENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>

      {/* Brief */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Campaign brief</label>
        <textarea
          value={brief}
          onChange={e => setBrief(e.target.value)}
          rows={3}
          placeholder="e.g. Summer sale — 30% off all products. Targeting young professionals who care about sustainability..."
          className={`w-full resize-none rounded-2xl border px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-500 ${errors.brief ? "border-red-400/60 bg-red-500/10 text-slate-100" : "border-white/10 bg-white/5 text-slate-100"} focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20`}
        />
        {errors.brief && <p className="mt-1 text-xs text-red-300">{errors.brief}</p>}
      </div>

      {/* Tone pills */}
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

      {/* Audience pills */}
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

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Variants to generate</label>
          <select
            value={variants}
            onChange={e => setVariants(parseInt(e.target.value))}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
          >
            <option value={1}>1 version</option>
            <option value={2}>2 versions (A/B test)</option>
            <option value={3}>3 versions</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Call to action (optional)</label>
          <input
            type="text"
            value={cta}
            onChange={e => setCta(e.target.value)}
            placeholder="Shop now, Sign up free, Learn more..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 py-3 text-sm font-semibold text-white shadow-[0_16px_60px_rgba(79,70,229,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            Generate Content
          </>
        )}
      </button>
    </form>
  );
}