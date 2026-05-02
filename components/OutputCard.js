"use client";
import { useState } from "react";

const TYPE_COLORS = {
  email: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  instagram: "border-pink-400/20 bg-pink-400/10 text-pink-200",
  linkedin: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
  twitter: "border-teal-400/20 bg-teal-400/10 text-teal-200",
  product: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  ad: "border-orange-400/20 bg-orange-400/10 text-orange-200",
  tagline: "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-200",
};

const TYPE_LABELS = {
  email: "Email", instagram: "Instagram", linkedin: "LinkedIn",
  twitter: "Twitter/X", product: "Product", ad: "Ad Copy", tagline: "Tagline",
};

const VARIANT_COLORS = [
  "border-cyan-400/15 bg-white/5",
  "border-indigo-400/15 bg-white/5",
  "border-fuchsia-400/15 bg-white/5",
];
const VARIANT_TAG_COLORS = [
  "bg-cyan-400/15 text-cyan-200",
  "bg-indigo-400/15 text-indigo-200",
  "bg-fuchsia-400/15 text-fuchsia-200",
];

function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button onClick={copy}
      className={`rounded-lg border px-3 py-1 text-xs font-medium transition ${copied ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200" : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/25 hover:text-cyan-200"}`}>
      {copied ? "✓ Copied!" : label}
    </button>
  );
}

function parseVariants(text) {
  const indices = [];
  const regex = /Version\s*\d+\s*:/gi;
  let match;
  while ((match = regex.exec(text)) !== null) indices.push(match.index);
  if (indices.length < 2) return null;
  return indices.map((start, i) => {
    const contentStart = text.indexOf(":", start) + 1;
    const end = i + 1 < indices.length ? indices[i + 1] : text.length;
    return text.slice(contentStart, end).trim();
  });
}

export default function OutputCard({ result, contentType, tone, audience, onRegenerate, loading }) {
  if (!result) return null;
  const variants = parseVariants(result);
  const colorClass = TYPE_COLORS[contentType] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
            {TYPE_LABELS[contentType]}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium capitalize text-slate-300">
            {tone}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium capitalize text-slate-300">
            {audience}
          </span>
        </div>
        <div className="flex gap-2">
          <CopyButton text={result} label="Copy all" />
          <button onClick={onRegenerate} disabled={loading}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 transition hover:border-cyan-400/25 hover:text-cyan-200 disabled:opacity-50">
            ↻ Regenerate
          </button>
        </div>
      </div>

      {/* Content */}
      {variants ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {variants.map((v, i) => (
            <div key={i} className={`rounded-xl border p-4 ${VARIANT_COLORS[i % VARIANT_COLORS.length]}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${VARIANT_TAG_COLORS[i % VARIANT_TAG_COLORS.length]}`}>
                  Version {String.fromCharCode(65 + i)}
                </span>
                <CopyButton text={v} />
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{v}</p>
              <p className="mt-2 text-right text-xs text-slate-500">{v.length} chars</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{result}</p>
          <p className="mt-2 text-right text-xs text-slate-500">{result.length} characters</p>
        </div>
      )}
    </div>
  );
}