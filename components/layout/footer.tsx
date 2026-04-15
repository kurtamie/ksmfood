import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaYoutube, FaFacebookF, FaMapMarkerAlt, FaPhoneAlt, FaExternalLinkAlt } from "react-icons/fa";
import { HiMap } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] px-6 pb-8 pt-14 text-white md:px-12 lg:px-20">
      <div className="mx-auto max-w-8xl">
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">

          {/* Kolom 1: Brand + Alamat + Sosmed */}
          <div className="space-y-5 lg:col-span-1">
            <h2 className="text-lg font-bold leading-tight">
              PT Katering Sukses Mandiri
            </h2>

            {/* Logo */}
            <div className="w-fit rounded-lg bg-[#c0392b] p-3">
              <Image
                src="/ksm-logo.svg"
                alt="KSM Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>

            {/* Alamat */}
            <div className="flex items-start gap-3 text-sm text-gray-300">
              <FaMapMarkerAlt className="mt-0.5 shrink-0 text-gray-400" size={14} />
              <span className="leading-relaxed">
                Jl. S.Parman, Komp. Ruko Nusa Indah Blok M 16, Mangsang, Kec. Sei
                Beduk, Kota Batam, Kepulauan Riau 29433
              </span>
            </div>

            {/* Kontak */}
            <div className="space-y-1 text-sm text-gray-300">
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="shrink-0 text-gray-400" size={13} />
                <div>
                  <p className="font-medium text-white">Yuni</p>
                  <p>0813-7179-0122</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <FaPhoneAlt className="shrink-0 text-gray-400" size={13} />
                <div>
                  <p className="font-medium text-white">Sucipto</p>
                  <p>0852-6549-6567</p>
                </div>
              </div>
            </div>

            {/* Sosmed */}
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

          {/* Kolom 2: Layanan */}
          <div className="lg:col-span-1">
            <h2 className="mb-5 text-base font-bold">Layanan</h2>
            <ul className="space-y-3 text-sm text-gray-300">
              {[
                { label: "Prasmanan Pernikahan", href: "/#layanan" },
                { label: "Prasmanan", href: "/#layanan" },
                { label: "Nasi Kotak", href: "/#layanan" },
                { label: "Bento", href: "/#layanan" },
                { label: "Rendang Kemasan", href: "/#layanan" },
                { label: "Snack Kotak", href: "/#layanan" },
                { label: "Snack Tampah", href: "/#layanan" },
                { label: "Tumpeng", href: "/#layanan" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Galeri */}
          <div className="lg:col-span-1">
            <h2 className="mb-5 text-base font-bold">Galeri</h2>
            <ul className="space-y-3 text-sm text-gray-300">
              {[
                { label: "Acara", href: "/#galeri" },
                { label: "Menu", href: "/#galeri" },
                { label: "Snack", href: "/#galeri" },
                { label: "Video", href: "/#galeri" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4: Tentang KSM */}
          <div className="lg:col-span-1">
            <h2 className="mb-5 text-base font-bold">Tentang KSM</h2>
            <ul className="space-y-3 text-sm text-gray-300">
              {[
                { label: "Tentang KSM", href: "/#tentang" },
                { label: "Hubungi Kami", href: "/#kontak" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 5: Lokasi Kami */}
          <div className="lg:col-span-1">
            <h2 className="mb-5 text-base font-bold">Lokasi Kami</h2>
            <div className="space-y-3">
              {/* Map preview */}
              <div className="overflow-hidden rounded-lg border border-gray-700">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.0155!2d104.0!3d1.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMDYnMDAuMCJOIDEwNMKwMDAnMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890"
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

              {/* Tombol Google Maps */}
              <Link
                href="https://maps.google.com/?q=Jl+S+Parman+Komp+Ruko+Nusa+Indah+Blok+M+16+Mangsang+Batam"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-between rounded-lg border border-gray-600 px-4 py-3 text-sm text-gray-200 transition hover:border-gray-400 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <HiMap size={18} className="text-gray-400" />
                  <span>Buka di Google Maps</span>
                </div>
                <FaExternalLinkAlt size={12} className="text-gray-500" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-xs text-gray-500">
            Copyright © 2026 KSM Katering. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;