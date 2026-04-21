import Link from "next/link";
import { useTranslations } from "next-intl";

function SectionRoutes() {
  const t = useTranslations("sectionRoutes");
  const sectionLinks = t.raw("aqiqah") as Array<{
    href: string;
    label: string;
  }>;

  return (
    <section className="sticky top-[var(--header-height)] z-30 border-b border-black/5 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sectionLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            scroll
            className="shrink-0 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-[#8D0000] transition hover:bg-red-100"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default SectionRoutes;
