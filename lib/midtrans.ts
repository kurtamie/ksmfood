const SANDBOX_SNAP_BASE = "https://app.sandbox.midtrans.com";
const PRODUCTION_SNAP_BASE = "https://app.midtrans.com";
const SANDBOX_API_BASE = "https://api.sandbox.midtrans.com";
const PRODUCTION_API_BASE = "https://api.midtrans.com";

export function isMidtransProduction(): boolean {
  return process.env.MIDTRANS_IS_PRODUCTION === "true";
}

export function getMidtransSnapBaseUrl(): string {
  return isMidtransProduction() ? PRODUCTION_SNAP_BASE : SANDBOX_SNAP_BASE;
}

export function getMidtransSnapScriptUrl(): string {
  return `${getMidtransSnapBaseUrl()}/snap/snap.js`;
}

export function getMidtransSnapApiUrl(): string {
  return `${getMidtransSnapBaseUrl()}/snap/v1/transactions`;
}

export function getMidtransApiBaseUrl(): string {
  return isMidtransProduction() ? PRODUCTION_API_BASE : SANDBOX_API_BASE;
}

export function getMidtransTransactionStatusUrl(orderId: string): string {
  return `${getMidtransApiBaseUrl()}/v2/${encodeURIComponent(orderId)}/status`;
}

export function getMidtransServerKey(): string {
  const key = process.env.MIDTRANS_SERVER_KEY;
  if (!key) {
    throw new Error("MIDTRANS_SERVER_KEY belum dikonfigurasi.");
  }
  return key;
}

export function getMidtransAuthHeader(): string {
  const serverKey = getMidtransServerKey();
  const encoded = Buffer.from(`${serverKey}:`).toString("base64");
  return `Basic ${encoded}`;
}

/** Format: KSM-ORDER-{orderId}-{timestamp} */
export function buildMidtransOrderId(orderId: number | string): string {
  return `KSM-ORDER-${orderId}-${Date.now()}`;
}

export function parseOrderIdFromMidtransOrderId(
  midtransOrderId: string,
): number | null {
  const match = /^KSM-ORDER-(\d+)-\d+$/.exec(midtransOrderId);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isFinite(id) ? id : null;
}
