import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale, hasLocale, localeCookieName } from "./routing";

export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get(localeCookieName)?.value;
  const locale =
    cookieLocale && hasLocale(cookieLocale) ? cookieLocale : defaultLocale;
  const messages = (await import(`../messages/${locale}`)).default;

  return {
    locale,
    messages,
  };
});
