import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FaWhatsapp } from "react-icons/fa";
import { LuMessagesSquare } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import bentoImage from "@/public/images/services/bento/bento-cta_pict_one.webp";

function Cta() {
  const t = useTranslations("bentoCta");
  const commonT = useTranslations("common");

  return (
    <div className="w-full overflow-hidden rounded-[24px] bg-[#8D0000] text-white shadow-lg sm:rounded-[28px]">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="relative h-48 w-full overflow-hidden rounded-b-[32px] rounded-r-[32px] sm:h-56 sm:rounded-b-[48px] sm:rounded-r-[48px] lg:h-40 lg:w-90 lg:shrink-0 lg:rounded-b-[999px] lg:rounded-r-[999px]">
          <Image
            src={bentoImage}
            alt="Bento KSM Katering"
            fill
            sizes="(max-width: 1024px) 100vw, 360px"
            className="object-cover"
            preload
          />
        </div>

        <div className="flex flex-1 flex-col gap-6 px-5 py-6 sm:gap-8 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-10 lg:py-7">
          <div className="text-center lg:text-left">
            <h2 className="text-xl font-bold leading-tight sm:text-3xl lg:text-[2rem]">
              {t("title")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base">
              {t("description")}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <Button
              asChild
              className="h-12 w-full rounded-xl bg-white px-6 text-sm font-bold text-[#8D0000] hover:bg-white/90 sm:w-auto"
            >
              <Link
                href={t("orderLink")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="size-4" />
                {commonT("orderNowShort")}
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-12 w-full rounded-xl border-white/60 bg-transparent px-6 text-sm font-bold text-white hover:bg-white/10 hover:text-white sm:w-auto"
            >
              <Link
                href={t("consultLink")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LuMessagesSquare className="size-4" />
                {commonT("consultNow")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cta;
