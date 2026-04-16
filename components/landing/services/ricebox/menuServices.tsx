import React from "react";
import { useTranslations } from "next-intl";
import { BiSolidDish } from "react-icons/bi";
import { BsPlusCircleFill } from "react-icons/bs";
import { FaCarrot } from "react-icons/fa";
import { GiBanana, GiChicken, GiChiliPepper, GiShrimp } from "react-icons/gi";
import { IoFish } from "react-icons/io5";
import { LuDot } from "react-icons/lu";
import { PiCowBold } from "react-icons/pi";

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
    icon: <GiChicken />,
    name: "Lauk Ayam",
    subMainDish: [
      "Ayam Goreng Kalasan",
      "Ayam Rendang",
      "Ayam Gulai Kare",
      "Ayam Goreng Tepung",
      "Ayam Goreng Padang",
      "Ayam Bakar Kecap",
      "Ayam Balado",
      "Opor Ayam",
      "Ayam Kremes",
      "Ayam Goreng Pletok",
    ],
  },
  {
    id: 2,
    icon: <PiCowBold />,
    name: "Lauk Daging",
    subMainDish: [
      "Dendeng Balado",
      "Daging Sapi Lada Hitam",
      "Rendang Daging",
      "Daging Bumbu Bali",
      "Gulai Daging Cincang",
      "Daging Semur",
      "Krensengan Daging",
    ],
  },
  {
    id: 3,
    icon: <IoFish />,
    name: "Lauk Ikan",
    subMainDish: [
      "Ikan Rica-rica",
      "Ikan Fillet Asam Manis",
      "Ikan Balado",
      "Ikan Bakar Kecap",
      "Ikan Asam Pedas",
      "Ikan Bandeng Presto",
      "Ikan Gulai Kuning",
      "Gulai Tongkol",
      "Pepes Ikan",
    ],
  },
  {
    id: 4,
    icon: <GiShrimp />,
    name: "Lauk Seafood",
    subMainDish: [
      "Sotong Goreng Tepung",
      "Udang Goreng Tepung",
      "Sotong Pedas",
      "Udang Masak Cabe",
      "Sotong Gulai",
    ],
  },
];

const sideDish: MenuCard[] = [
  {
    id: 1,
    icon: <FaCarrot />,
    name: "Sayur",
    subMainDish: [
      "Urap Sayuran",
      "Pecel Sayuran",
      "Sup Sayuran",
      "Orak Arik Buncis",
      "Tumis Toge Teri",
      "Sayur Lodeh",
      "Gulai Labu Siam",
      "Tumis Kacang Panjang",
      "Lalapan",
      "Cah Sawi Putih",
    ],
  },
  {
    id: 2,
    icon: <BiSolidDish />,
    name: "Lauk Tambahan",
    subMainDish: [
      "Perkedel Kentang",
      "Tempe/Tahu Goreng",
      "Perkedel Tahu",
      "Bakwan Jagung",
      "Serut Kentang",
      "Sambal Goreng Kentang Hati",
      "Orak Arik Tahu Tempe",
      "Tempe Mendoan",
    ],
  },
  {
    id: 3,
    icon: <GiChiliPepper />,
    name: "Sambal",
    subMainDish: [
      "Sambal Ijo",
      "Sambal Terasi",
      "Sambal Mangga",
      "Sambal Bajak",
    ],
  },
  {
    id: 4,
    icon: <GiBanana />,
    name: "Buah",
    subMainDish: ["Jeruk", "Pisang"],
  },
  {
    id: 5,
    icon: <BsPlusCircleFill />,
    name: "Menu Tambahan",
    subName: "(+Rp 2.000/porsi)",
    subMainDish: [
      {
        subName: "Nasi",
        subMainDish: ["Nasi Kuning", "Nasi Lemak"],
      },
      {
        subName: "Sayur",
        subMainDish: [
          "Capcay",
          "Sayur Asem",
          "Tumis Kailan Muda",
          "Tumis Bunga Kol",
          "Tumis Sawi Minyak",
        ],
      },
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
  const t = useTranslations("riceboxMenuServices");

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
                      {card.subName}
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

      <h2 className="mt-4 text-lg font-bold uppercase sm:text-xl">
        {t("sideTitle")}
      </h2>
      <div className="grid w-full max-w-8xl grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {sideDish.map((card) => {
          return (
            <article
              key={card.id}
              className="flex h-full flex-col rounded-xl border border-black/10 bg-white px-5 py-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:px-6 sm:pr-10"
            >
              <div className="flex items-start gap-4 sm:items-center">
                <div className="text-3xl text-red-800 sm:text-4xl">
                  {card.icon}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold uppercase sm:text-xl">
                    {card.name}
                  </h2>
                  {card.subName && (
                    <p className="text-base font-bold text-red-800 sm:text-xl">
                      {card.subName}
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
