import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/app/data/services/get-token";
import type { CreateOrderInput } from "@/types/orders";

function getStrapiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL belum dikonfigurasi.");
  }
  return url.replace(/\/$/, "");
}

function getOrdersApiUrl(): string {
  return `${getStrapiBaseUrl()}/api/orders`;
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

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    if (
      !payload ||
      !Array.isArray(payload.items) ||
      payload.items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Pesanan tidak valid. Harap masukkan item dalam keranjang.",
        },
        { status: 400 },
      );
    }

    const token = await getToken();

    const orderData = compactObject({
      delivery_date: payload.deliveryDate,
      arrive_time: payload.deliveryTime,
      delivery_address: payload.addressLine,
      recipient_name: payload.recipientName,
      recipient_phone_no: payload.recipientPhone,
      latitude: payload.latitude != null ? String(payload.latitude) : undefined,
      longitude:
        payload.longitude != null ? String(payload.longitude) : undefined,
      delivery_note: payload.notes,
      order_details: payload.items,
    } satisfies CreateOrderInput);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(getOrdersApiUrl(), {
      method: "POST",
      headers,
      body: JSON.stringify({ data: orderData }),
    });

    const contentType = res.headers.get("content-type") || "";
    let data: any = null;

    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      // Non-JSON response (e.g. "Method Not Allowed") — read text and return helpful message
      const text = await res.text();
      const msg = `Strapi responded ${res.status} ${res.statusText}: ${text}`;
      return NextResponse.json(
        { success: false, error: msg },
        { status: res.status },
      );
    }

    if (!res.ok) {
      const errorMessage =
        data?.error?.message ||
        data?.message ||
        "Gagal menyimpan data ke Strapi.";
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: res.status },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat menyimpan pesanan.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
