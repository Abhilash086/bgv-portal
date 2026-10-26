import { toast } from "sonner";
import { Check, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilter,
} from "@/components/shared/data-table";
import { DashboardError } from "@/features/adminBoard/shared/components/DashboardError";
import { usersConfig } from "@/features/adminBoard/users/config/users.config";
import {
  decideAccessReviewParams,
  useAccessReviews,
  useDecideAccessReview,
} from "@/features/adminBoard/users/hooks/useUsers";
import type { AccessReview } from "@/features/adminBoard/users/types/users";

const { reviewStatusMeta } = usersConfig;

export function ReviewsTab() {
  const reviewsQuery = useAccessReviews();
  const decide = useDecideAccessReview();

  const reviews = reviewsQuery.data ?? [];

  const handleDecision = (
    review: AccessReview,
    decision: "approved" | "revoked",
  ) => {
    decide.mutate(decideAccessReviewParams(review.id, decision), {
      onSuccess: () =>
        toast.success(
          decision === "approved"
            ? `Access approved for ${review.userName}.`
            : `Access revoked for ${review.userName}.`,
        ),
      onError: (error) =>
        toast.error(error.message ?? "Failed to record decision."),
    });
  };

  const columns: DataTableColumn<AccessReview>[] = [
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
            <p className="truncate text-sm font-medium">{item.userName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {item.roleName}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "resource",
      header: "Access under review",
      sortable: true,
      accessorFn: (item) => item.resource,
      className: "text-sm",
    },
    {
      id: "reviewer",
      header: "Reviewer",
      sortable: true,
      accessorFn: (item) => item.reviewer,
      className: "text-sm text-muted-foreground",
    },
    {
      id: "dueLabel",
      header: "Due",
      sortable: true,
      accessorFn: (item) => new Date(item.dueDate).getTime(),
      cell: (item) => (
        <span
          className={cn(
            "text-sm",
            item.isOverdue
              ? "font-medium text-rose-600 dark:text-rose-400"
              : "text-muted-foreground",
          )}
        >
          {item.isOverdue ? "Overdue" : item.dueLabel}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      accessorFn: (item) => reviewStatusMeta[item.status].label,
      cell: (item) => (
        <Badge
          variant="outline"
          className={reviewStatusMeta[item.status].badgeClass}
        >
          {reviewStatusMeta[item.status].label}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      searchable: false,
      headerClassName: "pr-6 text-right",
      className: "pr-6 text-right",
      cell: (item) =>
        item.status === "pending" ? (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              disabled={decide.isPending}
              onClick={() => handleDecision(item, "approved")}
            >
              <Check className="size-3.5" />
              Approve
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-muted-foreground hover:text-destructive"
              disabled={decide.isPending}
              onClick={() => handleDecision(item, "revoked")}
            >
              <X className="size-3.5" />
              Revoke
            </Button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Reviewed</span>
        ),
    },
  ];

  const filters: DataTableFilter<AccessReview>[] = [
    {
      id: "status",
      label: "Status",
      accessorFn: (item) => item.status,
      options: Object.entries(reviewStatusMeta).map(([value, meta]) => ({
        value,
        label: meta.label,
      })),
    },
  ];

  if (reviewsQuery.isLoading) {
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

  if (reviewsQuery.isError) {
    return (
      <DashboardError
        message={reviewsQuery.error?.message}
        onRetry={() => reviewsQuery.refetch()}
      />
    );
  }

  return (
    <DataTable
      data={reviews}
      columns={columns}
      filters={filters}
      getRowId={(item) => item.id}
      searchPlaceholder="Search by user, resource, reviewer..."
      initialPageSize={10}
      pageSizeOptions={[10, 20, 50, 100]}
      getSearchValue={(item) =>
        [item.userName, item.roleName, item.resource, item.reviewer]
          .filter(Boolean)
          .join(" ")
      }
      emptyMessage="No access reviews found."
    />
  );
}
