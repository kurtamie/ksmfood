import React from "react";

const reasons = [
  {
    number: "1",
    title: "Kualitas Terjamin",
    description:
      "Menggunakan bahan berkualitas dan proses pengolahan yang higienis untuk menjaga cita rasa terbaik.",
  },
  {
    number: "2",
    title: "Menu Variatif",
    description:
      "Pilihan menu lengkap untuk acara keluarga, kantor, hingga kebutuhan katering harian.",
  },
  {
    number: "3",
    title: "Harga Kompetitif",
    description:
      "Menyediakan paket katering yang fleksibel dengan harga yang tetap ramah di anggaran.",
  },
  {
    number: "4",
    title: "Pelayanan Tepat Waktu",
    description:
      "Pesanan diproses dan dikirim sesuai jadwal agar acara berjalan lancar tanpa kendala.",
  },
  {
    number: "5",
    title: "Porsi Memuaskan",
    description:
      "Setiap menu disiapkan dengan porsi yang pas dan presentasi yang tetap menarik.",
  },
  {
    number: "6",
    title: "Tim Berpengalaman",
    description:
      "Didukung tim yang terbiasa menangani berbagai skala acara dengan pelayanan profesional.",
  },
];

function WhyChoose() {
  return (
    <div className="grid max-w-5xl gap-4 py-12 md:grid-flow-col md:grid-rows-3 md:gap-3 md:py-14">
      {reasons.map((reason) => (
        <div
          key={reason.number}
          className="flex h-full items-start gap-4 border border-gray-200 bg-white px-4 py-5 shadow-sm sm:gap-6"
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-800 text-2xl font-bold text-white sm:size-14 sm:text-3xl">
            {reason.number}
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold text-[#332929] sm:text-xl">
              {reason.title}
            </h3>
            <p className="text-sm leading-6 text-gray-600 sm:text-base">
              {reason.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default WhyChoose;
