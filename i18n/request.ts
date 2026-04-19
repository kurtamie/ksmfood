import { getRequestConfig } from "next-intl/server";
import { defaultLocale } from "./routing";

export default getRequestConfig(async () => {
  const locale = defaultLocale;
  const messages = (await import(`../messages/${locale}`)).default;

  return {
    locale,
    messages,
  };
});
