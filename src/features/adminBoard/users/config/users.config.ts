import type { IconName } from "@/features/adminBoard/shared/config/icons";
import type {
  AccessReviewStatus,
  SessionStatus,
  UserStatus,
} from "../types/users";

export type StatusMeta = {
  label: string;
  /** Tailwind classes for the status badge. */
  badgeClass: string;
};

export type UsersTab = {
  id: string;
  label: string;
  icon: IconName;
  description: string;
};

export type UsersConfig = {
  pageHeader: {
    badge: string;
    title: string;
    description: string;
  };
  tabs: UsersTab[];
  userStatusMeta: Record<UserStatus, StatusMeta>;
  sessionStatusMeta: Record<SessionStatus, StatusMeta>;
  reviewStatusMeta: Record<AccessReviewStatus, StatusMeta>;
};

export const usersConfig: UsersConfig = {
  pageHeader: {
    badge: "Security & access control",
    title: "Users, Roles & Permissions",
    description:
      "The security and access-control centre — manage people, roles, the permission matrix, departments, account states, and active login sessions.",
  },

  tabs: [
    {
      id: "users",
      label: "Users",
      icon: "candidates",
      description: "Manage people, invitations, and account states.",
    },
    {
      id: "roles",
      label: "Roles",
      icon: "usersRoles",
      description: "Define roles and the permissions each one grants.",
    },
    {
      id: "permissions",
      label: "Permission matrix",
      icon: "approvals",
      description: "See every permission mapped across all roles at a glance.",
    },
    {
      id: "departments",
      label: "Departments & teams",
      icon: "team",
      description: "Organize users into departments and teams.",
    },
    {
      id: "sessions",
      label: "Login sessions",
      icon: "active",
      description: "Monitor active sessions and revoke access.",
    },
    {
      id: "reviews",
      label: "Access reviews",
      icon: "verified",
      description: "Periodic reviews certifying who has access to what.",
    },
  ],

  userStatusMeta: {
    active: {
      label: "Active",
      badgeClass:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    },
    inactive: {
      label: "Inactive",
      badgeClass:
        "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
    },
    invited: {
      label: "Invited",
      badgeClass:
        "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-400",
    },
    suspended: {
      label: "Suspended",
      badgeClass:
        "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400",
    },
  },

  sessionStatusMeta: {
    active: {
      label: "Active",
      badgeClass:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    },
    expired: {
      label: "Expired",
      badgeClass:
        "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
    },
    revoked: {
      label: "Revoked",
      badgeClass:
        "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400",
    },
  },

  reviewStatusMeta: {
    pending: {
      label: "Pending",
      badgeClass:
        "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    },
    approved: {
      label: "Approved",
      badgeClass:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    },
    revoked: {
      label: "Revoked",
      badgeClass:
        "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400",
    },
  },
};
