"use client";

import Script from "next/script";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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
  addOns: Array<{ label: string; value?: string; price: number }>;
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
  invoiceId?: number | null;
  invoiceDocumentId?: string | null;
  snapToken?: string | null;
  snapRedirectUrl?: string | null;
  midtransOrderId?: string | null;
};

function saveOrderSummary(summary: OrderSummary) {
  window.sessionStorage.setItem("ksm_order_summary", JSON.stringify(summary));
}

function calculateTotal(items: OrderItem[] | undefined): number {
  if (!items || items.length === 0) return 0;
  return items.reduce((sum, item) => {
    const addOnTotal = item.addOns.reduce((s, a) => s + a.price, 0);
    const unitPrice = item.basePrice + addOnTotal;
    return sum + unitPrice * item.quantity;
  }, 0);
}

function getSummarySubtotal(summary: OrderSummary | null): number {
  const savedSubtotal = summary?.totals?.subtotal;
  if (typeof savedSubtotal === "number" && Number.isFinite(savedSubtotal)) {
    return savedSubtotal;
  }
  return calculateTotal(summary?.items);
}

export default function OrderSummaryPage() {
  const t = useTranslations("orderInfo");
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

  const total = useMemo(() => getSummarySubtotal(summary), [summary]);
  const extraChargeRows = useMemo(
    () =>
      (summary?.items ?? []).flatMap((item) =>
        item.addOns
          .filter((addOn) => addOn.price > 0)
          .map((addOn) => ({
            key: `${item.id}-${addOn.value ?? addOn.label}`,
            label: addOn.label,
            quantity: item.quantity,
            unitPrice: addOn.price,
            total: addOn.price * item.quantity,
          })),
      ),
    [summary?.items],
  );

  const numericOrderId = useMemo(() => {
    const fromSummary = Number(summary?.orderId);
    if (Number.isFinite(fromSummary) && fromSummary > 0) return fromSummary;
    const fromParam = Number(documentId);
    if (Number.isFinite(fromParam) && fromParam > 0) return fromParam;
    return null;
  }, [documentId, summary?.orderId]);

  const markInvoicePaid = useCallback(
    async () => {
      const invoiceDocId = summary?.invoiceDocumentId;
      const invoiceNumId = summary?.invoiceId;

      if (!invoiceDocId && !invoiceNumId && !numericOrderId) {
        console.warn("[markInvoicePaid] Tidak ada invoice/order id. Skip.");
        return;
      }

      const res = invoiceDocId
        ? await fetch(`/api/invoices/${invoiceDocId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ payment_status: "paid" }),
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
            : t("errors.updateInvoiceFailed"),
        );
      }
    },
    // Pakai summary sebagai satu objek — fix React Compiler warning
    [documentId, numericOrderId, summary, t],
  );

  const handlePayNow = useCallback(async () => {
    setPayError(null);
    setPaymentMessage(null);

    if (numericOrderId == null) {
      setPayError(t("errors.invalidOrderId"));
      return;
    }

    if (total <= 0) {
      setPayError(t("errors.paymentTotalUnavailable"));
      return;
    }

    if (!clientKey) {
      setPayError(t("errors.midtransClientKeyMissing"));
      return;
    }

    if (!snapReady || !window.snap?.pay) {
      setPayError(t("errors.paymentPageUnavailable"));
      return;
    }

    setIsPaying(true);

    try {
      let snapToken = summary?.snapToken ?? null;

      if (!snapToken) {
        const res = await fetch("/api/midtrans/snap-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: numericOrderId,
            grossAmount: total,
            customerName: summary?.recipientName,
            customerPhone: summary?.recipientPhone,
            invoiceDocumentId: summary?.invoiceDocumentId,
            invoiceId: summary?.invoiceId,
          }),
        });
        const json = await res.json();

        if (!res.ok || !json?.success || !json?.token) {
          throw new Error(
            typeof json?.error === "string"
              ? json.error
              : t("errors.openPaymentFailed"),
          );
        }

        snapToken = json.token;

        setSummary((current) => {
          if (!current) return current;
          const nextSummary = {
            ...current,
            snapToken,
            snapRedirectUrl: json.redirectUrl ?? null,
            midtransOrderId: json.midtransOrderId ?? null,
          };
          saveOrderSummary(nextSummary);
          return nextSummary;
        });
      }

      if (!snapToken) {
        throw new Error(t("errors.midtransDataUnavailable"));
      }

      window.snap.pay(snapToken, {
        onSuccess: async () => {
          try {
            await markInvoicePaid();
            setPaymentMessage(
              t("payment.success"),
            );
            router.push("/pesanan");
          } catch (err) {
            console.error("[onSuccess] Gagal update invoice:", err);
            setPaymentMessage(
              t("payment.successPendingSync"),
            );
            router.push("/pesanan");
          } finally {
            setIsPaying(false);
          }
        },
        onPending: () => {
          setPaymentMessage(
            t("payment.pending"),
          );
          setIsPaying(false);
        },
        onError: () => {
          setPayError(t("payment.error"));
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
          : t("errors.startPaymentFailed"),
      );
      setIsPaying(false);
    }
    // Pakai summary sebagai satu objek — fix React Compiler warning
  }, [
    clientKey,
    numericOrderId,
    router,
    markInvoicePaid,
    snapReady,
    summary,
    t,
    total,
  ]);

  if (!summary) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-center text-sm text-secondary-600">
          {t("loadingSummary")}
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
        {/* Stepper */}
        <div className="mb-8">
          <div className="relative flex items-start justify-center">
            <div className="absolute left-1/4 right-1/4 top-[18px] h-px bg-gray-200" />
            <div className="grid w-full max-w-sm grid-cols-2">
              <div className="relative flex flex-col items-center gap-2 text-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-medium text-secondary-500">
                  1
                </div>
                <p className="text-xs text-secondary-500">
                  {t("steps.info")}
                </p>
              </div>
              <div className="relative flex flex-col items-center gap-2 text-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-medium text-white">
                  2
                </div>
                <p className="text-xs font-semibold text-tertiary-900">
                  {t("steps.summary")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <h1 className="mb-1 text-center text-xl font-semibold text-tertiary-900">
          {t("steps.summary")}
        </h1>
        <p className="mb-6 text-center text-xs text-secondary-500">
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

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.6fr_1fr]">
          {/* Kolom kiri — detail pesanan */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-1 text-sm font-semibold text-tertiary-900">
              {t("orderDetails")}
            </h2>
            <p className="mb-4 text-xs text-secondary-500">
              {t("itemCount", {
                count: summary.items?.length ?? 0,
                items: new Set(summary.items?.map((i) => i.id)).size,
              })}
            </p>

            <div className="space-y-3">
              {summary.items?.map((item) => {
                const addOnLabels = item.addOns.map((a) => a.label).join(", ");
                const unitPrice =
                  item.basePrice +
                  item.addOns.reduce((sum, a) => sum + a.price, 0);
                const itemTotal = unitPrice * item.quantity;
                return (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-tertiary-900">
                        {item.name}
                      </p>
                      {addOnLabels && (
                        <p className="mt-0.5 text-xs text-secondary-500">
                          + {addOnLabels}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs text-secondary-500">
                        {item.quantity} × {formatRupiah(unitPrice)}
                      </p>
                      <p className="text-sm font-semibold text-tertiary-900">
                        {formatRupiah(itemTotal)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
              {extraChargeRows.map((row) => (
                <div
                  key={row.key}
                  className="flex items-start justify-between gap-3 text-xs text-secondary-600"
                >
                  <span className="min-w-0">
                    {t("extraCharge")}: {row.label}
                    <span className="block text-secondary-500">
                      {row.quantity} x {formatRupiah(row.unitPrice)}
                    </span>
                  </span>
                  <span className="shrink-0">{formatRupiah(row.total)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-sm font-semibold text-tertiary-900">
                <span>{t("subtotal")}</span>
                <span>{formatRupiah(total)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-base font-semibold text-tertiary-900">
              <span>{t("payableTotal")}</span>
              <span>{formatRupiah(total)}</span>
            </div>
          </div>

          {/* Kolom kanan */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-tertiary-900">
                {t("shippingAddress")}
              </h2>
              <div className="space-y-1 text-sm text-secondary-600">
                {summary.addressName && <p>{summary.addressName}</p>}
                <p>{summary.addressLine || "-"}</p>
                <p>{summary.subdistrict || "-"}</p>
                {(summary.recipientName || summary.recipientPhone) && (
                  <p className="pt-1 text-xs text-secondary-500">
                    {summary.recipientName || "-"} •{" "}
                    {summary.recipientPhone || "-"}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-tertiary-900">
                {t("deliverySchedule")}
              </h2>
              <div className="space-y-1 text-sm text-secondary-600">
                <p>
                  {t("deliveryDateLabel")}:{" "}
                  {summary.deliveryDate
                    ? `${summary.deliveryDate}${summary.deliveryTime ? " " + summary.deliveryTime : ""}`
                    : "-"}
                </p>
                {summary.notes && (
                  <p className="pt-1 text-xs text-secondary-500">
                    {t("notesLabel")}: {summary.notes}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => void handlePayNow()}
              disabled={isPaying || total <= 0}
              className="w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPaying ? t("actions.openingPayment") : t("actions.payNow")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
