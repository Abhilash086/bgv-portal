import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";

import axiosClient from "./axiosClient";
import type { ApiError } from "./apiErrors";

type HttpMethod = "POST" | "PUT" | "PATCH" | "DELETE";

type MutationParams = {
  url: string;
  method: HttpMethod;
  body?: unknown;
  config?: AxiosRequestConfig;
};

export function useServices() {
  /**
   * Generic GET query.
   *
   * @typeParam T - The raw response shape returned by the API.
   * @typeParam R - The shape consumed by the component (defaults to T). Use the
   *   `select` option to map `T -> R` (e.g. DTO -> UI model).
   */
  const useGet = <T = unknown, R = T>(
    key: readonly unknown[],
    url: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig,
    options?: Omit<UseQueryOptions<T, ApiError, R>, "queryKey" | "queryFn">,
  ) =>
    useQuery<T, ApiError, R>({
      queryKey: [...key, params ?? {}],
      queryFn: async ({ signal }) => {
        const { data } = await axiosClient.get<T>(url, {
          ...config,
          params,
          signal,
        });

        return data;
      },
      ...options,
    });

  const useMutate = <T = void>(
    options?: Omit<UseMutationOptions<T, ApiError, MutationParams>, "mutationFn">,
  ) =>
    useMutation<T, ApiError, MutationParams>({
      mutationFn: async ({ url, method, body, config }) => {
        const { data } = await axiosClient.request<T>({
          ...config,
          url,
          method,
          data: body,
        });

        return data;
      },
      ...options,
    });

  return { useGet, useMutate };
}
