import { NextRequest, NextResponse } from "next/server";
import { getUserMe } from "@/app/data/services/get-user-me";
import { getToken } from "@/app/data/services/get-token";
import { resolveCustomerForUser, type ResolvedCustomer } from "@/lib/customers";
import { buildStrapiRelationConnect } from "@/lib/strapi-relations";
import type {
  CreateOrderDetailInput,
  CreateOrderInput,
  CreateOrderMenuInput,
} from "@/types/orders";

function getStrapiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL belum dikonfigurasi.");
  }
  return url.replace(/\/$/, "");
}

function getOrdersApiUrl(search = ""): string {
  return `${getStrapiBaseUrl()}/api/orders${search}`;
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

function compactObject<T extends Record<string, unknown>>(data: T): Partial<T> {
  return Object.entries(data).reduce((acc, [key, value]) => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return acc;
    }
    return { ...acc, [key]: value };
  }, {} as Partial<T>);
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

async function createRelatedEntries(
  token: string | null,
  orderId: number,
  orderMenus: CreateOrderMenuInput[] | undefined,
  orderDetails: CreateOrderDetailInput[] | undefined,
) {
  const baseUrl = getStrapiBaseUrl();
  const headers = buildHeaders(token);

  for (const menu of orderMenus ?? []) {
    const res = await fetch(`${baseUrl}/api/order-menus`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: compactObject({ ...menu, order_id: orderId }),
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(
        `Gagal menyimpan menu pesanan: ${formatStrapiError(body)}`,
      );
    }
  }

  for (const detail of orderDetails ?? []) {
    const res = await fetch(`${baseUrl}/api/order-details`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: compactObject({ ...detail, order_id: orderId }),
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(
        `Gagal menyimpan detail pesanan: ${formatStrapiError(body)}`,
      );
    }
  }
}

/**
 * Buat invoice baru dengan status "unpaid" yang berelasi ke order.
 * Dicoba dua pendekatan relasi (Strapi v5 documentId & v4 id) agar robust.
 * Tidak melempar error — kegagalan hanya di-log agar order tetap berhasil.
 */
async function createInvoiceForOrder(
  token: string | null,
  orderId: number,
  orderDocumentId?: string,
): Promise<{ id: number; documentId?: string } | null> {
  const baseUrl = getStrapiBaseUrl();
  const headers = buildHeaders(token);
  const today = new Date().toISOString().split("T")[0];

  // Coba dua cara relasi supaya kompatibel Strapi v4 & v5
  const relationAttempts: Record<string, unknown>[] = [
    {
      orders: buildStrapiRelationConnect(orderId, orderDocumentId),
    },
    {
      orders: { connect: [{ id: orderId }] },
    },
    {
      order: buildStrapiRelationConnect(orderId, orderDocumentId),
    },
    {
      order: orderId,
    },
  ];

  for (const relationFields of relationAttempts) {
    const invoiceData = compactObject({
      payment_status: "unpaid",
      invoice_date: today,
      ...relationFields,
    });

    const res = await fetch(`${baseUrl}/api/invoices`, {
      method: "POST",
      headers,
      body: JSON.stringify({ data: invoiceData }),
    });

    if (res.ok) {
      const body = await res.json().catch(() => null);
      const data = body?.data ?? null;
      if (data) {
        return {
          id: data.id as number,
          documentId: data.documentId as string | undefined,
        };
      }
      return null;
    }
  }

  // Semua attempt gagal — log saja, jangan blokir response order
  console.error(
    `[createInvoiceForOrder] Semua attempt gagal untuk orderId=${orderId}`,
  );
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken();
    const url = getOrdersApiUrl(request.nextUrl.search);
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
            : "Terjadi kesalahan saat mengambil data orders.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken();
    const payload = (await request.json()) as CreateOrderInput;
    const {
      order_menus,
      order_details,
      customer_id,
      customer_document_id,
      ...orderFields
    } = payload;

    let resolvedCustomer: ResolvedCustomer | null = null;

    if (customer_id != null) {
      resolvedCustomer = {
        id: customer_id,
        documentId: customer_document_id,
      };
    } else if (token) {
      const user = await getUserMe();
      if (user?.id) {
        resolvedCustomer = await resolveCustomerForUser(user.id, token);
      }
    }

    if (!resolvedCustomer) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Customer tidak ditemukan untuk akun ini. Silakan login ulang atau lengkapi profil.",
        },
        { status: 400 },
      );
    }

    const relationAttempts: Record<string, unknown>[] = [
      {
        customer_id: buildStrapiRelationConnect(
          resolvedCustomer.id,
          resolvedCustomer.documentId,
        ),
      },
      { customer_id: resolvedCustomer.id },
      {
        customer: buildStrapiRelationConnect(
          resolvedCustomer.id,
          resolvedCustomer.documentId,
        ),
      },
      { customer: resolvedCustomer.id },
    ];

    let res: Response | null = null;
    let orderBody: unknown = null;

    for (const relationFields of relationAttempts) {
      const orderData = compactObject({
        customer_type: "personal",
        ...orderFields,
        ...relationFields,
      });

      res = await fetch(getOrdersApiUrl(), {
        method: "POST",
        headers: buildHeaders(token),
        body: JSON.stringify({ data: orderData }),
      });

      const contentType = res.headers.get("content-type") ?? "";
      orderBody = contentType.includes("application/json")
        ? await res.json()
        : await res.text();

      if (res.ok) break;
    }

    if (!res) {
      return NextResponse.json(
        { success: false, error: "Gagal membuat order." },
        { status: 500 },
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: formatStrapiError(orderBody) },
        { status: res.status },
      );
    }

    // Ambil id & documentId dari response order
    const orderId =
      orderBody &&
      typeof orderBody === "object" &&
      "data" in orderBody &&
      orderBody.data &&
      typeof orderBody.data === "object" &&
      "id" in orderBody.data
        ? (orderBody.data.id as number)
        : null;

    const orderDocumentId =
      orderBody &&
      typeof orderBody === "object" &&
      "data" in orderBody &&
      orderBody.data &&
      typeof orderBody.data === "object" &&
      "documentId" in orderBody.data
        ? (orderBody.data.documentId as string)
        : undefined;

    let invoiceId: number | null = null;
    let invoiceDocumentId: string | null = null;

    if (orderId) {
      // 1. Buat related entries (menu & detail)
      if (order_menus?.length || order_details?.length) {
        await createRelatedEntries(token, orderId, order_menus, order_details);
      }

      // 2. Buat invoice dengan status unpaid
      const invoice = await createInvoiceForOrder(
        token,
        orderId,
        orderDocumentId,
      );
      if (invoice) {
        invoiceId = invoice.id;
        invoiceDocumentId = invoice.documentId ?? null;
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: orderBody,
        invoiceId,
        invoiceDocumentId,
      },
      { status: res.status },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat membuat order.",
      },
      { status: 500 },
    );
  }
}
