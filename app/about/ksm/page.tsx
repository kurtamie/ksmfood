"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import pattern from "@/public/images/pattern.webp";
import SectionRoutes from "@/components/landing/services/prasmanan/sectionRoutes";
import { Button } from "@/components/ui/button";

export default function AboutKsmPage() {
  const t = useTranslations("aboutKsmPage");
  const strategyItems = t.raw("strategy.items") as string[];

  return (
    <main className="w-full overflow-x-clip">
      <section
        id="hero"
        className="scroll-mt-24 bg-[url('/images/about/hero.webp')] bg-cover bg-top shadow-[inset_0_0_0_2000px_rgba(30,30,30,0.72)]"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-16 text-center text-white sm:py-20 lg:min-h-140">
          <p className="text-3xl font-bold sm:text-4xl lg:text-6xl">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mt-14 max-w-6xl text-xl leading-tight sm:text-2xl lg:text-3xl">
            {t("hero.title")}
          </h1>
        </div>
      </section>

      <SectionRoutes />

      <section
        id="visi-misi"
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
            <h2 className="text-4xl font-bold text-[#8D0000] sm:text-5xl lg:text-[4rem]">
              {t("vision.titleLead")}
            </h2>
          </div>
          <div className="mt-22 mb-22 w-full max-w-7xl flex flex-col gap-12 items-stretch justify-center md:flex-row">
            <div className="bg-[#8D0000] w-full md:flex-1 flex flex-col gap-6 px-8 py-10 items-start text-white rounded-xl">
              <h2 className="font-bold text-3xl">{t("vision.visionTitle")}</h2>
              <p className="text-xl">{t("vision.visionDescription")}</p>
            </div>

            <div className="bg-[#8D0000] w-full md:flex-1 flex flex-col gap-6 px-8 py-10 items-start text-white rounded-xl">
              <h2 className="font-bold text-3xl">{t("vision.missionTitle")}</h2>
              <p className="text-xl">{t("vision.missionDescription")}</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-4 mt-34">
            <h2 className="text-4xl font-bold text-[#8D0000] sm:text-5xl lg:text-[4rem]">
              {t("strategy.titleLead")}
            </h2>
          </div>
          <div className="mt-22 w-full max-w-7xl">
            <div className="relative z-10 max-w-5xl text-left">
              <h3 className="text-2xl font-bold text-black sm:text-[2rem]">
                {t("strategy.subtitle")}
              </h3>
              <ul className="mt-6 space-y-4 pl-6 text-base leading-8 text-black marker:text-[#8D0000] sm:text-lg">
                {strategyItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        id="kontak"
        className="bg-[url('/images/testi.webp')] bg-cover bg-top shadow-[inset_0_0_0_2000px_rgba(141,0,0,0.84)]"
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 px-6 py-20 text-center text-white sm:gap-8 sm:py-24">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            {t("contactSection.title")}
          </h2>
          <p className="text-base text-white/90 sm:text-lg lg:text-xl">
            {t("contactSection.description")}
          </p>
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:gap-8">
            <Button
              asChild
              className="mt-2 h-12 w-full bg-white px-8 text-base text-red-800 sm:w-auto sm:text-lg"
            >
              <a
                href="https://wa.me/6281371790122?text=Halo%2C%20saya%20ingin%20memesan."
                target="_blank"
              >
                {t("contactSection.primaryCta")}
              </a>
            </Button>
            <Button
              asChild
              className="mt-2 h-12 w-full border-white bg-transparent px-8 text-base text-white sm:w-auto sm:text-lg"
            >
              <a
                href="https://wa.me/6282288175957?text=Halo%2C%20saya%20ingin%20konsultasi%20tentang%20pemesanan."
                target="_blank"
              >
                {t("contactSection.secondaryCta")}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
