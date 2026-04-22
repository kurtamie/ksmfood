import React from "react";
import { useTranslations } from "next-intl";
import { LuPlane } from "react-icons/lu";
import { FaHistory } from "react-icons/fa";
import { LuUtensilsCrossed } from "react-icons/lu";
import { BiCheckShield } from "react-icons/bi";
import { TbChefHat } from "react-icons/tb";

const reasons = [
  {
    id: 1,
    icon: <LuPlane />,
    title: "Katering Penerbangan",
    description:
      "KSM merupakan satu-satunya katering di Batam yang dipercaya melayani kebutuhan katering maskapai Garuda Indonesia.",
  },
  {
    id: 2,
    icon: <FaHistory />,
    title: "Berpengalaman",
    description:
      "KSM memiliki pengalaman 19 tahun dalam melayani berbagai jenis acara (pernikahan, acara peresmian, serah terima jabatan) dan puluhan tahun melayani kebutuhan kantin perusahaan industri yang ada di Batam.",
  },
  {
    id: 3,
    icon: <LuUtensilsCrossed />,
    title: "Pilihan Masakan",
    description:
      "Menyediakan beragam menu masakan Nusantara yang dapat dipilih sesuai dengan selera Anda.",
  },
  {
    id: 4,
    icon: <BiCheckShield />,
    title: "Cita Rasa",
    description:
      "Menghadirkan cita rasa masakan Nusantara dengan racikan bumbu rempah yang  khas.",
  },
  {
    id: 5,
    icon: <TbChefHat />,
    title: "Tim Berpengalaman",
    description:
      "Didukung tim yang terbiasa menangani berbagai skala acara dengan pelayanan profesional.",
  },
];

function WhyChoose() {
  const t = useTranslations("whyChoose");
  const reasonsText = t.raw("reasons") as Array<{
    id: number;
    title: string;
    description: string;
  }>;

  return (
    <div className="grid max-w-5xl gap-4 py-12 md:grid-cols-2 md:gap-3 md:py-14">
      {reasons.map((reason, index) => {
        const translatedReason = reasonsText.find(
          (item) => item.id === reason.id,
        );
        const isLastOddItem =
          reasons.length % 2 !== 0 && index === reasons.length - 1;

        return (
          <div
            key={reason.id}
            className={`flex h-full items-start gap-4 border border-gray-200 bg-white px-4 py-5 shadow-sm sm:gap-6 ${
              isLastOddItem
                ? "md:col-span-2 md:mx-auto md:w-full md:max-w-[calc((100%-0.75rem)/2)]"
                : ""
            }`}
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-800 text-2xl font-bold text-white sm:size-14 sm:text-3xl">
              {reason.icon}
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-[#332929] sm:text-xl">
                {translatedReason?.title ?? reason.title}
              </h3>
              <p className="text-sm leading-6 text-gray-600 sm:text-base">
                {translatedReason?.description ?? reason.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default WhyChoose;
