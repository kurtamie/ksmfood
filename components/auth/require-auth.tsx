"use client";

import { type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import AuthModal from "@/components/auth/AuthModal";

type RequireAuthProps = {
  children: ReactNode;
};

export default function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-5xl items-center justify-center px-6">
        <p className="text-sm text-secondary-600">Memuat halaman...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <div className="mx-auto flex min-h-[40vh] max-w-5xl flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-lg font-semibold text-tertiary-900">
            Login diperlukan
          </p>
          <p className="text-sm text-secondary-600">
            Silakan masuk untuk mengakses halaman ini.
          </p>
        </div>
        <AuthModal
          isOpen={!isLoading && !isLoggedIn}
          onClose={() => {
            router.push("/");
          }}
        />
      </>
    );
  }

  return <>{children}</>;
}
