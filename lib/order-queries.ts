import type { Order } from "@/types/orders";
import type { OrderDetail } from "@/types/order-details";
import type { Invoice } from "@/types/invoices";
import {
  getOrderPaymentStatusLabel,
  getPrimaryInvoice,
  normalizeInvoices,
} from "@/lib/order-status";
import { sumOrderDetailsTotal } from "@/lib/order-totals";
import {
  getStrapiListData,
  getStrapiSingleData,
  unwrapStrapiEntity,
  unwrapStrapiList,
} from "@/lib/strapi-response";
import {
  buildStrapiHeaders,
  getStrapiBaseUrl,
  getStrapiToken,
} from "@/lib/strapi";

export type OrderListItem = {
  id: number;
  documentId: string;
  orderNo: string | null;
  createdAt: string | null;
  deliveryDate: string | null;
  deliveryAddress: string | null;
  total: number;
  paymentStatusLabel: string;
  invoiceNo: string | null;
};

export type OrderDetailView = OrderListItem & {
  recipientName: string | null;
  recipientPhone: string | null;
  deliveryNote: string | null;
  arriveTime: string | null;
  paymentStatus: string | null;
  orderDetails: Array<OrderDetail & { id: number; documentId?: string }>;
  invoices: Array<Invoice & { id: number; documentId?: string }>;
};

async function fetchStrapiJson(url: string, token: string | null) {
  const res = await fetch(url, {
    method: "GET",
    headers: buildStrapiHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      typeof body === "object" && body && "error" in body
        ? String((body as { error?: { message?: string } }).error?.message)
        : res.statusText;
    throw new Error(message || `Request gagal (${res.status})`);
  }

  return res.json();
}

export async function fetchOrdersByCustomerId(
  customerId: number,
  token?: string | null,
): Promise<Order[]> {
  const authToken = token !== undefined ? token : await getStrapiToken();
  const baseUrl = getStrapiBaseUrl();
  const search = new URLSearchParams({
    "filters[customer_id][id][$eq]": String(customerId),
    "sort[0]": "createdAt:desc",
    "pagination[pageSize]": "100",
    "populate[invoices][fields][0]": "invoice_no",
    "populate[invoices][fields][1]": "payment_status",
    "populate[invoices][fields][2]": "invoice_date",
  });

  let body: unknown;
  try {
    body = await fetchStrapiJson(
      `${baseUrl}/api/orders?${search}`,
      authToken,
    );
  } catch {
    const fallback = new URLSearchParams({
      "filters[customer_id][id][$eq]": String(customerId),
      "sort[0]": "createdAt:desc",
      "pagination[pageSize]": "100",
    });
    body = await fetchStrapiJson(
      `${baseUrl}/api/orders?${fallback}`,
      authToken,
    );
  }

  return unwrapStrapiList<Order>(getStrapiListData(body));
}

export async function fetchOrderDetailsForOrder(
  orderId: number,
  token?: string | null,
): Promise<Array<OrderDetail & { id: number; documentId?: string }>> {
  const authToken = token !== undefined ? token : await getStrapiToken();
  const baseUrl = getStrapiBaseUrl();
  const search = new URLSearchParams({
    "filters[order_id][id][$eq]": String(orderId),
    "pagination[pageSize]": "100",
    "fields[0]": "qty",
    "fields[1]": "selling_price",
    "fields[2]": "amount",
    "fields[3]": "total_amount",
  });

  const body = await fetchStrapiJson(
    `${baseUrl}/api/order-details?${search}`,
    authToken,
  );

  return unwrapStrapiList<OrderDetail>(getStrapiListData(body));
}

export async function fetchOrderByDocumentId(
  documentId: string,
  token?: string | null,
): Promise<Order | null> {
  const authToken = token !== undefined ? token : await getStrapiToken();
  const baseUrl = getStrapiBaseUrl();

  const byDocumentSearch = new URLSearchParams({
    "filters[documentId][$eq]": documentId,
    "pagination[pageSize]": "1",
    "populate[invoices][fields][0]": "invoice_no",
    "populate[invoices][fields][1]": "payment_status",
    "populate[invoices][fields][2]": "invoice_date",
  });

  try {
    const listBody = await fetchStrapiJson(
      `${baseUrl}/api/orders?${byDocumentSearch}`,
      authToken,
    );
    const rows = unwrapStrapiList<Order>(getStrapiListData(listBody));
    if (rows[0]) return rows[0];
  } catch {
    // fallback ke lookup by id numerik
  }

  if (/^\d+$/.test(documentId)) {
    try {
      const singleBody = await fetchStrapiJson(
        `${baseUrl}/api/orders/${documentId}`,
        authToken,
      );
      return unwrapStrapiEntity<Order>(
        getStrapiSingleData(singleBody) as Parameters<
          typeof unwrapStrapiEntity<Order>
        >[0],
      );
    } catch {
      return null;
    }
  }

  return null;
}

async function buildOrderTotal(
  order: Order,
  token: string | null,
): Promise<number> {
  const embedded = unwrapStrapiList<OrderDetail>(order.order_details ?? []);
  if (embedded.length) return sumOrderDetailsTotal(embedded);
  return sumOrderDetailsTotal(await fetchOrderDetailsForOrder(order.id, token));
}

export async function mapOrderToListItem(
  order: Order,
  token: string | null,
): Promise<OrderListItem> {
  const invoice = getPrimaryInvoice(order.invoices);
  const total = await buildOrderTotal(order, token);

  return {
    id: order.id,
    documentId: order.documentId ?? String(order.id),
    orderNo: order.order_no ?? null,
    createdAt: order.createdAt ?? order.created_date ?? null,
    deliveryDate: order.delivery_date ?? null,
    deliveryAddress: order.delivery_address ?? null,
    total,
    paymentStatusLabel: getOrderPaymentStatusLabel(order.invoices),
    invoiceNo: invoice?.invoice_no ?? null,
  };
}

export async function mapOrderToDetailView(
  order: Order,
  token: string | null,
): Promise<OrderDetailView> {
  const listItem = await mapOrderToListItem(order, token);
  const orderDetails = await fetchOrderDetailsForOrder(order.id, token);
  const invoices = normalizeInvoices(order.invoices);

  return {
    ...listItem,
    recipientName: order.recipient_name ?? null,
    recipientPhone: order.recipient_phone_no ?? null,
    deliveryNote: order.delivery_note ?? null,
    arriveTime: order.arrive_time ?? null,
    paymentStatus: invoices[0]?.payment_status ?? null,
    orderDetails,
    invoices,
  };
}
