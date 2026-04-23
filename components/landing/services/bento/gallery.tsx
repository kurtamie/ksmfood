import Image from "next/image";
import { useTranslations } from "next-intl";
import bentoCtaPictOne from "@/public/images/services/bento/bento-cta_pict_one.webp";
import bentoCtaPictTwo from "@/public/images/services/bento/bento-cta_pict_two.webp";
import bentoCtaPictThree from "@/public/images/services/bento/bento-cta_pict_three.webp";
import pattern from "@/public/images/patternred.webp";

const galleryItems = [
  {
    image: bentoCtaPictOne,
    alt: "Paket bento KSM Katering",
    sizes: "(max-width: 639px) 100vw, (max-width: 1279px) 70vw, 36vw",
    imageClassName: "aspect-[1.02/1] h-full w-full object-cover",
    priority: true,
  },
  {
    image: bentoCtaPictTwo,
    alt: "Detail menu bento KSM Katering",
    sizes: "(max-width: 639px) 50vw, (max-width: 1279px) 34vw, 20vw",
    imageClassName: "aspect-[1.12/1] h-full w-full object-cover",
  },
  {
    image: bentoCtaPictThree,
    alt: "Kemasan bento premium KSM Katering",
    sizes: "(max-width: 639px) 50vw, (max-width: 1279px) 34vw, 20vw",
    imageClassName: "aspect-[1.12/1] h-full w-full object-cover",
  },
] as const;

export default function Gallery() {
  const t = useTranslations("bentoPage.gallerySection");

  return (
    <section id="galeri-bento" className="scroll-mt-24 py-6 sm:py-16">
      <div className="relative w-full overflow-hidden bg-[#A50000] text-white shadow-[0_24px_80px_rgba(91,0,0,0.28)]">
        <Image
          src={pattern}
          alt=""
          aria-hidden="true"
          className="absolute left-0 top-0 z-0 h-auto w-32 sm:w-40"
        />
        <Image
          src={pattern}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-120 z-0 h-auto w-32 sm:w-40"
        />

        <div className="relative z-10 grid gap-6 px-5 py-8 sm:px-8 sm:py-10 lg:gap-8 lg:px-10 lg:py-12 xl:grid-cols-12 xl:items-center">
          <div className="xl:col-span-4">
            <div className="mx-auto flex max-w-md items-center justify-center text-center xl:mx-0 xl:min-h-105 xl:justify-start xl:text-left">
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                {t("title")}
              </h2>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-5 xl:col-span-8 xl:grid-cols-8">
            <article className="relative overflow-hidden rounded-[22px] sm:rounded-[28px] xl:col-span-5">
              <Image
                src={galleryItems[0].image}
                alt={galleryItems[0].alt}
                sizes={galleryItems[0].sizes}
                priority={galleryItems[0].priority}
                className={galleryItems[0].imageClassName}
              />
            </article>

            <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:col-span-3 xl:grid-cols-1">
              {galleryItems.slice(1).map((item) => (
                <article
                  key={item.alt}
                  className="relative overflow-hidden rounded-[22px] sm:rounded-[28px]"
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    sizes={item.sizes}
                    className={item.imageClassName}
                  />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
