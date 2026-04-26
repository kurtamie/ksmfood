"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FaChevronDown } from "react-icons/fa";
import { aboutNavItems, galleryNavItems } from "@/lib/navigation";
import { services } from "@/lib/services";
import logo from "@/public/ksm-logo.svg";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import LanguageSwitcher from "./language-switcher";

const navLinkClassName =
  "text-sm font-bold text-gray-700 transition-colors hover:text-gray-900";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const t = useTranslations("header");
  const serviceT = useTranslations("services");
  const navT = useTranslations("navigation");
  const commonT = useTranslations("common");
  const links = [{ href: "/", label: t("home") }];

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsServicesOpen(false);
    setIsGalleryOpen(false);
    setIsAboutOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-60 w-full border-b border-black/5 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex min-h-(--header-height) w-full max-w-5xl items-center gap-4 px-4 py-2">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="KSM Katering"
        >
          <Image
            src={logo}
            alt="KSM Katering"
            className="h-14 w-auto sm:h-16"
            priority
          />
        </Link>

        <nav className="hidden w-full max-w-2xl items-center justify-center gap-8 px-4 md:flex">
          <Link href="/" className={`${navLinkClassName} active:text-red-900`}>
            {t("home")}
          </Link>

          <DropdownSection
            label={t("services")}
            items={services.map((service) => ({
              key: service.slug,
              href: service.href,
              label: serviceT(`items.${service.slug}.label`),
            }))}
          />

          <DropdownSection
            label={t("gallery")}
            items={galleryNavItems.map((item) => ({
              key: item.key,
              href: item.href,
              label: navT(`gallery.${item.labelKey}`),
            }))}
          />

          <DropdownSection
            label={t("about")}
            items={aboutNavItems.map((item) => ({
              key: item.key,
              href: item.href,
              label: navT(`about.${item.labelKey}`),
            }))}
          />
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <Button className="cursor-pointer bg-[#8D0000] px-5 py-5">
            <a
              href="https://wa.me/6281371790122?text=Halo%2C%20saya%20ingin%20memesan."
              target="_blank"
            >
              {commonT("orderNow")}
            </a>
          </Button>
        </div>

        <button
          type="button"
          className="ml-auto flex size-11 items-center justify-center rounded-full border border-red-100 bg-red-50 text-[#8D0000] transition hover:bg-red-100 md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
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
          style={{ height: "calc(100dvh - var(--header-height))" }}
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

            <MobileAccordion
              label={t("services")}
              isOpen={isServicesOpen}
              onToggle={() => setIsServicesOpen((prev) => !prev)}
              items={services.map((service) => ({
                key: service.slug,
                href: service.href,
                label: serviceT(`items.${service.slug}.label`),
              }))}
              onSelect={closeMenu}
            />

            <MobileAccordion
              label={t("gallery")}
              isOpen={isGalleryOpen}
              onToggle={() => setIsGalleryOpen((prev) => !prev)}
              items={galleryNavItems.map((item) => ({
                key: item.key,
                href: item.href,
                label: navT(`gallery.${item.labelKey}`),
              }))}
              onSelect={closeMenu}
            />

            <MobileAccordion
              label={t("about")}
              isOpen={isAboutOpen}
              onToggle={() => setIsAboutOpen((prev) => !prev)}
              items={aboutNavItems.map((item) => ({
                key: item.key,
                href: item.href,
                label: navT(`about.${item.labelKey}`),
              }))}
              onSelect={closeMenu}
            />

            <div className="mt-4">
              <LanguageSwitcher
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-base font-semibold text-[#8D0000] transition hover:bg-red-100"
                onSelect={closeMenu}
              />
            </div>

            <Button
              asChild
              className="mt-4 h-12 rounded-2xl bg-[#8D0000] text-base"
            >
              <a
                href="https://wa.me/6281371790122?text=Halo%2C%20saya%20ingin%20memesan."
                target="_blank"
              >
                {commonT("orderNow")}
              </a>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

type NavItem = {
  key: string;
  href: string;
  label: string;
};

function DropdownSection({
  label,
  items,
}: {
  label: string;
  items: NavItem[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`${navLinkClassName} flex items-center gap-2`}
        >
          {label} <FaChevronDown className="size-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="start">
        <DropdownMenuGroup>
          {items.map((item) => (
            <DropdownMenuItem key={item.key} asChild>
              <Link href={item.href}>{item.label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileAccordion({
  label,
  isOpen,
  onToggle,
  items,
  onSelect,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  items: NavItem[];
  onSelect: () => void;
}) {
  return (
    <div className="mt-1 rounded-2xl border border-red-100 bg-red-50/60">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-left text-base font-semibold text-[#332929]"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span>{label}</span>
        <FaChevronDown
          className={`size-3 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col px-4 pb-4">
            {items.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="rounded-xl px-3 py-2 text-sm text-gray-600 transition hover:bg-white hover:text-[#8D0000]"
                onClick={onSelect}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
