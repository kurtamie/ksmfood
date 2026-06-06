import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/app/data/services/get-token";

function getStrapiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL belum dikonfigurasi.");
  }
  return url.replace(/\/$/, "");
}

function getOrderApiUrl(id: string, search = ""): string {
  return `${getStrapiBaseUrl()}/api/orders/${id}${search}`;
}

function getOrderDetailApiUrl(id: string): string {
  const endpoint =
    process.env.NEXT_PUBLIC_STRAPI_ORDER_DETAIL_ENDPOINT ?? "order-details";
  return `${getStrapiBaseUrl()}/api/${endpoint}/${id}`;
}

function getOrderMenuApiUrl(id: string): string {
  const endpoint =
    process.env.NEXT_PUBLIC_STRAPI_ORDER_MENU_ENDPOINT ?? "order-menus";
  return `${getStrapiBaseUrl()}/api/${endpoint}/${id}`;
}

function getInvoiceApiUrl(id: string): string {
  return `${getStrapiBaseUrl()}/api/invoices/${id}`;
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

function pickOrderUpdateFields(payload: Record<string, unknown>) {
  return compactObject({
    delivery_date: payload.delivery_date,
    arrive_time: payload.arrive_time,
    leave: payload.leave,
    delivery_address: payload.delivery_address,
    latitude: payload.latitude,
    longitude: payload.longitude,
    recipient_name: payload.recipient_name,
    recipient_phone_no: payload.recipient_phone_no,
    delivery_note: payload.delivery_note,
    step: payload.step,
    driver: payload.driver,
    travel_letter_no: payload.travel_letter_no,
  });
}

type RelationIdentifier = {
  id?: number | string;
  documentId?: string;
};

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

function getRelationIdentifiers(value: unknown): RelationIdentifier[] {
  const rows = Array.isArray(value)
    ? value
    : value &&
        typeof value === "object" &&
        Array.isArray((value as { data?: unknown }).data)
      ? (value as { data: unknown[] }).data
      : [];

  return rows
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const record = row as Record<string, unknown>;
      const attributes =
        record.attributes && typeof record.attributes === "object"
          ? (record.attributes as Record<string, unknown>)
          : {};
      const documentId =
        typeof record.documentId === "string"
          ? record.documentId
          : typeof attributes.documentId === "string"
            ? attributes.documentId
            : undefined;
      const id =
        typeof record.id === "number" || typeof record.id === "string"
          ? record.id
          : typeof attributes.id === "number" ||
              typeof attributes.id === "string"
            ? attributes.id
            : undefined;

      if (documentId || id) {
        return {
          ...(id != null ? { id } : {}),
          ...(documentId ? { documentId } : {}),
        };
      }
      return null;
    })
    .filter((row): row is RelationIdentifier => row != null);
}

function getRelationDocumentIds(value: unknown): string[] {
  return getRelationIdentifiers(value)
    .map((row) => row.documentId)
    .filter((documentId): documentId is string => !!documentId);
}

function getDeleteIdentifier(row: RelationIdentifier): string | null {
  if (row.documentId) return row.documentId;
  if (row.id != null) return String(row.id);
  return null;
}

async function readResponseBody(res: Response): Promise<unknown> {
  const contentType = res.headers.get("content-type") ?? "";
  return contentType.includes("application/json") ? res.json() : res.text();
}

async function getOrderForDeletion(token: string | null, id: string) {
  const res = await fetch(
    getOrderApiUrl(
      id,
      "?populate[order_details][fields][0]=documentId&populate[order_menus][fields][0]=documentId&populate[invoices][fields][0]=documentId&populate[invoices][fields][1]=payment_status",
    ),
    {
      method: "GET",
      headers: buildHeaders(token),
      cache: "no-store",
    },
  );

  const body = await readResponseBody(res).catch(() => null);
  if (!res.ok) {
    throw new Error(`Gagal mengambil order: ${formatStrapiError(body)}`);
  }

  return body &&
    typeof body === "object" &&
    "data" in body &&
    body.data &&
    typeof body.data === "object"
    ? (body.data as Record<string, unknown>)
    : null;
}

async function deleteStrapiEntry(
  token: string | null,
  url: string,
  label: string,
) {
  const res = await fetch(url, {
    method: "DELETE",
    headers: buildHeaders(token),
  });
  const body = await readResponseBody(res).catch(() => null);

  if (res.status === 404) {
    return;
  }

  if (!res.ok) {
    throw new Error(`Gagal menghapus ${label}: ${formatStrapiError(body)}`);
  }
}

function getInvoiceRows(value: unknown) {
  const rows = Array.isArray(value)
    ? value
    : value &&
        typeof value === "object" &&
        Array.isArray((value as { data?: unknown }).data)
      ? (value as { data: unknown[] }).data
      : [];

  return rows
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const record = row as Record<string, unknown>;
      if (record.attributes && typeof record.attributes === "object") {
        const attrs = record.attributes as Record<string, unknown>;
        return {
          id: record.id,
          documentId: record.documentId ?? attrs.documentId,
          payment_status: attrs.payment_status,
        };
      }
      return record;
    })
    .filter((row): row is Record<string, unknown> => row != null);
}

async function getExistingRelationConnects(token: string | null, id: string) {
  const res = await fetch(
    getOrderApiUrl(
      id,
      "?populate[order_details][fields][0]=documentId&populate[order_menus][fields][0]=documentId",
    ),
    {
      method: "GET",
      headers: buildHeaders(token),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return {};
  }

  const body = await res.json().catch(() => null);
  const order = body?.data && typeof body.data === "object" ? body.data : null;
  if (!order) return {};

  const detailDocumentIds = getRelationDocumentIds(order.order_details);
  const menuDocumentIds = getRelationDocumentIds(order.order_menus);

  return compactObject({
    order_details:
      detailDocumentIds.length > 0 ? { connect: detailDocumentIds } : undefined,
    order_menus:
      menuDocumentIds.length > 0 ? { connect: menuDocumentIds } : undefined,
  });
}

async function toNextResponse(res: Response) {
  const body = res.status === 204 ? null : await readResponseBody(res);
  if (!res.ok) {
    return NextResponse.json(
      { success: false, error: formatStrapiError(body) },
      { status: res.status },
    );
  }
  if (res.status === 204) {
    return NextResponse.json({ success: true, data: null }, { status: 200 });
  }
  return NextResponse.json(
    { success: true, data: body },
    { status: res.status },
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await getToken();
    const { id } = await params;
    const url = getOrderApiUrl(id, request.nextUrl.search);

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
            : "Terjadi kesalahan saat mengambil order.",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await getToken();
    const { id } = await params;
    const payload = (await request.json()) as Record<string, unknown>;
    const orderFields = pickOrderUpdateFields(payload);
    const relationConnects = await getExistingRelationConnects(token, id);

    const res = await fetch(getOrderApiUrl(id), {
      method: "PUT",
      headers: buildHeaders(token),
      body: JSON.stringify({ data: { ...orderFields, ...relationConnects } }),
    });

    return toNextResponse(res);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memperbarui order.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await getToken();
    const { id } = await params;
    const order = await getOrderForDeletion(token, id);

    if (order) {
      const invoices = getInvoiceRows(order.invoices);
      const paidInvoice = invoices.find(
        (invoice) => invoice.payment_status === "paid",
      );

      if (paidInvoice) {
        return NextResponse.json(
          {
            success: false,
            error: "Pesanan yang sudah dibayar tidak dapat dihapus.",
          },
          { status: 409 },
        );
      }

      for (const invoice of invoices) {
        const identifier = getDeleteIdentifier(invoice);
        if (identifier) {
          await deleteStrapiEntry(
            token,
            getInvoiceApiUrl(identifier),
            "invoice pesanan",
          );
        }
      }

      for (const detail of getRelationIdentifiers(order.order_details)) {
        const identifier = getDeleteIdentifier(detail);
        if (identifier) {
          await deleteStrapiEntry(
            token,
            getOrderDetailApiUrl(identifier),
            "detail pesanan",
          );
        }
      }

      for (const menu of getRelationIdentifiers(order.order_menus)) {
        const identifier = getDeleteIdentifier(menu);
        if (identifier) {
          await deleteStrapiEntry(
            token,
            getOrderMenuApiUrl(identifier),
            "menu pesanan",
          );
        }
      }
    }

    const res = await fetch(getOrderApiUrl(id), {
      method: "DELETE",
      headers: buildHeaders(token),
    });

    return toNextResponse(res);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menghapus order.",
      },
      { status: 500 },
    );
  }
}
