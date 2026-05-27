import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/app/data/services/get-token";

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
  return NextResponse.json(
    { success: true, data: body },
    { status: res.status },
  );
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await getToken();
    const { id } = await params;
    const payload = (await request.json()) as Record<string, unknown>;
    const currentInvoice = await getCurrentInvoice(token, id);
    const currentInvoiceNo =
      typeof currentInvoice?.invoice_no === "string"
        ? currentInvoice.invoice_no
        : "";
    const nextInvoiceNo =
      currentInvoiceNo && /^\d+$/.test(currentInvoiceNo)
        ? currentInvoiceNo
        : await getNextInvoiceNo(token);

    const res = await fetch(`${getStrapiBaseUrl()}/api/invoices/${id}`, {
      method: "PUT",
      headers: buildHeaders(token),
      body: JSON.stringify({
        data: {
          ...payload,
          invoice_no: nextInvoiceNo,
        },
      }),
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
