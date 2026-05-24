"use server";

import { cookies } from "next/headers";
import {
  loginService,
  registerService,
  sendOtpService,
  verifyOtpService,
  type LoginPayload,
  type RegisterPayload,
  type SendOtpPayload,
  type VerifyOtpPayload,
  type AuthUser,
} from "../services/auth-service";

async function setAuthCookies(token: string, user: AuthUser) {
  const cookieStore = await cookies();

  cookieStore.set("ksm_auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  cookieStore.set("ksm_auth_user", JSON.stringify(user), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("ksm_auth_token");
  cookieStore.delete("ksm_auth_user");
}

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

function extractMessage(err: unknown, fallback: string): string {
  if (typeof err === "object" && err !== null && "message" in err) {
    return String((err as { message: string }).message);
  }
  return fallback;
}

export async function loginAction(
  payload: LoginPayload,
): Promise<ActionResult<{ token: string; user: AuthUser }>> {
  try {
    const { token, user } = await loginService(payload);
    await setAuthCookies(token, user);
    return { success: true, data: { token, user } };
  } catch (err) {
    return {
      success: false,
      error: extractMessage(
        err,
        "Login gagal. Periksa nomor dan password Anda.",
      ),
    };
  }
}

export async function sendOtpAction(
  payload: SendOtpPayload,
): Promise<ActionResult> {
  try {
    await sendOtpService(payload);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: extractMessage(err, "Gagal mengirim OTP. Coba lagi."),
    };
  }
}

export async function verifyOtpAction(
  payload: VerifyOtpPayload,
): Promise<ActionResult> {
  try {
    await verifyOtpService(payload);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: extractMessage(err, "Kode OTP tidak valid atau sudah kadaluarsa."),
    };
  }
}

export async function registerAction(
  payload: RegisterPayload,
): Promise<ActionResult<{ token: string; user: AuthUser }>> {
  try {
    const result = await registerService(payload);
    console.log("[registerAction] result →", JSON.stringify(result));

    if (!result.token || !result.user) {
      throw new Error("Response tidak valid dari server.");
    }

    await setAuthCookies(result.token, result.user);
    return { success: true, data: { token: result.token, user: result.user } };
  } catch (err) {
    console.log("[registerAction] error →", err);
    return {
      success: false,
      error: extractMessage(err, "Registrasi gagal. Coba lagi."),
    };
  }
}

export async function logoutAction(): Promise<ActionResult> {
  try {
    await clearAuthCookies();
    return { success: true };
  } catch (err) {
    return { success: false, error: extractMessage(err, "Logout gagal.") };
  }
}
