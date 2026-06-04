import type { BaseEntity } from "./shared";
import type { Order } from "./orders";

export type InvoiceStatus = "unpaid" | "paid" | "overdue" | "expired";

export interface Invoice extends BaseEntity {
  invoice_no?: string | null;
  invoice_date?: string | null;
  orders?: Order[];
  payment_status?: InvoiceStatus;
  midtrans_order_id?: string | null;
  midtrans_snap_token?: string | null;
  midtrans_redirect_url?: string | null;
}
