import type { BaseEntity } from "./shared";
import type { Order } from "./orders";

export interface OrderDetail extends BaseEntity {
  order_id?: Order[];
  qty?: string | null;
  selling_price?: string | null;
  broker_fee?: string | null;
  price_for_ksm?: string | null;
  min_selling_price?: string | null;
  amount?: string | null;
  delivery_charge?: string | null;
  total_amount?: string | null;
}
