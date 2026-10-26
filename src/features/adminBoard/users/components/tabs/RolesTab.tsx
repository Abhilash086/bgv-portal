import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Lock, Plus, SlidersHorizontal, Trash2, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardError } from "@/features/adminBoard/shared/components/DashboardError";
import { RolePermissionsDialog } from "@/features/adminBoard/users/components/RolePermissionsDialog";
import { CreateRoleDialog } from "@/features/adminBoard/users/components/CreateRoleDialog";
import {
  deleteRoleParams,
  useDeleteRole,
  usePermissions,
  useRoles,
} from "@/features/adminBoard/users/hooks/useUsers";
import type { Role } from "@/features/adminBoard/users/types/users";

export function RolesTab() {
  const rolesQuery = useRoles();
  const permissionsQuery = usePermissions();
  const deleteRole = useDeleteRole();

  const [editRole, setEditRole] = useState<Role | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const roles = rolesQuery.data ?? [];
  const permissions = permissionsQuery.data ?? [];

  const handleDelete = (role: Role) => {
    deleteRole.mutate(deleteRoleParams(role.id), {
      onSuccess: () => toast.success(`Role "${role.name}" deleted.`),
      onError: (error) =>
        toast.error(error.message ?? "Failed to delete role."),
    });
  };

  if (rolesQuery.isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="rounded-2xl border-border/70 p-5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-3 h-3 w-full" />
            <Skeleton className="mt-6 h-5 w-24 rounded-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (rolesQuery.isError) {
    return (
      <DashboardError
        message={rolesQuery.error?.message}
        onRetry={() => rolesQuery.refetch()}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {roles.length} {roles.length === 1 ? "role" : "roles"}
        </p>
        <Button className="h-9 gap-2" onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          New role
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((role, index) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Card className="flex h-full flex-col rounded-2xl border-border/70 shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold tracking-tight">
                      {role.name}
                    </h3>
                    {role.isSystem && (
                      <Badge
                        variant="outline"
                        className="gap-1 border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-300"
                      >
                        <Lock className="size-3" />
                        System
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="mt-1.5 flex-1 text-sm text-muted-foreground">
                  {role.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                    <SlidersHorizontal className="size-3.5" />
                    {role.permissionCount} permissions
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                    <Users className="size-3.5" />
                    {role.userCount} users
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 flex-1 gap-1.5"
                    onClick={() => setEditRole(role)}
                  >
                    <SlidersHorizontal className="size-3.5" />
                    {role.isSystem ? "View" : "Permissions"}
                  </Button>
                  {!role.isSystem && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={`Delete ${role.name}`}
                      disabled={role.userCount > 0 || deleteRole.isPending}
                      title={
                        role.userCount > 0
                          ? "Reassign its users before deleting"
                          : "Delete role"
                      }
                      onClick={() => handleDelete(role)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <RolePermissionsDialog
        open={editRole !== null}
        onOpenChange={(open) => {
          if (!open) setEditRole(null);
        }}
        role={editRole}
        permissions={permissions}
      />
      <CreateRoleDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        permissions={permissions}
      />
    </div>
  );
}
