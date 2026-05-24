import type { BaseEntity, MediaItem } from "./shared";
import type { Customer } from "./customers";
import type { Staff } from "./staff";
import type { Package } from "./packages";
import type { OrderDetail } from "./order-details";
import type { OrderMenu } from "./order-menus";
import type { Invoice } from "./invoices";

export type OrderStep = "packing" | string;

export type CreateOrderDetailInput = Pick<
  OrderDetail,
  "qty" | "selling_price" | "amount" | "total_amount"
>;

export type CreateOrderMenuInput = Pick<
  OrderMenu,
  | "rice"
  | "main_dish"
  | "additional_dish"
  | "vegetable"
  | "sauce"
  | "chip"
  | "fruit"
  | "mineral_water"
  | "box"
  | "pudding"
  | "snack"
>;

/** Payload untuk POST /api/orders — selaras field Order di Strapi */
export interface CreateOrderInput {
  customer_id?: number;
  /** documentId customer (Strapi v5) — disarankan dikirim bersama customer_id */
  customer_document_id?: string;
  customer_type?: string;
  delivery_date?: string;
  arrive_time?: string;
  leave?: string;
  delivery_address?: string;
  latitude?: string;
  longitude?: string;
  recipient_name?: string;
  recipient_phone_no?: string;
  delivery_note?: string;
  order_details?: CreateOrderDetailInput[];
  order_menus?: CreateOrderMenuInput[];
}

export interface Order extends BaseEntity {
  order_no?: string | null;
  customer_id?: Customer | null;
  staff_id?: Staff | null;
  customer_type?: string | null;
  executor_name?: string | null;
  supplier?: string | null;
  product?: string | null;
  package_id?: Package[];
  recipient_name?: string | null;
  recipient_phone_no?: string | null;
  order_details?: OrderDetail[];
  delivery_note?: string | null;
  order_menus?: OrderMenu[];
  delivery_date?: string | null;
  arrive_time?: string | null;
  leave?: string | null;
  delivery_address?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  step?: OrderStep;
  created_date?: string | null;
  driver?: string | null;
  staff_driver_id?: Staff | null;
  image_receive?: MediaItem[];
  invoices?: Invoice[];
  travel_letter_no?: string | null;
}
