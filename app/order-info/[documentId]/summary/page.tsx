"use client";

import Script from "next/script";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { MidtransSnapResult } from "@/types/midtrans-snap";

const SNAP_SCRIPT_URL =
  process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

function formatRupiah(amount: number | undefined) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount ?? 0);
}

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  basePrice: number;
  addOns: Array<{ label: string; price: number }>;
};

type OrderSummary = {
  orderId: string | number | null;
  documentId?: string | null;
  deliveryDate?: string;
  deliveryTime?: string;
  addressName?: string;
  addressLine?: string;
  subdistrict?: string;
  pinpoint?: string;
  latitude?: number | null;
  longitude?: number | null;
  recipientName?: string;
  recipientPhone?: string;
  notes?: string;
  items?: OrderItem[];
  totals?: {
    subtotal?: number;
  };
  /** ID invoice (numeric) yang dibuat saat order — untuk update status setelah bayar */
  invoiceId?: number | null;
  /** documentId invoice (Strapi v5) — lebih diutamakan untuk update */
  invoiceDocumentId?: string | null;
};

export default function OrderSummaryPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params?.documentId;

  const [summary, setSummary] = useState<OrderSummary | null>(() => {
    try {
      if (typeof window === "undefined") return null;
      const raw = window.sessionStorage.getItem("ksm_order_summary");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [snapReady, setSnapReady] = useState(false);

  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";

  useEffect(() => {
    if (!summary) {
      router.replace("/");
    }
  }, [router, summary]);

  const total = useMemo(() => summary?.totals?.subtotal ?? 0, [summary]);

  const numericOrderId = useMemo(() => {
    const fromSummary = Number(summary?.orderId);
    if (Number.isFinite(fromSummary) && fromSummary > 0) return fromSummary;
    const fromParam = Number(documentId);
    if (Number.isFinite(fromParam) && fromParam > 0) return fromParam;
    return null;
  }, [documentId, summary?.orderId]);

  /**
   * Update invoice yang sudah ada (dibuat saat order) menjadi "paid".
   * Menggunakan invoiceDocumentId (Strapi v5) atau invoiceId (Strapi v4).
   */
  const markInvoicePaid = useCallback(
    async (result: MidtransSnapResult) => {
      const invoiceDocId = summary?.invoiceDocumentId;
      const invoiceNumId = summary?.invoiceId;

      if (!invoiceDocId && !invoiceNumId && !numericOrderId) {
        console.warn(
          "[markInvoicePaid] Tidak ada invoice/order id di summary. Skip update.",
        );
        return;
      }

      const updatePayload = {
        payment_status: "paid",
      };

      const res = invoiceDocId
        ? await fetch(`/api/invoices/${invoiceDocId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatePayload),
          })
        : await fetch("/api/invoices", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              invoiceId: invoiceNumId ?? undefined,
              orderId: numericOrderId ?? undefined,
              orderDocumentId:
                typeof documentId === "string"
                  ? documentId
                  : (summary?.documentId ?? undefined),
              payment_status: "paid",
            }),
          });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(
          typeof json?.error === "string"
            ? json.error
            : "Gagal memperbarui status invoice.",
        );
      }
    },
    [
      documentId,
      numericOrderId,
      summary?.documentId,
      summary?.invoiceDocumentId,
      summary?.invoiceId,
    ],
  );

  const handlePayNow = useCallback(async () => {
    setPayError(null);
    setPaymentMessage(null);

    if (numericOrderId == null) {
      setPayError("ID pesanan tidak valid.");
      return;
    }

    if (total <= 0) {
      setPayError("Total pembayaran belum tersedia.");
      return;
    }

    if (!clientKey) {
      setPayError("Midtrans client key belum dikonfigurasi.");
      return;
    }

    if (!snapReady || !window.snap?.pay) {
      setPayError("Midtrans Snap belum siap. Coba lagi sebentar.");
      return;
    }

    setIsPaying(true);

    try {
      const res = await fetch("/api/midtrans/snap-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: numericOrderId,
          grossAmount: total,
          customerName: summary?.recipientName,
          customerPhone: summary?.recipientPhone,
        }),
      });
      const json = await res.json();

      if (!res.ok || !json?.success || !json?.token) {
        throw new Error(
          typeof json?.error === "string"
            ? json.error
            : "Gagal membuka pembayaran Midtrans.",
        );
      }

      window.snap.pay(json.token, {
        onSuccess: async (result) => {
          try {
            // Update invoice yang sudah ada menjadi "paid"
            await markInvoicePaid(result);
            setPaymentMessage(
              "Pembayaran berhasil. Status invoice telah diperbarui.",
            );
            router.push("/pesanan");
          } catch (err) {
            // Pembayaran tetap sukses meski update invoice gagal
            // Midtrans webhook akan menangani sebagai fallback
            console.error("[onSuccess] Gagal update invoice:", err);
            setPaymentMessage(
              "Pembayaran berhasil. Status invoice akan diperbarui via notifikasi Midtrans.",
            );
            router.push("/pesanan");
          } finally {
            setIsPaying(false);
          }
        },
        onPending: () => {
          setPaymentMessage(
            "Pembayaran menunggu konfirmasi. Status akan diperbarui setelah selesai.",
          );
          setIsPaying(false);
        },
        onError: () => {
          setPayError("Pembayaran gagal atau dibatalkan.");
          setIsPaying(false);
        },
        onClose: () => {
          setIsPaying(false);
        },
      });
    } catch (error) {
      setPayError(
        error instanceof Error
          ? error.message
          : "Gagal memulai pembayaran Midtrans.",
      );
      setIsPaying(false);
    }
  }, [
    clientKey,
    numericOrderId,
    router,
    markInvoicePaid,
    snapReady,
    summary?.recipientName,
    summary?.recipientPhone,
    total,
  ]);

  if (!summary) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-center text-sm text-secondary-600">
          Memuat ringkasan pesanan...
        </p>
      </div>
    );
  }

  return (
    <>
      {clientKey ? (
        <Script
          src={SNAP_SCRIPT_URL}
          strategy="afterInteractive"
          data-client-key={clientKey}
          onLoad={() => setSnapReady(true)}
        />
      ) : null}

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-x-6 top-1/2 h-px bg-gray-200" />
            <div className="grid grid-cols-2 gap-4">
              <div className="relative flex flex-col items-center gap-3 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-secondary-500 text-sm font-bold">
                  1
                </div>
                <p className="text-sm text-secondary-500">
                  Informasi Pesanan & Pengiriman
                </p>
              </div>

              <div className="relative flex flex-col items-center gap-3 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-500 bg-primary-500 text-white text-sm font-bold">
                  2
                </div>
                <p className="text-sm font-semibold text-tertiary-900">
                  Ringkasan Pesanan
                </p>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-center text-tertiary-900 mb-6">
          Ringkasan Pesanan
        </h1>
        <p className="text-center text-sm text-secondary-600 mb-6">
          Order ID: {documentId ?? summary.documentId ?? summary.orderId ?? "-"}
        </p>

        {paymentMessage ? (
          <p className="mb-4 text-center text-sm text-green-700">
            {paymentMessage}
          </p>
        ) : null}
        {payError ? (
          <p className="mb-4 text-center text-sm text-red-600">{payError}</p>
        ) : null}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mt-6 space-y-4">
              {summary.items?.map((item) => {
                const addOnLabels = item.addOns.map((a) => a.label).join(", ");
                const itemTotal =
                  (item.basePrice +
                    item.addOns.reduce((sum, addOn) => sum + addOn.price, 0)) *
                  item.quantity;
                return (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-secondary-200 bg-gray-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-tertiary-900">
                          {item.name}
                        </p>
                        {addOnLabels && (
                          <p className="mt-1 text-sm text-secondary-600">
                            + {addOnLabels}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm text-secondary-800">
                        <p>
                          {item.quantity} x{" "}
                          {formatRupiah(
                            item.basePrice +
                              item.addOns.reduce(
                                (sum, addOn) => sum + addOn.price,
                                0,
                              ),
                          )}
                        </p>
                        <p className="font-semibold">
                          {formatRupiah(itemTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 space-y-3 rounded-3xl border border-secondary-200 bg-gray-50 p-5 text-sm text-secondary-700">
              <div className="flex justify-between">
                <span>Sub Total Pesanan</span>
                <span>{formatRupiah(total)}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-secondary-200 pt-4 text-lg font-semibold text-tertiary-900">
              <span>Total yang harus dibayar</span>
              <span>{formatRupiah(total)}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-tertiary-900">
                Alamat Pengiriman
              </h2>
              <div className="mt-4 space-y-2 text-sm text-secondary-700">
                <p>{summary.addressName || "-"}</p>
                <p>{summary.addressLine || "-"}</p>
                <p>{summary.subdistrict || "-"}</p>
                <p>
                  {summary.recipientName || "-"} •{" "}
                  {summary.recipientPhone || "-"}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-tertiary-900">
                Jadwal Pengiriman
              </h2>
              <div className="mt-4 space-y-2 text-sm text-secondary-700">
                <p>Tanggal: {summary.deliveryDate || "-"}</p>
                <p>Jam: {summary.deliveryTime || "-"}</p>
                {summary.notes && <p>Catatan: {summary.notes}</p>}
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => void handlePayNow()}
                disabled={isPaying || total <= 0}
                className="w-full rounded-lg bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPaying ? "Membuka pembayaran..." : "Bayar Sekarang"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
