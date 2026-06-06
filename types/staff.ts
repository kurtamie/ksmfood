import type { BaseEntity } from "./shared";
import type { User } from "./users";
import type { Customer } from "./customers";
import type { Order } from "./orders";

export interface Staff extends BaseEntity {
  user_id?: User | null;
  customers?: Customer[];
  orders?: Order[];
  orders_driver?: Order[];
}
