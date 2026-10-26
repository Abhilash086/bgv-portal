import { Fragment, useMemo } from "react";
import { Check, Minus } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DashboardError } from "@/features/adminBoard/shared/components/DashboardError";
import {
  usePermissions,
  useRoles,
} from "@/features/adminBoard/users/hooks/useUsers";
import type { Permission } from "@/features/adminBoard/users/types/users";

function groupByModule(permissions: Permission[]) {
  const groups = new Map<string, Permission[]>();
  for (const perm of permissions) {
    const list = groups.get(perm.module) ?? [];
    list.push(perm);
    groups.set(perm.module, list);
  }
  return [...groups.entries()];
}

export function PermissionMatrixTab() {
  const rolesQuery = useRoles();
  const permissionsQuery = usePermissions();

  const roles = useMemo(() => rolesQuery.data ?? [], [rolesQuery.data]);
  const permissions = useMemo(
    () => permissionsQuery.data ?? [],
    [permissionsQuery.data],
  );
  const groups = useMemo(() => groupByModule(permissions), [permissions]);

  // Fast lookup of "does role R grant permission P".
  const grantSets = useMemo(
    () => new Map(roles.map((role) => [role.id, new Set(role.permissionIds)])),
    [roles],
  );

  if (rolesQuery.isLoading || permissionsQuery.isLoading) {
    return (
      <Card className="rounded-2xl border-border/70 p-6">
        <Skeleton className="h-5 w-40" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-6 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (rolesQuery.isError || permissionsQuery.isError) {
    return (
      <DashboardError
        message={rolesQuery.error?.message ?? permissionsQuery.error?.message}
        onRetry={() => {
          rolesQuery.refetch();
          permissionsQuery.refetch();
        }}
      />
    );
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="sticky left-0 z-10 min-w-56 bg-muted/30 px-4 py-3 text-left font-medium">
                Permission
              </th>
              {roles.map((role) => (
                <th
                  key={role.id}
                  className="min-w-28 px-3 py-3 text-center align-bottom font-medium"
                >
                  <span className="block truncate" title={role.name}>
                    {role.name}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-normal text-muted-foreground">
                    {role.permissionCount}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {groups.map(([module, modulePerms]) => (
              <Fragment key={module}>
                <tr className="border-b border-border/70 bg-background">
                  <td
                    colSpan={roles.length + 1}
                    className="sticky left-0 bg-background px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {module}
                  </td>
                </tr>

                {modulePerms.map((perm) => (
                  <tr
                    key={perm.id}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/30"
                  >
                    <td className="sticky left-0 z-10 bg-card px-4 py-2.5">
                      <span className="block font-medium">{perm.label}</span>
                      <span className="block text-xs text-muted-foreground">
                        {perm.description}
                      </span>
                    </td>

                    {roles.map((role) => {
                      const granted = grantSets.get(role.id)?.has(perm.id);
                      return (
                        <td key={role.id} className="px-3 py-2.5 text-center">
                          <span
                            className={cn(
                              "inline-flex size-6 items-center justify-center rounded-md",
                              granted
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "text-muted-foreground/40",
                            )}
                            aria-label={
                              granted
                                ? `${role.name} has ${perm.label}`
                                : `${role.name} does not have ${perm.label}`
                            }
                          >
                            {granted ? (
                              <Check className="size-4" />
                            ) : (
                              <Minus className="size-4" />
                            )}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
