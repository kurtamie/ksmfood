import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/app/data/services/get-token";
import { getUserMe } from "@/app/data/services/get-user-me";
import { updateStrapiUser, updateStrapiCustomer } from "@/app/data/services/profile-service";

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

    const body = await req.json();
    const { name, phone, addresses } = body;

    await updateStrapiUser(String(currentUser.id), name, phone, bearerHeaders);

    if (currentUser.customer?.id) {
      const addressJson = addresses ? JSON.stringify(addresses) : null;
      await updateStrapiCustomer(
        String(currentUser.customer.id),
        name,
        phone,
        addressJson,
        bearerHeaders
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Profile update error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}