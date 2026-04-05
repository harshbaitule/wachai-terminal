"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GlassInput, SuggestionChips } from "@/components/ui/glass-input";
import { HomeSidebar } from "@/components/ui/home-sidebar";
import { ThinkingRing } from "@/components/ui/thinking-ring";
import { MandateCard, type MandateCardData } from "@/components/ui/mandate-card";
import { PortfolioCard } from "@/components/ui/portfolio-card";

const SUGGESTIONS = [
  "Swap 100 USD to BTC",
  "Give me a rundown of my portfolio",
  "Can you verify $PEPE",
];

const SWAP_STEPS = [
  "Thinking...",
  "Preparing Mandate",
  "Mandate Signed",
  "Verifying Intent",
  "Finding Best Routes",
  "Finalizing The Route",
  "Assessing Risk",
];

const SWAP_MANDATE: MandateCardData = {
  id: "spaceformandate ID",
  subtitle: "Swap 100 USDC for WBTC",
  from: { amount: "100.00", usdValue: "$100.00", token: "USDC" },
  to:   { amount: "0.00165", usdValue: "$102.00", token: "WBTC" },
  expiresInSeconds: 598,
  network: "Base",
  recipient: "0x742d…abcd",
};

type Intent = "swap" | "portfolio" | "other";
type Phase  = "idle" | "thinking" | "done";

function detectIntent(msg: string): Intent {
  const l = msg.toLowerCase();
  if (l.includes("portfolio") || l.includes("rundown") || l.includes("balance")) return "portfolio";
  if (l.includes("swap") || l.includes("usd") || l.includes("btc") || l.includes("eth")) return "swap";
  return "other";
}

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [phase, setPhase]               = useState<Phase>("idle");
  const [intent, setIntent]             = useState<Intent>("other");
  const [userMessage, setUserMessage]   = useState("");
  const [statusIdx, setStatusIdx]       = useState(0);
  const [statusVisible, setStatusVisible] = useState(true);
  const [thinkSecs, setThinkSecs]       = useState(0);

  useEffect(() => {
    if (phase !== "thinking") return;

    // Portfolio: show "Thinking..." for 3s then done
    if (intent === "portfolio") {
      const start = Date.now();
      const tick = setInterval(() => setThinkSecs(Math.floor((Date.now() - start) / 100) / 10), 100);
      const done = setTimeout(() => {
        clearInterval(tick);
        setPhase("done");
      }, 3000);
      return () => { clearInterval(tick); clearTimeout(done); };
    }

    // Swap: cycle through all steps
    let i = 0;
    const timer = setInterval(() => {
      setStatusVisible(false);
      setTimeout(() => {
        i += 1;
        if (i >= SWAP_STEPS.length) { clearInterval(timer); setPhase("done"); return; }
        setStatusIdx(i);
        setStatusVisible(true);
      }, 280);
    }, 900);
    return () => clearInterval(timer);
  }, [phase, intent]);

  function handleSubmit(msg: string) {
    const det = detectIntent(msg);
    setUserMessage(msg);
    setIntent(det);
    setStatusIdx(0);
    setStatusVisible(true);
    setThinkSecs(0);
    setPhase("thinking");
  }

  function handleReset() {
    setPhase("idle");
    setUserMessage("");
    setStatusIdx(0);
    setThinkSecs(0);
  }

  // Label shown next to avatar when done
  const doneLabel = intent === "portfolio"
    ? `Thought for ${thinkSecs.toFixed(1)}s`
    : "Swapping all your USDT Balance now";

  return (
    <div className="h-screen bg-bg-base flex overflow-hidden">

      <HomeSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        onNewChat={handleReset}
      />

      <div
        className="relative flex-1 flex flex-col overflow-hidden"
        onClick={() => { if (sidebarOpen) setSidebarOpen(false); }}
      >

        {/* Wave background */}
        <div className="absolute inset-0 pointer-events-none select-none flex items-end justify-center">
          <Image src="/bg-waves.svg" alt="" width={1440} height={652} className="w-full h-auto" priority />
        </div>

        {/* Top bar */}
        <div className="relative z-10 flex justify-end px-5 pt-5 flex-shrink-0">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white transition-all font-sans text-[13px] font-medium backdrop-blur-sm"
          >
            Login
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5.5 2.5H3C2.44772 2.5 2 2.94772 2 3.5V11C2 11.5523 2.44772 12 3 12H5.5" />
              <path d="M9.5 9.5L12 7L9.5 4.5M12 7H5.5" />
            </svg>
          </Link>
        </div>

        {/* ── IDLE ────────────────────────────────────────────────── */}
        {phase === "idle" && (
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 animate-fade-up">
            <div className="flex flex-col items-center gap-6 w-full max-w-[704px]">
              <Image src="/wach-mascot.svg" alt="WachAI" width={52} height={52} priority />
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="font-sans font-semibold text-[38px] leading-[1.15] tracking-[-0.5px] text-accent-mint">
                  Welcome to WachAI
                </h1>
                <p className="font-mono text-[14px] text-white/40 tracking-wide">
                  Verify and Swap Tokens on Base With Confidence
                </p>
              </div>
              <GlassInput onSubmit={handleSubmit} placeholder="Ask me anything" className="w-full" />
              <SuggestionChips suggestions={SUGGESTIONS} onSelect={handleSubmit} />
            </div>
          </div>
        )}

        {/* ── THINKING / DONE ─────────────────────────────────────── */}
        {phase !== "idle" && (
          <div className="relative z-10 flex-1 flex flex-col overflow-hidden animate-fade-up">

            <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pt-6 pb-24">
              <div className="max-w-[664px] mx-auto flex flex-col gap-5">

                {/* User bubble */}
                <div className="flex justify-end">
                  <div className="px-5 py-3 rounded-2xl bg-white/[0.07] border border-white/[0.09] font-sans text-[15px] text-white/90 max-w-[80%]">
                    {userMessage}
                  </div>
                </div>

                {/* Avatar + status */}
                <div className="flex items-center gap-4">
                  <ThinkingRing size={52} active={phase === "thinking"}>
                    <Image src="/wach-mascot.svg" alt="WachAI" width={34} height={34} />
                  </ThinkingRing>

                  {phase === "thinking" && intent === "portfolio" && (
                    <span className="font-mono text-[15px] text-white/55 transition-opacity duration-200">
                      Thinking...
                    </span>
                  )}

                  {phase === "thinking" && intent !== "portfolio" && (
                    <span
                      className="font-mono text-[15px] text-white/55 transition-opacity duration-200"
                      style={{ opacity: statusVisible ? 1 : 0 }}
                    >
                      {SWAP_STEPS[statusIdx]}
                    </span>
                  )}

                  {phase === "done" && (
                    <span className="font-mono text-[15px] text-white/70">{doneLabel}</span>
                  )}
                </div>

                {/* Result card */}
                {phase === "done" && intent === "portfolio" && (
                  <div className="animate-fade-up">
                    <PortfolioCard />
                  </div>
                )}

                {phase === "done" && intent === "swap" && (
                  <div className="animate-fade-up">
                    <MandateCard data={SWAP_MANDATE} />
                  </div>
                )}

              </div>
            </div>

            {/* Input pinned bottom */}
            <div className="fixed bottom-0 left-0 right-0 z-20 px-6 pb-6 pt-2">
              <div className="max-w-[664px] mx-auto">
                <GlassInput onSubmit={handleSubmit} placeholder="Ask me anything" className="w-full" />
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
