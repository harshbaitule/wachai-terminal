import { NextRequest, NextResponse } from "next/server";
import { getWachaiService } from "@/lib/services/wachai-service";

// POST /api/mandate
// Body: { clientAddress, intent, core, deadlineMinutes? }
// Returns: the newly created mandate signed by the server
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientAddress, intent, core, deadlineMinutes, chainId } = body;

    if (!clientAddress || !intent || !core) {
      return NextResponse.json(
        { error: "clientAddress, intent, and core are required" },
        { status: 400 }
      );
    }

    const service  = getWachaiService();
    const mandate  = await service.createMandate({ clientAddress, intent, core, deadlineMinutes, chainId });

    return NextResponse.json({ mandate }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/mandate]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
