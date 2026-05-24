import type { Order } from "@/types/orders";
import type { OrderDetail } from "@/types/order-details";
import { sumOrderDetailsTotal } from "@/lib/order-totals";
import {
  buildStrapiHeaders,
  getStrapiBaseUrl,
  getStrapiToken,
} from "@/lib/strapi";

type StrapiListResponse<T> = {
  data?: T[];
};

type StrapiSingleResponse<T> = {
  data?: T | { id: number; attributes?: T };
};

function unwrapStrapiEntity<T extends { id?: number }>(
  entity: T | { id: number; attributes?: T } | undefined,
): (T & { id: number }) | null {
  if (!entity) return null;
  if ("attributes" in entity && entity.attributes) {
    return { ...entity.attributes, id: entity.id } as T & { id: number };
  }
  return entity as T & { id: number };
}

export async function fetchOrderById(
  orderId: string | number,
  token?: string | null,
): Promise<Order | null> {
  const authToken = token !== undefined ? token : await getStrapiToken();
  const baseUrl = getStrapiBaseUrl();
  const populate = encodeURIComponent(
    JSON.stringify({ order_details: true }),
  );

  const res = await fetch(
    `${baseUrl}/api/orders/${orderId}?populate=${populate}`,
    {
      method: "GET",
      headers: buildStrapiHeaders(authToken),
      cache: "no-store",
    },
  );

  if (!res.ok) return null;

  const json = (await res.json()) as StrapiSingleResponse<Order>;
  return unwrapStrapiEntity(json.data ?? undefined);
}

export async function fetchOrderDetailsByOrderId(
  orderId: number,
  token?: string | null,
): Promise<OrderDetail[]> {
  const authToken = token !== undefined ? token : await getStrapiToken();
  const baseUrl = getStrapiBaseUrl();
  const search = new URLSearchParams({
    "filters[order_id][id][$eq]": String(orderId),
    "pagination[pageSize]": "100",
  });

  const res = await fetch(`${baseUrl}/api/order-details?${search}`, {
    method: "GET",
    headers: buildStrapiHeaders(authToken),
    cache: "no-store",
  });

  if (!res.ok) return [];

  const json = (await res.json()) as StrapiListResponse<
    OrderDetail | { id: number; attributes?: OrderDetail }
  >;

  return (json.data ?? [])
    .map((row) => unwrapStrapiEntity(row))
    .filter((row): row is OrderDetail & { id: number } => row != null);
}

export async function getOrderPaymentAmount(
  orderId: number,
  token?: string | null,
): Promise<{ amount: number; order: Order | null; details: OrderDetail[] }> {
  const order = await fetchOrderById(orderId, token);
  let details =
    order?.order_details?.map((detail) =>
      "attributes" in (detail as object)
        ? unwrapStrapiEntity(
            detail as OrderDetail | { id: number; attributes?: OrderDetail },
          )
        : detail,
    ) ?? [];

  details = details.filter((d): d is OrderDetail => d != null);

  if (!details.length) {
    details = await fetchOrderDetailsByOrderId(orderId, token);
  }

  const amount = sumOrderDetailsTotal(details);
  return { amount, order, details };
}
