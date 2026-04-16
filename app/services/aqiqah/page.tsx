import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import Menu from "@/components/landing/services/aqiqah/menu";
import Cta from "@/components/landing/services/aqiqah/cta";
import SectionRoutes from "@/components/landing/services/aqiqah/sectionRoutes";
import { CiGift } from "react-icons/ci";
import Bonus from "@/components/landing/services/aqiqah/bonus";

export default async function AqiqahPage() {
  const t = await getTranslations("aqiqahPage");

  return (
    <main className="w-full overflow-x-clip">
      <section
        id="hero"
        className="scroll-mt-24 bg-[url('/images/services/aqiqah/aqiq.webp')] bg-cover bg-center shadow-[inset_0_0_0_2000px_rgba(63,59,59,0.48)]"
      >
        <div className="mx-auto flex min-h-auto max-w-8xl flex-col items-center justify-center gap-10 px-6 py-16 text-center sm:gap-14 sm:py-20">
          <div className="w-full text-white">
            <p className="text-2xl font-bold leading-tight sm:text-3xl lg:text-6xl">
              {t("hero.eyebrow")}
            </p>
            <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:gap-4 lg:flex-row">
              <h1 className="max-w-3xl text-2xl leading-tight sm:text-3xl lg:text-4xl">
                Syar’i dan Praktis bersama KSM Katering
              </h1>
            </div>
          </div>

          <Button className="h-12 w-full max-w-xs cursor-pointer border border-white bg-transparent px-8 text-sm font-bold text-white hover:border-red-800 hover:bg-red-800 hover:text-white sm:w-auto">
            {t("hero.cta")}
          </Button>
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
                src="https://www.youtube.com/embed/6jclzvsBFp8?autoplay=1&mute=1&controls=0&loop=1"
              ></iframe>
            </div>
            <div className="flex flex-col gap-4 text-center lg:ml-6 lg:gap-6 lg:text-left">
              <h2 className="text-2xl font-bold leading-snug text-black sm:text-3xl">
                {t("about.titleLead")}
                <span className="text-red-800"> {t("about.titleAccent")}</span>
              </h2>
              <p className="text-sm leading-7 text-black sm:text-lg sm:leading-8">
                {t("about.paragraph1")}
              </p>
              <p className="text-sm leading-7 text-black sm:text-lg sm:leading-8">
                {t("about.paragraph2")}
              </p>
              <p className="text-sm leading-7 text-black sm:text-lg sm:leading-8">
                {t("about.paragraph3")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="menu"
        className="scroll-mt-24 flex w-full flex-col items-center px-4 py-16 sm:px-6 sm:py-20"
      >
        <Menu />
      </section>

      <section
        id="bonus"
        className="scroll-mt-24 flex w-full flex-col items-center px-4 py-16 sm:px-6 sm:py-20 gap-10"
      >
        <div className="flex gap-2 items-center px-6 py-2 bg-[#8D0000] text-white rounded-full justify-center">
          <CiGift className="text-2xl " />
          <h2>{t("bonus.badge")}</h2>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-4">
          <h2 className="text-3xl font-bold text-[#332929] sm:text-4xl lg:text-5xl">
            {t("bonus.titleLead")}
          </h2>
          <h2 className="text-3xl font-bold text-red-800 sm:text-4xl lg:text-5xl">
            {t("bonus.titleBrand")}
          </h2>
        </div>
        <Bonus />
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
