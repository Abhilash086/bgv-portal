import type {
  VerificationPriority,
  VerificationStatus,
} from "../types/verification";

export type StatusMeta = {
  label: string;
  /** Tailwind classes for the status badge. */
  badgeClass: string;
};

export type PriorityMeta = {
  label: string;
  badgeClass: string;
};

export type VerificationConfig = {
  pageHeader: {
    badge: string;
    title: string;
    description: string;
  };
  searchPlaceholder: string;
  newCaseLabel: string;
  bulkAssignLabel: string;
  statusMeta: Record<VerificationStatus, StatusMeta>;
  priorityMeta: Record<VerificationPriority, PriorityMeta>;
  /** Options for the "check type" field when creating a case. */
  checkTypeOptions: string[];
  emptyState: {
    title: string;
    description: string;
  };
};

export const verificationConfig: VerificationConfig = {
  pageHeader: {
    badge: "Verification management",
    title: "Verification cases",
    description:
      "Track and manage every background check — from new requests through completion, escalation, and everything in between.",
  },
  searchPlaceholder: "Search by candidate, email, or case ID...",
  newCaseLabel: "New verification",
  bulkAssignLabel: "Assign",

  statusMeta: {
    new: {
      label: "New",
      badgeClass:
        "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-400",
    },
    in_progress: {
      label: "In progress",
      badgeClass:
        "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-400",
    },
    pending_info: {
      label: "Pending info",
      badgeClass:
        "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    },
    on_hold: {
      label: "On hold",
      badgeClass:
        "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
    },
    completed: {
      label: "Completed",
      badgeClass:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    },
    rejected: {
      label: "Rejected",
      badgeClass:
        "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400",
    },
    cancelled: {
      label: "Cancelled",
      badgeClass:
        "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
    },
    escalated: {
      label: "Escalated",
      badgeClass:
        "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-400",
    },
  },

  priorityMeta: {
    low: {
      label: "Low",
      badgeClass: "border-border bg-muted/60 text-muted-foreground",
    },
    medium: {
      label: "Medium",
      badgeClass:
        "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-400",
    },
    high: {
      label: "High",
      badgeClass:
        "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    },
    urgent: {
      label: "Urgent",
      badgeClass:
        "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400",
    },
  },

  checkTypeOptions: [
    "Identity",
    "Employment history",
    "Education",
    "Criminal record",
    "Address",
    "Reference",
    "Credit",
  ],

  emptyState: {
    title: "No cases found",
    description: "Try a different status or adjust your search.",
  },
};
