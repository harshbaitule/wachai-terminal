"use client";

import { cn } from "@/lib/utils";

// ── Token color palette ─────────────────────────────────────────
// From DSComponents: each token symbol gets a deterministic accent color.

const TOKEN_COLORS: Record<string, string> = {
  ETH:  "#3E73C4",
  USDC: "#26A17B",
  BTC:  "#F7931A",
  WBTC: "#F7931A",
  AERO: "#FF6A00",
  WACH: "#B4CFC1",
  USDT: "#26A17B",
  DAI:  "#F5AC37",
  MATIC: "#8247E5",
  SOL:  "#9945FF",
};

function getTokenColor(symbol: string): string {
  return TOKEN_COLORS[symbol.toUpperCase()] ?? "#B4CFC1";
}

// ── TokenIcon ──────────────────────────────────────────────────
// Circular icon showing the first 2 letters of the token symbol.
// bg: #D9D9D9, text: token-specific color

interface TokenIconProps {
  symbol: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const iconSizes = {
  sm: { outer: "w-6 h-6", font: "text-[9px]" },
  md: { outer: "w-8 h-8", font: "text-[11.88px]" },
  lg: { outer: "w-10 h-10", font: "text-[14px]" },
};

export function TokenIcon({ symbol, size = "md", className }: TokenIconProps) {
  const letters = symbol.slice(0, 2).toUpperCase();
  const color = getTokenColor(symbol);
  const { outer, font } = iconSizes[size];

  return (
    <span
      className={cn(
        "rounded-full flex items-center justify-center flex-shrink-0 bg-[#D9D9D9]",
        outer,
        className,
      )}
    >
      <span
        className={cn("font-mono font-bold leading-tight", font)}
        style={{ color }}
      >
        {letters}
      </span>
    </span>
  );
}

// ── TokenWithLabel ─────────────────────────────────────────────
// TokenIcon + name/ticker + optional price. From DSComponents.

interface TokenWithLabelProps {
  symbol: string;
  name?: string;
  price?: string;
  iconSize?: "sm" | "md" | "lg";
  className?: string;
}

export function TokenWithLabel({
  symbol,
  name,
  price,
  iconSize = "md",
  className,
}: TokenWithLabelProps) {
  return (
    <div className={cn("flex items-center gap-sm", className)}>
      <TokenIcon symbol={symbol} size={iconSize} />
      <div className="flex flex-col min-w-0">
        <span className="font-mono text-[14px] font-medium leading-[21px] text-text-primary truncate">
          {name ?? symbol}
        </span>
        {price && (
          <span className="font-mono text-[12px] font-normal leading-[18px] text-text-secondary">
            {price}
          </span>
        )}
      </div>
    </div>
  );
}
