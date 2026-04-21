import Image from "next/image";
import { useTranslations } from "next-intl";
import batagor from "@/public/images/services/wedding/snack_pondokan_batagor.webp";
import pempek from "@/public/images/services/wedding/snack_pondokan-pempek_palembang.webp";
import siomay from "@/public/images/services/wedding/snack_pondokan-siomay.webp";
import bakso from "@/public/images/services/wedding/snack_pondokan-bakso.webp";
import soto from "@/public/images/services/wedding/snack_pondokan-soto.webp";
import sate from "@/public/images/services/wedding/snack_pondokan-sate_ayam_lontong.webp";
import dimsum from "@/public/images/services/wedding/snack_pondokan-dimsum.webp";
import surabi from "@/public/images/services/wedding/snack_pondokan-surabi.webp";
import srikaya from "@/public/images/services/wedding/snack_pondokan-ketan_sarikaya.webp";
import durian from "@/public/images/services/wedding/snack_pondokan-ketan_durian.webp";
import sumsum from "@/public/images/services/wedding/snack_pondokan-bubur_sumsum.webp";
import salad from "@/public/images/services/wedding/snack_pondokan-salad_buah.webp";
import candil from "@/public/images/services/wedding/snack_pondokan-bubur_candil.webp";

const packageCards = [
  {
    id: 1,
    image: batagor,
    title: "Batagor",
  },
  {
    id: 2,
    image: pempek,
    title: "Pempek Palembang",
  },
  {
    id: 3,
    image: siomay,
    title: "Siomay",
  },
  {
    id: 4,
    image: bakso,
    title: "Bakso",
  },
  {
    id: 5,
    image: soto,
    title: "Soto",
  },
  {
    id: 6,
    image: sate,
    title: "Sate Ayam + Lontong",
  },
  { id: 7, image: dimsum, title: "Dimsum" },
  {
    id: 8,
    image: surabi,
    title: "Surabi",
  },
  {
    id: 9,
    image: srikaya,
    title: "Ketan Srikaya",
  },
  {
    id: 10,
    image: durian,
    title: "Ketan Durian",
  },
  {
    id: 11,
    image: sumsum,
    title: "Bubur Sumsum",
  },
  {
    id: 12,
    image: salad,
    title: "Salad Buah",
  },
  {
    id: 13,
    image: candil,
    title: "Bubur Candil",
  },
];

function Stand() {
  const t = useTranslations("weddingStand");
  const cards = t.raw("cards") as Array<{
    id: number;
    title: string;
    price: string;
  }>;

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-4">
        <h2 className="text-3xl font-bold text-[#332929] sm:text-4xl lg:text-5xl">
          {t("mainTitle")}
        </h2>
      </div>
      <div className="mt-12 grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {packageCards.map((card, index) => {
          const translatedCard = cards.find((item) => item.id === card.id);
          const isLastOddItem =
            packageCards.length % 2 !== 0 && index === packageCards.length - 1;
          return (
            <article
              key={card.id}
              className={`flex h-full flex-col items-center border border-black/10 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                isLastOddItem
                  ? "sm:col-span-4 sm:mx-auto sm:w-full sm:max-w-[calc((100%-0.75rem)/4)]"
                  : ""
              }`}
            >
              <Image
                src={card.image}
                alt={translatedCard?.title ?? card.title}
                className="h-36 w-full max-w-56"
              />
              <div className="flex grow flex-col justify-center py-4">
                <h3 className="text-2xl font-bold text-[#332929]">
                  {translatedCard?.title ?? card.title}
                </h3>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

export default Stand;
