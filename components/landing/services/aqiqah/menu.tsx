import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { LuAward, LuCheck, LuPackageOpen } from "react-icons/lu";

const packageCards = [
  {
    id: 1,
    title: "Paket A",
    subTitle: "(Menu Ayam/Ikan)",
    badge: "Paling Populer",
    dish: [
      "Nasi Putih",
      "1 Lauk Utama",
      "1 Lauk Tambahan",
      "Sambal",
      "Kerupuk",
      "Buah",
      "Air Mineral Gelas",
    ],
    price: "Rp:26.500/Kotak",
  },
  {
    id: 2,
    title: "Paket A",
    subTitle: "(Menu Daging/Seafood)",
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
    price: "Rp:28.500/Kotak",
  },
  {
    id: 3,
    title: "Paket B",
    dish: [
      "Nasi",
      "2 Lauk Utama",
      "1 Lauk Tambahan",
      "Sayur",
      "Sambal",
      "Buah",
      "Air Mineral Gelas",
    ],
    price: "Rp:34.500/Kotak",
  },
  {
    id: 4,
    title: "Paket C",
    dish: [
      "Nasi",
      "3 Lauk Utama",
      "1 Lauk Tambahan",
      "Sayur",
      "Sambal",
      "Buah",
      "Air Mineral Gelas",
    ],
    price: "Rp:44.000/Kotak",
  },
];

function Menu() {
  const t = useTranslations("aqiqahMenu");

  return (
    <div className="flex flex-col items-center justify-center gap-2 text-center sm:gap-4">
      <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-4">
        <h2 className="text-3xl font-bold text-[#332929] sm:text-4xl lg:text-5xl">
          {t("package")}
        </h2>
        <h2 className="text-3xl font-bold text-red-800 sm:text-4xl lg:text-5xl">
          {t("femaleTitle")}
        </h2>
      </div>
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
              <div className="flex items-start text-left gap-2 ">
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
                  {card.price}
                </p>

                <Button className="mt-3 h-11 w-full bg-red-800 text-white hover:bg-red-900">
                  {t("orderNow")}
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex flex-col mt-12 items-center justify-center gap-2 text-center sm:flex-row sm:gap-4">
        <h2 className="text-3xl font-bold text-[#332929] sm:text-4xl lg:text-5xl">
          {t("package")}
        </h2>
        <h2 className="text-3xl font-bold text-red-800 sm:text-4xl lg:text-5xl">
          {t("maleTitle")}
        </h2>
      </div>
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
              <div className="flex items-start gap-2 text-left">
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
                  {card.price}
                </p>

                <Button className="mt-3 h-11 w-full bg-red-800 text-white hover:bg-red-900">
                  {t("orderNow")}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default Menu;
