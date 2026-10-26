import { useServices } from "@/api/useServices";
import { queryKeys } from "@/api/query/queryKeys";
import { adminBoardEndpoints } from "@/api/endpoints";
import {
  mapActivityFeed,
  mapDashboardOverview,
} from "@/features/adminBoard/dashboard/services/dashboardService";
import type {
  ActivityFeedDto,
  ActivityItem,
  DashboardOverview,
  DashboardOverviewDto,
} from "@/features/adminBoard/dashboard/types/dashboard";

/**
 * Dashboard data is operational and should refresh, so these queries override
 * the app-wide `staleTime: Infinity` default with a short window and refetch
 * on focus. DTO -> UI mapping happens via React Query's `select`.
 */
const DASHBOARD_STALE_TIME = 60_000; // 1 minute

export function useDashboardOverview() {
  const { useGet } = useServices();

  return useGet<DashboardOverviewDto, DashboardOverview>(
    queryKeys.dashboard.overview(),
    adminBoardEndpoints.dashboardOverview,
    undefined,
    undefined,
    {
      select: mapDashboardOverview,
      staleTime: DASHBOARD_STALE_TIME,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  );
}

export function useDashboardActivity() {
  const { useGet } = useServices();

  return useGet<ActivityFeedDto, ActivityItem[]>(
    queryKeys.dashboard.activity(),
    adminBoardEndpoints.dashboardActivity,
    undefined,
    undefined,
    {
      select: mapActivityFeed,
      staleTime: DASHBOARD_STALE_TIME,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  );
}
