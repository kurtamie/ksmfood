"use client";

import { useTranslations } from "next-intl";
import { LuAward, LuCheck, LuPackageOpen } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { createWhatsappLink } from "@/const/whatsapp";

const packageCards = [
  {
    id: "a",
    title: "Paket A",
    items: [
      "Nasi Putih",
      "1 Lauk Utama",
      "1 Lauk Tambahan",
      "Sayur",
      "Sambal",
      "Kerupuk",
      "Buah",
      "Air Mineral Gelas",
    ],
    price: "Rp 32.000/porsi",
  },
  {
    id: "b",
    title: "Paket B",
    badge: true,
    items: [
      "Nasi Putih",
      "2 Lauk Utama",
      "1 Lauk Tambahan",
      "Sayur",
      "Sambal",
      "Kerupuk",
      "Buah",
      "Air Mineral Gelas",
    ],
    price: "Rp 40.000/porsi",
  },
  {
    id: "c",
    title: "Paket C",
    items: [
      "Nasi Putih",
      "3 Lauk Utama",
      "1 Lauk Tambahan",
      "Sayur",
      "Sambal",
      "Kerupuk",
      "Buah",
      "Air Mineral Gelas",
    ],
    price: "Rp 48.000/porsi",
  },
  {
    id: "a-plus",
    title: "Paket A+",
    items: [
      "Nasi Putih",
      "1 Lauk Utama",
      "1 Lauk Tambahan",
      "Sayur",
      "Sambal",
      "Kerupuk",
      "Buah",
      "Air Mineral Gelas",
      "Sup Sayur",
      "Puding",
    ],
    price: "Rp 43.000/porsi",
  },
  {
    id: "b-plus",
    title: "Paket B+",
    items: [
      "Nasi Putih",
      "2 Lauk Utama",
      "1 Lauk Tambahan",
      "Sayur",
      "Sambal",
      "Kerupuk",
      "Buah",
      "Air Mineral Gelas",
      "Sup Sayur",
      "Puding",
    ],
    price: "Rp 49.000/porsi",
  },
  {
    id: "c-plus",
    title: "Paket C+",
    items: [
      "Nasi Putih",
      "3 Lauk Utama",
      "1 Lauk Tambahan",
      "Sayur",
      "Sambal",
      "Kerupuk",
      "Buah",
      "Air Mineral Gelas",
      "Sup Sayur",
      "Puding",
    ],
    price: "Rp 57.000/porsi",
  },
];

export default function Menu() {
  const t = useTranslations("prasmananMenu");
  const commonT = useTranslations("common");
  const serviceName = "Prasmanan";

  return (
    <div className="mt-12 grid w-full max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {packageCards.map((card) => (
        <article
          key={card.id}
          className="relative flex h-full flex-col rounded-2xl border border-[#332929]/10 bg-white px-5 py-6 shadow-[0_18px_50px_-32px_rgba(51,41,41,0.35)]"
        >
          {card.badge && (
            <div className="absolute right-0 top-0 rounded-bl-2xl rounded-tr-2xl bg-[#F7C948] px-3 py-1.5 text-[11px] font-semibold text-black shadow-sm">
              <div className="flex items-center gap-1.5">
                <LuAward className="text-xs" />
                <span>{t("popular")}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#8D0000]/8 text-[#8D0000]">
              <LuPackageOpen className="text-[1.65rem]" />
            </div>
            <h3 className="text-2xl font-bold uppercase text-[#332929]">
              {card.title}
            </h3>
          </div>

          <div className="mt-6 flex flex-1 flex-col">
            <div className="space-y-2.5">
              {card.items.map((item) => (
                <div key={`${card.id}-${item}`} className="flex gap-2">
                  <LuCheck className="mt-0.5 shrink-0 text-sm text-[#8D0000]" />
                  <p className="text-sm leading-6 text-[#463B3B]">{item}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-2xl font-bold text-[#8D0000]">
              {card.price}
            </p>

            <Button
              asChild
              className="mt-4 h-11 rounded-lg bg-[#9F0404] font-bold text-white hover:bg-[#870000]"
            >
              <a
                href={createWhatsappLink(
                  `Halo, saya ingin memesan ${serviceName} dengan ${card.title}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                {commonT("orderNowShort")}
              </a>
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
