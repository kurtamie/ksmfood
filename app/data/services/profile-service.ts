import  HeadersInit from "next";

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!url) throw new Error("NEXT_PUBLIC_STRAPI_URL belum diset di .env");
  return url;
}

type Address = {
  id: string;
  name: string;
  addressLine: string;
  kelurahan?: string;
  latitude?: number;
  longitude?: number;
  recipientName?: string;
  recipientPhone?: string;
};

async function handleResponse(res: Response) {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      data?.error?.message ||
      data?.message ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export async function updateStrapiUser(
  userId: string,
  name: string,
  phone: string,
  headers: HeadersInit,
) {
  const BASE_URL = getBaseUrl();
  const res = await fetch(`${BASE_URL}/api/users/${userId}`, {
    method: "PUT", // Strapi v4 pakai PUT (bukan PATCH) untuk /api/users/:id
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({
      // Tidak dibungkus "data:" — ini khusus untuk /api/users/:id di Strapi
      username: name,
      phone_no: phone,
    }),
  });

  await handleResponse(res);
}

export async function updateStrapiCustomer(
  customerId: string,
  name: string,
  phone: string,
  address: string | null,
  headers: HeadersInit,
) {
  const BASE_URL = getBaseUrl();

  const res = await fetch(`${BASE_URL}/api/customers/${customerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({
      data: {
        name,
        phone_no: phone,
        address,
      },
    }),
  });

  await handleResponse(res);
}

export type ProfileAddress = Address;