"use client";

import { FormEvent, KeyboardEvent, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// ── ChatInput ──────────────────────────────────────────────────
// From DSComponents: glass input + send button (rgba(76,76,76,0.56) bg).
// Matches Figma: ChatInput fill=rgba(28,28,28,0.20), placeholder "Ask me anything".

interface ChatInputProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function ChatInput({
  onSubmit,
  placeholder = "Ask me anything",
  disabled = false,
  className,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
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
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-end gap-sm px-lg py-md rounded-xl",
        "bg-bg-input border border-border-default",
        "focus-within:border-border-mid transition-colors",
        className,
      )}
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
          "flex-1 resize-none bg-transparent outline-none",
          "font-mono text-[15px] font-normal leading-[19.5px]",
          "text-text-primary placeholder:text-text-primary/30",
          "disabled:opacity-40",
          "scrollbar-hide",
        )}
      />
      <button
        type="submit"
        disabled={!value.trim() || disabled}
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center",
          "bg-[rgba(76,76,76,0.56)] border border-border-default",
          "text-text-muted hover:text-text-primary hover:bg-surface-mid",
          "disabled:opacity-30 disabled:cursor-not-allowed",
          "transition-colors duration-150",
        )}
        aria-label="Send message"
      >
        <SendIcon />
      </button>
    </form>
  );
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M1.5 7L12.5 1.5L9 12.5L7 7.5L1.5 7Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
