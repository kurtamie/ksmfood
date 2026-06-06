import type { BaseEntity } from "./shared";
import type { User } from "./users";
import type { UserSession } from "./user-sessions";
import type { Staff } from "./staff";
import type { Order } from "./orders";

export interface Customer extends BaseEntity {
  user_id?: User | null;
  staff_id?: Staff[];
  gender?: string | null;
  name?: string | null;
  company_name?: string | null;
  phone_no?: string | null;
  company?: string | null;
  address?: string | null;
  orders?: Order[];
  latitude?: string | null;
  longitude?: string | null;
  subdistrict?: string | null;
  user_sessions?: UserSession[];
}
