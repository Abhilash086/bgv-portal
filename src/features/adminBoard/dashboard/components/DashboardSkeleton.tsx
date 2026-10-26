import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function KpiSkeleton() {
  return (
    <Card className="rounded-xl border-border/70 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="size-7 rounded-lg" />
        </div>
        <Skeleton className="mt-2.5 h-6 w-16" />
        <Skeleton className="mt-2 h-4 w-24" />
      </CardContent>
    </Card>
  );
}

function PanelSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <Card className="rounded-xl border-border/70 shadow-sm">
      <CardHeader className="pb-3">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="mt-2 h-3.5 w-52" />
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-2.5 w-1/3" />
            </div>
            <Skeleton className="h-3.5 w-10" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-350 space-y-5 p-4 sm:p-5 lg:p-6">
      {/* Page header */}
      <div className="space-y-2.5">
        <Skeleton className="h-5 w-36 rounded-full" />
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-3.5 w-full max-w-xl" />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <KpiSkeleton key={index} />
        ))}
      </div>

      {/* Chart + pending/overdue */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(260px,0.8fr)]">
        <Card className="rounded-xl border-border/70 shadow-sm">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="mt-2 h-3.5 w-56" />
            <Skeleton className="mt-3 h-6 w-20" />
          </CardHeader>
          <CardContent className="pt-4">
            <Skeleton className="h-56 w-full sm:h-64" />
          </CardContent>
        </Card>
        <PanelSkeleton />
      </div>

      {/* Activity + SLA */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <PanelSkeleton rows={5} />
        <PanelSkeleton rows={3} />
      </div>
    </div>
  );
}
