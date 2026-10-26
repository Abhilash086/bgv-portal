/**
 * Dashboard domain types for the BGV admin overview.
 *
 * Two layers are kept separate on purpose:
 *  - `*Dto` types mirror the raw API/wire shape.
 *  - The UI model types are what components consume.
 *
 * The service layer (services/dashboardService.ts) maps DTO -> UI model, so a
 * backend field rename only touches one file.
 */

import type { IconName } from "@/features/adminBoard/shared/config/icons";

/* ------------------------------------------------------------------ *
 * KPI cards
 * ------------------------------------------------------------------ */

export type KpiKey =
  | "totalChecks"
  | "inProgress"
  | "completed"
  | "pendingApprovals"
  | "overdue";

export type KpiDto = {
  key: KpiKey;
  value: number;
  /** Period-over-period change, as a percentage (e.g. 12.5 or -4.2). */
  change: number;
};

/* ------------------------------------------------------------------ *
 * Verification statistics (time series chart)
 * ------------------------------------------------------------------ */

export type VerificationStatPointDto = {
  /** Bucket label, e.g. an ISO date or "May 01". */
  period: string;
  completed: number;
  pending: number;
  rejected: number;
};

/* ------------------------------------------------------------------ *
 * Pending approvals & overdue cases
 * ------------------------------------------------------------------ */

export type PendingApprovalDto = {
  id: string;
  candidateName: string;
  checkType: string;
  /** ISO timestamp. */
  submittedAt: string;
};

export type OverdueCaseDto = {
  id: string;
  candidateName: string;
  checkType: string;
  /** ISO timestamp. */
  dueDate: string;
  daysOverdue: number;
};

/* ------------------------------------------------------------------ *
 * SLA breach alerts
 * ------------------------------------------------------------------ */

export type SlaSeverity = "critical" | "high" | "medium" | "low";

export type SlaBreachDto = {
  id: string;
  caseId: string;
  candidateName: string;
  checkType: string;
  severity: SlaSeverity;
  /** Hours past the SLA target. */
  hoursOverSla: number;
  /** ISO timestamp. */
  breachedAt: string;
};

/* ------------------------------------------------------------------ *
 * Recent activity feed
 * ------------------------------------------------------------------ */

export type ActivityType =
  | "submitted"
  | "approved"
  | "rejected"
  | "completed"
  | "assigned"
  | "commented";

export type ActivityItemDto = {
  id: string;
  type: ActivityType;
  actor: string;
  /** Human-readable summary of what happened. */
  description: string;
  /** ISO timestamp. */
  timestamp: string;
};

/* ------------------------------------------------------------------ *
 * Top-level DTOs (what the endpoints return)
 * ------------------------------------------------------------------ */

export type DashboardOverviewDto = {
  kpis: KpiDto[];
  verificationStats: VerificationStatPointDto[];
  pendingApprovals: PendingApprovalDto[];
  overdueCases: OverdueCaseDto[];
  slaBreaches: SlaBreachDto[];
};

export type ActivityFeedDto = {
  items: ActivityItemDto[];
};

/* ------------------------------------------------------------------ *
 * UI models (what components consume)
 * ------------------------------------------------------------------ */

export type Kpi = {
  key: KpiKey;
  value: number;
  change: number;
};

export type VerificationStatPoint = VerificationStatPointDto;

export type PendingApproval = {
  id: string;
  candidateName: string;
  checkType: string;
  submittedAt: string;
  /** Pre-formatted "x ago" label. */
  submittedLabel: string;
};

export type OverdueCase = {
  id: string;
  candidateName: string;
  checkType: string;
  dueDate: string;
  daysOverdue: number;
};

export type SlaBreach = {
  id: string;
  caseId: string;
  candidateName: string;
  checkType: string;
  severity: SlaSeverity;
  hoursOverSla: number;
  breachedAt: string;
};

export type ActivityItem = {
  id: string;
  type: ActivityType;
  actor: string;
  description: string;
  timestamp: string;
  /** Pre-formatted "x ago" label. */
  timeLabel: string;
  /** Icon resolved for this activity type. */
  icon: IconName;
};

/** The fully-mapped overview model consumed by the dashboard page. */
export type DashboardOverview = {
  kpis: Kpi[];
  verificationStats: VerificationStatPoint[];
  pendingApprovals: PendingApproval[];
  overdueCases: OverdueCase[];
  slaBreaches: SlaBreach[];
};
