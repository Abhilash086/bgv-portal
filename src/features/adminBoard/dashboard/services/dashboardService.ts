import { dashboardConfig } from "@/features/adminBoard/dashboard/config/dashboard.config";
import { formatRelativeTime } from "@/features/adminBoard/shared/utils/format";
import type {
  ActivityFeedDto,
  ActivityItem,
  DashboardOverview,
  DashboardOverviewDto,
} from "@/features/adminBoard/dashboard/types/dashboard";

/**
 * Pure DTO -> UI mappers for the dashboard. Used as React Query `select`
 * functions by the hooks, so the raw API response is transformed into the
 * shape components consume. A backend field rename only touches this file.
 */

export function mapDashboardOverview(
  dto: DashboardOverviewDto,
): DashboardOverview {
  return {
    kpis: dto.kpis,
    verificationStats: dto.verificationStats,
    pendingApprovals: dto.pendingApprovals.map((approval) => ({
      ...approval,
      submittedLabel: formatRelativeTime(approval.submittedAt),
    })),
    overdueCases: dto.overdueCases,
    slaBreaches: dto.slaBreaches,
  };
}

export function mapActivityFeed(dto: ActivityFeedDto): ActivityItem[] {
  const { typeIcons } = dashboardConfig.activity;

  return dto.items.map((item) => ({
    ...item,
    timeLabel: formatRelativeTime(item.timestamp),
    icon: typeIcons[item.type] ?? "bell",
  }));
}
