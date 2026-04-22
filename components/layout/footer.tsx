import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  FaInstagram,
  FaYoutube,
  FaFacebookF,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { HiMap } from "react-icons/hi";
import { aboutNavItems, galleryNavItems } from "@/lib/navigation";

const Footer = () => {
  const t = useTranslations("footer");
  const navT = useTranslations("navigation");
  const serviceLinks = t.raw("serviceLinks") as string[];

  return (
    <footer className="bg-[#1a1a1a] px-6 pb-8 pt-14 text-white md:px-12 lg:px-20">
      <div className="mx-auto max-w-8xl">
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          <div className="space-y-5 lg:col-span-1">
            <h2 className="text-lg font-bold leading-tight">{t("company")}</h2>

            <div className="w-fit">
              <Image
                src="/logo-pt.png"
                alt="KSM Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>

            <div className="flex items-start gap-3 text-sm text-gray-300">
              <FaMapMarkerAlt
                className="mt-0.5 shrink-0 text-gray-400"
                size={14}
              />
              <span className="leading-relaxed">
                Jl. S.Parman, Komp. Ruko Nusa Indah Blok M 16, Mangsang, Kec.
                Sei Beduk, Kota Batam, Kepulauan Riau 29433
              </span>
            </div>

            <div className="space-y-1 text-sm text-gray-300">
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="shrink-0 text-gray-400" size={13} />
                <div>
                  <p className="font-medium text-white">Yuni</p>
                  <a
                    href="https://wa.me/6281371790122"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    0813-7179-0122
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <FaPhoneAlt className="shrink-0 text-gray-400" size={13} />
                <div>
                  <p className="font-medium text-white">Sucipto</p>
                  <a
                    href="https://wa.me/6285265496567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    0852-6549-6567
                  </a>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Link
                href="https://youtube.com"
                aria-label="YouTube KSM Katering"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-600 p-2 text-gray-300 transition hover:border-white hover:text-white"
              >
                <FaYoutube size={16} />
              </Link>
              <Link
                href="https://instagram.com"
                aria-label="Instagram KSM Katering"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-600 p-2 text-gray-300 transition hover:border-white hover:text-white"
              >
                <FaInstagram size={16} />
              </Link>
              <Link
                href="https://facebook.com"
                aria-label="Facebook KSM Katering"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-600 p-2 text-gray-300 transition hover:border-white hover:text-white"
              >
                <FaFacebookF size={16} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h2 className="mb-5 text-base font-bold">{t("servicesTitle")}</h2>
            <ul className="space-y-3 text-sm text-gray-300">
              {serviceLinks.map((item) => (
                <li key={item}>
                  <Link
                    href="/#layanan"
                    className="transition hover:text-white"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h2 className="mb-5 text-base font-bold">{t("galleryTitle")}</h2>
            <ul className="space-y-3 text-sm text-gray-300">
              {galleryNavItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="transition hover:text-white"
                  >
                    {navT(`gallery.${item.labelKey}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h2 className="mb-5 text-base font-bold">{t("aboutTitle")}</h2>
            <ul className="space-y-3 text-sm text-gray-300">
              {aboutNavItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="transition hover:text-white"
                  >
                    {navT(`about.${item.labelKey}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h2 className="mb-5 text-base font-bold">{t("locationTitle")}</h2>
            <div className="space-y-3">
              <div className="overflow-hidden rounded-lg border border-gray-700">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3111.3322120880466!2d104.04687607363678!3d1.0457173624807141!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMcKwMDInNDQuNiJOIDEwNMKwMDInNTguMCJF!5e1!3m2!1sen!2sid!4v1776857581596!5m2!1sen!2sid"
                  width="100%"
                  height="130"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi KSM Katering"
                  className="grayscale"
                />
              </div>

              <Link
                href="https://maps.app.goo.gl/5BYfT71ckEsFpLKPA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-between rounded-lg border border-gray-600 px-4 py-3 text-sm text-gray-200 transition hover:border-gray-400 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <HiMap size={18} className="text-gray-400" />
                  <span>{t("openMaps")}</span>
                </div>
                <FaExternalLinkAlt size={12} className="text-gray-500" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-xs text-gray-500">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
