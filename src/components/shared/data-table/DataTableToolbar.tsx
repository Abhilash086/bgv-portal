import type { ReactNode } from "react";
import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/Dropdown";
import type { DataTableOption } from "./types";

/**
 * The toolbar only renders a filter's id/label/options — it never touches the
 * (generic) accessor — so it accepts this `T`-independent shape. That lets
 * DataTable pass `DataTableFilter<T>[]` without a generic mismatch.
 */
type ToolbarFilter = {
  id: string;
  label: string;
  options: DataTableOption[];
};

type DataTableToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  filters: ToolbarFilter[];
  filterValues: Record<string, string>;
  onFilterChange: (id: string, value: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  searchPlaceholder: string;
  actions?: ReactNode;
};

export function DataTableToolbar({
  search,
  onSearchChange,
  filters,
  filterValues,
  onFilterChange,
  onClear,
  hasActiveFilters,
  searchPlaceholder,
  actions,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="w-full sm:max-w-sm">
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label="Search table"
          className="h-9"
        />
      </div>

      {filters.map((filter) => (
        <Dropdown
          key={filter.id}
          className="w-full sm:w-44"
          ariaLabel={filter.label}
          placeholder={`${filter.label}: All`}
          value={filterValues[filter.id] ?? ""}
          onChange={(value) => onFilterChange(filter.id, value)}
          options={[
            { label: `${filter.label}: All`, value: "" },
            ...filter.options,
          ]}
        />
      ))}

      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9 gap-1 text-muted-foreground"
          onClick={onClear}
        >
          <X className="size-4" />
          Clear filters
        </Button>
      )}

      {/* Custom actions pinned to the right end of the toolbar. */}
      {actions && <div className="sm:ml-auto">{actions}</div>}
    </div>
  );
}
