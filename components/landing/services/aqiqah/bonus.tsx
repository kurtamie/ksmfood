import Image from "next/image";
import { useTranslations } from "next-intl";
import ud1 from "@/public/images/services/aqiqah/ud1.webp";
import ud2 from "@/public/images/services/aqiqah/ud2.webp";
import ud3 from "@/public/images/services/aqiqah/ud3.webp";
import sertif from "@/public/images/services/aqiqah/sertif.webp";

const invitationPreviews = [
  {
    id: 1,
    src: ud1,
    alt: "Preview video undangan aqiqah desain bulan dan masjid",
  },
  {
    id: 2,
    src: ud2,
    alt: "Preview video undangan aqiqah desain islami dengan daun palem",
  },
  {
    id: 3,
    src: ud3,
    alt: "Preview video undangan aqiqah desain ilustrasi warna-warni",
  },
];

function Bonus() {
  const t = useTranslations("aqiqahBonus");

  return (
    <div className="w-full max-w-8xl flex flex-col gap-12">
      <div className="overflow-hidden rounded-[24px] border border-[#8D0000]/10 bg-[#FBE2E2] px-5 py-6 shadow-[0_18px_60px_rgba(141,0,0,0.08)] sm:rounded-[30px] sm:px-8 sm:py-8 lg:px-10 lg:py-5">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="flex max-w-2xl flex-col items-start justify-center gap-5 lg:gap-8">
            <div className="rounded-full bg-[#8D0000] px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
              Gratis
            </div>
            <h3 className="max-w-xl text-left text-3xl font-bold leading-tight text-[#8D0000] sm:text-4xl lg:text-[3.2rem] lg:leading-[1.2]">
              {t("invitationTitle")}
            </h3>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-190 lg:grid-cols-3">
            {invitationPreviews.map((preview, index) => (
              <div
                key={preview.id}
                className={`relative overflow-hidden rounded-[18px] border border-white/70 bg-white/40 shadow-[0_18px_40px_rgba(73,38,22,0.12)] ${
                  index === 3
                    ? "sm:col-span-2 sm:max-w-65 sm:justify-self-center lg:col-span-1 lg:max-w-none"
                    : ""
                }`}
              >
                <div className="relative aspect-9/16 w-full">
                  <Image
                    src={preview.src}
                    alt={preview.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-[#8D0000]/10 bg-[#FBE2E2] px-5 py-6 shadow-[0_18px_60px_rgba(141,0,0,0.08)] sm:rounded-[30px] sm:px-8 sm:py-8 lg:px-10 lg:py-5">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="flex max-w-2xl flex-col items-start justify-center gap-5 lg:gap-8">
            <div className="rounded-full bg-[#8D0000] px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
              Gratis
            </div>
            <h3 className="max-w-xl text-left text-3xl font-bold leading-tight text-[#8D0000] sm:text-4xl lg:text-[3.2rem] lg:leading-[1.2]">
              {t("certificateTitle")}
            </h3>
          </div>

          <div className="w-full lg:max-w-190">
            <div className="relative overflow-hidden rounded-[18px] border border-white/70 bg-white/40 shadow-[0_18px_40px_rgba(73,38,22,0.12)]">
              <div className="relative w-full">
                <Image src={sertif} alt="" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bonus;
