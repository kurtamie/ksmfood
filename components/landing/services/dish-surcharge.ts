export const DISH_SURCHARGE_AMOUNT = 2000;

const surchargeDishNames = new Set(
  [
    "Nasi Kuning",
    "Nasi Lemak",
    "Capcay",
    "Sayur Asem",
    "Tumis Kailan Muda",
    "Tumis Bunga Kol",
    "Tumis Sawi Minyak",
    "Roti Kacang Merah",
    "Roti Abon",
    "Pisang Cokelat",
    "Pisang Keju Cokelat",
    "Bomboloni",
    "Donat Topping",
    "Bolu Marmer",
    "Roti Cokelat",
    "Roti Srikaya",
    "Roti Keju",
  ].map((name) => name.toLowerCase()),
);

export function getDishSurcharge(name: string) {
  return surchargeDishNames.has(name.trim().toLowerCase())
    ? DISH_SURCHARGE_AMOUNT
    : 0;
}

export function formatDishOptionLabel(name: string) {
  return getDishSurcharge(name) > 0 ? `${name} (+2000)` : name;
}

export function formatDishAddonLabel(name: string) {
  return getDishSurcharge(name) > 0 ? `${name} (+Rp 2.000)` : name;
}
