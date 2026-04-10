import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
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
  themeColor: "#8D0000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
