import { NextRequest, NextResponse } from "next/server";
import { getWachaiService } from "@/lib/services/wachai-service";

// POST /api/mandate/verify
// Body: { mandate }
// Returns: { server: { ok, error? }, client: { ok, error? } }
export async function POST(req: NextRequest) {
  try {
    const { mandate } = await req.json();
    if (!mandate) {
      return NextResponse.json({ error: "mandate is required" }, { status: 400 });
    }

    const service = getWachaiService();
    const result  = await service.verifyMandate(mandate);

    const allOk = result.server.ok && result.client.ok;
    return NextResponse.json({ valid: allOk, result }, { status: allOk ? 200 : 422 });
  } catch (err) {
    console.error("[POST /api/mandate/verify]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
