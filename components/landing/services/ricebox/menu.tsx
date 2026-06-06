"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { LuAward, LuCheck, LuPackageOpen } from "react-icons/lu";
import { OrderModal, type PackageCard } from "./OrderModal";
import { localizePriceUnit } from "@/lib/price-unit";
const packageCards = [
  {
    id: 1,
    title: "Paket A",
    subTitle: "(Menu Ayam/Ikan)",
    packageType: "A-ayam",
    dish: [
      "Nasi Putih",
      "1 Lauk Utama",
      "1 Lauk Tambahan",
      "Sayur",
      "Sambal",
      "Kerupuk",
      "Buah",
      "Air Mineral Gelas",
    ],
    price: "Rp 27.000/Kotak",
  },
  {
    id: 2,
    title: "Paket A",
    subTitle: "(Menu Daging/Seafood)",
    packageType: "A-daging",
    dish: [
      "Nasi",
      "1 Lauk Utama",
      "1 Lauk Tambahan",
      "Sayur",
      "Sambal",
      "Kerupuk",
      "Buah",
      "Air Mineral Gelas",
    ],
    price: "Rp 28.500/Kotak",
  },
  {
    id: 3,
    title: "Paket B",
    packageType: "B",
    badge: "Paling Populer",
    dish: [
      "Nasi",
      "2 Lauk Utama",
      "1 Lauk Tambahan",
      "Sayur",
      "Sambal",
      "Kerupuk",
      "Buah",
      "Air Mineral Gelas",
    ],
    price: "Rp 34.500/Kotak",
  },
  {
    id: 4,
    title: "Paket C",
    packageType: "C",
    dish: [
      "Nasi",
      "3 Lauk Utama",
      "1 Lauk Tambahan",
      "Sayur",
      "Sambal",
      "Kerupuk",
      "Buah",
      "Air Mineral Gelas",
    ],
    price: "Rp 42.500/Kotak",
  },
  {
    id: 5,
    title: "Paket A+",
    subTitle: "(Menu Ayam/Ikan)",
    packageType: "A+-ayam",
    dish: [
      "Nasi",
      "1 Lauk Utama",
      "1 Lauk Tambahan",
      "Sayur",
      "Sambal",
      "Kerupuk",
      "Buah",
      "Air Mineral 330ml",
      "Puding",
    ],
    price: "Rp 32.000/Kotak",
  },
  {
    id: 6,
    title: "Paket A+",
    subTitle: "(Menu Daging/Seafood)",
    packageType: "A+-daging",
    dish: [
      "Nasi",
      "1 Lauk Utama",
      "1 Lauk Tambahan",
      "Sayur",
      "Sambal",
      "Kerupuk",
      "Buah",
      "Air Mineral 330ml",
      "Puding",
    ],
    price: "Rp 34.000/Kotak",
  },
  {
    id: 7,
    title: "Paket B+",
    packageType: "B+",
    dish: [
      "Nasi",
      "2 Lauk Utama",
      "1 Lauk Tambahan",
      "Sayur",
      "Sambal",
      "Kerupuk",
      "Buah",
      "Air Mineral 330ml",
      "Puding",
    ],
    price: "Rp 40.000/Kotak",
  },
  {
    id: 8,
    title: "Paket C+",
    packageType: "C+",
    dish: [
      "Nasi",
      "3 Lauk Utama",
      "1 Lauk Tambahan",
      "Sayur",
      "Sambal",
      "Kerupuk",
      "Buah",
      "Air Mineral 330ml",
      "Puding",
    ],
    price: "Rp 48.000/Kotak",
  },
];

function Menu() {
  const t = useTranslations("riceboxMenu");
  const locale = useLocale();
  const serviceName = "Nasi Kotak";

  const [selectedCard, setSelectedCard] = useState<PackageCard | null>(null);

  return (
    <>
      <div className="mt-12 grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
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
                  {card.subTitle && (
                    <p className="text-sm italic text-red-800 sm:text-base">
                      {card.subTitle}
                    </p>
                  )}
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
                  {localizePriceUnit(card.price, locale)}
                </p>

                <Button
                  onClick={() => setSelectedCard(card as PackageCard)}
                  className="mt-3 h-11 w-full bg-red-800 text-white hover:bg-red-900"
                >
                  {t("orderNow")}
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal */}
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
