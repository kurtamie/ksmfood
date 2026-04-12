import { Button } from "@/components/ui/button";
import Image from "next/image";
import prasnikah from "@/public/images/menu/prasmanan-nikah.svg";
import prasmanan from "@/public/images/menu/prasmanan.svg";
import nasi from "@/public/images/menu/nasi-kotak.svg";
import bento from "@/public/images/menu/bento.svg";
import rendang from "@/public/images/menu/rendang.svg";
import snackbox from "@/public/images/menu/snack-kotak.svg";
import snacktam from "@/public/images/menu/snack-tampah.svg";
import tumpeng from "@/public/images/menu/tumpeng.svg";

const packageCards = [
  { id: 1, image: prasnikah, title: "Prasmanan Pernikahan", price: "Mulai dari Rp:32.000/porsi", catalog: "/pdf/wedding.pdf"},
  { id: 2, image: prasmanan, title: "Prasmanan", price: "Mulai dari Rp:32.000/porsi", catalog: "/pdf/prasmanan.pdf"},
  { id: 3, image: nasi, title: "Nasi Kotak", price: "Mulai dari Rp:25.000/kotak", catalog: "/pdf/naskot.pdf" },
  { id: 4, image: bento, title: "Bento", price: "Mulai dari Rp:56.000/kotak" , catalog: "/pdf/bento.pdf"},
  { id: 5, image: rendang, title: "Rendang Kemasan", price: "Mulai dari Rp:80.000/kemasan", catalog: "/pdf/aqiqah.pdf" },
  { id: 6, image: snackbox, title: "Snack Kotak", price: "Mulai dari Rp:13.000", catalog: "/pdf/snackkot.pdf" },
  { id: 7, image: snacktam, title: "Snack Tampah", price: "Harga Disesuaikan" },
  { id: 8, image: tumpeng, title: "Coffee Break", price: "Mulai dari Rp:700.000" },
];

function Menu() {
  return (
    <div className="mt-12 grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      {packageCards.map((card) => (
        <article
          key={card.id}
          className="flex h-full flex-col items-center border border-black/10 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <Image src={card.image} alt={card.title} className="h-auto w-full max-w-56" />
          <div className="flex grow flex-col justify-center py-4">
            <h3 className="text-2xl font-bold text-[#332929]">{card.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{card.price}</p>
          </div>
          <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row">
            <Button className="h-10 flex-1 bg-red-800 text-white hover:bg-red-900 cursor-pointer">
              Lihat Paket
            </Button>
            {card.catalog && (
              <Button asChild className="h-10 flex-1 border border-red-800 bg-white text-red-800 hover:bg-red-800 hover:text-white cursor-pointer">
                <a href={card.catalog} download>Unduh Menu</a>
              </Button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export default Menu;
