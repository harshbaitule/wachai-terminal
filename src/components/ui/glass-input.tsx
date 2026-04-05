"use client";

import { FormEvent, KeyboardEvent, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GlassInputProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function GlassInput({
  onSubmit,
  placeholder = "Ask me anything",
  disabled = false,
  className,
}: GlassInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }

  return (
    <div className={cn("relative w-full", className)}>

      {/* SVG distortion filter definition */}
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden>
        <defs>
          <filter id="glass-distortion" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.45 0.55"
              numOctaves="3"
              seed="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="28"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
          </filter>
        </defs>
      </svg>

      {/* Button container */}
      <div style={{ position: "relative", borderRadius: "16px" }}>

        {/* Main input — the glass button */}
        <form
          onSubmit={handleSubmit}
          style={{
            position: "relative",
            zIndex: 9999,
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.22)",
            borderRadius: "16px",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.25)",
          }}
          className="flex items-center gap-3 pl-[26px] pr-3 h-[54px] w-full"
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              "flex-1 resize-none bg-transparent outline-none self-center",
              "font-mono text-[16px] font-normal leading-[19px] tracking-[-0.04em]",
              "text-white placeholder:text-white/60",
              "disabled:opacity-40 scrollbar-hide",
            )}
          />
          <button
            type="submit"
            disabled={!value.trim() || disabled}
            className={cn(
              "flex-shrink-0 w-[34px] h-[34px] rounded-full flex items-center justify-center",
              "bg-[rgba(76,76,76,0.56)] hover:bg-[rgba(76,76,76,0.75)]",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              "transition-all duration-150",
            )}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </form>

        {/* Glass overlay container */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "16px",
          height: "100%",
          width: "100%",
          pointerEvents: "none",
          overflow: "hidden",
        }}>
          {/* Main backdrop blur */}
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: "16px",
            backdropFilter: "blur(12px) brightness(1.6) saturate(1.8)",
            WebkitBackdropFilter: "blur(12px) brightness(1.6) saturate(1.8)",
          }} />

          {/* Top edge distortion strip */}
          <div style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "1.4rem",
            borderRadius: "9999px",
            backdropFilter: "url(#glass-distortion)",
            WebkitBackdropFilter: "url(#glass-distortion)",
          }} />

          {/* Bottom edge distortion strip */}
          <div style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "1.4rem",
            borderRadius: "9999px",
            backdropFilter: "url(#glass-distortion)",
            WebkitBackdropFilter: "url(#glass-distortion)",
          }} />

          {/* Left edge distortion strip */}
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "1.4rem",
            height: "100%",
            backdropFilter: "url(#glass-distortion)",
            WebkitBackdropFilter: "url(#glass-distortion)",
          }} />

          {/* Right edge distortion strip */}
          <div style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "1.4rem",
            height: "100%",
            backdropFilter: "url(#glass-distortion)",
            WebkitBackdropFilter: "url(#glass-distortion)",
          }} />
        </div>

      </div>
    </div>
  );
}

function SendIcon() {
  return (
    <svg width="13" height="10" viewBox="0 0 17 13" fill="none" aria-hidden>
      <path
        d="M15.2457 0.0496082C16.1164 -0.187042 16.9528 0.463579 16.6486 1.14086L11.5709 12.4267C11.2409 13.1587 9.92972 13.2 9.52521 12.4914L7.07505 8.2037L10.5236 5.52055C10.6372 5.42578 10.699 5.30042 10.696 5.1709C10.6931 5.04137 10.6256 4.91779 10.5079 4.82619C10.3901 4.73459 10.2312 4.68211 10.0647 4.67983C9.8982 4.67754 9.73704 4.72562 9.6152 4.81394L6.16578 7.49641L0.653557 5.59055C-0.257434 5.27524 -0.203443 4.25598 0.736686 3.99933L15.2457 0.0496082Z"
        fill="#B4CFC1"
      />
    </svg>
  );
}

// ── SuggestionChips ────────────────────────────────────────────

interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (label: string) => void;
  className?: string;
}

export function SuggestionChips({ suggestions, onSelect, className }: SuggestionChipsProps) {
  return (
    <div className={cn("flex items-center justify-center gap-sm flex-wrap", className)}>
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className={cn(
            "inline-flex items-center px-lg py-[10px] rounded-pill",
            "bg-white/[0.05] border border-white/10 backdrop-blur-sm",
            "font-sans text-[14px] font-medium text-white/50",
            "hover:bg-white/10 hover:text-white/70 hover:border-white/20",
            "transition-all duration-150 whitespace-nowrap",
          )}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
