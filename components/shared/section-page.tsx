import Link from "next/link";
import { Button } from "@/components/ui/button";

type SectionPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

export default function SectionPage({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: SectionPageProps) {
  return (
    <main className="min-h-[calc(100dvh-9rem)] bg-[linear-gradient(180deg,#fff7f7_0%,#ffffff_45%,#fff1f1_100%)]">
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-20 text-center sm:py-24">
        <span className="rounded-full border border-red-200 bg-red-50 px-4 py-1 text-sm font-semibold text-[#8D0000]">
          {eyebrow}
        </span>
        <h1 className="mt-6 max-w-3xl text-4xl font-bold text-[#332929] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[#5b4b4b] sm:text-lg">
          {description}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="h-12 bg-[#8D0000] px-7 text-base">
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 border-[#8D0000] px-7 text-base text-[#8D0000]"
          >
            <Link href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
