export interface AuthFieldErrors {
  phone_no?: string[];
  password?: string[];
  password_confirmation?: string[];
  username?: string[];
}

export const REQUIRED_MESSAGE = "Kolom ini wajib diisi";
export const INVALID_PHONE_MESSAGE = "Nomor whatsapp tidak valid";

export function normalizeAuthPhoneInput(phone: string): string {
  return phone.trim().replace(/^0+/, "");
}

export function validatePhoneNo(phone: string): string[] {
  const value = normalizeAuthPhoneInput(phone);
  const errors: string[] = [];

  if (!value) {
    errors.push(REQUIRED_MESSAGE);
    return errors;
  }

  if (!/^\d+$/.test(value)) {
    errors.push("Nomor whatsapp hanya boleh angka");
    return errors;
  }

  if (value.length < 10 || value.length > 15) {
    errors.push(INVALID_PHONE_MESSAGE);
  }

  return errors;
}

export function validateUsername(username: string): string[] {
  const value = username.trim();
  const errors: string[] = [];

  if (!value) {
    errors.push(REQUIRED_MESSAGE);
    return errors;
  }

  if (value.length < 3) {
    errors.push("Nama Pengguna minimal 3 karakter");
  }

  if (value.length > 30) {
    errors.push("Nama Pengguna terlalu panjang");
  }

  if (!/^[A-Za-z0-9_ ]+$/.test(value)) {
    errors.push("Nama Pengguna tidak valid");
  }

  return errors;
}

export function validatePassword(password: string): string[] {
  const errors: string[] = [];

  if (!password) {
    errors.push(REQUIRED_MESSAGE);
    return errors;
  }

  if (password.length < 8) {
    errors.push("Kata sandi minimal 8 Karakter");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Kata sandi harus mengandung huruf besar");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Kata sandi harus mengandung huruf kecil");
  }

  if (!/\d/.test(password)) {
    errors.push("Kata sandi harus mengandung angka");
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;/`~]/.test(password)) {
    errors.push(
      "Kata sandi harus mengandung karakter spesial, contoh: ! @ # $ %",
    );
  }

  return errors;
}

export function validatePasswordLogin(password: string): string[] {
  const errors: string[] = [];
  if (!password) {
    errors.push(REQUIRED_MESSAGE);
  }
  return errors;
}

export function validatePasswordConfirmation(
  password: string,
  passwordConfirmation: string,
): string[] {
  if (!passwordConfirmation) {
    return [REQUIRED_MESSAGE];
  }

  if (password !== passwordConfirmation) {
    return ["Konfirmasi kata sandi tidak sama"];
  }

  return [];
}

export function hasAuthFieldErrors(errors: AuthFieldErrors): boolean {
  return Object.values(errors).some((messages) => Boolean(messages?.length));
}
