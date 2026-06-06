import type { BaseEntity } from "./shared";
import type { Role } from "./roles";
import type { Staff } from "./staff";
import type { Customer } from "./customers";

export type UserRole = "staff" | "customer";

export interface User extends BaseEntity {
  username: string;
  email: string;
  provider?: string | null;
  password?: string | null;
  resetPasswordToken?: string | null;
  confirmationToken?: string | null;
  confirmed?: boolean;
  blocked?: boolean;
  role?: Role | null;
  phone_no?: string | null;
  user_role?: UserRole;
  staff?: Staff | null;
  customer?: Customer | null;
  otp_code?: string | null;
  otp_expired_at?: string | null;
}
