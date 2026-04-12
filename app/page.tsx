import Image from "next/image";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";
import { FiYoutube } from "react-icons/fi";
import CarouselMoment from "@/components/landing/carouselMoment";
import Faq from "@/components/landing/faq";
import Menu from "@/components/landing/menu";
import SelectMenu from "@/components/landing/selectMenu";
import Testimonial from "@/components/landing/testimonial";
import WhyChoose from "@/components/landing/whyChoose";
import RotatingText from "@/components/motion/rotatingText";
import { Button } from "@/components/ui/button";
import about from "@/public/images/about.svg";
import mie from "@/public/images/mie.svg";
import opor from "@/public/images/opor-ayam.svg";
import pattern from "@/public/images/pattern.svg";
import Client from "@/components/landing/client";

function Page() {
  return (
    <main className="w-full overflow-x-clip">
      <section
        id="hero"
        className="min-h-[calc(100dvh-4.5rem)] bg-[url('/images/bg-hero.jpg')] bg-cover bg-top shadow-[inset_0_0_0_2000px_rgba(63,59,59,0.48)]"
      >
        <div className="mx-auto flex min-h-[calc(100dvh-4.5rem)] max-w-8xl flex-col items-center justify-center gap-10 px-6 py-16 text-center sm:gap-14 sm:py-20">
          <div className="w-full text-white">
            <p className="text-2xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              KSM Katering
            </p>
            <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:gap-4 lg:flex-row">
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Layanan Katering Untuk
              </h1>
              <RotatingText
                texts={["Pernikahan", "Aqiqah", "Perusahaan", "Pertemuan"]}
                mainClassName="overflow-hidden rounded-xl bg-red-800 px-4 py-2 text-3xl font-bold text-white shadow-lg sm:text-5xl lg:text-6xl"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              />
            </div>
            <p className="mx-auto mt-5 max-w-2xl text-base font-medium text-white/90 sm:text-lg lg:text-xl">
              Katering ku, ya KSM Katering
            </p>
          </div>

          <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Button className="h-12 cursor-pointer bg-white px-8 text-sm font-bold text-black hover:bg-red-800 hover:text-white">
              Lihat Paket
            </Button>
            <Button className="h-12 cursor-pointer border border-white bg-transparent px-8 text-sm font-bold text-white hover:border-red-800 hover:bg-red-800 hover:text-white">
              Hubungi Kami
            </Button>
          </div>
        </div>
      </section>

      <section
        id="tentang"
        className="flex items-center justify-center bg-white py-16"
      >
        <div className="flex flex-col w-full max-w-7xl items-center gap-10 px-6 lg:gap-12">
          <div className="flex text-3xl font-bold sm:text-4xl lg:text-5xl gap-4">
            <h1 className="text-black">
              Tentang
            </h1>
            <h1 className="text-[#8D0000]">
              KSM Katering
            </h1>
          </div>
          <div className="flex flex-col gap-10 lg:flex-row mt-10">
            <div className="w-full max-w-xl bg-[#8D0000] px-12 py-24">
              <iframe width="420" height="315"
                src="https://www.youtube.com/embed/wkzB9INsRfY?autoplay=1&mute=1&controls=0&loop=1">
              </iframe>
            </div>
            <div className="flex flex-col gap-6 text-center lg:ml-6 lg:text-left">
              <p className="text-base leading-8 text-black sm:text-lg">
                KSM Katering berdiri sejak tahun 2007 sebagai penyedia layanan katering halal yang menghadirkan sajian lezat, sehat, dan higienis.
                Kami telah melayani berbagai kebutuhan dari perusahaan, rumah sakit, sekolah, instansi pemerintahan, kementerian, perbankan, hingga maskapai penerbangan di Batam.
              </p>
              <p className="text-base leading-8 text-black sm:text-lg">
                Kami juga melayani berbagai jenis acara seperti pernikahan, pertemuan, ibadah haji, dan acara lainnya 
              </p>
              <p className="text-base leading-8 text-black sm:text-lg">
                Dengan pengalaman lebih dari 17 tahun, KSM Katering siap menjadi solusi katering terbaik untuk berbagai jenis acara Anda.
              </p>
              <div className="flex justify-center gap-4 lg:justify-start">
                <Link
                  href="/#kontak"
                  aria-label="Instagram KSM Katering"
                  className="rounded-full border border-[#8D0000] p-2 text-xl text-[#8D0000] transition hover:bg-[#8D0000] hover:text-white"
                >
                  <FaInstagram />
                </Link>
                <Link
                  href="/#portofolio"
                  aria-label="YouTube KSM Katering"
                  className="rounded-full border border-[#8D0000] p-2 text-xl text-[#8D0000] transition hover:bg-[#8D0000] hover:text-white"
                >
                  <FiYoutube />
                </Link>
              </div>
              <Button className="mt-2 h-12 w-full cursor-pointer border border-[#8D0000] bg-transparent text-[#8D0000] hover:bg-[#8D0000] hover:white sm:w-48">
                Lihat Lebih Banyak
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="layanan"
        className="flex w-full flex-col items-center px-6 py-16 sm:py-20"
      >
        <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-4">
          <h2 className="text-3xl font-bold text-[#332929] sm:text-4xl lg:text-5xl">
            Layanan
          </h2>
          <h2 className="text-3xl font-bold text-red-800 sm:text-4xl lg:text-5xl">
            KSM Katering
          </h2>
        </div>
        <Menu />
      </section>

      {/* <section className="relative flex w-full justify-center overflow-hidden px-6 py-16 sm:py-20">
        <Image
          src={pattern}
          alt=""
          className="pointer-events-none absolute left-0 top-0 z-0 h-auto w-28 opacity-80 sm:w-auto"
        />
        <div className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-center">
          <h2 className="max-w-4xl text-center text-3xl font-bold text-[#332929] sm:text-4xl lg:text-5xl">
            Pilih Menu Katering Sesuai Selera
          </h2>
          <SelectMenu />
        </div>
        <Image
          src={pattern}
          alt=""
          className="pointer-events-none absolute bottom-0 right-0 z-0 h-auto w-28 rotate-180 opacity-80 sm:w-auto"
        />
      </section> */}

      <section className="relative flex w-full justify-center overflow-hidden px-6 py-8 sm:py-10">
        <Image
          src={opor}
          alt=""
          className="pointer-events-none absolute left-0 top-0 z-0 h-auto w-24 opacity-80 sm:w-auto"
        />
        <div className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-4">
            <h2 className="text-3xl font-bold text-[#332929] sm:text-4xl lg:text-5xl">
              Mengapa Memilih
            </h2>
            <h2 className="text-3xl font-bold text-red-800 sm:text-4xl lg:text-5xl">
              KSM?
            </h2>
          </div>
          <WhyChoose />
        </div>
        <Image
          src={mie}
          alt=""
          className="pointer-events-none absolute bottom-0 right-0 z-0 h-auto w-24 opacity-80 sm:w-auto"
        />
      </section>

      <section
        id="klien"
        className="flex w-full flex-col items-center px-6 py-16 sm:py-20"
      >
        <h2 className="text-3xl font-bold text-[#332929] sm:text-4xl lg:text-5xl">
          Dipercaya Oleh Klien Kami
        </h2>
        <Client />
      </section>

      <section className="bg-[url('/images/testi.svg')] bg-cover bg-top shadow-[inset_0_0_0_2000px_rgba(255,255,255,0.72)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 py-16 text-center sm:gap-14 sm:py-24">
          <div className="w-full text-[#332929]">
            <h2 className="text-3xl font-bold uppercase sm:text-4xl lg:text-5xl">
              Biarkan Pelanggan Kami yang Bercerita
            </h2>
            <Testimonial />
          </div>
        </div>
      </section>

      <section id="portofolio">
        <CarouselMoment />
      </section>

      <section className="flex w-full flex-col items-center px-6 py-16 sm:py-20">
        <h2 className="text-center text-3xl font-bold text-[#332929] sm:text-4xl lg:text-5xl">
          Yang Sering Ditanyakan
        </h2>
        <Faq />
      </section>

      <section
        id="kontak"
        className="bg-[url('/images/testi.svg')] bg-cover bg-top shadow-[inset_0_0_0_2000px_rgba(141,0,0,0.84)]"
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 px-6 py-20 text-center text-white sm:gap-8 sm:py-24">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Siap Menyediakan Katering untuk Acara Anda
          </h2>
          <p className="text-base text-white/90 sm:text-lg lg:text-xl">
            Diskusikan kebutuhan acara Anda bersama kami dan dapatkan solusi
            katering yang sesuai.
          </p>
          <Button className="mt-2 h-12 bg-[#1E1E1E] px-8 text-base text-white sm:text-lg">
            Hubungi Kami
          </Button>
        </div>
      </section>
    </main>
  );
}

export default Page;
