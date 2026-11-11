"use client";

import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { LuAward, LuCheck, LuPackageOpen } from "react-icons/lu";
import { useState } from "react";
import type { SnackPackageCard } from "./OrderModal";
import { localizePriceUnit } from "@/lib/price-unit";
import { createWhatsappLink, createOrderMessage } from "@/const/whatsapp";

const packageCards: SnackPackageCard[] = [
  {
    id: "1",
    title: "Paket A",
    packageType: "A",
    items: ["2 Kue", "Air Mineral Gelas"],
    badge: true,
    price: "Rp 15.000/Kotak",
  },
  {
    id: "2",
    title: "Paket B",
    packageType: "B",
    items: ["3 Kue", "Air Mineral Gelas"],
    price: "Rp 19.000/Kotak",
  },
  {
    id: "3",
    title: "Paket C",
    packageType: "C",
    items: ["4 Kue", "Air Mineral Gelas"],
    price: "Rp 22.000/Kotak",
  },
  {
    id: "4",
    title: "Paket D",
    packageType: "D",
    items: ["2 Kue", "Teh Kotak"],
    price: "Rp 18.000/Kotak",
  },
  {
    id: "5",
    title: "Paket E",
    packageType: "E",
    items: ["3 Kue", "Teh Kotak"],
    price: "Rp 21.000/Kotak",
  },
  {
    id: "6",
    title: "Paket F",
    packageType: "F",
    items: ["4 Kue", "Teh Kotak"],
    price: "Rp 25.000/Kotak",
  },
];

function Menu() {
  const t = useTranslations("snackBoxMenu");
  const locale = useLocale();
  const serviceName = "Snack Kotak";
  const [selectedCard, setSelectedCard] = useState<
    (typeof packageCards)[0] | null
  >(null);

  return (
    <>
      <div className="mt-12 grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {packageCards.map((card, index) => {
          const isLastOddItem =
            packageCards.length % 2 !== 0 && index === packageCards.length - 1;
          return (
            <article
              key={card.id}
              className={`relative flex h-full flex-col rounded-xl border border-black/10 bg-white px-4 py-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:px-5 sm:py-6 ${
                isLastOddItem
                  ? "sm:col-span-4 sm:mx-auto sm:w-full sm:max-w-[calc((100%-0.75rem)/4)]"
                  : ""
              }`}
            >
              {card.badge && (
                <div className="absolute right-0 top-0 rounded-bl-xl rounded-tr-xl bg-[#F7C948] px-3 py-1.5 text-[11px] font-semibold text-black shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <LuAward className="text-xs" />
                    <span>{card.badge ? t("popular") : card.badge}</span>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2 sm:items-center">
                <div className="flex items-center justify-center rounded-full bg-[#8D0000]/10 p-3">
                  <LuPackageOpen className="text-3xl text-red-800" />
                </div>
                <div className="flex min-w-0 flex-col">
                  <h2 className="text-lg font-bold uppercase sm:text-xl">
                    {card.title}
                  </h2>
                </div>
              </div>
              <div className="mt-5 flex flex-1 flex-col">
                <div className="grow space-y-2">
                  {card.items.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <LuCheck className="shrink-0 text-base text-red-800" />
                      <p className="text-sm text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-5 text-center text-lg font-bold text-red-800">
                  {localizePriceUnit(card.price, locale)}
                </p>

                <Button
                  onClick={() => {
                    window.open(createWhatsappLink(createOrderMessage(serviceName, card.title, card.price)), "_blank");
                  }}
                  className="mt-3 h-11 w-full bg-red-800 text-white hover:bg-red-900"
                >
                  {t("orderNow")}
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal di-hide sementara — akan dihidupkan kembali saat fasa berikutnya. */}
    </>
  );
}

export default Menu;
