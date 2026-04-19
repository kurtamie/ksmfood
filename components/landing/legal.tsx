import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import halal from "@/public/images/legal/halal.webp";
import slhs from "@/public/images/legal/logo_slhs.webp";
import nutrition from "@/public/icons/nutrition.webp";
import card from "@/public/icons/card.webp";
import paper from "@/public/icons/paper.webp";

const legalCards = [
  { id: 1, image: halal, title: "Sertifikat Halal MUI" },
  { id: 2, image: slhs, title: "Sertifikat Laik Higiene Sanitasi" },
];

const legalCards2 = [
  { id: 1, image: nutrition, title: "Sertifikat Ahli Gizi" },
  { id: 2, image: card, title: "Surat Izin Usaha" },
  { id: 3, image: paper, title: "NPWP" },
];

function Legal() {
  const t = useTranslations("legal");
  const primary = t.raw("primary") as string[];
  const secondary = t.raw("secondary") as string[];

  return (
    <div className="flex w-full max-w-6xl flex-col items-center gap-8 px-0 py-12 sm:gap-12 sm:py-20">
      <div className="grid w-full max-w-xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        {legalCards.map((card) => (
          <article
            key={card.id}
            className="flex h-full flex-col items-center border border-black/10 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-2"
          >
            <div className="flex w-full items-end justify-center">
              <Image
                src={card.image}
                alt={card.title}
                className="h-auto w-full max-w-48 object-contain sm:max-w-56"
              />
            </div>
            <div className="flex grow flex-col justify-center py-4">
              <h3 className="text-xl font-bold text-[#332929] sm:text-2xl">
                {primary[card.id - 1] ?? card.title}
              </h3>
            </div>
            <div className="mb-4 mt-2 flex w-1/2 flex-col gap-2 sm:mb-6 sm:flex-row">
              <div className="h-1 w-full bg-[#8D0000]" />
            </div>
          </article>
        ))}
      </div>
      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
        {legalCards2.map((card) => (
          <article
            key={card.id}
            className="flex h-full flex-col items-center border border-black/10 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mt-4 flex w-full items-end justify-center">
              <Image
                src={card.image}
                alt={card.title}
                className="h-auto w-full max-w-28 object-contain sm:max-w-34"
              />
            </div>
            <div className="mt-12 flex grow flex-col justify-center py-4">
              <h3 className="text-xl font-bold text-[#332929] sm:text-2xl">
                {secondary[card.id - 1] ?? card.title}
              </h3>
            </div>
            <div className="mb-4 mt-2 flex w-1/2 flex-col gap-2 sm:mb-6 sm:flex-row">
              <div className="h-1 w-full bg-[#8D0000]" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Legal;
