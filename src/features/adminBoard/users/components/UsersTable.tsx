import { toast } from "sonner";
import {
  MoreHorizontal,
  Ban,
  CheckCircle2,
  PauseCircle,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilter,
} from "@/components/shared/data-table";
import { usersConfig } from "@/features/adminBoard/users/config/users.config";
import {
  updateUserStatusParams,
  useUpdateUserStatus,
} from "@/features/adminBoard/users/hooks/useUsers";
import type {
  Role,
  User,
  UserStatus,
} from "@/features/adminBoard/users/types/users";

type UsersTableProps = {
  users: User[];
  roles: Role[];
  onChangeRole: (user: User) => void;
};

const { userStatusMeta } = usersConfig;

export function UsersTable({ users, roles, onChangeRole }: UsersTableProps) {
  const updateStatus = useUpdateUserStatus();

  const setStatus = (user: User, status: UserStatus, verb: string) => {
    updateStatus.mutate(updateUserStatusParams({ userId: user.id, status }), {
      onSuccess: () => toast.success(`${user.name} ${verb}.`),
      onError: (error) =>
        toast.error(error.message ?? `Failed to update ${user.name}.`),
    });
  };

  const roleFilterOptions = roles.map((role) => ({
    value: role.name,
    label: role.name,
  }));

  const columns: DataTableColumn<User>[] = [
    {
      id: "name",
      header: "User",
      sortable: true,
      accessorFn: (item) => item.name,
      cell: (item) => (
        <div className="flex min-w-52 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {item.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{item.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {item.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "roleName",
      header: "Role",
      sortable: true,
      accessorFn: (item) => item.roleName,
      className: "text-sm",
    },
    {
      id: "departmentName",
      header: "Department",
      sortable: true,
      accessorFn: (item) => item.departmentName,
      className: "text-sm text-muted-foreground",
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      accessorFn: (item) => userStatusMeta[item.status].label,
      cell: (item) => (
        <Badge
          variant="outline"
          className={userStatusMeta[item.status].badgeClass}
        >
          {userStatusMeta[item.status].label}
        </Badge>
      ),
    },
    {
      id: "mfaEnabled",
      header: "MFA",
      sortable: true,
      accessorFn: (item) => (item.mfaEnabled ? "On" : "Off"),
      cell: (item) =>
        item.mfaEnabled ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-3.5" />
            On
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <ShieldOff className="size-3.5" />
            Off
          </span>
        ),
    },
    {
      id: "lastActiveLabel",
      header: "Last active",
      sortable: true,
      accessorFn: (item) =>
        item.lastActiveAt ? new Date(item.lastActiveAt).getTime() : 0,
      cell: (item) => (
        <span className="text-sm text-muted-foreground">
          {item.lastActiveLabel}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      searchable: false,
      headerClassName: "pr-6 text-right",
      className: "pr-6 text-right",
      cell: (item) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Actions for ${item.name}`}
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Manage account</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onChangeRole(item)}>
                  <ShieldCheck className="size-4" />
                  Change role
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {item.status !== "active" && (
                  <DropdownMenuItem
                    onClick={() => setStatus(item, "active", "activated")}
                  >
                    <CheckCircle2 className="size-4" />
                    Activate
                  </DropdownMenuItem>
                )}
                {item.status === "active" && (
                  <DropdownMenuItem
                    onClick={() => setStatus(item, "inactive", "deactivated")}
                  >
                    <PauseCircle className="size-4" />
                    Deactivate
                  </DropdownMenuItem>
                )}
                {item.status !== "suspended" && (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setStatus(item, "suspended", "suspended")}
                  >
                    <Ban className="size-4" />
                    Suspend
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const filters: DataTableFilter<User>[] = [
    {
      id: "status",
      label: "Status",
      accessorFn: (item) => item.status,
      options: Object.entries(userStatusMeta).map(([value, meta]) => ({
        value,
        label: meta.label,
      })),
    },
    {
      id: "roleName",
      label: "Role",
      accessorFn: (item) => item.roleName,
      options: roleFilterOptions,
    },
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      filters={filters}
      getRowId={(item) => item.id}
      searchPlaceholder="Search by name, email, role..."
      initialPageSize={10}
      pageSizeOptions={[10, 20, 50, 100]}
      getSearchValue={(item) =>
        [item.name, item.email, item.roleName, item.departmentName]
          .filter(Boolean)
          .join(" ")
      }
      emptyMessage="No users found."
    />
  );
}
