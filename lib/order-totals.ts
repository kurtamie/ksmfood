import type { OrderDetail } from "@/types/order-details";

export function parseAmount(value: string | number | null | undefined): number {
  if (value == null || value === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const normalized = String(value).replace(/[^\d.-]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function sumOrderDetailsTotal(
  details: Array<Pick<OrderDetail, "total_amount" | "amount">>,
): number {
  if (!details.length) return 0;
  return details.reduce((sum, detail) => {
    const lineTotal = parseAmount(detail.total_amount ?? detail.amount);
    return sum + lineTotal;
  }, 0);
}
