import type { BaseEntity } from "./shared";
import type { Order } from "./orders";

export interface OrderMenu extends BaseEntity {
  order_id?: Order[];
  rice?: string | null;
  main_dish?: string | null;
  main_dish2?: string | null;
  main_dish3?: string | null;
  additional_dish?: string | null;
  vegetable?: string | null;
  sauce?: string | null;
  chip?: string | null;
  fruit?: string | null;
  mineral_water?: string | null;
  box?: string | null;
  pudding?: string | null;
  snack?: string | null;
  snack2?: string | null;
  snack3?: string | null;
  snack4?: string | null;
}
