export const locales = ["id", "en"] as const;
export const defaultLocale = "id" as const;
export const localeCookieName = "NEXT_LOCALE";

export type AppLocale = (typeof locales)[number];

export function hasLocale(value: string): value is AppLocale {
  return locales.includes(value as AppLocale);
}
