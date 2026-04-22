export const services = [
  {
    slug: "prasmanan-pernikahan",
    label: "Prasmanan Pernikahan",
    href: "/services/wedding",
    description:
      "Sajian prasmanan lengkap untuk acara keluarga, gathering, dan kebutuhan katering skala besar.",
  },
  {
    slug: "nasi-kotak",
    label: "Nasi Kotak",
    href: "/services/nasi-kotak",
    description:
      "Paket nasi kotak untuk rapat, acara kantor, sekolah, dan berbagai kebutuhan harian maupun event khusus.",
  },
  {
    slug: "prasmanan",
    label: "Prasmanan",
    href: "/services/prasmanan",
    description:
      "Sajian prasmanan lengkap untuk acara keluarga, gathering, dan kebutuhan katering skala besar.",
  },
  {
    slug: "aqiqah",
    label: "Aqiqah",
    href: "/services/aqiqah",
    description:
      "Layanan aqiqah praktis dengan menu yang terjaga kualitas rasa, kebersihan, dan kehalalannya.",
  },
  {
    slug: "bento",
    label: "Bento",
    href: "/services/bento",
    description:
      "Sajian prasmanan lengkap untuk acara keluarga, gathering, dan kebutuhan katering skala besar.",
  },
  {
    slug: "rendang-kemasan",
    label: "Rendang Kemasan",
    href: "/services/rendang-kemasan",
    description:
      "Sajian prasmanan lengkap untuk acara keluarga, gathering, dan kebutuhan katering skala besar.",
  },
  {
    slug: "snack-kotak",
    label: "Snack Kotak",
    href: "/services/snack-kotak",
    description:
      "Pilihan snack kotak untuk meeting, seminar, pelatihan, dan acara formal maupun informal.",
  },
  {
    slug: "tumpeng",
    label: "Tumpeng",
    href: "/services/tumpeng",
    description:
      "Layanan katering pernikahan dengan menu prasmanan dan dukungan kebutuhan jamuan tamu acara spesial Anda.",
  },
  {
    slug: "katering-korporat",
    label: "Katering Korporat",
    href: "/services/katering-korporat",
    description:
      "Solusi katering korporat untuk perusahaan, instansi, dan kebutuhan operasional dengan standar layanan profesional.",
  },
] as const;

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
