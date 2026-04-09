import { NextRequest, NextResponse } from "next/server";
import { getWachaiService } from "@/lib/services/wachai-service";

// POST /api/mandate/sign
// Body: { mandate }  (mandate JSON previously created by the server)
// Returns: mandate with client signature appended
export async function POST(req: NextRequest) {
  try {
    const { mandate } = await req.json();
    if (!mandate) {
      return NextResponse.json({ error: "mandate is required" }, { status: 400 });
    }

    const service = getWachaiService();
    const signed  = await service.signAsClient(mandate);

    return NextResponse.json({ mandate: signed });
  } catch (err) {
    console.error("[POST /api/mandate/sign]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
