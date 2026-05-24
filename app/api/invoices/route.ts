import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/app/data/services/get-token";
import type { InvoiceStatus } from "@/types/invoices";

function getStrapiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL belum dikonfigurasi.");
  }
  return url.replace(/\/$/, "");
}

function buildHeaders(token: string | null): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function formatStrapiError(body: unknown): string {
  if (typeof body === "string") return body;
  if (body && typeof body === "object") {
    const err = body as {
      error?: {
        message?: string;
        details?: { errors?: Array<{ message?: string }> };
      };
      message?: string;
    };
    const detail = err.error?.details?.errors?.[0]?.message;
    return detail ?? err.error?.message ?? err.message ?? "Request gagal";
  }
  return "Request gagal";
}

async function toNextResponse(res: Response) {
  const contentType = res.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await res.json()
    : await res.text();
  if (!res.ok) {
    return NextResponse.json(
      { success: false, error: formatStrapiError(body) },
      { status: res.status },
    );
  }
  return NextResponse.json({ success: true, data: body }, { status: res.status });
}

function getInvoiceDocumentId(row: unknown): string | null {
  if (!row || typeof row !== "object") return null;
  const record = row as { documentId?: unknown; id?: unknown };
  if (typeof record.documentId === "string") return record.documentId;
  return null;
}

async function findInvoiceDocumentIdByNumericId(
  token: string | null,
  invoiceId: number,
): Promise<string | null> {
  const baseUrl = getStrapiBaseUrl();
  const res = await fetch(
    `${baseUrl}/api/invoices?filters[id][$eq]=${invoiceId}&pagination[pageSize]=1`,
    {
      method: "GET",
      headers: buildHeaders(token),
      cache: "no-store",
    },
  );
  if (!res.ok) return null;

  const body = await res.json().catch(() => null);
  const row = Array.isArray(body?.data) ? body.data[0] : null;
  return getInvoiceDocumentId(row);
}

async function findInvoiceDocumentIdByOrder(
  token: string | null,
  orderId?: number,
  orderDocumentId?: string,
): Promise<string | null> {
  const baseUrl = getStrapiBaseUrl();
  const attempts = [
    orderId ? `filters[orders][id][$eq]=${orderId}` : null,
    orderId ? `filters[order][id][$eq]=${orderId}` : null,
    orderId ? `filters[order_id][id][$eq]=${orderId}` : null,
    orderDocumentId
      ? `filters[orders][documentId][$eq]=${encodeURIComponent(orderDocumentId)}`
      : null,
  ].filter((query): query is string => query != null);

  for (const query of attempts) {
    const res = await fetch(
      `${baseUrl}/api/invoices?${query}&pagination[pageSize]=1`,
      {
        method: "GET",
        headers: buildHeaders(token),
        cache: "no-store",
      },
    );
    if (!res.ok) continue;

    const body = await res.json().catch(() => null);
    const row = Array.isArray(body?.data) ? body.data[0] : null;
    const documentId = getInvoiceDocumentId(row);
    if (documentId) return documentId;
  }

  return null;
}

async function getCurrentInvoice(
  token: string | null,
  documentId: string,
): Promise<Record<string, unknown> | null> {
  const res = await fetch(`${getStrapiBaseUrl()}/api/invoices/${documentId}`, {
    method: "GET",
    headers: buildHeaders(token),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const body = await res.json().catch(() => null);
  return body?.data && typeof body.data === "object"
    ? (body.data as Record<string, unknown>)
    : null;
}

async function getNextInvoiceNo(token: string | null): Promise<string> {
  const res = await fetch(
    `${getStrapiBaseUrl()}/api/invoices?fields[0]=invoice_no&pagination[pageSize]=1000`,
    {
      method: "GET",
      headers: buildHeaders(token),
      cache: "no-store",
    },
  );
  if (!res.ok) return "0001";

  const body = await res.json().catch(() => null);
  const rows = Array.isArray(body?.data) ? body.data : [];
  const max = rows.reduce((highest: number, row: unknown) => {
    if (!row || typeof row !== "object") return highest;
    const invoiceNo = (row as { invoice_no?: unknown }).invoice_no;
    if (typeof invoiceNo !== "string" || !/^\d+$/.test(invoiceNo)) {
      return highest;
    }
    const value = Number(invoiceNo);
    return Number.isFinite(value) && value > highest ? value : highest;
  }, 0);

  return String(max + 1).padStart(4, "0");
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken();
    const url = `${getStrapiBaseUrl()}/api/invoices${request.nextUrl.search}`;
    const res = await fetch(url, {
      method: "GET",
      headers: buildHeaders(token),
      cache: "no-store",
    });
    return toNextResponse(res);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil data invoice.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken();
    const payload = await request.json() as {
      orderId?: number;
      orderDocumentId?: string;
      paymentStatus?: InvoiceStatus;
      invoiceNo?: string;
    };

    const { orderId, orderDocumentId, paymentStatus = "unpaid", invoiceNo } = payload;

    const data: Record<string, unknown> = {
      payment_status: paymentStatus,
      invoice_date: new Date().toISOString().split("T")[0],
    };

    if (invoiceNo) {
      data.invoice_no = invoiceNo;
    }

    // Relasi ke order
    if (orderId) {
      if (orderDocumentId) {
        data.orders = {
          connect: [{ id: orderId, documentId: orderDocumentId }],
        };
      } else {
        data.orders = { connect: [{ id: orderId }] };
      }
    }

    const res = await fetch(`${getStrapiBaseUrl()}/api/invoices`, {
      method: "POST",
      headers: buildHeaders(token),
      body: JSON.stringify({ data }),
    });

    return toNextResponse(res);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat membuat invoice.",
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/invoices
 * Body: { invoiceDocumentId: string, payment_status: InvoiceStatus, invoiceNo?: string }
 *
 * Digunakan oleh halaman summary setelah pembayaran Midtrans berhasil
 * untuk mengupdate payment_status invoice menjadi "paid".
 */
export async function PATCH(request: NextRequest) {
  try {
    const token = await getToken();
    const payload = await request.json() as {
      invoiceDocumentId?: string;
      invoiceId?: number;
      orderId?: number;
      orderDocumentId?: string;
      payment_status: InvoiceStatus;
      invoiceNo?: string;
    };

    const {
      invoiceDocumentId,
      invoiceId,
      orderId,
      orderDocumentId,
      payment_status,
      invoiceNo,
    } = payload;

    if (!payment_status) {
      return NextResponse.json(
        { success: false, error: "payment_status wajib diisi." },
        { status: 400 },
      );
    }

    let identifier: string | null = invoiceDocumentId ?? null;

    if (!identifier && invoiceId) {
      identifier = await findInvoiceDocumentIdByNumericId(token, invoiceId);
    }

    if (!identifier && (orderId || orderDocumentId)) {
      identifier = await findInvoiceDocumentIdByOrder(
        token,
        orderId,
        orderDocumentId,
      );
    }

    if (!identifier) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invoice documentId tidak ditemukan untuk update invoice.",
        },
        { status: 400 },
      );
    }

    const updateData: Record<string, unknown> = { payment_status };
    if (invoiceNo) {
      updateData.invoice_no = invoiceNo;
    }

    const baseUrl = getStrapiBaseUrl();
    const currentInvoice = await getCurrentInvoice(token, identifier);
    const currentInvoiceNo =
      typeof currentInvoice?.invoice_no === "string"
        ? currentInvoice.invoice_no
        : "";

    if (!updateData.invoice_no) {
      updateData.invoice_no =
        currentInvoiceNo && /^\d+$/.test(currentInvoiceNo)
          ? currentInvoiceNo
          : await getNextInvoiceNo(token);
    }

    const res = await fetch(`${baseUrl}/api/invoices/${identifier}`, {
      method: "PUT",
      headers: buildHeaders(token),
      body: JSON.stringify({ data: updateData }),
    });

    return toNextResponse(res);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memperbarui invoice.",
      },
      { status: 500 },
    );
  }
}
