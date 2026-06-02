import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/app/data/services/get-token";
import type { Dish, DishType, ServiceType } from "@/types/dish";

const dishTypes: DishType[] = [
  "rice",
  "main_dish",
  "additional_dish",
  "vegetable",
  "sauce",
  "chip",
  "fruit",
  "mineral_water",
  "box",
  "snack",
];

const serviceTypes: ServiceType[] = [
  "ricebox",
  "prasmanan",
  "prasmanan_wedding",
  "bento",
  "snackbox",
];

function getStrapiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL belum dikonfigurasi.");
  }
  return url.replace(/\/$/, "");
}

function getDishEndpoint(): string {
  return process.env.NEXT_PUBLIC_STRAPI_DISH_ENDPOINT ?? "dishes";
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

function isDishType(value: unknown): value is DishType {
  return typeof value === "string" && dishTypes.includes(value as DishType);
}

function isServiceType(value: unknown): value is ServiceType {
  return typeof value === "string" && serviceTypes.includes(value as ServiceType);
}

function normalizeDish(entry: unknown): Dish | null {
  if (!entry || typeof entry !== "object") return null;

  const item = entry as {
    id?: unknown;
    name?: unknown;
    type?: unknown;
    service?: unknown;
    attributes?: {
      name?: unknown;
      type?: unknown;
      service?: unknown;
    };
  };

  const id = typeof item.id === "number" ? item.id : Number(item.id);
  const name = item.name ?? item.attributes?.name;
  const type = item.type ?? item.attributes?.type;
  const service = item.service ?? item.attributes?.service;

  if (!Number.isFinite(id) || typeof name !== "string" || !isDishType(type)) {
    return null;
  }

  if (service !== null && service !== undefined && !isServiceType(service)) {
    return null;
  }

  return {
    id,
    name,
    type,
    service: service ?? null,
  };
}

function normalizeDishes(payload: unknown): Dish[] {
  const data =
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
      ? (payload as { data: unknown[] }).data
      : Array.isArray(payload)
        ? payload
        : [];

  return data.map(normalizeDish).filter((dish): dish is Dish => dish !== null);
}

function getPageCount(payload: unknown): number {
  if (!payload || typeof payload !== "object") return 1;

  const pageCount = (payload as {
    meta?: { pagination?: { pageCount?: unknown } };
  }).meta?.pagination?.pageCount;

  return typeof pageCount === "number" && pageCount > 0 ? pageCount : 1;
}

function formatStrapiError(body: unknown): string {
  if (typeof body === "string") return body;
  if (body && typeof body === "object") {
    const err = body as {
      error?: { message?: string };
      message?: string;
    };
    return err.error?.message ?? err.message ?? "Request gagal";
  }
  return "Request gagal";
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken();
    const baseUrl = getStrapiBaseUrl();
    const endpoint = getDishEndpoint();
    const params = new URLSearchParams(request.nextUrl.searchParams);
    const hasExplicitPagination = Array.from(params.keys()).some((key) =>
      key.startsWith("pagination"),
    );

    if (!hasExplicitPagination) {
      params.set("pagination[page]", "1");
      params.set("pagination[pageSize]", "100");
    }

    const buildUrl = (page?: number) => {
      const nextParams = new URLSearchParams(params);
      if (page) {
        nextParams.set("pagination[page]", String(page));
      }
      const search = nextParams.toString();
      return `${baseUrl}/api/${endpoint}${search ? `?${search}` : ""}`;
    };

    const res = await fetch(buildUrl(), {
      method: "GET",
      headers: buildHeaders(token),
      cache: "no-store",
    });

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

    const dishes = normalizeDishes(body);

    if (!hasExplicitPagination) {
      const pageCount = getPageCount(body);

      for (let page = 2; page <= pageCount; page += 1) {
        const pageRes = await fetch(buildUrl(page), {
          method: "GET",
          headers: buildHeaders(token),
          cache: "no-store",
        });
        const pageBody = await pageRes.json().catch(() => null);

        if (!pageRes.ok) {
          return NextResponse.json(
            { success: false, error: formatStrapiError(pageBody) },
            { status: pageRes.status },
          );
        }

        dishes.push(...normalizeDishes(pageBody));
      }
    }

    return NextResponse.json(dishes, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil dishes.",
      },
      { status: 500 },
    );
  }
}
