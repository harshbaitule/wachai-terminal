"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ── WalletButton ───────────────────────────────────────────────
// Reusable large wallet/auth button. Pass an icon node + label.

interface WalletButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
}

export function WalletButton({ icon, label, className, ...props }: WalletButtonProps) {
  return (
    <button
      className={cn(
        "flex items-center gap-3 w-full px-5 py-[15px] rounded-xl",
        "bg-[#1A1A1A] border border-white/[0.08]",
        "hover:bg-[#222] hover:border-white/[0.14]",
        "active:scale-[0.99] transition-all duration-150",
        className,
      )}
      {...props}
    >
      <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center">
        {icon}
      </span>
      <span className="font-mono text-[15px] font-normal text-white/90 tracking-tight">
        {label}
      </span>
    </button>
  );
}

// ── Wallet icons ───────────────────────────────────────────────

export function BaseIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="14" fill="#0052FF" />
      <path
        d="M14.0002 4.6665C8.84516 4.6665 4.66683 8.8415 4.66683 13.9998C4.66683 19.1582 8.84516 23.3332 14.0002 23.3332C19.1552 23.3332 23.3335 19.1582 23.3335 13.9998C23.3335 8.8415 19.1552 4.6665 14.0002 4.6665ZM14.0002 20.4165C10.458 20.4165 7.5835 17.542 7.5835 13.9998C7.5835 10.4577 10.458 7.5832 14.0002 7.5832C17.5423 7.5832 20.4168 10.4577 20.4168 13.9998C20.4168 17.542 17.5423 20.4165 14.0002 20.4165Z"
        fill="white"
      />
    </svg>
  );
}

export function PhantomIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#AB9FF2" />
      <path
        d="M22.5 13.5C22.5 18.5 18.5 22 14 22C9.5 22 5.5 18.5 5.5 13.5C5.5 8.5 9.5 6 14 6C18.5 6 22.5 8.5 22.5 13.5Z"
        fill="#160D35"
      />
      <ellipse cx="11" cy="13" rx="1.5" ry="2" fill="white" />
      <ellipse cx="17" cy="13" rx="1.5" ry="2" fill="white" />
      <path d="M10 17.5C11.5 19 16.5 19 18 17.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function RainbowIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#174299" />
      <path d="M5 18C5 18 5 11 14 11C23 11 23 18 23 18" stroke="#FF6B6B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M7.5 18C7.5 18 7.5 13.5 14 13.5C20.5 13.5 20.5 18 20.5 18" stroke="#FFD93D" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M10 18C10 18 10 16 14 16C18 16 18 18 18 18" stroke="#6BCB77" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function MetaMaskIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#1A1A1A" />
      <path d="M22 6L15.5 10.8L16.8 8.1L22 6Z" fill="#E17726" />
      <path d="M6 6L12.45 10.85L11.2 8.1L6 6Z" fill="#E27625" />
      <path d="M19.6 18.3L17.9 20.9L21.65 21.9L22.7 18.35L19.6 18.3Z" fill="#E27625" />
      <path d="M5.31 18.35L6.36 21.9L10.1 20.9L8.4 18.3L5.31 18.35Z" fill="#E27625" />
      <path d="M9.9 13.95L8.85 15.55L12.55 15.7L12.45 11.75L9.9 13.95Z" fill="#E27625" />
      <path d="M18.1 13.95L15.5 11.7L15.45 15.7L19.15 15.55L18.1 13.95Z" fill="#E27625" />
      <path d="M10.1 20.9L12.35 19.85L10.4 18.38L10.1 20.9Z" fill="#E27625" />
      <path d="M15.65 19.85L17.9 20.9L17.6 18.38L15.65 19.85Z" fill="#E27625" />
      <path d="M17.9 20.9L15.65 19.85L15.85 21.25L15.83 21.88L17.9 20.9Z" fill="#D5BFB2" />
      <path d="M10.1 20.9L12.17 21.88L12.16 21.25L12.35 19.85L10.1 20.9Z" fill="#D5BFB2" />
      <path d="M12.2 17.3L10.35 16.78L11.65 16.2L12.2 17.3Z" fill="#233447" />
      <path d="M15.8 17.3L16.35 16.2L17.66 16.78L15.8 17.3Z" fill="#233447" />
    </svg>
  );
}
