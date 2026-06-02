"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { LuX } from "react-icons/lu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/components/CartContext";
import CartConfirmModal from "@/components/CartConfirmModal";
import type { CartItem } from "@/components/CartContext";
import AuthModal from "@/components/auth/AuthModal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { createCheckoutOrder } from "@/lib/client-checkout";
import { useServiceDishes } from "@/components/landing/services/use-service-dishes";

export interface SnackPackageCard {
  id: string;
  title: string;
  subTitle?: string;
  items: string[];
  price: string;
  badge?: boolean;
  packageType: "A" | "B" | "C" | "D" | "E" | "F";
}

interface SnackOrderModalProps {
  card: SnackPackageCard;
  serviceName: string;
  onClose: () => void;
}

// Jumlah kue per paket
const kueCountMap: Record<string, number> = {
  A: 2,
  B: 2,
  C: 3,
  D: 3,
  E: 4,
  F: 4,
};

// Minuman per paket (read-only)
const minumanMap: Record<string, string> = {
  A: "Air Mineral Gelas",
  B: "Teh Kotak",
  C: "Air Mineral Gelas",
  D: "Teh Kotak",
  E: "Air Mineral Gelas",
  F: "Teh Kotak",
};

type KueSelection = { kategori: string; menu: string };

const rotiSnackNames = [
  "pisang cokelat",
  "pisang keju cokelat",
  "bomboloni",
  "donat topping",
  "bolu marmer",
];

const isRotiSnack = (name: string) => {
  const value = name.toLowerCase();
  return value.includes("roti") || rotiSnackNames.includes(value);
};

export function SnackOrderModal({ card, serviceName, onClose }: SnackOrderModalProps) {
  const t = useTranslations("riceboxMenu");
  const { addItem, state, clearCart } = useCart();
  const { user } = useAuth();
  const [pendingItem, setPendingItem] = useState<CartItem | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const router = useRouter();
  const { optionsByType } = useServiceDishes("snackbox");

  const kueCount = kueCountMap[card.packageType];
  const minuman = minumanMap[card.packageType];
  const snackOptions = optionsByType.snack;

  const [kueList, setKueList] = useState<KueSelection[]>(
    Array.from({ length: kueCount }, () => ({ kategori: "", menu: "" }))
  );
  const [jumlahStr, setJumlahStr] = useState("1");
  const jumlah = parseInt(jumlahStr) || 0;
  const jumlahError = jumlah < 1;

  const priceNumber = parseInt(card.price.replace(/[^0-9]/g, ""), 10);

  // Hitung surcharge dari kue roti
  const rotiSurcharge = kueList.filter((k) => isRotiSnack(k.menu)).length * 2000;
  const subtotal = (priceNumber * jumlah) + (rotiSurcharge * jumlah);

  const getPackageName = (title: string, subTitle?: string) =>
    [title, subTitle].filter(Boolean).join(" ");

  const isFormValid =
    kueList.every((k) => k.menu !== "") && !jumlahError;

  const handleOrder = () => {
    if (!isFormValid) return;

    const addOns = [
      ...kueList.map((k, i) => ({
        label: `${kueCount > 1 ? `Kue ${i + 1}: ` : ""}${k.menu}${isRotiSnack(k.menu) ? " (+Rp 2.000)" : ""}`,
        value: `kue_${i}_${k.menu}`,
        price: isRotiSnack(k.menu) ? 2000 : 0,
      })),
      {
        label: minuman,
        value: `minuman_${minuman}`,
        price: 0,
      },
    ];

    const newItem: CartItem = {
      id: `snack-${card.packageType}-${card.id}__${addOns
        .map((a) => a.value)
        .sort()
        .join("_")}`,
      productId: `snack-${card.packageType}-${card.id}`,
      name: `${serviceName} — ${getPackageName(card.title, card.subTitle)}`,
      image: "",
      basePrice: priceNumber,
      addOns,
      quantity: jumlah,
      slug: `snackbox/${card.id}`,
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

  const fieldClass = "flex items-center gap-4";
  const labelClass = "w-32 shrink-0 text-sm font-semibold";
  const readonlyClass =
    "w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500 cursor-not-allowed";

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
              <p className="mt-1 text-sm text-gray-600">
                {kueCount} Kue · {minuman}
              </p>
            </div>

            {/* Pilihan Kue */}
            {kueList.map((val, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <label className="w-32 shrink-0 pt-2 text-sm font-semibold">
                  {kueCount > 1 ? `Kue ${idx + 1}` : "Kue"}
                  <span className="text-red-600"> *</span>
                </label>
                <div className="flex flex-1 flex-col gap-2">
                  <Select
                    value={val.menu}
                    onValueChange={(newMenu) => {
                      const updated = kueList.map((item, i) =>
                        i === idx
                          ? {
                              kategori: isRotiSnack(newMenu) ? "roti" : "snack",
                              menu: newMenu,
                            }
                          : item
                      );
                      setKueList(updated);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Kue" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      side="bottom"
                      avoidCollisions={false}
                      className="z-[80]"
                    >
                      {snackOptions.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}

            {/* Minuman (read-only) */}
            <div className={fieldClass}>
              <label className={labelClass}>Minuman</label>
              <input readOnly value={minuman} className={readonlyClass} />
            </div>

            {/* Jumlah */}
            <div className="flex flex-col gap-1">
              <div className={fieldClass}>
                <label className={labelClass}>
                  Jumlah Pesanan <span className="text-red-600">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={50}
                    value={jumlahStr}
                    onChange={(e) => setJumlahStr(e.target.value)}
                    className={`w-24 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-800 ${
                      jumlahError
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                  <span className="text-sm text-gray-600">Kotak</span>
                </div>
              </div>
              {jumlahError && (
                <p className="pl-36 text-xs text-red-600 mt-2">
                  Jumlah pesanan tidak bisa di bawah 50. Untuk pesanan lebih
                  sedikit, silahkan hubungi tim kami.
                </p>
              )}
            </div>

            {/* Info surcharge roti */}
            {kueList.some((k) => isRotiSnack(k.menu)) && (
              <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                Pilihan kue kategori <strong>Roti</strong> dikenakan tambahan biaya{" "}
                <strong>Rp 2.000/kotak</strong>.
              </p>
            )}

            {/* Subtotal */}
            <div className={fieldClass}>
              <span className={labelClass}>Subtotal Pesanan</span>
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
          setPendingItem(null);
          onClose();
        }}
      />
    </>
  );
}
