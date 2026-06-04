"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  loginAction,
  resetPasswordWithPhoneAction,
  sendOtpAction,
  sendPasswordResetOtpAction,
  verifyOtpAction,
  registerAction,
} from "@/app/data/actions/auth-actions";
import { useAuth } from "@/context/authContext";
import {
  type AuthFieldErrors,
  hasAuthFieldErrors,
  normalizeAuthPhoneInput,
  validatePassword,
  validatePasswordConfirmation,
  validatePhoneNo,
  validateUsername,
} from "@/lib/auth-validation";

type Step =
  | "login"
  | "register"
  | "otp"
  | "profile"
  | "forgot-password"
  | "forgot-otp"
  | "reset-password";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const { login } = useAuth();

  const [step, setStep] = useState<Step>("login");
  const [phone, setPhone] = useState("");
  const [resetPhone, setResetPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [username, setusername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});

  if (!isOpen) return null;

  const otpCode = otp.join("");

  const handlePhoneChange = (value: string) => {
    setPhone(normalizeAuthPhoneInput(value));
  };

  const handleResetPhoneChange = (value: string) => {
    setResetPhone(normalizeAuthPhoneInput(value));
  };

  const resetFeedback = () => {
    setErrorMsg("");
    setFieldErrors({});
  };

  const applyActionErrors = (
    fallback: string,
    result: { error?: string; fieldErrors?: AuthFieldErrors },
  ) => {
    setFieldErrors(result.fieldErrors ?? {});
    setErrorMsg(result.error ?? fallback);
  };

  const renderFieldErrors = (messages?: string[]) => {
    if (!messages?.length) return null;
    if (messages.length === 1) {
      return <p className="text-xs text-red-500">{messages[0]}</p>;
    }

    return (
      <ul className="list-disc pl-4 text-xs text-red-500">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    );
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleLogin = async () => {
    setErrorMsg("");
    const nextFieldErrors: AuthFieldErrors = {
      phone_no: validatePhoneNo(phone),
      password: validatePassword(password),
    };
    setFieldErrors(nextFieldErrors);

    if (hasAuthFieldErrors(nextFieldErrors)) {
      return;
    }

    setIsLoading(true);
    const result = await loginAction({ phone_no: phone, password });
    setIsLoading(false);
    if (!result.success) {
      applyActionErrors("Login gagal.", result);
      return;
    }
    login(result.data!.token, result.data!.user);
    onSuccess?.();
    onClose();
  };

  const handleSendOtp = async () => {
    setErrorMsg("");
    const nextFieldErrors: AuthFieldErrors = {
      phone_no: validatePhoneNo(phone),
    };
    setFieldErrors(nextFieldErrors);

    if (hasAuthFieldErrors(nextFieldErrors)) {
      return;
    }

    setIsLoading(true);
    const result = await sendOtpAction({ phone_no: phone });
    setIsLoading(false);
    if (!result.success) {
      applyActionErrors("Gagal mengirim OTP.", result);
      return;
    }
    setOtp(["", "", "", "", "", ""]);
    setStep("otp");
  };

  const handleSendPasswordResetOtp = async () => {
    setErrorMsg("");
    const nextFieldErrors: AuthFieldErrors = {
      phone_no: validatePhoneNo(resetPhone),
    };
    setFieldErrors(nextFieldErrors);

    if (hasAuthFieldErrors(nextFieldErrors)) {
      return;
    }

    setIsLoading(true);
    const result = await sendPasswordResetOtpAction({ phone_no: resetPhone });
    setIsLoading(false);
    if (!result.success) {
      applyActionErrors("Gagal mengirim OTP.", result);
      return;
    }
    setOtp(["", "", "", "", "", ""]);
    setStep("forgot-otp");
  };

  const handleVerifyOtp = async () => {
    setErrorMsg("");
    setFieldErrors({});
    if (otpCode.length < 6) {
      setErrorMsg("Masukkan 6 digit kode OTP.");
      return;
    }
    setIsLoading(true);
    const result = await verifyOtpAction({
      phone_no: phone,
      otp_code: otpCode,
    });
    setIsLoading(false);
    if (!result.success) {
      setErrorMsg(result.error ?? "Kode OTP tidak valid.");
      return;
    }
    setStep("profile");
  };

  const handleVerifyPasswordResetOtp = async () => {
    setErrorMsg("");
    setFieldErrors({});
    if (otpCode.length < 6) {
      setErrorMsg("Masukkan 6 digit kode OTP.");
      return;
    }
    setNewPassword("");
    setConfirmPassword("");
    setStep("reset-password");
  };

  const handleRegister = async () => {
    setErrorMsg("");
    const nextFieldErrors: AuthFieldErrors = {
      username: validateUsername(username),
      phone_no: validatePhoneNo(phone),
      password: validatePassword(newPassword),
    };
    setFieldErrors(nextFieldErrors);

    if (hasAuthFieldErrors(nextFieldErrors)) {
      return;
    }

    setIsLoading(true);
    const result = await registerAction({
      phone_no: phone,
      username: username,
      password: newPassword,
    });
    setIsLoading(false);
    if (!result.success) {
      applyActionErrors("Registrasi gagal.", result);
      return;
    }
    login(result.data!.token, result.data!.user);
    onSuccess?.();
    onClose();
  };

  const handleResetPassword = async () => {
    setErrorMsg("");
    const nextFieldErrors: AuthFieldErrors = {
      password: validatePassword(newPassword),
      password_confirmation: validatePasswordConfirmation(
        newPassword,
        confirmPassword,
      ),
    };
    setFieldErrors(nextFieldErrors);

    if (hasAuthFieldErrors(nextFieldErrors)) {
      return;
    }

    setIsLoading(true);
    const result = await resetPasswordWithPhoneAction({
      phone_no: resetPhone,
      otp_code: otpCode,
      password: newPassword,
      password_confirmation: confirmPassword,
    });
    setIsLoading(false);
    if (!result.success) {
      applyActionErrors("Gagal mengganti kata sandi.", result);
      return;
    }

    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOtp(["", "", "", "", "", ""]);
    resetFeedback();
    setStep("login");
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center justify-center px-6 pt-6 pb-4 border-b border-secondary-200">
          <div className="text-center">
            {step === "login" && (
              <>
                <p className="text-2xl font-bold text-tertiary-900">Masuk</p>
                <h2 className="text-sm text-secondary-600">
                  Selamat datang kembali
                </h2>
              </>
            )}
            {step === "register" && (
              <>
                <p className="text-2xl font-bold text-tertiary-900">Daftar</p>
                <h2 className="text-sm text-secondary-600">Buat akun baru</h2>
              </>
            )}
            {step === "otp" && (
              <>
                <p className="text-2xl font-bold text-tertiary-900">Kode OTP</p>
                <h2 className="text-sm text-secondary-600">
                  Verifikasi nomor WhatsApp
                </h2>
              </>
            )}
            {step === "forgot-password" && (
              <>
                <p className="text-2xl font-bold text-tertiary-900">
                  Lupa Kata Sandi
                </p>
                <h2 className="text-sm text-secondary-600">
                  Masukkan nomor WhatsApp
                </h2>
              </>
            )}
            {step === "forgot-otp" && (
              <>
                <p className="text-2xl font-bold text-tertiary-900">Kode OTP</p>
                <h2 className="text-sm text-secondary-600">
                  Verifikasi nomor WhatsApp
                </h2>
              </>
            )}
            {step === "reset-password" && (
              <>
                <p className="text-2xl font-bold text-tertiary-900">
                  Kata Sandi Baru
                </p>
                <h2 className="text-sm text-secondary-600">
                  Buat kata sandi baru
                </h2>
              </>
            )}
            {step === "profile" && (
              <>
                <p className="text-2xl font-bold text-tertiary-900">
                  Data Diri
                </p>
                <h2 className="text-sm text-secondary-600">
                  Lengkapi data diri
                </h2>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="absolute right-4 rounded-lg p-1.5 text-secondary-600 hover:bg-secondary-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {errorMsg && (
            <p className="text-xs text-red-500 text-center bg-red-50 rounded-lg px-3 py-2">
              {errorMsg}
            </p>
          )}

          {step === "login" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-tertiary-800">
                  Nomor WhatsApp
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-secondary-400 px-3 py-2.5 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-all">
                  <span className="text-sm text-secondary-600 shrink-0">
                    +62
                  </span>
                  <div className="w-px h-4 bg-secondary-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="8xxxxxxxxxx"
                    className="flex-1 text-sm outline-none bg-transparent text-tertiary-900 placeholder:text-secondary-500"
                  />
                </div>
                {renderFieldErrors(fieldErrors.phone_no)}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-tertiary-800">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="Masukkan password"
                    className="w-full rounded-xl border border-secondary-400 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-tertiary-900 placeholder:text-secondary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute inset-y-0 right-3 flex items-center text-secondary-500 hover:text-tertiary-900"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
                {renderFieldErrors(fieldErrors.password)}
              </div>

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full rounded-xl bg-primary-500 py-3 text-sm font-bold text-white hover:bg-primary-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </button>

              <button
                onClick={() => {
                  resetFeedback();
                  setResetPhone(phone);
                  setOtp(["", "", "", "", "", ""]);
                  setStep("forgot-password");
                }}
                className="self-center text-xs font-semibold text-primary-500 hover:underline"
              >
                Lupa kata sandi?
              </button>

              <p className="text-center text-xs text-secondary-600">
                Belum punya akun?{" "}
                <button
                  onClick={() => {
                    resetFeedback();
                    setStep("register");
                  }}
                  className="font-semibold text-primary-500 hover:underline"
                >
                  Daftar sekarang
                </button>
              </p>
            </>
          )}

          {step === "register" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-tertiary-800">
                  Nomor WhatsApp
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-secondary-400 px-3 py-2.5 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-all">
                  <span className="text-sm text-secondary-600 shrink-0">
                    +62
                  </span>
                  <div className="w-px h-4 bg-secondary-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="8xxxxxxxxxx"
                    className="flex-1 text-sm outline-none bg-transparent text-tertiary-900 placeholder:text-secondary-500"
                  />
                </div>
                {renderFieldErrors(fieldErrors.phone_no)}
                <p className="text-xs text-secondary-600">
                  Kode OTP akan dikirim ke nomor WhatsApp ini
                </p>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full rounded-xl bg-primary-500 py-3 text-sm font-bold text-white hover:bg-primary-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Mengirim OTP..." : "Kirim Kode OTP"}
              </button>

              <p className="text-center text-xs text-secondary-600">
                Sudah punya akun?{" "}
                <button
                  onClick={() => {
                    resetFeedback();
                    setStep("login");
                  }}
                  className="font-semibold text-primary-500 hover:underline"
                >
                  Masuk
                </button>
              </p>
            </>
          )}

          {step === "otp" && (
            <>
              <p className="text-sm text-secondary-600 text-center">
                Kode OTP telah dikirim ke WhatsApp{" "}
                <span className="font-semibold text-tertiary-900">
                  +62{phone}
                </span>
              </p>

              <div className="flex items-center justify-center gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-secondary-400 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-tertiary-900"
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full rounded-xl bg-primary-500 py-3 text-sm font-bold text-white hover:bg-primary-600 transition-colors disabled:opacity-60"
              >
                {isLoading ? "Memverifikasi..." : "Verifikasi"}
              </button>

              <p className="text-center text-xs text-secondary-600">
                Tidak menerima kode?{" "}
                <button
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="font-semibold text-primary-500 hover:underline disabled:opacity-60"
                >
                  Kirim ulang
                </button>
              </p>
            </>
          )}

          {step === "forgot-password" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-tertiary-800">
                  Nomor WhatsApp
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-secondary-400 px-3 py-2.5 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-all">
                  <span className="text-sm text-secondary-600 shrink-0">
                    +62
                  </span>
                  <div className="w-px h-4 bg-secondary-400" />
                  <input
                    type="tel"
                    value={resetPhone}
                    onChange={(e) => handleResetPhoneChange(e.target.value)}
                    placeholder="8xxxxxxxxxx"
                    className="flex-1 text-sm outline-none bg-transparent text-tertiary-900 placeholder:text-secondary-500"
                  />
                </div>
                {renderFieldErrors(fieldErrors.phone_no)}
              </div>

              <button
                onClick={handleSendPasswordResetOtp}
                disabled={isLoading}
                className="w-full rounded-xl bg-primary-500 py-3 text-sm font-bold text-white hover:bg-primary-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Mengirim OTP..." : "Kirim Kode OTP"}
              </button>

              <button
                onClick={() => {
                  resetFeedback();
                  setStep("login");
                }}
                className="self-center text-xs font-semibold text-primary-500 hover:underline"
              >
                Kembali ke login
              </button>
            </>
          )}

          {step === "forgot-otp" && (
            <>
              <p className="text-sm text-secondary-600 text-center">
                Kode OTP telah dikirim ke WhatsApp{" "}
                <span className="font-semibold text-tertiary-900">
                  +62{resetPhone}
                </span>
              </p>

              <div className="flex items-center justify-center gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-secondary-400 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-tertiary-900"
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyPasswordResetOtp}
                disabled={isLoading}
                className="w-full rounded-xl bg-primary-500 py-3 text-sm font-bold text-white hover:bg-primary-600 transition-colors disabled:opacity-60"
              >
                {isLoading ? "Memverifikasi..." : "Verifikasi"}
              </button>

              <p className="text-center text-xs text-secondary-600">
                Tidak menerima kode?{" "}
                <button
                  onClick={handleSendPasswordResetOtp}
                  disabled={isLoading}
                  className="font-semibold text-primary-500 hover:underline disabled:opacity-60"
                >
                  Kirim ulang
                </button>
              </p>
            </>
          )}

          {step === "reset-password" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-tertiary-800">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="w-full rounded-xl border border-secondary-400 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-tertiary-900 placeholder:text-secondary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((current) => !current)}
                    className="absolute inset-y-0 right-3 flex items-center text-secondary-500 hover:text-tertiary-900"
                  >
                    {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
                {renderFieldErrors(fieldErrors.password)}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-tertiary-800">
                  Konfirmasi Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                    placeholder="Ulangi kata sandi baru"
                    className="w-full rounded-xl border border-secondary-400 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-tertiary-900 placeholder:text-secondary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    className="absolute inset-y-0 right-3 flex items-center text-secondary-500 hover:text-tertiary-900"
                  >
                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
                {renderFieldErrors(fieldErrors.password_confirmation)}
              </div>

              <button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="w-full rounded-xl bg-primary-500 py-3 text-sm font-bold text-white hover:bg-primary-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Menyimpan..." : "Simpan Kata Sandi"}
              </button>
            </>
          )}

          {step === "profile" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-tertiary-800">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setusername(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="rounded-xl border border-secondary-400 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-tertiary-900 placeholder:text-secondary-500"
                />
                {renderFieldErrors(fieldErrors.username)}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-tertiary-800">
                  Buat Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                    placeholder="Minimal 8 karakter"
                    className="w-full rounded-xl border border-secondary-400 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-tertiary-900 placeholder:text-secondary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((current) => !current)}
                    className="absolute inset-y-0 right-3 flex items-center text-secondary-500 hover:text-tertiary-900"
                  >
                    {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
                {renderFieldErrors(fieldErrors.password)}
              </div>

              <button
                onClick={handleRegister}
                disabled={isLoading}
                className="w-full rounded-xl bg-primary-500 py-3 text-sm font-bold text-white hover:bg-primary-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Mendaftar..." : "Daftar"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
