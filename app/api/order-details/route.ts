import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/app/data/services/get-token";

function getStrapiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL belum dikonfigurasi.");
  }
  return url.replace(/\/$/, "");
}

function getOrderDetailEndpoint(): string {
  return (
    process.env.NEXT_PUBLIC_STRAPI_ORDER_DETAIL_ENDPOINT ?? "order-details"
  );
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

export async function GET(request: NextRequest) {
  try {
    const token = await getToken();
    const baseUrl = getStrapiBaseUrl();
    const endpoint = getOrderDetailEndpoint();
    const url = `${baseUrl}/api/${endpoint}${request.nextUrl.search}`;

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
            : "Terjadi kesalahan saat mengambil order details.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken();
    const payload = await request.json();
    const baseUrl = getStrapiBaseUrl();
    const endpoint = getOrderDetailEndpoint();

    const res = await fetch(`${baseUrl}/api/${endpoint}`, {
      method: "POST",
      headers: buildHeaders(token),
      body: JSON.stringify({ data: payload }),
    });

    return toNextResponse(res);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat membuat order detail.",
      },
      { status: 500 },
    );
  }
}
