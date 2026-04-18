"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import WhatsappFloat from "@/components/layout/whatsappFloat";

const chromeLessRoutes = new Set(["/services/prasmanan"]);

type SiteShellProps = {
  children: React.ReactNode;
};

export default function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const hideChrome = chromeLessRoutes.has(pathname);

  return (
    <>
      {!hideChrome && <Header />}
      <div className="flex-1">{children}</div>
      {!hideChrome && <Footer />}
      {!hideChrome && <WhatsappFloat />}
    </>
  );
}
