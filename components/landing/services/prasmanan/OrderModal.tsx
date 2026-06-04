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
import {
  mainDishGroupLabels,
  useServiceDishes,
} from "@/components/landing/services/use-service-dishes";

export interface PackageCard {
  id: string;
  title: string;
  subTitle?: string;
  dish: string[];
  items: string[];
  price: string;
  badge?: boolean;
  packageType:
    | "A"
    | "B"
    | "C"
    | "A+"
    | "B+"
    | "C+";
}

interface OrderModalProps {
  card: PackageCard;
  serviceName: string;
  onClose: () => void;
}

export function OrderModal({ card, serviceName, onClose }: OrderModalProps) {
  const t = useTranslations("riceboxMenu");
  const { addItem, state, clearCart } = useCart();
  const { user } = useAuth();
  const [pendingItem, setPendingItem] = useState<CartItem | null>(null);
  const isPlus = ["A+", "B+", "C+"].includes(card.packageType);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const router = useRouter();
  const { optionsByType, mainDishGroups } = useServiceDishes("prasmanan");

  const visibleGroups = ["ikan", "ayam", "seafood", "daging"].filter(
    (group) => mainDishGroups[group]?.length,
  );

  const nasiOptions = optionsByType.rice;
  const sayurOptions = optionsByType.vegetable;
  const sambalOptions = optionsByType.sauce;

  const laukUtamaCount = card.packageType.startsWith("A")
    ? 1
    : card.packageType.startsWith("B")
      ? 2
      : 3;

  const minumanValue = "Air Mineral Gelas";

  const allLaukTambahanOptions = optionsByType.additional_dish;

  const [nasi, setNasi] = useState("");
  const [laukUtamaList, setLaukUtamaList] = useState<
    { kategori: string; menu: string }[]
  >(Array.from({ length: laukUtamaCount }, () => ({ kategori: "", menu: "" })));
  const [laukTambahan, setLaukTambahan] = useState("");
  const [sayur, setSayur] = useState("");
  const [sambal, setSambal] = useState("");
  const [jumlahStr, setJumlahStr] = useState("150");
  const jumlah = parseInt(jumlahStr) || 0;
  const jumlahError = jumlah < 150;
  const availableSambal =
    jumlah >= 150
      ? sambalOptions
      : sambalOptions.filter(
          (s) => s === "Sambal Ijo" || s === "Sambal Terasi",
        );

  const priceNumber = parseInt(card.price.replace(/[^0-9]/g, ""), 10);
    const nasiAddon = nasi.includes("+2.000") ? 2000 : 0;
    const subtotal = (priceNumber + nasiAddon) * jumlah;

  const getPackageName = (title: string, subTitle?: string) =>
    [title, subTitle].filter(Boolean).join(" ");

  const isFormValid =
    nasi &&
    laukUtamaList.every((l) => l.kategori !== "" && l.menu !== "") &&
    laukTambahan &&
    sayur &&
    sambal &&
    !jumlahError;

  // Klik "Order Now" → simpan pending, tampilkan confirm modal (belum addItem)
  const handleOrder = () => {
    if (!isFormValid) return;

    const addOns = [
      {
        label: nasi,
        value: `nasi_${nasi}`,
        price: nasi.includes("+2.000") ? 2000 : 0,
      },
      ...laukUtamaList.map((l, i) => ({
        label: `${laukUtamaCount > 1 ? `Lauk ${i + 1}: ` : ""}${l.menu}`,
        value: `lauk_${i}_${l.menu}`,
        price: 0,
      })),
      {
        label: laukTambahan,
        value: `lauk_tambahan_${laukTambahan}`,
        price: 0,
      },
      {
        label: sayur,
        value: `sayur_${sayur}`,
        price: sayur.includes("+2.000") ? 2000 : 0,
      },
      { label: sambal, value: `sambal_${sambal}`, price: 0 },
      { label: minumanValue, value: `minuman_${minumanValue}`, price: 0 },
      { label: "Sup Sayuran", value: "sup_sayuran", price: 0 },
      ...(isPlus ? [{ label: "Puding", value: "puding", price: 0 }] : []),
    ];

    const newItem: CartItem = {
      id: `${card.packageType}-${card.id}__${addOns
        .map((a) => a.value)
        .sort()
        .join("_")}`,
      productId: `${card.packageType}-${card.id}`,
      name: `${serviceName} — ${getPackageName(card.title, card.subTitle)}`,
      image: "",
      basePrice: priceNumber,
      addOns,
      quantity: jumlah,
      slug: `ricebox/${card.id}`,
      category: serviceName,
      packageName: getPackageName(card.title, card.subTitle),
    };

    setPendingItem(newItem);
  };

  // Klik "Tambah Menu Lainnya" → addItem baru masuk keranjang, tutup semua
  const handleConfirmClose = () => {
    if (pendingItem) addItem(pendingItem);
    setPendingItem(null);
    onClose();
  };

  // Klik "Checkout" → addItem masuk keranjang, tutup order modal, redirect
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

  // Tombol X → balik ke order modal tanpa addItem
  const handleConfirmBack = () => {
    setPendingItem(null); // confirm modal hilang, order modal muncul lagi
  };

  const fieldClass = "flex items-center gap-4";
  const labelClass = "w-32 shrink-0 text-sm font-semibold";
  const readonlyClass =
    "w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500 cursor-not-allowed";

  return (
    <>
      {/* Order Modal — disembunyikan saat confirm modal muncul */}
      <div
        className={`fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 ${pendingItem ? "invisible pointer-events-none" : ""}`}
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
                {card.dish.join(", ")}.
              </p>
            </div>

            {/* Nasi */}
            <div className={fieldClass}>
              <label className={labelClass}>
                Nasi <span className="text-red-600">*</span>
              </label>
              <Select value={nasi} onValueChange={setNasi}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Pilih Nasi" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="bottom"
                  avoidCollisions={false}
                  className="z-[80]"
                >
                  {nasiOptions.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Lauk Utama */}
            {laukUtamaList.map((val, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <label className="w-32 shrink-0 pt-2 text-sm font-semibold">
                  {laukUtamaCount > 1 ? `Lauk Utama ${idx + 1}` : "Lauk Utama"}
                  <span className="text-red-600"> *</span>
                </label>
                <div className="flex flex-1 flex-col gap-2">
                  <Select
                    value={val.kategori}
                    onValueChange={(val2) => {
                      const updated = laukUtamaList.map((item, i) =>
                        i === idx ? { kategori: val2, menu: "" } : item,
                      );
                      setLaukUtamaList(updated);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      side="bottom"
                      avoidCollisions={false}
                      className="z-[80]"
                    >
                      {visibleGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {mainDishGroupLabels[group]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={val.menu}
                    disabled={!val.kategori}
                    onValueChange={(val2) => {
                      const updated = laukUtamaList.map((item, i) =>
                        i === idx ? { ...item, menu: val2 } : item,
                      );
                      setLaukUtamaList(updated);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Menu" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      side="bottom"
                      avoidCollisions={false}
                      className="z-[80]"
                    >
                      {val.kategori &&
                        mainDishGroups[val.kategori]?.map((o) => (
                          <SelectItem key={o} value={o}>
                            {o}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}

            {/* Lauk Tambahan */}
            <div className={fieldClass}>
              <label className={labelClass}>
                Lauk Tambahan <span className="text-red-600">*</span>
              </label>
              <Select value={laukTambahan} onValueChange={setLaukTambahan}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Pilih Lauk Tambahan" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="bottom"
                  avoidCollisions={false}
                  className="z-[80]"
                >
                  {allLaukTambahanOptions.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sayur */}
            <div className={fieldClass}>
              <label className={labelClass}>
                Sayur <span className="text-red-600">*</span>
              </label>
              <Select value={sayur} onValueChange={setSayur}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Pilih Sayur" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="bottom"
                  avoidCollisions={false}
                  className="z-[80]"
                >
                  {sayurOptions.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Kerupuk */}
            <div className={fieldClass}>
              <label className={labelClass}>Kerupuk</label>
              <input readOnly value="Kerupuk" className={readonlyClass} />
            </div>

            {/* Buah */}
            <div className={fieldClass}>
              <label className={labelClass}>Buah</label>
              <input
                readOnly
                value="Pisang / Jeruk"
                className={readonlyClass}
              />
            </div>

            {/* Minuman */}
            <div className={fieldClass}>
              <label className={labelClass}>Minuman</label>
              <input readOnly value={minumanValue} className={readonlyClass} />
            </div>

            {/* Sup Sayuran */}
            <div className={fieldClass}>
              <label className={labelClass}>Sup Sayuran</label>
              <input readOnly value="Sup Sayuran" className={readonlyClass} />
            </div>

            {/* Puding */}
            {isPlus && (
              <div className={fieldClass}>
                <label className={labelClass}>Puding</label>
                <input readOnly value="Puding" className={readonlyClass} />
              </div>
            )}

            {/* Jumlah */}
            <div className="flex flex-col gap-1">
              <div className={fieldClass}>
                <label className={labelClass}>
                  Jumlah Pesanan <span className="text-red-600">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={150}
                    value={jumlahStr}
                    onChange={(e) => {
                      setJumlahStr(e.target.value);
                      const parsed = parseInt(e.target.value) || 0;
                      if (parsed < 150) setSambal("");
                    }}
                    className={`w-24 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-800 ${
                      jumlahError
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                  <span className="text-sm text-gray-600">Porsi</span>
                </div>
              </div>
              {jumlahError && (
                <p className="pl-36 text-xs text-red-600 mt-2">
                  Jumlah pesanan tidak bisa di bawah 150. Untuk pesanan lebih
                  sedikit, silahkan hubungi tim kami.
                </p>
              )}
            </div>

            {/* Sambal */}
            {!jumlahError && jumlah > 0 && (
              <div className={fieldClass}>
                <label className={labelClass}>
                  Sambal <span className="text-red-600">*</span>
                </label>
                <Select value={sambal} onValueChange={setSambal}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Pilih Sambal" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    side="bottom"
                    avoidCollisions={false}
                    className="z-[80]"
                  >
                    {availableSambal.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Subtotal */}
            <div className={fieldClass}>
              <span className={labelClass}>Subtotal Pesanan</span>
              <span className="text-2xl font-bold">
                Rp {subtotal.toLocaleString("id-ID")}
              </span>
            </div>

            {/* Tombol order */}
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
