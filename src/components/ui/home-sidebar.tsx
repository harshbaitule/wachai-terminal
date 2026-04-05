"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const CHAT_HISTORY = [
  { id: "1", label: "Verify $TRUMP",    active: true  },
  { id: "2", label: "Approve $BIDEN",   active: false },
  { id: "3", label: "Audit $SANDERS",   active: false },
  { id: "4", label: "Validate $HARRIS", active: false },
  { id: "5", label: "Confirm $YANG",    active: false },
];

interface HomeSidebarProps {
  open: boolean;
  onToggle: () => void;
  onNewChat?: () => void;
}

export function HomeSidebar({ open, onToggle, onNewChat }: HomeSidebarProps) {
  return (
    <div
      className={cn(
        "relative h-full flex-shrink-0 flex bg-bg-sidebar",
        "transition-all duration-300 ease-in-out",
        open ? "w-[264px]" : "w-[52px]",
      )}
    >
      {/* ── Icon rail — always visible ──────────────────────────── */}
      <div className="w-[52px] flex-shrink-0 flex flex-col items-center pt-5 gap-2 z-10">
        <button
          onClick={onToggle}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200",
            open
              ? "bg-white/10 text-accent-mint"
              : "text-white/40 hover:bg-white/[0.06] hover:text-white/70",
          )}
          aria-label={open ? "Close sidebar" : "Open sidebar"}
        >
          <SidebarIcon />
        </button>
      </div>

      {/* ── Expanded panel ──────────────────────────────────────── */}
      <div
        className={cn(
          "absolute left-[52px] top-0 h-full",
          "w-[212px] flex flex-col",
          "bg-bg-sidebar border-r border-white/[0.06]",
          "transition-all duration-300 ease-in-out overflow-hidden",
          open ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 -translate-x-4 pointer-events-none",
        )}
      >
        <div className="flex items-center gap-2.5 px-4 pt-5 pb-3 flex-shrink-0">
          <Image src="/wach-mascot.svg" alt="WachAI" width={26} height={26} />
          <span className="font-sans text-[13px] font-semibold text-white/80 tracking-tight">WachAI</span>
        </div>

        <div className="px-2 pb-3 flex-shrink-0">
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-white/60 hover:text-white/90 hover:bg-white/[0.06] transition-colors"
          >
            <EditIcon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-sans text-[13px] font-medium">New chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-2 pb-4">
          <p className="px-3 pb-1.5 pt-0.5 font-sans text-[10px] font-semibold text-white/25 uppercase tracking-widest">
            Your chats
          </p>
          <ul className="flex flex-col gap-[2px]">
            {CHAT_HISTORY.map((chat, i) => (
              <li key={chat.id}>
                <button
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 rounded-lg",
                    "font-sans text-[13px] text-left transition-all duration-150",
                    "animate-slide-in",
                    chat.active
                      ? "bg-white/[0.08] text-white"
                      : "text-white/45 hover:text-white/80 hover:bg-white/[0.04]",
                  )}
                  style={{ animationDelay: open ? `${i * 35}ms` : "0ms" }}
                >
                  <span className="truncate">{chat.label}</span>
                  {chat.active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-mint flex-shrink-0 ml-2" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────

function SidebarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M11.596 10.204V5.799C11.596 5.615 11.512 5.48767 11.344 5.417C11.176 5.34633 11.0263 5.377 10.895 5.509L8.964 7.441C8.806 7.59833 8.727 7.78467 8.727 8C8.727 8.21533 8.80767 8.404 8.969 8.566L10.896 10.492C11.0267 10.6233 11.176 10.6553 11.344 10.588C11.512 10.5207 11.596 10.3927 11.596 10.204ZM1.616 16C1.17133 16 0.791 15.8417 0.475 15.525C0.159 15.2083 0.000666667 14.8287 0 14.386V1.615C0 1.171 0.158333 0.791 0.475 0.475C0.791667 0.159 1.17167 0.000666667 1.615 0H14.385C14.829 0 15.209 0.158333 15.525 0.475C15.841 0.791667 15.9993 1.17167 16 1.615V14.385C16 14.829 15.8417 15.209 15.525 15.525C15.2083 15.841 14.8283 15.9993 14.385 16H1.616ZM5 15H14.385C14.5383 15 14.6793 14.936 14.808 14.808C14.9367 14.68 15.0007 14.5387 15 14.384V1.616C15 1.462 14.936 1.32067 14.808 1.192C14.68 1.06333 14.5387 0.999333 14.384 1H5V15Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "w-4 h-4"} viewBox="0 0 16 16" fill="none">
      <path
        d="M4.57599 11.5699L5.98479 11.1635L14.4672 2.57999C14.5341 2.51143 14.5713 2.4193 14.5709 2.32351C14.5704 2.22772 14.5323 2.13594 14.4648 2.06802L13.9568 1.55445C13.924 1.52072 13.8847 1.49386 13.8414 1.47546C13.7981 1.45705 13.7515 1.44745 13.7045 1.44723C13.6574 1.447 13.6108 1.45616 13.5673 1.47415C13.5238 1.49215 13.4843 1.51863 13.4512 1.55205L4.99119 10.1131L4.57599 11.5699ZM14.9624 0.536905L15.4704 1.05128C16.1712 1.76083 16.1776 2.90557 15.4832 3.60793L6.74239 12.4538L3.73119 13.321C3.64016 13.3465 3.54498 13.354 3.45109 13.3428C3.35719 13.3316 3.26642 13.302 3.18396 13.2557C3.1015 13.2094 3.02897 13.1473 2.9705 13.073C2.91203 12.9987 2.86877 12.9136 2.8432 12.8226C2.80396 12.6906 2.80341 12.5501 2.8416 12.4178L3.71759 9.34599L12.4352 0.523306C12.6009 0.356402 12.7983 0.224173 13.0157 0.13433C13.2331 0.0444882 13.4662 -0.00116866 13.7015 2.2729e-05C13.9367 0.00121412 14.1693 0.0492299 14.3858 0.14127C14.6023 0.233309 14.7983 0.368331 14.9624 0.536905ZM5.74719 1.45925C6.14399 1.45925 6.46559 1.78483 6.46559 2.18641C6.46622 2.28134 6.44814 2.37546 6.41236 2.46339C6.37659 2.55133 6.32384 2.63135 6.25712 2.69888C6.1904 2.76642 6.11102 2.82014 6.02352 2.85698C5.93603 2.89381 5.84213 2.91304 5.74719 2.91357H2.8736C2.08 2.91357 1.4368 3.56473 1.4368 4.36708V13.0914C1.4368 13.8945 2.08 14.5457 2.8736 14.5457H11.4944C12.288 14.5457 12.932 13.8945 12.932 13.0914V10.1835C12.932 9.78196 13.2536 9.45638 13.6504 9.45638C14.0472 9.45638 14.3688 9.78196 14.3688 10.1843V13.0914C14.3688 14.6977 13.0816 16 11.4944 16H2.8736C1.2864 16 0 14.6977 0 13.0914V4.36708C0 2.76157 1.2864 1.45925 2.8736 1.45925H5.74719Z"
        fill="currentColor"
      />
    </svg>
  );
}
