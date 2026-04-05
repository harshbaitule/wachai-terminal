"use client";

import { cn } from "@/lib/utils";

// ── StatusBadge ────────────────────────────────────────────────
// Variants map directly to DSComponents: Signed · Verified · Active · Pending · Failed

export type StatusVariant =
  | "pending"
  | "signed"
  | "approved"
  | "verified"
  | "active"
  | "failed"
  | "default";

const statusStyles: Record<StatusVariant, string> = {
  pending:  "bg-[#6D6D6D] text-white/80",
  signed:   "bg-[#4BCC00]/15 text-[#4BCC00]",
  approved: "bg-[#4BCC00]/15 text-[#4BCC00]",
  verified: "bg-[#B4CFC1]/10 text-[#B4CFC1]",
  active:   "bg-[#57FF5A]/10 text-[#57FF5A]",
  failed:   "bg-[#FF4444]/15 text-[#FF4444]",
  default:  "bg-[#6D6D6D] text-white/80",
};

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const displayLabel = label ?? status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={cn(
        "inline-flex items-center px-[6px] py-[2px] rounded-sm font-sans text-[10px] font-normal leading-[15px]",
        statusStyles[status],
        className,
      )}
    >
      {displayLabel}
    </span>
  );
}

// ── MandateBadge ──────────────────────────────────────────────
// Displays a mandate ID as a compact chip — bg: #6D6D6D

interface MandateBadgeProps {
  id: string;
  className?: string;
}

export function MandateBadge({ id, className }: MandateBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-[6px] py-[2px] rounded-sm bg-[#6D6D6D] font-sans text-[10px] font-normal leading-[15px] text-white/80",
        className,
      )}
    >
      {id}
    </span>
  );
}
