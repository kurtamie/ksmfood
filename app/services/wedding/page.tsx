"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import pattern from "@/public/images/pattern.webp";
import Menu from "@/components/landing/services/wedding/menu";
import MenuServices from "@/components/landing/services/wedding/menuServices";
import Cta from "@/components/landing/services/wedding/cta";
import SectionRoutes from "@/components/landing/services/wedding/sectionRoutes";
import OrderingInfo from "@/components/landing/services/wedding/orderingInfo";
import Stand from "@/components/landing/services/wedding/stand";
import Faq from "@/components/landing/services/wedding/faq";

export default function WeddingPage() {
  const t = useTranslations("weddingPage");

  return (
    <main className="w-full overflow-x-clip">
      <section
        id="hero"
        className="scroll-mt-24 bg-[url('/images/services/wedding/hero.webp')] bg-cover bg-center shadow-[inset_0_0_0_2000px_rgba(63,59,59,0.48)]"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-16 text-center text-white sm:py-20 lg:min-h-140">
          <p className="text-3xl font-bold sm:text-4xl lg:text-6xl">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mt-4 max-w-4xl text-xl leading-tight sm:text-3xl lg:text-4xl">
            {t("hero.title")}
          </h1>

          {/* <div className="flex flex-col gap-8 md:flex md:flex-row">
            <a
              href="/images/pdf/wedding.pdf"
              download
              className="mt-10 inline-flex h-12 items-center justify-center rounded-lg border border-white px-8 text-sm font-bold text-white transition hover:border-[#8D0000] hover:bg-[#8D0000]"
            >
              {t("hero.cta")}
            </a>
            <a
              href="/images/pdf/wedding.pdf"
              download
              className="mt-10 inline-flex h-12 items-center justify-center rounded-lg border border-white px-8 text-sm font-bold text-white transition hover:border-[#8D0000] hover:bg-[#8D0000]"
            >
              {t("hero.cta2")}
            </a>
          </div> */}
        </div>
      </section>

      <SectionRoutes />

      <section
        id="tentang"
        className="scroll-mt-24 flex items-center justify-center bg-white py-12"
      >
        <div className="flex w-full max-w-7xl flex-col items-center gap-10 px-4 sm:px-6 lg:gap-10">
          <div className="mt-6 flex flex-col gap-6 lg:mt-10 lg:flex-row">
            <div className="w-full">
              <iframe
                className="aspect-video w-full rounded-2xl"
                src="https://www.youtube.com/embed/wkzB9INsRfY?autoplay=1&mute=1&controls=0&loop=1"
              ></iframe>
            </div>
            <div className="flex flex-col gap-4 text-center lg:ml-6 lg:gap-6 lg:text-left">
              <h2 className="text-2xl font-bold leading-snug text-black sm:text-3xl">
                {t("about.titleLead")}
                <span className="text-red-800">{t("about.titleAccent")}</span>
              </h2>
              <p className="text-sm leading-7 text-black sm:text-lg sm:leading-8">
                {t("about.paragraph1")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="layanan"
        className="scroll-mt-20 flex w-full flex-col items-center px-4 py-14 sm:px-6 sm:py-18"
      >
        <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-4">
          <h2 className="text-4xl font-bold text-[#332929] sm:text-5xl lg:text-[4rem]">
            {t("packages.titleLead")}
          </h2>
          <h2 className="text-4xl font-bold text-[#8D0000] sm:text-5xl lg:text-[4rem]">
            {t("packages.titleBrand")}
          </h2>
        </div>
        <Menu />
      </section>

      <section
        id="informasi-pemesanan"
        className="scroll-mt-20 flex items-center justify-center bg-[#F5E5D1] px-4 py-16 sm:px-6"
      >
        <div className="w-full max-w-7xl">
          <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-4">
            <h2 className="text-4xl font-bold text-[#332929] sm:text-5xl lg:text-[4rem]">
              {t("orderingInfo.titleLead")}
            </h2>
            <h2 className="text-4xl font-bold text-[#8D0000] sm:text-5xl lg:text-[4rem]">
              {t("orderingInfo.titleAccent")}
            </h2>
          </div>
          <div className="mt-12">
            <OrderingInfo />
          </div>
        </div>
      </section>

      <section
        id="pilihan-menu"
        className="relative isolate mt-8 flex w-full justify-center py-16 sm:py-20"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        >
          <Image
            src={pattern}
            alt=""
            className="absolute left-0 top-0 h-auto w-24 sm:w-32 lg:w-40"
          />
          <Image
            src={pattern}
            alt=""
            className="absolute bottom-0 right-0 h-auto w-24 sm:w-32 lg:w-40"
          />
        </div>
        <div className="relative z-10 flex w-full flex-col items-center justify-center px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-4">
            <h2 className="text-4xl font-bold text-[#332929] sm:text-5xl lg:text-[4rem]">
              {t("menuSection.titleLead")}
            </h2>
            <h2 className="text-4xl font-bold text-[#8D0000] sm:text-5xl lg:text-[4rem]">
              {t("menuSection.titleBrand")}
            </h2>
          </div>
          <MenuServices />
        </div>
      </section>

      {/* <section
        id="stand"
        className="flex w-full flex-col items-center px-6 py-16 sm:py-20"
      >
        <Stand />
      </section> */}

      <section
        id="faq"
        className="flex w-full flex-col items-center px-6 py-16 sm:py-20"
      >
        <Faq />
      </section>

      <section
        id="bts"
        className="flex w-full flex-col items-center px-6 py-16 sm:py-20"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="space-y-4 sm:space-y-6">
            <div className="overflow-hidden rounded-2xl bg-neutral-950 shadow-sm">
              <iframe
                title="behind-the-scene"
                src="https://www.youtube.com/embed/nxJ3_mBdZI8?autoplay=1&mute=1&controls=0&loop=1"
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="hubungi-kami"
        className="mt-12 mb-8 flex items-center justify-center px-4 sm:px-8 scroll-mt-24"
      >
        <Cta />
      </section>
    </main>
  );
}
