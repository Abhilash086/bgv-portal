import axios from "axios";

export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

export const normalizeApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as
      { message?: string; detail?: string } | string | undefined;

    const responseMessage =
      typeof body === "string" ? body : (body?.message ?? body?.detail);

    return {
      message:
        responseMessage ?? error.message ?? "An unexpected API error occurred.",
      status: error.response?.status,
      details: error.response?.data,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "An unexpected error occurred." };
};
