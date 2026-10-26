/**
 * Verification Management domain types.
 *
 * DTO types mirror the API wire shape; UI model types are what components
 * consume. The service maps DTO -> UI so backend changes touch one file.
 */

/* ------------------------------------------------------------------ *
 * Status
 * ------------------------------------------------------------------ */

export type VerificationStatus =
  | "new"
  | "in_progress"
  | "pending_info"
  | "on_hold"
  | "completed"
  | "rejected"
  | "cancelled"
  | "escalated";

export type VerificationPriority = "low" | "medium" | "high" | "urgent";

/* ------------------------------------------------------------------ *
 * DTOs
 * ------------------------------------------------------------------ */

export type AssigneeDto = {
  id: string;
  name: string;
  initials: string;
};

export type VerificationCaseDto = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  checkType: string;
  status: VerificationStatus;
  priority: VerificationPriority;
  assignee: AssigneeDto | null;
  /** ISO timestamp. */
  createdAt: string;
  /** ISO timestamp. */
  dueDate: string;
  /** 0-100 completion of the checks within the case. */
  progress: number;
};

export type VerificationListDto = {
  cases: VerificationCaseDto[];
  total: number;
};

export type CreateVerificationDto = {
  candidateName: string;
  candidateEmail: string;
  checkType: string;
  priority: VerificationPriority;
  assigneeId?: string;
};

export type BulkAssignDto = {
  caseIds: string[];
  assigneeId: string;
};

/* ------------------------------------------------------------------ *
 * UI models
 * ------------------------------------------------------------------ */

export type Assignee = AssigneeDto;

export type VerificationCase = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidateInitials: string;
  checkType: string;
  status: VerificationStatus;
  priority: VerificationPriority;
  assignee: Assignee | null;
  createdAt: string;
  createdLabel: string;
  dueDate: string;
  dueLabel: string;
  isOverdue: boolean;
  progress: number;
};

export type VerificationList = {
  cases: VerificationCase[];
  total: number;
};
