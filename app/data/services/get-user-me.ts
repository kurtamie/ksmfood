import { getBearerHeader } from "./get-token";
import type { AuthUser } from "./auth-service";
import { attachCustomerToUser } from "./resolve-user-customer";

const BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "";

export async function getUserMe(): Promise<AuthUser | null> {
  try {
    const headers = await getBearerHeader();

    if (!("Authorization" in headers)) return null;

    const res = await fetch(`${BASE_URL}/api/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = (await res.json()) as AuthUser;
    if (!data?.id) return null;

    return attachCustomerToUser(data, headers.Authorization as string);
  } catch {
    return null;
  }
}
