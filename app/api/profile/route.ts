import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/app/data/services/get-token";
import { getUserMe } from "@/app/data/services/get-user-me";
import {
  updateStrapiCustomer,
  updateStrapiUser,
} from "@/app/data/services/profile-service";

function hasField(body: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(body, key);
}

function normalizeText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function normalizeCoordinate(value: unknown): string | null {
  if (value == null || value === "") return null;
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? String(coordinate) : null;
}

function normalizePhoneValue(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const normalized = trimmed.replace(/^0+/, "");
  if (!normalized) return null;

  return normalized.startsWith("62") ? normalized : `62${normalized}`;
}

async function isPhoneAlreadyUsed(
  phone: string,
  currentUserId: string,
): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") ?? "";
  const params = new URLSearchParams({
    "filters[phone_no][$eq]": phone,
    "pagination[pageSize]": "1",
    "fields[0]": "id",
  });

  const response = await fetch(`${baseUrl}/api/users?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(
      message || "Failed to validate phone number availability",
    );
  }

  const payload = await response.json();
  const results = Array.isArray(payload.data) ? payload.data : [];
  if (results.length === 0) return false;

  return String(results[0].id) !== currentUserId;
}

function addIfChanged<T extends Record<string, unknown>>(
  fields: T,
  key: keyof T,
  nextValue: T[keyof T],
  currentValue: unknown,
) {
  const current =
    currentValue == null || currentValue === "" ? null : String(currentValue);
  const next = nextValue == null || nextValue === "" ? null : String(nextValue);
  if (next !== current) {
    fields[key] = nextValue;
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bearerHeaders = { Authorization: `Bearer ${token}` };

    const currentUser = await getUserMe();
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = (await req.json()) as Record<string, unknown>;
    const userFields: {
      username?: string | null;
      phone_no?: string | null;
    } = {};
    const customerFields: {
      name?: string | null;
      phone_no?: string | null;
      address?: string | null;
      subdistrict?: string | null;
      latitude?: string | null;
      longitude?: string | null;
    } = {};

    if (hasField(body, "name")) {
      const name = normalizeText(body.name);
      addIfChanged(userFields, "username", name, currentUser.username);
      addIfChanged(customerFields, "name", name, currentUser.customer?.name);
    }

    if (hasField(body, "phone")) {
      const phone = normalizeText(body.phone);

      if (phone) {
        const normalizedPhone = normalizePhoneValue(phone);
        const currentNormalizedPhone = normalizePhoneValue(currentUser.phone_no);

        if (
          normalizedPhone &&
          normalizedPhone !== currentNormalizedPhone &&
          (await isPhoneAlreadyUsed(normalizedPhone, String(currentUser.id)))
        ) {
          return NextResponse.json(
            { error: "Nomor whatsapp sudah terdaftar" },
            { status: 409 },
          );
        }
      }

      addIfChanged(userFields, "phone_no", phone, currentUser.phone_no);
      addIfChanged(
        customerFields,
        "phone_no",
        phone,
        currentUser.customer?.phone_no,
      );
    }

    if (hasField(body, "address")) {
      const address = normalizeText(body.address);
      addIfChanged(
        customerFields,
        "address",
        address,
        currentUser.customer?.address,
      );
    }

    if (hasField(body, "subdistrict")) {
      const subdistrict = normalizeText(body.subdistrict);
      addIfChanged(
        customerFields,
        "subdistrict",
        subdistrict,
        currentUser.customer?.subdistrict,
      );
    }

    if (hasField(body, "latitude")) {
      const latitude = normalizeCoordinate(body.latitude);
      addIfChanged(
        customerFields,
        "latitude",
        latitude,
        currentUser.customer?.latitude,
      );
    }

    if (hasField(body, "longitude")) {
      const longitude = normalizeCoordinate(body.longitude);
      addIfChanged(
        customerFields,
        "longitude",
        longitude,
        currentUser.customer?.longitude,
      );
    }

    if (Object.keys(userFields).length > 0) {
      await updateStrapiUser(String(currentUser.id), userFields, bearerHeaders);
    }

    if (Object.keys(customerFields).length > 0) {
      if (!currentUser.customer?.id) {
        return NextResponse.json(
          { error: "Customer not found" },
          { status: 404 },
        );
      }

      await updateStrapiCustomer(
        {
          id: String(currentUser.customer.id),
          documentId: currentUser.customer.documentId,
        },
        customerFields,
        bearerHeaders,
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    console.error("Profile update error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
