import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RiceboxPage() {
  return (
    <main className="w-full overflow-x-clip">
      <section
        id="hero"
        className="bg-[url('/images/naskot.webp')] bg-cover bg-center shadow-[inset_0_0_0_2000px_rgba(63,59,59,0.48)] "
      >
        <div className="mx-auto flex min-h-auto max-w-8xl flex-col items-center justify-center gap-10 px-6 py-16 text-center sm:gap-14 sm:py-20">
          <div className="w-full text-white">
            <p className="text-2xl font-bold leading-tight sm:text-3xl lg:text-6xl">
              Nasi Kotak
            </p>
            <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:gap-4 lg:flex-row">
              <h1 className="text-2xl leading-tight sm:text-3xl lg:text-4xl">
                Praktis, Higienis dengan menu bervariasi
              </h1>
            </div>
          </div>

            <Button className="h-12 cursor-pointer border border-white bg-transparent px-8 text-sm font-bold text-white hover:border-red-800 hover:bg-red-800 hover:text-white">
              Unduh Menu
            </Button>
        </div>
      </section>

      <section
        id="tentang"
        className="flex items-center justify-center bg-white py-12"
      >
        <div className="flex flex-col w-full max-w-7xl items-center gap-10 px-6 lg:gap-10">
          <div className="flex flex-col gap-6 lg:flex-row mt-10">
            <div className="w-full">
              <iframe width="600" height="315"
                src="https://www.youtube.com/embed/wkzB9INsRfY?autoplay=1&mute=1&controls=0&loop=1">
              </iframe>
            </div>
            <div className="flex flex-col gap-6 text-center lg:ml-6 lg:text-left">
              <h2 className="text-base leading-8 text-black sm:text-3xl font-bold">
                <span className="text-red-800">Paling populer </span>dengan cita rasa yang<br/><span className="text-red-800">tak terlupakan</span>
              </h2>
              <p className="mt-6 text-base leading-8 text-black sm:text-lg">
                <span className="text-red-800">KSM Katering </span> dikenal akan kualitas dan cita rasa masakannya yang lezat karena menggunakan bahan-bahan segar dan berkualitas tinggi untuk menyajikan hidangan yang lezat dan bergizi. 
              </p>
              <p className="text-base leading-8 text-black sm:text-lg">
                Nasi kotak KSM Katering merupakan salah satu pilihan yang populer dan praktis untuk menikmati makanan di berbagai acara atau kegiatan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
