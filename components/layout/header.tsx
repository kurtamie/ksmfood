"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useCart } from "@/components/CartContext";
import CartSidebar from "@/components/CartSideBar";
import AuthModal from "@/components/auth/AuthModal";
import LogoutConfirmDialog from "@/components/auth/logout-confirm-dialog";
import { useAuth } from "@/context/authContext";

const navLinkClassName =
  "text-sm font-bold text-gray-700 transition-colors hover:text-gray-900";

function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const t = useTranslations("header");
  const serviceT = useTranslations("services");
  const navT = useTranslations("navigation");
  const links = [{ href: "/", label: t("home") }];

  const { toggleCart, totalQuantity, clearCart } = useCart();
  const { isLoggedIn, user, logout, refreshSession } = useAuth();

  useEffect(() => {
    if (searchParams.get("auth") === "required") {
      setIsAuthOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  async function handleConfirmLogout() {
    setIsLoggingOut(true);
    try {
      clearCart();
      await logout();
      setLogoutOpen(false);
      closeMenu();
      router.push("/");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsServicesOpen(false);
    setIsGalleryOpen(false);
    setIsAboutOpen(false);
  };

  return (
    <>
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
            <Link
              href="/"
              className={`${navLinkClassName} active:text-red-900`}
            >
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

          {/* Desktop right side */}
          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher />

            <CartButton totalQuantity={totalQuantity} onClick={toggleCart} />

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center size-11 rounded-full border border-red-100 bg-red-50 text-[#8D0000] hover:bg-red-100 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  {/* blok 1: info user */}
                  <div className="px-3 py-2">
                    <p className="text-xs text-gray-500">Masuk sebagai</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.username}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      +{user?.phone_no}
                    </p>
                  </div>

                  <hr className="border-gray-200" />

                  {/* blok 2: akun & riwayat */}
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        Akun Saya
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        href="/pesanan"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        Riwayat Pemesanan
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <hr className="border-gray-200" />

                  {/* blok 3: keluar */}
                  <div className="border-t border-secondary-100">
                    <DropdownMenuItem
                      onClick={() => setLogoutOpen(true)}
                      className="flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    >
                      <span>Keluar</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => setIsAuthOpen(true)}
                className="cursor-pointer bg-[#8D0000] px-5 py-5"
              >
                Masuk
              </Button>
            )}
          </div>

          {/* Mobile right side */}
          <div className="ml-auto flex items-center gap-2 md:hidden">
            <CartButton totalQuantity={totalQuantity} onClick={toggleCart} />

            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-full border border-red-100 bg-red-50 text-[#8D0000] transition hover:bg-red-100"
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

              {isLoggedIn ? (
                <div className="mt-4 flex flex-col rounded-2xl border border-red-100 bg-red-50/60 overflow-hidden">
                  {/* Info user */}
                  <div className="px-4 py-3 border-b border-red-100">
                    <p className="text-xs text-secondary-500">Masuk sebagai</p>
                    <p className="text-sm font-semibold text-tertiary-900">
                      {user?.username}
                    </p>
                    <p className="text-xs text-secondary-500">
                      +{user?.phone_no}
                    </p>
                  </div>

                  <Link
                    href="/profile/account"
                    onClick={closeMenu}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[#332929] hover:bg-red-100 transition-colors"
                  >
                    Akun Saya
                  </Link>

                  <Link
                    href="/pesanan"
                    onClick={closeMenu}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[#332929] hover:bg-red-100 transition-colors"
                  >
                    Riwayat Pemesanan
                  </Link>

                  <button
                    onClick={() => {
                      setLogoutOpen(true);
                      closeMenu();
                    }}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors border-t border-red-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Keluar
                  </button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setIsAuthOpen(true);
                    closeMenu();
                  }}
                  className="mt-4 h-12 rounded-2xl bg-[#8D0000] text-base"
                >
                  Masuk
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <CartSidebar />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          void refreshSession();
          const redirect = searchParams.get("redirect");
          if (redirect?.startsWith("/")) {
            router.push(redirect);
          }
        }}
      />

      <LogoutConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={() => void handleConfirmLogout()}
        isLoading={isLoggingOut}
      />
    </>
  );
}

// ─── Cart Button ──────────────────────────────────────────────────────────────

function CartButton({
  totalQuantity,
  onClick,
}: {
  totalQuantity: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Buka keranjang, ${totalQuantity} pesanan`}
      className="relative flex size-11 items-center justify-center rounded-full border border-red-100 bg-red-50 text-[#8D0000] transition hover:bg-red-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>

      {totalQuantity > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8D0000] px-1 text-[10px] font-bold text-white">
          {totalQuantity > 99 ? "99+" : totalQuantity}
        </span>
      )}
    </button>
  );
}

// ─── Dropdown Section ─────────────────────────────────────────────────────────

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

// ─── Mobile Accordion ─────────────────────────────────────────────────────────

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
