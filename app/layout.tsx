import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import SiteShell from "@/components/layout/site-shell";
import { defaultLocale, hasLocale, localeCookieName } from "@/i18n/routing";
import { CartProvider } from "@/components/CartContext";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
  ? process.env.NEXT_PUBLIC_SITE_URL
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KSM Katering",
    template: "%s | KSM Katering",
  },
  icons: {
    icon: [{ url: "/pt-ksm-logo.png", type: "image/png", sizes: "512x512" }],
    shortcut: [{ url: "/pt-ksm-logo.png", type: "image/png" }],
    apple: [{ url: "/pt-ksm-logo.png", type: "image/png", sizes: "512x512" }],
  },
  description:
    "KSM Katering menyediakan layanan katering untuk pernikahan, aqiqah, prasmanan, snack box, dan acara perusahaan dengan sajian rapi dan profesional.",
  applicationName: "KSM Katering",
  keywords: [
    "katering Batam",
    "katering prasmanan",
    "katering aqiqah",
    "snack box",
    "nasi kotak",
    "katering pernikahan",
  ],
  category: "food",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "KSM Katering",
    description:
      "Layanan katering untuk pernikahan, aqiqah, prasmanan, snack box, dan acara perusahaan.",
    siteName: "KSM Katering",
    locale: "id_ID",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#8D0000",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieLocale = (await cookies()).get(localeCookieName)?.value;
  const locale =
    cookieLocale && hasLocale(cookieLocale) ? cookieLocale : defaultLocale;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className="h-full w-full overflow-x-clip antialiased">
      <body className="flex min-h-full w-full flex-col overflow-x-clip">
        <AuthProvider>
          <CartProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <SiteShell>{children}</SiteShell>
            </NextIntlClientProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
