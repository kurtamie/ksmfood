"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { LuAward, LuCheck, LuPackageOpen } from "react-icons/lu";
import { useState } from "react";
import { OrderModal, type PackageCard } from "./OrderModal";

const packageCards: PackageCard[] = [
  {
    id: "1",
    title: "Paket A",
    badge: true,
    dish: [
      "Nasi Putih",
      "1 Lauk Utama",
      "Lauk Tambahan",
      "Sayur",
      "Sambal",
      "Kerupuk",
      "Buah",
      "Puding",
      "Air Mineral 330ml",
    ],
    items: [
      "Nasi Putih",
      "1 Lauk Utama",
      "Lauk Tambahan",
      "Sayur",
      "Sambal",
      "Kerupuk",
      "Buah",
      "Puding",
      "Air Mineral 330ml",
    ],
    packageType: "A",
    price: "Rp 58.000/Kotak",
  },
  {
    id: "2",
    title: "Paket B",
    dish: [
      "Nasi Putih",
      "2 Lauk Utama",
      "Lauk Tambahan",
      "Sayur",
      "Sambal",
      "Kerupuk",
      "Buah",
      "Puding",
      "Air Mineral 330ml",
    ],
    items: [
      "Nasi Putih",
      "2 Lauk Utama",
      "Lauk Tambahan",
      "Sayur",
      "Sambal",
      "Kerupuk",
      "Buah",
      "Puding",
      "Air Mineral 330ml",
    ],
    packageType: "B",
    price: "Rp 66.000/Kotak",
  },
];

function Menu() {
  const t = useTranslations("bentoMenu");
  const serviceName = "Bento";
  const [selectedCard, setSelectedCard] = useState<
    (typeof packageCards)[0] | null
  >(null);

  return (
    <>
      <div className="mt-12 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
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
                  {card.dish.map((dish) => (
                    <div key={dish} className="flex items-center gap-2">
                      <LuCheck className="shrink-0 text-base text-red-800" />
                      <p className="text-sm text-gray-700">{dish}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-5 text-center text-lg font-bold text-red-800">
                  {card.price}
                </p>

                <Button
                  onClick={() => setSelectedCard(card)}
                  className="mt-3 h-11 w-full bg-red-800 text-white hover:bg-red-900"
                >
                  {t("orderNow")}
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      {selectedCard && (
        <OrderModal
          card={selectedCard}
          serviceName={serviceName}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </>
  );
}

export default Menu;
