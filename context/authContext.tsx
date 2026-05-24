"use client";

import { AuthUser } from "@/app/data/services/auth-service";
import { logoutAction } from "@/app/data/actions/auth-actions";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (token: string, user: AuthUser) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function clearClientUserCookie() {
  if (typeof document === "undefined") return;
  document.cookie =
    "ksm_auth_user=; path=/; max-age=0; SameSite=Lax";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
        credentials: "include",
      });

      if (!res.ok) {
        clearClientUserCookie();
        setState({ user: null, token: null, isLoading: false });
        return;
      }

      const json = await res.json();
      if (json?.success && json.user?.id) {
        setState({
          user: json.user as AuthUser,
          token: "cookie",
          isLoading: false,
        });
        return;
      }

      clearClientUserCookie();
      setState({ user: null, token: null, isLoading: false });
    } catch {
      clearClientUserCookie();
      setState({ user: null, token: null, isLoading: false });
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const login = useCallback((token: string, user: AuthUser) => {
    setState({ user, token, isLoading: false });
    void refreshSession();
  }, [refreshSession]);

  const logout = useCallback(async () => {
    try {
      await logoutAction();
    } finally {
      clearClientUserCookie();
      setState({ user: null, token: null, isLoading: false });
    }
  }, []);

  const isLoggedIn = !!state.token && !!state.user;

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        refreshSession,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
