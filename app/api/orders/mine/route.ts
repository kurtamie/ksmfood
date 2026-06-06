import { NextResponse } from "next/server";
import { getUserMe } from "@/app/data/services/get-user-me";
import { getToken } from "@/app/data/services/get-token";
import { getCustomerIdByUserId } from "@/lib/customers";
import {
  fetchOrdersByCustomerId,
  mapOrderToListItem,
} from "@/lib/order-queries";

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

    const customerId = await getCustomerIdByUserId(user.id, token);
    if (!customerId) {
      return NextResponse.json({ success: true, data: [] });
    }

    const orders = await fetchOrdersByCustomerId(customerId, token);
    const data = await Promise.all(
      orders.map((order) => mapOrderToListItem(order, token)),
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal mengambil riwayat pesanan.",
      },
      { status: 500 },
    );
  }
}
