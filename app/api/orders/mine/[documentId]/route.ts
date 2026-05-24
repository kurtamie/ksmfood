import { NextResponse } from "next/server";
import { getUserMe } from "@/app/data/services/get-user-me";
import { getToken } from "@/app/data/services/get-token";
import { getCustomerIdByUserId } from "@/lib/customers";
import {
  fetchOrderByDocumentId,
  mapOrderToDetailView,
} from "@/lib/order-queries";
import { unwrapStrapiEntity } from "@/lib/strapi-response";
import type { Customer } from "@/types/customers";

function getOrderCustomerId(order: {
  customer_id?: Customer | number | null;
}): number | null {
  const customer = order.customer_id;
  if (customer == null) return null;
  if (typeof customer === "number") return customer;
  const entity = unwrapStrapiEntity(customer);
  return entity?.id ?? null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ documentId: string }> },
) {
  try {
    const { documentId } = await params;
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

    const customerId = await getCustomerIdByUserId(user.id, token);
    if (!customerId) {
      return NextResponse.json(
        { success: false, error: "Customer tidak ditemukan." },
        { status: 404 },
      );
    }

    const order = await fetchOrderByDocumentId(documentId, token);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Pesanan tidak ditemukan." },
        { status: 404 },
      );
    }

    const orderCustomerId = getOrderCustomerId(order);
    if (orderCustomerId != null && orderCustomerId !== customerId) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak." },
        { status: 403 },
      );
    }

    const data = await mapOrderToDetailView(order, token);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal mengambil detail pesanan.",
      },
      { status: 500 },
    );
  }
}
