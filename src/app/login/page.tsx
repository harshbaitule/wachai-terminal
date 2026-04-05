"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  WalletButton,
  BaseIcon,
  PhantomIcon,
  RainbowIcon,
  MetaMaskIcon,
} from "@/components/ui/wallet-button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  function handleContinue() {
    if (email.trim()) router.push("/");
  }

  function handleWallet() {
    router.push("/");
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden">

      {/* ── LEFT — branding panel ──────────────────────────────── */}
      <div className="relative hidden lg:flex flex-col w-[55%] bg-[#141414] overflow-hidden">

        {/* Mascot — full cover */}
        <Image
          src="/login-mascot.png"
          alt="WachAI mascot"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

        {/* Corner crosshairs */}
        <Crosshair className="absolute top-[72px] left-[72px]" />
        <Crosshair className="absolute top-[72px] right-[72px]" />
        <Crosshair className="absolute bottom-[72px] left-[72px]" />
        <Crosshair className="absolute bottom-[72px] right-[72px]" />

        {/* Bottom branding */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center gap-4 p-8">
          <div className="border border-white/40 px-3 py-1.5 rounded-sm backdrop-blur-sm bg-black/20">
            <span className="font-mono text-[13px] font-semibold text-white tracking-[0.15em] uppercase">
              Wach.AI
            </span>
          </div>
          <p className="font-sans text-[14px] text-white/60 leading-snug max-w-[200px]">
            Verify and Swap Tokens on Base with confidence.
          </p>
        </div>
      </div>

      {/* ── RIGHT — auth panel ────────────────────────────────── */}
      <div className="flex flex-col flex-1 items-center justify-center px-8 bg-[#0A0A0A]">
        <div className="w-full max-w-[380px] flex flex-col gap-6">

          {/* Heading */}
          <h1 className="font-sans font-bold text-[32px] leading-tight text-white text-center">
            Log in or sign up
          </h1>

          {/* Email + Continue */}
          <div className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleContinue()}
              placeholder="your@email.com"
              className="w-full px-4 py-[14px] rounded-xl bg-transparent border border-white/15 text-white text-[15px] font-sans placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
            />
            <button
              onClick={handleContinue}
              className="w-full py-[14px] rounded-xl bg-white text-black font-sans font-semibold text-[15px] hover:bg-white/90 active:scale-[0.99] transition-all duration-150"
            >
              Continue
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="font-mono text-[11px] text-white/30 uppercase tracking-[0.12em]">
              or continue with
            </span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          {/* Wallet buttons */}
          <div className="flex flex-col gap-3">
            <WalletButton icon={<BaseIcon />}     label="Sign in with Base"        onClick={handleWallet} />
            <WalletButton icon={<PhantomIcon />}  label="Connect Phantom"          onClick={handleWallet} />
            <WalletButton icon={<RainbowIcon />}  label="Connect Rainbow wallet"   onClick={handleWallet} />
            <WalletButton icon={<MetaMaskIcon />} label="Connect MetaMask wallet"  onClick={handleWallet} />
          </div>

        </div>
      </div>

    </div>
  );
}

// ── Crosshair corner mark ──────────────────────────────────────

function Crosshair({ className }: { className?: string }) {
  return (
    <div className={`w-5 h-5 flex items-center justify-center ${className ?? ""}`}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 0V20M0 10H20" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
      </svg>
    </div>
  );
}
