"use client";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import WhatsappFloat from "@/components/layout/whatsappFloat";

type SiteShellProps = {
  children: React.ReactNode;
};

export default function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="flex min-h-full w-full flex-1 flex-col overflow-x-clip pt-[var(--header-height)]">
      <Header />
      <div className="min-w-0 flex-1">{children}</div>
      <Footer />
      <WhatsappFloat />
    </div>
  );
}
