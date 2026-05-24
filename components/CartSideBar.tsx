"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useCart,
  getItemTotalPrice,
  type CartItem,
} from "@/components/CartContext";
import { FaArrowRight } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { GrCart } from "react-icons/gr";
import { useAuth } from "@/context/authContext";
import AuthModal from "@/components/auth/AuthModal";
import { useState } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// ─── Cart Item Row ─────────────────────────────────────────────────────────────

function CartItemRow({ item }: { item: CartItem }) {
  const { removeItem, updateQuantity } = useCart();
  const total = getItemTotalPrice(item);
  const addOnLabels = item.addOns.map((a) => a.label).join(", ");

  return (
    <div className="flex gap-3 py-4 border-b border-secondary-300 last:border-0">
      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <p className="text-sm font-semibold text-tertiary-800 leading-tight line-clamp-2">
          {item.name}
        </p>
        {addOnLabels && (
          <p className="text-xs text-tertiary-500 leading-relaxed line-clamp-2">
            {addOnLabels}
          </p>
        )}
        <p className="text-sm font-semibold text-primary-500 mt-auto">
          {formatRupiah(total)}
        </p>
      </div>

      {/* Qty + hapus */}
      <div className="flex flex-col items-end justify-between flex-shrink-0">
        {/* Hapus */}
        <button
          onClick={() => removeItem(item.id)}
          aria-label="Hapus item"
          className="text-secondary-500 hover:text-primary-500 transition-colors"
        >
          <RxCross1 size={15} />
        </button>

        {/* Qty stepper */}
        <div className="flex items-center gap-1.5 rounded-lg border border-secondary-400 px-1.5 py-0.5">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            aria-label="Kurangi"
            className="w-5 h-5 flex items-center justify-center text-tertiary-700 hover:text-primary-500 transition-colors font-bold text-base leading-none"
          >
            −
          </button>
          <span className="min-w-[1.5rem] text-center text-sm font-semibold text-tertiary-800">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            aria-label="Tambah"
            className="w-5 h-5 flex items-center justify-center text-tertiary-700 hover:text-primary-500 transition-colors font-bold text-base leading-none"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Sidebar ──────────────────────────────────────────────────────────────

export default function CartSidebar() {
  const { state, closeCart, totalPrice, isEmpty, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const router = useRouter();
  const isOpen = state.isOpen;

  // Tutup dengan Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    },
    [closeCart],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setIsAuthOpen(true); // ← tampilkan AuthModal
      return;
    }
    closeCart();
    router.push("/order-info");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[80] bg-black/40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <div
        className={`fixed right-0 top-0 z-[90] flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Keranjang belanja"
      >
        {/* ── Header sidebar ── */}
        <div className="flex items-center justify-between border-b border-secondary-300 px-5 py-4">
          <div className="flex items-center gap-2">
            <GrCart size={21} className="text-red-900" />
            <h2 className="text-base font-bold text-tertiary-800">Keranjang</h2>
            {state.items.length > 0 && (
              <span className="rounded-full bg-primary-500 px-2 py-0.5 text-xs font-bold text-white">
                {state.items.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Kosongkan cart */}
            {!isEmpty && (
              <button
                onClick={clearCart}
                className="text-xs text-secondary-600 hover:text-primary-500 transition-colors underline underline-offset-2"
              >
                Kosongkan
              </button>
            )}
            <button
              onClick={closeCart}
              aria-label="Tutup keranjang"
              className="rounded-lg p-1.5 text-secondary-600 hover:bg-secondary-300 hover:text-secondary-900 transition-colors"
            >
              <RxCross1 size={18} />
            </button>
          </div>
        </div>

        {/* ── Isi cart ── */}
        <div className="flex-1 overflow-y-auto px-5">
          {isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="text-5xl">🛒</div>
              <p className="font-semibold text-tertiary-700">
                Keranjang masih kosong
              </p>
              <p className="text-sm text-secondary-600">
                Tambahkan pesanan dari halaman layanan kami
              </p>
            </div>
          ) : (
            <div>
              {state.items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* ── Footer sidebar ── */}
        {!isEmpty && (
          <div className="border-t border-secondary-300 px-5 py-4 flex flex-col gap-3">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-tertiary-600">Total Pesanan</span>
              <span className="text-lg font-bold text-tertiary-800">
                {formatRupiah(totalPrice)}
              </span>
            </div>

            {/* Tombol checkout */}
            <button
              onClick={handleCheckout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-600"
            >
              Lanjut ke Checkout
              <FaArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          setIsAuthOpen(false);
          closeCart();
          router.push("/order-info");
        }}
      />
    </>
  );
}
