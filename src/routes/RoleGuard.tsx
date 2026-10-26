import { Navigate, Outlet } from "react-router-dom";
import type { UserRole } from "@/providers/auth/authTypes";
import { useAuth } from "@/providers/auth/useAuth";

interface RoleGuardProps {
  allowedRoles: UserRole[];
}

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { user } = useAuth();

  const hasAccess = user?.roles.some((role) => allowedRoles.includes(role));

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
