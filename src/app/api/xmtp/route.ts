import { NextRequest, NextResponse } from "next/server";

// POST /api/xmtp/send
// Sends a mandate payload to a peer via XMTP (Node SDK v6)
// Body: { peerAddress, mandate }
export async function POST(req: NextRequest) {
  try {
    const { peerAddress, mandate } = await req.json();
    if (!peerAddress || !mandate) {
      return NextResponse.json({ error: "peerAddress and mandate are required" }, { status: 400 });
    }

    const { Client }  = await import("@xmtp/node-sdk");
    const { ethers }  = await import("ethers");

    const pk = process.env.SERVER_PRIVATE_KEY;
    if (!pk) throw new Error("SERVER_PRIVATE_KEY not set");

    const wallet = new ethers.Wallet(pk);

    // XMTP v6 Signer interface
    const xmtpSigner = {
      getAddress:  () => wallet.address,
      signMessage: (msg: string) => wallet.signMessage(msg),
    };

    // Check if peer is reachable on XMTP network (static method in v6)
    const canMessageMap = await Client.canMessage(
      [{ identifier: peerAddress, identifierKind: 0 }],
      "production"
    );
    if (!canMessageMap.get(peerAddress)) {
      return NextResponse.json({ error: "Peer is not on the XMTP network" }, { status: 422 });
    }

    // Create client and send DM
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const client = await Client.create(xmtpSigner as any, { env: "production" } as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const conversation = await client.conversations.createDmWithIdentifier({
      identifier: peerAddress,
      identifierKind: 0,
    });
    await conversation.sendText(JSON.stringify(mandate));

    return NextResponse.json({ ok: true, conversationId: conversation.id });
  } catch (err) {
    console.error("[POST /api/xmtp/send]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
