import { toast } from "sonner";
import { Monitor, Smartphone, LogOut } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilter,
} from "@/components/shared/data-table";
import { DashboardError } from "@/features/adminBoard/shared/components/DashboardError";
import { usersConfig } from "@/features/adminBoard/users/config/users.config";
import {
  revokeSessionParams,
  useLoginSessions,
  useRevokeSession,
} from "@/features/adminBoard/users/hooks/useUsers";
import { fallbackLoginSessions } from "@/features/adminBoard/users/data/users";
import { env } from "@/config/env";
import type { LoginSession } from "@/features/adminBoard/users/types/users";

const { sessionStatusMeta } = usersConfig;

function isMobile(device: string) {
  return /phone|iphone|android|mobile/i.test(device);
}

export function SessionsTab() {
  const sessionsQuery = useLoginSessions();
  const revoke = useRevokeSession();

  // data ? data : fallback from data/ folder
  const sessions =
    sessionsQuery.data && sessionsQuery.data.length > 0
      ? sessionsQuery.data
      : fallbackLoginSessions;

  const handleRevoke = (session: LoginSession) => {
    revoke.mutate(revokeSessionParams(session.id), {
      onSuccess: () =>
        toast.success(`Session for ${session.userName} revoked.`),
      onError: (error) =>
        toast.error(error.message ?? "Failed to revoke session."),
    });
  };

  const columns: DataTableColumn<LoginSession>[] = [
    {
      id: "userName",
      header: "User",
      sortable: true,
      accessorFn: (item) => item.userName,
      cell: (item) => (
        <div className="flex min-w-44 items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
            {item.userInitials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {item.userName}
              {item.current && (
                <span className="ml-1.5 text-xs font-normal text-emerald-600 dark:text-emerald-400">
                  (this device)
                </span>
              )}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {item.ipAddress}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "device",
      header: "Device",
      sortable: true,
      accessorFn: (item) => item.device,
      cell: (item) => {
        const Icon = isMobile(item.device) ? Smartphone : Monitor;
        return (
          <div className="flex items-center gap-2">
            <Icon className="size-4 text-muted-foreground" />
            <div className="min-w-0">
              <p className="truncate text-sm">{item.device}</p>
              <p className="truncate text-xs text-muted-foreground">
                {item.browser}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: "location",
      header: "Location",
      sortable: true,
      accessorFn: (item) => item.location,
      className: "text-sm text-muted-foreground",
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      accessorFn: (item) => sessionStatusMeta[item.status].label,
      cell: (item) => (
        <Badge
          variant="outline"
          className={sessionStatusMeta[item.status].badgeClass}
        >
          {sessionStatusMeta[item.status].label}
        </Badge>
      ),
    },
    {
      id: "lastActiveLabel",
      header: "Last active",
      sortable: true,
      accessorFn: (item) => new Date(item.lastActiveAt).getTime(),
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
          {item.status === "active" && !item.current ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 text-muted-foreground hover:text-destructive"
              disabled={revoke.isPending}
              onClick={() => handleRevoke(item)}
            >
              <LogOut className="size-3.5" />
              Revoke
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
      ),
    },
  ];

  const filters: DataTableFilter<LoginSession>[] = [
    {
      id: "status",
      label: "Status",
      accessorFn: (item) => item.status,
      options: Object.entries(sessionStatusMeta).map(([value, meta]) => ({
        value,
        label: meta.label,
      })),
    },
  ];

  if (sessionsQuery.isLoading) {
    return (
      <Card className="rounded-2xl border-border/70 p-4 shadow-sm">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (sessionsQuery.isError && !env.useMockFallback) {
    return (
      <DashboardError
        message={sessionsQuery.error?.message}
        onRetry={() => sessionsQuery.refetch()}
      />
    );
  }

  return (
    <DataTable
      data={sessions}
      columns={columns}
      filters={filters}
      getRowId={(item) => item.id}
      searchPlaceholder="Search by user, device, IP, location..."
      initialPageSize={10}
      pageSizeOptions={[10, 20, 50, 100]}
      getSearchValue={(item) =>
        [item.userName, item.device, item.browser, item.ipAddress, item.location]
          .filter(Boolean)
          .join(" ")
      }
      emptyMessage="No login sessions found."
    />
  );
}
