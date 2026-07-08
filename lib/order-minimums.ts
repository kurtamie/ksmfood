import type { CartItem } from "@/components/CartContext";

export type MinimumOrderService =
  | "nasi-kotak"
  | "prasmanan"
  | "prasmanan-pernikahan"
  | "bento"
  | "snack-kotak"
  | "aqiqah"
  | "tumpeng"
  | "katering-pondokan";

export const MINIMUM_ORDER_QUANTITY: Record<MinimumOrderService, number> = {
  "nasi-kotak": 50,
  prasmanan: 150,
  "prasmanan-pernikahan": 150,
  bento: 50,
  "snack-kotak": 1,
  aqiqah: 1,
  tumpeng: 1,
  "katering-pondokan": 150,
};

const SERVICE_ALIASES: Array<[MinimumOrderService, RegExp]> = [
  ["nasi-kotak", /ricebox|nasi\s*kotak/i],
  ["prasmanan-pernikahan", /wedding|prasmanan\s*pernikahan/i],
  ["prasmanan", /prasmanan/i],
  ["bento", /bento/i],
  ["snack-kotak", /snackbox|snack\s*kotak|snack\s*box/i],
  ["aqiqah", /aqiqah/i],
  ["tumpeng", /tumpeng/i],
  ["katering-pondokan", /pondokan|food\s*stall/i],
];

export function getMinimumOrderQuantity(item: Pick<
  CartItem,
  "slug" | "category" | "name"
>): number {
  const haystack = `${item.slug} ${item.category} ${item.name}`;
  const service = SERVICE_ALIASES.find(([, pattern]) =>
    pattern.test(haystack),
  )?.[0];
  return service ? MINIMUM_ORDER_QUANTITY[service] : 1;
}

export function clampToMinimumOrderQuantity<T extends Pick<
  CartItem,
  "slug" | "category" | "name" | "quantity"
>>(item: T): T {
  const minimumQuantity = getMinimumOrderQuantity(item);
  return item.quantity < minimumQuantity
    ? { ...item, quantity: minimumQuantity }
    : item;
}
