import { Button } from "@/components/ui/button";
import Image from "next/image";
import prasmanan from "@/public/images/prasmanan.svg";

const packageCards = [
  { id: 1, title: "Prasmanan", price: "Mulai dari Rp:xx.xxx / paket" },
  { id: 2, title: "Aqiqah", price: "Mulai dari Rp:xx.xxx / paket" },
  { id: 3, title: "Nasi Kotak", price: "Mulai dari Rp:xx.xxx / paket" },
  { id: 4, title: "Snack Box", price: "Mulai dari Rp:xx.xxx / paket" },
  { id: 5, title: "Wedding", price: "Mulai dari Rp:xx.xxx / paket" },
  { id: 6, title: "Katering Korporat", price: "Mulai dari Rp:xx.xxx / paket" },
  { id: 7, title: "Tumpeng", price: "Mulai dari Rp:xx.xxx / paket" },
  { id: 8, title: "Coffee Break", price: "Mulai dari Rp:xx.xxx / paket" },
];

function Menu() {
  return (
    <div className="mt-12 grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      {packageCards.map((card) => (
        <article
          key={card.id}
          className="flex h-full flex-col items-center border border-black/10 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <Image src={prasmanan} alt={card.title} className="h-auto w-full max-w-56" />
          <h3 className="mt-4 text-2xl font-bold text-[#332929]">{card.title}</h3>
          <p className="mt-2 text-sm text-gray-600">{card.price}</p>
          <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
            <Button className="h-10 flex-1 bg-red-800 text-white">
              Lihat Paket
            </Button>
            <Button className="h-10 flex-1 border border-red-800 bg-white text-red-800">
              Unduh Menu
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default Menu;
