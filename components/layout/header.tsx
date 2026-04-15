"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/ksm-logo.svg";
import { FaChevronDown } from "react-icons/fa";
import { Button } from "../ui/button";
import { services } from "@/lib/services";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const navLinkClassName =
  "text-sm font-bold text-gray-700 transition-colors hover:text-gray-900";

const links = [
  { href: "/#hero", label: "Beranda" },
  { href: "/#portofolio", label: "Portofolio" },
  { href: "/#tentang", label: "Tentang Kami" },
  { href: "/#kontak", label: "Kontak" },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsServicesOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-2">
        <Link href="/" className="flex items-center" aria-label="KSM Katering">
          <Image
            src={logo}
            alt="KSM Katering"
            className="h-14 w-auto sm:h-16"
            priority
          />
        </Link>

        <nav className="hidden w-full max-w-2xl items-center justify-center gap-8 px-6 md:flex">
          <Link href="/" className={`${navLinkClassName} active:text-red-900`}>
            Beranda
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={`${navLinkClassName} flex items-center gap-2`}
              >
                Layanan <FaChevronDown className="size-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="start">
              <DropdownMenuGroup>
                {services.map((service) => (
                  <DropdownMenuItem key={service.slug} asChild>
                    <Link href={service.href}>{service.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/#portofolio" className={navLinkClassName}>
            Portofolio
          </Link>

          <Link href="/#tentang" className={navLinkClassName}>
            Tentang Kami
          </Link>

          <Link href="/#kontak" className={navLinkClassName}>
            Kontak
          </Link>
        </nav>

        <Button className="hidden cursor-pointer bg-[#8D0000] px-5 py-5 md:inline-flex">
          Hubungi Kami
        </Button>

        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-full border border-red-100 bg-red-50 text-[#8D0000] transition hover:bg-red-100 md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="relative h-5 w-5">
            <span
              className={`absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1.75 rounded-full bg-current transition duration-300 ${
                isMenuOpen ? "translate-y-0 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-0.5 w-5 rounded-full bg-current transition duration-300 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-0.5 w-5 translate-y-1.75 rounded-full bg-current transition duration-300 ${
                isMenuOpen ? "translate-y-0 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <div
        className={`md:hidden ${isMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          className={`absolute inset-x-0 top-full bg-black/20 transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          style={{ height: "calc(100dvh - 72px)" }}
          onClick={closeMenu}
        />
        <div
          id="mobile-navigation"
          className={`absolute inset-x-4 top-[calc(100%-0.25rem)] overflow-hidden rounded-[1.75rem] border border-red-100 bg-white shadow-xl transition-all duration-300 ${
            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-3 opacity-0"
          }`}
        >
          <nav className="flex flex-col p-4">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-2xl px-4 py-3 text-base font-semibold text-[#332929] transition hover:bg-red-50 hover:text-[#8D0000]"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-1 rounded-2xl border border-red-100 bg-red-50/60">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3 text-left text-base font-semibold text-[#332929]"
                aria-expanded={isServicesOpen}
                onClick={() => setIsServicesOpen((prev) => !prev)}
              >
                <span>Layanan</span>
                <FaChevronDown
                  className={`size-3 transition-transform duration-300 ${
                    isServicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ${
                  isServicesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col px-4 pb-4">
                    {services.map((service) => (
                      <Link
                        key={service.slug}
                        href={service.href}
                        className="rounded-xl px-3 py-2 text-sm text-gray-600 transition hover:bg-white hover:text-[#8D0000]"
                        onClick={closeMenu}
                      >
                        {service.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Button className="mt-4 h-12 rounded-2xl bg-[#8D0000] text-base">
              Hubungi Kami
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
