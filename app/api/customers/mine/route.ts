import { NextResponse } from "next/server";
import { getUserMe } from "@/app/data/services/get-user-me";
import { getToken } from "@/app/data/services/get-token";
import { resolveCustomerForUser } from "@/lib/customers";
import { buildStrapiHeaders, getStrapiBaseUrl } from "@/lib/strapi";
import { getStrapiSingleData, unwrapStrapiEntity } from "@/lib/strapi-response";
import type { Customer } from "@/types/customers";

export async function GET() {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const user = await getUserMe();
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "User tidak ditemukan." },
        { status: 401 },
      );
    }

    if (user.customer?.id) {
      return NextResponse.json({ success: true, data: user.customer });
    }

    const resolved = await resolveCustomerForUser(user.id, token);
    if (!resolved) {
      return NextResponse.json(
        {
          success: false,
          error: `Customer tidak ditemukan untuk user id ${user.id}.`,
        },
        { status: 404 },
      );
    }

    const res = await fetch(
      `${getStrapiBaseUrl()}/api/customers/${resolved.id}`,
      {
        method: "GET",
        headers: buildStrapiHeaders(token),
        cache: "no-store",
      },
    );

    const body = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Gagal mengambil data customer." },
        { status: res.status },
      );
    }

    const customer = unwrapStrapiEntity<Customer>(
      getStrapiSingleData(body) as Parameters<
        typeof unwrapStrapiEntity<Customer>
      >[0],
    );

    return NextResponse.json({ success: true, data: customer });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil customer.",
      },
      { status: 500 },
    );
  }
}
