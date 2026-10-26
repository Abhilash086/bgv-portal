import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/Dropdown";

type DataTablePaginationProps = {
  page: number;
  pageCount: number;
  pageSize: number;
  pageSizeOptions: number[];
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export function DataTablePagination({
  page,
  pageCount,
  pageSize,
  pageSizeOptions,
  total,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>
          Showing {start}–{end} of {total}
        </span>

        <div className="flex items-center gap-2">
          Rows
          <Dropdown
            className="w-20"
            ariaLabel="Rows per page"
            direction="up"
            value={String(pageSize)}
            onChange={(value) => onPageSizeChange(Number(value))}
            options={pageSizeOptions.map((size) => ({
              label: String(size),
              value: String(size),
            }))}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>

        <span className="min-w-20 text-center text-xs text-muted-foreground">
          Page {page} of {pageCount}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
