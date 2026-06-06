"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { LuX } from "react-icons/lu";
import { useCart } from "@/components/CartContext";
import CartConfirmModal from "@/components/CartConfirmModal";
import type { CartItem } from "@/components/CartContext";
import AuthModal from "@/components/auth/AuthModal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { createCheckoutOrder } from "@/lib/client-checkout";

export interface TumpengPackageCard {
  id: string;
  title: string;
  subTitle?: string;
  items: string[];
  price: string;
  badge?: boolean;
  packageType: "A" | "B" | "C" | "D";
}

interface TumpengOrderModalProps {
  card: TumpengPackageCard;
  serviceName: string;
  onClose: () => void;
}

export function TumpengOrderModal({
  card,
  serviceName,
  onClose,
}: TumpengOrderModalProps) {
  const t = useTranslations("riceboxMenu");
  const { addItem, state, clearCart } = useCart();
  const { user } = useAuth();
  const [pendingItem, setPendingItem] = useState<CartItem | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const router = useRouter();

  const [jumlahStr, setJumlahStr] = useState("1");
  const jumlah = parseInt(jumlahStr) || 0;
  const jumlahError = jumlah < 1;

  const priceNumber = parseInt(card.price.replace(/[^0-9]/g, ""), 10);
  const subtotal = priceNumber * jumlah;

  const getPackageName = (title: string, subTitle?: string) =>
    [title, subTitle].filter(Boolean).join(" ");

  const isFormValid = !jumlahError && jumlah > 0;

  const handleOrder = () => {
    if (!isFormValid) return;

    const newItem: CartItem = {
      id: `tumpeng-${card.packageType}-${card.id}__qty${jumlah}`,
      productId: `tumpeng-${card.packageType}-${card.id}`,
      name: `${serviceName} — ${getPackageName(card.title, card.subTitle)}`,
      image: "",
      basePrice: priceNumber,
      addOns: [],
      quantity: jumlah,
      slug: `tumpeng/${card.id}`,
      category: serviceName,
      packageName: getPackageName(card.title, card.subTitle),
    };

    setPendingItem(newItem);
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

  const handleConfirmBack = () => {
    setPendingItem(null);
  };

  const fieldClass = "flex items-start gap-4";
  const labelClass = "w-36 shrink-0 text-sm font-semibold pt-2";

  return (
    <>
      {/* Order Modal */}
      <div
        className={`fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 ${
          pendingItem ? "invisible pointer-events-none" : ""
        }`}
      >
        <div
          className="relative w-full max-w-xl rounded-2xl bg-white shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-gray-100 p-1.5 text-gray-500 hover:bg-gray-200"
          >
            <LuX className="text-lg" />
          </button>

          <div className="max-h-[90vh] overflow-y-auto flex flex-col gap-5 p-6 pt-10">
            {/* Header */}
            <div>
              <h2 className="text-xl font-bold text-red-900">
                {serviceName} — {getPackageName(card.title, card.subTitle)}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Detail paket sudah termasuk semua item di bawah.
              </p>
            </div>

            {/* Items paket (read-only list) */}
            <div className={fieldClass}>
              <label className={labelClass}>Isi Paket</label>
              <div className="flex flex-1 flex-col gap-1.5">
                {card.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Jumlah */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <label className="w-36 shrink-0 text-sm font-semibold">
                  Jumlah Pesanan <span className="text-red-600">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={jumlahStr}
                    onChange={(e) => setJumlahStr(e.target.value)}
                    className={`w-24 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-800 ${
                      jumlahError
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                  <span className="text-sm text-gray-600">Tumpeng</span>
                </div>
              </div>
              {jumlahError && (
                <p className="pl-40 text-xs text-red-600 mt-1">
                  Jumlah pesanan minimal 1 tumpeng.
                </p>
              )}
            </div>

            {/* Subtotal */}
            <div className="flex items-center gap-4">
              <span className="w-36 shrink-0 text-sm font-semibold">
                Subtotal Pesanan
              </span>
              <span className="text-2xl font-bold">
                Rp {subtotal.toLocaleString("id-ID")}
              </span>
            </div>

            {/* Tombol Order */}
            <Button
              disabled={!isFormValid}
              onClick={handleOrder}
              className="h-11 w-full bg-red-800 text-white hover:bg-red-900 disabled:opacity-50"
            >
              {t("orderNow")}
            </Button>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <CartConfirmModal
        item={pendingItem}
        onClose={handleConfirmClose}
        onCheckout={handleCheckoutAll}
        onBack={handleConfirmBack}
        onRequireLogin={() => setIsAuthOpen(true)}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          setIsAuthOpen(false);
        }}
      />
    </>
  );
}
