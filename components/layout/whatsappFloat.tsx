"use client";

import { useState } from "react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { X } from "lucide-react";
import { whatsappLink } from "@/const/whatsapp";
import Logo from "@/public/ksm-logo.svg";
import Image from "next/image";

export default function WhatsappFloat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed right-4 bottom-4 z-60 flex items-end sm:right-6 sm:bottom-6">
      <div className="flex flex-col items-end gap-3">
        {isOpen ? (
          <div className="w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
            <div className="flex items-center gap-3 border-b border-black/5 px-4 py-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#a90000] text-sm font-bold text-white">
                <Image
                  src={Logo}
                  alt="wa-ksm"
                  className="object-contain"
                  width={20}
                />
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <p className="truncate text-sm font-semibold text-[#2f3443]">
                  KSM Katering
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-700"
                aria-label="Tutup popup WhatsApp"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4 px-4 py-4">
              <p className="text-[15px] leading-7 text-[#4c5567]">
                Halo! <span aria-hidden="true">{"\u{1F44B}"}</span> Bagaimana
                kami bisa membantu Anda hari ini?
              </p>

              <Link
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#c41212] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#a90f0f]"
              >
                Hubungi Sekarang
              </Link>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex size-16 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_18px_40px_rgba(37,211,102,0.35)] transition hover:scale-[1.03] hover:bg-[#20ba59]"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Tutup WhatsApp" : "Buka WhatsApp"}
        >
          <FaWhatsapp className="size-9" />
        </button>
      </div>
    </div>
  );
}
