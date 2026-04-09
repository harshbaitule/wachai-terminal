import { NextRequest, NextResponse } from "next/server";
import { getWachaiService } from "@/lib/services/wachai-service";

// POST /api/chat
// Interprets a user message, determines intent, and returns:
//  - for swap intents: a server-signed mandate
//  - for portfolio queries: triggers portfolio fetch (stub)
//  - for unknown: a plain text reply
//
// Body: { message, clientAddress }
export async function POST(req: NextRequest) {
  try {
    const { message, clientAddress } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const service = getWachaiService();
    const intent  = detectIntent(message);

    if (intent === "swap" && clientAddress) {
      const parsed = service.parseSwapIntent(message);
      if (parsed) {
        const deadline = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        const core = {
          kind: "swap@1" as const,
          payload: {
            amountIn:  parsed.amountIn,
            tokenIn:   parsed.tokenIn,
            tokenOut:  parsed.tokenOut,
            minOut:    parsed.minOut,
            recipient: clientAddress.replace(/^eip155:\d+:/, ""),
            deadline,
            chainId:   8453,
          },
        };
        const mandate = await service.createMandate({ clientAddress, intent: message, core });
        return NextResponse.json({ intent: "swap", mandate });
      }
    }

    if (intent === "portfolio") {
      // Stub — wire up on-chain balance fetching here
      return NextResponse.json({ intent: "portfolio", data: null });
    }

    return NextResponse.json({ intent: "other", reply: null });
  } catch (err) {
    console.error("[POST /api/chat]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

function detectIntent(message: string): "swap" | "portfolio" | "other" {
  const lower = message.toLowerCase();
  if (/\bswap\b|\bexchange\b|\btrade\b|\bconvert\b/.test(lower)) return "swap";
  if (/\bportfolio\b|\bbalance\b|\bholdings\b|\brundown\b/.test(lower)) return "portfolio";
  return "other";
}
