"use client";

// ── ThinkingRing ───────────────────────────────────────────────
// Reusable spinning arc ring around any children (logo, avatar…).
// Usage: <ThinkingRing size={52} active><Image .../></ThinkingRing>

interface ThinkingRingProps {
  size?: number;
  active?: boolean;
  children: React.ReactNode;
}

export function ThinkingRing({ size = 52, active = true, children }: ThinkingRingProps) {
  const stroke = 1.5;
  const r = size / 2 - stroke - 2; // 2px gap from edge
  const cx = size / 2;
  const circumference = 2 * Math.PI * r;
  const arc = circumference * 0.28;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      {active && (
        <svg
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: "1.3s", animationTimingFunction: "linear" }}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Faint track */}
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={stroke}
          />
          {/* Glowing arc */}
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${arc} ${circumference - arc}`}
            strokeDashoffset={0}
          />
        </svg>
      )}
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
