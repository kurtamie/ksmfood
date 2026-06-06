import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { LuDot } from "react-icons/lu";
import { GiBread, GiCupcake, GiJelly, GiSausage } from "react-icons/gi";
import { localizePriceUnit } from "@/lib/price-unit";

type DishGroup = {
  subName: string;
  subMainDish: string[];
};

type DishItem = string | DishGroup;

type MenuCard = {
  id: number;
  icon: React.ReactNode;
  name: string;
  subName?: string;
  subMainDish: DishItem[];
};

const mainDish: MenuCard[] = [
  {
    id: 1,
    icon: <GiCupcake />,
    name: "Manis",
    subMainDish: [
      "Sus Fla",
      "Brownies",
      "Bolu Gulung",
      "Bolu Karamel",
      "Klepon",
      "Putu Ayu",
      "Onde-onde",
      "Talam Pandan",
      "Talam Ubi Ungu",
      "Kueku",
      "Kue Lumpur",
      "Bolu Tape",
      "Pie Buah",
      "Talam",
      "Lapis Warna",
    ],
  },
  {
    id: 2,
    icon: <GiSausage />,
    name: "Asin",
    subMainDish: [
      "Rol Ayam",
      "Nugget Tahu",
      "Semar Mendem",
      "Luti Gendang",
      "Epok-epok",
      "Kroket Kentang",
      "Samosa",
      "Lemper",
      "Sosis Solo",
      "Tahu Kukus",
      "Risoles",
    ],
  },
  {
    id: 3,
    icon: <GiJelly />,
    name: "Puding",
    subMainDish: [
      "Puding Fla",
      "Puding Ceria",
      "Puding Rasa Buah",
      "Puding Koktail",
    ],
  },
  {
    id: 4,
    icon: <GiBread />,
    name: "Roti",
    subName: "(+Rp 2.000/porsi",
    subMainDish: [
      "Roti Kacang Merah",
      "Roti Abon",
      "Pisang Cokelat",
      "Pisang Keju Cokelat",
      "Bomboloni",
      "Donat Topping",
      "Bolu Marmer",
      "Roti Cokelat",
      "Roti Srikaya",
      "Roti Keju",
    ],
  },
];

function isDishGroup(dish: DishItem): dish is DishGroup {
  return typeof dish !== "string";
}

function renderDishList(items: DishItem[]) {
  return items.map((dish) => {
    if (isDishGroup(dish)) {
      return (
        <div key={dish.subName} className="space-y-2">
          <p className="text-sm font-bold uppercase tracking-wide">
            {dish.subName}
          </p>
          <div className="space-y-2">
            {dish.subMainDish.map((subDish) => (
              <div
                key={`${dish.subName}-${subDish}`}
                className="flex items-center gap-2"
              >
                <LuDot className="shrink-0 text-xl text-black" />
                <p className="text-sm text-gray-700">{subDish}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div key={dish} className="flex items-center gap-2">
        <LuDot className="shrink-0 text-xl text-black" />
        <p className="text-sm text-gray-700">{dish}</p>
      </div>
    );
  });
}

function MenuServices() {
  const t = useTranslations("snackBoxMenuServices");
  const locale = useLocale();

  return (
    <div className="mt-16 flex w-full flex-col items-center justify-center gap-6 text-center sm:mt-24">
      <h2 className="text-lg font-bold uppercase sm:text-xl">
        {t("mainTitle")}
      </h2>
      <div className="grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {mainDish.map((card) => {
          return (
            <article
              key={card.id}
              className="flex h-full flex-col rounded-xl border border-black/10 bg-white px-5 py-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:px-6 sm:pr-10"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl text-red-800 sm:text-4xl">
                  {card.icon}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold uppercase sm:text-xl">
                    {card.name}
                  </h2>
                  {card.subName && (
                    <p className="text-sm italic text-red-800">
                      {localizePriceUnit(card.subName, locale)}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-8 flex flex-1 flex-col">
                <div className="grow space-y-2">
                  {renderDishList(card.subMainDish)}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default MenuServices;
