export const whatsappNumber = "6281371790122";

export function createWhatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const whatsappLink = createWhatsappLink(
  "Halo KSM Katering, saya ingin bertanya.",
);
