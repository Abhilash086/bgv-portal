export type UserRole = "ADMIN" | "HR" | "VERIFIER" | "CANDIDATE";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}
