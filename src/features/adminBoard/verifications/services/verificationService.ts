import { formatRelativeTime } from "@/features/adminBoard/shared/utils/format";
import type {
  VerificationCase,
  VerificationCaseDto,
  VerificationList,
  VerificationListDto,
} from "@/features/adminBoard/verifications/types/verification";

/**
 * Pure DTO -> UI mappers for verification cases. Used as React Query `select`
 * functions by the hooks. Filtering, creation, and bulk assignment are done
 * server-side (or by the mock adapter in dev), so they're not here.
 */

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function mapVerificationCase(dto: VerificationCaseDto): VerificationCase {
  const due = new Date(dto.dueDate).getTime();
  const isOverdue =
    !Number.isNaN(due) &&
    due < Date.now() &&
    dto.status !== "completed" &&
    dto.status !== "rejected" &&
    dto.status !== "cancelled";

  return {
    id: dto.id,
    candidateName: dto.candidateName,
    candidateEmail: dto.candidateEmail,
    candidateInitials: initialsOf(dto.candidateName),
    checkType: dto.checkType,
    status: dto.status,
    priority: dto.priority,
    assignee: dto.assignee,
    createdAt: dto.createdAt,
    createdLabel: formatRelativeTime(dto.createdAt),
    dueDate: dto.dueDate,
    dueLabel: formatRelativeTime(dto.dueDate),
    isOverdue,
    progress: dto.progress,
  };
}

export function mapVerificationList(dto: VerificationListDto): VerificationList {
  return {
    cases: dto.cases.map(mapVerificationCase),
    total: dto.total,
  };
}
