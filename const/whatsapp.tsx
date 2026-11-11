export const whatsappNumber = "6281371790122";

export function createWhatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function createOrderMessage(
  serviceName: string,
  title: string,
  subTitle?: string,
  price?: string,
): string {
  const packageName = [title, subTitle].filter(Boolean).join(" ");
  const pricePart = price ? ` - ${price}` : "";
  return `Halo, saya ingin memesan ${serviceName} ${packageName}${pricePart}. Mohon konfirmasi detail pesanan dan cara pembayaran.`;
}

export const whatsappLink = createWhatsappLink(
  "Halo KSM Katering, saya ingin bertanya.",
);
