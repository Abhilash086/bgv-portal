import { useQueryClient } from "@tanstack/react-query";

import { useServices } from "@/api/useServices";
import { queryKeys } from "@/api/query/queryKeys";
import { adminBoardEndpoints } from "@/api/endpoints";
import {
  mapAccessReviews,
  mapDepartments,
  mapLoginSessions,
  mapRoles,
  mapUserList,
} from "@/features/adminBoard/users/services/usersService";
import type {
  AccessReview,
  AccessReviewDto,
  AccessReviewStatus,
  CreateDepartmentDto,
  CreateRoleDto,
  CreateUserDto,
  Department,
  DepartmentDto,
  LoginSession,
  LoginSessionDto,
  Permission,
  Role,
  RoleDto,
  UpdateRolePermissionsDto,
  UpdateUserRoleDto,
  UpdateUserStatusDto,
  User,
  UserList,
  UserListDto,
  UsersOverview,
} from "@/features/adminBoard/users/types/users";

const LIST_STALE_TIME = 30_000;

/* ------------------------------------------------------------------ *
 * Queries
 * ------------------------------------------------------------------ */

export function useUsersOverview() {
  const { useGet } = useServices();

  return useGet<UsersOverview>(
    queryKeys.access.overview(),
    adminBoardEndpoints.usersOverview,
    undefined,
    undefined,
    {
      staleTime: LIST_STALE_TIME,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  );
}

export function useUsers() {
  const { useGet } = useServices();

  return useGet<UserListDto, UserList>(
    queryKeys.access.users(),
    adminBoardEndpoints.users,
    undefined,
    undefined,
    {
      select: mapUserList,
      staleTime: LIST_STALE_TIME,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  );
}

export function useRoles() {
  const { useGet } = useServices();

  return useGet<RoleDto[], Role[]>(
    queryKeys.access.roles(),
    adminBoardEndpoints.roles,
    undefined,
    undefined,
    {
      select: mapRoles,
      staleTime: LIST_STALE_TIME,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  );
}

export function usePermissions() {
  const { useGet } = useServices();

  return useGet<Permission[]>(
    queryKeys.access.permissions(),
    adminBoardEndpoints.permissions,
    undefined,
    undefined,
    { staleTime: 10 * 60_000 },
  );
}

export function useDepartments() {
  const { useGet } = useServices();

  return useGet<DepartmentDto[], Department[]>(
    queryKeys.access.departments(),
    adminBoardEndpoints.departments,
    undefined,
    undefined,
    {
      select: mapDepartments,
      staleTime: LIST_STALE_TIME,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  );
}

export function useLoginSessions() {
  const { useGet } = useServices();

  return useGet<LoginSessionDto[], LoginSession[]>(
    queryKeys.access.sessions(),
    adminBoardEndpoints.loginSessions,
    undefined,
    undefined,
    {
      select: mapLoginSessions,
      staleTime: LIST_STALE_TIME,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  );
}

export function useAccessReviews() {
  const { useGet } = useServices();

  return useGet<AccessReviewDto[], AccessReview[]>(
    queryKeys.access.reviews(),
    adminBoardEndpoints.accessReviews,
    undefined,
    undefined,
    {
      select: mapAccessReviews,
      staleTime: LIST_STALE_TIME,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  );
}

/* ------------------------------------------------------------------ *
 * Mutations — each invalidates the whole access tree so counts and
 * related lists (overview KPIs, role userCount, etc.) stay in sync.
 * ------------------------------------------------------------------ */

function useAccessMutation<T>() {
  const queryClient = useQueryClient();
  const { useMutate } = useServices();

  return useMutate<T>({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.access.root() });
    },
  });
}

export function useCreateUser() {
  return useAccessMutation<User>();
}

export function useUpdateUserStatus() {
  return useAccessMutation<User>();
}

export function useUpdateUserRole() {
  return useAccessMutation<User>();
}

export function useCreateRole() {
  return useAccessMutation<Role>();
}

export function useUpdateRolePermissions() {
  return useAccessMutation<Role>();
}

export function useDeleteRole() {
  return useAccessMutation<{ deleted: string }>();
}

export function useCreateDepartment() {
  return useAccessMutation<Department>();
}

export function useRevokeSession() {
  return useAccessMutation<{ revoked: string }>();
}

export function useDecideAccessReview() {
  return useAccessMutation<AccessReview>();
}

/* ------------------------------------------------------------------ *
 * Mutation param builders (keep call sites declarative).
 * ------------------------------------------------------------------ */

export function createUserParams(body: CreateUserDto) {
  return { url: adminBoardEndpoints.users, method: "POST" as const, body };
}

export function updateUserStatusParams(body: UpdateUserStatusDto) {
  return { url: adminBoardEndpoints.userStatus, method: "POST" as const, body };
}

export function updateUserRoleParams(body: UpdateUserRoleDto) {
  return { url: adminBoardEndpoints.userRole, method: "POST" as const, body };
}

export function createRoleParams(body: CreateRoleDto) {
  return { url: adminBoardEndpoints.roles, method: "POST" as const, body };
}

export function updateRolePermissionsParams(body: UpdateRolePermissionsDto) {
  return {
    url: adminBoardEndpoints.rolePermissions,
    method: "POST" as const,
    body,
  };
}

export function deleteRoleParams(roleId: string) {
  return {
    url: adminBoardEndpoints.roles,
    method: "DELETE" as const,
    body: { roleId },
  };
}

export function createDepartmentParams(body: CreateDepartmentDto) {
  return {
    url: adminBoardEndpoints.departments,
    method: "POST" as const,
    body,
  };
}

export function revokeSessionParams(sessionId: string) {
  return {
    url: adminBoardEndpoints.sessionRevoke,
    method: "POST" as const,
    body: { sessionId },
  };
}

export function decideAccessReviewParams(
  reviewId: string,
  decision: Exclude<AccessReviewStatus, "pending">,
) {
  return {
    url: adminBoardEndpoints.accessReviewDecision,
    method: "POST" as const,
    body: { reviewId, decision },
  };
}
