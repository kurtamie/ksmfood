function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!url) throw new Error("NEXT_PUBLIC_STRAPI_URL belum diset di .env");
  return url.replace(/\/$/, "");
}

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
  fields: {
    username?: string | null;
    phone_no?: string | null;
  },
  headers: HeadersInit,
) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    // Strapi users-permissions update endpoint expects fields directly.
    body: JSON.stringify(fields),
  });

  await handleResponse(res);
}

export async function updateStrapiCustomer(
  customer: {
    id: string;
    documentId?: string | null;
  },
  fields: {
    name?: string | null;
    phone_no?: string | null;
    address?: string | null;
    subdistrict?: string | null;
    latitude?: string | null;
    longitude?: string | null;
  },
  headers: HeadersInit,
) {
  const baseUrl = getBaseUrl();
  const targets = [
    customer.documentId ? String(customer.documentId) : null,
    customer.id,
  ].filter((target, index, list): target is string => {
    return !!target && list.indexOf(target) === index;
  });

  let lastResponse: Response | null = null;
  for (const target of targets) {
    const res = await fetch(`${baseUrl}/api/customers/${target}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({ data: fields }),
    });

    if (res.ok || res.status !== 404) {
      await handleResponse(res);
      return;
    }

    lastResponse = res;
  }

  if (lastResponse) {
    await handleResponse(lastResponse);
  }
}
