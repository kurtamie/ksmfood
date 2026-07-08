"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { OrderDetailView } from "@/lib/order-queries";
import { parseAmount } from "@/lib/order-totals";
import { getDishSurcharge } from "@/components/landing/services/dish-surcharge";
import type { OrderDisplayStep } from "@/types/orders";
import { OrderStepper } from "@/components/OrderStepper";
import type { InvoiceStatus } from "@/types/invoices";

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

function formatOrderDate(value: string | null, locale: string, withTime = false) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const localeKey = locale === "en" ? "en-US" : "id-ID";
  const day = date.getDate();
  const month = date.toLocaleDateString(localeKey, { month: "short" });
  const year = date.getFullYear();

  if (!withTime) {
    return `${day} ${month} ${year}`;
  }

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year}, ${hours}.${minutes} WIB`;
}

type OrderMenuRow = OrderDetailView["orderMenus"][number];
type OrderDetailRow = OrderDetailView["orderDetails"][number];
type InvoiceRow = OrderDetailView["invoices"][number];

type OrderDisplayItem = {
  id: string;
  name: string;
  packageName: string | null;
  addOnLabels: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

type SessionAddOn = { label: string; value?: string; price: number };
type SessionSummaryItem = {
  id?: string | number;
  basePrice?: number | string;
  quantity?: number | string;
  addOns?: SessionAddOn[];
};
type SessionSummary = {
  items?: SessionSummaryItem[];
  orderId?: string | number | null;
  documentId?: string | null;
};

type ExtraChargeRow = {
  key: string;
  label: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

type StoredOrderSummaryPayment = {
  orderId?: string | number | null;
  documentId?: string | null;
  invoiceId?: number | null;
  invoiceDocumentId?: string | null;
  snapToken?: string | null;
  snapRedirectUrl?: string | null;
  midtransOrderId?: string | null;
};

function isTumpengPackage(
  packageName: string | null,
  productName: string | null | undefined,
): boolean {
  return /tumpeng/i.test(`${packageName ?? ""} ${productName ?? ""}`);
}

function buildMenuLabels(
  menu: OrderMenuRow,
  packageName: string | null,
  productName: string | null | undefined,
): string {
  if (isTumpengPackage(packageName, productName)) return "";

  return [
    menu.rice,
    menu.main_dish,
    menu.main_dish2,
    menu.main_dish3,
    menu.additional_dish,
    menu.vegetable,
    menu.sauce,
    menu.chip,
    menu.fruit,
    menu.mineral_water,
    menu.box,
    menu.pudding,
    menu.snack,
    menu.snack2,
    menu.snack3,
    menu.snack4,
  ]
    .filter(Boolean)
    .join(", ");
}

function getSnackBoxExtraCharge(label: string | null | undefined): number {
  if (!label) return 0;
  // If label explicitly includes surcharge marker, honor it
  if (/\(\+Rp\s*2\.000\)$/.test(label.trim())) return 2000;
  // Fallback: detect by dish name using shared surcharge list
  try {
    const name = label.replace(/\s*\(\+Rp.*\)$/, "").trim();
    return getDishSurcharge(name);
  } catch {
    return 0;
  }
}

function buildExtraChargeRowsFromMenus(
  menus: OrderMenuRow[],
  details: OrderDetailRow[],
): ExtraChargeRow[] {
  return menus.flatMap((menu, menuIndex) => {
    const quantity =
      parseAmount(details[menuIndex]?.qty) || parseAmount(details[0]?.qty) || 1;

    return [menu.snack, menu.snack2, menu.snack3, menu.snack4]
      .map((label) => ({
        label,
        surcharge: getSnackBoxExtraCharge(label),
      }))
      .filter((entry) => entry.surcharge > 0)
      .map((entry, addonIndex) => ({
        key: `${menu.documentId ?? menu.id ?? menuIndex}-snack-${addonIndex}`,
        label: entry.label
          ? entry.label.replace(/\s*\(\+Rp\s*2\.000\)$/, "")
          : "",
        quantity,
        unitPrice: entry.surcharge,
        total: entry.surcharge * quantity,
      }));
  });
}

function toOrderDisplayItems(
  menus: OrderMenuRow[],
  details: OrderDetailRow[],
  packageName: string | null,
  productName: string | null | undefined,
): OrderDisplayItem[] {
  if (details.length === 1) {
    const detail = details[0];
    const quantity = parseAmount(detail.qty) || 1;
    const unitPrice = parseAmount(detail.selling_price);
    const total =
      parseAmount(detail.total_amount ?? detail.amount) || quantity * unitPrice;
    const displayName = [productName, packageName]
      .filter(Boolean)
      .join(" - ");
    const fallbackName = displayName || "Menu Pesanan";
    return [
      {
        id: String(detail.documentId ?? detail.id ?? "order-detail"),
        name: fallbackName,
        packageName,
        addOnLabels: menus
          .map((menu) => buildMenuLabels(menu, packageName, productName))
          .filter(Boolean)
          .join(" | "),
        quantity,
        unitPrice,
        total,
      },
    ];
  }

  const rowCount = Math.max(menus.length, details.length);
  const baseName = [productName, packageName].filter(Boolean).join(" - ") || "Menu Pesanan";
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
        detail?.documentId ??
          detail?.id ??
          menu?.documentId ??
          menu?.id ??
          index,
      ),
      name:
        rowCount > 1
          ? `${baseName} ${index + 1}`
          : baseName,
      packageName,
      addOnLabels: menu ? buildMenuLabels(menu, packageName, productName) : "",
      quantity,
      unitPrice,
      total,
    };
  });
}

/** Ambil invoice utama (index 0) dari array invoices */
function getPrimaryInvoiceFromArray(invoices: InvoiceRow[]): InvoiceRow | null {
  return invoices?.[0] ?? null;
}

function getInvoiceSnapToken(invoice: InvoiceRow | null): string | null {
  return invoice?.midtrans_snap_token ?? null;
}

function getInvoiceSnapRedirectUrl(invoice: InvoiceRow | null): string | null {
  return invoice?.midtrans_redirect_url ?? null;
}

function getInvoiceMidtransOrderId(invoice: InvoiceRow | null): string | null {
  return invoice?.midtrans_order_id ?? null;
}

function getStoredOrderSummaryPayment(
  order: OrderDetailView,
): StoredOrderSummaryPayment | null {
  try {
    const raw = window.sessionStorage.getItem("ksm_order_summary");
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredOrderSummaryPayment;
    const sameOrderId =
      parsed.orderId != null && String(parsed.orderId) === String(order.id);
    const sameDocumentId =
      parsed.documentId != null && parsed.documentId === order.documentId;

    if (!sameOrderId && !sameDocumentId) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function persistStoredPaymentToInvoice(
  invoice: InvoiceRow | null,
  storedPayment: StoredOrderSummaryPayment,
) {
  const invoiceDocumentId =
    invoice?.documentId ?? storedPayment.invoiceDocumentId ?? null;

  if (!invoiceDocumentId) return;
  if (
    !storedPayment.snapToken &&
    !storedPayment.snapRedirectUrl &&
    !storedPayment.midtransOrderId
  ) {
    return;
  }

  await fetch(`/api/invoices/${invoiceDocumentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...(storedPayment.midtransOrderId
        ? { midtrans_order_id: storedPayment.midtransOrderId }
        : {}),
      ...(storedPayment.snapToken
        ? {
            midtrans_snap_token: storedPayment.snapToken,
          }
        : {}),
      ...(storedPayment.snapRedirectUrl
        ? {
            midtrans_redirect_url: storedPayment.snapRedirectUrl,
          }
        : {}),
    }),
  });
}

function isOverduePaymentStatus(status: string | null | undefined): boolean {
  return status === "overdue" || status === "expired";
}

function isUnpaidPaymentStatus(status: string | null | undefined): boolean {
  return !status || status === "unpaid";
}

function getPaymentStatusKey(
  paymentStatus: string | null | undefined,
): InvoiceStatus {
  if (
    paymentStatus === "paid" ||
    paymentStatus === "unpaid" ||
    paymentStatus === "overdue" ||
    paymentStatus === "expired"
  ) {
    return paymentStatus;
  }
  return "unpaid";
}

function getDisplayOrderStep(
  step: OrderDetailView["step"],
  paymentStatus: string | null | undefined,
): OrderDisplayStep | null {
  if (!step) return null;
  // Jika pembayaran belum lunas (unpaid) atau sudah jatuh tempo (overdue/expired),
  // tampilkan step "menunggu pembayaran" bukan packing
  if (
    step === "packing" &&
    (isUnpaidPaymentStatus(paymentStatus) ||
      isOverduePaymentStatus(paymentStatus))
  ) {
    return "waiting_payment";
  }
  return step;
}

export default function OrderDetailPage() {
  const t = useTranslations("orderDetail");
  const locale = useLocale();
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

  const fetchOrderData = useCallback(async () => {
    if (!documentId) {
      throw new Error("ID pesanan tidak valid.");
    }

    const res = await fetch(
      `/api/orders/mine/${encodeURIComponent(documentId)}`,
      { cache: "no-store" },
    );

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      // The server returned something other than JSON (e.g. Next.js's
      // default HTML 404 page), which means the route itself isn't being
      // matched rather than the order lookup failing.
      if (res.status === 404) {
        throw new Error(
          "Endpoint pesanan tidak ditemukan (404). Periksa apakah route API /api/orders/mine/[documentId] sudah dibuat dengan benar.",
        );
      }
      throw new Error(
        `Server mengembalikan respons tidak valid (status ${res.status}).`,
      );
    }

    const json = await res.json();
    if (!res.ok || !json?.success) {
      throw new Error(
        typeof json?.error === "string"
          ? json.error
          : "Gagal memuat detail pesanan.",
      );
    }

    return json.data as OrderDetailView;
  }, [documentId]);

  useEffect(() => {
    let cancelled = false;

    async function loadOrder() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchOrderData();
        if (!cancelled) setOrder(data);
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
  }, [fetchOrderData]);

  const handleResumePayment = useCallback(async () => {
    setPayError(null);
    setPaymentMessage(null);

    if (!order) return;

    const primaryInvoice = getPrimaryInvoiceFromArray(order.invoices);
    const invoicePaymentStatus =
      primaryInvoice?.payment_status ?? order.paymentStatus;
    let snapToken = getInvoiceSnapToken(primaryInvoice);
    let snapRedirectUrl = getInvoiceSnapRedirectUrl(primaryInvoice);
    let midtransOrderId = getInvoiceMidtransOrderId(primaryInvoice);

    if (!snapToken && !snapRedirectUrl) {
      const storedPayment = getStoredOrderSummaryPayment(order);
      if (storedPayment) {
        snapToken = storedPayment.snapToken ?? null;
        snapRedirectUrl = storedPayment.snapRedirectUrl ?? null;
        midtransOrderId = storedPayment.midtransOrderId ?? midtransOrderId;

        if (snapToken || snapRedirectUrl || midtransOrderId) {
          void persistStoredPaymentToInvoice(primaryInvoice, storedPayment);
        }
      }
    }

    if (isOverduePaymentStatus(invoicePaymentStatus)) {
      setPayError(
        "Invoice sudah jatuh tempo. Pembayaran tidak dapat dilanjutkan.",
      );
      return;
    }

    if (midtransOrderId) {
      try {
        const syncRes = await fetch("/api/midtrans/sync-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ midtransOrderId }),
        });
        const syncJson = await syncRes.json().catch(() => null);

        if (
          syncJson?.paymentStatus === "overdue" ||
          syncJson?.paymentStatus === "expired"
        ) {
          const updatedOrder = await fetchOrderData().catch(() => null);
          if (updatedOrder) setOrder(updatedOrder);
          setPayError(
            "Invoice sudah jatuh tempo. Pembayaran tidak dapat dilanjutkan.",
          );
          return;
        }

        if (syncJson?.paymentStatus === "paid") {
          const updatedOrder = await fetchOrderData().catch(() => null);
          if (updatedOrder) setOrder(updatedOrder);
          setPaymentMessage("Pembayaran sudah terkonfirmasi.");
          router.refresh();
          return;
        }
      } catch {
        // Jika status check gagal, user masih bisa mencoba membuka Snap lama.
      }
    }

    if (!snapToken && !snapRedirectUrl) {
      if (!clientKey) {
        setPayError("Midtrans client key belum dikonfigurasi.");
        return;
      }
      if (!snapReady || !window.snap?.pay) {
        setPayError("Halaman pembayaran gagal dimuat. Silakan muat ulang halaman untuk melanjutkan pembayaran.");
        return;
      }

      setIsPaying(true);
      try {
        const tokenRes = await fetch("/api/midtrans/snap-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            grossAmount: order.total,
            customerName: order.recipientName,
            customerPhone: order.recipientPhone,
            invoiceDocumentId: primaryInvoice?.documentId,
            invoiceId: primaryInvoice?.id,
          }),
        });
        const tokenJson = await tokenRes.json();

        if (!tokenRes.ok || !tokenJson?.success) {
          throw new Error(
            typeof tokenJson?.error === "string"
              ? tokenJson.error
              : "Gagal membuka pembayaran Midtrans.",
          );
        }

        snapToken = tokenJson.token ?? null;
        snapRedirectUrl = tokenJson.redirectUrl ?? null;
        midtransOrderId = tokenJson.midtransOrderId ?? midtransOrderId;

        const updatedOrder = await fetchOrderData().catch(() => null);
        if (updatedOrder) setOrder(updatedOrder);
      } catch (err) {
        setPayError(
          err instanceof Error ? err.message : "Gagal memulai pembayaran.",
        );
        setIsPaying(false);
        return;
      }
    }
    const snapPay = window.snap?.pay;

    if (snapToken && !clientKey) {
      setPayError("Midtrans client key belum dikonfigurasi.");
      return;
    }
    if (snapToken && (!snapReady || !snapPay)) {
      setPayError("Halaman pembayaran gagal dimuat. Silakan muat ulang halaman untuk melanjutkan pembayaran.");
      return;
    }

    setIsPaying(true);

    try {
      if (!snapToken && snapRedirectUrl) {
        // Jangan redirect kalau belum ada midtransOrderId yang valid
        // (artinya URL lama bisa saja sudah expired dan tidak di-sync)
        if (!midtransOrderId) {
          setPayError(
            "URL pembayaran sudah tidak valid. Coba refresh halaman untuk mendapatkan token baru.",
          );
          setIsPaying(false);
          return;
        }
        window.location.href = snapRedirectUrl;
        return;
      }
      if (!snapPay) {
        throw new Error("Halaman pembayaran gagal dimuat. Silakan muat ulang halaman untuk melanjutkan pembayaran.");
      }
      if (!snapToken) {
        throw new Error(
          "Data pembayaran Midtrans lama tidak tersedia untuk invoice ini.",
        );
      }

      snapPay(snapToken, {
        onSuccess: async () => {
          try {
            // Ambil invoice dari array invoices di order
            const primaryInvoice = getPrimaryInvoiceFromArray(order.invoices);
            const invoiceDocId = primaryInvoice?.documentId;
            const invoiceNumId = primaryInvoice?.id;
            const numericOrderId = order.id;

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
            const updatedOrder = await fetchOrderData().catch(() => null);
            if (updatedOrder) setOrder(updatedOrder);
            setIsPaying(false);
            router.refresh();
          }
        },
        onPending: async () => {
          setPaymentMessage(
            "Pembayaran menunggu konfirmasi. Status akan diperbarui setelah selesai.",
          );
          const updatedOrder = await fetchOrderData().catch(() => null);
          if (updatedOrder) setOrder(updatedOrder);
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
  }, [clientKey, documentId, fetchOrderData, order, router, snapReady]);

  // ── Loading & error states ────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-sm text-secondary-600">{t("loading")}</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-sm text-red-600">
          {error ?? t("notFound")}
        </p>
        <Link
          href="/pesanan"
          className="mt-4 inline-flex text-sm font-semibold text-primary-600 hover:underline"
        >
          {t("actions.backToHistory")}
        </Link>
      </div>
    );
  }

  // ── Derived values ────────────────────────────────────────────────────────

  const primaryInvoice = getPrimaryInvoiceFromArray(order.invoices);
  const invoicePaymentStatus =
    primaryInvoice?.payment_status ?? order.paymentStatus;
  const paymentStatusKey = getPaymentStatusKey(invoicePaymentStatus);
  const paid = paymentStatusKey === "paid";
  const paymentOverdue = isOverduePaymentStatus(invoicePaymentStatus);

  const orderItems = toOrderDisplayItems(
    order.orderMenus,
    order.orderDetails,
    order.packageName,
    order.product,
  );
  const detailSubtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  // If a draft/order summary exists in sessionStorage (created from order-info),
  // prefer showing subtotal and extra charge breakdown from that summary.
  const sessionSummary: SessionSummary | null = (() => {
    try {
      if (typeof window === "undefined") return null;
      const raw = window.sessionStorage.getItem("ksm_order_summary");
      if (!raw) return null;
      const parsed = JSON.parse(raw) as SessionSummary;
      // Only use the stored summary when it belongs to the same order/document
      const sameOrderId = parsed?.orderId != null && String(parsed.orderId) === String(order.id);
      const sameDocumentId = parsed?.documentId != null && parsed.documentId === order.documentId;
      if (!sameOrderId && !sameDocumentId) return null;
      return parsed;
    } catch {
      return null;
    }
  })();

  const extraChargeRowsFromMenus = buildExtraChargeRowsFromMenus(
    order.orderMenus,
    order.orderDetails,
  );

  const extraChargeRows: ExtraChargeRow[] = sessionSummary?.items
    ? (sessionSummary.items ?? []).flatMap((item: SessionSummaryItem) =>
        (item.addOns ?? [])
          .filter((a: SessionAddOn) => Number(a?.price) > 0)
          .map((a: SessionAddOn) => ({
            key: `${item.id}-${a.value ?? a.label}`,
            label: a.label,
            quantity: Number(item.quantity) || 1,
            unitPrice: Number(a.price) || 0,
            total: (Number(a.price) || 0) * (Number(item.quantity) || 1),
          })),
      )
    : extraChargeRowsFromMenus;

  const extraChargeTotal = extraChargeRows.reduce((s, r) => s + r.total, 0);

  const sessionBaseSubtotal: number | null = sessionSummary?.items
    ? sessionSummary.items.reduce((sum: number, item: SessionSummaryItem) => {
        const base = Number(item.basePrice) || 0;
        const qty = Number(item.quantity) || 1;
        return sum + base * qty;
      }, 0)
    : extraChargeTotal > 0
    ? order.total - extraChargeTotal
    : null;

  const itemDisplayTotals = orderItems.map((item, index) => {
    const sessionItem = sessionSummary?.items?.[index];
    if (!sessionItem) return item.total;

    const basePrice = Number(sessionItem.basePrice) || 0;
    const quantity = Number(sessionItem.quantity) || 1;
    const addOnTotal = (sessionItem.addOns ?? []).reduce(
      (sum, addOn) => sum + (Number(addOn.price) || 0),
      0,
    );

    return basePrice * quantity + addOnTotal * quantity;
  });
  const displayOrderStep = getDisplayOrderStep(
    order.step,
    invoicePaymentStatus,
  );
  const orderStepLabel = displayOrderStep
    ? t(`steps.${displayOrderStep}`)
    : null;

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
          onError={() =>
            setPayError("Halaman pembayaran gagal dimuat. Silakan muat ulang halaman untuk melanjutkan pembayaran.")
          }
        />
      ) : null}

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Header */}

        <h1 className="mb-5 text-2xl font-semibold text-tertiary-900">
          {t("title")}
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

        {/* Banner pesanan tidak valid karena jatuh tempo */}
        {paymentOverdue && !paid ? (
          <div className="mb-4 overflow-hidden rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm font-semibold text-red-700">
              {t("expiredBanner.title")}
            </p>
            <p className="mt-1 text-sm text-red-600">
              {t("expiredBanner.description")}
            </p>
            <Link
              href="/#layanan"
              className="mt-3 inline-flex items-center gap-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              {t("actions.createNewOrder")}
            </Link>
          </div>
        ) : null}

        {/* Card utama */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Baris status + tombol lanjutkan pembayaran */}
          <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <span className="text-sm text-secondary-500">
                {t("paymentStatus")}
              </span>
              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                  paid
                    ? "bg-emerald-100 text-emerald-700"
                    : paymentOverdue
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                }`}
              >
                {t(`paymentStatuses.${paymentStatusKey}`)}
              </span>
            </div>

            {!paid && !paymentOverdue ? (
              <button
                type="button"
                onClick={() => void handleResumePayment()}
                disabled={isPaying}
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPaying ? t("actions.openingPayment") : t("actions.resumePayment")}
              </button>
            ) : null}
          </div>

          {/* Status pesanan — hanya muncul kalau sudah lunas dan ada step */}
          {displayOrderStep ? (
            <div className="border-b border-gray-100 px-4 py-5 sm:px-6">
              <p className="mb-4 text-sm font-semibold text-tertiary-900">
                {t("orderStatus")}: {orderStepLabel}
              </p>
              <OrderStepper
                currentStep={displayOrderStep}
                isExpired={paymentOverdue}
                bannerAction={
                  displayOrderStep === "success" && order.imageReceive?.length ? (
                    <a
                      href={
                        order.imageReceive[0]?.url ?? order.imageReceive[0]?.previewUrl ?? "#"
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex text-xs font-semibold text-primary-600 hover:underline"
                    >
                      {t("proofLink")}
                    </a>
                  ) : null
                }
              />
            </div>
          ) : null}

          {/* Tanggal pemesanan & nomor tagihan */}
          <div className="grid gap-4 text-sm md:grid-cols-2 px-6 py-3">
              <div className="flex gap-4">
                <span className="w-36 shrink-0 text-[#6B7280]">
                  {t("orderedAt")}
                </span>
                <span className="text-tertiary-900">
                  : {formatOrderDate(order.createdAt, locale, true)}
                </span>
              </div>
              <div className="flex gap-4">
                <span className="w-36 shrink-0 text-[#6B7280]">
                  {t("invoiceNo")}
                </span>
                <span className="text-tertiary-900">
                  : {order.invoiceNo ??
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
              {t("deliveryInfo")}
            </p>
            <div className="grid gap-4 text-sm md:grid-cols-2">
              <div className="space-y-2">
                {order.recipientName ? (
                  <div className="flex gap-4">
                    <span className="w-36 shrink-0 text-[#6B7280]">
                      {t("recipientName")}
                    </span>
                    <span className="text-tertiary-900">
                      : {order.recipientName}
                    </span>
                  </div>
                ) : null}

                <div className="flex gap-4">
                  <span className="w-36 shrink-0 text-[#6B7280]">
                    {t("deliveryMethod")}
                  </span>
                  <span className="text-tertiary-900">
                    : {t("deliveryByKsm")}
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="w-36 shrink-0 text-[#6B7280]">
                    {t("deliveryDate")}
                  </span>
                  <span className="text-tertiary-900">
                    :{" "}
                    {order.deliveryDate
                      ? `${formatOrderDate(order.deliveryDate, locale)}${order.arriveTime ? " " + order.arriveTime : ""}`
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex gap-4">
                  <span className="w-36 shrink-0 text-[#6B7280]">{t("address")}</span>
                  <div className="min-w-0 flex-1 text-tertiary-900">
                    <p className="whitespace-pre-line">
                      : {order.deliveryAddress || "-"}
                    </p>
                  </div>
                </div>
                {order.recipientPhone ? (
                  <div className="flex gap-4">
                    <span className="w-36 shrink-0 text-[#6B7280]">
                      {t("phoneNo")}
                    </span>
                    <span className="text-tertiary-900">
                      : {order.recipientPhone}
                    </span>
                  </div>
                ) : null}
                {order.deliveryNote ? (
                  <div className="flex gap-4">
                    <span className="w-36 shrink-0 text-[#6B7280]">
                      {t("notes")}
                    </span>
                    <span className="text-tertiary-900">
                      : {order.deliveryNote}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Detail item pesanan */}
          <div className="border-b border-gray-100 px-6 py-4">
            <p className="mb-3 text-sm font-semibold text-tertiary-900">
              {t("orderItems")}
            </p>
            <div className="space-y-3">
              {orderItems.length > 0 ? (
                orderItems.map((item, index) => (
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
                      <p className="shrink-0 text-right text-sm text-secondary-700">
                        {formatRupiah(item.unitPrice)} / {t("unit")}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 text-sm">
                      <span className="text-secondary-700">
                        {t("qty")}: {item.quantity} {t("unit")}
                      </span>
                      <span className="font-semibold text-tertiary-900">
                        {sessionSummary != null && extraChargeTotal > 0
                          ? formatRupiah(itemDisplayTotals[index])
                          : formatRupiah(item.total)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-secondary-500">
                  {t("emptyItems")}
                </p>
              )}
            </div>
          </div>

          {/* Payment details */}
          <div className="border-b border-gray-100 px-6 py-4">
            <p className="mb-3 text-sm font-semibold text-tertiary-900">
              {t("paymentDetails")}
            </p>
              <div className="space-y-3 text-sm text-secondary-700">
              {sessionBaseSubtotal != null && extraChargeTotal > 0 ? (
                <>
                  <div className="flex justify-between text-sm text-secondary-600">
                    <span>{t("subtotal")}</span>
                    <span>{formatRupiah(sessionBaseSubtotal)}</span>
                  </div>
                  {extraChargeRows.map((row) => (
                    <div
                      key={row.key}
                      className="flex justify-between text-sm text-secondary-600"
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

                  <div className="border-t border-gray-100 pt-2 text-base font-semibold text-tertiary-900">
                    <div className="flex justify-between">
                      <span>{t("total")}</span>
                      <span>{formatRupiah(order.total)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {detailSubtotal === order.total ? (
                    <div className="flex justify-between">
                      <span>{t("subtotal")}</span>
                      <span>{formatRupiah(detailSubtotal)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between items-center border-t border-gray-100 pt-3 text-lg font-semibold text-tertiary-900">
                    <span>{t("total")}</span>
                    <span>{formatRupiah(order.total)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}