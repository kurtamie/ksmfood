export function localizePriceUnit(price: string, locale: string): string {
  if (locale !== "en") return price;

  return price
    .replace(/\/\s*kotak/gi, "/box")
    .replace(/\/\s*porsi/gi, "/portion")
    .replace(/\/\s*kemasan/gi, "/package");
}
