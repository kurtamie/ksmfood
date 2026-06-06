import { NextResponse } from "next/server";
import { getToken } from "@/app/data/services/get-token";
import { getUserMe } from "@/app/data/services/get-user-me";

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

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal memvalidasi sesi login.",
      },
      { status: 500 },
    );
  }
}
