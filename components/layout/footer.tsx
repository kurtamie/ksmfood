import Image from "next/image";
import Link from "next/link";
import {
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#1e1e1e] px-6 pb-8 pt-16 text-white md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="space-y-6">
            <div className="w-fit rounded-full bg-[#ff1e1e] p-4">
              <Image src="/ksm-logo.svg" alt="KSM Logo" width={100} height={50} />
            </div>
            <p className="max-w-xs leading-relaxed text-gray-300">
              KSM Katering merupakan penyedia layanan katering yang berkomitmen
              menghadirkan hidangan berkualitas untuk berbagai kebutuhan acara.
            </p>
            <div className="flex gap-4">
              <Link
                href="/#kontak"
                aria-label="Instagram KSM Katering"
                className="rounded-full border border-white p-2 transition hover:bg-white hover:text-black"
              >
                <FaInstagram size={20} />
              </Link>
              <Link
                href="/#portofolio"
                aria-label="YouTube KSM Katering"
                className="rounded-full border border-white p-2 transition hover:bg-white hover:text-black"
              >
                <FaYoutube size={20} />
              </Link>
            </div>
          </div>

          <div className="lg:pl-10">
            <h2 className="mb-6 text-xl font-bold">Tautan</h2>
            <ul className="space-y-4 text-gray-300">
              <li>
                <Link href="/#tentang" className="transition hover:text-white">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/#portofolio"
                  className="transition hover:text-white"
                >
                  Portofolio
                </Link>
              </li>
              <li>
                <Link href="/#kontak" className="transition hover:text-white">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-6 text-xl font-bold">Bantuan</h2>
            <ul className="space-y-4 text-gray-300">
              <li>
                <Link href="/#kontak" className="transition hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="transition hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/#layanan" className="transition hover:text-white">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          <address className="not-italic">
            <h2 className="mb-6 text-xl font-bold">Informasi Kontak</h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex gap-4">
                <FaMapMarkerAlt className="mt-1 shrink-0" />
                <span>
                  BIP, Batamindo Industry Park, Shophouse Blok D1 No.19, Muka
                  Kuning, Sei Beduk, Batam, Kepulauan Riau 29433
                </span>
              </li>
              <li className="flex items-center gap-4">
                <FaPhoneAlt className="shrink-0" />
                <span>0823-9237-4002</span>
              </li>
            </ul>
          </address>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-sm text-gray-400">
            Copyright © 2026 KSM Katering. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
