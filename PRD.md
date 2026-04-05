# WachAI Terminal — Frontend Web Application
## Product Requirements Document

---

## 1. Overview

**WachAI Terminal Web** is a browser-based interface for creating, signing, verifying, and exchanging **WachAI Mandates** — cryptographically signed, deterministic agreement objects between AI agents.

The existing product is a CLI tool (`wachai`) that enables agent-to-agent commerce by providing verifiable agreements: structured objects that record what was offered, what was accepted, and cryptographic proof that both parties agreed. The web frontend brings this same workflow into a visual, accessible interface — inspired by the design philosophy of [HeyElsa](https://app.heyelsa.ai/) — without requiring command-line expertise.

A mandate is only **approved** once it carries both signatures:
- **Server role** — creates the mandate and signs first (offer)
- **Client role** — signs second (acceptance)

Mandates are shared between agents over **XMTP**, a decentralized messaging protocol for EVM wallets.

---

## 2. Problem Statement

The current CLI-only tool creates several friction points:

| Pain Point | Impact |
|---|---|
| Terminal fluency required | Non-technical operators and product stakeholders cannot participate in mandate workflows without developer involvement |
| Manual key management | Users must manage `wallet.json` files or export environment variables manually across sessions |
| Multi-terminal workflows | Server and client roles require running separate terminal sessions simultaneously with no shared state view |
| No mandate history or search | All mandate storage is flat JSON files; there is no filtering, search, or status tracking |
| No visual XMTP feedback | Users must poll a running terminal process to know if a message arrived |

---

## 3. Target Users

| User | Description | Primary Need |
|---|---|---|
| **AI Agent Developers** | Build and test agent pipelines that exchange mandates | Dev dashboard to create, inspect, and verify mandates quickly |
| **DeFi / Automation Operators** | Run swap, payment, and bridge agents | Review incoming mandate offers visually and sign/reject with one click |
| **Product Teams / Non-technical Stakeholders** | Oversee agent operations and audit history | Read-only ledger view and audit trail without touching a terminal |

---

## 4. Core Features

### F1 — Wallet Manager
- Connect existing wallet via MetaMask / WalletConnect
- Generate a new EVM wallet (equivalent to `wachai wallet init`)
- Import/export `wallet.json`
- Display connected address and connection status persistently in sidebar

### F2 — Conversational Home (Chat Interface)
- Natural language entry point: users describe intent in plain English
- AI interprets intent and surfaces the appropriate inline action card (create, sign, view)
- Suggestion chips for common actions (create mandate, view pending, check inbox)
- No page navigation — actions happen inline within the chat thread

### F3 — Mandate Creator (Slide-Up Panel)
- Two modes: **Registry-backed** (validates `--kind` and `--body` against JSON schema) and **Custom** (free-form JSON body)
- Kind selector (dropdown of registered primitives e.g. `swap@1`, `transfer@1`, or free text)
- Intent text input
- JSON body editor with live schema validation
- Preview card before creation; single confirm → creates + signs as server in one step

### F4 — Mandate Ledger
- Filterable/searchable table of all stored mandates
- Status badges: `Pending` (server-signed only), `Approved` (both signatures), `Failed`
- Inline row expansion (drawer) to inspect full mandate details without page navigation
- Per-row actions: Sign (if client), Verify, Send via XMTP, Copy JSON

### F5 — Mandate Signer
- Triggered from ledger drawer or inbox card
- Displays full mandate details: kind, intent, body JSON, server signature
- Single [Sign as Client] confirm → signs and updates status to Approved

### F6 — Mandate Verifier
- Triggered from ledger or inline action card
- Verifies both signatures and shows per-party result (✅ / ❌ with address and timestamp)
- Equivalent to `wachai verify <mandateId>` exit code 0/1

### F7 — XMTP Inbox
- Real-time streaming feed of incoming mandate envelopes over XMTP V3
- Auto-saves received mandates to the ledger with "Saved ✅" indicator
- Per-message actions: View Mandate, Sign & Accept
- Live connection indicator (● Live / ○ Reconnecting)

### F8 — XMTP Send
- Modal: select mandate from ledger + enter receiver EVM address
- Toggle: Send offer vs. Send as Accept (`--action accept` equivalent)
- XMTP environment selector (production / dev)

### F9 — Settings
- Wallet: import, export, generate, view address
- XMTP environment toggle (production / dev)
- Storage: mandate count, export all as ZIP
- Danger zone: clear all local mandates (with confirmation)

---

## 5. Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | File-based routing, API routes for any CLI bridging, SSR for mandate detail sharing |
| **Language** | TypeScript | Matches `wachai` CLI source; type safety for mandate schemas |
| **Styling** | Tailwind CSS + shadcn/ui | Dark-mode-first component library; rapid UI development |
| **Wallet** | wagmi v2 + viem | EVM wallet connection (MetaMask, WalletConnect 2.0) |
| **Messaging** | @xmtp/xmtp-js V3 | Mandate transport; mirrors CLI's XMTP dependency exactly |
| **State Management** | Zustand | Lightweight global state for mandate ledger + inbox stream |
| **JSON Schema Validation** | ajv | Validate mandate body against registry primitives (mirrors CLI registry validation) |
| **Local Persistence** | IndexedDB via `idb` | Browser-side mandate storage, mirrors `~/.wachai/mandates/` |
| **AI / Chat** | Vercel AI SDK + Claude API | Natural language intent parsing for the conversational home screen |
| **Testing** | Vitest + Playwright | Unit tests for mandate crypto logic; E2E for create → sign → verify flow |

---

## 6. Screen Specs

> **Design Reference: [HeyElsa](https://app.heyelsa.ai/)** — chat-first, minimal chrome, single-screen philosophy. Multi-step flows are collapsed into a single interaction surface with inline confirmations rather than separate page navigations.

---

### Global Shell (persistent across all screens)

```
┌─────────────────────────────────────────────────────────────┐
│  LEFT SIDEBAR (240px, collapsible)  │  MAIN CONTENT AREA    │
│                                     │                        │
│  [WachAI logo]                      │  (screen-specific)     │
│                                     │                        │
│  ● Chat / Home                      │                        │
│  ● Mandates                         │                        │
│  ● Inbox  [3]  ← unread badge       │                        │
│  ● Settings                         │                        │
│                                     │                        │
│  ─────────────────────────────      │                        │
│  Wallet chip:                       │                        │
│  0xABCD…1234  [● connected]         │                        │
│  [Disconnect]                       │                        │
└─────────────────────────────────────────────────────────────┘
```

**Rules:**
- Sidebar always visible on desktop (≥ 1024px); hamburger drawer on mobile
- Wallet address + connection state pinned to sidebar bottom
- Active nav item highlighted with accent color
- Unread inbox count shown as badge on Inbox nav item

---

### Screen 1 — Chat / Home (`/`)

The primary entry point. Mirrors HeyElsa's conversational model: users describe intent in natural language; WachAI surfaces the correct action inline without navigating away.


```

**Behaviour notes:**
- Suggestion chips are context-aware (adapt to recent activity after first use)
- Message thread shows role labels (You / WachAI) and timestamps
- After confirming an action card, a success message appears in-thread and mandate is added to ledger


link to exact screen - https://www.figma.com/design/C11vedDjHZzliAC3DLgqOO/Wach-design-system?node-id=13-42&t=HvpEzdkyYXkIec60-4
---

### Screen 2 — login page)


```

use the link - https://www.figma.com/design/C11vedDjHZzliAC3DLgqOO/Wach-design-system?node-id=15-162&t=HvpEzdkyYXkIec60-4

---

### Screen 3 — home after login with sidebar

Triggered by [+ New] in the ledger or from a chat action card. Opens as a right-side panel / bottom sheet over the current screen.

```
use the link - https://www.figma.com/design/C11vedDjHZzliAC3DLgqOO/Wach-design-system?node-id=5-3052&t=HvpEzdkyYXkIec60-4
```

**Behaviour notes:**
- Schema validation runs live against the registry JSON schema (green ✅ / red error with field callout)
- Registry mode: Kind dropdown populated from public primitives registry
- Custom mode: Kind is free text; no schema validation
- On submit: panel closes, success toast shown, mandate appears at top of ledger with `● Pending` status

---



### UX Principles (HeyElsa-inspired)

| Principle | Implementation |
|---|---|
| **Chat-first entry** | Landing screen is a chat; all features reachable via natural language |
| **No page navigations for actions** | Create / Sign / Verify use slide-up panels and inline cards within the current view |
| **Transaction preview before commit** | Every create/sign shows a preview card with [Confirm] + [Cancel] before executing |
| **Single-screen philosophy** | Mandate details expand inline (drawer) instead of routing to a new page |
| **Real-time feedback** | XMTP inbox streams live; status badges update without refresh |
| **Dark-mode first** | Default dark theme matching crypto/agent tooling conventions |

---

*Document version: 1.0 — March 2026*
