import { UserPlus, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilter,
} from "@/components/shared/data-table";
import { verificationConfig } from "@/features/adminBoard/verifications/config/verification.config";
import type { VerificationCase } from "@/features/adminBoard/verifications/types/verification";

type VerificationTableProps = {
  cases: VerificationCase[];
  selectedIds: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: (ids: string[]) => void;
  onClearSelection: () => void;
  onAssign: () => void;
};

const { statusMeta, priorityMeta, bulkAssignLabel } = verificationConfig;

const columns: DataTableColumn<VerificationCase>[] = [
  {
    id: "candidateName",
    header: "Candidate",
    sortable: true,
    accessorFn: (item) => item.candidateName,
    cell: (item) => (
      <div className="flex min-w-52 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {item.candidateInitials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{item.candidateName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {item.candidateEmail}
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "id",
    header: "Case",
    sortable: true,
    accessorFn: (item) => item.id,
    className: "text-sm text-muted-foreground",
  },
  {
    id: "checkType",
    header: "Check type",
    sortable: true,
    accessorFn: (item) => item.checkType,
    className: "text-sm",
  },
  {
    id: "status",
    header: "Status",
    sortable: true,
    accessorFn: (item) => statusMeta[item.status].label,
    cell: (item) => (
      <Badge variant="outline" className={statusMeta[item.status].badgeClass}>
        {statusMeta[item.status].label}
      </Badge>
    ),
  },
  {
    id: "priority",
    header: "Priority",
    sortable: true,
    accessorFn: (item) => priorityMeta[item.priority].label,
    cell: (item) => (
      <Badge
        variant="outline"
        className={priorityMeta[item.priority].badgeClass}
      >
        {priorityMeta[item.priority].label}
      </Badge>
    ),
  },
  {
    id: "assignee",
    header: "Assignee",
    sortable: true,
    accessorFn: (item) => item.assignee?.name ?? "Unassigned",
    cell: (item) =>
      item.assignee ? (
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
            {item.assignee.initials}
          </div>
          <span className="text-sm">{item.assignee.name}</span>
        </div>
      ) : (
        <span className="text-xs text-muted-foreground">Unassigned</span>
      ),
  },
  {
    id: "dueLabel",
    header: "Due",
    sortable: true,
    accessorFn: (item) => (item.isOverdue ? "Overdue" : item.dueLabel),
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
    id: "progress",
    header: "Progress",
    sortable: true,
    accessorFn: (item) => item.progress,
    headerClassName: "pr-6 text-right",
    className: "pr-6",
    cell: (item) => (
      <div className="flex items-center justify-end gap-2">
        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${item.progress}%` }}
          />
        </div>
        <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">
          {item.progress}%
        </span>
      </div>
    ),
  },
];

const filters: DataTableFilter<VerificationCase>[] = [
  {
    id: "status",
    label: "Status",
    accessorFn: (item) => item.status,
    options: Object.entries(statusMeta).map(([value, meta]) => ({
      value,
      label: meta.label,
    })),
  },
  {
    id: "priority",
    label: "Priority",
    accessorFn: (item) => item.priority,
    options: Object.entries(priorityMeta).map(([value, meta]) => ({
      value,
      label: meta.label,
    })),
  },
];

export function VerificationTable({
  cases,
  selectedIds,
  onToggleRow,
  onToggleAll,
  onClearSelection,
  onAssign,
}: VerificationTableProps) {
  const selectedCount = selectedIds.size;

  const bulkActions =
    selectedCount > 0 ? (
      <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-2 py-1">
        <span className="whitespace-nowrap text-sm font-medium">
          {selectedCount} selected
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs"
          onClick={onClearSelection}
        >
          <X className="size-3.5" />
          Clear
        </Button>
        <Button size="sm" className="h-7 gap-1.5" onClick={onAssign}>
          <UserPlus className="size-4" />
          {bulkAssignLabel}
        </Button>
      </div>
    ) : null;

  return (
    <DataTable
      data={cases}
      columns={columns}
      filters={filters}
      getRowId={(item) => item.id}
      searchPlaceholder="Search candidates, cases, assignees..."
      initialPageSize={10}
      pageSizeOptions={[10, 20, 50, 100]}
      selectable
      selectedIds={selectedIds}
      onToggleRow={onToggleRow}
      onToggleAll={onToggleAll}
      toolbarActions={bulkActions}
      getSearchValue={(item) =>
        [
          item.candidateName,
          item.candidateEmail,
          item.id,
          item.checkType,
          item.assignee?.name,
        ]
          .filter(Boolean)
          .join(" ")
      }
      emptyMessage="No verification cases found."
    />
  );
}
