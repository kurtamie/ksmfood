import {
  buildStrapiHeaders,
  getStrapiBaseUrl,
  getStrapiToken,
} from "@/lib/strapi";
import { getStrapiListData, unwrapStrapiList } from "@/lib/strapi-response";
import type { Customer } from "@/types/customers";

export type ResolvedCustomer = {
  id: number;
  documentId?: string;
};

async function fetchCustomersByFilter(
  search: URLSearchParams,
  token: string | null,
): Promise<ResolvedCustomer | null> {
  const baseUrl = getStrapiBaseUrl();
  const res = await fetch(`${baseUrl}/api/customers?${search}`, {
    method: "GET",
    headers: buildStrapiHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) return null;

  const body = await res.json();
  const customers = unwrapStrapiList<Customer>(getStrapiListData(body));
  const first = customers[0];
  if (!first?.id) return null;

  return {
    id: first.id,
    documentId: first.documentId,
  };
}

export async function resolveCustomerForUser(
  userId: number,
  token?: string | null,
): Promise<ResolvedCustomer | null> {
  const authToken = token !== undefined ? token : await getStrapiToken();

  const filterVariants = [
    new URLSearchParams({
      "filters[user_id][id][$eq]": String(userId),
      "pagination[pageSize]": "1",
    }),
    new URLSearchParams({
      "filters[user_id][$eq]": String(userId),
      "pagination[pageSize]": "1",
    }),
    new URLSearchParams({
      "filters[user][id][$eq]": String(userId),
      "pagination[pageSize]": "1",
    }),
  ];

  for (const search of filterVariants) {
    const customer = await fetchCustomersByFilter(search, authToken);
    if (customer) return customer;
  }

  return null;
}

export async function getCustomerIdByUserId(
  userId: number,
  token?: string | null,
): Promise<number | null> {
  const customer = await resolveCustomerForUser(userId, token);
  return customer?.id ?? null;
}
