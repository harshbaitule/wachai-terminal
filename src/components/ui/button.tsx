"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

// ── Button ─────────────────────────────────────────────────────
// Variants from DSComponents:
//   primary   — accent-mint fill (main CTA)
//   secondary — surface-mid fill (ghost-like)
//   signed    — black bg + green text (post-sign state)
//   ghost     — transparent + border

export type ButtonVariant = "primary" | "secondary" | "signed" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-mint text-bg-base font-semibold hover:opacity-90 active:opacity-80",
  secondary:
    "bg-surface-mid text-text-secondary border border-border-default hover:bg-surface-lg hover:text-text-primary",
  signed:
    "bg-black text-status-success border border-status-success/30 font-semibold cursor-default",
  ghost:
    "bg-transparent text-text-muted border border-border-default hover:border-border-mid hover:text-text-secondary",
  danger:
    "bg-status-error/15 text-status-error border border-status-error/30 hover:bg-status-error/25",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-md py-[6px] text-[13px] leading-[19.5px] rounded-sm gap-[6px]",
  md: "px-lg py-[10px] text-[14px] leading-[21px] rounded-sm gap-sm",
  lg: "px-xl py-md text-[16px] leading-[24px] rounded-md gap-sm",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "secondary", size = "md", loading, className, children, disabled, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-sans transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint/50 disabled:opacity-40 disabled:cursor-not-allowed select-none",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          children
        )}
      </button>
    );
  },
);
Button.displayName = "Button";

// ── SuggestionPill ─────────────────────────────────────────────
// From DSComponents — glass bg + muted mono text, pill shape.
// Used as quick-action chips in the chat home screen.

interface SuggestionPillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  className?: string;
}

export function SuggestionPill({ label, className, ...props }: SuggestionPillProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center px-lg py-[10px] rounded-pill",
        "bg-surface-mid border border-border-default",
        "font-mono text-[16px] font-semibold leading-[24px] text-text-muted",
        "hover:bg-surface-lg hover:text-text-secondary transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint/50",
        className,
      )}
      {...props}
    >
      {label}
    </button>
  );
}
