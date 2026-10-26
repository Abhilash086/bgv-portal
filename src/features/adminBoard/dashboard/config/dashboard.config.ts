import type { IconName, IconTone } from "../../shared/config/icons";
import type { ActivityType, KpiKey, SlaSeverity } from "../types/dashboard";

export type PageAction = {
  label: string;
  variant: "default" | "outline";
  action: "print" | "navigate";
  to?: string;
};

export type PageHeaderConfig = {
  badge: string;
  greeting: string;
  description: string;
  actions: PageAction[];
};

/* ------------------------------------------------------------------ *
 * Widget config types
 * ------------------------------------------------------------------ */

export type KpiCardConfig = {
  key: KpiKey;
  title: string;
  icon: IconName;
  /** Color tone for the icon badge. */
  tone: IconTone;
  description: string;
  /** When true, a positive change renders red (e.g. overdue growth is bad). */
  invertTrend?: boolean;
};

export type ChartSeriesConfig = {
  dataKey: string;
  label: string;
  color: string;
  strokeWidth: number;
  dashed?: boolean;
  fill?: boolean;
  animationDuration: number;
};

export type ChartRangeConfig = {
  label: string;
  points: number;
  genericLabels?: boolean;
};

export type VerificationChartConfig = {
  title: string;
  description: string;
  summaryCaption: string;
  exportFileName: string;
  categoryKey: string;
  totalKey: string;
  defaultRange: string;
  ranges: ChartRangeConfig[];
  series: ChartSeriesConfig[];
};

export type PendingOverdueConfig = {
  title: string;
  description: string;
  tabs: { pendingLabel: string; overdueLabel: string };
  viewAllLabel: string;
  emptyPending: string;
  emptyOverdue: string;
};

export type ActivityConfig = {
  title: string;
  description: string;
  viewAllLabel: string;
  empty: string;
  /** Icon per activity type. */
  typeIcons: Record<ActivityType, IconName>;
};

export type SlaConfig = {
  title: string;
  description: string;
  viewAllLabel: string;
  empty: string;
  /** Badge tone per severity. */
  severityLabels: Record<SlaSeverity, string>;
};

export type DashboardConfig = {
  pageHeader: PageHeaderConfig;
  kpis: KpiCardConfig[];
  chart: VerificationChartConfig;
  pendingOverdue: PendingOverdueConfig;
  activity: ActivityConfig;
  sla: SlaConfig;
  footer: { left: string; right: string };
};

/* ------------------------------------------------------------------ *
 * Config
 * ------------------------------------------------------------------ */

export const dashboardConfig: DashboardConfig = {
  pageHeader: {
    badge: "Operational overview",
    greeting: "Good morning, Jane",
    description:
      "Here's the state of verifications today — approvals waiting, cases running late, and anything breaching SLA.",
    actions: [
      { label: "Export report", variant: "outline", action: "print" },
      {
        label: "View verifications",
        variant: "default",
        action: "navigate",
        to: "/verifications",
      },
    ],
  },

  kpis: [
    {
      key: "totalChecks",
      title: "Total verifications",
      icon: "totalChecks",
      tone: "violet",
      description: "vs. last month",
    },
    {
      key: "inProgress",
      title: "In progress",
      icon: "inProgress",
      tone: "blue",
      description: "vs. last month",
    },
    {
      key: "completed",
      title: "Completed",
      icon: "completed",
      tone: "emerald",
      description: "vs. last month",
    },
    {
      key: "pendingApprovals",
      title: "Pending approvals",
      icon: "approvals",
      tone: "amber",
      description: "awaiting review",
    },
    {
      key: "overdue",
      title: "Overdue",
      icon: "overdue",
      tone: "rose",
      description: "past SLA",
      invertTrend: true,
    },
  ],

  chart: {
    title: "Verification statistics",
    description: "Completed, pending, and rejected checks over time.",
    summaryCaption: "Completed in displayed periods",
    exportFileName: "verification-stats.csv",
    categoryKey: "period",
    totalKey: "completed",
    defaultRange: "30D",
    ranges: [
      { label: "7D", points: 4 },
      { label: "30D", points: 9 },
      { label: "90D", points: 9, genericLabels: true },
    ],
    series: [
      {
        dataKey: "rejected",
        label: "Rejected",
        color: "var(--chart-5)",
        strokeWidth: 1.5,
        dashed: true,
        fill: false,
        animationDuration: 450,
      },
      {
        dataKey: "pending",
        label: "Pending",
        color: "var(--muted-foreground)",
        strokeWidth: 1.5,
        fill: false,
        animationDuration: 500,
      },
      {
        dataKey: "completed",
        label: "Completed",
        color: "var(--primary)",
        strokeWidth: 2.5,
        fill: true,
        animationDuration: 650,
      },
    ],
  },

  pendingOverdue: {
    title: "Pending & overdue",
    description: "Approvals waiting on you and cases past their due date.",
    tabs: { pendingLabel: "Pending approvals", overdueLabel: "Overdue cases" },
    viewAllLabel: "View all",
    emptyPending: "No approvals waiting. You're all caught up.",
    emptyOverdue: "No overdue cases. Nice work.",
  },

  activity: {
    title: "Recent activity",
    description: "Latest actions across your verification workflow.",
    viewAllLabel: "View all",
    empty: "No recent activity.",
    typeIcons: {
      submitted: "pending",
      approved: "completed",
      rejected: "rejected",
      completed: "verified",
      assigned: "candidates",
      commented: "bell",
    },
  },

  sla: {
    title: "SLA breach alerts",
    description: "Cases that have exceeded their service-level target.",
    viewAllLabel: "View all",
    empty: "No SLA breaches. Everything is on track.",
    severityLabels: {
      critical: "Critical",
      high: "High",
      medium: "Medium",
      low: "Low",
    },
  },

  footer: {
    left: "© 2026 Verity",
    right: "Operational dashboard · Live data",
  },
};
