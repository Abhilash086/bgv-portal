import type {
  ActivityFeedDto,
  DashboardOverviewDto,
} from "@/features/adminBoard/dashboard/types/dashboard";

/** Minutes/hours/days ago helper for believable relative timestamps. */
const ago = (ms: number) => new Date(Date.now() - ms).toISOString();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export const mockDashboardOverview: DashboardOverviewDto = {
  kpis: [
    { key: "totalChecks", value: 1284, change: 12.4 },
    { key: "inProgress", value: 218, change: 5.1 },
    { key: "completed", value: 942, change: 9.8 },
    { key: "pendingApprovals", value: 37, change: -3.2 },
    { key: "overdue", value: 14, change: 8.6 },
  ],

  verificationStats: [
    { period: "May 01", completed: 62, pending: 28, rejected: 6 },
    { period: "May 05", completed: 71, pending: 31, rejected: 4 },
    { period: "May 09", completed: 65, pending: 24, rejected: 8 },
    { period: "May 13", completed: 88, pending: 35, rejected: 5 },
    { period: "May 17", completed: 79, pending: 40, rejected: 7 },
    { period: "May 21", completed: 102, pending: 33, rejected: 3 },
    { period: "May 25", completed: 94, pending: 29, rejected: 6 },
    { period: "May 29", completed: 121, pending: 38, rejected: 4 },
    { period: "May 31", completed: 134, pending: 42, rejected: 9 },
  ],

  pendingApprovals: [
    {
      id: "APR-4021",
      candidateName: "Olivia Martin",
      checkType: "Employment history",
      submittedAt: ago(45 * MIN),
    },
    {
      id: "APR-4020",
      candidateName: "Jackson Lee",
      checkType: "Criminal record",
      submittedAt: ago(2 * HOUR),
    },
    {
      id: "APR-4019",
      candidateName: "Isabella Nguyen",
      checkType: "Education",
      submittedAt: ago(5 * HOUR),
    },
    {
      id: "APR-4018",
      candidateName: "William Kim",
      checkType: "Identity",
      submittedAt: ago(8 * HOUR),
    },
  ],

  overdueCases: [
    {
      id: "CASE-8831",
      candidateName: "Sofia Davis",
      checkType: "Employment history",
      dueDate: ago(2 * DAY),
      daysOverdue: 2,
    },
    {
      id: "CASE-8829",
      candidateName: "Ethan Wilson",
      checkType: "Address",
      dueDate: ago(3 * DAY),
      daysOverdue: 3,
    },
    {
      id: "CASE-8824",
      candidateName: "Mia Rossi",
      checkType: "Reference",
      dueDate: ago(5 * DAY),
      daysOverdue: 5,
    },
  ],

  slaBreaches: [
    {
      id: "SLA-1203",
      caseId: "CASE-8824",
      candidateName: "Mia Rossi",
      checkType: "Reference",
      severity: "critical",
      hoursOverSla: 58,
      breachedAt: ago(58 * HOUR),
    },
    {
      id: "SLA-1202",
      caseId: "CASE-8829",
      candidateName: "Ethan Wilson",
      checkType: "Address",
      severity: "high",
      hoursOverSla: 26,
      breachedAt: ago(26 * HOUR),
    },
    {
      id: "SLA-1201",
      caseId: "CASE-8831",
      candidateName: "Sofia Davis",
      checkType: "Employment history",
      severity: "medium",
      hoursOverSla: 9,
      breachedAt: ago(9 * HOUR),
    },
  ],
};

export const mockActivityFeed: ActivityFeedDto = {
  items: [
    {
      id: "ACT-9001",
      type: "approved",
      actor: "Jane Doe",
      description: "approved employment check for Olivia Martin",
      timestamp: ago(12 * MIN),
    },
    {
      id: "ACT-9000",
      type: "submitted",
      actor: "Diego Santos",
      description: "submitted identity check for William Kim",
      timestamp: ago(40 * MIN),
    },
    {
      id: "ACT-8999",
      type: "rejected",
      actor: "Priya Nair",
      description: "rejected criminal record check for Jackson Lee",
      timestamp: ago(90 * MIN),
    },
    {
      id: "ACT-8998",
      type: "completed",
      actor: "System",
      description: "completed education verification for Isabella Nguyen",
      timestamp: ago(3 * HOUR),
    },
    {
      id: "ACT-8997",
      type: "assigned",
      actor: "Jane Doe",
      description: "assigned reference check for Mia Rossi to Diego Santos",
      timestamp: ago(6 * HOUR),
    },
  ],
};
