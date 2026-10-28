import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { verificationConfig } from "@/features/adminBoard/verifications/config/verification.config";
import { useVerificationCases } from "@/features/adminBoard/verifications/hooks/useVerifications";
import { VerificationTable } from "@/features/adminBoard/verifications/components/VerificationTable";
import { NewVerificationDialog } from "@/features/adminBoard/verifications/components/NewVerificationDialog";
import { BulkAssignDialog } from "@/features/adminBoard/verifications/components/BulkAssignDialog";
import { DashboardError } from "@/features/adminBoard/shared/components/DashboardError";
import { fallbackVerificationList } from "@/features/adminBoard/verifications/data/verifications";
import { env } from "@/config/env";

export function VerificationsPage() {
  const { pageHeader, newCaseLabel } = verificationConfig;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [newOpen, setNewOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  const casesQuery = useVerificationCases();

  // cases ? cases : fallback from data/ folder — the table never renders empty
  // just because the API returned nothing (empty response or error).
  const cases =
    casesQuery.data && casesQuery.data.cases.length > 0
      ? casesQuery.data.cases
      : fallbackVerificationList.cases;

  const clearSelection = () => setSelectedIds(new Set());

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Select-all toggles the rows currently visible on the table page.
  const toggleAll = (ids: string[]) => {
    setSelectedIds((prev) => {
      const allSelected = ids.length > 0 && ids.every((id) => prev.has(id));
      const next = new Set(prev);
      if (allSelected) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-6 p-4 lg:space-y-8">
      {/* Page header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-2.5 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            {pageHeader.badge}
          </div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {pageHeader.title}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {pageHeader.description}
          </p>
        </div>

        <Button className="h-9 gap-2" onClick={() => setNewOpen(true)}>
          <Plus className="size-4" />
          {newCaseLabel}
        </Button>
      </section>

      {casesQuery.isLoading ? (
        <Card className="rounded-2xl border-border/70 p-4 shadow-sm">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="size-4 rounded" />
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
      ) : casesQuery.isError && !env.useMockFallback ? (
        <DashboardError
          message={casesQuery.error?.message}
          onRetry={() => casesQuery.refetch()}
        />
      ) : (
        <VerificationTable
          cases={cases}
          selectedIds={selectedIds}
          onToggleRow={toggleRow}
          onToggleAll={toggleAll}
          onClearSelection={clearSelection}
          onAssign={() => setAssignOpen(true)}
        />
      )}

      <NewVerificationDialog open={newOpen} onOpenChange={setNewOpen} />
      <BulkAssignDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        caseIds={[...selectedIds]}
        onAssigned={clearSelection}
      />
    </main>
  );
}
