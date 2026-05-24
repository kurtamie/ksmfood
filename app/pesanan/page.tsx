"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isPaidStatus } from "@/lib/order-status";
import type { PaymentStatusLabel } from "@/lib/order-status";
import type { OrderListItem } from "@/lib/order-queries";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatOrderDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/orders/mine", { cache: "no-store" });
        const json = await res.json();

        if (!res.ok || !json?.success) {
          throw new Error(
            typeof json?.error === "string"
              ? json.error
              : "Gagal memuat riwayat pesanan.",
          );
        }

        if (!cancelled) {
          setOrders(Array.isArray(json.data) ? json.data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal memuat riwayat pesanan.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-tertiary-900">
          Riwayat Pemesanan
        </h1>
        <p className="mt-2 text-sm text-secondary-600 max-w-2xl">
          Lihat semua pesanan terakhir kamu, status pembayaran, dan detail
          pesanan.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-secondary-600">Memuat pesanan...</p>
      ) : null}

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : null}

      {!isLoading && !error && orders.length === 0 ? (
        <p className="text-sm text-secondary-600">
          Belum ada pesanan. Mulai pesan dari halaman layanan kami.
        </p>
      ) : null}

      <div className="space-y-4">
        {orders.map((order) => {
          const status = order.paymentStatusLabel as PaymentStatusLabel;
          const paid = isPaidStatus(status);

          return (
            <div
              key={order.documentId}
              className="rounded-3xl border border-secondary-200 bg-white px-5 py-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-secondary-500">
                      {formatOrderDate(order.deliveryDate ?? order.createdAt)}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        paid
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {status}
                    </span>
                    {order.invoiceNo ? (
                      <span className="text-sm text-secondary-500">
                        {order.invoiceNo}
                      </span>
                    ) : order.orderNo ? (
                      <span className="text-sm text-secondary-500">
                        {order.orderNo}
                      </span>
                    ) : null}
                  </div>

                  <p className="text-lg font-semibold text-tertiary-900">
                    {formatRupiah(order.total)}
                  </p>
                </div>

                <Link
                  href={`/pesanan/${encodeURIComponent(order.documentId)}`}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#184d16] px-5 text-sm font-semibold text-white transition hover:bg-[#0f3910]"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
