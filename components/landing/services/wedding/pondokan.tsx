"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LuX } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { useCart, type CartItem } from "@/components/CartContext";
import CartConfirmModal from "@/components/CartConfirmModal";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/context/authContext";
import { createCheckoutOrder } from "@/lib/client-checkout";
import batagor from "@/public/images/services/wedding/snack_pondokan_batagor.webp";
import pempek from "@/public/images/services/wedding/snack_pondokan-pempek_palembang.webp";
import siomay from "@/public/images/services/wedding/snack_pondokan-siomay.webp";
import bakso from "@/public/images/services/wedding/snack_pondokan-bakso.webp";
import soto from "@/public/images/services/wedding/snack_pondokan-soto.webp";
import sate from "@/public/images/services/wedding/snack_pondokan-sate_ayam_lontong.webp";
import dimsum from "@/public/images/services/wedding/snack_pondokan-dimsum.webp";
import surabi from "@/public/images/services/wedding/snack_pondokan-surabi.webp";
import srikaya from "@/public/images/services/wedding/snack_pondokan-ketan_sarikaya.webp";
import durian from "@/public/images/services/wedding/snack_pondokan-ketan_durian.webp";
import sumsum from "@/public/images/services/wedding/snack_pondokan-bubur_sumsum.webp";
import salad from "@/public/images/services/wedding/snack_pondokan-salad_buah.webp";
import candil from "@/public/images/services/wedding/snack_pondokan-bubur_candil.webp";

type PondokanCard = {
  id: number;
  image: StaticImageData;
  title: string;
};

const PRICE_PER_PORTION = 10000;

const packageCards: PondokanCard[] = [
  { id: 1, image: batagor, title: "Batagor" },
  { id: 2, image: pempek, title: "Pempek Palembang" },
  { id: 3, image: siomay, title: "Siomay" },
  { id: 4, image: bakso, title: "Bakso" },
  { id: 5, image: soto, title: "Soto" },
  { id: 6, image: sate, title: "Sate Ayam + Lontong" },
  { id: 7, image: dimsum, title: "Dimsum" },
  { id: 8, image: surabi, title: "Surabi" },
  { id: 9, image: srikaya, title: "Ketan Srikaya" },
  { id: 10, image: durian, title: "Ketan Durian" },
  { id: 11, image: sumsum, title: "Bubur Sumsum" },
  { id: 12, image: salad, title: "Salad Buah" },
  { id: 13, image: candil, title: "Bubur Candil" },
];

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function PondokanOrderModal({
  card,
  onClose,
}: {
  card: PondokanCard;
  onClose: () => void;
}) {
  const router = useRouter();
  const { addItem, state, clearCart } = useCart();
  const { user } = useAuth();
  const [qtyStr, setQtyStr] = useState("1");
  const [pendingItem, setPendingItem] = useState<CartItem | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const qty = parseInt(qtyStr, 10) || 0;
  const qtyError = qty < 1;
  const subtotal = qty * PRICE_PER_PORTION;

  const buildItem = (): CartItem => ({
    id: `pondokan-${card.id}__default`,
    productId: `pondokan-${card.id}`,
    name: `Pondokan — ${card.title}`,
    image: "",
    basePrice: PRICE_PER_PORTION,
    addOns: [],
    quantity: qty,
    slug: `pondokan/${card.id}`,
    category: "Pondokan",
    packageName: card.title,
    unitLabel: "Porsi",
  });

  const handleOrder = () => {
    if (qtyError) return;
    setPendingItem(buildItem());
  };

  const handleConfirmClose = () => {
    if (pendingItem) addItem(pendingItem);
    setPendingItem(null);
    onClose();
  };

  const handleCheckoutAll = async () => {
    if (!pendingItem) return;

    const checkout = await createCheckoutOrder([...state.items, pendingItem], {
      id: user?.customer?.id,
      documentId: user?.customer?.documentId,
    });

    clearCart();
    setPendingItem(null);
    onClose();
    router.push(`/order-info/${checkout.orderDocumentId}`);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 ${
          pendingItem ? "pointer-events-none invisible" : ""
        }`}
      >
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="absolute right-4 top-4 z-10 rounded-full bg-gray-100 p-1.5 text-gray-500 hover:bg-gray-200"
          >
            <LuX className="text-lg" />
          </button>

          <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto p-6 pt-10">
            <div>
              <p className="text-sm font-semibold text-red-800">Pondokan</p>
              <h2 className="mt-1 text-xl font-bold text-[#332929]">
                {card.title}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {formatRupiah(PRICE_PER_PORTION)} / porsi
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#332929]">
                Qty <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  value={qtyStr}
                  onChange={(event) => setQtyStr(event.target.value)}
                  className={`h-11 w-28 rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-red-800 ${
                    qtyError
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
                <span className="text-sm text-gray-600">Porsi</span>
              </div>
              {qtyError ? (
                <p className="text-xs text-red-600">Qty minimal 1 porsi.</p>
              ) : null}
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <span className="text-sm font-semibold text-gray-600">
                Subtotal
              </span>
              <span className="text-2xl font-bold text-[#332929]">
                {formatRupiah(subtotal)}
              </span>
            </div>

            <Button
              disabled={qtyError}
              onClick={handleOrder}
              className="h-11 w-full bg-red-800 text-white hover:bg-red-900 disabled:opacity-50"
            >
              Pesan Sekarang
            </Button>
          </div>
        </div>
      </div>

      <CartConfirmModal
        item={pendingItem}
        onClose={handleConfirmClose}
        onCheckout={handleCheckoutAll}
        onBack={() => setPendingItem(null)}
        onRequireLogin={() => setIsAuthOpen(true)}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => setIsAuthOpen(false)}
      />
    </>
  );
}

export default function Pondokan() {
  const t = useTranslations("weddingStand");
  const cards = t.raw("cards") as Array<{
    id: number;
    title: string;
    price: string;
  }>;
  const [selectedCard, setSelectedCard] = useState<PondokanCard | null>(null);

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-4">
        <h2 className="text-3xl font-bold text-[#332929] sm:text-4xl lg:text-5xl">
          {t("mainTitle")}
        </h2>
      </div>

      <div className="mt-12 grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {packageCards.map((card) => {
          const translatedCard = cards.find((item) => item.id === card.id);
          const title = translatedCard?.title ?? card.title;

          return (
            <article
              key={card.id}
              className="flex h-full flex-col items-center border border-black/10 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-40 w-full items-center justify-center">
                <Image
                  src={card.image}
                  alt={title}
                  className="h-36 w-full max-w-56 object-contain"
                />
              </div>
              <div className="flex grow flex-col justify-center gap-2 py-4">
                <h3 className="text-xl font-bold text-[#332929] sm:text-2xl">
                  {title}
                </h3>
                <p className="text-xl font-semibold text-red-800">
                  {formatRupiah(PRICE_PER_PORTION)}
                </p>
              </div>
              <Button
                onClick={() => setSelectedCard({ ...card, title })}
                className="mt-auto h-10 w-full bg-red-800 text-white hover:bg-red-900"
              >
                Pesan Sekarang
              </Button>
            </article>
          );
        })}
      </div>

      {selectedCard ? (
        <PondokanOrderModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      ) : null}
    </>
  );
}
