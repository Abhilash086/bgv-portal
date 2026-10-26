/**
 * Users, Roles & Permissions domain types.
 *
 * DTO types mirror the API wire shape; UI model types are what components
 * consume. The service maps DTO -> UI so backend changes touch one file.
 */

/* ------------------------------------------------------------------ *
 * Shared enums
 * ------------------------------------------------------------------ */

export type UserStatus = "active" | "inactive" | "invited" | "suspended";

export type SessionStatus = "active" | "expired" | "revoked";

export type AccessReviewStatus = "pending" | "approved" | "revoked";

/* ------------------------------------------------------------------ *
 * Permissions
 * ------------------------------------------------------------------ */

/** A single permission, grouped into a module (e.g. "Verifications"). */
export type Permission = {
  id: string;
  module: string;
  label: string;
  description: string;
};

/* ------------------------------------------------------------------ *
 * Roles
 * ------------------------------------------------------------------ */

export type RoleDto = {
  id: string;
  name: string;
  description: string;
  /** True for built-in roles that cannot be deleted. */
  isSystem: boolean;
  /** Permission ids granted to this role. */
  permissionIds: string[];
  userCount: number;
  createdAt: string;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissionIds: string[];
  permissionCount: number;
  userCount: number;
  createdAt: string;
  createdLabel: string;
};

export type CreateRoleDto = {
  name: string;
  description: string;
  permissionIds: string[];
};

export type UpdateRolePermissionsDto = {
  roleId: string;
  permissionIds: string[];
};

/* ------------------------------------------------------------------ *
 * Departments & teams
 * ------------------------------------------------------------------ */

export type TeamDto = {
  id: string;
  name: string;
  leadName: string;
  memberCount: number;
};

export type DepartmentDto = {
  id: string;
  name: string;
  description: string;
  headName: string;
  memberCount: number;
  teams: TeamDto[];
};

export type Team = TeamDto;

export type Department = {
  id: string;
  name: string;
  description: string;
  headName: string;
  memberCount: number;
  teamCount: number;
  teams: Team[];
};

export type CreateDepartmentDto = {
  name: string;
  description: string;
  headName: string;
};

/* ------------------------------------------------------------------ *
 * Users
 * ------------------------------------------------------------------ */

export type UserDto = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  roleId: string;
  roleName: string;
  departmentId: string;
  departmentName: string;
  /** ISO timestamp or null if the user has never signed in. */
  lastActiveAt: string | null;
  createdAt: string;
  mfaEnabled: boolean;
};

export type UserListDto = {
  users: UserDto[];
  total: number;
};

export type User = {
  id: string;
  name: string;
  initials: string;
  email: string;
  status: UserStatus;
  roleId: string;
  roleName: string;
  departmentId: string;
  departmentName: string;
  lastActiveAt: string | null;
  lastActiveLabel: string;
  createdAt: string;
  createdLabel: string;
  mfaEnabled: boolean;
};

export type UserList = {
  users: User[];
  total: number;
};

export type CreateUserDto = {
  name: string;
  email: string;
  roleId: string;
  departmentId: string;
};

export type UpdateUserStatusDto = {
  userId: string;
  status: UserStatus;
};

export type UpdateUserRoleDto = {
  userId: string;
  roleId: string;
};

/* ------------------------------------------------------------------ *
 * Login sessions
 * ------------------------------------------------------------------ */

export type LoginSessionDto = {
  id: string;
  userId: string;
  userName: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  status: SessionStatus;
  current: boolean;
  lastActiveAt: string;
  createdAt: string;
};

export type LoginSession = {
  id: string;
  userId: string;
  userName: string;
  userInitials: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  status: SessionStatus;
  current: boolean;
  lastActiveAt: string;
  lastActiveLabel: string;
  createdAt: string;
  createdLabel: string;
};

/* ------------------------------------------------------------------ *
 * Access reviews
 * ------------------------------------------------------------------ */

export type AccessReviewDto = {
  id: string;
  userName: string;
  roleName: string;
  resource: string;
  status: AccessReviewStatus;
  reviewer: string;
  dueDate: string;
};

export type AccessReview = {
  id: string;
  userName: string;
  userInitials: string;
  roleName: string;
  resource: string;
  status: AccessReviewStatus;
  reviewer: string;
  dueDate: string;
  dueLabel: string;
  isOverdue: boolean;
};

/* ------------------------------------------------------------------ *
 * Overview (summary counts shown as KPI stats)
 * ------------------------------------------------------------------ */

export type UsersOverviewDto = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  invitedUsers: number;
  roleCount: number;
  departmentCount: number;
  activeSessions: number;
  pendingReviews: number;
};

export type UsersOverview = UsersOverviewDto;
