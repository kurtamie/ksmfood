"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { isPaidStatus } from "@/lib/order-status";
import type { PaymentStatusLabel } from "@/lib/order-status";
import type { OrderDetailView } from "@/lib/order-queries";
import { parseAmount } from "@/lib/order-totals";
import type { OrderStep } from "@/types/orders";
import { OrderStepper } from "@/components/OrderStepper";

const SNAP_SCRIPT_URL =
  process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatOrderDate(value: string | null, withTime = false) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime
      ? { hour: "2-digit", minute: "2-digit", timeZoneName: "short" }
      : {}),
  });
}

type OrderMenuRow = OrderDetailView["orderMenus"][number];
type OrderDetailRow = OrderDetailView["orderDetails"][number];
type InvoiceRow = OrderDetailView["invoices"][number];

type OrderDisplayItem = {
  id: string;
  name: string;
  addOnLabels: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

const ORDER_STEP_LABEL: Record<OrderStep, string> = {
  packing: "Pesanan sedang di packing",
  send: "Dalam pengiriman",
  success: "Pesanan Diterima",
};

function getOrderStepLabel(step: OrderDetailView["step"]): string | null {
  if (!step) return null;
  return ORDER_STEP_LABEL[step] ?? null;
}

function buildMenuLabels(menu: OrderMenuRow): string {
  return [
    menu.rice,
    menu.main_dish,
    menu.additional_dish,
    menu.vegetable,
    menu.sauce,
    menu.chip,
    menu.fruit,
    menu.mineral_water,
    menu.box,
    menu.pudding,
    menu.snack,
  ]
    .filter(Boolean)
    .join(", ");
}

function toOrderDisplayItems(
  menus: OrderMenuRow[],
  details: OrderDetailRow[],
): OrderDisplayItem[] {
  if (details.length === 1) {
    const detail = details[0];
    const quantity = parseAmount(detail.qty) || 1;
    const unitPrice = parseAmount(detail.selling_price);
    const total =
      parseAmount(detail.total_amount ?? detail.amount) || quantity * unitPrice;
    return [
      {
        id: String(detail.documentId ?? detail.id ?? "order-detail"),
        name: "Menu Pesanan",
        addOnLabels: menus.map(buildMenuLabels).filter(Boolean).join(" | "),
        quantity,
        unitPrice,
        total,
      },
    ];
  }

  const rowCount = Math.max(menus.length, details.length);
  return Array.from({ length: rowCount }, (_, index) => {
    const menu = menus[index];
    const detail = details[index];
    const quantity = parseAmount(detail?.qty) || 1;
    const unitPrice = parseAmount(detail?.selling_price);
    const total =
      parseAmount(detail?.total_amount ?? detail?.amount) ||
      quantity * unitPrice;
    return {
      id: String(
        detail?.documentId ?? detail?.id ?? menu?.documentId ?? menu?.id ?? index,
      ),
      name: `Menu Pesanan ${index + 1}`,
      addOnLabels: menu ? buildMenuLabels(menu) : "",
      quantity,
      unitPrice,
      total,
    };
  });
}

/** Ambil invoice utama (index 0) dari array invoices */
function getPrimaryInvoiceFromArray(
  invoices: InvoiceRow[],
): InvoiceRow | null {
  return invoices?.[0] ?? null;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params?.documentId as string | undefined;

  const [order, setOrder] = useState<OrderDetailView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Midtrans state
  const [snapReady, setSnapReady] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);

  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";

  useEffect(() => {
    if (!documentId) {
      setError("ID pesanan tidak valid.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadOrder() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/orders/mine/${encodeURIComponent(documentId!)}`,
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
        if (!cancelled) setOrder(json.data as OrderDetailView);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Gagal memuat detail pesanan.",
          );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadOrder();
    return () => {
      cancelled = true;
    };
  }, [documentId]);

  const handleResumePayment = useCallback(async () => {
    setPayError(null);
    setPaymentMessage(null);

    if (!order) return;

    // order.id adalah numeric ID dari OrderListItem
    const numericOrderId = order.id;
    const total = order.total;

    if (!numericOrderId || !Number.isFinite(numericOrderId)) {
      setPayError("ID pesanan tidak valid.");
      return;
    }
    if (!total || total <= 0) {
      setPayError("Total pembayaran tidak tersedia.");
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
          customerName: order.recipientName,
          customerPhone: order.recipientPhone,
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
        onSuccess: async () => {
          try {
            // Ambil invoice dari array invoices di order
            const primaryInvoice = getPrimaryInvoiceFromArray(order.invoices);
            const invoiceDocId = primaryInvoice?.documentId;
            const invoiceNumId = primaryInvoice?.id;

            if (invoiceDocId) {
              await fetch(`/api/invoices/${invoiceDocId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ payment_status: "paid" }),
              });
            } else {
              await fetch("/api/invoices", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  invoiceId: invoiceNumId ?? undefined,
                  orderId: numericOrderId,
                  orderDocumentId: documentId,
                  payment_status: "paid",
                }),
              });
            }

            setPaymentMessage(
              "Pembayaran berhasil. Status invoice telah diperbarui.",
            );
          } catch {
            // Midtrans webhook akan handle sebagai fallback
            setPaymentMessage(
              "Pembayaran berhasil. Status akan diperbarui via notifikasi Midtrans.",
            );
          } finally {
            setIsPaying(false);
            router.refresh();
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
    } catch (err) {
      setPayError(
        err instanceof Error ? err.message : "Gagal memulai pembayaran.",
      );
      setIsPaying(false);
    }
  }, [clientKey, documentId, order, router, snapReady]);

  // ── Loading & error states ────────────────────────────────────────────────

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

  // ── Derived values ────────────────────────────────────────────────────────

  const status = order.paymentStatusLabel as PaymentStatusLabel;
  const paid = isPaidStatus(status);
  const primaryInvoice = getPrimaryInvoiceFromArray(order.invoices);

  const subTotal = order.orderDetails.reduce(
    (sum, detail) => sum + parseAmount(detail.total_amount ?? detail.amount),
    0,
  );
  const totalQty = order.orderDetails.reduce(
    (sum, detail) => sum + parseAmount(detail.qty),
    0,
  );
  const orderItems = toOrderDisplayItems(order.orderMenus, order.orderDetails);
  const orderStepLabel = paid ? getOrderStepLabel(order.step) : null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Midtrans Snap — hanya load jika belum dibayar */}
      {!paid && clientKey ? (
        <Script
          src={SNAP_SCRIPT_URL}
          strategy="afterInteractive"
          data-client-key={clientKey}
          onLoad={() => setSnapReady(true)}
        />
      ) : null}

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Header */}

        <h1 className="mb-5 text-2xl font-semibold text-tertiary-900">
          Detail Pesanan
        </h1>

        {/* Notifikasi pembayaran */}
        {paymentMessage ? (
          <p className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {paymentMessage}
          </p>
        ) : null}
        {payError ? (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {payError}
          </p>
        ) : null}

        {/* Card utama */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Baris status + tombol lanjutkan pembayaran */}
          <div className="flex flex-col gap-3 border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-secondary-500">Status Pembayaran</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  paid
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {status}
              </span>
            </div>

          {!paid ? (
              <button
                type="button"
                onClick={() => void handleResumePayment()}
                disabled={isPaying}
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPaying ? "Membuka pembayaran..." : "Lanjutkan Pembayaran"}
              </button>
            ) : null}
          </div>

          {/* Status pesanan — hanya muncul kalau sudah lunas dan ada step */}
          {paid && order.step ? (
            <div className="border-b border-gray-100 px-6 py-5">
              <p className="mb-4 text-sm font-semibold text-tertiary-900">
                Status Pesanan
              </p>
              <OrderStepper currentStep={order.step} />
            </div>
          ) : null}

          {/* Tanggal pemesanan & no. invoice */}
          <div className="grid grid-cols-1 divide-y divide-gray-100 border-b border-gray-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="flex items-center justify-between px-6 py-3 text-sm">
              <span className="text-secondary-500">Tanggal Pemesanan</span>
              <span className="font-medium text-tertiary-900">
                {formatOrderDate(order.createdAt, true)}
              </span>
            </div>
            <div className="flex items-center justify-between px-6 py-3 text-sm">
              <span className="text-secondary-500">No. Invoice</span>
              <span className="font-medium text-tertiary-900">
                {order.invoiceNo ??
                  primaryInvoice?.invoice_no ??
                  order.orderNo ??
                  order.documentId ??
                  "-"}
              </span>
            </div>
          </div>

          {/* Informasi pengiriman */}
          <div className="border-b border-gray-100 px-6 py-4">
            <p className="mb-3 text-sm font-semibold text-tertiary-900">
              Informasi Pengiriman
            </p>
            <div className="space-y-2 text-sm">
               {/* Nama penerima */}
              {order.recipientName ? (
                <div className="flex gap-4">
                  <span className="w-36 shrink-0 text-secondary-500">
                    Nama Penerima
                  </span>
                  <span className="text-tertiary-900">
                    : {order.recipientName}
                  </span>
                </div>
              ) : null}

              {/* No. telepon penerima — sudah ada, pastikan tetap ada */}
              {order.recipientPhone ? (
                <div className="flex gap-4">
                  <span className="w-36 shrink-0 text-secondary-500">
                    No. Telepon
                  </span>
                  <span className="text-tertiary-900">
                    : {order.recipientPhone}
                  </span>
                </div>
              ) : null}

              <div className="flex gap-4">
                <span className="w-36 shrink-0 text-secondary-500">
                  Metode Pengiriman
                </span>
                <span className="text-tertiary-900">: Pengantaran oleh KSM Katering</span>
              </div>
              <div className="flex gap-4">
                <span className="w-36 shrink-0 text-secondary-500">
                  Tanggal Kirim
                </span>
                <span className="text-tertiary-900">
                  :{" "}
                  {order.deliveryDate
                    ? `${formatOrderDate(order.deliveryDate)}${order.arriveTime ? " " + order.arriveTime : ""}`
                    : "-"}
                </span>
              </div>
              <div className="flex gap-4">
                <span className="w-36 shrink-0 text-secondary-500">Alamat</span>
                <div className="text-tertiary-900">
                  <p className="whitespace-pre-line">
                  :  {order.deliveryAddress || "-"}
                  </p>
                </div>
              </div>
              {order.recipientPhone ? (
                <div className="flex gap-4">
                  <span className="w-36 shrink-0 text-secondary-500">
                    No. Telepon
                  </span>
                  <span className="text-tertiary-900">
                    : {order.recipientPhone}
                  </span>
                </div>
              ) : null}
              {order.deliveryNote ? (
                <div className="flex gap-4">
                  <span className="w-36 shrink-0 text-secondary-500">
                    Catatan
                  </span>
                  <span className="text-tertiary-900">
                    : {order.deliveryNote}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Detail item pesanan */}
          <div className="border-b border-gray-100 px-6 py-4">
            <p className="mb-3 text-sm font-semibold text-tertiary-900">
              Detail Pesanan
            </p>
            <div className="space-y-3">
              {orderItems.length > 0 ? (
                orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-tertiary-900">
                          {item.name}
                        </p>
                        {item.addOnLabels ? (
                          <p className="mt-1 text-xs leading-relaxed text-secondary-600">
                            {item.addOnLabels}
                          </p>
                        ) : null}
                      </div>
                      <p className="shrink-0 text-right text-sm text-secondary-500">
                        {formatRupiah(item.unitPrice)} / kotak
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 text-sm">
                      <span className="text-secondary-500">
                        Qty: {item.quantity} kotak
                      </span>
                      <span className="font-semibold text-tertiary-900">
                        {formatRupiah(item.total)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-secondary-500">
                  Detail item belum tersedia.
                </p>
              )}
            </div>


          </div>

          {/* Rincian pembayaran + lacak pesanan */}
          <div className="px-6 py-4">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              {/* Rincian biaya */}
              <div className="flex-1">
                <p className="mb-3 text-sm font-semibold text-tertiary-900">
                  Rincian Pembayaran
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-secondary-600">
                    <span>Subtotal</span>
                    <span>{formatRupiah(subTotal || order.total)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-2 font-semibold text-tertiary-900">
                    <span>Total Pesanan</span>
                    <span>{formatRupiah(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Status pengiriman + lacak */}
              <div className="flex flex-col gap-3 sm:items-end">
                {/* {orderStepLabel ? (
                  <div className="rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm">
                    <p className="font-semibold text-primary-700">
                      {orderStepLabel}
                    </p>
                  </div>
                ) : null} */}

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}