import { mapVerificationList } from "@/features/adminBoard/verifications/services/verificationService";
import type {
  Assignee,
  AssigneeDto,
  VerificationCaseDto,
  VerificationList,
} from "@/features/adminBoard/verifications/types/verification";

/**
 * Local fallback data for the verifications feature. When the API returns
 * nothing (no backend yet, empty response, or an error), the page renders
 * this sample data instead of an empty table. Swap or remove once the real
 * API is wired.
 */

const ago = (ms: number) => new Date(Date.now() - ms).toISOString();
const ahead = (ms: number) => new Date(Date.now() + ms).toISOString();
const HOUR = 3600_000;
const DAY = 24 * HOUR;

export const mockAssignees: AssigneeDto[] = [
  { id: "usr-1", name: "Jane Doe", initials: "JD" },
  { id: "usr-2", name: "Diego Santos", initials: "DS" },
  { id: "usr-3", name: "Priya Nair", initials: "PN" },
  { id: "usr-4", name: "Noor Haddad", initials: "NH" },
];

export const mockVerificationCases: VerificationCaseDto[] = [
  {
    id: "CASE-8841",
    candidateName: "Olivia Martin",
    candidateEmail: "olivia@example.com",
    checkType: "Employment history",
    status: "new",
    priority: "high",
    assignee: null,
    createdAt: ago(2 * HOUR),
    dueDate: ahead(5 * DAY),
    progress: 0,
  },
  {
    id: "CASE-8840",
    candidateName: "Jackson Lee",
    candidateEmail: "jackson@example.com",
    checkType: "Criminal record",
    status: "in_progress",
    priority: "medium",
    assignee: mockAssignees[1],
    createdAt: ago(1 * DAY),
    dueDate: ahead(3 * DAY),
    progress: 45,
  },
  {
    id: "CASE-8839",
    candidateName: "Isabella Nguyen",
    candidateEmail: "isabella@example.com",
    checkType: "Education",
    status: "pending_info",
    priority: "medium",
    assignee: mockAssignees[2],
    createdAt: ago(2 * DAY),
    dueDate: ahead(1 * DAY),
    progress: 60,
  },
  {
    id: "CASE-8838",
    candidateName: "William Kim",
    candidateEmail: "william@example.com",
    checkType: "Identity",
    status: "on_hold",
    priority: "low",
    assignee: mockAssignees[0],
    createdAt: ago(3 * DAY),
    dueDate: ahead(6 * DAY),
    progress: 20,
  },
  {
    id: "CASE-8837",
    candidateName: "Sofia Davis",
    candidateEmail: "sofia@example.com",
    checkType: "Reference",
    status: "escalated",
    priority: "urgent",
    assignee: mockAssignees[3],
    createdAt: ago(5 * DAY),
    dueDate: ago(1 * DAY),
    progress: 75,
  },
  {
    id: "CASE-8836",
    candidateName: "Ethan Wilson",
    candidateEmail: "ethan@example.com",
    checkType: "Address",
    status: "completed",
    priority: "medium",
    assignee: mockAssignees[1],
    createdAt: ago(8 * DAY),
    dueDate: ago(2 * DAY),
    progress: 100,
  },
  {
    id: "CASE-8835",
    candidateName: "Mia Rossi",
    candidateEmail: "mia@example.com",
    checkType: "Employment history",
    status: "rejected",
    priority: "low",
    assignee: mockAssignees[2],
    createdAt: ago(10 * DAY),
    dueDate: ago(4 * DAY),
    progress: 100,
  },
  {
    id: "CASE-8834",
    candidateName: "Noah Clark",
    candidateEmail: "noah@example.com",
    checkType: "Credit",
    status: "cancelled",
    priority: "low",
    assignee: null,
    createdAt: ago(11 * DAY),
    dueDate: ago(6 * DAY),
    progress: 10,
  },
  {
    id: "CASE-8833",
    candidateName: "Ava Thompson",
    candidateEmail: "ava@example.com",
    checkType: "Identity",
    status: "in_progress",
    priority: "high",
    assignee: mockAssignees[0],
    createdAt: ago(1 * DAY),
    dueDate: ahead(2 * DAY),
    progress: 35,
  },
  {
    id: "CASE-8832",
    candidateName: "Liam Walsh",
    candidateEmail: "liam@example.com",
    checkType: "Education",
    status: "new",
    priority: "medium",
    assignee: null,
    createdAt: ago(4 * HOUR),
    dueDate: ahead(7 * DAY),
    progress: 0,
  },
];

/** Mapped UI-model fallbacks the page can use directly. */
export const fallbackVerificationList: VerificationList = mapVerificationList({
  cases: mockVerificationCases,
  total: mockVerificationCases.length,
});

export const fallbackAssignees: Assignee[] = mockAssignees;
