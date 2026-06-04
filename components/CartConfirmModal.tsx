"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { CartItem, getItemTotalPrice } from "@/components/CartContext";
import { useAuth } from "@/context/authContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CartConfirmModalProps {
  item: CartItem | null;
  onClose: () => void;
  onCheckout?: () => void | Promise<void>;
  onBack?: () => void;
  onRequireLogin?: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CartConfirmModal({
  item,
  onClose,
  onCheckout,
  onBack,
  onRequireLogin,
}: CartConfirmModalProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!item) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [item, handleKeyDown]);

  if (!item) return null;

  const totalPrice = getItemTotalPrice(item);
  const pricePerItem =
    item.basePrice + item.addOns.reduce((s, a) => s + a.price, 0);
  const addOnLabels = item.addOns.map((a) => a.label).join(", ");
  const unitLabel = item.unitLabel ?? "Kotak";

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      onRequireLogin?.();
      return;
    }
    setCheckoutError(null);
    setIsCheckingOut(true);
    try {
      if (onCheckout) {
        await onCheckout();
        return;
      }
      router.push("/order-info");
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Gagal membuat pesanan. Coba lagi.",
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4"
      onClick={onBack ?? onClose}
    >
      {/* Modal */}
      <div
        className="
          relative w-full max-w-lg overflow-hidden
          rounded-lg bg-white
          animate-in fade-in zoom-in-95 duration-200
        "
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-5">
          <div>
            <p className="text-sm text-secondary-800">
              Terima kasih, pesanan anda
            </p>
            <h2
              id="confirm-modal-title"
              className="text-xl font-semibold leading-tight text-primary-500"
            >
              {item.quantity} {unitLabel}
            </h2>
            <p className="text-lg font-medium text-black">{item.name}</p>
          </div>

          <button
            onClick={onBack ?? onClose}
            aria-label="Tutup modal"
            className="
              mt-0.5 rounded-lg p-1.5
              text-secondary-800 transition-colors
              hover:bg-secondary-300 hover:text-secondary-800
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex gap-4 px-6 py-4">
          <div className="flex flex-col justify-center gap-0.5">
            <div className="flex flex-row items-center gap-2">
              <p className="text-xl font-extrabold text-primary-500">
                {formatRupiah(totalPrice)}
              </p>
              <p className="text-xs text-secondary-800">
                @ {formatRupiah(pricePerItem)} / {unitLabel.toLowerCase()}
              </p>
            </div>

            {addOnLabels && (
              <p className="mt-1 text-xs leading-relaxed text-secondary-800">
                {addOnLabels}
              </p>
            )}

            {/* Success note */}
            <p className="mt-2 flex items-center gap-1 text-xs text-primary-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Pesanan siap ditambahkan ke keranjang
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-secondary-300" />

        {checkoutError ? (
          <p className="mx-6 mt-3 text-xs text-red-600">{checkoutError}</p>
        ) : null}

        {/* ── Footer ── */}
        <div className="flex flex-row gap-2 px-6 py-4">
          {/* Tambah menu lainnya → addItem + tutup semua */}
          <button
            onClick={onClose}
            className="
              flex flex-1 items-center justify-center gap-1.5
              rounded-xl border-2 border-primary-500
              px-3 py-3 text-xs font-semibold text-primary-500
              transition-colors hover:bg-primary-50
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Tambah Menu Lainnya
          </button>

          {/* Checkout → addItem + redirect */}
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="
              flex flex-1 items-center justify-center gap-1.5
              rounded-xl bg-primary-500
              px-3 py-3 text-xs font-semibold text-white
              transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
            {isCheckingOut ? "Memproses..." : "Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}
