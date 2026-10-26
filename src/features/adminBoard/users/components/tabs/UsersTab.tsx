import { useState } from "react";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardError } from "@/features/adminBoard/shared/components/DashboardError";
import { UsersTable } from "@/features/adminBoard/users/components/UsersTable";
import { InviteUserDialog } from "@/features/adminBoard/users/components/InviteUserDialog";
import { ChangeRoleDialog } from "@/features/adminBoard/users/components/ChangeRoleDialog";
import {
  useDepartments,
  useRoles,
  useUsers,
} from "@/features/adminBoard/users/hooks/useUsers";
import type { User } from "@/features/adminBoard/users/types/users";

function TableSkeleton() {
  return (
    <Card className="rounded-2xl border-border/70 p-4 shadow-sm">
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function UsersTab() {
  const usersQuery = useUsers();
  const rolesQuery = useRoles();
  const departmentsQuery = useDepartments();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [roleUser, setRoleUser] = useState<User | null>(null);

  const users = usersQuery.data?.users ?? [];
  const roles = rolesQuery.data ?? [];
  const departments = departmentsQuery.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {users.length} {users.length === 1 ? "user" : "users"}
        </p>
        <Button className="h-9 gap-2" onClick={() => setInviteOpen(true)}>
          <UserPlus className="size-4" />
          Invite user
        </Button>
      </div>

      {usersQuery.isLoading ? (
        <TableSkeleton />
      ) : usersQuery.isError ? (
        <DashboardError
          message={usersQuery.error?.message}
          onRetry={() => usersQuery.refetch()}
        />
      ) : (
        <UsersTable
          users={users}
          roles={roles}
          onChangeRole={(user) => setRoleUser(user)}
        />
      )}

      <InviteUserDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        roles={roles}
        departments={departments}
      />
      <ChangeRoleDialog
        open={roleUser !== null}
        onOpenChange={(open) => {
          if (!open) setRoleUser(null);
        }}
        user={roleUser}
        roles={roles}
      />
    </div>
  );
}
