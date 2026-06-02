import type { CartItem } from "@/components/CartContext";
import type {
  CreateOrderDetailInput,
  CreateOrderMenuInput,
} from "@/types/orders";

export function getLeaveTime(arriveTime: string) {
  const [hourPart, minutePart] = arriveTime.split(":").slice(0, 2);
  const hour = Number(hourPart);
  const minute = Number(minutePart);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return "";

  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  date.setHours(date.getHours() - 1);
  return date.toTimeString().slice(0, 8);
}

export function parseCartItemToOrderMenu(item: CartItem): CreateOrderMenuInput {
  if (item.slug.startsWith("snackbox/")) {
    const snackAddons = item.addOns
      .map((addOn) => {
        const match = addOn.value.match(/^kue_([0-9]+)_/i);
        if (!match) return null;
        return {
          index: Number(match[1]),
          label: addOn.label
            .replace(/^Kue\s+[0-9]+:\s*/i, "")
            .replace(/\s*\(\+Rp\s*2\.000\)\s*$/i, ""),
        };
      })
      .filter((addOn): addOn is { index: number; label: string } => addOn != null)
      .sort((a, b) => a.index - b.index);
    const mineralWaterAddon = item.addOns.find((a) =>
      /^minuman_/i.test(a.value),
    );

    return {
      snack: snackAddons[0]?.label ?? undefined,
      snack2: snackAddons[1]?.label ?? undefined,
      snack3: snackAddons[2]?.label ?? undefined,
      snack4: snackAddons[3]?.label ?? undefined,
      mineral_water: mineralWaterAddon?.label ?? undefined,
    };
  }

  const riceAddon = item.addOns.find((a) => /^nasi_/i.test(a.value));
  const mainDishAddons = item.addOns
    .map((addOn) => {
      const match = addOn.value.match(/^lauk_([0-9]+)_/i);
      if (!match) return null;
      return {
        index: Number(match[1]),
        label: addOn.label.replace(/^Lauk\s+[0-9]+:\s*/i, ""),
      };
    })
    .filter((addOn): addOn is { index: number; label: string } => addOn != null)
    .sort((a, b) => a.index - b.index);
  const additionalAddon = item.addOns.find((a) =>
    /^lauk_tambahan_/i.test(a.value),
  );
  const vegetableAddon = item.addOns.find((a) => /^sayur_/i.test(a.value));
  const sauceAddon = item.addOns.find((a) => /^sambal_/i.test(a.value));
  const mineralWaterAddon = item.addOns.find((a) =>
    /^minuman_/i.test(a.value),
  );
  const boxAddon = item.addOns.find((a) => /^box_/i.test(a.value));
  const fruitAddon = item.addOns.find((a) => /(Pisang|Jeruk)/i.test(a.label));
  const chipAddon = item.addOns.find((a) => /kerupuk/i.test(a.label));
  const puddingAddon = item.addOns.find((a) => /puding/i.test(a.label));

  return {
    rice: riceAddon?.label ?? undefined,
    main_dish: mainDishAddons[0]?.label ?? undefined,
    main_dish2: mainDishAddons[1]?.label ?? undefined,
    main_dish3: mainDishAddons[2]?.label ?? undefined,
    additional_dish: additionalAddon?.label ?? undefined,
    vegetable: vegetableAddon?.label ?? undefined,
    sauce: sauceAddon?.label ?? undefined,
    mineral_water: mineralWaterAddon?.label ?? "Air Mineral Gelas",
    fruit: fruitAddon?.label ?? "Pisang/Jeruk",
    chip: chipAddon?.label ?? "Kerupuk",
    pudding: puddingAddon?.label ?? "Puding",
    box: boxAddon?.label ?? "Kotak putih 18x18",
  };
}

export function parseCartItemToOrderDetail(
  item: CartItem,
): CreateOrderDetailInput {
  const qty = item.quantity;
  const sellingPrice = item.basePrice;
  const amount = qty * sellingPrice;
  const amountString = String(amount);

  return {
    qty: String(qty),
    selling_price: String(sellingPrice),
    amount: amountString,
    total_amount: amountString,
  };
}

export function buildAggregateOrderDetail(
  items: CartItem[],
): CreateOrderDetailInput {
  const qty = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => {
    const addOnTotal = item.addOns.reduce(
      (addOnSum, addOn) => addOnSum + addOn.price,
      0,
    );
    return sum + (item.basePrice + addOnTotal) * item.quantity;
  }, 0);
  const averageSellingPrice = qty > 0 ? Math.round(total / qty) : 0;

  return {
    qty: String(qty),
    selling_price: String(averageSellingPrice),
    amount: String(total),
    total_amount: String(total),
  };
}

export function mergeCartItems(items: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>();

  for (const item of items) {
    const existing = merged.get(item.id);
    if (!existing) {
      merged.set(item.id, item);
      continue;
    }

    merged.set(item.id, {
      ...existing,
      quantity: existing.quantity + item.quantity,
    });
  }

  return Array.from(merged.values());
}
