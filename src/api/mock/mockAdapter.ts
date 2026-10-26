import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { adminBoardEndpoints } from "@/api/endpoints";
import {
  mockActivityFeed,
  mockDashboardOverview,
} from "@/features/adminBoard/dashboard/mocks/dashboard";
import {
  mockAssignees,
  mockVerificationCases,
} from "@/features/adminBoard/verifications/mocks/verifications";
import type { VerificationCaseDto } from "@/features/adminBoard/verifications/types/verification";
import {
  mockAccessReviews,
  mockDepartments,
  mockLoginSessions,
  mockPermissions,
  mockRoles,
  mockUsers,
} from "@/features/adminBoard/users/mocks/users";
import type {
  AccessReviewStatus,
  DepartmentDto,
  RoleDto,
  UserDto,
  UsersOverviewDto,
  UserStatus,
} from "@/features/adminBoard/users/types/users";

/**
 * Transport-layer mock. When no API base URL is configured, this axios adapter
 * resolves a small set of admin endpoints from in-memory mock data instead of
 * hitting the network. Flip to the real API by setting VITE_API_BASE_URL — no
 * hook, service, or component changes needed.
 *
 * Keeping mocks here (rather than in each service) means hooks call the real
 * endpoints through useGet/useMutate and know nothing about mocking.
 */

const MOCK_LATENCY_MS = 300;

type Handler = (config: InternalAxiosRequestConfig) => unknown;

/** Normalize a URL to its path (handles absolute and relative). */
function pathOf(url: string | undefined): string {
  if (!url) return "";
  try {
    return new URL(url, "http://local").pathname;
  } catch {
    return url;
  }
}

function filterCases(config: InternalAxiosRequestConfig): {
  cases: VerificationCaseDto[];
  total: number;
} {
  const params = (config.params ?? {}) as {
    status?: string;
    search?: string;
  };

  // The request sends a comma-joined status list; an absent param means "all".
  const allowed = params.status ? new Set(params.status.split(",")) : null;
  const term = (params.search ?? "").trim().toLowerCase();

  const cases = mockVerificationCases.filter((item) => {
    const matchesStatus = !allowed || allowed.has(item.status);
    const matchesSearch =
      !term ||
      [item.id, item.candidateName, item.candidateEmail].some((value) =>
        value.toLowerCase().includes(term),
      );

    return matchesStatus && matchesSearch;
  });

  return { cases, total: cases.length };
}

function createCase(config: InternalAxiosRequestConfig): VerificationCaseDto {
  const payload = JSON.parse((config.data as string) || "{}") as {
    candidateName: string;
    candidateEmail: string;
    checkType: string;
    priority: VerificationCaseDto["priority"];
    assigneeId?: string;
  };

  const assignee =
    mockAssignees.find((a) => a.id === payload.assigneeId) ?? null;

  const created: VerificationCaseDto = {
    id: `CASE-${Math.floor(1000 + Math.random() * 9000)}`,
    candidateName: payload.candidateName,
    candidateEmail: payload.candidateEmail,
    checkType: payload.checkType,
    status: "new",
    priority: payload.priority,
    assignee,
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 3600_000).toISOString(),
    progress: 0,
  };

  mockVerificationCases.unshift(created);
  return created;
}

function bulkAssign(config: InternalAxiosRequestConfig): { updated: number } {
  const payload = JSON.parse((config.data as string) || "{}") as {
    caseIds: string[];
    assigneeId: string;
  };

  const assignee =
    mockAssignees.find((a) => a.id === payload.assigneeId) ?? null;
  let updated = 0;

  mockVerificationCases.forEach((item) => {
    if (payload.caseIds.includes(item.id)) {
      item.assignee = assignee;
      updated += 1;
    }
  });

  return { updated };
}

/* ------------------------------------------------------------------ *
 * Users, Roles & Permissions handlers
 * ------------------------------------------------------------------ */

function usersOverview(): UsersOverviewDto {
  const byStatus = (status: UserStatus) =>
    mockUsers.filter((u) => u.status === status).length;

  return {
    totalUsers: mockUsers.length,
    activeUsers: byStatus("active"),
    inactiveUsers: byStatus("inactive"),
    invitedUsers: byStatus("invited"),
    roleCount: mockRoles.length,
    departmentCount: mockDepartments.length,
    activeSessions: mockLoginSessions.filter((s) => s.status === "active").length,
    pendingReviews: mockAccessReviews.filter((r) => r.status === "pending").length,
  };
}

function listUsers(): { users: UserDto[]; total: number } {
  return { users: mockUsers, total: mockUsers.length };
}

function createUser(config: InternalAxiosRequestConfig): UserDto {
  const payload = JSON.parse((config.data as string) || "{}") as {
    name: string;
    email: string;
    roleId: string;
    departmentId: string;
  };

  const role = mockRoles.find((r) => r.id === payload.roleId);
  const department = mockDepartments.find((d) => d.id === payload.departmentId);

  const created: UserDto = {
    id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
    name: payload.name,
    email: payload.email,
    status: "invited",
    roleId: payload.roleId,
    roleName: role?.name ?? "—",
    departmentId: payload.departmentId,
    departmentName: department?.name ?? "—",
    lastActiveAt: null,
    createdAt: new Date().toISOString(),
    mfaEnabled: false,
  };

  mockUsers.unshift(created);
  if (role) role.userCount += 1;
  return created;
}

function updateUserStatus(config: InternalAxiosRequestConfig): UserDto {
  const payload = JSON.parse((config.data as string) || "{}") as {
    userId: string;
    status: UserStatus;
  };

  const user = mockUsers.find((u) => u.id === payload.userId);
  if (!user) throw new Error("User not found");
  user.status = payload.status;
  return user;
}

function updateUserRole(config: InternalAxiosRequestConfig): UserDto {
  const payload = JSON.parse((config.data as string) || "{}") as {
    userId: string;
    roleId: string;
  };

  const user = mockUsers.find((u) => u.id === payload.userId);
  if (!user) throw new Error("User not found");

  const prevRole = mockRoles.find((r) => r.id === user.roleId);
  const nextRole = mockRoles.find((r) => r.id === payload.roleId);
  if (prevRole && prevRole.userCount > 0) prevRole.userCount -= 1;
  if (nextRole) nextRole.userCount += 1;

  user.roleId = payload.roleId;
  user.roleName = nextRole?.name ?? user.roleName;
  return user;
}

function listRoles(): RoleDto[] {
  return mockRoles;
}

function createRole(config: InternalAxiosRequestConfig): RoleDto {
  const payload = JSON.parse((config.data as string) || "{}") as {
    name: string;
    description: string;
    permissionIds: string[];
  };

  const created: RoleDto = {
    id: `role-${Math.floor(1000 + Math.random() * 9000)}`,
    name: payload.name,
    description: payload.description,
    isSystem: false,
    permissionIds: payload.permissionIds ?? [],
    userCount: 0,
    createdAt: new Date().toISOString(),
  };

  mockRoles.push(created);
  return created;
}

function updateRolePermissions(config: InternalAxiosRequestConfig): RoleDto {
  const payload = JSON.parse((config.data as string) || "{}") as {
    roleId: string;
    permissionIds: string[];
  };

  const role = mockRoles.find((r) => r.id === payload.roleId);
  if (!role) throw new Error("Role not found");
  role.permissionIds = payload.permissionIds;
  return role;
}

function deleteRole(config: InternalAxiosRequestConfig): { deleted: string } {
  const payload = JSON.parse((config.data as string) || "{}") as {
    roleId: string;
  };

  const index = mockRoles.findIndex((r) => r.id === payload.roleId);
  if (index !== -1 && !mockRoles[index].isSystem) {
    mockRoles.splice(index, 1);
  }
  return { deleted: payload.roleId };
}

function listPermissions() {
  return mockPermissions;
}

function listDepartments(): DepartmentDto[] {
  return mockDepartments;
}

function createDepartment(config: InternalAxiosRequestConfig): DepartmentDto {
  const payload = JSON.parse((config.data as string) || "{}") as {
    name: string;
    description: string;
    headName: string;
  };

  const created: DepartmentDto = {
    id: `dept-${Math.floor(1000 + Math.random() * 9000)}`,
    name: payload.name,
    description: payload.description,
    headName: payload.headName,
    memberCount: 0,
    teams: [],
  };

  mockDepartments.push(created);
  return created;
}

function listSessions() {
  return mockLoginSessions;
}

function revokeSession(config: InternalAxiosRequestConfig): { revoked: string } {
  const payload = JSON.parse((config.data as string) || "{}") as {
    sessionId: string;
  };

  const session = mockLoginSessions.find((s) => s.id === payload.sessionId);
  if (session) session.status = "revoked";
  return { revoked: payload.sessionId };
}

function listReviews() {
  return mockAccessReviews;
}

function decideReview(config: InternalAxiosRequestConfig) {
  const payload = JSON.parse((config.data as string) || "{}") as {
    reviewId: string;
    decision: Exclude<AccessReviewStatus, "pending">;
  };

  const review = mockAccessReviews.find((r) => r.id === payload.reviewId);
  if (!review) throw new Error("Review not found");
  review.status = payload.decision;
  return review;
}

/** Route table: `${METHOD} ${path}` -> handler. */
const routes: Record<string, Handler> = {
  [`GET ${adminBoardEndpoints.dashboardOverview}`]: () => mockDashboardOverview,
  [`GET ${adminBoardEndpoints.dashboardActivity}`]: () => mockActivityFeed,
  [`GET ${adminBoardEndpoints.verificationCases}`]: filterCases,
  [`POST ${adminBoardEndpoints.verificationCases}`]: createCase,
  [`POST ${adminBoardEndpoints.verificationBulkAssign}`]: bulkAssign,
  [`GET ${adminBoardEndpoints.assignees}`]: () => mockAssignees,

  // Users, Roles & Permissions
  [`GET ${adminBoardEndpoints.usersOverview}`]: usersOverview,
  [`GET ${adminBoardEndpoints.users}`]: listUsers,
  [`POST ${adminBoardEndpoints.users}`]: createUser,
  [`POST ${adminBoardEndpoints.userStatus}`]: updateUserStatus,
  [`POST ${adminBoardEndpoints.userRole}`]: updateUserRole,
  [`GET ${adminBoardEndpoints.roles}`]: listRoles,
  [`POST ${adminBoardEndpoints.roles}`]: createRole,
  [`DELETE ${adminBoardEndpoints.roles}`]: deleteRole,
  [`POST ${adminBoardEndpoints.rolePermissions}`]: updateRolePermissions,
  [`GET ${adminBoardEndpoints.permissions}`]: listPermissions,
  [`GET ${adminBoardEndpoints.departments}`]: listDepartments,
  [`POST ${adminBoardEndpoints.departments}`]: createDepartment,
  [`GET ${adminBoardEndpoints.loginSessions}`]: listSessions,
  [`POST ${adminBoardEndpoints.sessionRevoke}`]: revokeSession,
  [`GET ${adminBoardEndpoints.accessReviews}`]: listReviews,
  [`POST ${adminBoardEndpoints.accessReviewDecision}`]: decideReview,
};

export const mockAdapter: AxiosAdapter = (config) =>
  new Promise<AxiosResponse>((resolve, reject) => {
    const method = (config.method ?? "get").toUpperCase();
    const key = `${method} ${pathOf(config.url)}`;
    const handler = routes[key];

    const timer = setTimeout(() => {
      if (!handler) {
        reject(
          Object.assign(new Error(`No mock for ${key}`), {
            isAxiosError: true,
            config,
            response: { status: 404, statusText: "Not Found", data: null },
          }),
        );
        return;
      }

      resolve({
        data: handler(config),
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      });
    }, MOCK_LATENCY_MS);

    // Honor React Query's cancellation so aborted queries don't resolve.
    config.signal?.addEventListener?.("abort", () => {
      clearTimeout(timer);
      reject(
        Object.assign(new Error("canceled"), {
          code: "ERR_CANCELED",
          name: "CanceledError",
        }),
      );
    });
  });
