"use client";

import { useState } from "react";
import { LuAward, LuCheck, LuPackageOpen } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { AqiqahOrderModal, type AqiqahPackageCard } from "./OrderModal";

const paketBetina: AqiqahPackageCard[] = [
  {
    id: "betina-20kg-prasmanan",
    title: "BETINA 20KG",
    subTitle: "Prasmanan",
    badge: true,
    price: "Rp 3.400.000",
    packageType: "betina-20kg-prasmanan",
    items: [
      "1 Termos Nasi (80 Porsi)",
      "40 Porsi Makanan Gulai",
      "200 Tusuk Sate",
      "Gratis: Acar Mentimun",
      "Sertifikat Aqiqah",
      "Alat-alat Prasmanan",
    ],
  },
  {
    id: "betina-20kg-nasi-kotak",
    title: "BETINA 20KG",
    subTitle: "Nasi Kotak (80 Kotak)",
    price: "Rp 3.850.000",
    packageType: "betina-20kg-nasi-kotak",
    items: [
      "Rincian Per Kotak:",
      "Nasi Putih",
      "Gulai Kambing",
      "Sate Kambing (2 Tusuk)",
      "Kerupuk",
      "Gratis: Acar Mentimun",
      "Sertifikat Aqiqah",
    ],
  },
  {
    id: "betina-30kg-prasmanan",
    title: "BETINA 30KG",
    subTitle: "Prasmanan",
    price: "Rp 5.050.000",
    packageType: "betina-30kg-prasmanan",
    items: [
      "1 Termos Nasi (100 Porsi)",
      "60 Porsi Makanan Gulai",
      "240 Tusuk Sate",
      "Gratis: Acar Mentimun",
      "Sertifikat Aqiqah",
      "Alat-alat Prasmanan",
    ],
  },
  {
    id: "betina-30kg-nasi-kotak",
    title: "BETINA 30KG",
    subTitle: "Nasi Kotak (120 Kotak)",
    price: "Rp 5.400.000",
    packageType: "betina-30kg-nasi-kotak",
    items: [
      "Rincian Per Kotak:",
      "Nasi Putih",
      "Gulai Kambing",
      "Sate Kambing (2 Tusuk)",
      "Kerupuk",
      "Gratis: Acar Mentimun",
      "Sertifikat Aqiqah",
    ],
  },
];

const paketJantan: AqiqahPackageCard[] = [
  {
    id: "jantan-20kg-prasmanan",
    title: "JANTAN 20KG",
    subTitle: "Prasmanan",
    badge: true,
    price: "Rp 4.800.000",
    packageType: "jantan-20kg-prasmanan",
    items: [
      "1 Termos Nasi (80 Porsi)",
      "40 Porsi Makanan Gulai",
      "200 Tusuk Sate",
      "Gratis: Acar Mentimun",
      "Sertifikat Aqiqah",
      "Alat-alat Prasmanan",
    ],
  },
  {
    id: "jantan-20kg-nasi-kotak",
    title: "JANTAN 20KG",
    subTitle: "Nasi Kotak (80 Kotak)",
    price: "Rp 5.100.000",
    packageType: "jantan-20kg-nasi-kotak",
    items: [
      "Rincian Per Kotak:",
      "Nasi Putih",
      "Gulai Kambing",
      "Sate Kambing (2 Tusuk)",
      "Kerupuk",
      "Gratis: Acar Mentimun",
      "Sertifikat Aqiqah",
    ],
  },
  {
    id: "jantan-30kg-prasmanan",
    title: "JANTAN 30KG",
    subTitle: "Prasmanan",
    price: "Rp 6.800.000",
    packageType: "jantan-30kg-prasmanan",
    items: [
      "1 Termos Nasi (100 Porsi)",
      "60 Porsi Makanan Gulai",
      "240 Tusuk Sate",
      "Gratis: Acar Mentimun",
      "Sertifikat Aqiqah",
      "Alat-alat Prasmanan",
    ],
  },
  {
    id: "jantan-30kg-nasi-kotak",
    title: "JANTAN 30KG",
    subTitle: "Nasi Kotak (120 Kotak)",
    price: "Rp 7.400.000",
    packageType: "jantan-30kg-nasi-kotak",
    items: [
      "Rincian Per Kotak:",
      "Nasi Putih",
      "Gulai Kambing",
      "Sate Kambing (2 Tusuk)",
      "Kerupuk",
      "Gratis: Acar Mentimun",
      "Sertifikat Aqiqah",
    ],
  },
];

function PackageSection({
  title,
  highlight,
  cards,
  serviceName,
  onOrder,
}: {
  title: string;
  highlight: string;
  cards: AqiqahPackageCard[];
  serviceName: string;
  onOrder: (card: AqiqahPackageCard, serviceName: string) => void;
}) {
  return (
    <div className="mt-12 w-full max-w-6xl">
      <h2 className="mb-8 text-center text-3xl font-bold text-[#332929]">
        {title} <span className="text-[#8D0000]">{highlight}</span>
      </h2>

      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.id}
            className="relative flex h-full flex-col rounded-2xl border border-[#332929]/10 bg-white px-5 py-6 shadow-[0_18px_50px_-32px_rgba(51,41,41,0.35)]"
          >
            {card.badge && (
              <div className="absolute right-0 top-0 rounded-bl-2xl rounded-tr-2xl bg-[#F7C948] px-3 py-1.5 text-[11px] font-semibold text-black shadow-sm">
                <div className="flex items-center gap-1.5">
                  <LuAward className="text-xs" />
                  <span>Paling Populer</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-[#8D0000]/8 text-[#8D0000]">
                <LuPackageOpen className="text-[1.65rem]" />
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase text-[#332929]">
                  {card.title}
                </h3>
                {card.subTitle && (
                  <p className="text-sm font-medium italic text-[#8D0000]">
                    {card.subTitle}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-1 flex-col">
              <div className="flex-1 space-y-2.5">
                {card.items.map((item) => (
                  <div key={`${card.id}-${item}`} className="flex gap-2">
                    <LuCheck className="mt-0.5 shrink-0 text-sm text-[#8D0000]" />
                    <p className="text-sm leading-6 text-[#463B3B]">{item}</p>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-center text-2xl font-bold text-[#8D0000]">
                {card.price}
              </p>

              <Button
                onClick={() => onOrder(card, serviceName)}
                className="mt-4 h-11 rounded-lg bg-[#9F0404] font-bold text-white hover:bg-[#870000]"
              >
                Pesan Sekarang
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function Menu() {
  const [selectedCard, setSelectedCard] = useState<AqiqahPackageCard | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");

  const handleOrder = (card: AqiqahPackageCard, serviceName: string) => {
    setSelectedCard(card);
    setSelectedService(serviceName);
  };

  return (
    <>
      <PackageSection
        title="Paket"
        highlight="Kambing Betina"
        cards={paketBetina}
        serviceName="Aqiqah Kambing Betina"
        onOrder={handleOrder}
      />

      <PackageSection
        title="Paket"
        highlight="Kambing Jantan"
        cards={paketJantan}
        serviceName="Aqiqah Kambing Jantan"
        onOrder={handleOrder}
      />

      {selectedCard && (
        <AqiqahOrderModal
          card={selectedCard}
          serviceName={selectedService}
          onClose={() => {
            setSelectedCard(null);
            setSelectedService("");
          }}
        />
      )}
    </>
  );
}