"use client";

import { useState, useEffect } from "react";

// ── Types ──────────────────────────────────────────────────────

export interface MandateCardData {
  id: string;
  subtitle: string;
  from: { amount: string; usdValue: string; token: string };
  to: { amount: string; usdValue: string; token: string };
  expiresInSeconds: number;
  network: string;
  recipient: string;
}

interface MandateCardProps {
  data: MandateCardData;
  mandateJson?: object;                      // raw mandate from API for signing
  onSign?: (signedMandate: object) => void;  // called after successful sign
}

// ── MandateCard ────────────────────────────────────────────────

export function MandateCard({ data, mandateJson, onSign }: MandateCardProps) {
  const [secondsLeft, setSecondsLeft] = useState(data.expiresInSeconds);
  const [signed, setSigned] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [signedAt] = useState(() =>
    new Date().toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    }) + ", " + new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
  const [rawOpen, setRawOpen] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0 || signed) return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft, signed]);

  function fmt(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-[360px]">

      {/* ── Review Mandate card ─────────────────────────────── */}
      <div className="rounded-xl bg-[#1A1A1A] border border-white/[0.08] overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4">
          <div>
            <h3 className="font-sans font-bold text-[18px] text-white leading-tight">Review Mandate</h3>
            <p className="font-sans italic text-[13px] text-white/50 mt-1">{data.subtitle}</p>
          </div>
          <span className="mt-0.5 px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/[0.08] font-mono text-[11px] text-white/40 whitespace-nowrap">
            {data.id}
          </span>
        </div>

        {/* Token boxes */}
        <div className="px-4 pb-4 flex flex-col relative">
          <div className="bg-[#242424] rounded-lg px-4 py-4 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] text-white/35 tracking-widest">FROM</span>
              <span className="font-sans font-bold text-[26px] text-white leading-none">{data.from.amount}</span>
              <span className="font-mono text-[12px] text-white/35">≈ {data.from.usdValue}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <TokenIcon token={data.from.token} />
              <span className="font-sans font-semibold text-[13px] text-white/80">{data.from.token}</span>
            </div>
          </div>

          <div className="flex justify-center -my-3 z-10 relative">
            <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-white/[0.12] flex items-center justify-center shadow-md">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 2.5V11.5M3.5 8L7 11.5L10.5 8" />
              </svg>
            </div>
          </div>

          <div className="bg-[#242424] rounded-lg px-4 py-4 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] text-white/35 tracking-widest">TO</span>
              <span className="font-sans font-bold text-[26px] text-white leading-none">{data.to.amount}</span>
              <span className="font-mono text-[12px] text-white/35">≈ {data.to.usdValue}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <TokenIcon token={data.to.token} />
              <span className="font-sans font-semibold text-[13px] text-white/80">{data.to.token}</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="px-5 pb-4 font-sans text-[11px] text-white/30 leading-relaxed">
          *Indicates the minimum amount you will receive, but might slightly increase due to price movement.
        </p>

        {/* Meta rows */}
        <div className="px-5 flex flex-col gap-3 pb-4">
          {signed ? (
            <MetaRow icon={<CheckIcon />} label="Signed" value={<span className="text-white/60 text-[13px] font-sans">{signedAt}</span>} />
          ) : declined ? (
            <MetaRow icon={<XIcon />} label="Declined" value={<span className="text-white/60 text-[13px] font-sans">{signedAt}</span>} />
          ) : (
            <MetaRow icon={<ClockIcon />} label="Expires in :" value={<span className={secondsLeft < 60 ? "text-red-400" : "text-white/70"}>{fmt(secondsLeft)}</span>} />
          )}
          <MetaRow icon={<NetworkIcon />} label="Network :" value={data.network} />
          <MetaRow icon={<WalletIcon />} label="Recipient :" value={<span className="font-mono">{data.recipient}</span>} />
        </div>

        {/* Action button */}
        <div className="px-4 pb-4">
          {signed ? (
            <div className="w-full py-3.5 rounded-sm bg-black border border-white/[0.08] flex items-center justify-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#4BCC00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 7L5.5 10.5L12 3.5" />
              </svg>
              <span className="font-sans font-bold text-[15px] text-[#4BCC00]">Signed</span>
            </div>
          ) : declined ? (
            <div className="w-full py-3.5 rounded-sm bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
              <span className="font-sans font-semibold text-[15px] text-white/50">Declined</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={async () => {
                  setSigned(true);
                  if (mandateJson && onSign) {
                    try {
                      const res = await fetch("/api/mandate/sign", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ mandate: mandateJson }),
                      });
                      const json = await res.json();
                      if (json.mandate) onSign(json.mandate);
                    } catch {
                      // sign failure doesn't block UI
                    }
                  }
                }}
                className="w-full py-3.5 rounded-sm bg-black text-white font-sans font-bold text-[15px] hover:bg-black/80 active:scale-[0.99] transition-all duration-150 border border-white/[0.08]"
              >
                Accept (Sign)
              </button>
              <button
                onClick={() => setDeclined(true)}
                className="w-full py-3.5 rounded-sm bg-white/[0.07] border border-white/[0.08] text-white/70 font-sans font-semibold text-[15px] hover:bg-white/[0.12] active:scale-[0.99] transition-all duration-150"
              >
                Decline
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Ready to exchange card — appears after signing ── */}
      {signed && (
        <div className="rounded-xl bg-[#1A1A1A] border border-white/[0.08] overflow-hidden animate-fade-up">

          <div className="px-5 pt-5 pb-4">
            <h3 className="font-sans font-bold text-[18px] text-white">Ready to exchange swap</h3>
          </div>

          {/* Token swap visual */}
          <div className="mx-4 mb-4 bg-[#242424] rounded-lg px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TokenIcon token={data.from.token} size="lg" />
              <div className="flex flex-col">
                <span className="font-sans font-semibold text-[15px] text-white">{data.from.token}</span>
                <span className="font-sans text-[12px] text-white/40">{data.network}</span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full border border-white/[0.15] bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 7H11.5M8 3.5L11.5 7L8 10.5" />
              </svg>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="font-sans font-semibold text-[15px] text-white">{data.to.token}</span>
                <span className="font-sans text-[12px] text-white/40">{data.network}</span>
              </div>
              <TokenIcon token={data.to.token} size="lg" />
            </div>
          </div>

          {/* Meta rows */}
          <div className="px-5 flex flex-col gap-3 pb-4">
            <MetaRow icon={<CheckIcon />} label="Initiated" value={<span className="text-white/60 text-[13px] font-sans">{signedAt}</span>} />
            <MetaRow icon={<NetworkIcon />} label="Network :" value={data.network} />
            <MetaRow icon={<WalletIcon />} label="Minimum Recieved :" value={data.to.usdValue} />
          </div>

          {/* View raw details */}
          <div className="px-5 pb-4">
            <button
              onClick={() => setRawOpen((o) => !o)}
              className="flex items-center gap-1.5 font-sans text-[13px] text-white/40 hover:text-white/60 transition-colors"
            >
              View raw details
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                className={`transition-transform duration-200 ${rawOpen ? "rotate-180" : ""}`}
              >
                <path d="M2 4L6 8L10 4" />
              </svg>
            </button>
            {rawOpen && (
              <pre className="mt-3 p-3 rounded-md bg-[#242424] font-mono text-[11px] text-white/40 overflow-x-auto scrollbar-hide">
{JSON.stringify({
  id: data.id,
  from: { token: data.from.token, amount: data.from.amount },
  to: { token: data.to.token, amount: data.to.amount },
  network: data.network,
  recipient: data.recipient,
  signedAt,
}, null, 2)}
              </pre>
            )}
          </div>

          {/* Approve and execute */}
          <div className="px-4 pb-4">
            <button className="w-full py-3.5 rounded-sm bg-black text-white font-sans font-bold text-[15px] hover:bg-black/80 active:scale-[0.99] transition-all duration-150 border border-white/[0.08]">
              Approve and execute
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

// ── MetaRow ────────────────────────────────────────────────────

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-white/30 flex-shrink-0">{icon}</span>
      <span className="font-sans text-[13px] text-white/50 flex-1">{label}</span>
      <span className="font-sans text-[13px] text-white/70">{value}</span>
    </div>
  );
}

// ── Token icons ────────────────────────────────────────────────

function TokenIcon({ token, size = "md" }: { token: string; size?: "md" | "lg" }) {
  const px = size === "lg" ? 48 : 40;

  const configs: Record<string, { bg: string; content: React.ReactNode }> = {
    USDC: {
      bg: "#2775CA",
      content: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="11" fill="#2775CA" />
          <path d="M11 4C7.13 4 4 7.13 4 11s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm.7 11.85v.88c0 .39-.32.7-.7.7s-.7-.31-.7-.7v-.89c-1.6-.32-2.78-1.36-2.9-2.72h1.4c.14.87.97 1.5 2.2 1.5 1.14 0 1.96-.57 1.96-1.37 0-.69-.5-1.1-1.73-1.4l-1.04-.26C8.54 12.3 7.7 11.4 7.7 10.2c0-1.42 1.12-2.47 2.6-2.73V6.6c0-.39.31-.7.7-.7s.7.31.7.7v.88c1.44.3 2.5 1.27 2.63 2.54h-1.4c-.14-.8-.88-1.38-1.93-1.38-1.07 0-1.82.53-1.82 1.3 0 .64.47 1.03 1.58 1.3l.97.24c1.65.41 2.57 1.3 2.57 2.57 0 1.5-1.14 2.55-2.8 2.8z" fill="white" />
        </svg>
      ),
    },
    WBTC: {
      bg: "#F09242",
      content: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="11" fill="#F09242" />
          <path d="M15.2 9.7c.15-1.02-.63-1.57-1.7-1.94l.35-1.39-0.85-.21-.34 1.35c-.22-.06-.45-.11-.68-.16l.34-1.37-.85-.21-.35 1.39c-.18-.04-.36-.09-.53-.13l-.001-.004-.17-.04-.85-.21-.21.9s.63.14.62.15c.34.09.4.31.39.49l-.95 3.79c-.03.07-.11.18-.28.14.01.01-.62-.16-.62-.16l-.42.97.81.2.44.11-.35 1.41.85.21.35-1.4c.23.06.46.12.68.17l-.35 1.39.85.21.35-1.4c1.44.27 2.52.16 2.97-1.14.37-1.05-.02-1.66-.77-2.06.55-.13.96-.49 1.07-1.24zm-1.92 2.7c-.26 1.05-2.04.48-2.62.34l.47-1.87c.58.14 2.43.43 2.15 1.53zm.26-2.72c-.24.96-1.72.47-2.2.35l.42-1.7c.48.12 2.04.34 1.78 1.35z" fill="white" />
        </svg>
      ),
    },
    USDT: {
      bg: "#26A17B",
      content: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="11" fill="#26A17B" />
          <path d="M12.16 11.7v-.001c-.06.004-.37.023-1.06.023-.55 0-.94-.017-1.07-.023v.002c-2.12-.093-3.7-.46-3.7-.9s1.58-.808 3.7-.9v1.43c.13.01.53.033 1.08.033.656 0 .984-.027 1.05-.032V9.9c2.117.092 3.7.46 3.7.9s-1.583.807-3.7.9zm0-1.95V8.53h2.96V6.5H6.88v2.03h2.96v1.22c-2.4.11-4.2.586-4.2 1.157 0 .57 1.8 1.046 4.2 1.156v4.135h2.32v-4.138c2.396-.11 4.192-.584 4.192-1.154 0-.57-1.796-1.044-4.192-1.155z" fill="white" />
        </svg>
      ),
    },
    ETH: {
      bg: "#627EEA",
      content: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="11" fill="#627EEA" />
          <path d="M11 4.5l-.087.296V13.8l.087.087 3.996-2.363L11 4.5z" fill="white" fillOpacity=".6" />
          <path d="M11 4.5L7.004 11.524 11 13.887V4.5z" fill="white" />
          <path d="M11 14.7l-.048.058v3.007l.048.141 4-5.628L11 14.7z" fill="white" fillOpacity=".6" />
          <path d="M11 17.906v-3.205L7.004 12.28 11 17.906z" fill="white" />
        </svg>
      ),
    },
  };

  const cfg = configs[token] ?? { bg: "#444", content: <span className="font-mono font-bold text-[10px] text-white">{token.slice(0, 2)}</span> };

  return (
    <div
      className="rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
      style={{ width: px, height: px, background: cfg.bg }}
    >
      {cfg.content}
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 3L12 12M12 3L3 12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 8L5.5 11L12.5 4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <circle cx="7.5" cy="7.5" r="6" />
      <path d="M7.5 4.5V7.5L9.5 9" />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="3" r="1.5" />
      <circle cx="3" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <path d="M7.5 4.5V8.5M7.5 8.5L3 10.5M7.5 8.5L12 10.5" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="3.5" width="12" height="8" rx="1" />
      <path d="M1.5 6h12" />
      <circle cx="10.5" cy="8.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}
