"use client";

import { useState } from "react";

// ── PortfolioCard ──────────────────────────────────────────────

const TOKENS = [
  { name: "ETH (Ethereum)", price: "$2230.83", balance: "2.4182",  value: "$7,934.20", icon: <EthIcon /> },
  { name: "WACH",           price: "$0.0006",  balance: "14,200",  value: "$426",       icon: <WachIcon /> },
  { name: "Aerodrome (AERO)", price: "$0.3228", balance: "0.0284", value: "41,823.44",  icon: <AeroIcon /> },
];

export function PortfolioCard() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText("0x...abcd").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="w-full max-w-[600px] rounded-xl bg-[#1A1A1A] border border-white/[0.08] overflow-hidden">

      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-white/[0.06]">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] text-white/35 tracking-widest">PORTFOLIO</span>
          <span className="font-sans font-bold text-[32px] text-white leading-none tracking-tight">$12,847.34</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-[13px] text-[#4BCC00]">▲ +$342.18 (2.74%) today</span>
            <span className="font-mono text-[12px] text-white/30 ml-auto">Network - Base</span>
          </div>
        </div>

        {/* Address pill */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.10] bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
        >
          <span className="font-mono text-[12px] text-white/50">0x ... abcd</span>
          {copied ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#4BCC00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6.5L4.5 9L10 3" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-white/35">
              <rect x="4" y="4" width="7" height="7" rx="1" />
              <path d="M1 8V2a1 1 0 0 1 1-1h6" />
            </svg>
          )}
        </button>
      </div>

      {/* Token table */}
      <div>
        {/* Column headers */}
        <div className="grid grid-cols-3 px-5 py-2.5">
          <span className="font-mono text-[11px] text-white/30">Tokens ({TOKENS.length})</span>
          <span className="font-mono text-[11px] text-white/30 text-center">Balance</span>
          <span className="font-mono text-[11px] text-white/30 text-right">Value (USD)</span>
        </div>

        {/* Rows */}
        {TOKENS.map((t, i) => (
          <div
            key={t.name}
            className={`grid grid-cols-3 items-center px-5 py-3.5 ${i < TOKENS.length - 1 ? "border-b border-white/[0.05]" : ""}`}
          >
            {/* Token */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">{t.icon}</div>
              <div className="flex flex-col">
                <span className="font-sans text-[13px] text-white/80 leading-tight">{t.name}</span>
                <span className="font-mono text-[11px] text-white/35">{t.price}</span>
              </div>
            </div>
            {/* Balance */}
            <span className="font-mono text-[13px] text-white/70 text-center">{t.balance}</span>
            {/* Value */}
            <span className="font-mono text-[13px] text-white/80 text-right">{t.value}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

// ── Token SVG Icons ────────────────────────────────────────────

function EthIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="18" fill="#627EEA" />
      <path d="M18 7l-.14.48V22.2l.14.14 6.49-3.84L18 7z" fill="white" fillOpacity=".6" />
      <path d="M18 7L11.51 18.5 18 22.34V7z" fill="white" />
      <path d="M18 23.87l-.08.1v4.88l.08.22 6.5-9.14L18 23.87z" fill="white" fillOpacity=".6" />
      <path d="M18 29.07v-5.2l-6.49-3.82L18 29.07z" fill="white" />
    </svg>
  );
}

function WachIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="18" fill="#1A1A1A" />
      <image href="/wach-mascot.svg" x="4" y="4" width="28" height="28" />
    </svg>
  );
}

function AeroIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="18" fill="#fff" />
      <path d="M18 6C11.37 6 6 11.37 6 18s5.37 12 12 12 12-5.37 12-12S24.63 6 18 6z" fill="#1652F0" />
      <path d="M18 10l-6 8h4l-2 8 10-10h-5l3-6h-4z" fill="white" />
    </svg>
  );
}
