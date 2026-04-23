import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";
import prasnikah from "@/public/images/menu/prasmanan-nikah.webp";
import prasmanan from "@/public/images/menu/prasmanan.webp";
import nasi from "@/public/images/menu/nasi-kotak.webp";
import bento from "@/public/images/menu/bento.webp";
import rendang from "@/public/images/menu/rendang.webp";
import snackbox from "@/public/images/menu/snack-kotak.webp";
import aqiqah from "@/public/images/services/aqiqah/aqiq.webp";
import tumpeng from "@/public/images/menu/tumpeng.webp";
import korporat from "@/public/images/menu/korporat.webp";

const packageCards = [
  {
    id: 1,
    image: prasnikah,
    title: "Prasmanan Pernikahan",
    price: "Mulai dari Rp 32.000/porsi",
    catalog: "/images/pdf/wedding.pdf",
    url: "/services/wedding",
  },
  {
    id: 2,
    image: prasmanan,
    title: "Prasmanan",
    price: "Mulai dari Rp 32.000/porsi",
    catalog: "/images/pdf/prasmanan.pdf",
    url: "/services/prasmanan",
  },
  {
    id: 3,
    image: nasi,
    title: "Nasi Kotak",
    price: "Mulai dari Rp 25.000/kotak",
    catalog: "/images/pdf/naskot.pdf",
    url: "/services/riceBox",
  },
  {
    id: 4,
    image: bento,
    title: "Bento",
    price: "Mulai dari Rp 56.000/kotak",
    catalog: "/images/pdf/bento.pdf",
    url: "/services/bento",
  },
  {
    id: 5,
    image: rendang,
    title: "Rendang Kemasan",
    price: "Mulai dari Rp 80.000/kemasan",
    catalog: "/images/pdf/aqiqah.pdf",
    url: "/services/rendang-kemasan",
  },
  {
    id: 6,
    image: snackbox,
    title: "Snack Kotak",
    price: "Mulai dari Rp 13.000",
    catalog: "/images/pdf/snackkot.pdf",
    url: "/services/snackBox",
  },
  {
    id: 7,
    image: aqiqah,
    title: "Aqiqah",
    price: "Harga Disesuaikan",
    catalog: "/images/pdf/aqiqah.pdf",
    route: "/services/aqiqah",
  },
  {
    id: 8,
    image: tumpeng,
    title: "Tumpeng",
    price: "Mulai dari Rp 700.000",
    url: "/services/tumpeng",
  },
  {
    id: 9,
    image: korporat,
    title: "Katering Korporat",
    price: "Harga Disesuaikan",
    url: "/services/korporat",
  },
];

function Menu() {
  const t = useTranslations("homeMenu");
  const cards = t.raw("cards") as Array<{
    id: number;
    title: string;
    price: string;
  }>;

  return (
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
              className="h-auto w-full max-w-56"
            />
            <div className="flex grow flex-col justify-center py-4">
              <h3 className="text-2xl font-bold text-[#332929]">
                {translatedCard?.title ?? card.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {translatedCard?.price ?? card.price}
              </p>
            </div>
            <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row">
              <Button
                asChild
                className="h-10 flex-1 bg-red-800 text-white hover:bg-red-900 cursor-pointer"
              >
                <a href={card.url}>{t("viewPackage")}</a>
              </Button>
              {card.catalog && (
                <Button
                  asChild
                  className="h-10 flex-1 border border-red-800 bg-white text-red-800 hover:bg-red-800 hover:text-white cursor-pointer"
                >
                  <a href={card.catalog} download>
                    {t("downloadMenu")}
                  </a>
                </Button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default Menu;
