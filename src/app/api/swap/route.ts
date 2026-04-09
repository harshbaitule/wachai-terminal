import { NextRequest, NextResponse } from "next/server";
import { getWachaiService, TOKENS } from "@/lib/services/wachai-service";

// POST /api/swap
// Parses a natural-language swap intent, builds a SwapCore,
// creates a server-signed mandate, and returns it ready for client acceptance.
//
// Body: { clientAddress, intent }
// Example intent: "swap 100 USDT to WBTC"
export async function POST(req: NextRequest) {
  try {
    const { clientAddress, intent } = await req.json();

    if (!clientAddress || !intent) {
      return NextResponse.json(
        { error: "clientAddress and intent are required" },
        { status: 400 }
      );
    }

    const service = getWachaiService();
    const parsed  = service.parseSwapIntent(intent);

    if (!parsed) {
      return NextResponse.json(
        {
          error: "Could not parse swap intent. Use format: 'swap <amount> <TOKEN> to <TOKEN>'",
          supportedTokens: Object.keys(TOKENS),
        },
        { status: 422 }
      );
    }

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

    const mandate = await service.createMandate({
      clientAddress,
      intent,
      core,
      deadlineMinutes: 10,
    });

    return NextResponse.json({ mandate, parsed }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/swap]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

// GET /api/swap/tokens — list supported tokens
export async function GET() {
  return NextResponse.json({
    tokens: Object.entries(TOKENS).map(([symbol, info]) => ({
      symbol,
      ...info,
      chainId: 8453,
    })),
  });
}
