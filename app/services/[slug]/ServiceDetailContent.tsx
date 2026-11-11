"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ServiceDetailContentProps = {
  slug: string;
};

export default function ServiceDetailContent({ slug }: ServiceDetailContentProps) {
  const t = useTranslations("serviceDetail");

  return (
    <main className="bg-white">
      <section className="mx-auto flex min-h-[calc(100dvh-4.5rem)] w-full max-w-6xl flex-col justify-center px-6 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-800">
          {t("eyebrow")}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold text-[#332929] sm:text-5xl lg:text-6xl">
          {t(`items.${slug}.label`)}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[#5f5757] sm:text-lg">
          {t(`items.${slug}.description`)}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="h-12 bg-[#8D0000] px-8 text-base">
            <Link href="/#kontak">{t("primaryCta")}</Link>
          </Button>
          <Button asChild variant="outline" className="h-12 border-[#8D0000] px-8 text-base text-[#8D0000]">
            <Link href="/#layanan">{t("secondaryCta")}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
