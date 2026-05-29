"use client";

import { useTranslations } from "next-intl";
import { BiSolidDish } from "react-icons/bi";
import { BsPlusCircleFill } from "react-icons/bs";
import { FaCarrot } from "react-icons/fa";
import { FaAppleWhole } from "react-icons/fa6";
import { GiChicken, GiChiliPepper, GiShrimp } from "react-icons/gi";
import { IoFish } from "react-icons/io5";
import { LuDot } from "react-icons/lu";
import { PiCowBold } from "react-icons/pi";

type DishGroup = {
  subName: string;
  subMainDish: string[];
};

type MenuItem = string | DishGroup;

type MenuCard = {
  id: string;
  icon: React.ReactNode;
  name: string;
  accent?: string;
  items: MenuItem[];
};

const mainDishCards: MenuCard[] = [
  {
    id: "ayam",
    icon: <GiChicken />,
    name: "Lauk Ayam",
    items: [
      "Ayam Goreng Kalasan",
      "Ayam Rendang",
      "Ayam Gulai Kare",
      "Ayam Goreng Tepung",
      "Ayam Bakar Padang",
      "Ayam Bakar Kecap",
      "Ayam Bakar Bumbu Tomat",
      "Ayam Goreng Kecap",
      "Ayam Masak Kalio",
      "Ayam Rica-rica",
      "Ayam Balado",
      "Ayam Daun Kemangi",
      "Opor Ayam",
      "Ayam Kremes",
      "Ayam Goreng Pletok",
      "Ayam Fillet",
    ],
  },
  {
    id: "daging",
    icon: <PiCowBold />,
    name: "Lauk Daging",
    items: [
      "Dendeng Balado",
      "Daging Sapi Lada Hitam",
      "Rendang Daging",
      "Daging Bumbu Bali",
      "Gulai Daging Cincang",
      "Semur Telur Balut Daging",
      "Telur Balut Daging",
      "Krensengan Daging",
      "Sate Daging",
      "Empal Daging",
      "Daging Semur",
    ],
  },
  {
    id: "ikan",
    icon: <IoFish />,
    name: "Lauk Ikan",
    items: [
      "Ikan Rica-rica",
      "Ikan Fillet Asam Manis",
      "Ikan Balado",
      "Ikan Bakar Kecap",
      "Ikan Asam Pedas",
      "Ikan Bandeng Presto",
      "Ikan Gulai Kuning",
      "Gulai Tongkol",
      "Pepes Ikan",
      "Ikan Sambal Kacang",
    ],
  },
  {
    id: "seafood",
    icon: <GiShrimp />,
    name: "Lauk Seafood",
    items: [
      "Sotong Goreng Tepung",
      "Udang Goreng Tepung",
      "Sotong Pedas",
      "Udang Masak Cabe",
      "Sotong Gulai",
    ],
  },
];

const companionCards: MenuCard[] = [
  {
    id: "sayur",
    icon: <FaCarrot />,
    name: "Sayur",
    items: [
      "Capcay",
      "Urap Sayuran",
      "Pecel Sayuran",
      "Sup Sayuran",
      "Orak Arik Buncis",
      "Tumis Taoge Teri",
      "Sayur Lodeh",
      "Gulai Labu Siam",
      "Tumis Kacang Panjang",
      "Lalapan",
      "Cah Sawi Putih",
      "Sayur Asem",
      "Tumis Kailan Muda",
      "Tumis Bunga Kol",
      "Tumis Sawi Minyak",
      "Gulai Nangka",
      "Bening Bayam",
    ],
  },
  {
    id: "tambahan",
    icon: <BiSolidDish />,
    name: "Lauk Tambahan",
    items: [
      "Sambal Goreng Kentang Hati",
      "Perkedel Kentang",
      "Tempe/Tahu Goreng",
      "Perkedel Tahu",
      "Perkedel Jagung",
      "Tempe Mendoan",
      "Rolade Tahu",
      "Bihun Goreng",
      "Tahu Bacem",
      "Bakwan Jagung",
      "Serut Kentang",
      "Orak Arik Tahu Tempe",
    ],
  },
  {
    id: "sambal",
    icon: <GiChiliPepper />,
    name: "Sambal",
    items: [
      "Sambal Ijo",
      "Sambal Terasi",
      "Sambal Mangga",
      "Sambal Bajak",
      "Sambal Pete",
    ],
  },
  {
    id: "buah",
    icon: <FaAppleWhole />,
    name: "Buah",
    items: ["Buah Tampah", "(Semangka, Melon)"],
  },
  {
    id: "menu-tambahan",
    icon: <BsPlusCircleFill />,
    name: "Menu Tambahan",
    accent: "+Rp 2.000/porsi",
    items: [
      {
        subName: "Nasi",
        subMainDish: ["Nasi Kuning", "Nasi Lemak"],
      },
    ],
  },
];

function isDishGroup(item: MenuItem): item is DishGroup {
  return typeof item !== "string";
}

function MenuCard({ card }: { card: MenuCard }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#332929]/12 bg-white px-6 py-6 shadow-[0_18px_50px_-32px_rgba(51,41,41,0.3)]">
      <div className="flex items-start gap-3">
        <div className="pt-1 text-[1.7rem] text-[#8D0000]">{card.icon}</div>
        <div>
          <h3 className="text-2xl font-bold text-[#332929]">{card.name}</h3>
          {card.accent && (
            <p className="text-xl font-bold leading-tight text-[#8D0000]">
              {card.accent}
            </p>
          )}
        </div>
      </div>

      <ul className="mt-5 space-y-2.5 text-sm leading-6 text-[#463B3B]">
        {card.items.map((item) => {
          if (isDishGroup(item)) {
            return (
              <li key={`${card.id}-${item.subName}`} className="space-y-1.5">
                <p className="text-sm font-bold uppercase tracking-wide text-[#332929]">
                  {item.subName}
                </p>
                <ul className="space-y-2">
                  {item.subMainDish.map((subItem) => (
                    <li
                      key={`${card.id}-${item.subName}-${subItem}`}
                      className="flex gap-2"
                    >
                      <LuDot className="mt-[0.1rem] shrink-0 text-xl text-[#332929]" />
                      <span>{subItem}</span>
                    </li>
                  ))}
                </ul>
              </li>
            );
          }

          return (
            <li key={`${card.id}-${item}`} className="flex gap-2">
              <span className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-[#332929]" />
              <span>{item}</span>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export default function MenuServices() {
  const t = useTranslations("weddingMenuServices");

  return (
    <div className="mt-14 flex w-full flex-col items-center">
      <h3 className="text-center text-3xl font-bold uppercase tracking-tight text-[#332929]">
        {t("mainTitle")}
      </h3>
      <div className="mt-10 grid w-full max-w-7xl grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {mainDishCards.map((card) => (
          <MenuCard key={card.id} card={card} />
        ))}
      </div>

      <h3 className="mt-14 text-center text-3xl font-bold uppercase tracking-tight text-[#332929]">
        {t("sideTitle")}
      </h3>
      <div className="mt-10 grid w-full max-w-7xl grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
        {companionCards.map((card) => (
          <MenuCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
