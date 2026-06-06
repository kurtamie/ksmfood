import type { Invoice, InvoiceStatus } from "@/types/invoices";
import type { Order } from "@/types/orders";
import { unwrapStrapiList } from "@/lib/strapi-response";

export type PaymentStatusLabel = InvoiceStatus;

const STATUS_LABEL: Record<InvoiceStatus, PaymentStatusLabel> = {
  paid: "paid",
  unpaid: "unpaid",
  overdue: "overdue",
  expired: "expired",
};

export function normalizeInvoices(
  invoices: Order["invoices"] | undefined,
): Array<Invoice & { id: number; documentId?: string }> {
  return unwrapStrapiList<Invoice>(invoices ?? []);
}

export function getOrderPaymentStatusLabel(
  invoices: Order["invoices"] | undefined,
): PaymentStatusLabel {
  const list = normalizeInvoices(invoices);
  if (!list.length) return "unpaid";

  const primary = list[0]?.payment_status;
  if (primary && primary in STATUS_LABEL) {
    return STATUS_LABEL[primary];
  }

  return "unpaid";
}

export function getPrimaryInvoice(
  invoices: Order["invoices"] | undefined,
): (Invoice & { id: number; documentId?: string }) | null {
  const list = normalizeInvoices(invoices);
  return list[0] ?? null;
}

export function isPaidStatus(label: PaymentStatusLabel): boolean {
  return label === "paid";
}
