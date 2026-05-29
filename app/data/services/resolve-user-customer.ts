import type { AuthUser } from "./auth-service";
import type { Customer } from "@/types/customers";
import { getStrapiListData, unwrapStrapiList } from "@/lib/strapi-response";

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") ?? "";
}

function customerFromUser(user: AuthUser): Customer | null {
  const raw = user.customer;
  if (!raw) return null;
  if (typeof raw === "object" && "id" in raw && raw.id) {
    return raw as Customer;
  }
  return null;
}

async function fetchCustomerByUserId(
  userId: number,
  authorization: string,
): Promise<Customer | null> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return null;

  const filterVariants = [
    new URLSearchParams({
    "filters[user_id][id][$eq]": String(userId),
    "pagination[pageSize]": "1",
    "fields[0]": "name",
    "fields[1]": "phone_no",
    "fields[2]": "address",
    "fields[3]": "latitude",
    "fields[4]": "longitude",
    "fields[5]": "subdistrict",
  }),
    new URLSearchParams({
    "filters[user_id][$eq]": String(userId),
    "pagination[pageSize]": "1",
    "fields[0]": "name",
    "fields[1]": "phone_no",
    "fields[2]": "address",
    "fields[3]": "latitude",
    "fields[4]": "longitude",
    "fields[5]": "subdistrict", 
  }),
    new URLSearchParams({
    "filters[user][id][$eq]": String(userId),
    "pagination[pageSize]": "1",
    "fields[0]": "name",
    "fields[1]": "phone_no",
    "fields[2]": "address",
    "fields[3]": "latitude",
    "fields[4]": "longitude",
    "fields[5]": "subdistrict", 
  }),
  ];

  for (const search of filterVariants) {
    const res = await fetch(`${baseUrl}/api/customers?${search}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      cache: "no-store",
    });

    if (!res.ok) continue;

    const body = await res.json();
    const customers = unwrapStrapiList<Customer>(getStrapiListData(body));
    if (customers[0]?.id) return customers[0];
  }

  return null;
}

/** Lengkapi user dengan relasi customer dari Strapi */
export async function attachCustomerToUser(
  user: AuthUser,
  authorization?: string,
): Promise<AuthUser> {
  const existing = customerFromUser(user);
  if (existing) {
    return { ...user, customer: existing };
  }

  if (!authorization || !user.id) return user;

  const customer = await fetchCustomerByUserId(user.id, authorization);
  if (!customer) return user;

  return { ...user, customer };
}
