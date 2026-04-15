"use client";

import { useState } from "react";
import Image from "next/image";
import menu from "@/public/images/selectmenu.webp";
import { Button } from "../ui/button";

const categories = [
  "Semua",
  "Lauk Ayam",
  "Lauk Daging",
  "Lauk Ikan",
  "Lauk Seafood",
  "Lauk Tambahan",
  "Sayur",
  "Sambal",
];

const menuItems = [
  "Ayam Kalasan",
  "Ayam Bakar Madu",
  "Ayam Goreng Lengkuas",
  "Rendang Daging",
  "Semur Daging",
  "Ikan Bakar Jimbaran",
  "Gurame Asam Manis",
  "Udang Saus Padang",
  "Cumi Lada Hitam",
  "Telur Balado",
  "Capcay Kuah",
  "Tumis Kangkung",
  "Sambal Goreng Ati",
];

const initialVisibleCount = 10;

function SelectMenu() {
  const [showAll, setShowAll] = useState(false);

  const visibleMenus = showAll
    ? menuItems
    : menuItems.slice(0, initialVisibleCount);

  return (
    <>
      <div className="mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-3">
        {categories.map((category, index) => (
          <Button
            key={category}
            className={
              index === 0
                ? "h-11 rounded-full bg-red-800 px-5 text-white hover:bg-red-900"
                : "h-11 rounded-full border border-gray-300 bg-white px-5 text-gray-700 hover:bg-gray-100"
            }
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="mt-12 grid w-full max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {visibleMenus.map((item) => (
          <article
            key={item}
            className="flex h-full flex-col items-center border border-black/10 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <Image src={menu} alt={item} className="h-auto w-full max-w-40 sm:max-w-44" />
            <h3 className="mt-4 text-lg font-bold text-[#332929] sm:text-2xl">
              {item}
            </h3>
          </article>
        ))}
      </div>
      {menuItems.length > initialVisibleCount && (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="py-10 text-base font-bold text-red-800 underline underline-offset-4"
        >
          {showAll ? "Lihat Lebih Sedikit" : "Lihat Lebih Banyak"}
        </button>
      )}
    </>
  );
}

export default SelectMenu;
