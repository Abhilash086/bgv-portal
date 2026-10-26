import type { ReactNode } from "react";

export type DataTableOption = {
  label: string;
  value: string;
};

export type DataTableColumn<T> = {
  id: string;
  header: string;
  accessorFn?: (row: T) => unknown;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  className?: string;
  headerClassName?: string;
  filterOptions?: DataTableOption[];
};

export type DataTableFilter<T = unknown> = {
  id: string;
  label: string;
  options: DataTableOption[];
  /**
   * Returns the raw value compared against the selected option value.
   * Needed when the matching column renders a display label (e.g. "In
   * progress") but the filter options use the underlying key ("in_progress").
   * Falls back to the column accessor / row[id] when omitted.
   */
  accessorFn?: (row: T) => string;
};

export type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  searchPlaceholder?: string;
  pageSizeOptions?: number[];
  initialPageSize?: number;
  filters?: DataTableFilter<T>[];
  emptyMessage?: string;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleRow?: (id: string) => void;
  onToggleAll?: (ids: string[]) => void;
  getSearchValue?: (row: T) => string;
  /** Custom content rendered at the right end of the toolbar (filters) row. */
  toolbarActions?: ReactNode;
};
