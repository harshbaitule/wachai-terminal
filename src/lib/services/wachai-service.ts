import { Mandate, caip10 } from "@quillai-network/mandates-core";
import { ethers } from "ethers";
import { ulid } from "ulid";

// ── Types ──────────────────────────────────────────────────────

export interface SwapCore {
  kind: "swap@1";
  payload: {
    amountIn: string;       // smallest unit (e.g. USDC = 6 decimals)
    tokenIn: string;        // ERC-20 address
    tokenOut: string;       // ERC-20 address
    minOut: string;         // minimum output amount (slippage guard)
    recipient: string;      // beneficiary address
    deadline: string;       // ISO-8601
    chainId: number;
  };
}

export interface MandateCreateParams {
  clientAddress: string;   // CAIP-10 or bare 0x address
  chainId?: number;
  intent: string;          // human-readable intent string
  core: SwapCore;
  deadlineMinutes?: number;
}

export interface VerifyResult {
  server: { ok: boolean; error?: string };
  client: { ok: boolean; error?: string };
}

// ── Token registry (Base mainnet) ─────────────────────────────

export const TOKENS: Record<string, { address: string; decimals: number }> = {
  USDC:  { address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6  },
  USDT:  { address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2", decimals: 6  },
  WBTC:  { address: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c", decimals: 8  },
  ETH:   { address: "0x4200000000000000000000000000000000000006", decimals: 18 },
  WACH:  { address: "0x0000000000000000000000000000000000000000", decimals: 18 },
};

// ── WachaiService ──────────────────────────────────────────────

export class WachaiService {
  private signer: ethers.Wallet;
  private chainId: number;

  constructor(privateKey: string, chainId = 8453) {
    this.signer  = new ethers.Wallet(privateKey);
    this.chainId = chainId;
  }

  get serverAddress(): string {
    return this.signer.address;
  }

  // ── Mandate: create + sign as server (offer) ────────────────

  async createMandate(params: MandateCreateParams): Promise<object> {
    const { clientAddress, intent, core, deadlineMinutes = 10, chainId = this.chainId } = params;

    const normalizedClient = clientAddress.startsWith("eip155:")
      ? clientAddress
      : caip10(chainId, clientAddress);

    const normalizedServer = caip10(chainId, this.signer.address);

    const deadline = new Date(Date.now() + deadlineMinutes * 60 * 1000).toISOString();

    const mandate = new Mandate({
      mandateId:  ulid(),
      version:    "0.1.0",
      client:     normalizedClient as `eip155:${number}:0x${string}`,
      server:     normalizedServer as `eip155:${number}:0x${string}`,
      createdAt:  new Date().toISOString(),
      deadline,
      intent,
      core,
      signatures: {},
    });

    /* eslint-disable @typescript-eslint/no-explicit-any */
    await mandate.signAsServer(this.signer as any, "eip191");
    /* eslint-enable @typescript-eslint/no-explicit-any */
    return mandate.toJSON();
  }

  // ── Mandate: sign as client (acceptance) ────────────────────

  async signAsClient(mandateJson: object): Promise<object> {
    const mandate = Mandate.fromObject(mandateJson as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    /* eslint-disable @typescript-eslint/no-explicit-any */
    await mandate.signAsClient(this.signer as any, "eip191");
    /* eslint-enable @typescript-eslint/no-explicit-any */
    return mandate.toJSON();
  }

  // ── Mandate: verify both signatures ─────────────────────────

  async verifyMandate(mandateJson: object): Promise<VerifyResult> {
    const mandate = Mandate.fromObject(mandateJson as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    return mandate.verifyAll() as VerifyResult;
  }

  // ── Parse natural-language swap intent ──────────────────────
  // e.g. "swap 100 USDT to WBTC" → SwapCore params

  parseSwapIntent(intent: string): {
    amountIn: string;
    tokenIn: string;
    tokenOut: string;
    minOut: string;
    slippageBps?: number;
  } | null {
    const re = /swap\s+([\d,.]+)\s+(\w+)\s+(?:to|for)\s+(\w+)/i;
    const match = intent.match(re);
    if (!match) return null;

    const [, rawAmt, inSymbol, outSymbol] = match;
    const tokenIn  = TOKENS[inSymbol.toUpperCase()];
    const tokenOut = TOKENS[outSymbol.toUpperCase()];
    if (!tokenIn || !tokenOut) return null;

    const amount = parseFloat(rawAmt.replace(/,/g, ""));
    const amountIn = BigInt(Math.round(amount * 10 ** tokenIn.decimals)).toString();

    // 0.5% slippage guard as minOut placeholder (replace with DEX quote in prod)
    const minOut = BigInt(Math.round(amount * 10 ** tokenOut.decimals * 0.995)).toString();

    return {
      amountIn,
      tokenIn: tokenIn.address,
      tokenOut: tokenOut.address,
      minOut,
      slippageBps: 50,
    };
  }
}

// ── Singleton ─────────────────────────────────────────────────
// Requires SERVER_PRIVATE_KEY env var (never expose to client)

let _instance: WachaiService | null = null;

export function getWachaiService(): WachaiService {
  if (!_instance) {
    const pk = process.env.SERVER_PRIVATE_KEY;
    if (!pk) throw new Error("SERVER_PRIVATE_KEY env var is required");
    _instance = new WachaiService(pk, Number(process.env.CHAIN_ID ?? 8453));
  }
  return _instance;
}
