import type { InvoiceStatus } from "@/types/invoices";
import type { Invoice } from "@/types/invoices";
import {
  buildStrapiHeaders,
  getStrapiBaseUrl,
  getStrapiToken,
} from "@/lib/strapi";
import {
  getStrapiListData,
  unwrapStrapiEntity,
  unwrapStrapiList,
} from "@/lib/strapi-response";

function generateInvoiceNo(orderId: number): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `INV/${yy}${mm}${dd}${String(orderId).padStart(4, "0")}`;
}

export async function createInvoiceForOrder(
  orderId: number,
  paymentStatus: InvoiceStatus,
  options?: { invoiceNo?: string; token?: string | null },
) {
  const token =
    options?.token !== undefined ? options.token : await getStrapiToken();
  const baseUrl = getStrapiBaseUrl();
  const invoiceNo = options?.invoiceNo ?? generateInvoiceNo(orderId);
  const invoiceDate = new Date().toISOString().slice(0, 10);

  const payloads = [
    {
      invoice_no: invoiceNo,
      invoice_date: invoiceDate,
      payment_status: paymentStatus,
      orders: [orderId],
    },
    {
      invoice_no: invoiceNo,
      invoice_date: invoiceDate,
      payment_status: paymentStatus,
      orders: { connect: [orderId] },
    },
  ];

  let lastError = "Gagal menyimpan invoice.";

  for (const data of payloads) {
    const res = await fetch(`${baseUrl}/api/invoices`, {
      method: "POST",
      headers: buildStrapiHeaders(token),
      body: JSON.stringify({ data }),
    });

    const contentType = res.headers.get("content-type") ?? "";
    const body = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    if (res.ok) return body;

    lastError =
      typeof body === "object" && body && "error" in body
        ? String(
            (body as { error?: { message?: string } }).error?.message ??
              res.statusText,
          )
        : typeof body === "string"
          ? body
          : res.statusText;
  }

  throw new Error(lastError);
}

export async function updateInvoicePaymentStatus(
  invoiceId: number | string,
  paymentStatus: InvoiceStatus,
  token?: string | null,
  options?: { invoiceNo?: string },
) {
  const authToken = token !== undefined ? token : await getStrapiToken();
  const baseUrl = getStrapiBaseUrl();

  const res = await fetch(`${baseUrl}/api/invoices/${invoiceId}`, {
    method: "PUT",
    headers: buildStrapiHeaders(authToken),
    body: JSON.stringify({
      data: {
        payment_status: paymentStatus,
        ...(options?.invoiceNo ? { invoice_no: options.invoiceNo } : {}),
      },
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      typeof body === "object" && body?.error?.message
        ? body.error.message
        : "Gagal memperbarui invoice.",
    );
  }

  return res.json();
}

export async function findInvoiceByOrderId(
  orderId: number,
  token?: string | null,
): Promise<(Invoice & { id: number; documentId?: string }) | null> {
  const authToken = token !== undefined ? token : await getStrapiToken();
  const baseUrl = getStrapiBaseUrl();
  const query =
    `?filters[orders][id][$eq]=${orderId}` + "&pagination[pageSize]=1";

  const res = await fetch(`${baseUrl}/api/invoices${query}`, {
    method: "GET",
    headers: buildStrapiHeaders(authToken),
    cache: "no-store",
  });

  if (!res.ok) return null;

  const body = await res.json().catch(() => null);
  const rows = unwrapStrapiList<Invoice>(getStrapiListData(body));
  return rows[0] ?? null;
}

export async function updateInvoiceMidtransPaymentData(
  invoiceId: number | string,
  data: {
    midtransOrderId: string;
    snapToken?: string | null;
    redirectUrl?: string | null;
  },
  token?: string | null,
) {
  const authToken = token !== undefined ? token : await getStrapiToken();
  const baseUrl = getStrapiBaseUrl();

  const res = await fetch(`${baseUrl}/api/invoices/${invoiceId}`, {
    method: "PUT",
    headers: buildStrapiHeaders(authToken),
    body: JSON.stringify({
      data: {
        midtrans_order_id: data.midtransOrderId,
        midtrans_snap_token: data.snapToken ?? null,
        midtrans_redirect_url: data.redirectUrl ?? null,
        snap_token: data.snapToken ?? null,
        snap_redirect_url: data.redirectUrl ?? null,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      typeof body === "object" && body?.error?.message
        ? body.error.message
        : "Gagal menyimpan data pembayaran Midtrans.",
    );
  }

  return res.json();
}

export async function updateInvoiceMidtransPaymentDataByOrder(
  orderId: number,
  data: {
    midtransOrderId: string;
    snapToken?: string | null;
    redirectUrl?: string | null;
  },
  token?: string | null,
) {
  const invoice = await findInvoiceByOrderId(orderId, token);
  const identifier = invoice?.documentId ?? invoice?.id;

  if (!identifier) return null;

  return updateInvoiceMidtransPaymentData(identifier, data, token);
}

export async function updateInvoicePaymentStatusByMidtransOrder(
  orderId: number,
  midtransOrderId: string,
  paymentStatus: InvoiceStatus,
  options?: { invoiceNo?: string; token?: string | null },
) {
  const token =
    options?.token !== undefined ? options.token : await getStrapiToken();
  const invoice = await findInvoiceByOrderId(orderId, token);

  if (!invoice) {
    return createInvoiceForOrder(orderId, paymentStatus, {
      invoiceNo: options?.invoiceNo,
      token,
    });
  }

  const currentMidtransOrderId = invoice.midtrans_order_id;
  if (
    currentMidtransOrderId &&
    currentMidtransOrderId !== midtransOrderId &&
    paymentStatus !== "paid"
  ) {
    return null;
  }

  return updateInvoicePaymentStatus(
    invoice.documentId ?? invoice.id,
    paymentStatus,
    token,
    { invoiceNo: options?.invoiceNo },
  );
}

export async function updateInvoicePaymentStatusByOrder(
  orderId: number,
  paymentStatus: InvoiceStatus,
  options?: { invoiceNo?: string; token?: string | null },
) {
  const token =
    options?.token !== undefined ? options.token : await getStrapiToken();
  const baseUrl = getStrapiBaseUrl();
  const query =
    `?filters[orders][id][$eq]=${orderId}` + "&pagination[pageSize]=1";

  const findRes = await fetch(`${baseUrl}/api/invoices${query}`, {
    method: "GET",
    headers: buildStrapiHeaders(token),
    cache: "no-store",
  });

  if (!findRes.ok) {
    const body = await findRes.json().catch(() => null);
    throw new Error(
      typeof body === "object" && body?.error?.message
        ? body.error.message
        : "Gagal mencari invoice order.",
    );
  }

  const body = await findRes.json();
  const invoice = unwrapStrapiEntity<Invoice>(
    Array.isArray(body?.data) ? body.data[0] : null,
  );

  if (invoice?.documentId) {
    return updateInvoicePaymentStatus(
      invoice.documentId,
      paymentStatus,
      token,
      { invoiceNo: options?.invoiceNo },
    );
  }

  if (invoice?.id) {
    return updateInvoicePaymentStatus(invoice.id, paymentStatus, token, {
      invoiceNo: options?.invoiceNo,
    });
  }

  return createInvoiceForOrder(orderId, paymentStatus, {
    invoiceNo: options?.invoiceNo,
    token,
  });
}
