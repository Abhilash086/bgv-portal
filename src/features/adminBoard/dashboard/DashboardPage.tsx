import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { dashboardConfig } from "@/features/adminBoard/dashboard/config/dashboard.config";
import {
  useDashboardActivity,
  useDashboardOverview,
} from "@/features/adminBoard/dashboard/hooks/useDashboard";
import { KpiCard } from "@/features/adminBoard/dashboard/components/KpiCard";
import { VerificationStatsChart } from "@/features/adminBoard/dashboard/components/VerificationStatsChart";
import { PendingOverduePanel } from "@/features/adminBoard/dashboard/components/PendingOverduePanel";
import { RecentActivityPanel } from "@/features/adminBoard/dashboard/components/RecentActivityPanel";
import { SlaBreachAlerts } from "@/features/adminBoard/dashboard/components/SlaBreachAlerts";
import { DashboardSkeleton } from "@/features/adminBoard/dashboard/components/DashboardSkeleton";
import { DashboardError } from "@/features/adminBoard/shared/components/DashboardError";
import {
  fallbackActivityFeed,
  fallbackDashboardOverview,
} from "@/features/adminBoard/dashboard/data/dashboard";
import { env } from "@/config/env";
import type { Kpi } from "@/features/adminBoard/dashboard/types/dashboard";

export function DashboardPage() {
  const navigate = useNavigate();
  const { pageHeader, kpis, chart, pendingOverdue, activity, sla, footer } =
    dashboardConfig;

  const overview = useDashboardOverview();
  const activityFeed = useDashboardActivity();

  // The overview call drives the page; activity is a secondary panel that can
  // fail independently without blanking the whole dashboard.
  if (overview.isLoading) {
    return <DashboardSkeleton />;
  }

  // While the mock-fallback flag is on, skip the error page and fall through
  // to the fallback data below. Turn the flag off to surface real errors.
  if (overview.isError && !env.useMockFallback) {
    return (
      <DashboardError
        message={overview.error?.message}
        onRetry={() => overview.refetch()}
      />
    );
  }

  // overview ? overview : fallback from data/ folder
  const data = overview.data ?? fallbackDashboardOverview;
  const kpiByKey = new Map<string, Kpi>(data.kpis.map((kpi) => [kpi.key, kpi]));

  return (
    <main className="mx-auto w-full max-w-350 space-y-5 p-4">
      {/* Page header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1.5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-2.5 py-0.5 text-[11px] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {pageHeader.badge}
          </div>

          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {pageHeader.greeting}
          </h2>

          <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {pageHeader.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pageHeader.actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              size="sm"
              className="h-8"
              onClick={() => {
                if (action.action === "print") {
                  window.print();
                } else if (action.action === "navigate" && action.to) {
                  navigate(action.to);
                }
              }}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </section>

      {/* KPI cards */}
      <section
        aria-label="Key verification metrics"
        className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5"
      >
        {kpis.map((kpiConfig, index) => {
          const kpi = kpiByKey.get(kpiConfig.key);

          if (!kpi) return null;

          return (
            <KpiCard
              key={kpiConfig.key}
              title={kpiConfig.title}
              value={kpi.value}
              change={kpi.change}
              description={kpiConfig.description}
              icon={kpiConfig.icon}
              tone={kpiConfig.tone}
              index={index}
              invertTrend={kpiConfig.invertTrend}
            />
          );
        })}
      </section>

      {/* Verification stats + pending/overdue */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(260px,0.8fr)]">
        <VerificationStatsChart
          config={chart}
          data={data.verificationStats}
        />
        <PendingOverduePanel
          config={pendingOverdue}
          pendingApprovals={data.pendingApprovals}
          overdueCases={data.overdueCases}
        />
      </section>

      {/* SLA breach alerts */}
      <section aria-label="SLA breach alerts">
        <SlaBreachAlerts config={sla} breaches={data.slaBreaches} />
      </section>

      {/* Recent activity */}
      <section aria-label="Recent activity">
        {activityFeed.isError && !env.useMockFallback ? (
          <DashboardError
            message={activityFeed.error?.message}
            onRetry={() => activityFeed.refetch()}
          />
        ) : (
          /* activity ? activity : fallback from data/ folder */
          <RecentActivityPanel
            config={activity}
            items={
              activityFeed.data && activityFeed.data.length > 0
                ? activityFeed.data
                : fallbackActivityFeed
            }
          />
        )}
      </section>

      <footer className="flex flex-col gap-1 border-t border-border/60 pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>{footer.left}</span>
        <span>{footer.right}</span>
      </footer>
    </main>
  );
}
