"use client";

import { startTransition, useState } from "react";
import { useTranslations } from "next-intl";
import { useAppLocale } from "@/components/layout/locale-provider";
import { AppLocale, locales } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { GrLanguage } from "react-icons/gr";

type LanguageSwitcherProps = {
  className?: string;
  onSelect?: () => void;
};

function LanguageSwitcher({ className, onSelect }: LanguageSwitcherProps) {
  const { locale, setLocale } = useAppLocale();
  const t = useTranslations("languages");
  const [open, setOpen] = useState(false);

  const changeLocale = (nextLocale: string) => {
    const next = nextLocale as AppLocale;
    if (next === locale) {
      setOpen(false);
      onSelect?.();
      return;
    }

    setLocale(next);

    setOpen(false);
    onSelect?.();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={
            className ??
            "flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-[#8D0000] transition hover:bg-red-100"
          }
          aria-label={t("label")}
        >
          <GrLanguage className="size-4" />
          <span>{t(locale)}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuRadioGroup value={locale} onValueChange={changeLocale}>
          {locales.map((item) => (
            <DropdownMenuRadioItem key={item} value={item}>
              {t(item)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
