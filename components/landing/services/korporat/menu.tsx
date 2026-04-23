import { Button } from "@/components/ui/button";
import { createWhatsappLink } from "@/const/whatsapp";
import { useTranslations } from "next-intl";
import { LuCheck, LuPackageOpen } from "react-icons/lu";

const packageCards = [
  {
    id: 1,
    title: "Katering Acara",
    dish: [
      "Meningkatkan kualitas acara perusahaan",
      "Menyajikan pengalaman kuliner terbaik untuk tamu",
      "Cocok untuk acara kantor, rapat, hingga perayaan khusus",
      "Pelayanan profesional tanpa repot",
    ],
  },
  {
    id: 2,
    title: "Paket B",
    dish: [
      "Hidangan lezat dan sehat setiap hari",
      "Menjaga produktivitas dan semangat kerja",
      "Menu variatif dan bergizi",
      "Nutrisi terpenuhi tanpa mengorbankan cita rasa",
    ],
  },
];

function Menu() {
  const t = useTranslations("tumpengMenu");
  const serviceName = "Katering Korporat";

  return (
    <div className="mt-12 grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
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
            {/* {card.badge && (
              <div className="absolute right-0 top-0 rounded-bl-xl rounded-tr-xl bg-[#F7C948] px-3 py-1.5 text-[11px] font-semibold text-black shadow-sm">
                <div className="flex items-center gap-1.5">
                  <LuAward className="text-xs" />
                  <span>{card.badge ? t("popular") : card.badge}</span>
                </div>
              </div>
            )} */}
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

              <Button asChild className="mt-8 h-11 w-full bg-red-800 text-white hover:bg-red-900">
                <a
                  href={createWhatsappLink(
                    `Halo, saya ingin memesan ${serviceName} dengan ${card.title}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("orderNow")}
                </a>
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default Menu;
