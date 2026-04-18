import { getTranslations } from "next-intl/server";
import SectionPage from "@/components/shared/section-page";

export default async function AboutKsmPage() {
  const t = await getTranslations("aboutPages.ksm");
  const commonT = await getTranslations("sectionPage");

  return (
    <SectionPage
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      primaryHref="/about/contact"
      primaryLabel={commonT("primaryCta")}
      secondaryHref="/"
      secondaryLabel={commonT("secondaryCta")}
    />
  );
}
