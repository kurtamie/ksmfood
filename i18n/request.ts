import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale, hasLocale, localeCookieName } from "./routing";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const requested = cookieStore.get(localeCookieName)?.value;
  const locale = requested && hasLocale(requested) ? requested : defaultLocale;
  const messages = (await import(`../messages/${locale}`)).default;

  return {
    locale,
    messages,
  };
});
