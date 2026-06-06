import { Customer } from "./customers";
import type { BaseEntity } from "./shared";

export interface UserSession extends BaseEntity {
  phone: string;
  currentMenu?: string | null;
  sessionData?: Record<string, unknown> | null;
  lastInteraction?: string | null;
  customer?: Customer | null;
}
