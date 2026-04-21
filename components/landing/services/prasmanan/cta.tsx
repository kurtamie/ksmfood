"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FaWhatsapp } from "react-icons/fa";
import { LuMessagesSquare } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import prasmananImage from "@/public/images/services/prasmanan/prasmanan.webp";

export default function Cta() {
  const t = useTranslations("prasmananCta");
  const commonT = useTranslations("common");

  return (
    <div className="w-full overflow-hidden rounded-[28px] bg-[#A40000] text-white shadow-[0_28px_60px_-30px_rgba(111,0,0,0.65)]">
      <div className="flex flex-col lg:flex-row lg:items-center">
        <div className="relative h-52 w-full overflow-hidden rounded-b-[40px] rounded-r-[40px] lg:h-52.5 lg:w-97.5 lg:shrink-0 lg:rounded-b-[999px] lg:rounded-r-[999px]">
          <Image
            src={prasmananImage}
            alt="Hidangan prasmanan KSM Katering"
            fill
            sizes="(max-width: 1024px) 100vw, 390px"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-1 flex-col gap-6 px-6 py-7 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-10">
          <div className="max-w-2xl text-center lg:text-left">
            <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
              {t("title")}
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/90 sm:text-base">
              {t("description")}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <Button
              asChild
              className="h-12 rounded-xl bg-white px-6 text-sm font-bold text-[#8D0000] hover:bg-white/90"
            >
              <Link
                href={t("orderLink")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="size-4" />
                {commonT("orderNowShort")}
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-12 rounded-xl border-white/60 bg-transparent px-6 text-sm font-bold text-white hover:bg-white/10 hover:text-white"
            >
              <Link
                href={t("consultLink")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LuMessagesSquare className="size-4" />
                {commonT("consultNow")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
