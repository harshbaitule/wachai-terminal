"use client";

import { cn, shortenAddress } from "@/lib/utils";

// ── WalletAvatar ──────────────────────────────────────────────
// Circular avatar with two-tone gradient (Avatar 1 + Avatar 2 colors).
// The design shows a circular frame split diagonally into #FFC300 / #FF6A00.

interface WalletAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const avatarSizes = {
  sm: "w-5 h-5",
  md: "w-7 h-7",
  lg: "w-9 h-9",
};

export function WalletAvatar({ size = "md", className }: WalletAvatarProps) {
  return (
    <span
      className={cn(
        "rounded-full flex-shrink-0 overflow-hidden",
        avatarSizes[size],
        className,
      )}
      style={{
        background: "linear-gradient(135deg, #FFC300 50%, #FF6A00 50%)",
      }}
    />
  );
}

// ── WalletChip ─────────────────────────────────────────────────
// Address pill shown in sidebar bottom — avatar + shortened address + optional disconnect.

interface WalletChipProps {
  address: string;
  connected?: boolean;
  onDisconnect?: () => void;
  className?: string;
}

export function WalletChip({
  address,
  connected = true,
  onDisconnect,
  className,
}: WalletChipProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-[6px] px-md py-[6px] rounded-pill",
        "bg-surface-mid border border-border-default",
        className,
      )}
    >
      <WalletAvatar size="sm" />
      <span className="font-mono text-[14px] font-medium leading-[21px] text-text-primary">
        {shortenAddress(address)}
      </span>
      {connected && (
        <span className="w-1.5 h-1.5 rounded-full bg-accent-green flex-shrink-0" />
      )}
      {onDisconnect && (
        <button
          onClick={onDisconnect}
          className="ml-1 text-text-muted hover:text-text-primary transition-colors text-[11px]"
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ── ProfileBadge ───────────────────────────────────────────────
// Larger address display with avatar — used in profile / account sections.

interface ProfileBadgeProps {
  address: string;
  className?: string;
}

export function ProfileBadge({ address, className }: ProfileBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-md px-md py-[8px] rounded-lg",
        "border border-border-mid bg-surface-mid",
        className,
      )}
    >
      <WalletAvatar size="md" />
      <span className="font-mono text-[13px] font-medium leading-[19.5px] text-text-primary">
        {shortenAddress(address, 6)}
      </span>
    </div>
  );
}
