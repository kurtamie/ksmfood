import type { BaseEntity } from "./shared";
import type { Order } from "./orders";

export interface Package extends BaseEntity {
  package_name?: string | null;
  subname?: string | null;
  description?: string | null;
  image_url?: string | null;
  price?: string | null;
  orders?: Order[];
  product?: string | null;
}
