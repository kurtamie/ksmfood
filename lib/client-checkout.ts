"use client";

import type { CartItem } from "@/components/CartContext";
import { getItemTotalPrice } from "@/components/CartContext";
import {
  hasOrderMenuValues,
  mergeCartItems,
  parseCartItemToOrderDetail,
  parseCartItemToOrderMenu,
} from "@/lib/cart-order-payload";

type CheckoutOrderResult = {
  orderId: number | string | null;
  orderDocumentId: string;
  invoiceId: number | null;
  invoiceDocumentId: string | null;
  items: CartItem[];
  subtotal: number;
};

export async function createCheckoutOrder(
  items: CartItem[],
  customer?: { id?: number; documentId?: string | null } | null,
): Promise<CheckoutOrderResult> {
  const checkoutItems = mergeCartItems(items);
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + getItemTotalPrice(item),
    0,
  );

  const packageName = checkoutItems[0]?.packageName || "Paket Katering";
  const productName = checkoutItems[0]?.category || packageName;
  const orderMenus = checkoutItems
    .map(parseCartItemToOrderMenu)
    .filter(hasOrderMenuValues);

  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer_id: customer?.id,
      customer_document_id: customer?.documentId,
      customer_type: "personal",
      package_name: packageName,
      product: productName,
      order_menus: orderMenus,
      order_details: checkoutItems.map(parseCartItemToOrderDetail),
    }),
  });

  const result = await response.json();

  if (!response.ok || !result?.success) {
    throw new Error(
      typeof result?.error === "string"
        ? result.error
        : "Gagal membuat pesanan. Coba lagi.",
    );
  }

  const orderRecord = result.data?.data ?? result.data ?? null;
  const orderId = orderRecord?.id ?? result.data?.id ?? result.id ?? null;
  const orderDocumentId =
    orderRecord?.documentId ?? (orderId != null ? String(orderId) : null);

  if (!orderDocumentId) {
    throw new Error("Gagal mendapatkan ID pesanan dari server.");
  }

  window.sessionStorage.setItem(
    "ksm_order_summary",
    JSON.stringify({
      orderId,
      documentId: orderDocumentId,
      invoiceId: result.invoiceId ?? null,
      invoiceDocumentId: result.invoiceDocumentId ?? null,
      items: checkoutItems,
      totals: { subtotal },
    }),
  );

  return {
    orderId,
    orderDocumentId,
    invoiceId: result.invoiceId ?? null,
    invoiceDocumentId: result.invoiceDocumentId ?? null,
    items: checkoutItems,
    subtotal,
  };
}
