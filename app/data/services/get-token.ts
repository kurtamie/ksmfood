// app/data/services/get-token.ts
// Dipakai di Server Components, Server Actions, atau Route Handlers.
// Untuk client-side, gunakan useAuth() dari AuthContext.

import { cookies } from "next/headers";

/**
 * Ambil JWT token dari cookie (server-side).
 * Mengembalikan string token atau null jika tidak ada / sudah expired.
 */
export async function getToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ksm_auth_token")?.value ?? null;
    return token;
  } catch {
    return null;
  }
}

/**
 * Buat Authorization header dari token.
 * Berguna untuk fetch yang butuh Bearer token di server.
 *
 * @example
 * const headers = await getBearerHeader();
 * const res = await fetch("/api/orders", { headers });
 */
export async function getBearerHeader(): Promise<HeadersInit> {
  const token = await getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
