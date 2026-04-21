"use client";

import { useTranslations } from "next-intl";
import { ImSpoonKnife } from "react-icons/im";
import { LuChefHat, LuClipboardList, LuUserRound } from "react-icons/lu";

const infoItems = [
  {
    icon: LuChefHat,
    titleKey: "equipmentTitle",
    descriptionKey: "equipmentDescription",
  },
  {
    icon: LuUserRound,
    titleKey: "serviceTitle",
    descriptionKey: "serviceDescription",
  },
  {
    icon: ImSpoonKnife,
    titleKey: "toolsTitle",
    descriptionKey: "toolsDescription",
  },
  {
    icon: LuClipboardList,
    titleKey: "minimumTitle",
    descriptionKey: "minimumDescription",
  },
];

export default function OrderingInfo() {
  const t = useTranslations("weddingPage.orderingInfo");

  return (
    <div className="grid w-full max-w-7xl grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
      {infoItems.map((item) => {
        const Icon = item.icon;

        return (
          <article
            key={item.titleKey}
            className="flex items-center justify-center gap-4"
          >
            <div className="rounded-2xl bg-white/60 p-3 text-[#6F0000] shadow-sm ring-1 ring-[#6F0000]/10">
              <Icon className="size-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#332929]">
                {t(item.titleKey)}
              </h3>
              <p className="mt-1 text-sm leading-6 text-[#5A4B4B]">
                {t(item.descriptionKey)}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
