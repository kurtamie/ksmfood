import { getTranslations } from "next-intl/server";
import Image from "next/image";
import pattern from "@/public/images/pattern.webp";
import Menu from "@/components/landing/services/prasmanan/menu";
import MenuServices from "@/components/landing/services/prasmanan/menuServices";
import Cta from "@/components/landing/services/prasmanan/cta";
import SectionRoutes from "@/components/landing/services/prasmanan/sectionRoutes";
import OrderingInfo from "@/components/landing/services/prasmanan/orderingInfo";
import prasmananImage from "@/public/images/services/prasmanan/prasmanan.webp";

export default async function PrasmananPage() {
  const t = await getTranslations("prasmananPage");

  return (
    <main className="w-full overflow-x-clip bg-white text-[#332929]">
      <section
        id="hero"
        className="scroll-mt-24 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(30,19,14,0.55), rgba(30,19,14,0.52)), url('/images/services/prasmanan/prasmanan.webp')",
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-16 text-center text-white sm:py-20 lg:min-h-[560px]">
          <p className="text-3xl font-bold sm:text-4xl lg:text-6xl">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mt-4 max-w-4xl text-xl leading-tight sm:text-3xl lg:text-4xl">
            {t("hero.title")}
          </h1>

          <a
            href="/images/pdf/prasmanan.pdf"
            download
            className="mt-10 inline-flex h-12 items-center justify-center rounded-lg border border-white px-8 text-sm font-bold text-white transition hover:border-[#8D0000] hover:bg-[#8D0000]"
          >
            {t("hero.cta")}
          </a>
        </div>
      </section>

      <SectionRoutes />

      <section
        id="tentang"
        className="scroll-mt-20 flex items-center justify-center bg-white px-4 py-16 sm:px-6 lg:py-20"
      >
        <div className="grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.02fr_1fr] lg:gap-12">
          <div className="relative overflow-hidden rounded-[26px] shadow-[0_28px_70px_-34px_rgba(29,28,30,0.35)]">
            <div className="relative aspect-[16/10]">
              <Image
                src={prasmananImage}
                alt="Pilihan hidangan prasmanan KSM Katering"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold leading-tight text-[#332929] sm:text-4xl lg:text-[3rem]">
              {t("about.titleLead")}{" "}
              <span className="text-[#8D0000]">{t("about.titleAccent")}</span>
            </h2>
            <p className="mt-6 text-base leading-8 text-[#4C4040] sm:text-lg">
              {t("about.paragraph1")}
            </p>
            <p className="mt-5 text-base leading-8 text-[#4C4040] sm:text-lg">
              {t("about.paragraph2")}
            </p>
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

      <section
        id="hubungi-kami"
        className="mt-6 mb-10 flex items-center justify-center px-4 scroll-mt-20 sm:px-8"
      >
        <div className="w-full max-w-7xl">
          <Cta />
        </div>
      </section>
    </main>
  );
}
