import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTablePagination } from "./DataTablePagination";
import type { DataTableProps } from "./types";

type SortState = {
  id: string;
  direction: "asc" | "desc";
} | null;

function getValue<T>(
  row: T,
  column: DataTableProps<T>["columns"][number],
): unknown {
  if (column.accessorFn) return column.accessorFn(row);

  return (row as Record<string, unknown>)[column.id];
}

function normalize(value: unknown): string {
  if (value == null) return "";
  if (value instanceof Date) return value.getTime().toString();
  if (typeof value === "object") return "";
  return String(value).toLocaleLowerCase();
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  searchPlaceholder = "Search...",
  pageSizeOptions = [10, 20, 50, 100],
  initialPageSize = 10,
  filters = [],
  emptyMessage = "No results found.",
  selectable = false,
  selectedIds,
  onToggleRow,
  onToggleAll,
  getSearchValue,
  toolbarActions,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<SortState>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const filteredData = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return data.filter((row) => {
      const matchesSearch =
        !query ||
        (getSearchValue
          ? getSearchValue(row).toLocaleLowerCase().includes(query)
          : columns.some((column) => {
              if (column.searchable === false) return false;
              return normalize(getValue(row, column)).includes(query);
            }));

      if (!matchesSearch) return false;

      return filters.every((filter) => {
        const selectedValue = filterValues[filter.id];

        if (!selectedValue) return true;

        // Prefer the filter's own accessor (raw key) over the column accessor,
        // which may return a display label that won't match the option value.
        let value: unknown;
        if (filter.accessorFn) {
          value = filter.accessorFn(row);
        } else {
          const column = columns.find((item) => item.id === filter.id);
          value = column
            ? getValue(row, column)
            : (row as Record<string, unknown>)[filter.id];
        }

        return String(value ?? "") === selectedValue;
      });
    });
  }, [data, search, columns, filters, filterValues, getSearchValue]);

  const sortedData = useMemo(() => {
    if (!sort) return filteredData;

    const column = columns.find((item) => item.id === sort.id);
    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const result = compareValues(getValue(a, column), getValue(b, column));

      return sort.direction === "asc" ? result : -result;
    });
  }, [filteredData, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = Math.min(page, pageCount);

  const pageData = useMemo(
    () =>
      sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [sortedData, currentPage, pageSize],
  );

  const pageIds = pageData.map(getRowId);
  const selected = selectedIds ?? new Set<string>();

  const allSelected =
    pageIds.length > 0 && pageIds.every((id) => selected.has(id));

  const someSelected = pageIds.some((id) => selected.has(id)) && !allSelected;

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateFilter(id: string, value: string) {
    setFilterValues((current) => ({ ...current, [id]: value }));
    setPage(1);
  }

  const hasActiveFilters =
    search.trim() !== "" ||
    Object.values(filterValues).some((value) => value !== "");

  function clearFilters() {
    setSearch("");
    setFilterValues({});
    setPage(1);
  }

  function toggleSort(id: string) {
    setSort((current) => {
      if (current?.id !== id) return { id, direction: "asc" };

      if (current.direction === "asc") {
        return { id, direction: "desc" };
      }

      return null;
    });

    setPage(1);
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar
        search={search}
        onSearchChange={updateSearch}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        filterValues={filterValues}
        onFilterChange={updateFilter}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
        actions={toolbarActions}
      />

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                {selectable && (
                  <TableHead className="w-10 pl-6">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onCheckedChange={() => onToggleAll?.(pageIds)}
                      aria-label="Select all rows on this page"
                    />
                  </TableHead>
                )}

                {columns.map((column, columnIndex) => {
                  // The ghost button has internal px-3; a negative left margin
                  // pulls its label flush with the cell's left edge. Skip that
                  // for the first data column so it doesn't bleed left into the
                  // checkbox column (or the leading cell padding).
                  const isFirstColumn = columnIndex === 0;

                  return (
                    <TableHead
                      key={column.id}
                      className={cn(
                        column.headerClassName,
                        column.sortable && "whitespace-nowrap",
                      )}
                    >
                      {column.sortable ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-8 px-3 font-medium",
                            !isFirstColumn && "-ml-3",
                          )}
                          onClick={() => toggleSort(column.id)}
                        >
                          {column.header}
                          <span className="ml-2 text-muted-foreground">
                            {sort?.id === column.id
                              ? sort.direction === "asc"
                                ? "↑"
                                : "↓"
                              : "↕"}
                          </span>
                        </Button>
                      ) : (
                        column.header
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>

            <TableBody>
              {pageData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                pageData.map((row) => {
                  const id = getRowId(row);
                  const isSelected = selected.has(id);

                  return (
                    <TableRow
                      key={id}
                      data-state={isSelected ? "selected" : undefined}
                    >
                      {selectable && (
                        <TableCell className="pl-6">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => onToggleRow?.(id)}
                            aria-label={`Select row ${id}`}
                          />
                        </TableCell>
                      )}

                      {columns.map((column) => (
                        <TableCell key={column.id} className={column.className}>
                          {column.cell
                            ? column.cell(row)
                            : String(getValue(row, column) ?? "—")}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <DataTablePagination
          page={currentPage}
          pageCount={pageCount}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          total={sortedData.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}
