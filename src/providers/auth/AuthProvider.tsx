import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

import axiosClient from "@/api/axiosClient";
import type { AuthContextValue, AuthUser } from "./authTypes";

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await axiosClient.get<AuthUser>("/auth/me");
      setUser(data);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const { data } = await axiosClient.get<AuthUser>("/auth/me");

        if (active) setUser(data);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void initialize();

    return () => {
      active = false;
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await axiosClient.post("/auth/logout");
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
