import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { FaInstagram } from "react-icons/fa";
import { FiYoutube } from "react-icons/fi";
import CarouselMoment from "@/components/landing/carouselMoment";
import Client from "@/components/landing/client";
import Faq from "@/components/landing/faq";
import Legal from "@/components/landing/legal";
import Menu from "@/components/landing/menu";
import Testimonial from "@/components/landing/testimonial";
import WhyChoose from "@/components/landing/whyChoose";
import RotatingText from "@/components/motion/rotatingText";
import { Button } from "@/components/ui/button";
import pattern from "@/public/images/pattern.webp";
import { whatsappLink } from "@/const/whatsapp";
import profile from "@/public/images/about.webp";

export default async function Page() {
  const t = await getTranslations("home");
  const heroWords = t.raw("hero.words") as string[];

  return (
    <main className="w-full overflow-x-clip">
      <section
        id="hero"
        className="min-h-[calc(100dvh-4.5rem)] bg-[url('/images/bg-hero.webp')] bg-cover bg-top shadow-[inset_0_0_0_2000px_rgba(63,59,59,0.48)]"
      >
        <div className="mx-auto flex min-h-[calc(100dvh-4.5rem)] max-w-8xl flex-col items-center justify-center gap-10 px-6 py-16 text-center sm:gap-14 sm:py-20">
          <div className="w-full text-white">
            <p className="text-2xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              KSM Katering
            </p>
            <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:gap-4 lg:flex-row">
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                {t("hero.title")}
              </h1>
              <RotatingText
                texts={heroWords}
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
              {t("hero.tagline")}
            </p>
          </div>

          <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="h-12 cursor-pointer border flex items-center justify-center border-white bg-transparent px-8 text-sm font-bold text-white hover:border-red-800 hover:bg-red-800 hover:text-white"
            >
              {t("hero.secondaryCta")}
            </Link>
          </div>
        </div>
      </section>

      <section
        id="tentang"
        className="flex items-center justify-center bg-white py-16"
      >
        <div className="flex w-full max-w-7xl flex-col items-center gap-10 px-6 lg:gap-12">
          <div className="flex gap-4 text-3xl font-bold sm:text-4xl lg:text-5xl text-center">
            <h1 className="text-black">
              {t("about.titleLead")}{" "}
              <span className="text-[#8D0000]">{t("about.titleBrand")}</span>
            </h1>
          </div>
          <div className="mt-10 flex flex-col gap-10 lg:flex-row items-center">
            <div className="w-full">
              <Image
                src={profile}
                alt="Profile Section"
                className="aspect-square w-full rounded-2xl object-cover"
              />
            </div>
            <div className="flex flex-col gap-6 text-center lg:ml-6 lg:text-left">
              <p className="text-base leading-8 text-black sm:text-lg">
                {t("about.paragraph1")}
              </p>
              <p className="text-base leading-8 text-black sm:text-lg">
                {t("about.paragraph2")}
              </p>
              <p className="text-base leading-8 text-black sm:text-lg">
                {t("about.paragraph3")}
              </p>
              <div className="flex justify-center gap-4 lg:justify-start">
                <Link
                  href="https://www.instagram.com/ksmcateringbatam/"
                  aria-label="Instagram KSM Katering"
                  className="rounded-full border border-[#8D0000] p-2 text-xl text-[#8D0000] transition hover:bg-[#8D0000] hover:text-white"
                >
                  <FaInstagram />
                </Link>
                <Link
                  href="https://www.youtube.com/@ksmkateringbatam2463"
                  aria-label="YouTube KSM Katering"
                  className="rounded-full border border-[#8D0000] p-2 text-xl text-[#8D0000] transition hover:bg-[#8D0000] hover:text-white"
                >
                  <FiYoutube />
                </Link>
              </div>
              <Button className="mt-2 h-12 w-full cursor-pointer border border-[#8D0000] bg-transparent text-[#8D0000] hover:bg-[#8D0000] hover:text-white sm:w-48">
                {t("about.cta")}
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
            {t("servicesSection.titleLead")}
          </h2>
          <h2 className="text-3xl font-bold text-red-800 sm:text-4xl lg:text-5xl">
            {t("servicesSection.titleBrand")}
          </h2>
        </div>
        <Menu />
      </section>

      <section className="relative isolate flex w-full justify-center py-8 sm:py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        >
          <Image
            src={pattern}
            alt=""
            className="absolute left-0 top-0 h-auto w-24 opacity-80 sm:w-32 lg:w-40"
          />
          <Image
            src={pattern}
            alt=""
            className="absolute bottom-0 right-0 h-auto w-24 opacity-80 sm:w-32 lg:w-40"
          />
        </div>
        <div className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-center px-6">
          <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-4">
            <h2 className="text-3xl font-bold text-[#332929] sm:text-4xl lg:text-5xl">
              {t("whyChooseSection.titleLead")}
            </h2>
            <h2 className="text-3xl font-bold text-red-800 sm:text-4xl lg:text-5xl">
              {t("whyChooseSection.titleBrand")}
            </h2>
          </div>
          <WhyChoose />
        </div>
      </section>

      <section
        id="klien"
        className="flex w-full flex-col items-center px-6 py-16 sm:py-20"
      >
        <h2 className="text-center text-3xl font-bold text-[#332929] sm:text-4xl lg:text-5xl">
          {t("clientsSection.title")}
        </h2>
        <Client />
      </section>

      <section className="bg-[url('/images/testi.webp')] bg-cover bg-top shadow-[inset_0_0_0_2000px_rgba(255,255,255,0.72)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 py-16 text-center sm:gap-14 sm:py-24">
          <div className="w-full text-[#332929]">
            <h2 className="text-center text-3xl font-bold text-[#332929] sm:text-4xl lg:text-5xl">
              {t("testimonialsSection.title")}
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
          {t("faqSection.title")}
        </h2>
        <Faq />
      </section>

      <section className="flex w-full flex-col items-center px-6 py-16 sm:py-20">
        <h2 className="text-center text-3xl font-bold text-[#332929] sm:text-4xl lg:text-5xl">
          {t("legalSection.title")}
        </h2>
        <Legal />
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
              className="mt-2 h-12 w-full bg-white px-8 text-base text-red-800 sm:w-auto sm:text-lg hover:bg-red-800 hover:text-white"
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
