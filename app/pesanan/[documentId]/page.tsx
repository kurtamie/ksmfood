"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { isPaidStatus } from "@/lib/order-status";
import type { PaymentStatusLabel } from "@/lib/order-status";
import type { OrderDetailView } from "@/lib/order-queries";
import { parseAmount } from "@/lib/order-totals";

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

export default function OrderDetailPage() {
  const params = useParams();
  const documentId = params?.documentId as string | undefined;

  const [order, setOrder] = useState<OrderDetailView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) {
      setError("ID pesanan tidak valid.");
      setIsLoading(false);
      return;
    }
    const orderDocumentId = documentId;

    let cancelled = false;

    async function loadOrder() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/orders/mine/${encodeURIComponent(orderDocumentId)}`,
          { cache: "no-store" },
        );
        const json = await res.json();

        if (!res.ok || !json?.success) {
          throw new Error(
            typeof json?.error === "string"
              ? json.error
              : "Gagal memuat detail pesanan.",
          );
        }

        if (!cancelled) {
          setOrder(json.data as OrderDetailView);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal memuat detail pesanan.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadOrder();

    return () => {
      cancelled = true;
    };
  }, [documentId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-sm text-secondary-600">Memuat detail pesanan...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-sm text-red-600">
          {error ?? "Pesanan tidak ditemukan."}
        </p>
        <Link
          href="/pesanan"
          className="mt-4 inline-flex text-sm font-semibold text-primary-600 hover:underline"
        >
          Kembali ke Riwayat
        </Link>
      </div>
    );
  }

  const status = order.paymentStatusLabel as PaymentStatusLabel;
  const paid = isPaidStatus(status);
  const subTotal = order.orderDetails.reduce(
    (sum, detail) =>
      sum + parseAmount(detail.total_amount ?? detail.amount),
    0,
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-secondary-500">
            {order.invoiceNo ? "Invoice" : "Pesanan"}
          </p>
          <h1 className="text-3xl font-semibold text-tertiary-900">
            {order.invoiceNo ?? order.orderNo ?? order.documentId}
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              paid
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {status}
          </span>
          <Link
            href="/pesanan"
            className="inline-flex items-center justify-center rounded-full border border-secondary-200 px-4 py-2 text-sm font-semibold text-tertiary-900 hover:bg-secondary-100"
          >
            Kembali ke Riwayat
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-secondary-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-tertiary-900 mb-4">
              Detail Pesanan
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm text-secondary-500">Tanggal Kirim</p>
                <p className="font-medium text-tertiary-900">
                  {formatOrderDate(order.deliveryDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Jam Tiba</p>
                <p className="font-medium text-tertiary-900">
                  {order.arriveTime ?? "-"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-secondary-500">Alamat Pengiriman</p>
                <p className="font-medium text-tertiary-900">
                  {order.deliveryAddress ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Penerima</p>
                <p className="font-medium text-tertiary-900">
                  {order.recipientName ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Telepon</p>
                <p className="font-medium text-tertiary-900">
                  {order.recipientPhone ?? "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-secondary-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-tertiary-900 mb-4">
              Item Pesanan
            </h2>
            <div className="space-y-4">
              {order.orderDetails.length > 0 ? (
                order.orderDetails.map((detail) => {
                  const qty = parseAmount(detail.qty) || 1;
                  const lineTotal = parseAmount(
                    detail.total_amount ?? detail.amount,
                  );
                  const unitPrice =
                    parseAmount(detail.selling_price) ||
                    (qty > 0 ? lineTotal / qty : lineTotal);

                  return (
                    <div
                      key={detail.id}
                      className="flex items-center justify-between gap-4 border-b border-secondary-100 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-tertiary-900">
                          Item pesanan
                        </p>
                        <p className="text-sm text-secondary-500">
                          {qty} x {formatRupiah(unitPrice)}
                        </p>
                      </div>
                      <p className="font-semibold text-tertiary-900">
                        {formatRupiah(lineTotal)}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-secondary-600">
                  Detail item belum tersedia.
                </p>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-secondary-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-tertiary-900 mb-4">
              Ringkasan Biaya
            </h2>
            <div className="space-y-3 text-sm text-secondary-600">
              <div className="flex justify-between">
                <span>Sub total</span>
                <span>{formatRupiah(subTotal || order.total)}</span>
              </div>
              <div className="flex justify-between border-t border-secondary-200 pt-3 font-semibold text-tertiary-900">
                <span>Total</span>
                <span>{formatRupiah(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-secondary-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-tertiary-900 mb-4">
              Status Pembayaran
            </h2>
            <p className="text-sm text-secondary-700">
              {paid
                ? "Pesanan sudah dibayar."
                : "Pesanan belum dibayar. Selesaikan pembayaran dari ringkasan pesanan."}
            </p>
            {order.deliveryNote ? (
              <p className="mt-3 text-sm text-secondary-600">
                Catatan: {order.deliveryNote}
              </p>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
