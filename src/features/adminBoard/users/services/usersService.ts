import { formatRelativeTime } from "@/features/adminBoard/shared/utils/format";
import type {
  AccessReview,
  AccessReviewDto,
  Department,
  DepartmentDto,
  LoginSession,
  LoginSessionDto,
  Role,
  RoleDto,
  User,
  UserDto,
  UserList,
  UserListDto,
} from "@/features/adminBoard/users/types/users";

/**
 * Pure DTO -> UI mappers for the Users, Roles & Permissions feature. Used as
 * React Query `select` functions by the hooks. Mutations run server-side (or
 * via the mock adapter in dev), so they're not here.
 */

export function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* ------------------------------------------------------------------ *
 * Users
 * ------------------------------------------------------------------ */

export function mapUser(dto: UserDto): User {
  return {
    id: dto.id,
    name: dto.name,
    initials: initialsOf(dto.name),
    email: dto.email,
    status: dto.status,
    roleId: dto.roleId,
    roleName: dto.roleName,
    departmentId: dto.departmentId,
    departmentName: dto.departmentName,
    lastActiveAt: dto.lastActiveAt,
    lastActiveLabel: dto.lastActiveAt
      ? formatRelativeTime(dto.lastActiveAt)
      : "Never",
    createdAt: dto.createdAt,
    createdLabel: formatRelativeTime(dto.createdAt),
    mfaEnabled: dto.mfaEnabled,
  };
}

export function mapUserList(dto: UserListDto): UserList {
  return {
    users: dto.users.map(mapUser),
    total: dto.total,
  };
}

/* ------------------------------------------------------------------ *
 * Roles
 * ------------------------------------------------------------------ */

export function mapRole(dto: RoleDto): Role {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    isSystem: dto.isSystem,
    permissionIds: dto.permissionIds,
    permissionCount: dto.permissionIds.length,
    userCount: dto.userCount,
    createdAt: dto.createdAt,
    createdLabel: formatRelativeTime(dto.createdAt),
  };
}

export function mapRoles(dtos: RoleDto[]): Role[] {
  return dtos.map(mapRole);
}

/* ------------------------------------------------------------------ *
 * Departments
 * ------------------------------------------------------------------ */

export function mapDepartment(dto: DepartmentDto): Department {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    headName: dto.headName,
    memberCount: dto.memberCount,
    teamCount: dto.teams.length,
    teams: dto.teams,
  };
}

export function mapDepartments(dtos: DepartmentDto[]): Department[] {
  return dtos.map(mapDepartment);
}

/* ------------------------------------------------------------------ *
 * Sessions
 * ------------------------------------------------------------------ */

export function mapLoginSession(dto: LoginSessionDto): LoginSession {
  return {
    id: dto.id,
    userId: dto.userId,
    userName: dto.userName,
    userInitials: initialsOf(dto.userName),
    device: dto.device,
    browser: dto.browser,
    ipAddress: dto.ipAddress,
    location: dto.location,
    status: dto.status,
    current: dto.current,
    lastActiveAt: dto.lastActiveAt,
    lastActiveLabel: formatRelativeTime(dto.lastActiveAt),
    createdAt: dto.createdAt,
    createdLabel: formatRelativeTime(dto.createdAt),
  };
}

export function mapLoginSessions(dtos: LoginSessionDto[]): LoginSession[] {
  return dtos.map(mapLoginSession);
}

/* ------------------------------------------------------------------ *
 * Access reviews
 * ------------------------------------------------------------------ */

export function mapAccessReview(dto: AccessReviewDto): AccessReview {
  const due = new Date(dto.dueDate).getTime();
  const isOverdue =
    !Number.isNaN(due) && due < Date.now() && dto.status === "pending";

  return {
    id: dto.id,
    userName: dto.userName,
    userInitials: initialsOf(dto.userName),
    roleName: dto.roleName,
    resource: dto.resource,
    status: dto.status,
    reviewer: dto.reviewer,
    dueDate: dto.dueDate,
    dueLabel: formatRelativeTime(dto.dueDate),
    isOverdue,
  };
}

export function mapAccessReviews(dtos: AccessReviewDto[]): AccessReview[] {
  return dtos.map(mapAccessReview);
}
