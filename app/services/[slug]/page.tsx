import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getServiceBySlug, services } from "@/lib/services";
import ServiceDetailContent from "./ServiceDetailContent";

export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const service = getServiceBySlug(slug);
  if (!service) {
    notFound();
  }

  return <ServiceDetailContent slug={slug} />;
}

