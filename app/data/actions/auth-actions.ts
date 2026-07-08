"use server";

import { cookies } from "next/headers";
import {
  isPhoneNoRegisteredService,
  loginService,
  registerService,
  resetPasswordWithPhoneService,
  sendOtpService,
  verifyOtpService,
  verifyPasswordResetOtpService,
  type LoginPayload,
  type RegisterPayload,
  type SendOtpPayload,
  type VerifyOtpPayload,
  type AuthUser,
} from "../services/auth-service";
import {
  type AuthFieldErrors,
  hasAuthFieldErrors,
  validatePassword,
  validatePasswordConfirmation,
  validatePasswordLogin,
  validatePhoneNo,
  validateUsername,
} from "@/lib/auth-validation";

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
  fieldErrors?: AuthFieldErrors;
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
    const fieldErrors: AuthFieldErrors = {
      phone_no: validatePhoneNo(payload.phone_no),
      password: validatePasswordLogin(payload.password),
    };

    if (hasAuthFieldErrors(fieldErrors)) {
      return {
        success: false,
        error: "Periksa kembali data yang diisi.",
        fieldErrors,
      };
    }

    const { token, user } = await loginService(payload);
    await setAuthCookies(token, user);
    return { success: true, data: { token, user } };
  } catch (err) {
    return {
      success: false,
      error: extractMessage(err, "Login gagal. Periksa nomor dan password Anda."),
    };
  }
}

export async function sendOtpAction(
  payload: SendOtpPayload,
): Promise<ActionResult> {
  try {
    const fieldErrors: AuthFieldErrors = {
      phone_no: validatePhoneNo(payload.phone_no),
    };

    if (hasAuthFieldErrors(fieldErrors)) {
      return {
        success: false,
        error: "Periksa kembali data yang diisi.",
        fieldErrors,
      };
    }

    if (await isPhoneNoRegisteredService(payload.phone_no)) {
      return {
        success: false,
        error: "Nomor whatsapp sudah terdaftar",
        fieldErrors: { phone_no: ["Nomor whatsapp sudah terdaftar"] },
      };
    }

    await sendOtpService(payload);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: extractMessage(err, "Gagal mengirim OTP. Coba lagi."),
    };
  }
}

export async function sendPasswordResetOtpAction(
  payload: SendOtpPayload,
): Promise<ActionResult> {
  try {
    const fieldErrors: AuthFieldErrors = {
      phone_no: validatePhoneNo(payload.phone_no),
    };

    if (hasAuthFieldErrors(fieldErrors)) {
      return {
        success: false,
        error: "Periksa kembali data yang diisi.",
        fieldErrors,
      };
    }

    if (!(await isPhoneNoRegisteredService(payload.phone_no))) {
      return {
        success: false,
        error: "Nomor whatsapp tidak terdaftar",
        fieldErrors: { phone_no: ["Nomor whatsapp tidak terdaftar"] },
      };
    }

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

// Khusus untuk flow lupa password — mengembalikan resetToken sekali pakai
export async function verifyPasswordResetOtpAction(
  payload: VerifyOtpPayload,
): Promise<ActionResult<{ resetToken: string }>> {
  try {
    const fieldErrors: AuthFieldErrors = {
      phone_no: validatePhoneNo(payload.phone_no),
    };

    if (hasAuthFieldErrors(fieldErrors)) {
      return {
        success: false,
        error: "Periksa kembali data yang diisi.",
        fieldErrors,
      };
    }

    const result = await verifyPasswordResetOtpService(payload);
    return { success: true, data: { resetToken: result.resetToken } };
  } catch (err) {
    return {
      success: false,
      error: extractMessage(err, "Kode OTP tidak valid atau sudah kadaluarsa."),
    };
  }
}

// Pakai reset_token (bukan otp_code) — OTP sudah diverifikasi di step sebelumnya
export async function resetPasswordWithPhoneAction(payload: {
  phone_no: string;
  reset_token: string;
  password: string;
  password_confirmation: string;
}): Promise<ActionResult> {
  try {
    const fieldErrors: AuthFieldErrors = {
      password: validatePassword(payload.password),
      password_confirmation: validatePasswordConfirmation(
        payload.password,
        payload.password_confirmation,
      ),
    };

    if (hasAuthFieldErrors(fieldErrors)) {
      return {
        success: false,
        error: "Periksa kembali data yang diisi.",
        fieldErrors,
      };
    }

    await resetPasswordWithPhoneService(payload);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: extractMessage(err, "Gagal mengganti kata sandi. Coba lagi."),
    };
  }
}

export async function registerAction(
  payload: RegisterPayload,
): Promise<ActionResult<{ token: string; user: AuthUser }>> {
  try {
    const fieldErrors: AuthFieldErrors = {
      username: validateUsername(payload.username),
      phone_no: validatePhoneNo(payload.phone_no),
      password: validatePassword(payload.password),
    };

    if (hasAuthFieldErrors(fieldErrors)) {
      return {
        success: false,
        error: "Periksa kembali data yang diisi.",
        fieldErrors,
      };
    }

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