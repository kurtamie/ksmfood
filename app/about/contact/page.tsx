import { getTranslations } from "next-intl/server";
import Image from "next/image";
import {
  FaClock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import pattern from "@/public/images/pattern.webp";
import { LuPackageOpen } from "react-icons/lu";

const MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3111.3322120880466!2d104.04687607363678!3d1.0457173624807141!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMcKwMDInNDQuNiJOIDEwNMKwMDInNTguMCJF!5e1!3m2!1sen!2sid!4v1776857581596!5m2!1sen!2sid";

const contacts = [
  {
    name: "Admin 1",
    role: "Admin KSM Katering",
    phoneLabel: "0813-7179-0122",
    phoneHref: "https://wa.me/6281371790122",
    emailLabel: "ksmpromotionbatam@gmail.com",
    emailHref: "mailto:ksmpromotionbatam@gmail.com",
  },
  {
    name: "Admin 2",
    role: "Admin KSM Katering",
    phoneLabel: "0822-8817-5957",
    phoneHref: "https://wa.me/6282288175957",
    emailLabel: "-",
    emailHref: undefined,
  },
] as const satisfies ReadonlyArray<{
  name: string;
  role: string;
  phoneLabel: string;
  phoneHref: string;
  emailLabel: string;
  emailHref?: string;
}>;

export default async function ContactPage() {
  const t = await getTranslations("contactPage");

  return (
    <main className="w-full overflow-x-clip">
      <section
        id="hero"
        className="scroll-mt-24 bg-[url('/images/about/hero-contact.webp')] bg-cover bg-center shadow-[inset_0_0_0_2000px_rgba(30,30,30,0.72)]"
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
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:gap-16">
            <div className="flex flex-col gap-6 items-center justify-center">
              <h2 className="text-center text-4xl font-bold text-[#1A1A1A] sm:text-5xl lg:text-[4rem]">
                Tim Kami Siap{" "}
                <span className="text-[#8D0000]">Membantu Anda</span>
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 sm:gap-8 max-w-5xl mt-14">
                {contacts.map((contact) => (
                  <article
                    key={contact.name}
                    className="rounded-2xl border border-[#E9DCDC] bg-white p-5 shadow-[0_12px_32px_rgba(141,0,0,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(141,0,0,0.12)]"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex items-center justify-center rounded-full bg-[#8D0000]/10 p-3">
                        <LuPackageOpen className="text-3xl text-red-800" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold uppercase tracking-[0.08em] text-[#1A1A1A]">
                          {contact.name}
                        </h3>
                        <p className="text-sm font-medium text-[#C43A3A]">
                          {contact.role}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 text-red-800 pt-4 text-sm sm:text-[15px]">
                      <a
                        href={contact.phoneHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 transition hover:text-[#8D0000]"
                      >
                        <FaPhoneAlt className="mt-0.5 shrink-0" size={13} />
                        <span className="break-all font-medium">
                          {contact.phoneLabel}
                        </span>
                      </a>

                      {contact.emailHref ? (
                        <a
                          href={contact.emailHref}
                          className="flex items-start gap-3 transition hover:text-[#8D0000]"
                        >
                          <FaEnvelope className="mt-0.5 shrink-0" size={13} />
                          <span className="break-all font-medium">
                            {contact.emailLabel}
                          </span>
                        </a>
                      ) : (
                        <div className="flex items-start gap-3 text-red-800">
                          <FaEnvelope className="mt-0.5 shrink-0" size={13} />
                          <span className="font-medium">
                            {contact.emailLabel}
                          </span>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h2 className="text-center text-4xl font-bold text-[#1A1A1A] sm:text-5xl lg:text-[4rem]">
                Lokasi <span className="text-[#8D0000]">Kami</span>
              </h2>

              <div className="grid items-stretch gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-5 mt-14">
                <div className="overflow-hidden rounded-2xl border border-[#E9DCDC] bg-white shadow-[0_12px_32px_rgba(141,0,0,0.08)]">
                  <iframe
                    src={MAPS_EMBED_URL}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi KSM Katering"
                    className="min-h-80 w-full"
                  />
                </div>

                <article className="flex h-full flex-col rounded-2xl border border-[#E9DCDC] bg-white p-6 shadow-[0_12px_32px_rgba(141,0,0,0.08)] sm:p-8 justify-center">
                  <h3 className="text-xl font-bold uppercase tracking-[0.08em] text-[#1A1A1A]">
                    PT Katering Sukses Mandiri
                  </h3>

                  <div className="mt-5 gap-6 space-y-4 pt-5 text-sm text-[#4B4B4B] sm:text-[15px]">
                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt
                        className="mt-0.5 shrink-0 text-[#8D0000]"
                        size={18}
                      />
                      <p className="leading-relaxed text-[#8D0000]">
                        Jl. S.Parman, Komp. Ruko Nusa Indah Blok M 16, Mangsang,
                        Kec. Sei Beduk, Kota Batam, Kepulauan Riau 29433
                      </p>
                    </div>

                    <div className="w-full bg-[#F1E2E2] h-0.5"></div>

                    <div className="flex items-center gap-3">
                      <FaClock
                        className="mt-0.5 shrink-0 text-[#8D0000]"
                        size={18}
                      />
                      <p className="leading-relaxed text-[#8D0000]">
                        <span className="font-bold text-[#1A1A1A]">
                          Jam Operasional:
                        </span>
                        <br />
                        Senin - Minggu, 08.00 - 17.00
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
