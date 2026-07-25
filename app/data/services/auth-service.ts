import type { User } from "@/types/users";
import { normalizeAuthPhoneInput } from "@/lib/auth-validation";

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!url) throw new Error("NEXT_PUBLIC_STRAPI_URL belum diset di .env");
  return url;
}

function normalizePhone(phone: string): string {
  return `62${normalizeAuthPhoneInput(phone)}`;
}

export type AuthUser = User;

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface LoginPayload {
  phone_no: string;
  password: string;
}

export interface SendOtpPayload {
  phone_no: string;
}

export interface VerifyOtpPayload {
  phone_no: string;
  otp_code: string;
}

export interface RegisterPayload {
  username: string;
  phone_no: string;
  password: string;
}

export interface ResetPasswordPayload {
  phone_no: string;
  reset_token: string;
  password: string;
  password_confirmation: string;
}

export interface VerifyPasswordResetOtpResponse {
  message: string;
  verified: boolean;
  resetToken: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface ApiError {
  message: string;
  status: number;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();

  if (!res.ok) {
    const message =
      data?.error?.message ||
      data?.message ||
      data?.error ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

// ─── Services ─────────────────────────────────────────────────────────────────

export async function loginService(
  payload: LoginPayload,
): Promise<AuthResponse> {
  const phone = normalizePhone(payload.phone_no);

  const res = await fetch(`${getBaseUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone_no: phone,
      password: payload.password,
    }),
  });

  const raw = await handleResponse<{ jwt: string; user: AuthUser }>(res);
  return { token: raw.jwt, user: raw.user };
}

export async function sendOtpService(
  payload: SendOtpPayload,
): Promise<{ message: string }> {
  const phone = normalizePhone(payload.phone_no);

  const res = await fetch(`${getBaseUrl()}/api/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_no: phone }),
  });
  return handleResponse<{ message: string }>(res);
}

export async function verifyOtpService(
  payload: VerifyOtpPayload,
): Promise<{ message: string; verified: boolean }> {
  const phone = normalizePhone(payload.phone_no);

  const res = await fetch(`${getBaseUrl()}/api/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone_no: phone,
      otp_code: payload.otp_code,
    }),
  });
  return handleResponse<{ message: string; verified: boolean }>(res);
}

// Khusus forgot password — endpoint berbeda, mengembalikan resetToken
export async function verifyPasswordResetOtpService(
  payload: VerifyOtpPayload,
): Promise<VerifyPasswordResetOtpResponse> {
  const phone = normalizePhone(payload.phone_no);

  const res = await fetch(`${getBaseUrl()}/api/auth/verify-password-reset-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone_no: phone,
      otp_code: payload.otp_code,
    }),
  });
  return handleResponse<VerifyPasswordResetOtpResponse>(res);
}

// Pakai reset_token (bukan otp_code) — OTP sudah diverifikasi di step sebelumnya
export async function resetPasswordWithPhoneService(
  payload: ResetPasswordPayload,
): Promise<{ message: string }> {
  const phone = normalizePhone(payload.phone_no);

  const res = await fetch(`${getBaseUrl()}/api/auth/reset-password-phone`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone_no: phone,
      reset_token: payload.reset_token,
      password: payload.password,
      password_confirmation: payload.password_confirmation,
    }),
  });

  return handleResponse<{ message: string }>(res);
}

export async function isPhoneNoRegisteredService(
  phoneNo: string,
): Promise<boolean> {
  const phone = normalizePhone(phoneNo);

  const variants = [phone, `+${phone}`];
  if (phone.startsWith("62")) {
    variants.push(`0${phone.slice(2)}`);
  }

  const params = new URLSearchParams({
    "pagination[pageSize]": "1",
    "fields[0]": "id",
  });

  variants.forEach((v, i) => {
    params.append(`filters[$or][${i}][phone_no][$eq]`, v);
  });

  const res = await fetch(`${getBaseUrl()}/api/users?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const data = await handleResponse<unknown>(res);

  if (Array.isArray(data)) return data.length > 0;
  if (typeof data === "object" && data !== null && "data" in data) {
    const entries = (data as { data?: unknown }).data;
    return Array.isArray(entries) && entries.length > 0;
  }

  return false;
}

export async function createCustomerService(
  token: string,
  user: AuthUser,
): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: {
        user_id: user.id,
        name: user.username,
        phone_no: user.phone_no ?? undefined,
      },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message =
      errorBody?.error?.message ||
      errorBody?.message ||
      `Failed to create customer with status ${res.status}`;
    throw new Error(message);
  }
}

export async function registerService(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const phone = normalizePhone(payload.phone_no);

  const res = await fetch(`${getBaseUrl()}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone_no: phone,
      username: payload.username,
      password: payload.password,
    }),
  });

  const raw = await handleResponse<{
    jwt?: string;
    token?: string;
    user: AuthUser;
  }>(res);

  const token = raw.jwt ?? raw.token ?? "";
  if (!token || !raw.user) {
    throw new Error("Response tidak valid dari server.");
  }

  await createCustomerService(token, raw.user);
  return { token, user: raw.user };
}