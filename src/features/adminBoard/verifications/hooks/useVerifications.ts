import { useQueryClient } from "@tanstack/react-query";

import { useServices } from "@/api/useServices";
import { queryKeys } from "@/api/query/queryKeys";
import { adminBoardEndpoints } from "@/api/endpoints";
import { mapVerificationList } from "@/features/adminBoard/verifications/services/verificationService";
import type {
  Assignee,
  BulkAssignDto,
  CreateVerificationDto,
  VerificationCaseDto,
  VerificationList,
  VerificationListDto,
} from "@/features/adminBoard/verifications/types/verification";

const LIST_STALE_TIME = 30_000;

/**
 * Fetches all verification cases. Search, filtering, sorting, and pagination
 * are handled client-side by the DataTable, so no query params are sent.
 */
export function useVerificationCases() {
  const { useGet } = useServices();

  return useGet<VerificationListDto, VerificationList>(
    queryKeys.verifications.list({}),
    adminBoardEndpoints.verificationCases,
    undefined,
    undefined,
    {
      select: mapVerificationList,
      staleTime: LIST_STALE_TIME,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  );
}

export function useAssignees() {
  const { useGet } = useServices();

  return useGet<Assignee[]>(
    queryKeys.verifications.assignees(),
    adminBoardEndpoints.assignees,
    undefined,
    undefined,
    { staleTime: 5 * 60_000 },
  );
}

export function useCreateVerification() {
  const queryClient = useQueryClient();
  const { useMutate } = useServices();

  return useMutate<VerificationCaseDto>({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.verifications.root(),
      });
    },
  });
}

export function useBulkAssign() {
  const queryClient = useQueryClient();
  const { useMutate } = useServices();

  return useMutate<{ updated: number }>({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.verifications.root(),
      });
    },
  });
}

/* ------------------------------------------------------------------ *
 * Helpers for building mutation params (keeps callers declarative).
 * ------------------------------------------------------------------ */

export function createVerificationParams(body: CreateVerificationDto) {
  return {
    url: adminBoardEndpoints.verificationCases,
    method: "POST" as const,
    body,
  };
}

export function bulkAssignParams(body: BulkAssignDto) {
  return {
    url: adminBoardEndpoints.verificationBulkAssign,
    method: "POST" as const,
    body,
  };
}
