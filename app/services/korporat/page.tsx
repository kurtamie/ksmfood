import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import Menu from "@/components/landing/services/korporat/menu";
import Image from "next/image";
import Cta from "@/components/landing/services/korporat/cta";
import SectionRoutes from "@/components/landing/services/korporat/sectionRoutes";
import Testimonial from "@/components/landing/services/korporat/testimonial";
import korporatSec from "@/public/images/services/korporat/katering_korporat-hero_section.webp";

export default async function KorporatPage() {
  const t = await getTranslations("korporatPage");

  return (
    <main className="w-full overflow-x-clip">
      <section
        id="hero"
        className="scroll-mt-24 bg-[url('/images/services/korporat/katering_korporat-header.webp')] bg-cover bg-center shadow-[inset_0_0_0_2000px_rgba(63,59,59,0.48)]"
      >
        <div className="mx-auto flex min-h-auto max-w-8xl flex-col items-center justify-center gap-10 px-6 py-16 text-center sm:gap-14 sm:py-20">
          <div className="w-full text-white">
            <p className="text-2xl font-bold leading-tight sm:text-3xl lg:text-6xl">
              {t("hero.eyebrow")}
            </p>
            <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:gap-4 lg:flex-row">
              <h1 className="max-w-3xl text-2xl leading-tight sm:text-3xl lg:text-4xl">
                {t("hero.title")}
              </h1>
            </div>
          </div>

          {/* <Button
            asChild
            className="h-12 w-full max-w-xs cursor-pointer border border-white bg-transparent px-8 text-sm font-bold text-white hover:border-red-800 hover:bg-red-800 hover:text-white sm:w-auto"
          >
            <a href="/images/pdf/snackkot.pdf" download>
              {t("hero.cta")}
            </a>
          </Button> */}
        </div>
      </section>

      <SectionRoutes />

      <section
        id="tentang"
        className="scroll-mt-24 flex items-center justify-center bg-white py-12"
      >
        <div className="flex w-full max-w-7xl flex-col items-center gap-10 px-4 sm:px-6 lg:gap-10">
          <div className="mt-6 flex flex-col gap-6 lg:mt-10 lg:flex-row">
            <div className="w-full lg:w-4/5">
              <Image
                src={korporatSec}
                alt="Korporat Section"
                className="aspect-square w-full rounded-2xl object-cover"
              />
            </div>
            <div className="flex flex-col gap-4 text-center lg:ml-6 lg:gap-6 lg:text-left">
              <h2 className="text-2xl font-bold leading-snug text-black sm:text-3xl">
                {t("about.titleHighlight")}
              </h2>
              <p className="text-sm leading-7 text-black sm:text-lg sm:leading-8">
                {t("about.paragraph1")}
              </p>
              <p className="text-sm leading-7 text-black sm:text-lg sm:leading-8">
                {t("about.paragraph2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="layanan"
        className="scroll-mt-24 flex w-full flex-col items-center px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-4">
          <h2 className="text-3xl font-bold text-[#332929] sm:text-4xl lg:text-5xl">
            {t("packages.titleLead")}
          </h2>
          <h2 className="text-3xl font-bold text-red-800 sm:text-4xl lg:text-5xl">
            {t("packages.titleBrand")}
          </h2>
        </div>
        <Menu />
      </section>

      <section id="testimonial" className="mt-12 scroll-mt-24">
        <Testimonial />
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
