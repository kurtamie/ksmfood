import { getTranslations } from "next-intl/server";
import SectionPage from "@/components/shared/section-page";

export default async function AboutContactPage() {
  const t = await getTranslations("aboutPages.contact");
  const commonT = await getTranslations("sectionPage");

  return (
    <SectionPage
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      primaryHref="/#kontak"
      primaryLabel={commonT("primaryCta")}
      secondaryHref="/"
      secondaryLabel={commonT("secondaryCta")}
    />
  );
}
