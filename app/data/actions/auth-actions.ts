"use server";

import { cookies } from "next/headers";
import {
  isPhoneNoRegisteredService,
  loginService,
  registerService,
  resetPasswordWithPhoneService,
  sendOtpService,
  verifyOtpService,
  type LoginPayload,
  type RegisterPayload,
  type ResetPasswordPayload,
  type SendOtpPayload,
  type VerifyOtpPayload,
  type AuthUser,
} from "../services/auth-service";
import {
  type AuthFieldErrors,
  hasAuthFieldErrors,
  validatePassword,
  validatePasswordConfirmation,
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
      password: validatePassword(payload.password),
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
        error: "Nomor Hp sudah terdaftar",
        fieldErrors: { phone_no: ["Nomor Hp sudah terdaftar"] },
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
        error: "Nomor Hp tidak terdaftar",
        fieldErrors: { phone_no: ["Nomor Hp tidak terdaftar"] },
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

export async function verifyPasswordResetOtpAction(
  payload: VerifyOtpPayload,
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
        error: "Nomor Hp tidak terdaftar",
        fieldErrors: { phone_no: ["Nomor Hp tidak terdaftar"] },
      };
    }

    await verifyOtpService(payload);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: extractMessage(err, "Kode OTP tidak valid atau sudah kadaluarsa."),
    };
  }
}

export async function resetPasswordWithPhoneAction(
  payload: ResetPasswordPayload,
): Promise<ActionResult> {
  try {
    const fieldErrors: AuthFieldErrors = {
      phone_no: validatePhoneNo(payload.phone_no),
      password: validatePassword(payload.password),
      password_confirmation: validatePasswordConfirmation(
        payload.password,
        payload.password_confirmation,
      ),
    };

    if (payload.otp_code.length < 6) {
      return {
        success: false,
        error: "Masukkan 6 digit kode OTP.",
        fieldErrors,
      };
    }

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
        error: "Nomor Hp tidak terdaftar",
        fieldErrors: { phone_no: ["Nomor Hp tidak terdaftar"] },
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

    if (await isPhoneNoRegisteredService(payload.phone_no)) {
      return {
        success: false,
        error: "Nomor Hp sudah terdaftar",
        fieldErrors: { phone_no: ["Nomor Hp sudah terdaftar"] },
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
