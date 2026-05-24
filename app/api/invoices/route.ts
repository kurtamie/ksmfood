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
      payment_status: InvoiceStatus;
      invoiceNo?: string;
    };

    const { invoiceDocumentId, invoiceId, payment_status, invoiceNo } = payload;

    if (!payment_status) {
      return NextResponse.json(
        { success: false, error: "payment_status wajib diisi." },
        { status: 400 },
      );
    }

    if (!invoiceDocumentId && !invoiceId) {
      return NextResponse.json(
        {
          success: false,
          error: "invoiceDocumentId atau invoiceId wajib diisi.",
        },
        { status: 400 },
      );
    }

    const updateData: Record<string, unknown> = { payment_status };
    if (invoiceNo) {
      updateData.invoice_no = invoiceNo;
    }

    const baseUrl = getStrapiBaseUrl();

    // Strapi v5 lebih baik pakai documentId, v4 pakai numeric id
    const identifier = invoiceDocumentId ?? invoiceId;
    const res = await fetch(`${baseUrl}/api/invoices/${identifier}`, {
      method: "PATCH",
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