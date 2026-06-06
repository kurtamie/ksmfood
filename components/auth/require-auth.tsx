"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import AuthModal from "@/components/auth/AuthModal";

type RequireAuthProps = {
  children: ReactNode;
};

export default function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const { isLoggedIn, isLoading, refreshSession } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) {
      setAuthOpen(true);
    } else {
      setAuthOpen(false);
    }
  }, [isLoading, isLoggedIn]);

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-5xl items-center justify-center px-6">
        <p className="text-sm text-secondary-600">Memuat sesi...</p>
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
          isOpen={authOpen}
          onClose={() => {
            setAuthOpen(false);
            router.push("/");
          }}
          onSuccess={() => {
            void refreshSession();
            setAuthOpen(false);
          }}
        />
      </>
    );
  }

  return <>{children}</>;
}
