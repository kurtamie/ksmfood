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

function getRelationDocumentIds(value: unknown): string[] {
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
      if (typeof record.documentId === "string") return record.documentId;
      if (record.attributes && typeof record.attributes === "object") {
        const attrs = record.attributes as Record<string, unknown>;
        return typeof attrs.documentId === "string" ? attrs.documentId : null;
      }
      return null;
    })
    .filter((documentId): documentId is string => !!documentId);
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
  const contentType = res.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await res.json()
    : await res.text();
  if (!res.ok) {
    return NextResponse.json(
      { success: false, error: body ?? res.statusText },
      { status: res.status },
    );
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
