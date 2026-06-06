import type { BaseEntity } from "./shared";

export interface Role extends BaseEntity {
  name: string;
  description?: string | null;
  type?: string | null;
}
