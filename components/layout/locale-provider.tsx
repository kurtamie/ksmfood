"use client";

import { createContext, useContext, useEffect, useCallback, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { defaultLocale, hasLocale, localeCookieName, type AppLocale } from "@/i18n/routing";
import idMessages from "@/messages/id";
import enMessages from "@/messages/en";

type LocaleContextValue = {
  locale: AppLocale;
  setLocale: (next: AppLocale) => void;
};

// Messages are imported statically so the provider can render on the server
// with a fixed locale, while the client still picks up the cookie after mount.
const messages: Record<AppLocale, object> = {
  id: idMessages,
  en: enMessages,
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useAppLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useAppLocale must be used inside <LocaleProvider>");
  }
  return ctx;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(defaultLocale);

  // Read the NEXT_LOCALE cookie on mount. This runs after the server rendered,
  // so the SSR lang attribute (defaultLocale) and the hydrated lang stay in
  // sync without a mismatch: the client never overwrites lang on the first
  // paint when the cookie matches the default locale.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const cookies = document.cookie.split(";").map((c) => c.trim());
    let cookieValue: string | null = null;
    for (const cookie of cookies) {
      const [key, ...rest] = cookie.split("=");
      if (key === localeCookieName) {
        cookieValue = rest.join("=");
        break;
      }
    }
    if (cookieValue && hasLocale(cookieValue)) {
      setLocaleState(cookieValue as AppLocale);
    }
  }, []);

  const setLocale = useCallback(
    (next: AppLocale) => {
      setLocaleState(next);
      document.documentElement.lang = next;
      document.cookie = `${localeCookieName}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    },
    []
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages[locale]}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
