import type { Metadata } from "next";
import Pondokan from "@/components/landing/services/wedding/pondokan";

export const metadata: Metadata = {
  title: "Pondokan",
  description:
    "Pilihan menu pondokan KSM Katering dengan pemesanan langsung dari website.",
};

export default function PondokanPage() {
  return (
    <main className="w-full overflow-x-clip">
      <section className="bg-[url('/images/services/wedding/hero.webp')] bg-cover bg-center shadow-[inset_0_0_0_2000px_rgba(63,59,59,0.52)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-16 text-center text-white sm:py-20 lg:min-h-96">
          <p className="text-3xl font-bold sm:text-4xl lg:text-6xl">
            Katering Pondokan
          </p>
          <h1 className="mt-4 max-w-3xl text-xl leading-tight sm:text-3xl lg:text-4xl">
            Pilih menu pondokan favorit dan pesan sesuai kebutuhan acara.
          </h1>
        </div>
      </section>

      <section className="flex w-full flex-col items-center px-6 py-16 sm:py-20">
        <Pondokan />
      </section>
    </main>
  );
}
