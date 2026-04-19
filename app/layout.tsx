import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import SiteShell from "@/components/layout/site-shell";
import { defaultLocale } from "@/i18n/routing";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
  ? process.env.NEXT_PUBLIC_SITE_URL
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KSM Katering",
    template: "%s | KSM Katering",
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
  const locale = defaultLocale;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className="h-full w-full overflow-x-clip antialiased">
      <body className="flex min-h-full w-full flex-col overflow-x-clip">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SiteShell>{children}</SiteShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
